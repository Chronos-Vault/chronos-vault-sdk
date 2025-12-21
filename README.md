# @chronos-vault/sdk

[![npm version](https://img.shields.io/npm/v/@chronos-vault/sdk.svg)](https://www.npmjs.com/package/@chronos-vault/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**The official TypeScript SDK for Trinity Protocol** - A mathematically provable 2-of-3 consensus verification system across Arbitrum, Solana, and TON blockchains.

## Why Trinity Protocol?

Traditional cross-chain bridges are vulnerable to single points of failure. Trinity Protocol eliminates this by requiring **2 out of 3 independent blockchains** to verify every operation:

- **Arbitrum** - Primary security layer (Ethereum L2)
- **Solana** - High-frequency monitoring
- **TON** - Emergency recovery & quantum-safe storage

This means even if one blockchain is compromised, your assets remain secure.

---

## Installation

```bash
npm install @chronos-vault/sdk
```

```bash
yarn add @chronos-vault/sdk
```

```bash
pnpm add @chronos-vault/sdk
```

---

## Quick Start

### 5-Minute Integration

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

// 1. Initialize the SDK
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
});

// 2. Check Trinity Protocol status
const stats = await sdk.trinity.getStats();
console.log('Protocol is live!');
console.log('Active vaults:', stats.vaults.totalVaults);
console.log('Consensus rate:', stats.validators.consensusSuccessRate + '%');

// 3. Create your first vault
const vault = await sdk.vault.createVault({
  name: 'My First Vault',
  vaultType: 'standard',
  chain: 'arbitrum',
  depositAmount: '0.1', // 0.1 ETH
});

console.log('Vault created:', vault.id);
console.log('Address:', vault.address);
```

---

## Core Features

### 1. Secure Vaults

Create ERC-4626 compliant vaults with Trinity Protocol security:

```typescript
// Create a time-locked vault
const vault = await sdk.vault.createVault({
  name: 'Savings Vault',
  vaultType: 'timelock',
  chain: 'arbitrum',
  depositAmount: '1.0',
  timeLockDuration: 30 * 24 * 60 * 60, // 30 days
});

// Deposit more funds
await sdk.vault.deposit(vault.id, '0.5');

// Withdraw (requires 2-of-3 consensus)
await sdk.vault.withdraw(vault.id, '0.25');

// Check balance
const details = await sdk.vault.getVault(vault.id);
console.log('Balance:', details.balance);
```

### 2. Cross-Chain Atomic Swaps (HTLC)

Trustless swaps between Arbitrum, Solana, and TON:

```typescript
// Generate cryptographic secret
const { secret, secretHash } = sdk.htlc.generateSecret();

// Create swap: Send ETH on Arbitrum, receive SOL on Solana
const swap = await sdk.htlc.createSwap({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '1.0',
  participant: '0x...', // Counterparty address
  timeLockHours: 24,
});

console.log('Swap created:', swap.id);
console.log('Share this secret hash with counterparty:', swap.secretHash);

// Counterparty claims with the secret you share
await sdk.htlc.claimSwap({
  swapId: swap.id,
  secret: secret,
});
```

### 3. Cross-Chain Bridge

Transfer assets between chains with Trinity verification:

```typescript
// Estimate transfer fees
const fees = await sdk.bridge.estimateFees({
  sourceChain: 'arbitrum',
  targetChain: 'ton',
  amount: '10.0',
  assetType: 'ETH',
});

console.log('Total fee:', fees.totalFee, 'ETH');
console.log('Estimated time:', fees.estimatedTime, 'seconds');

// Initiate transfer
const transfer = await sdk.bridge.initiateTransfer({
  sourceChain: 'arbitrum',
  targetChain: 'ton',
  amount: '10.0',
  assetType: 'ETH',
  senderAddress: '0x...',
  recipientAddress: 'EQ...',
});

// Track transfer status
const status = await sdk.bridge.getTransferStatus(transfer.id);
```

### 4. Trinity Consensus Operations

Submit operations requiring 2-of-3 verification:

```typescript
// Submit operation
const operation = await sdk.trinity.submitConsensusOperation({
  operationType: 'vault_unlock',
  data: { vaultId: 'vault-123', amount: '5.0' },
});

// Track consensus progress
const status = await sdk.trinity.getOperationStatus(operation.id);
console.log('Confirmations:', status.confirmations, '/ 2 required');
console.log('Arbitrum:', status.chains.arbitrum.confirmed ? '✓' : 'pending');
console.log('Solana:', status.chains.solana.confirmed ? '✓' : 'pending');
console.log('TON:', status.chains.ton.confirmed ? '✓' : 'pending');
```

---

## Configuration Modes

### API Mode (Recommended for Most Apps)

```typescript
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
  apiKey: 'your-api-key', // Optional
  timeout: 30000,
});
```

### RPC Mode (Direct Blockchain Access)

For advanced users who want to interact directly with smart contracts:

```typescript
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

// Direct contract calls
const blockNumber = await sdk.providers?.arbitrum?.getBlockNumber();
```

### Hybrid Mode (API + RPC)

Use API for convenience, RPC for specific operations:

```typescript
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  mode: 'hybrid',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
  rpc: {
    arbitrum: { rpcUrl: '...', privateKey: '...' },
  },
});
```

---

## RPC Clients

For direct blockchain interaction without the main SDK:

```typescript
import { TrinityRPCClient, HTLCRPCClient, VaultRPCClient, BridgeRPCClient } from '@chronos-vault/sdk';

// Trinity consensus verification
const trinity = new TrinityRPCClient(rpcConfig);
await trinity.verifyConsensus(operationId);

// HTLC atomic swaps
const htlc = new HTLCRPCClient(rpcConfig);
await htlc.initiateSwap({ participant, hashLock, timeLock, amount });

// Vault operations
const vault = new VaultRPCClient(rpcConfig);
await vault.deposit('1.0');

// Cross-chain messaging
const bridge = new BridgeRPCClient(rpcConfig);
const fee = await bridge.getMessageFee('solana');
await bridge.sendMessage('solana', recipient, data);
```

---

## Error Handling

```typescript
import { SDKError, ProviderError, ConsensusError } from '@chronos-vault/sdk';

try {
  await sdk.vault.withdraw(vaultId, amount);
} catch (error) {
  if (error instanceof ConsensusError) {
    // 2-of-3 consensus not reached
    console.log('Consensus failed:', error.confirmations, 'of 2 required');
    console.log('Retry or check chain status');
  } else if (error instanceof ProviderError) {
    // Blockchain connection issue
    console.log('Chain error:', error.chain, error.message);
  } else if (error instanceof SDKError) {
    // General SDK error
    console.log('Error:', error.code, error.message);
  }
}
```

---

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

### Solana Devnet

| Program | Address |
|---------|---------|
| Trinity Validator | `CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2` |
| CVT Token | `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4` |
| Bridge Program | `6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK` |

### TON Testnet

| Contract | Address |
|----------|---------|
| TrinityConsensus | `EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8` |
| ChronosVault | `EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4` |
| CrossChainBridge | `EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA` |
| CVT Jetton | `EQDJAnXDPT-NivritpEhQeP0XmG20NdeUtxgh4nUiWH-DF7M` |

---

## Security Architecture

Trinity Protocol implements **8 Mathematical Defense Layers**:

| Layer | Technology | Purpose |
|-------|------------|---------|
| 1 | Zero-Knowledge Proofs | Privacy with Groth16 ZK-SNARKs |
| 2 | Formal Verification | Lean 4 mathematical proofs |
| 3 | Multi-Party Computation | Shamir + CRYSTALS-Kyber key management |
| 4 | Verifiable Delay Functions | Time-lock security |
| 5 | AI Governance | Anomaly detection |
| 6 | Quantum Resistance | ML-KEM-1024, Dilithium-5 |
| 7 | Trinity Consensus | 2-of-3 multi-chain verification |
| 8 | Trinity Shield TEE | Intel SGX/AMD SEV hardware enclaves |

---

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  ChronosVaultConfig,
  VaultType,
  SwapStatus,
  ConsensusOperation,
  ChainStatus,
} from '@chronos-vault/sdk';
```

---

## Examples

See the [examples](./examples) directory for complete working examples:

- `basic-vault.ts` - Create and manage vaults
- `atomic-swap.ts` - Cross-chain HTLC swaps
- `bridge-transfer.ts` - Asset bridging
- `consensus-tracking.ts` - Monitor 2-of-3 verification

---

## Resources

| Resource | Link |
|----------|------|
| Documentation | https://docs.chronosvault.org |
| API Reference | https://docs.chronosvault.org/api |
| GitHub | https://github.com/Chronos-Vault |
| Security Proofs | https://github.com/Chronos-Vault/chronos-vault-security |
| Website | https://chronosvault.org |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built by the Chronos Vault Team**
