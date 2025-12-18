/**
 * @chronos-vault/sdk
 * 
 * Official TypeScript/JavaScript SDK for Chronos Vault and Trinity Protocol
 * 
 * Trinity Protocol provides mathematically provable 2-of-3 consensus verification
 * across Arbitrum, Solana, and TON blockchains.
 * 
 * @packageDocumentation
 */

export * from './types';
export * from './constants';
export * from './trinity';
export * from './htlc';
export * from './vault';
export * from './bridge';
export * from './errors';
export * from './providers';
export * from './abis';

import { TrinityProtocolClient } from './trinity';
import { HTLCClient } from './htlc';
import { VaultClient } from './vault';
import { BridgeClient, BridgeRPCClient } from './bridge';
import { TrinityRPCClient } from './trinity/rpc';
import { HTLCRPCClient } from './htlc/rpc';
import { VaultRPCClient } from './vault/rpc';
import { MultiChainProvider } from './providers';
import { ChronosVaultConfig, DEFAULT_CONFIG, SDKMode, RPCConfig } from './types';

/**
 * Main Chronos Vault SDK class
 * Provides unified access to all protocol features
 * Supports both REST API and direct RPC modes
 */
export class ChronosVaultSDK {
  public readonly trinity: TrinityProtocolClient;
  public readonly htlc: HTLCClient;
  public readonly vault: VaultClient;
  public readonly bridge: BridgeClient;
  
  public trinityRPC?: TrinityRPCClient;
  public htlcRPC?: HTLCRPCClient;
  public vaultRPC?: VaultRPCClient;
  public bridgeRPC?: BridgeRPCClient;
  public providers?: MultiChainProvider;
  
  private config: ChronosVaultConfig;
  private mode: SDKMode;

  constructor(config: Partial<ChronosVaultConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.mode = this.config.mode || 'api';
    
    this.trinity = new TrinityProtocolClient(this.config);
    this.htlc = new HTLCClient(this.config);
    this.vault = new VaultClient(this.config);
    this.bridge = new BridgeClient(this.config);

    if ((this.mode === 'rpc' || this.mode === 'hybrid') && this.config.rpc) {
      this.initializeRPCClients(this.config.rpc);
    }
  }

  private initializeRPCClients(rpcConfig: RPCConfig): void {
    this.providers = new MultiChainProvider(rpcConfig);
    
    if (rpcConfig.arbitrum || rpcConfig.solana || rpcConfig.ton) {
      this.trinityRPC = new TrinityRPCClient(rpcConfig);
    }
    
    if (rpcConfig.arbitrum) {
      this.htlcRPC = new HTLCRPCClient(rpcConfig);
      this.vaultRPC = new VaultRPCClient(rpcConfig);
      this.bridgeRPC = new BridgeRPCClient(rpcConfig);
    }
  }

  /**
   * Check if RPC mode is enabled
   */
  isRPCEnabled(): boolean {
    return this.mode === 'rpc' || this.mode === 'hybrid';
  }

  /**
   * Get the current SDK mode
   */
  getMode(): SDKMode {
    return this.mode;
  }

  /**
   * Get the current SDK configuration
   */
  getConfig(): ChronosVaultConfig {
    return { ...this.config };
  }

  /**
   * Update SDK configuration
   */
  updateConfig(config: Partial<ChronosVaultConfig>): void {
    this.config = { ...this.config, ...config };
    this.trinity.updateConfig(this.config);
    this.htlc.updateConfig(this.config);
    this.vault.updateConfig(this.config);
    this.bridge.updateConfig(this.config);
    
    if (config.mode) {
      this.mode = config.mode;
    }
    
    if (config.rpc && this.isRPCEnabled()) {
      this.initializeRPCClients(config.rpc);
    }
  }

  /**
   * Get multi-chain connection status
   */
  async getChainStatus(): Promise<{
    arbitrum: { connected: boolean; blockNumber?: number };
    solana: { connected: boolean; slot?: number };
    ton: { connected: boolean };
  }> {
    if (this.trinityRPC) {
      return this.trinityRPC.getMultiChainStatus();
    }
    
    return {
      arbitrum: { connected: false },
      solana: { connected: false },
      ton: { connected: false }
    };
  }

  /**
   * Get SDK version
   */
  static get version(): string {
    return '1.1.0';
  }
}

export { TrinityRPCClient } from './trinity/rpc';
export { HTLCRPCClient } from './htlc/rpc';
export { VaultRPCClient } from './vault/rpc';

export default ChronosVaultSDK;
