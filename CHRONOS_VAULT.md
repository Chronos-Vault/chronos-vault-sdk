# Chronos Vault SDK - Complete Developer Guide

**Version:** 1.1.0  
**Last Updated:** December 2025  
**Status:** Production Ready (Testnet)

---

## What is Chronos Vault?

Chronos Vault is an enterprise-grade multi-chain security system implementing Trinity Protocol's mathematically provable 2-of-3 consensus verification across three blockchains:

- **Arbitrum** (Ethereum L2) - Primary security layer
- **Solana** - High-frequency monitoring
- **TON** - Emergency recovery & quantum-safe storage

## Why Use Trinity Protocol?

Traditional cross-chain bridges have a single point of failure. Trinity Protocol eliminates this:

```
❌ Single Bridge:        1 chain compromised = Total loss
✅ Trinity Protocol:     1 chain compromised = Still secure
```

**Mathematical Guarantee**: Requires 2-of-3 independent blockchains to approve every operation. Even if one chain is attacked, your assets remain secure.

---

## Quick Start (5 Minutes)

### 1. Install

```bash
npm install @chronos-vault/sdk
```

### 2. Initialize

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
});
```

### 3. Create Your First Vault

```typescript
const vault = await sdk.vault.createVault({
  name: 'My Secure Vault',
  vaultType: 'standard',
  chain: 'arbitrum',
  depositAmount: '0.1', // 0.1 ETH
});

console.log('Vault created:', vault.id);
console.log('Address:', vault.address);
```

---

## Core Concepts

### 1. Vaults

Secure storage for your assets with Trinity verification:

```typescript
// Create vault
const vault = await sdk.vault.createVault({
  name: 'Savings',
  vaultType: 'erc4626',
  chain: 'arbitrum',
  depositAmount: '1.0',
});

// Deposit
await sdk.vault.deposit(vault.id, '0.5');

// Withdraw (requires 2-of-3 consensus)
await sdk.vault.withdraw(vault.id, '0.25');

// Check balance
const details = await sdk.vault.getVault(vault.id);
```

### 2. Atomic Swaps (HTLC)

Trustless cross-chain trades without intermediaries:

```typescript
// Generate secret
const { secret, secretHash } = sdk.htlc.generateSecret();

// Create swap: 1 ETH on Arbitrum → SOL on Solana
const swap = await sdk.htlc.createSwap({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '1.0',
  participant: '0x...', // Counterparty
  timeLockHours: 24,
});

// Counterparty claims with your secret
await sdk.htlc.claimSwap({
  swapId: swap.id,
  secret: secret,
});

// Refund if never claimed
await sdk.htlc.refundSwap(swap.id);
```

### 3. Cross-Chain Bridge

Transfer assets between chains with Trinity verification:

```typescript
// Check supported routes
const status = await sdk.bridge.getBridgeStatus('arbitrum', 'ton');

// Estimate fees
const fees = await sdk.bridge.estimateFees({
  sourceChain: 'arbitrum',
  targetChain: 'ton',
  amount: '10.0',
  assetType: 'ETH',
});

// Transfer
const transfer = await sdk.bridge.initiateTransfer({
  sourceChain: 'arbitrum',
  targetChain: 'ton',
  amount: '10.0',
  assetType: 'ETH',
  senderAddress: '0x...',
  recipientAddress: 'EQ...',
});

// Track status
const status = await sdk.bridge.getTransferStatus(transfer.id);
```

### 4. Trinity Consensus

Monitor 2-of-3 verification for operations:

```typescript
// Submit operation
const operation = await sdk.trinity.submitConsensusOperation({
  operationType: 'vault_unlock',
  data: { vaultId: 'vault-123', amount: '5.0' },
});

// Check confirmations
const status = await sdk.trinity.getOperationStatus(operation.id);
console.log('Confirmations:', status.confirmations, '/ 2 required');
console.log('Arbitrum:', status.chains.arbitrum.confirmed ? '✓' : 'pending');
console.log('Solana:', status.chains.solana.confirmed ? '✓' : 'pending');
console.log('TON:', status.chains.ton.confirmed ? '✓' : 'pending');
```

---

## Configuration Modes

### API Mode (Default - Recommended)

Use Chronos Vault's backend API:

```typescript
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
  apiKey: 'your-api-key', // Optional
  timeout: 30000,
});
```

**Best for:** Web apps, most developers, fastest integration

### RPC Mode (Direct Blockchain)

Direct smart contract interaction without API:

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
```

**Best for:** Advanced users, custom applications, maximum control

### Hybrid Mode

Combine API convenience with RPC control:

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

**Best for:** Complex applications needing both approaches

---

## RPC Clients

For advanced developers using direct blockchain interactions:

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
await vault.withdraw('0.5');

// Cross-chain bridge
const bridge = new BridgeRPCClient(rpcConfig);
const fee = await bridge.getMessageFee('solana');
const { txHash, messageId } = await bridge.sendMessage('solana', recipient, data);
```

---

## Deployed Contracts

### Arbitrum Sepolia (Testnet)

```
TrinityConsensusVerifier    0x59396D58Fa856025bD5249E342729d5550Be151C
TrinityShieldVerifierV2     0x5E1EE00E5DFa54488AC5052C747B97c7564872F9
ChronosVaultOptimized       0xAE408eC592f0f865bA0012C480E8867e12B4F32D
HTLCChronosBridge           0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca
CrossChainMessageRelay      0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59
TrinityExitGateway          0xE6FeBd695e4b5681DCF274fDB47d786523796C04
TrinityKeeperRegistry       0xAe9bd988011583D87d6bbc206C19e4a9Bda04830
```

### Solana Devnet

```
Trinity Validator           CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2
CVT Token                   5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4
Bridge Program              6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK
Vesting Program             3dxjcEGP8MurCtodLCJi1V6JBizdRRAYg91nZkhmX1sB
```

### TON Testnet

```
TrinityConsensus            EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8
ChronosVault                EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4
CrossChainBridge            EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA
CVT Jetton                  EQDJAnXDPT-NivritpEhQeP0XmG20NdeUtxgh4nUiWH-DF7M
```

See `networks.json` for complete configuration.

---

## Error Handling

```typescript
import { SDKError, ProviderError, ConsensusError } from '@chronos-vault/sdk';

try {
  await sdk.vault.withdraw(vaultId, amount);
} catch (error) {
  if (error instanceof ConsensusError) {
    console.log('Consensus failed:', error.confirmations, 'of 2 required');
    // Only 0-1 chains confirmed, retry later
  } else if (error instanceof ProviderError) {
    console.log('Chain error:', error.chain);
    // Blockchain connection issue
  } else if (error instanceof SDKError) {
    console.log('SDK error:', error.code, error.message);
  }
}
```

---

## Security Architecture

Trinity Protocol implements **8 Mathematical Defense Layers**:

1. **Zero-Knowledge Proofs** - Groth16 ZK-SNARKs for privacy
2. **Formal Verification** - Lean 4 theorem proofs
3. **Multi-Party Computation** - Shamir + CRYSTALS-Kyber
4. **Verifiable Delay Functions** - Wesolowski time-locks
5. **AI Governance** - Anomaly detection
6. **Quantum Resistance** - ML-KEM-1024, Dilithium-5
7. **Trinity Consensus** - 2-of-3 multi-chain verification
8. **Trinity Shield TEE** - Intel SGX/AMD SEV enclaves

**All 33 contracts are formally verified with Lean 4 proofs.**

---

## Examples

See the `examples/` directory:

- `basic-vault.ts` - Create and manage vaults
- `atomic-swap.ts` - Cross-chain HTLC swaps
- `bridge-transfer.ts` - Asset bridging between chains
- `consensus-tracking.ts` - Monitor Trinity verification

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
  TransferStatus,
} from '@chronos-vault/sdk';

const config: ChronosVaultConfig = {
  network: 'testnet',
  mode: 'api',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
};
```

---

## API Reference

### Trinity Protocol

```typescript
// Get stats
const stats = await sdk.trinity.getStats();

// Get chain status
const chains = await sdk.trinity.getChains();

// Get validators
const validators = await sdk.trinity.getValidators();

// Submit operation
const op = await sdk.trinity.submitConsensusOperation({...});

// Check operation status
const status = await sdk.trinity.getOperationStatus(opId);

// Get security layers
const layers = sdk.trinity.getSecurityLayers();
```

### Vault Management

```typescript
// Create vault
const vault = await sdk.vault.createVault({...});

// Get vault
const vault = await sdk.vault.getVault(vaultId);

// List vaults
const vaults = await sdk.vault.listVaults();

// Deposit
await sdk.vault.deposit(vaultId, amount);

// Withdraw
await sdk.vault.withdraw(vaultId, amount);

// Get vault types
const types = sdk.vault.getVaultTypes();
```

### HTLC Atomic Swaps

```typescript
// Generate secret
const { secret, secretHash } = sdk.htlc.generateSecret();

// Create swap
const swap = await sdk.htlc.createSwap({...});

// Get status
const status = await sdk.htlc.getSwapStatus(swapId);

// List swaps
const swaps = await sdk.htlc.listSwaps({ status: 'active' });

// Claim swap
await sdk.htlc.claimSwap({ swapId, secret });

// Refund swap
await sdk.htlc.refundSwap(swapId);
```

### Bridge

```typescript
// Get bridge status
const status = await sdk.bridge.getBridgeStatus(source, target);

// Estimate fees
const fees = await sdk.bridge.estimateFees({...});

// Initiate transfer
const transfer = await sdk.bridge.initiateTransfer({...});

// Get transfer status
const status = await sdk.bridge.getTransferStatus(transferId);
```

---

## Deployment Guides

- [Solana Deployment](./SOLANA_DEPLOYMENT.md)
- [API Integration](./docs/API_REFERENCE.md)
- [Wallet Integration](./docs/wallet-integration-api.md)

---

## Resources

| Resource | Link |
|----------|------|
| SDK Docs | [https://docs.chronosvault.org](https://github.com/Chronos-Vault/chronos-vault-sdk/blob/main/docs/SDK_USAGE.md) |
| API Docs | [https://docs.chronosvault.org/api](https://chronosvault.org/api-documentation) |
| GitHub | https://github.com/Chronos-Vault |
| Security Proofs | https://github.com/Chronos-Vault/chronos-vault-security |
| Website | https://chronosvault.org |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute.

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built by the Chronos Vault Team**
