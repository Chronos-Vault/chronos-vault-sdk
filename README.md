# Chronos Vault SDK

![version](https://img.shields.io/badge/version-3.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Trinity](https://img.shields.io/badge/Trinity-2/3_Consensus-green)
![Lean 4](https://img.shields.io/badge/Lean_4-78/78_Proven-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

**Official TypeScript/JavaScript SDK for Chronos Vault - Trinity Protocol v3.0**

---

## 📦 Overview

The official TypeScript/JavaScript SDK for integrating Chronos Vault's mathematically provable security into your applications.

### Trinity Protocol v3.0

- ✅ **78/78 Lean 4 formal proofs complete** (100%)
- ✅ **All 4 critical vulnerabilities fixed**
- ✅ **Production-ready**: November 3, 2025

---

## ✨ Features

- 🔗 **Multi-Chain Support**: Ethereum/Arbitrum, Solana, and TON
- 📘 **Type-Safe**: Full TypeScript support
- ⚡ **Easy Integration**: Simple, intuitive API
- 💼 **Wallet Integration**: MetaMask, Phantom, TON Keeper
- 🌉 **Cross-Chain**: Seamless vault operations
- 🔐 **Zero-Knowledge**: Built-in ZK proof generation
- 🛡️ **Quantum-Resistant**: ML-KEM-1024 and Dilithium-5

---

## 📥 Installation

```bash
npm install @chronos-vault/sdk
```

Or with yarn:
```bash
yarn add @chronos-vault/sdk
```

---

## 🚀 Quick Start

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

// Initialize the SDK
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  chains: ['ethereum', 'solana', 'ton']
});

await sdk.initialize();

// Create a time-locked vault
const vault = await sdk.createVault({
  type: 'time-lock',
  unlockTime: Date.now() + 86400000, // 24 hours
  assets: [{
    token: 'ETH',
    amount: '1.0'
  }]
});

// Query vault status
const status = await sdk.getStatus(vault.id);
console.log(`Vault status: ${status.state}`);
```

---

## 🎯 Supported Features

### Vault Operations
- ✅ Create vaults (22 different types)
- ✅ Query vault status
- ✅ Update vault settings
- ✅ Unlock vaults
- ✅ Transfer ownership
- ✅ Emergency recovery

### Cross-Chain Operations
- ✅ Bridge assets between chains
- ✅ Verify cross-chain state
- ✅ Monitor Trinity consensus (2-of-3)
- ✅ HTLC atomic swaps

### Zero-Knowledge Features
- ✅ Generate ZK proofs (Groth16)
- ✅ Verify vault ownership privately
- ✅ Privacy-preserving queries
- ✅ Selective disclosure

### Wallet Integration
- ✅ MetaMask (Ethereum/Arbitrum)
- ✅ WalletConnect (Multi-wallet)
- ✅ Phantom (Solana)
- ✅ Solflare (Solana)
- ✅ TON Keeper (TON)

---

## 💻 Examples

### Basic Vault Creation

```typescript
const vault = await sdk.createVault({
  type: 'multi-signature',
  requiredSigners: 3,
  totalSigners: 5,
  assets: [{ token: 'USDC', amount: '1000' }]
});
```

### Cross-Chain Bridge

```typescript
const bridge = await sdk.bridgeAsset({
  from: 'ethereum',
  to: 'solana',
  token: 'CVT',
  amount: '100'
});
```

### Zero-Knowledge Proof

```typescript
const proof = await sdk.generateOwnershipProof(vaultId);
const isValid = await sdk.verifyProof(proof);
```

### Trinity Protocol Consensus

```typescript
// Verify 2-of-3 consensus across blockchains
const consensus = await sdk.getCrossChainConsensus(vaultId);

if (consensus.verified >= 2) {
  console.log('Trinity Protocol consensus achieved!');
}
```

---

## 📖 API Reference

### SDK Initialization

```typescript
interface SDKConfig {
  network: 'mainnet' | 'testnet';
  chains: ('ethereum' | 'solana' | 'ton')[];
  rpcUrls?: {
    ethereum?: string;
    solana?: string;
    ton?: string;
  };
}

const sdk = new ChronosVaultSDK(config);
await sdk.initialize();
```

### Vault Methods

```typescript
// Create vault
await sdk.createVault(config: VaultConfig): Promise<Vault>

// Get vault
await sdk.getVault(vaultId: string): Promise<Vault>

// List vaults
await sdk.listVaults(): Promise<Vault[]>

// Update vault
await sdk.updateVault(vaultId: string, updates: Partial<VaultConfig>): Promise<Vault>

// Lock/unlock vault
await sdk.lockVault(vaultId: string): Promise<void>
await sdk.unlockVault(vaultId: string): Promise<void>
```

### Cross-Chain Methods

```typescript
// Bridge assets
await sdk.bridgeAsset(config: BridgeConfig): Promise<BridgeTx>

// Get cross-chain consensus
await sdk.getCrossChainConsensus(vaultId: string): Promise<Consensus>

// Verify Trinity Protocol
await sdk.verifyTrinityProtocol(
  ethereumTxHash: string,
  solanaTxHash: string,
  tonTxHash: string
): Promise<boolean>
```

### Zero-Knowledge Methods

```typescript
// Generate proof
await sdk.generateOwnershipProof(vaultId: string): Promise<Proof>

// Verify proof
await sdk.verifyProof(proof: Proof): Promise<boolean>

// Generate privacy-preserving query
await sdk.generatePrivateQuery(
  vaultId: string,
  queryType: 'balance' | 'ownership' | 'status'
): Promise<PrivateQuery>
```

---

## 🔗 Deployed Contracts (Trinity Protocol v3.0)

### Arbitrum Sepolia

- CrossChainBridgeOptimized v2.2: `0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30`
- HTLCBridge v2.0: `0x6cd3B1a72F67011839439f96a70290051fd66D57`
- ChronosVault: `0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91`

### Solana Devnet

- Trinity Validator: `5oD8S1TtkdJbAX7qhsGticU7JKxjwY4AbEeBdnkUrrKY`
- CVT Token: `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4`

### TON Testnet

- Trinity Consensus: `EQDx6yH5WH3Ex47h0PBnOBMzPCsmHdnL2snts3DZBO5CYVVJ`

---

## 📚 Documentation

For complete documentation, visit:
- **[Platform Repository](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Main application
- **[Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)** - Full API reference
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Contract code
- **[Security & Proofs](https://github.com/Chronos-Vault/chronos-vault-security)** - Formal verification

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- TypeScript 5+
- npm/yarn/pnpm

### Local Development

```bash
# Clone repository
git clone https://github.com/Chronos-Vault/chronos-vault-sdk.git
cd chronos-vault-sdk

# Install dependencies
npm install

# Build SDK
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## 🔗 Related Repositories

| Repository | Purpose | Link |
|------------|---------|------|
| **Platform** | Main application | [chronos-vault-platform-](https://github.com/Chronos-Vault/chronos-vault-platform-) |
| **Contracts** | Smart contracts | [chronos-vault-contracts](https://github.com/Chronos-Vault/chronos-vault-contracts) |
| **SDK** | TypeScript SDK (this repo) | [chronos-vault-sdk](https://github.com/Chronos-Vault/chronos-vault-sdk) |
| **Documentation** | Technical docs | [chronos-vault-docs](https://github.com/Chronos-Vault/chronos-vault-docs) |
| **Security** | Formal verification | [chronos-vault-security](https://github.com/Chronos-Vault/chronos-vault-security) |

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, concise code with comments
- Follow TypeScript best practices
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Chronos Vault

---

## 🌐 Community

- **Discord**: https://discord.gg/WHuexYSV
- **X (Twitter)**: https://x.com/chronosvaultx
- **Medium**: https://medium.com/@chronosvault
- **Email**: chronosvault@chronosvault.org

---

**Built with ❤️ for the future of mathematically provable blockchain security**

## 🎯 Trinity Protocol v3.0

- 78/78 Lean 4 theorems proven (100%)
- 2-of-3 consensus LIVE across Arbitrum + Solana + TON
- Production-ready: November 3, 2025
