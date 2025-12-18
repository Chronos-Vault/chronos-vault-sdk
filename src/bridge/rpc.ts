/**
 * Bridge RPC Client
 * Direct RPC methods for cross-chain transfers without API intermediary
 */

import { Contract } from 'ethers';
import { CONTRACTS } from '../constants';
import { ChainId, RPCConfig } from '../types';
import { SDKError, ProviderError } from '../errors';

export interface BridgeTransferParams {
  sourceChain: ChainId;
  targetChain: ChainId;
  amount: string;
  recipientAddress: string;
  assetType?: string;
}

export interface BridgeTransferResult {
  sourceChain: ChainId;
  targetChain: ChainId;
  txHash: string;
  messageId: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: number;
}

export interface BridgeMessage {
  messageId: string;
  sourceChain: ChainId;
  targetChain: ChainId;
  sender: string;
  recipient: string;
  amount: string;
  nonce: number;
  timestamp: number;
  status: 'pending' | 'relayed' | 'executed' | 'failed';
}

const CROSS_CHAIN_RELAY_ABI = [
  'function sendMessage(uint256 targetChainId, address recipient, bytes calldata data) external payable returns (bytes32)',
  'function relayMessage(bytes32 messageId, bytes calldata proof) external',
  'function getMessageStatus(bytes32 messageId) external view returns (uint8)',
  'function getMessageFee(uint256 targetChainId) external view returns (uint256)',
  'function nonces(address) external view returns (uint256)',
  'event MessageSent(bytes32 indexed messageId, uint256 targetChainId, address sender, address recipient, bytes data)',
  'event MessageRelayed(bytes32 indexed messageId, address executor)',
];

const EXIT_GATEWAY_ABI = [
  'function initiateExit(address token, uint256 amount, uint256 targetChainId, address recipient) external',
  'function completeExit(bytes32 exitId, bytes calldata proof) external',
  'function getExitStatus(bytes32 exitId) external view returns (uint8)',
  'function getPendingExits(address user) external view returns (bytes32[])',
  'event ExitInitiated(bytes32 indexed exitId, address token, uint256 amount, uint256 targetChainId, address recipient)',
  'event ExitCompleted(bytes32 indexed exitId)',
];

export class BridgeRPCClient {
  private rpcConfig: RPCConfig;
  private arbitrumProvider?: any;

  constructor(rpcConfig: RPCConfig) {
    this.rpcConfig = rpcConfig;
    this.initializeProviders();
  }

  private async initializeProviders(): Promise<void> {
    if (this.rpcConfig.arbitrum) {
      const { JsonRpcProvider, Wallet } = await import('ethers');
      const provider = new JsonRpcProvider(
        this.rpcConfig.arbitrum.rpcUrl,
        this.rpcConfig.arbitrum.chainId || 421614
      );
      
      if (this.rpcConfig.arbitrum.privateKey) {
        this.arbitrumProvider = new Wallet(this.rpcConfig.arbitrum.privateKey, provider);
      } else {
        this.arbitrumProvider = provider;
      }
    }
  }

  private getRelayContract(): Contract {
    if (!this.arbitrumProvider) {
      throw new SDKError('Arbitrum provider not initialized');
    }
    
    const address = CONTRACTS.arbitrum.testnet.CrossChainMessageRelay;
    return new Contract(address, CROSS_CHAIN_RELAY_ABI, this.arbitrumProvider);
  }

  private getExitGatewayContract(): Contract {
    if (!this.arbitrumProvider) {
      throw new SDKError('Arbitrum provider not initialized');
    }
    
    const address = CONTRACTS.arbitrum.testnet.TrinityExitGateway;
    return new Contract(address, EXIT_GATEWAY_ABI, this.arbitrumProvider);
  }

  private chainIdToNumber(chain: ChainId): number {
    const mapping: Record<ChainId, number> = {
      arbitrum: 1,
      solana: 2,
      ton: 3,
    };
    return mapping[chain];
  }

  /**
   * Get the fee required for sending a message to target chain
   */
  async getMessageFee(targetChain: ChainId): Promise<string> {
    try {
      const relay = this.getRelayContract();
      const chainId = this.chainIdToNumber(targetChain);
      const fee = await relay.getMessageFee(chainId);
      const { formatEther } = await import('ethers');
      return formatEther(fee);
    } catch (error) {
      throw new ProviderError('Failed to get message fee', 'arbitrum', error);
    }
  }

  /**
   * Send a cross-chain message
   */
  async sendMessage(
    targetChain: ChainId,
    recipient: string,
    data: string
  ): Promise<{ txHash: string; messageId: string }> {
    try {
      const relay = this.getRelayContract();
      const chainId = this.chainIdToNumber(targetChain);
      const fee = await relay.getMessageFee(chainId);
      
      const tx = await relay.sendMessage(chainId, recipient, data, { value: fee });
      const receipt = await tx.wait();
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = relay.interface.parseLog(log);
          return parsed?.name === 'MessageSent';
        } catch {
          return false;
        }
      });

      const messageId = event ? relay.interface.parseLog(event)?.args?.messageId : '';

      return {
        txHash: receipt.hash,
        messageId: messageId || '',
      };
    } catch (error) {
      throw new ProviderError('Failed to send cross-chain message', 'arbitrum', error);
    }
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageId: string): Promise<'pending' | 'relayed' | 'executed' | 'failed'> {
    try {
      const relay = this.getRelayContract();
      const status = await relay.getMessageStatus(messageId);
      
      const statusMap: Record<number, 'pending' | 'relayed' | 'executed' | 'failed'> = {
        0: 'pending',
        1: 'relayed',
        2: 'executed',
        3: 'failed',
      };
      
      return statusMap[Number(status)] || 'pending';
    } catch (error) {
      throw new ProviderError('Failed to get message status', 'arbitrum', error);
    }
  }

  /**
   * Initiate an exit from Arbitrum to another chain
   */
  async initiateExit(
    tokenAddress: string,
    amount: string,
    targetChain: ChainId,
    recipient: string
  ): Promise<{ txHash: string; exitId: string }> {
    try {
      const gateway = this.getExitGatewayContract();
      const chainId = this.chainIdToNumber(targetChain);
      const { parseEther } = await import('ethers');
      
      const tx = await gateway.initiateExit(
        tokenAddress,
        parseEther(amount),
        chainId,
        recipient
      );
      const receipt = await tx.wait();
      
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = gateway.interface.parseLog(log);
          return parsed?.name === 'ExitInitiated';
        } catch {
          return false;
        }
      });

      const exitId = event ? gateway.interface.parseLog(event)?.args?.exitId : '';

      return {
        txHash: receipt.hash,
        exitId: exitId || '',
      };
    } catch (error) {
      throw new ProviderError('Failed to initiate exit', 'arbitrum', error);
    }
  }

  /**
   * Get exit status
   */
  async getExitStatus(exitId: string): Promise<'pending' | 'completed' | 'failed'> {
    try {
      const gateway = this.getExitGatewayContract();
      const status = await gateway.getExitStatus(exitId);
      
      const statusMap: Record<number, 'pending' | 'completed' | 'failed'> = {
        0: 'pending',
        1: 'completed',
        2: 'failed',
      };
      
      return statusMap[Number(status)] || 'pending';
    } catch (error) {
      throw new ProviderError('Failed to get exit status', 'arbitrum', error);
    }
  }

  /**
   * Get pending exits for an address
   */
  async getPendingExits(userAddress: string): Promise<string[]> {
    try {
      const gateway = this.getExitGatewayContract();
      const exits = await gateway.getPendingExits(userAddress);
      return exits.map((e: any) => e.toString());
    } catch (error) {
      throw new ProviderError('Failed to get pending exits', 'arbitrum', error);
    }
  }

  /**
   * Get current nonce for an address
   */
  async getNonce(address: string): Promise<number> {
    try {
      const relay = this.getRelayContract();
      const nonce = await relay.nonces(address);
      return Number(nonce);
    } catch (error) {
      throw new ProviderError('Failed to get nonce', 'arbitrum', error);
    }
  }

  /**
   * Estimate gas for a bridge transfer
   */
  async estimateGas(
    targetChain: ChainId,
    recipient: string,
    data: string
  ): Promise<string> {
    try {
      const relay = this.getRelayContract();
      const chainId = this.chainIdToNumber(targetChain);
      const fee = await relay.getMessageFee(chainId);
      
      const gasEstimate = await relay.sendMessage.estimateGas(
        chainId,
        recipient,
        data,
        { value: fee }
      );
      
      return gasEstimate.toString();
    } catch (error) {
      throw new ProviderError('Failed to estimate gas', 'arbitrum', error);
    }
  }

  /**
   * Check if the bridge is available between two chains
   */
  isRouteAvailable(sourceChain: ChainId, targetChain: ChainId): boolean {
    const validRoutes: Array<[ChainId, ChainId]> = [
      ['arbitrum', 'solana'],
      ['arbitrum', 'ton'],
      ['solana', 'arbitrum'],
      ['solana', 'ton'],
      ['ton', 'arbitrum'],
      ['ton', 'solana'],
    ];
    
    return validRoutes.some(
      ([src, tgt]) => src === sourceChain && tgt === targetChain
    );
  }
}

export default BridgeRPCClient;
