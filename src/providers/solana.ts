/**
 * Solana RPC Provider
 * Direct blockchain connection for Trinity Protocol operations
 */

import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  SystemProgram
} from '@solana/web3.js';
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
import bs58 from 'bs58';

export interface SolanaProviderConfig {
  rpcUrl: string;
  privateKey?: string;
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

export interface SolanaTransactionResult {
  signature: string;
  slot: number;
  status: 'success' | 'failed';
}

export class SolanaProvider {
  private connection: Connection;
  private keypair?: Keypair;
  private commitment: 'processed' | 'confirmed' | 'finalized';

  constructor(config: SolanaProviderConfig) {
    this.commitment = config.commitment || 'confirmed';
    this.connection = new Connection(config.rpcUrl, this.commitment);
    
    if (config.privateKey) {
      try {
        const secretKey = bs58.decode(config.privateKey);
        this.keypair = Keypair.fromSecretKey(secretKey);
      } catch (error) {
        throw new SDKError('Invalid Solana private key format');
      }
    }
  }

  async getSlot(): Promise<number> {
    try {
      return await this.connection.getSlot();
    } catch (error) {
      throw new ProviderError('Failed to get slot', 'solana', error);
    }
  }

  async getBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      throw new ProviderError('Failed to get balance', 'solana', error);
    }
  }

  async getSignerAddress(): Promise<string> {
    if (!this.keypair) {
      throw new SDKError('No keypair configured - provide privateKey in config');
    }
    return this.keypair.publicKey.toBase58();
  }

  async getAccountInfo(address: string): Promise<any> {
    try {
      const pubkey = new PublicKey(address);
      return await this.connection.getAccountInfo(pubkey);
    } catch (error) {
      throw new ProviderError('Failed to get account info', 'solana', error);
    }
  }

  async sendTransaction(
    instructions: TransactionInstruction[],
    signers?: Keypair[]
  ): Promise<SolanaTransactionResult> {
    if (!this.keypair) {
      throw new SDKError('No keypair configured - provide privateKey to send transactions');
    }

    try {
      const transaction = new Transaction();
      instructions.forEach(ix => transaction.add(ix));
      
      const allSigners = [this.keypair, ...(signers || [])];
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        allSigners,
        { commitment: this.commitment }
      );

      const status = await this.connection.getSignatureStatus(signature);
      
      return {
        signature,
        slot: status.value?.slot || 0,
        status: status.value?.err ? 'failed' : 'success'
      };
    } catch (error) {
      throw new ProviderError('Transaction failed', 'solana', error);
    }
  }

  async transfer(
    to: string,
    lamports: number
  ): Promise<SolanaTransactionResult> {
    if (!this.keypair) {
      throw new SDKError('No keypair configured');
    }

    const instruction = SystemProgram.transfer({
      fromPubkey: this.keypair.publicKey,
      toPubkey: new PublicKey(to),
      lamports
    });

    return this.sendTransaction([instruction]);
  }

  async requestAirdrop(address: string, lamports: number): Promise<string> {
    try {
      const pubkey = new PublicKey(address);
      const signature = await this.connection.requestAirdrop(pubkey, lamports);
      await this.connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      throw new ProviderError('Airdrop failed', 'solana', error);
    }
  }

  async getRecentBlockhash(): Promise<string> {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      throw new ProviderError('Failed to get recent blockhash', 'solana', error);
    }
  }

  async getSignatureStatus(signature: string): Promise<any> {
    try {
      return await this.connection.getSignatureStatus(signature);
    } catch (error) {
      throw new ProviderError('Failed to get signature status', 'solana', error);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  getKeypair(): Keypair | undefined {
    return this.keypair;
  }
}

export default SolanaProvider;
