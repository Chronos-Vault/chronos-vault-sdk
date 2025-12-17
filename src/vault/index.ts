/**
 * Vault Client
 * 
 * Provides access to ChronosVault secure storage functionality
 */

import {
  ChronosVaultConfig,
  Vault,
  VaultConfig,
  ChainId,
  ApiResponse
} from '../types';
import { CONTRACTS } from '../constants';

export interface CreateVaultParams {
  name: string;
  vaultType: 'standard' | 'erc4626' | 'timelock' | 'multisig';
  chain: ChainId;
  depositAmount: string;
  beneficiaries?: string[];
  timeLockDuration?: number;
  requiredSignatures?: number;
}

export interface DepositParams {
  vaultId: string;
  amount: string;
  txHash?: string;
}

export interface WithdrawParams {
  vaultId: string;
  amount: string;
  recipient: string;
}

export class VaultClient {
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
   * Create a new vault
   */
  async createVault(params: CreateVaultParams): Promise<Vault> {
    return this.fetch<Vault>('/api/vaults/create', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get vault by ID
   */
  async getVault(vaultId: string): Promise<Vault> {
    return this.fetch<Vault>(`/api/vaults/${vaultId}`);
  }

  /**
   * Get all vaults for an owner
   */
  async getVaultsByOwner(ownerAddress: string): Promise<Vault[]> {
    return this.fetch<Vault[]>(`/api/vaults/owner/${ownerAddress}`);
  }

  /**
   * Get recent vault operations
   */
  async getRecentVaultOperations(limit = 10): Promise<Vault[]> {
    return this.fetch<Vault[]>(`/api/scanner/vaults?limit=${limit}`);
  }

  /**
   * Deposit funds into a vault
   */
  async deposit(params: DepositParams): Promise<Vault> {
    return this.fetch<Vault>(`/api/vaults/${params.vaultId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({
        amount: params.amount,
        txHash: params.txHash,
      }),
    });
  }

  /**
   * Withdraw funds from a vault
   */
  async withdraw(params: WithdrawParams): Promise<Vault> {
    return this.fetch<Vault>(`/api/vaults/${params.vaultId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({
        amount: params.amount,
        recipient: params.recipient,
      }),
    });
  }

  /**
   * Lock a vault (for timelock vaults)
   */
  async lockVault(vaultId: string, unlockTime: number): Promise<Vault> {
    return this.fetch<Vault>(`/api/vaults/${vaultId}/lock`, {
      method: 'POST',
      body: JSON.stringify({ unlockTime }),
    });
  }

  /**
   * Unlock a vault (requires timelock expiry or multisig approval)
   */
  async unlockVault(vaultId: string): Promise<Vault> {
    return this.fetch<Vault>(`/api/vaults/${vaultId}/unlock`, {
      method: 'POST',
    });
  }

  /**
   * Get vault contract addresses
   */
  getContractAddresses(): {
    arbitrum: string;
    solana: string;
    ton: string;
  } {
    const network = this.config.network;
    return {
      arbitrum: CONTRACTS.arbitrum[network]?.ChronosVaultOptimized || '',
      solana: '', // Vault program on Solana
      ton: CONTRACTS.ton[network]?.ChronosVault || '',
    };
  }

  /**
   * Get available vault types
   */
  getVaultTypes(): Array<{
    type: string;
    name: string;
    description: string;
    features: string[];
  }> {
    return [
      {
        type: 'standard',
        name: 'Standard Vault',
        description: 'Basic secure storage with Trinity consensus protection',
        features: ['2-of-3 consensus', 'Cross-chain verification', 'Emergency recovery'],
      },
      {
        type: 'erc4626',
        name: 'Investment Vault',
        description: 'ERC-4626 compliant vault for yield strategies',
        features: ['Yield optimization', 'Auto-compounding', 'Standardized interface'],
      },
      {
        type: 'timelock',
        name: 'Time-Lock Vault',
        description: 'Vault with configurable time-based unlock conditions',
        features: ['VDF time-locks', 'Scheduled releases', 'Inheritance planning'],
      },
      {
        type: 'multisig',
        name: 'Multi-Signature Vault',
        description: 'Vault requiring multiple signers for operations',
        features: ['M-of-N signatures', 'Role-based access', 'Corporate treasury'],
      },
    ];
  }

  /**
   * Check if vault can be unlocked
   */
  canUnlock(vault: Vault): boolean {
    if (vault.status !== 'locked') return false;
    if (!vault.unlockAt) return true;
    return Date.now() >= new Date(vault.unlockAt).getTime();
  }
}

export default VaultClient;
