<div align="center">

# CHRONOS VAULT SDK

### TypeScript/JavaScript SDK

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Web3](https://img.shields.io/badge/Web3-F16822?style=for-the-badge&logo=web3.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Developer SDK for Chronos Vault Integration**

[Website](https://chronosvault.org) • [Documentation](https://github.com/Chronos-Vault/chronos-vault-docs) • [Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)

</div>

---

## 📦 Overview

The Chronos Vault SDK provides a simple, type-safe interface for developers to integrate multi-chain vault functionality into their applications.

## ✨ Features

- 🔐 **Multi-Chain Support** - Ethereum, Solana, TON
- 🔄 **Atomic Swaps** - HTLC cross-chain exchanges
- 💼 **Vault Management** - Create and manage digital vaults
- 🛡️ **Trinity Protocol** - Built-in 2-of-3 consensus
- 📝 **TypeScript** - Full type safety
- 🚀 **Easy Integration** - Simple API

## 📥 Installation

```bash
npm install @chronos-vault/sdk
```

## 🚀 Quick Start

```typescript
import { ChronosVault } from '@chronos-vault/sdk';

// Initialize
const vault = new ChronosVault({
  network: 'testnet',
  chains: ['ethereum', 'solana', 'ton']
});

// Create a vault
const newVault = await vault.create({
  type: 'TIME_LOCK',
  unlockTime: Date.now() + 86400000, // 24 hours
  assets: [{
    chain: 'ethereum',
    token: '0x...',
    amount: '1000000000000000000' // 1 ETH
  }]
});

// Execute atomic swap
const swap = await vault.atomicSwap({
  from: { chain: 'ethereum', amount: '1.0', token: 'ETH' },
  to: { chain: 'solana', amount: '50', token: 'SOL' },
  timeout: 48 * 3600 // 48 hours
});
```

## 📖 Documentation

### Vault Types
- **TIME_LOCK** - Time-locked vaults
- **MULTI_SIG** - Multi-signature vaults
- **QUANTUM_SAFE** - Quantum-resistant vaults
- **GEO_LOCK** - Location-based vaults
- **CROSS_CHAIN** - Multi-chain fragment vaults

### Supported Chains
- Ethereum / Arbitrum
- Solana
- TON
- Bitcoin (coming soon)

## 🛠️ API Reference

See [full API documentation](https://github.com/Chronos-Vault/chronos-vault-docs) for detailed information.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

<div align="center">

**Built with ❤️ by the Chronos Vault Team**

</div>
