/**
 * HTLC Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockArbitrumProvider } from '../mocks/arbitrum-provider';

describe('HTLCRPCClient', () => {
  let mockProvider: MockArbitrumProvider;

  beforeEach(() => {
    mockProvider = new MockArbitrumProvider();
  });

  describe('Swap State', () => {
    it('should get existing swap state', async () => {
      const result = await mockProvider.callContractMethod('', [], 'swaps', ['0xswap1']);
      expect(result[0]).toBe('0xSender');
      expect(result[1]).toBe('0xRecipient');
      expect(result[6]).toBe(false); // not claimed
      expect(result[7]).toBe(false); // not refunded
    });

    it('should return default state for non-existent swap', async () => {
      const result = await mockProvider.callContractMethod('', [], 'swaps', ['0xnonexistent']);
      expect(result[0]).toBe('0x0');
      expect(result[6]).toBe(false);
      expect(result[7]).toBe(false);
    });
  });

  describe('Swap Status', () => {
    it('should return swap exists status', async () => {
      const result = await mockProvider.callContractMethod('', [], 'getSwapStatus', ['0xswap1']);
      expect(result[0]).toBe(true); // exists
      expect(result[1]).toBe(false); // not claimed
      expect(result[2]).toBe(false); // not refunded
    });

    it('should return non-existent for unknown swap', async () => {
      const result = await mockProvider.callContractMethod('', [], 'getSwapStatus', ['0xunknown']);
      expect(result[0]).toBe(false); // does not exist
    });
  });

  describe('Create Swap', () => {
    it('should send createSwap transaction', async () => {
      const result = await mockProvider.sendTransaction(
        '',
        [],
        'createSwap',
        ['0xRecipient', '0xhashlock', 3600, 2],
        '0.1'
      );
      expect(result.status).toBe('success');
      expect(result.hash).toBeDefined();
    });
  });

  describe('Claim Swap', () => {
    it('should send claimSwap transaction', async () => {
      const result = await mockProvider.sendTransaction(
        '',
        [],
        'claimSwap',
        ['0xswap1', '0xpreimage']
      );
      expect(result.status).toBe('success');
    });
  });

  describe('Refund Swap', () => {
    it('should send refundSwap transaction', async () => {
      mockProvider.setMockSwap('0xexpiredSwap', {
        sender: '0xSender',
        recipient: '0xRecipient',
        amount: '1000000000000000000',
        hashlock: '0xhash',
        timelock: Math.floor(Date.now() / 1000) - 3600, // expired
        destinationChainId: 2,
        claimed: false,
        refunded: false
      });

      const result = await mockProvider.sendTransaction(
        '',
        [],
        'refundSwap',
        ['0xexpiredSwap']
      );
      expect(result.status).toBe('success');
    });
  });

  describe('Swap Amount', () => {
    it('should correctly parse swap amount', async () => {
      const result = await mockProvider.callContractMethod('', [], 'swaps', ['0xswap1']);
      const amount = BigInt(result[2]);
      expect(amount).toBe(1000000000000000000n); // 1 ETH
    });
  });

  describe('Timelock', () => {
    it('should have valid timelock in the future', async () => {
      const result = await mockProvider.callContractMethod('', [], 'swaps', ['0xswap1']);
      const timelock = Number(result[4]);
      expect(timelock).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });
});
