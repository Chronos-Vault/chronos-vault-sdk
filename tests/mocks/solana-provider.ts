/**
 * Mock Solana Provider for Testing
 */

export class MockSolanaProvider {
  private mockSlot = 234567890;
  private mockBalance = 2.5;
  private mockSignerAddress = '52qut4Yk6b6LD5rZB69b4XVwxn7tYh8B7Ua6SVsvEfDX';

  async getSlot(): Promise<number> {
    return this.mockSlot;
  }

  async getBalance(address: string): Promise<number> {
    return this.mockBalance;
  }

  async getSignerAddress(): Promise<string> {
    return this.mockSignerAddress;
  }

  async getAccountInfo(address: string): Promise<any> {
    return {
      lamports: 2500000000,
      owner: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
      executable: false,
      data: Buffer.from([])
    };
  }

  async sendTransaction(instructions: any[], signers?: any[]): Promise<{
    signature: string;
    slot: number;
    status: string;
  }> {
    return {
      signature: `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
      slot: this.mockSlot,
      status: 'success'
    };
  }

  async requestAirdrop(address: string, lamports: number): Promise<string> {
    return `airdrop_${Math.random().toString(36).slice(2)}`;
  }

  async getRecentBlockhash(): Promise<string> {
    return `blockhash_${Math.random().toString(36).slice(2)}`;
  }

  setMockSlot(slot: number): void {
    this.mockSlot = slot;
  }

  setMockBalance(balance: number): void {
    this.mockBalance = balance;
  }
}

export default MockSolanaProvider;
