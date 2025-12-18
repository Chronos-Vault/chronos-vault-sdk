/**
 * Bridge Client
 * 
 * Provides cross-chain bridge functionality between Arbitrum, Solana, and TON
 */

import {
  ChronosVaultConfig,
  BridgeTransaction,
  BridgeTransactionStatus,
  BridgeStatus,
  ChainId,
  ApiResponse
} from '../types';
import { CONTRACTS } from '../constants';

export * from './rpc';

export interface TransferParams {
  sourceChain: ChainId;
  targetChain: ChainId;
  amount: string;
  assetType: string;
  senderAddress: string;
  recipientAddress: string;
}

export interface BridgeFees {
  baseFee: string;
  percentageFee: number;
  estimatedGas: string;
  totalFee: string;
}

export class BridgeClient {
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
   * Get all bridge statuses
   */
  async getBridgeStatuses(): Promise<BridgeStatus[]> {
    return this.fetch<BridgeStatus[]>('/api/bridge/status');
  }

  /**
   * Get status for a specific bridge route
   */
  async getBridgeStatus(sourceChain: ChainId, targetChain: ChainId): Promise<BridgeStatus> {
    return this.fetch<BridgeStatus>(`/api/bridge/status/${sourceChain}/${targetChain}`);
  }

  /**
   * Initialize a bridge route
   */
  async initializeBridge(sourceChain: ChainId, targetChain: ChainId): Promise<{
    bridgeId: string;
    status: string;
  }> {
    return this.fetch('/api/bridge/initialize', {
      method: 'POST',
      body: JSON.stringify({ sourceChain, targetChain }),
    });
  }

  /**
   * Transfer assets across chains
   */
  async transfer(params: TransferParams): Promise<BridgeTransaction> {
    return this.fetch<BridgeTransaction>('/api/bridge/transfer', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get transfer by ID
   */
  async getTransfer(transferId: string): Promise<BridgeTransaction> {
    return this.fetch<BridgeTransaction>(`/api/bridge/transfer/${transferId}`);
  }

  /**
   * Get all transfers for an address
   */
  async getTransfersByAddress(address: string): Promise<BridgeTransaction[]> {
    return this.fetch<BridgeTransaction[]>(`/api/bridge/transfers/address/${address}`);
  }

  /**
   * Get recent bridge transactions
   */
  async getRecentTransfers(limit = 10): Promise<BridgeTransaction[]> {
    return this.fetch<BridgeTransaction[]>(`/api/bridge/transactions?limit=${limit}`);
  }

  /**
   * Estimate bridge fees
   */
  async estimateFees(params: {
    sourceChain: ChainId;
    targetChain: ChainId;
    amount: string;
    assetType: string;
  }): Promise<BridgeFees> {
    return this.fetch<BridgeFees>('/api/bridge/estimate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get supported assets for bridging
   */
  async getSupportedAssets(): Promise<Array<{
    symbol: string;
    name: string;
    chains: ChainId[];
    decimals: Record<ChainId, number>;
  }>> {
    return this.fetch('/api/bridge/assets');
  }

  /**
   * Get bridge contract addresses
   */
  getContractAddresses(): {
    arbitrum: { relay: string; exit: string };
    solana: string;
    ton: string;
  } {
    const network = this.config.network;
    const arbContracts = CONTRACTS.arbitrum[network] as Record<string, string>;
    const solContracts = CONTRACTS.solana[network] as Record<string, string>;
    const tonContracts = CONTRACTS.ton[network] as Record<string, string>;
    
    return {
      arbitrum: {
        relay: arbContracts?.CrossChainMessageRelay || '',
        exit: arbContracts?.TrinityExitGateway || '',
      },
      solana: solContracts?.BridgeProgram || '',
      ton: tonContracts?.CrossChainBridge || '',
    };
  }

  /**
   * Get available bridge routes
   */
  getAvailableRoutes(): Array<{
    source: ChainId;
    target: ChainId;
    bidirectional: boolean;
  }> {
    return [
      { source: 'arbitrum', target: 'solana', bidirectional: true },
      { source: 'arbitrum', target: 'ton', bidirectional: true },
      { source: 'solana', target: 'ton', bidirectional: true },
    ];
  }

  /**
   * Check if transfer is complete
   */
  isTransferComplete(transfer: BridgeTransaction): boolean {
    return transfer.status === BridgeTransactionStatus.COMPLETED;
  }

  /**
   * Check if transfer failed
   */
  isTransferFailed(transfer: BridgeTransaction): boolean {
    return transfer.status === BridgeTransactionStatus.FAILED;
  }
}

export default BridgeClient;
