/**
 * SDK Mode Switching Tests
 * Tests ChronosVaultSDK API vs RPC mode switching
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockArbitrumProvider } from '../mocks/arbitrum-provider';
import { MockSolanaProvider } from '../mocks/solana-provider';
import { MockTonProvider } from '../mocks/ton-provider';

vi.mock('../../src/providers/arbitrum', () => ({
  ArbitrumProvider: vi.fn().mockImplementation(() => new MockArbitrumProvider())
}));

vi.mock('../../src/providers/solana', () => ({
  SolanaProvider: vi.fn().mockImplementation(() => new MockSolanaProvider())
}));

vi.mock('../../src/providers/ton', () => ({
  TonProvider: vi.fn().mockImplementation(() => new MockTonProvider())
}));

import ChronosVaultSDK from '../../src/index';

describe('ChronosVaultSDK Mode Switching', () => {
  describe('API Mode (default)', () => {
    it('should default to API mode', () => {
      const sdk = new ChronosVaultSDK({});
      expect(sdk.getMode()).toBe('api');
      expect(sdk.isRPCEnabled()).toBe(false);
    });

    it('should have API clients but no RPC clients', () => {
      const sdk = new ChronosVaultSDK({ mode: 'api' });
      expect(sdk.trinity).toBeDefined();
      expect(sdk.htlc).toBeDefined();
      expect(sdk.vault).toBeDefined();
      expect(sdk.bridge).toBeDefined();
      expect(sdk.trinityRPC).toBeUndefined();
      expect(sdk.htlcRPC).toBeUndefined();
      expect(sdk.vaultRPC).toBeUndefined();
    });
  });

  describe('RPC Mode', () => {
    it('should initialize in RPC mode with providers', () => {
      const sdk = new ChronosVaultSDK({
        mode: 'rpc',
        rpc: {
          arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) },
          solana: { rpcUrl: 'https://mock.rpc', privateKey: '0x' },
          ton: { endpoint: 'https://mock.rpc' }
        }
      });
      
      expect(sdk.getMode()).toBe('rpc');
      expect(sdk.isRPCEnabled()).toBe(true);
      expect(sdk.trinityRPC).toBeDefined();
      expect(sdk.htlcRPC).toBeDefined();
      expect(sdk.vaultRPC).toBeDefined();
    });

    it('should have both API and RPC clients', () => {
      const sdk = new ChronosVaultSDK({
        mode: 'rpc',
        rpc: {
          arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) }
        }
      });
      
      expect(sdk.trinity).toBeDefined();
      expect(sdk.trinityRPC).toBeDefined();
    });
  });

  describe('Hybrid Mode', () => {
    it('should support hybrid mode', () => {
      const sdk = new ChronosVaultSDK({
        mode: 'hybrid',
        rpc: {
          arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) }
        }
      });
      
      expect(sdk.getMode()).toBe('hybrid');
      expect(sdk.isRPCEnabled()).toBe(true);
    });
  });

  describe('Config Updates', () => {
    it('should update config and reinitialize RPC clients', () => {
      const sdk = new ChronosVaultSDK({ mode: 'api' });
      expect(sdk.trinityRPC).toBeUndefined();
      
      sdk.updateConfig({
        mode: 'rpc',
        rpc: {
          arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) }
        }
      });
      
      expect(sdk.getMode()).toBe('rpc');
      expect(sdk.trinityRPC).toBeDefined();
    });

    it('should preserve existing config when partial update', () => {
      const sdk = new ChronosVaultSDK({
        baseUrl: 'https://custom.api',
        mode: 'rpc',
        rpc: {
          arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) }
        }
      });
      
      const config = sdk.getConfig();
      expect(config.baseUrl).toBe('https://custom.api');
    });
  });

  describe('Chain Status', () => {
    it('should return disconnected status when no RPC configured', async () => {
      const sdk = new ChronosVaultSDK({ mode: 'api' });
      const status = await sdk.getChainStatus();
      
      expect(status.arbitrum.connected).toBe(false);
      expect(status.solana.connected).toBe(false);
      expect(status.ton.connected).toBe(false);
    });

    it('should return connected status when RPC configured', async () => {
      const sdk = new ChronosVaultSDK({
        mode: 'rpc',
        rpc: {
          arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) },
          solana: { rpcUrl: 'https://mock.rpc', privateKey: '0x' },
          ton: { endpoint: 'https://mock.rpc' }
        }
      });
      
      const status = await sdk.getChainStatus();
      expect(status.arbitrum.connected).toBe(true);
      expect(status.solana.connected).toBe(true);
      expect(status.ton.connected).toBe(true);
    });
  });

  describe('Static Properties', () => {
    it('should return SDK version', () => {
      expect(ChronosVaultSDK.version).toBe('1.1.0');
    });
  });
});
