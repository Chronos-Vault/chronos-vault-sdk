# Chronos Vault SDK Usage Guide

**Version:** 1.1.0  
**Last Updated:** December 2025  
**Package:** `@chronos-vault/sdk`

## Overview

The Chronos Vault SDK provides a TypeScript/JavaScript client library for integrating with the Trinity Protocol multi-chain consensus system across Arbitrum, Solana, and TON blockchains.

## Installation

```bash
# npm
npm install @chronos-vault/sdk

# yarn
yarn add @chronos-vault/sdk

# pnpm
pnpm add @chronos-vault/sdk
```

## Quick Start

### API Mode (Default)

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://api.chronosvault.org',
  apiKey: 'your-api-key', // Optional
});

// Get Trinity Protocol statistics
const stats = await sdk.trinity.getStats();
console.log('Total Vaults:', stats.vaults.totalVaults);
console.log('Consensus Success Rate:', stats.validators.consensusSuccessRate);
```

### RPC Mode (Direct Blockchain Access)

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  mode: 'rpc',
  rpc: {
    arbitrum: {
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
      privateKey: process.env.PRIVATE_KEY,
      chainId: 421614,
    },
    solana: {
      rpcUrl: 'https://api.devnet.solana.com',
      commitment: 'confirmed',
    },
    ton: {
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
      network: 'testnet',
    },
  },
});

// Direct blockchain operations
const blockNumber = await sdk.providers?.arbitrum?.getBlockNumber();
```

## Core Modules

### Trinity Protocol Client

```typescript
// Get protocol statistics
const stats = await sdk.trinity.getStats();

// Get chain status
const chainStatus = await sdk.trinity.getChainStatus('arbitrum');

// Get validators
const validators = await sdk.trinity.getValidators();

// Submit consensus operation
const operation = await sdk.trinity.submitConsensusOperation({
  operationType: 'vault_unlock',
  data: { vaultId: 'vault-123' },
});

// Track consensus progress
const status = await sdk.trinity.getOperationStatus(operation.id);
console.log(`Confirmations: ${status.confirmations}/2`);
```

### HTLC Atomic Swaps

```typescript
// Generate secret for swap
const { secret, secretHash } = sdk.htlc.generateSecret();

// Create a swap
const swap = await sdk.htlc.createSwap({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '1.0',
  participant: '0x...',
  timeLockHours: 24,
});

// Claim swap with secret
await sdk.htlc.claimSwap({
  swapId: swap.id,
  secret: secret,
});

// Refund expired swap
await sdk.htlc.refundSwap(swap.id);
```

### Vault Management

```typescript
// Create a vault
const vault = await sdk.vault.createVault({
  name: 'My Secure Vault',
  vaultType: 'erc4626',
  chain: 'arbitrum',
  depositAmount: '10.0',
});

// Get vault details
const details = await sdk.vault.getVault(vault.id);

// Deposit to vault
await sdk.vault.deposit(vault.id, '5.0');

// Withdraw from vault
await sdk.vault.withdraw(vault.id, '2.5');

// Get vault types
const vaultTypes = sdk.vault.getVaultTypes();
```

### Cross-Chain Bridge

```typescript
// Check bridge status
const status = await sdk.bridge.getBridgeStatus('arbitrum', 'solana');

// Estimate fees
const fees = await sdk.bridge.estimateFees({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '100.0',
  assetType: 'ETH',
});

// Transfer assets
const transfer = await sdk.bridge.initiateTransfer({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '50.0',
  assetType: 'ETH',
  senderAddress: '0x...',
  recipientAddress: '...',
});
```

## RPC Clients

For direct blockchain interaction without API:

### TrinityRPCClient

```typescript
import { TrinityRPCClient } from '@chronos-vault/sdk';

const client = new TrinityRPCClient(rpcConfig);
await client.verifyConsensus(operationId);
await client.getConsensusState(operationId);
```

### HTLCRPCClient

```typescript
import { HTLCRPCClient } from '@chronos-vault/sdk';

const client = new HTLCRPCClient(rpcConfig);
await client.initiateSwap({ participant, hashLock, timeLock, amount });
await client.claimSwap(swapId, secret);
```

### VaultRPCClient

```typescript
import { VaultRPCClient } from '@chronos-vault/sdk';

const client = new VaultRPCClient(rpcConfig);
await client.deposit('10.0');
await client.withdraw('5.0');
await client.getVaultBalance(address);
```

### BridgeRPCClient

```typescript
import { BridgeRPCClient } from '@chronos-vault/sdk';

const client = new BridgeRPCClient(rpcConfig);
const fee = await client.getMessageFee('solana');
const { txHash, messageId } = await client.sendMessage('solana', recipient, data);
const status = await client.getMessageStatus(messageId);
```

## Deployed Contract Addresses

### Arbitrum Sepolia (Testnet)

| Contract | Address |
|----------|---------|
| TrinityConsensusVerifier | `0x59396D58Fa856025bD5249E342729d5550Be151C` |
| TrinityShieldVerifierV2 | `0x5E1EE00E5DFa54488AC5052C747B97c7564872F9` |
| ChronosVaultOptimized | `0xAE408eC592f0f865bA0012C480E8867e12B4F32D` |
| HTLCChronosBridge | `0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca` |
| CrossChainMessageRelay | `0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59` |
| TrinityExitGateway | `0xE6FeBd695e4b5681DCF274fDB47d786523796C04` |
| TrinityKeeperRegistry | `0xAe9bd988011583D87d6bbc206C19e4a9Bda04830` |
| TrinityGovernanceTimelock | `0xf6b9AB802b323f8Be35ca1C733e155D4BdcDb61b` |

### Solana Devnet

| Program | Address |
|---------|---------|
| Trinity Validator | `CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2` |
| CVT Token | `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4` |
| Bridge Program | `6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK` |
| Vesting Program | `3dxjcEGP8MurCtodLCJi1V6JBizdRRAYg91nZkhmX1sB` |

### TON Testnet

| Contract | Address |
|----------|---------|
| TrinityConsensus | `EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8` |
| ChronosVault | `EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4` |
| CrossChainBridge | `EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA` |
| CVT Jetton | `EQDJAnXDPT-NivritpEhQeP0XmG20NdeUtxgh4nUiWH-DF7M` |

## Configuration Options

```typescript
interface ChronosVaultConfig {
  network: 'mainnet' | 'testnet';
  apiBaseUrl: string;
  apiKey?: string;
  timeout?: number;
  mode?: 'api' | 'rpc' | 'hybrid';
  rpc?: {
    arbitrum?: {
      rpcUrl: string;
      privateKey?: string;
      chainId?: number;
    };
    solana?: {
      rpcUrl: string;
      privateKey?: string;
      commitment?: 'processed' | 'confirmed' | 'finalized';
    };
    ton?: {
      endpoint: string;
      apiKey?: string;
      mnemonic?: string;
      network?: 'mainnet' | 'testnet';
    };
  };
}
```

## Error Handling

```typescript
import { SDKError, ProviderError, ConsensusError } from '@chronos-vault/sdk';

try {
  await sdk.trinity.submitConsensusOperation({ ... });
} catch (error) {
  if (error instanceof ConsensusError) {
    console.log('Consensus failed:', error.confirmations, 'of 2 required');
  } else if (error instanceof ProviderError) {
    console.log('Chain error on:', error.chain);
  } else if (error instanceof SDKError) {
    console.log('SDK error:', error.code, error.message);
  }
}
```

## The 8 Mathematical Defense Layers

Trinity Protocol implements 8 cryptographic security layers:

1. **Zero-Knowledge Proof Engine** - Groth16 ZK-SNARKs
2. **Formal Verification Pipeline** - Lean 4 theorem proofs
3. **Multi-Party Computation** - Shamir + CRYSTALS-Kyber
4. **Verifiable Delay Functions** - Wesolowski VDF time-locks
5. **AI + Cryptographic Governance** - Anomaly detection
6. **Quantum-Resistant Cryptography** - ML-KEM-1024, Dilithium-5
7. **Trinity Protocol Consensus** - 2-of-3 multi-chain
8. **Trinity Shield TEE** - Intel SGX/AMD SEV enclaves

## Resources

- Website: https://chronosvault.org
- Documentation: https://docs.chronosvault.org
- GitHub: https://github.com/Chronos-Vault
- SDK Repository: https://github.com/Chronos-Vault/chronos-vault-sdk
- Security Proofs: https://github.com/Chronos-Vault/chronos-vault-security

## License

MIT License
