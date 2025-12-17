/**
 * RPC Client Integration Tests
 * Tests the actual RPC clients with dependency-injected mock providers
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

import { TrinityRPCClient } from '../../src/trinity/rpc';
import { HTLCRPCClient } from '../../src/htlc/rpc';
import { VaultRPCClient } from '../../src/vault/rpc';

describe('TrinityRPCClient with Mocked Providers', () => {
  let trinityClient: TrinityRPCClient;

  beforeEach(() => {
    trinityClient = new TrinityRPCClient({
      arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) },
      solana: { rpcUrl: 'https://mock.rpc', privateKey: '0x' },
      ton: { endpoint: 'https://mock.rpc' }
    });
  });

  it('should instantiate with all providers', () => {
    expect(trinityClient).toBeDefined();
    expect(trinityClient.getArbitrumProvider()).toBeDefined();
    expect(trinityClient.getSolanaProvider()).toBeDefined();
    expect(trinityClient.getTonProvider()).toBeDefined();
  });

  it('should get consensus threshold', async () => {
    const threshold = await trinityClient.getConsensusThreshold();
    expect(threshold).toBe(2);
  });

  it('should get total chains', async () => {
    const total = await trinityClient.getTotalChains();
    expect(total).toBe(3);
  });

  it('should get validator addresses', async () => {
    const arbValidator = await trinityClient.getValidator(1);
    expect(arbValidator).toBe('0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8');
    
    const solValidator = await trinityClient.getValidator(2);
    expect(solValidator).toBe('0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5');
  });

  it('should get operation state', async () => {
    const state = await trinityClient.getOperationState('0x1234');
    expect(state.chainConfirmations).toBe(2);
    expect(state.arbitrumConfirmed).toBe(true);
    expect(state.solanaConfirmed).toBe(true);
    expect(state.tonConfirmed).toBe(false);
    expect(state.executed).toBe(false);
  });

  it('should check consensus', async () => {
    const hasConsensus = await trinityClient.hasConsensus('0x1234');
    expect(hasConsensus).toBe(true);
    
    const noConsensus = await trinityClient.hasConsensus('0xnonexistent');
    expect(noConsensus).toBe(false);
  });

  it('should get confirmation status', async () => {
    const status = await trinityClient.getConfirmationStatus('0x1234');
    expect(status.confirmations).toBe(2);
    expect(status.arbitrum).toBe(true);
    expect(status.solana).toBe(true);
    expect(status.ton).toBe(false);
  });

  it('should get multi-chain status', async () => {
    const status = await trinityClient.getMultiChainStatus();
    expect(status.arbitrum.connected).toBe(true);
    expect(status.solana.connected).toBe(true);
    expect(status.ton.connected).toBe(true);
  });
});

describe('HTLCRPCClient with Mocked Providers', () => {
  let htlcClient: HTLCRPCClient;

  beforeEach(() => {
    htlcClient = new HTLCRPCClient({
      arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) }
    });
  });

  it('should instantiate', () => {
    expect(htlcClient).toBeDefined();
  });

  it('should generate secret and hash', () => {
    const { secret, secretHash } = htlcClient.generateSecret();
    expect(secret).toBeDefined();
    expect(secretHash).toBeDefined();
    expect(secret).toMatch(/^0x[0-9a-f]{64}$/i);
    expect(secretHash).toMatch(/^0x[0-9a-f]{64}$/i);
  });

  it('should get swap state', async () => {
    const state = await htlcClient.getSwapState('0xswap1');
    expect(state.sender).toBe('0xSender');
    expect(state.recipient).toBe('0xRecipient');
    expect(state.claimed).toBe(false);
    expect(state.refunded).toBe(false);
  });

  it('should get swap status', async () => {
    const status = await htlcClient.getSwapStatus('0xswap1');
    expect(status.exists).toBe(true);
    expect(status.claimed).toBe(false);
    expect(status.refunded).toBe(false);
  });

  it('should return non-existent for unknown swap', async () => {
    const status = await htlcClient.getSwapStatus('0xunknown');
    expect(status.exists).toBe(false);
  });
});

describe('VaultRPCClient with Mocked Providers', () => {
  let vaultClient: VaultRPCClient;

  beforeEach(() => {
    vaultClient = new VaultRPCClient({
      arbitrum: { rpcUrl: 'https://mock.rpc', privateKey: '0x' + '1'.repeat(64) }
    });
  });

  it('should instantiate', () => {
    expect(vaultClient).toBeDefined();
  });

  it('should get vault info', async () => {
    const info = await vaultClient.getVaultInfo();
    expect(info.asset).toBeDefined();
    expect(info.totalAssets).toBeDefined();
    expect(info.consensusRequired).toBe(true);
    expect(info.trinityVerifier).toBe('0x59396D58Fa856025bD5249E342729d5550Be151C');
  });

  it('should get balance', async () => {
    const balance = await vaultClient.getBalance('0xUser');
    expect(balance).toBe('500000000000000000');
  });

  it('should get max deposit', async () => {
    const max = await vaultClient.maxDeposit('0xReceiver');
    expect(BigInt(max)).toBeGreaterThan(0n);
  });
});

describe('Error Handling in RPC Clients', () => {
  it('should throw SDKError when provider not configured', async () => {
    const trinityClient = new TrinityRPCClient({});
    await expect(trinityClient.getConsensusThreshold())
      .rejects.toThrow('Arbitrum provider not configured');
  });

  it('should throw SDKError for HTLC without Arbitrum', async () => {
    const htlcClient = new HTLCRPCClient({});
    await expect(htlcClient.getSwapState('0x1234'))
      .rejects.toThrow('Arbitrum provider not configured');
  });

  it('should throw SDKError for Vault without Arbitrum', async () => {
    const vaultClient = new VaultRPCClient({});
    await expect(vaultClient.getVaultInfo())
      .rejects.toThrow('Arbitrum provider not configured');
  });
});
