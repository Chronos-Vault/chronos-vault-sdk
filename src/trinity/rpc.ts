/**
 * Trinity Protocol RPC Client
 * Direct blockchain integration for consensus operations
 */

import { ArbitrumProvider } from '../providers/arbitrum';
import { SolanaProvider } from '../providers/solana';
import { TonProvider } from '../providers/ton';
import { TRINITY_CONSENSUS_VERIFIER_ABI, TRINITY_CONSENSUS_VERIFIER_ADDRESS } from '../abis/TrinityConsensusVerifier';
import { RPCConfig } from '../types';

class SDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SDKError';
  }
}

class ConsensusError extends Error {
  constructor(message: string, public operationId?: string, public confirmations?: number) {
    super(message);
    this.name = 'ConsensusError';
  }
}

export interface OperationState {
  chainConfirmations: number;
  arbitrumConfirmed: boolean;
  solanaConfirmed: boolean;
  tonConfirmed: boolean;
  expiresAt: number;
  executed: boolean;
}

export class TrinityRPCClient {
  private arbitrum?: ArbitrumProvider;
  private solana?: SolanaProvider;
  private ton?: TonProvider;

  constructor(config: RPCConfig) {
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

  async getConsensusThreshold(): Promise<number> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    const result = await this.arbitrum.callContractMethod(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'CONSENSUS_THRESHOLD'
    );
    return Number(result);
  }

  async getTotalChains(): Promise<number> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    const result = await this.arbitrum.callContractMethod(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'TOTAL_CHAINS'
    );
    return Number(result);
  }

  async getValidator(chainId: number): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    return await this.arbitrum.callContractMethod(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'validators',
      [chainId]
    );
  }

  async getOperationState(operationId: string): Promise<OperationState> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    const result = await this.arbitrum.callContractMethod(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'operations',
      [operationId]
    );

    return {
      chainConfirmations: Number(result[0]),
      arbitrumConfirmed: result[1],
      solanaConfirmed: result[2],
      tonConfirmed: result[3],
      expiresAt: Number(result[4]),
      executed: result[5]
    };
  }

  async hasConsensus(operationId: string): Promise<boolean> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    return await this.arbitrum.callContractMethod(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'hasConsensus',
      [operationId]
    );
  }

  async getConfirmationStatus(operationId: string): Promise<{
    confirmations: number;
    arbitrum: boolean;
    solana: boolean;
    ton: boolean;
  }> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    const result = await this.arbitrum.callContractMethod(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'getConfirmationStatus',
      [operationId]
    );

    return {
      confirmations: Number(result[0]),
      arbitrum: result[1],
      solana: result[2],
      ton: result[3]
    };
  }

  async confirmOperation(
    operationId: string,
    chainId: number,
    signature: string
  ): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }
    
    const tx = await this.arbitrum.sendTransaction(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'confirmOperation',
      [operationId, chainId, signature]
    );

    return tx.hash;
  }

  async executeOperation(
    operationId: string,
    target: string,
    data: string,
    value: string = '0'
  ): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const hasConsensus = await this.hasConsensus(operationId);
    if (!hasConsensus) {
      throw new ConsensusError('Operation does not have consensus', operationId);
    }
    
    const tx = await this.arbitrum.sendTransaction(
      TRINITY_CONSENSUS_VERIFIER_ADDRESS,
      TRINITY_CONSENSUS_VERIFIER_ABI,
      'executeOperation',
      [operationId, target, data, value]
    );

    return tx.hash;
  }

  async getMultiChainStatus(): Promise<{
    arbitrum: { connected: boolean; blockNumber?: number };
    solana: { connected: boolean; slot?: number };
    ton: { connected: boolean };
  }> {
    const status: any = {
      arbitrum: { connected: false },
      solana: { connected: false },
      ton: { connected: false }
    };

    if (this.arbitrum) {
      try {
        const blockNumber = await this.arbitrum.getBlockNumber();
        status.arbitrum = { connected: true, blockNumber };
      } catch {
        status.arbitrum = { connected: false };
      }
    }

    if (this.solana) {
      try {
        const slot = await this.solana.getSlot();
        status.solana = { connected: true, slot };
      } catch {
        status.solana = { connected: false };
      }
    }

    if (this.ton) {
      try {
        status.ton = { connected: true };
      } catch {
        status.ton = { connected: false };
      }
    }

    return status;
  }

  getArbitrumProvider(): ArbitrumProvider | undefined {
    return this.arbitrum;
  }

  getSolanaProvider(): SolanaProvider | undefined {
    return this.solana;
  }

  getTonProvider(): TonProvider | undefined {
    return this.ton;
  }
}

export default TrinityRPCClient;
