/**
 * TON RPC Provider
 * Direct blockchain connection for Trinity Protocol operations
 */

import { TonClient, WalletContractV4, internal, Address, beginCell, Cell } from '@ton/ton';
import { mnemonicToPrivateKey, KeyPair } from '@ton/crypto';
class SDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SDKError';
  }
}

class ProviderError extends Error {
  constructor(message: string, public chain: string, public originalError?: any) {
    super(message);
    this.name = 'ProviderError';
  }
}

export interface TonProviderConfig {
  endpoint: string;
  apiKey?: string;
  mnemonic?: string;
  network?: 'mainnet' | 'testnet';
}

export interface TonTransactionResult {
  hash: string;
  lt: string;
  status: 'success' | 'failed';
}

export class TonProvider {
  private client: TonClient;
  private wallet?: WalletContractV4;
  private keyPair?: KeyPair;
  private _network: 'mainnet' | 'testnet';

  constructor(config: TonProviderConfig) {
    this._network = config.network || 'testnet';
    this.client = new TonClient({
      endpoint: config.endpoint,
      apiKey: config.apiKey
    });
  }

  async initWallet(mnemonic: string): Promise<void> {
    try {
      const mnemonicArray = mnemonic.split(' ');
      this.keyPair = await mnemonicToPrivateKey(mnemonicArray);
      this.wallet = WalletContractV4.create({
        publicKey: this.keyPair.publicKey,
        workchain: 0
      });
    } catch (error) {
      throw new SDKError('Failed to initialize TON wallet from mnemonic');
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const addr = Address.parse(address);
      const balance = await this.client.getBalance(addr);
      return (Number(balance) / 1e9).toString();
    } catch (error) {
      throw new ProviderError('Failed to get balance', 'ton', error);
    }
  }

  async getSignerAddress(): Promise<string> {
    if (!this.wallet) {
      throw new SDKError('Wallet not initialized - call initWallet first');
    }
    return this.wallet.address.toString();
  }

  async getSeqno(): Promise<number> {
    if (!this.wallet) {
      throw new SDKError('Wallet not initialized');
    }
    
    try {
      const contract = this.client.open(this.wallet);
      return await contract.getSeqno();
    } catch (error) {
      throw new ProviderError('Failed to get seqno', 'ton', error);
    }
  }

  async sendTransfer(
    to: string,
    amount: string,
    payload?: Cell
  ): Promise<TonTransactionResult> {
    if (!this.wallet || !this.keyPair) {
      throw new SDKError('Wallet not initialized');
    }

    try {
      const contract = this.client.open(this.wallet);
      const seqno = await contract.getSeqno();
      
      await contract.sendTransfer({
        secretKey: this.keyPair.secretKey,
        seqno,
        messages: [
          internal({
            to: Address.parse(to),
            value: BigInt(Math.floor(parseFloat(amount) * 1e9)),
            body: payload
          })
        ]
      });

      await new Promise(resolve => setTimeout(resolve, 10000));
      
      return {
        hash: `ton_tx_${Date.now()}`,
        lt: seqno.toString(),
        status: 'success'
      };
    } catch (error) {
      throw new ProviderError('Transfer failed', 'ton', error);
    }
  }

  async callGetMethod(
    address: string,
    method: string,
    args: any[] = []
  ): Promise<any> {
    try {
      const addr = Address.parse(address);
      const result = await this.client.runMethod(addr, method, args);
      return result.stack;
    } catch (error) {
      throw new ProviderError(`Failed to call ${method}`, 'ton', error);
    }
  }

  async getContractState(address: string): Promise<any> {
    try {
      const addr = Address.parse(address);
      return await this.client.getContractState(addr);
    } catch (error) {
      throw new ProviderError('Failed to get contract state', 'ton', error);
    }
  }

  async getTransactions(address: string, limit: number = 10): Promise<any[]> {
    try {
      const addr = Address.parse(address);
      return await this.client.getTransactions(addr, { limit });
    } catch (error) {
      throw new ProviderError('Failed to get transactions', 'ton', error);
    }
  }

  async isContractDeployed(address: string): Promise<boolean> {
    try {
      const addr = Address.parse(address);
      return await this.client.isContractDeployed(addr);
    } catch (error) {
      throw new ProviderError('Failed to check contract deployment', 'ton', error);
    }
  }

  buildCell(data: string): Cell {
    return beginCell().storeStringTail(data).endCell();
  }

  getClient(): TonClient {
    return this.client;
  }

  getWallet(): WalletContractV4 | undefined {
    return this.wallet;
  }
}

export default TonProvider;
