/**
 * HTLC RPC Client
 * Direct blockchain integration for atomic swaps
 */

import { ArbitrumProvider } from '../providers/arbitrum';
import { HTLC_CHRONOS_BRIDGE_ABI, HTLC_CHRONOS_BRIDGE_ADDRESS } from '../abis/HTLCChronosBridge';
import { RPCConfig } from '../types';
import { keccak256, toUtf8Bytes, randomBytes, hexlify } from 'ethers';

class SDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SDKError';
  }
}

class TransactionError extends Error {
  constructor(message: string, public txHash?: string, public chain?: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

export interface SwapState {
  sender: string;
  recipient: string;
  amount: string;
  hashlock: string;
  timelock: number;
  destinationChainId: number;
  claimed: boolean;
  refunded: boolean;
}

export interface SwapStatus {
  exists: boolean;
  claimed: boolean;
  refunded: boolean;
  expired: boolean;
}

export class HTLCRPCClient {
  private arbitrum?: ArbitrumProvider;

  constructor(config: RPCConfig) {
    if (config.arbitrum) {
      this.arbitrum = new ArbitrumProvider(config.arbitrum);
    }
  }

  generateSecret(): { secret: string; secretHash: string } {
    const secret = hexlify(randomBytes(32));
    const secretHash = keccak256(secret);
    return { secret, secretHash };
  }

  async createSwap(params: {
    recipient: string;
    hashlock: string;
    timelockSeconds: number;
    destinationChainId: number;
    amountEth: string;
  }): Promise<{ swapId: string; txHash: string }> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timelock = currentTime + params.timelockSeconds;

    const tx = await this.arbitrum.sendTransaction(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'createSwap',
      [params.recipient, params.hashlock, timelock, params.destinationChainId],
      params.amountEth
    );

    const swapId = keccak256(toUtf8Bytes(`${tx.hash}-${params.hashlock}`));

    return {
      swapId,
      txHash: tx.hash
    };
  }

  async claimSwap(swapId: string, preimage: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const status = await this.getSwapStatus(swapId);
    if (!status.exists) {
      throw new TransactionError('Swap does not exist', swapId);
    }
    if (status.claimed) {
      throw new TransactionError('Swap already claimed', swapId);
    }
    if (status.refunded) {
      throw new TransactionError('Swap already refunded', swapId);
    }

    const tx = await this.arbitrum.sendTransaction(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'claimSwap',
      [swapId, preimage]
    );

    return tx.hash;
  }

  async refundSwap(swapId: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const status = await this.getSwapStatus(swapId);
    if (!status.exists) {
      throw new TransactionError('Swap does not exist', swapId);
    }
    if (status.claimed) {
      throw new TransactionError('Swap already claimed', swapId);
    }
    if (status.refunded) {
      throw new TransactionError('Swap already refunded', swapId);
    }
    if (!status.expired) {
      throw new TransactionError('Swap has not expired yet', swapId);
    }

    const tx = await this.arbitrum.sendTransaction(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'refundSwap',
      [swapId]
    );

    return tx.hash;
  }

  async getSwapState(swapId: string): Promise<SwapState> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const result = await this.arbitrum.callContractMethod(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'swaps',
      [swapId]
    );

    return {
      sender: result[0],
      recipient: result[1],
      amount: result[2].toString(),
      hashlock: result[3],
      timelock: Number(result[4]),
      destinationChainId: Number(result[5]),
      claimed: result[6],
      refunded: result[7]
    };
  }

  async getSwapStatus(swapId: string): Promise<SwapStatus> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const result = await this.arbitrum.callContractMethod(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'getSwapStatus',
      [swapId]
    );

    return {
      exists: result[0],
      claimed: result[1],
      refunded: result[2],
      expired: result[3]
    };
  }

  async getMinTimelock(): Promise<number> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const result = await this.arbitrum.callContractMethod(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'MIN_TIMELOCK'
    );

    return Number(result);
  }

  async getMaxTimelock(): Promise<number> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const result = await this.arbitrum.callContractMethod(
      HTLC_CHRONOS_BRIDGE_ADDRESS,
      HTLC_CHRONOS_BRIDGE_ABI,
      'MAX_TIMELOCK'
    );

    return Number(result);
  }
}

export default HTLCRPCClient;
