/**
 * Multi-Chain Provider Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockArbitrumProvider } from '../mocks/arbitrum-provider';
import { MockSolanaProvider } from '../mocks/solana-provider';
import { MockTonProvider } from '../mocks/ton-provider';

describe('Multi-Chain Integration', () => {
  let arbitrumProvider: MockArbitrumProvider;
  let solanaProvider: MockSolanaProvider;
  let tonProvider: MockTonProvider;

  beforeEach(() => {
    arbitrumProvider = new MockArbitrumProvider();
    solanaProvider = new MockSolanaProvider();
    tonProvider = new MockTonProvider();
  });

  describe('Chain Status', () => {
    it('should get Arbitrum block number', async () => {
      const blockNumber = await arbitrumProvider.getBlockNumber();
      expect(blockNumber).toBeGreaterThan(0);
    });

    it('should get Solana slot', async () => {
      const slot = await solanaProvider.getSlot();
      expect(slot).toBeGreaterThan(0);
    });

    it('should get TON balance', async () => {
      const balance = await tonProvider.getBalance('0QTest');
      expect(parseFloat(balance)).toBeGreaterThan(0);
    });
  });

  describe('Balances', () => {
    it('should get Arbitrum balance in ETH', async () => {
      const balance = await arbitrumProvider.getBalance('0xTest');
      expect(balance).toBe('1.5');
    });

    it('should get Solana balance in SOL', async () => {
      const balance = await solanaProvider.getBalance('TestPubkey');
      expect(balance).toBe(2.5);
    });

    it('should get TON balance in TON', async () => {
      const balance = await tonProvider.getBalance('0QTest');
      expect(balance).toBe('5.0');
    });
  });

  describe('Signer Addresses', () => {
    it('should get Solana signer address', async () => {
      const address = await solanaProvider.getSignerAddress();
      expect(address).toBe('52qut4Yk6b6LD5rZB69b4XVwxn7tYh8B7Ua6SVsvEfDX');
    });

    it('should get TON signer address', async () => {
      const address = await tonProvider.getSignerAddress();
      expect(address).toBe('0QCctckQeh8Xo8-_U4L8PpXtjMBlG71S8PD8QZvr9OzmJvHK');
    });
  });

  describe('Transactions', () => {
    it('should send Arbitrum transaction', async () => {
      const result = await arbitrumProvider.sendTransaction('', [], 'test', []);
      expect(result.status).toBe('success');
      expect(result.hash).toBeDefined();
    });

    it('should send Solana transaction', async () => {
      const result = await solanaProvider.sendTransaction([]);
      expect(result.status).toBe('success');
      expect(result.signature).toBeDefined();
    });

    it('should send TON transfer', async () => {
      const result = await tonProvider.sendTransfer('0QRecipient', '1.0');
      expect(result.status).toBe('success');
      expect(result.hash).toBeDefined();
    });
  });

  describe('Account Info', () => {
    it('should get Solana account info', async () => {
      const info = await solanaProvider.getAccountInfo('TestPubkey');
      expect(info.lamports).toBeDefined();
      expect(info.owner).toBeDefined();
    });

    it('should get TON contract state', async () => {
      const state = await tonProvider.getContractState('0QTest');
      expect(state.balance).toBeDefined();
    });

    it('should check TON contract deployment', async () => {
      const deployed = await tonProvider.isContractDeployed('0QTest');
      expect(deployed).toBe(true);
    });
  });

  describe('Solana Specific', () => {
    it('should request airdrop', async () => {
      const signature = await solanaProvider.requestAirdrop('TestPubkey', 1000000000);
      expect(signature).toBeDefined();
    });

    it('should get recent blockhash', async () => {
      const blockhash = await solanaProvider.getRecentBlockhash();
      expect(blockhash).toBeDefined();
    });
  });

  describe('TON Specific', () => {
    it('should get transactions', async () => {
      const txs = await tonProvider.getTransactions('0QTest', 10);
      expect(txs.length).toBeGreaterThan(0);
    });

    it('should get seqno', async () => {
      const seqno = await tonProvider.getSeqno();
      expect(seqno).toBe(42);
    });
  });

  describe('Mock Configurability', () => {
    it('should update mock values for testing', async () => {
      arbitrumProvider.setMockBlockNumber(99999);
      expect(await arbitrumProvider.getBlockNumber()).toBe(99999);

      solanaProvider.setMockSlot(88888);
      expect(await solanaProvider.getSlot()).toBe(88888);

      tonProvider.setMockBalance('10.0');
      expect(await tonProvider.getBalance('0QTest')).toBe('10.0');
    });
  });
});
