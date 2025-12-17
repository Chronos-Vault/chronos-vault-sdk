# @chronos-vault/sdk

Official TypeScript/JavaScript SDK for **Chronos Vault** and **Trinity Protocol**.

Trinity Protocol provides mathematically provable 2-of-3 consensus verification across Arbitrum, Solana, and TON blockchains.

## Installation

```bash
npm install @chronos-vault/sdk
# or
yarn add @chronos-vault/sdk
# or
pnpm add @chronos-vault/sdk
```

## Quick Start

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

// Initialize the SDK
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://api.chronosvault.org',
});

// Get Trinity Protocol stats
const stats = await sdk.trinity.getStats();
console.log('Total Vaults:', stats.vaults.totalVaults);
console.log('Consensus Success Rate:', stats.validators.consensusSuccessRate);
```

## Features

### Trinity Protocol Client
Access the 2-of-3 multi-chain consensus system:

```typescript
// Get chain status
const chains = await sdk.trinity.getChains();

// Get validators
const validators = await sdk.trinity.getValidators();

// Get security layers (8 MDL layers)
const layers = sdk.trinity.getSecurityLayers();

// Get deployed contract addresses
const contracts = sdk.trinity.getContracts();
```

### HTLC Client
Create and manage atomic swaps:

```typescript
// Generate secret for swap
const { secret, secretHash } = sdk.htlc.generateSecret();

// Create a swap
const swap = await sdk.htlc.createSwap({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '1000000000', // 1 ETH in wei
  participant: '0x...',
  timeLockHours: 24,
});

// Claim swap with secret
await sdk.htlc.claimSwap({
  swapId: swap.id,
  secret: secret,
});
```

### Vault Client
Create and manage secure vaults:

```typescript
// Create a time-lock vault
const vault = await sdk.vault.createVault({
  name: 'My Savings Vault',
  vaultType: 'timelock',
  chain: 'arbitrum',
  depositAmount: '1000000000000000000', // 1 ETH
  timeLockDuration: 365 * 24 * 60 * 60, // 1 year
});

// Deposit funds
await sdk.vault.deposit({
  vaultId: vault.id,
  amount: '500000000000000000', // 0.5 ETH
});

// Get vault types
const vaultTypes = sdk.vault.getVaultTypes();
```

### Bridge Client
Transfer assets across chains:

```typescript
// Check bridge status
const status = await sdk.bridge.getBridgeStatus('arbitrum', 'solana');

// Estimate fees
const fees = await sdk.bridge.estimateFees({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '1000000000',
  assetType: 'ETH',
});

// Transfer assets
const transfer = await sdk.bridge.transfer({
  sourceChain: 'arbitrum',
  targetChain: 'solana',
  amount: '1000000000',
  assetType: 'ETH',
  senderAddress: '0x...',
  recipientAddress: '...',
});
```

## Deployed Contracts

### Arbitrum Sepolia (Testnet)

| Contract | Address |
|----------|---------|
| TrinityConsensusVerifier | `0x59396D58Fa856025bD5249E342729d5550Be151C` |
| TrinityShieldVerifierV2 | `0x5E1EE00E5DFa54488AC5052C747B97c7564872F9` |
| ChronosVaultOptimized | `0xAE408eC592f0f865bA0012C480E8867e12B4F32D` |
| HTLCChronosBridge | `0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca` |

### Solana Devnet

| Program | Address |
|---------|---------|
| Trinity Validator | `CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2` |
| CVT Token | `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4` |

### TON Testnet

| Contract | Address |
|----------|---------|
| TrinityConsensus | `EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8` |
| ChronosVault | `EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4` |

## Configuration

```typescript
const sdk = new ChronosVaultSDK({
  network: 'testnet',           // 'testnet' or 'mainnet'
  apiBaseUrl: 'https://api.chronosvault.org',
  apiKey: 'your-api-key',       // Optional
  arbitrumRpcUrl: 'https://...', // Optional custom RPC
  solanaRpcUrl: 'https://...',
  tonRpcUrl: 'https://...',
  timeout: 30000,               // Request timeout in ms
});
```

## The 8 Mathematical Defense Layers

Trinity Protocol implements 8 cryptographic security layers:

1. **Zero-Knowledge Proof Engine** - Groth16 ZK-SNARKs
2. **Formal Verification Pipeline** - Lean 4 theorem proofs
3. **Multi-Party Computation** - Shamir + CRYSTALS-Kyber
4. **Verifiable Delay Functions** - Wesolowski VDF time-locks
5. **AI + Cryptographic Governance** - Anomaly detection
6. **Quantum-Resistant Cryptography** - ML-KEM-1024, Dilithium-5
7. **Trinity Protocol™ Consensus** - 2-of-3 multi-chain
8. **Trinity Shield™ TEE** - Intel SGX/AMD SEV enclaves

## Links

- **Website:** https://chronosvault.org
- **Documentation:** https://docs.chronosvault.org
- **GitHub:** https://github.com/Chronos-Vault
- **Contact:** chronosvault@chronosvault.org

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Built by Chronos Vault Team*
