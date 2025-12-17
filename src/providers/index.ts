/**
 * Multi-chain Provider Exports
 */

export * from './arbitrum';
export * from './solana';
export * from './ton';

import { ArbitrumProvider, ArbitrumProviderConfig } from './arbitrum';
import { SolanaProvider, SolanaProviderConfig } from './solana';
import { TonProvider, TonProviderConfig } from './ton';

export interface MultiChainProviderConfig {
  arbitrum?: ArbitrumProviderConfig;
  solana?: SolanaProviderConfig;
  ton?: TonProviderConfig;
}

export class MultiChainProvider {
  public arbitrum?: ArbitrumProvider;
  public solana?: SolanaProvider;
  public ton?: TonProvider;

  constructor(config: MultiChainProviderConfig) {
    if (config.arbitrum) {
      this.arbitrum = new ArbitrumProvider(config.arbitrum);
    }
    if (config.solana) {
      this.solana = new SolanaProvider(config.solana);
    }
    if (config.ton) {
      this.ton = new TonProvider(config.ton);
    }
  }

  async getChainStatuses(): Promise<{
    arbitrum?: { connected: boolean; blockNumber?: number };
    solana?: { connected: boolean; slot?: number };
    ton?: { connected: boolean };
  }> {
    const statuses: any = {};

    if (this.arbitrum) {
      try {
        const blockNumber = await this.arbitrum.getBlockNumber();
        statuses.arbitrum = { connected: true, blockNumber };
      } catch {
        statuses.arbitrum = { connected: false };
      }
    }

    if (this.solana) {
      try {
        const slot = await this.solana.getSlot();
        statuses.solana = { connected: true, slot };
      } catch {
        statuses.solana = { connected: false };
      }
    }

    if (this.ton) {
      try {
        statuses.ton = { connected: true };
      } catch {
        statuses.ton = { connected: false };
      }
    }

    return statuses;
  }
}

export default MultiChainProvider;
