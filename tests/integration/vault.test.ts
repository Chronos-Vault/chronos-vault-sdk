/**
 * Vault Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockArbitrumProvider } from '../mocks/arbitrum-provider';

describe('VaultRPCClient', () => {
  let mockProvider: MockArbitrumProvider;

  beforeEach(() => {
    mockProvider = new MockArbitrumProvider();
  });

  describe('Vault Info', () => {
    it('should get asset address', async () => {
      const result = await mockProvider.callContractMethod('', [], 'asset');
      expect(result).toBe('0x4567853BE0d5780099E3542Df2e00C5B633E0161');
    });

    it('should get total assets', async () => {
      const result = await mockProvider.callContractMethod('', [], 'totalAssets');
      expect(result).toBe(1000000000000000000n);
    });

    it('should get total supply', async () => {
      const result = await mockProvider.callContractMethod('', [], 'totalSupply');
      expect(result).toBe(1000000000000000000n);
    });

    it('should check consensus required', async () => {
      const result = await mockProvider.callContractMethod('', [], 'consensusRequired');
      expect(result).toBe(true);
    });

    it('should get trinity verifier address', async () => {
      const result = await mockProvider.callContractMethod('', [], 'trinityVerifier');
      expect(result).toBe('0x59396D58Fa856025bD5249E342729d5550Be151C');
    });
  });

  describe('Balance', () => {
    it('should get user balance', async () => {
      const result = await mockProvider.callContractMethod('', [], 'balanceOf', ['0xUser']);
      expect(result).toBe(500000000000000000n);
    });
  });

  describe('Conversions', () => {
    it('should convert shares to assets', async () => {
      const shares = 1000000000000000000n;
      const result = await mockProvider.callContractMethod('', [], 'convertToAssets', [shares]);
      expect(result).toBe(shares);
    });

    it('should convert assets to shares', async () => {
      const assets = 1000000000000000000n;
      const result = await mockProvider.callContractMethod('', [], 'convertToShares', [assets]);
      expect(result).toBe(assets);
    });
  });

  describe('Deposit', () => {
    it('should send deposit transaction', async () => {
      const result = await mockProvider.sendTransaction(
        '',
        [],
        'deposit',
        ['1000000000000000000', '0xReceiver']
      );
      expect(result.status).toBe('success');
      expect(result.hash).toBeDefined();
    });
  });

  describe('Withdraw', () => {
    it('should send withdraw transaction', async () => {
      const result = await mockProvider.sendTransaction(
        '',
        [],
        'withdraw',
        ['500000000000000000', '0xReceiver', '0xOwner']
      );
      expect(result.status).toBe('success');
    });
  });

  describe('Redeem', () => {
    it('should send redeem transaction', async () => {
      const result = await mockProvider.sendTransaction(
        '',
        [],
        'redeem',
        ['500000000000000000', '0xReceiver', '0xOwner']
      );
      expect(result.status).toBe('success');
    });
  });

  describe('Max Values', () => {
    it('should get max deposit', async () => {
      const result = await mockProvider.callContractMethod('', [], 'maxDeposit', ['0xReceiver']);
      expect(result).toBe(BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
    });

    it('should get max withdraw', async () => {
      const result = await mockProvider.callContractMethod('', [], 'maxWithdraw', ['0xOwner']);
      expect(result).toBe(500000000000000000n);
    });
  });
});
