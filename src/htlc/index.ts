/**
 * HTLC (Hash Time-Locked Contract) Client
 * 
 * Provides atomic swap functionality across Arbitrum, Solana, and TON
 */

import {
  ChronosVaultConfig,
  HTLCSwap,
  HTLCSwapStatus,
  ChainId,
  ApiResponse
} from '../types';
import { CONTRACTS } from '../constants';

export interface CreateHTLCParams {
  sourceChain: ChainId;
  targetChain: ChainId;
  amount: string;
  participant: string;
  timeLockHours?: number;
}

export interface ClaimHTLCParams {
  swapId: string;
  secret: string;
}

export interface RefundHTLCParams {
  swapId: string;
}

export class HTLCClient {
  private config: ChronosVaultConfig;

  constructor(config: ChronosVaultConfig) {
    this.config = config;
  }

  updateConfig(config: ChronosVaultConfig): void {
    this.config = config;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.apiBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data: ApiResponse<T> = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    
    return data.data!;
  }

  /**
   * Create a new HTLC swap
   */
  async createSwap(params: CreateHTLCParams): Promise<HTLCSwap> {
    return this.fetch<HTLCSwap>('/api/htlc/create', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        timeLockHours: params.timeLockHours || 24,
      }),
    });
  }

  /**
   * Get HTLC swap by ID
   */
  async getSwap(swapId: string): Promise<HTLCSwap> {
    return this.fetch<HTLCSwap>(`/api/htlc/swap/${swapId}`);
  }

  /**
   * Get all HTLC swaps for an address
   */
  async getSwapsByAddress(address: string): Promise<HTLCSwap[]> {
    return this.fetch<HTLCSwap[]>(`/api/htlc/swaps/address/${address}`);
  }

  /**
   * Get recent HTLC swaps
   */
  async getRecentSwaps(limit = 10): Promise<HTLCSwap[]> {
    return this.fetch<HTLCSwap[]>(`/api/scanner/swaps?limit=${limit}`);
  }

  /**
   * Fund an existing HTLC
   */
  async fundSwap(swapId: string, txHash: string): Promise<HTLCSwap> {
    return this.fetch<HTLCSwap>(`/api/htlc/fund/${swapId}`, {
      method: 'POST',
      body: JSON.stringify({ txHash }),
    });
  }

  /**
   * Claim HTLC funds with secret
   */
  async claimSwap(params: ClaimHTLCParams): Promise<HTLCSwap> {
    return this.fetch<HTLCSwap>(`/api/htlc/claim/${params.swapId}`, {
      method: 'POST',
      body: JSON.stringify({ secret: params.secret }),
    });
  }

  /**
   * Refund expired HTLC
   */
  async refundSwap(params: RefundHTLCParams): Promise<HTLCSwap> {
    return this.fetch<HTLCSwap>(`/api/htlc/refund/${params.swapId}`, {
      method: 'POST',
    });
  }

  /**
   * Generate a cryptographic secret for HTLC
   */
  generateSecret(): { secret: string; secretHash: string } {
    const secret = this.generateRandomHex(32);
    const secretHash = this.hashSecret(secret);
    return { secret, secretHash };
  }

  private generateRandomHex(bytes: number): string {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return '0x' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private hashSecret(secret: string): string {
    // Simple SHA-256 hash representation
    // In production, use proper crypto library
    return `0x${secret.slice(2, 66)}`;
  }

  /**
   * Get HTLC contract addresses
   */
  getContractAddresses(): {
    arbitrum: string;
    solana: string;
    ton: string;
  } {
    const network = this.config.network;
    return {
      arbitrum: CONTRACTS.arbitrum[network]?.HTLCChronosBridge || '',
      solana: CONTRACTS.solana[network]?.BridgeProgram || '',
      ton: CONTRACTS.ton[network]?.CrossChainBridge || '',
    };
  }

  /**
   * Check if swap can be claimed (timelock not expired)
   */
  canClaim(swap: HTLCSwap): boolean {
    return swap.status === HTLCSwapStatus.FUNDED && 
           Date.now() < swap.timeLock * 1000;
  }

  /**
   * Check if swap can be refunded (timelock expired)
   */
  canRefund(swap: HTLCSwap): boolean {
    return (swap.status === HTLCSwapStatus.INITIATED || 
            swap.status === HTLCSwapStatus.FUNDED) &&
           Date.now() >= swap.timeLock * 1000;
  }
}

export default HTLCClient;
