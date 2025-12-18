/**
 * Arbitrum RPC Provider
 * Direct blockchain connection for Trinity Protocol operations
 */

import { Contract, Wallet, JsonRpcProvider, formatEther, parseEther } from 'ethers';
import { SDKError, ProviderError } from '../errors';

export interface ArbitrumProviderConfig {
  rpcUrl: string;
  privateKey?: string;
  chainId?: number;
}

export interface TransactionResult {
  hash: string;
  blockNumber: number;
  status: 'success' | 'failed';
  gasUsed: string;
}

export class ArbitrumProvider {
  private provider: JsonRpcProvider;
  private signer?: Wallet;
  private chainId: number;

  constructor(config: ArbitrumProviderConfig) {
    this.chainId = config.chainId || 421614; // Arbitrum Sepolia
    this.provider = new JsonRpcProvider(config.rpcUrl, this.chainId);
    
    if (config.privateKey) {
      this.signer = new Wallet(config.privateKey, this.provider);
    }
  }

  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      throw new ProviderError('Failed to get block number', 'arbitrum', error);
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      throw new ProviderError('Failed to get balance', 'arbitrum', error);
    }
  }

  async getSignerAddress(): Promise<string> {
    if (!this.signer) {
      throw new SDKError('No signer configured - provide privateKey in config');
    }
    return this.signer.address;
  }

  getContract(address: string, abi: any[]): Contract {
    const runner = this.signer || this.provider;
    return new Contract(address, abi, runner);
  }

  async callContractMethod(
    address: string,
    abi: any[],
    methodName: string,
    args: any[] = []
  ): Promise<any> {
    try {
      const contract = this.getContract(address, abi);
      return await contract[methodName](...args);
    } catch (error) {
      throw new ProviderError(`Failed to call ${methodName}`, 'arbitrum', error);
    }
  }

  async sendTransaction(
    address: string,
    abi: any[],
    methodName: string,
    args: any[] = [],
    value?: string
  ): Promise<TransactionResult> {
    if (!this.signer) {
      throw new SDKError('No signer configured - provide privateKey to send transactions');
    }

    try {
      const contract = this.getContract(address, abi);
      const options: any = {};
      if (value) {
        options.value = parseEther(value);
      }

      const tx = await contract[methodName](...args, options);
      const receipt = await tx.wait();

      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new ProviderError(`Transaction ${methodName} failed`, 'arbitrum', error);
    }
  }

  async estimateGas(
    address: string,
    abi: any[],
    methodName: string,
    args: any[] = []
  ): Promise<string> {
    try {
      const contract = this.getContract(address, abi);
      const gas = await contract[methodName].estimateGas(...args);
      return gas.toString();
    } catch (error) {
      throw new ProviderError(`Gas estimation failed for ${methodName}`, 'arbitrum', error);
    }
  }

  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<TransactionResult> {
    try {
      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      if (!receipt) {
        throw new Error('Transaction not found');
      }
      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new ProviderError('Failed to wait for transaction', 'arbitrum', error);
    }
  }

  getProvider(): JsonRpcProvider {
    return this.provider;
  }

  getSigner(): Wallet | undefined {
    return this.signer;
  }
}

export default ArbitrumProvider;
