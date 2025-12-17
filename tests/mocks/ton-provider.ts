/**
 * Mock TON Provider for Testing
 */

export class MockTonProvider {
  private mockBalance = '5.0';
  private mockWalletAddress = '0QCctckQeh8Xo8-_U4L8PpXtjMBlG71S8PD8QZvr9OzmJvHK';
  private mockSeqno = 42;

  async getBalance(address: string): Promise<string> {
    return this.mockBalance;
  }

  async getSignerAddress(): Promise<string> {
    return this.mockWalletAddress;
  }

  async getSeqno(): Promise<number> {
    return this.mockSeqno;
  }

  async sendTransfer(to: string, amount: string, payload?: any): Promise<{
    hash: string;
    lt: string;
    status: string;
  }> {
    return {
      hash: `ton_tx_${Date.now()}`,
      lt: String(this.mockSeqno),
      status: 'success'
    };
  }

  async callGetMethod(address: string, method: string, args: any[] = []): Promise<any> {
    return [];
  }

  async getContractState(address: string): Promise<any> {
    return {
      balance: 5000000000n,
      code: Buffer.from([]),
      data: Buffer.from([])
    };
  }

  async getTransactions(address: string, limit: number = 10): Promise<any[]> {
    return [
      {
        hash: 'tx1',
        lt: '12345',
        prevLt: '12344',
        now: Math.floor(Date.now() / 1000)
      }
    ];
  }

  async isContractDeployed(address: string): Promise<boolean> {
    return true;
  }

  setMockBalance(balance: string): void {
    this.mockBalance = balance;
  }

  setMockSeqno(seqno: number): void {
    this.mockSeqno = seqno;
  }
}

export default MockTonProvider;
