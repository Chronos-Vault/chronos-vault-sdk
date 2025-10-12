# Chronos Vault SDK

![version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![npm](https://img.shields.io/badge/npm-10+-CB3837?logo=npm)
![Trinity](https://img.shields.io/badge/Trinity-2/3_Consensus-green)
![Quantum](https://img.shields.io/badge/Quantum-Resistant-purple)
![Lean 4](https://img.shields.io/badge/Lean_4-35/35_Proven-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

**Official TypeScript/JavaScript SDK for Chronos Vault**

![Security](https://img.shields.io/badge/Security-Mathematically_Proven-success)
![Multi-Chain](https://img.shields.io/badge/Multi--Chain-ETH+SOL+TON-blue)
![Type-Safe](https://img.shields.io/badge/Type--Safe-100%25-green)

---

## 📦 Overview

The official TypeScript/JavaScript SDK for integrating Chronos Vault's mathematically provable security into your applications.

## ✨ Features

- 🔗 **Multi-Chain Support**: Ethereum/Arbitrum, Solana, and TON
- 📘 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Easy Integration**: Simple, intuitive API design
- 💼 **Wallet Integration**: MetaMask, Phantom, TON Keeper
- 🌉 **Cross-Chain**: Seamless cross-chain vault operations
- 🔐 **Zero-Knowledge**: Built-in ZK proof generation and verification
- 🛡️ **Quantum-Resistant**: ML-KEM-1024 and Dilithium-5 support

## 📥 Installation

```bash
npm install @chronos-vault/sdk
```

Or with yarn:
```bash
yarn add @chronos-vault/sdk
```

## 🚀 Quick Start

```typescript
import { ChronosVault } from '@chronos-vault/sdk';

// Initialize the SDK
const vault = new ChronosVault({
  network: 'testnet',
  chains: ['ethereum', 'solana', 'ton']
});

// Create a vault
const newVault = await vault.create({
  type: 'time-lock',
  unlockTime: Date.now() + 86400000, // 24 hours
  assets: [{
    token: 'ETH',
    amount: '1.0'
  }]
});

// Query vault status
const status = await vault.getStatus(newVault.id);
console.log(`Vault status: ${status.state}`);
```

## 🎯 Supported Features

### Vault Operations
- ✅ Create vaults (22 different types)
- ✅ Query vault status
- ✅ Update vault settings
- ✅ Unlock vaults
- ✅ Transfer vault ownership
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
- ✅ TON Wallet (TON)

## 📖 Documentation

For complete documentation, visit:
- **[Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)** - Full API reference
- **[Platform Repo](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Example usage
- **Official Website**: https://chronosvault.org/developers

## 💻 Examples

### Basic Vault Creation
```typescript
const vault = await chronos.createVault({
  type: 'multi-signature',
  requiredSigners: 3,
  totalSigners: 5,
  assets: [{ token: 'USDC', amount: '1000' }]
});
```

### Cross-Chain Bridge
```typescript
const bridge = await chronos.bridgeAsset({
  from: 'ethereum',
  to: 'solana',
  token: 'CVT',
  amount: '100'
});
```

### Zero-Knowledge Proof
```typescript
const proof = await chronos.generateOwnershipProof(vaultId);
const isValid = await chronos.verifyProof(proof);
```

## 🔗 Related Repositories

- **[Main Platform](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Platform application
- **[Documentation](https://github.com/Chronos-Vault/chronos-vault-docs)** - Technical documentation
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Multi-chain contracts
- **[Security](https://github.com/Chronos-Vault/chronos-vault-security)** - Security audits and MDL

## 🤝 Contributing

We welcome contributions! Please:
1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Follow existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Chronos Vault

---

## 🌐 Community & Social Media

- **Medium**: [https://medium.com/@chronosvault](https://medium.com/@chronosvault) - Technical articles and updates
- **Dev.to**: [https://dev.to/chronosvault](https://dev.to/chronosvault) - Developer tutorials and guides
- **Discord**: [https://discord.gg/WHuexYSV](https://discord.gg/WHuexYSV) - Community discussions and support
- **X (Twitter)**: [https://x.com/chronosvaultx?s=21](https://x.com/chronosvaultx?s=21) - Latest news and announcements
- **Email**: chronosvault@chronosvault.org

---

**Built with ❤️ for the future of mathematically provable blockchain security**
