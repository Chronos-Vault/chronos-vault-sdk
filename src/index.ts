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

import { TrinityProtocolClient } from './trinity';
import { HTLCClient } from './htlc';
import { VaultClient } from './vault';
import { BridgeClient } from './bridge';
import { ChronosVaultConfig, DEFAULT_CONFIG } from './types';

/**
 * Main Chronos Vault SDK class
 * Provides unified access to all protocol features
 */
export class ChronosVaultSDK {
  public readonly trinity: TrinityProtocolClient;
  public readonly htlc: HTLCClient;
  public readonly vault: VaultClient;
  public readonly bridge: BridgeClient;
  
  private config: ChronosVaultConfig;

  constructor(config: Partial<ChronosVaultConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.trinity = new TrinityProtocolClient(this.config);
    this.htlc = new HTLCClient(this.config);
    this.vault = new VaultClient(this.config);
    this.bridge = new BridgeClient(this.config);
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
  }

  /**
   * Get SDK version
   */
  static get version(): string {
    return '1.0.0';
  }
}

export default ChronosVaultSDK;
