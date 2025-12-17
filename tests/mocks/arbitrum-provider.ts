/**
 * Mock Arbitrum Provider for Testing
 */

export class MockArbitrumProvider {
  private mockBlockNumber = 12345678;
  private mockBalance = '1.5';
  private mockOperations = new Map<string, any>();
  private mockSwaps = new Map<string, any>();

  constructor() {
    this.mockOperations.set('0x1234', {
      chainConfirmations: 2,
      arbitrumConfirmed: true,
      solanaConfirmed: true,
      tonConfirmed: false,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
      executed: false
    });

    this.mockSwaps.set('0xswap1', {
      sender: '0xSender',
      recipient: '0xRecipient',
      amount: '1000000000000000000',
      hashlock: '0xhash',
      timelock: Math.floor(Date.now() / 1000) + 3600,
      destinationChainId: 2,
      claimed: false,
      refunded: false
    });
  }

  async getBlockNumber(): Promise<number> {
    return this.mockBlockNumber;
  }

  async getBalance(address: string): Promise<string> {
    return this.mockBalance;
  }

  async callContractMethod(
    address: string,
    abi: any[],
    methodName: string,
    args: any[] = []
  ): Promise<any> {
    switch (methodName) {
      case 'CONSENSUS_THRESHOLD':
        return 2n;
      case 'TOTAL_CHAINS':
        return 3n;
      case 'validators':
        const chainId = args[0];
        const validators: Record<number, string> = {
          1: '0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8',
          2: '0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5',
          3: '0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4'
        };
        return validators[chainId] || '0x0000000000000000000000000000000000000000';
      case 'operations':
        const opId = args[0];
        const op = this.mockOperations.get(opId) || {
          chainConfirmations: 0,
          arbitrumConfirmed: false,
          solanaConfirmed: false,
          tonConfirmed: false,
          expiresAt: 0,
          executed: false
        };
        return [
          BigInt(op.chainConfirmations),
          op.arbitrumConfirmed,
          op.solanaConfirmed,
          op.tonConfirmed,
          BigInt(op.expiresAt),
          op.executed
        ];
      case 'hasConsensus':
        const hasOp = this.mockOperations.get(args[0]);
        return hasOp ? hasOp.chainConfirmations >= 2 : false;
      case 'getConfirmationStatus':
        const statusOp = this.mockOperations.get(args[0]);
        if (statusOp) {
          return [
            BigInt(statusOp.chainConfirmations),
            statusOp.arbitrumConfirmed,
            statusOp.solanaConfirmed,
            statusOp.tonConfirmed
          ];
        }
        return [0n, false, false, false];
      case 'swaps':
        const swap = this.mockSwaps.get(args[0]);
        if (swap) {
          return [
            swap.sender,
            swap.recipient,
            BigInt(swap.amount),
            swap.hashlock,
            BigInt(swap.timelock),
            BigInt(swap.destinationChainId),
            swap.claimed,
            swap.refunded
          ];
        }
        return ['0x0', '0x0', 0n, '0x0', 0n, 0n, false, false];
      case 'getSwapStatus':
        const swapStatus = this.mockSwaps.get(args[0]);
        const currentTime = Math.floor(Date.now() / 1000);
        if (swapStatus) {
          return [
            true,
            swapStatus.claimed,
            swapStatus.refunded,
            currentTime > swapStatus.timelock
          ];
        }
        return [false, false, false, false];
      case 'totalAssets':
        return 1000000000000000000n;
      case 'totalSupply':
        return 1000000000000000000n;
      case 'asset':
        return '0x4567853BE0d5780099E3542Df2e00C5B633E0161';
      case 'consensusRequired':
        return true;
      case 'trinityVerifier':
        return '0x59396D58Fa856025bD5249E342729d5550Be151C';
      case 'balanceOf':
        return 500000000000000000n;
      case 'convertToAssets':
      case 'convertToShares':
        return args[0];
      case 'maxDeposit':
        return BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      case 'maxWithdraw':
        return 500000000000000000n;
      default:
        throw new Error(`Unknown method: ${methodName}`);
    }
  }

  async sendTransaction(
    address: string,
    abi: any[],
    methodName: string,
    args: any[] = [],
    value?: string
  ): Promise<{ hash: string; blockNumber: number; status: string; gasUsed: string }> {
    return {
      hash: `0x${Math.random().toString(16).slice(2)}`,
      blockNumber: this.mockBlockNumber,
      status: 'success',
      gasUsed: '150000'
    };
  }

  setMockOperation(id: string, operation: any): void {
    this.mockOperations.set(id, operation);
  }

  setMockSwap(id: string, swap: any): void {
    this.mockSwaps.set(id, swap);
  }

  setMockBlockNumber(blockNumber: number): void {
    this.mockBlockNumber = blockNumber;
  }

  setMockBalance(balance: string): void {
    this.mockBalance = balance;
  }
}

export default MockArbitrumProvider;
