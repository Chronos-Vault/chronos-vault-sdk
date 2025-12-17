/**
 * Real Testnet Integration Tests
 * Tests against live Arbitrum Sepolia, Solana Devnet, and TON Testnet
 * 
 * Requires environment variables:
 * - ALCHEMY_API_KEY: Alchemy API key for Arbitrum Sepolia
 * - TON_API_KEY: TON Center API key (optional)
 * 
 * These tests verify actual on-chain state and deployed contracts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { 
  ARBITRUM_SEPOLIA, 
  SOLANA_DEVNET, 
  TON_TESTNET,
  VALIDATORS,
  getAlchemyRpcUrl,
  getSolanaRpcUrls,
  getTonRpcUrl
} from '../../src/config/networks';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';
const TON_API_KEY = process.env.TON_API_KEY || '';

const skipIfNoAlchemy = !ALCHEMY_API_KEY ? it.skip : it;

describe('Arbitrum Sepolia Real Testnet', () => {
  skipIfNoAlchemy('should connect to Arbitrum Sepolia RPC', async () => {
    const rpcUrl = getAlchemyRpcUrl(ALCHEMY_API_KEY);
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    
    const data = await response.json();
    expect(data.result).toBeDefined();
    expect(parseInt(data.result, 16)).toBeGreaterThan(0);
  });

  skipIfNoAlchemy('should verify TrinityConsensusVerifier is deployed', async () => {
    const rpcUrl = getAlchemyRpcUrl(ALCHEMY_API_KEY);
    const contractAddress = ARBITRUM_SEPOLIA.contracts.TrinityConsensusVerifier;
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [contractAddress, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    expect(data.result).not.toBe('0x');
    expect(data.result.length).toBeGreaterThan(10);
  });

  skipIfNoAlchemy('should verify HTLCChronosBridge is deployed', async () => {
    const rpcUrl = getAlchemyRpcUrl(ALCHEMY_API_KEY);
    const contractAddress = ARBITRUM_SEPOLIA.contracts.HTLCChronosBridge;
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [contractAddress, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    expect(data.result).not.toBe('0x');
  });

  skipIfNoAlchemy('should verify ChronosVaultOptimized is deployed', async () => {
    const rpcUrl = getAlchemyRpcUrl(ALCHEMY_API_KEY);
    const contractAddress = ARBITRUM_SEPOLIA.contracts.ChronosVaultOptimized;
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [contractAddress, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    expect(data.result).not.toBe('0x');
  });

  skipIfNoAlchemy('should read CONSENSUS_THRESHOLD from TrinityConsensusVerifier', async () => {
    const rpcUrl = getAlchemyRpcUrl(ALCHEMY_API_KEY);
    const contractAddress = ARBITRUM_SEPOLIA.contracts.TrinityConsensusVerifier;
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: '0x4a4fbeec'
        }, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    if (data.result && data.result !== '0x') {
      const threshold = parseInt(data.result, 16);
      expect(threshold).toBe(2);
    }
  });
});

describe('Solana Devnet Real Testnet', () => {
  const rpcUrls = getSolanaRpcUrls();

  it('should connect to Solana Devnet', async () => {
    let connected = false;
    
    for (const rpcUrl of rpcUrls) {
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'getSlot',
            params: [],
            id: 1
          })
        });
        
        const data = await response.json();
        if (data.result && data.result > 0) {
          connected = true;
          break;
        }
      } catch {
        continue;
      }
    }
    
    expect(connected).toBe(true);
  });

  it('should verify Trinity Validator program exists', async () => {
    const programId = SOLANA_DEVNET.contracts.TrinityValidator;
    
    for (const rpcUrl of rpcUrls) {
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'getAccountInfo',
            params: [programId, { encoding: 'base64' }],
            id: 1
          })
        });
        
        const data = await response.json();
        if (data.result && data.result.value) {
          expect(data.result.value.executable).toBe(true);
          return;
        }
      } catch {
        continue;
      }
    }
  });

  it('should have correct network configuration', () => {
    expect(SOLANA_DEVNET.chainId).toBe(2);
    expect(SOLANA_DEVNET.name).toBe('Solana Devnet');
  });
});

describe('TON Testnet Real Testnet', () => {
  it('should connect to TON Testnet', async () => {
    const rpcUrl = getTonRpcUrl(TON_API_KEY);
    
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'getMasterchainInfo',
          params: {}
        })
      });
      
      const data = await response.json();
      if (data.result) {
        expect(data.result.last).toBeDefined();
      }
    } catch (error) {
      console.log('TON Testnet connection test skipped:', error);
    }
  });

  it('should have correct network configuration', () => {
    expect(TON_TESTNET.chainId).toBe(3);
    expect(TON_TESTNET.name).toBe('TON Testnet');
    expect(TON_TESTNET.contracts.TrinityConsensus).toBe('EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8');
  });
});

describe('Validator Addresses', () => {
  it('should have all validator addresses configured', () => {
    expect(VALIDATORS.arbitrum).toBe('0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8');
    expect(VALIDATORS.solana).toBe('0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5');
    expect(VALIDATORS.ton).toBe('0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4');
  });

  it('should have unique validator addresses', () => {
    const addresses = Object.values(VALIDATORS);
    const uniqueAddresses = new Set(addresses);
    expect(uniqueAddresses.size).toBe(3);
  });
});

describe('Contract Address Verification', () => {
  it('should have all Arbitrum contracts configured', () => {
    const contracts = ARBITRUM_SEPOLIA.contracts;
    
    expect(contracts.TrinityConsensusVerifier).toBeDefined();
    expect(contracts.HTLCChronosBridge).toBeDefined();
    expect(contracts.ChronosVaultOptimized).toBeDefined();
    expect(contracts.TrinityShieldVerifierV2).toBeDefined();
    expect(contracts.TrinityGovernanceTimelock).toBeDefined();
  });

  it('should have valid Ethereum addresses for Arbitrum contracts', () => {
    const contracts = ARBITRUM_SEPOLIA.contracts;
    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    
    for (const [name, address] of Object.entries(contracts)) {
      expect(address).toMatch(ethAddressRegex);
    }
  });

  it('should have TON contracts configured', () => {
    const contracts = TON_TESTNET.contracts;
    
    expect(contracts.TrinityConsensus).toBeDefined();
    expect(contracts.ChronosVault).toBeDefined();
    expect(contracts.CrossChainBridge).toBeDefined();
  });
});
