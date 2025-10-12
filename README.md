<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Web3](https://img.shields.io/badge/Web3-F16822?style=for-the-badge&logo=web3.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

[Website](https://chronosvault.org) • [Documentation](https://github.com/Chronos-Vault/chronos-vault-docs) • [Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)

</div>

---

# Chronos Vault SDK

> Official TypeScript SDK for seamless integration with Chronos Vault - Multi-chain digital vault platform with Trinity Protocol security.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/@chronos-vault/sdk)](https://www.npmjs.com/package/@chronos-vault/sdk)

---

## 🚀 Quick Start

### Installation

```bash
npm install @chronos-vault/sdk
# or
yarn add @chronos-vault/sdk
# or
pnpm add @chronos-vault/sdk
```

### Basic Usage

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

// Initialize SDK
const sdk = new ChronosVaultSDK({
  apiEndpoint: 'https://chronosvault.org/api',
  enableZeroKnowledge: true,
  enableQuantumResistance: true
});

// Initialize
await sdk.initialize();

// Connect wallet
const wallet = await sdk.connectWallet('metamask');

// Create vault
const vault = await sdk.createVault({
  name: 'My Secure Vault',
  type: 'multi-signature',
  securityLevel: 'maximum',
  requiredSignatures: 3
});

// Transfer assets
const txHash = await sdk.transfer(vault.id, {
  to: '0x742d35Cc6634C0532925a3b8D11D9b8a79e8b1a1',
  amount: '1000000000000000000', // 1 ETH
  asset: 'ETH'
});
```

---

## 📚 Documentation

### Core Documentation

- **[SDK Usage Guide](./SDK_USAGE.md)** - Complete SDK reference and examples
- **[Integration Examples](./INTEGRATION_EXAMPLES.md)** - Real-world integration patterns
- **[Wallet Integration API](./wallet-integration-api.md)** - Multi-chain wallet connection guide

### External Resources

- **[Platform Repository](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Main application source code
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Deployed contract code
- **[Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)** - Complete technical documentation
- **[Security Protocols](https://github.com/Chronos-Vault/chronos-vault-security)** - Security architecture

---

## 🏗️ Features

### Multi-Chain Support

The SDK supports seamless integration across multiple blockchains:

- **Arbitrum L2** - Primary security with 95% lower fees
- **Solana** - High-frequency validation and monitoring
- **TON** - Quantum-resistant backup and emergency recovery

### Supported Wallets

- **MetaMask** - Ethereum and EVM-compatible chains
- **Phantom** - Solana blockchain
- **TON Keeper** - TON blockchain
- **WalletConnect** - Universal wallet protocol

### Vault Types

Create specialized vaults for any security need:

- **Time-Locked Vaults** - Schedule asset releases
- **Multi-Signature Vaults** - M-of-N signature requirements
- **Geo-Location Vaults** - Location-based authentication
- **Quantum-Resistant Vaults** - Post-quantum cryptography
- **Zero-Knowledge Vaults** - Privacy-preserving operations
- **Cross-Chain Fragment Vaults** - Distributed across blockchains

---

## 🔐 Security Features

### Trinity Protocol

2-of-3 consensus across three blockchains ensures mathematical security:

```typescript
// Check cross-chain consensus
const consensus = await sdk.getCrossChainConsensus(vaultId);

// Verify Trinity Protocol validation
const isValid = await sdk.verifyTrinityProtocol(
  vaultId,
  ethereumTxHash,
  solanaTxHash,
  tonTxHash
);
```

### Zero-Knowledge Proofs

Privacy-preserving verification without revealing sensitive data:

```typescript
// Prove ownership without revealing identity
const ownershipProof = await sdk.generatePrivacyProof('ownership', {
  vaultId: 'vault_123',
  ownerAddress: '0x...'
});

// Prove sufficient funds without revealing balance
const sufficiencyProof = await sdk.generatePrivacyProof('sufficiency', {
  vaultId: 'vault_123',
  requiredAmount: '1000000000000000000'
});

// Verify proof
const isValid = await sdk.verifyProof(ownershipProof);
```

### Quantum-Resistant Encryption

Future-proof your assets against quantum computing threats:

```typescript
// Enable quantum-resistant encryption
await sdk.enableQuantumResistance();

// Create quantum-resistant vault
const vault = await sdk.createVault({
  name: 'Quantum-Safe Vault',
  type: 'quantum-resistant',
  securityLevel: 'maximum'
});
```

---

## 📖 API Reference

### SDK Configuration

```typescript
interface SDKConfig {
  apiEndpoint: string;
  enableBiometrics?: boolean;
  enableEncryption?: boolean;
  enableZeroKnowledge?: boolean;
  enableQuantumResistance?: boolean;
  debugMode?: boolean;
}
```

### Authentication Methods

```typescript
// Initialize SDK
await sdk.initialize(): Promise<void>

// Authenticate user
await sdk.authenticate(): Promise<boolean>

// Connect wallet
await sdk.connectWallet(
  walletType: 'metamask' | 'phantom' | 'tonkeeper'
): Promise<WalletConnection>

// Get connected wallets
await sdk.getConnectedWallets(): Promise<WalletConnection[]>

// Disconnect wallet
await sdk.disconnectWallet(walletType: string): Promise<void>
```

### Vault Management

```typescript
// Create vault
await sdk.createVault(config: VaultConfig): Promise<Vault>

// Get all vaults
await sdk.getVaults(): Promise<Vault[]>

// Get specific vault
await sdk.getVault(vaultId: string): Promise<Vault>

// Lock/unlock vault
await sdk.lockVault(vaultId: string): Promise<void>
await sdk.unlockVault(vaultId: string): Promise<void>
```

### Transaction Operations

```typescript
// Transfer assets
await sdk.transfer(
  vaultId: string,
  config: TransferConfig
): Promise<string>

// Get transaction history
await sdk.getTransactionHistory(
  vaultId?: string
): Promise<Transaction[]>

// Subscribe to updates
sdk.subscribeToUpdates(
  callback: (update: any) => void
): () => void
```

---

## 💻 Integration Examples

### React Integration

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [sdk, setSDK] = useState<ChronosVaultSDK | null>(null);
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    const initSDK = async () => {
      const instance = new ChronosVaultSDK({
        apiEndpoint: 'https://chronosvault.org/api'
      });
      await instance.initialize();
      setSDK(instance);
      
      const userVaults = await instance.getVaults();
      setVaults(userVaults);
    };
    
    initSDK();
  }, []);

  return (
    <div>
      {vaults.map(vault => (
        <div key={vault.id}>{vault.name}</div>
      ))}
    </div>
  );
}
```

### Node.js Integration

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

async function main() {
  const sdk = new ChronosVaultSDK({
    apiEndpoint: process.env.CHRONOS_API_ENDPOINT,
    enableZeroKnowledge: true
  });

  await sdk.initialize();
  
  const vaults = await sdk.getVaults();
  console.log('User vaults:', vaults);
}

main();
```

For complete integration examples, see [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)

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

## 🔗 Chronos Vault Ecosystem

| Repository | Purpose | Link |
|------------|---------|------|
| **Platform** | Main application | [chronos-vault-platform-](https://github.com/Chronos-Vault/chronos-vault-platform-) |
| **Contracts** | Smart contracts | [chronos-vault-contracts](https://github.com/Chronos-Vault/chronos-vault-contracts) |
| **SDK** | TypeScript SDK (this repo) | [chronos-vault-sdk](https://github.com/Chronos-Vault/chronos-vault-sdk) |
| **Documentation** | Technical docs | [chronos-vault-docs](https://github.com/Chronos-Vault/chronos-vault-docs) |
| **Security** | Security protocols | [chronos-vault-security](https://github.com/Chronos-Vault/chronos-vault-security) |

---

## 🤝 Contributing

We welcome contributions from the developer community!

### How to Contribute

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

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Chronos Vault

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Chronos-Vault/chronos-vault-sdk/issues)
- **Documentation**: [Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)
- **Security**: [Security Policy](https://github.com/Chronos-Vault/chronos-vault-security)

---

## 🌟 Why Chronos Vault SDK?

- **Mathematical Security**: Cryptographic proofs, not trust assumptions
- **Multi-Chain Native**: Built for cross-chain from the ground up
- **Developer Friendly**: Clean API, TypeScript support, comprehensive docs
- **Production Ready**: Battle-tested security and reliability
- **Open Source**: Transparent, auditable, community-driven

---

## 🌐 Community & Social Media

Join the Chronos Vault community and stay updated on the latest developments:

- **Medium**: [https://medium.com/@chronosvault](https://medium.com/@chronosvault) - Technical articles and project updates
- **Dev.to**: [https://dev.to/chronosvault](https://dev.to/chronosvault) - Developer tutorials and guides
- **Discord**: [https://discord.gg/WHuexYSV](https://discord.gg/WHuexYSV) - Community discussions and support
- **X (Twitter)**: [https://x.com/chronosvaultx](https://x.com/chronosvaultx?s=21) - Latest news and announcements
- **Email**: chronosvault@chronosvault.org

---

**Built with ❤️ for the future of decentralized security**

For platform integration, visit [chronos-vault-platform-](https://github.com/Chronos-Vault/chronos-vault-platform-)


## 🚀 Latest Deployments (Arbitrum Sepolia)

### Circuit Breaker V2 Contracts

| Contract | Address | Status |
|----------|---------|--------|
| **CrossChainBridgeV2** | `0xe331a4390C3a5E43BA646210b63e09B64E8289e7` | ✅ Deployed |
| **CVTBridgeV2** | `0xdB7F6cCf57D6c6AA90ccCC1a510589513f28cb83` | ✅ Deployed |

**Features:**
- 🛡️ 500% volume spike trigger
- 🔒 20% failure rate threshold
- ⏰ Auto-recovery after time-lock
- 🚫 100% trustless (no owner roles)

[View on Arbiscan](https://sepolia.arbiscan.io)


## 🚀 Latest V3 Deployments (Arbitrum Sepolia)

### Circuit Breaker V3 with Emergency MultiSig

| Contract | Address | Status |
|----------|---------|--------|
| **CrossChainBridgeV3** | `0x39601883CD9A115Aba0228fe0620f468Dc710d54` | ✅ Deployed |
| **CVTBridgeV3** | `0x00d02550f2a8Fd2CeCa0d6b7882f05Beead1E5d0` | ✅ Deployed |
| **EmergencyMultiSig** | `0xFafCA23a7c085A842E827f53A853141C8243F924` | ✅ Deployed |

**V3 Features:**
- 🛡️ All V2 circuit breaker features (500% volume spike, 20% failure rate)
- 🚨 **NEW:** Emergency pause/resume via 2-of-3 multi-sig
- 🔒 **NEW:** 48-hour time-lock on emergency proposals
- ⏰ Auto-recovery (4h for bridge, 2h for CVT bridge)
- 🚫 100% trustless (emergency controller is IMMUTABLE)

[View on Arbiscan](https://sepolia.arbiscan.io)

---

## 🔬 Formal Verification & Mathematical Security

Chronos Vault SDK is the **world's first fully verified multi-chain security platform** with 100% of critical security properties mathematically proven.

### Verification Status

✅ **35/35 Theorems Proven** using Lean 4 Theorem Prover  
✅ **100% Coverage** of smart contracts, cryptography, and consensus  
✅ **Zero Trust** - Math proves security, not human audits

**[View Complete Formal Verification →](./FORMAL_VERIFICATION.md)**

### What This Means for Developers

```typescript
// Every security claim is mathematically proven
const vault = await sdk.createVault({ type: 'multi-signature' });

// Withdrawal safety: PROVEN (Theorem 1)
// Balance integrity: PROVEN (Theorem 2)
// Cross-chain consensus: PROVEN (Theorem 18)
// Quantum resistance: PROVEN (Theorem 29)
```

**Mathematical Guarantees:**
- ✅ Withdrawal safety - Only owners can withdraw (proven impossible to bypass)
- ✅ Balance integrity - Never goes negative (proven for all operation sequences)
- ✅ Trinity Protocol - 2-of-3 consensus (attack probability < 10^-18)
- ✅ Zero-knowledge privacy - Proofs reveal nothing beyond validity
- ✅ Quantum resistance - Secure against Shor's algorithm

---

## 🚀 Developer Portal Integration

Access comprehensive development tools and resources:

**Developer Portal**: https://chronosvault.org/developer-portal

### Portal Features

- **API Explorer** - Test endpoints in real-time
- **Smart Contract SDK** - Direct contract interaction
- **Analytics Dashboard** - Monitor your integration
- **Code Generator** - Auto-generate integration code
- **WebSocket Events** - Real-time vault notifications

**[View Portal Integration Guide →](./DEVELOPER_PORTAL.md)**

### Quick Portal Access

```typescript
const sdk = new ChronosVaultSDK({
  apiEndpoint: 'https://chronosvault.org/api',
  enableDeveloperMode: true, // Access portal features
  enableAnalytics: true       // Track usage metrics
});

// View your dashboard
const dashboard = await sdk.getDeveloperDashboard();
console.log('Dashboard:', dashboard.url);
// https://chronosvault.org/developer-portal/dashboard
```

---

## 📖 Additional Resources

### Documentation
- **[Formal Verification](./FORMAL_VERIFICATION.md)** - Mathematical security proofs
- **[Developer Portal](./DEVELOPER_PORTAL.md)** - Portal integration guide
- **[SDK Usage](./SDK_USAGE.md)** - Complete SDK reference
- **[Integration Examples](./INTEGRATION_EXAMPLES.md)** - Real-world patterns
- **[Wallet API](./wallet-integration-api.md)** - Multi-chain wallet guide

### Repositories
- **[Platform Source](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Main application
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Contract code
- **[Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)** - Full documentation
- **[Security & Verification](https://github.com/Chronos-Vault/chronos-vault-security)** - Formal proofs

### Developer Tools
- **[Developer Portal](https://chronosvault.org/developer-portal)** - Interactive tools
- **[API Explorer](https://chronosvault.org/developer-portal/api-explorer)** - Test APIs
- **[Contract SDK](https://chronosvault.org/smart-contract-sdk)** - Contract interaction
- **[Analytics](https://chronosvault.org/developer-portal/analytics)** - Usage metrics


---

## 🔬 Formal Verification & Mathematical Security

Chronos Vault SDK is the **world's first fully verified multi-chain security platform** with 100% of critical security properties mathematically proven.

### Verification Status

✅ **35/35 Theorems Proven** using Lean 4 Theorem Prover  
✅ **100% Coverage** of smart contracts, cryptography, and consensus  
✅ **Zero Trust** - Math proves security, not human audits

**[View Complete Formal Verification →](./FORMAL_VERIFICATION.md)**

### Mathematical Guarantees

```typescript
// Every security claim is mathematically proven
const vault = await sdk.createVault({ type: 'multi-signature' });

// Withdrawal safety: PROVEN (Theorem 1)
// Balance integrity: PROVEN (Theorem 2)
// Trinity consensus: PROVEN (Theorem 18)
// Quantum resistance: PROVEN (Theorem 29)
```

**Security Properties:**
- ✅ **Withdrawal Safety** - Only owners can withdraw (proven impossible to bypass)
- ✅ **Balance Integrity** - Never goes negative (proven for all sequences)
- ✅ **Trinity Protocol** - 2-of-3 consensus (attack probability < 10^-18)
- ✅ **Zero-Knowledge Privacy** - Proofs reveal nothing beyond validity
- ✅ **Quantum Resistance** - Secure against Shor's algorithm

---

## 🚀 Developer Platform Integration

Access the complete developer platform with interactive tools and documentation:

**Developer Portal**: https://chronosvault.org/developer-portal

### Platform Features

| Feature | URL | Description |
|---------|-----|-------------|
| **SDK Documentation** | https://chronosvault.org/sdk-documentation | Complete SDK reference |
| **Smart Contract SDK** | https://chronosvault.org/smart-contract-sdk | Contract interaction tools |
| **Integration Guide** | https://chronosvault.org/integration-guide | Step-by-step integration |
| **API Documentation** | https://chronosvault.org/api-documentation | REST API reference |
| **Trinity Protocol** | https://chronosvault.org/trinity-protocol | 2-of-3 consensus dashboard |
| **API Keys** | https://chronosvault.org/developer-api-keys | Generate API credentials |

**[View Platform Integration Guide →](./DEVELOPER_PORTAL.md)**

### Quick Platform Access

```typescript
const sdk = new ChronosVaultSDK({
  apiEndpoint: 'https://chronosvault.org/api',
  
  // Trinity Protocol - 2-of-3 Consensus
  enableTrinityProtocol: true,
  
  // Mathematical Defense Layer - 7 Cryptographic Layers
  enableZeroKnowledge: true,      // Layer 1: ZK Proofs
  enableQuantumResistance: true,  // Layer 6: Quantum-safe
  enableMPC: true,                // Layer 3: Multi-party computation
  enableVDF: true                 // Layer 4: Verifiable delay functions
});
```

---

## 📖 Additional Resources

### Documentation
- **[Formal Verification](./FORMAL_VERIFICATION.md)** - 35 proven theorems & Mathematical Defense Layer
- **[Developer Portal](./DEVELOPER_PORTAL.md)** - Platform integration guide with real URLs
- **[SDK Usage](./SDK_USAGE.md)** - Complete SDK reference and API guide
- **[Integration Examples](./INTEGRATION_EXAMPLES.md)** - Real-world integration patterns
- **[Wallet API](./wallet-integration-api.md)** - Multi-chain wallet connection guide

### Live Platform Pages
- **[Developer Portal](https://chronosvault.org/developer-portal)** - Main developer hub
- **[Trinity Protocol](https://chronosvault.org/trinity-protocol)** - 2-of-3 consensus dashboard
- **[Security Dashboard](https://chronosvault.org/security-dashboard)** - Multi-chain monitoring
- **[Quantum Resistant](https://chronosvault.org/quantum-resistant-vault)** - Quantum-safe vaults
- **[Zero-Knowledge](https://chronosvault.org/zero-knowledge-verification)** - ZK proof verification

### Blockchain Integration Guides
- **[Ethereum/Arbitrum L2](https://chronosvault.org/ethereum-integration)** - Layer 2 integration
- **[Solana](https://chronosvault.org/solana-integration)** - Solana program guide
- **[TON](https://chronosvault.org/ton-integration)** - TON blockchain guide

### GitHub Repositories
- **[Platform Source](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Main application code
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Verified contract code
- **[Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)** - Complete documentation
- **[Security & Proofs](https://github.com/Chronos-Vault/chronos-vault-security)** - Formal verification proofs

---

## 🛡️ Trinity Protocol - 2-of-3 Multi-Chain Consensus

The Trinity Protocol ensures mathematical security through cross-chain consensus:

- **Arbitrum L2** - Primary security layer with 95% lower fees
- **Solana** - High-frequency validation and monitoring
- **TON** - Quantum-resistant backup and emergency recovery

**Attack Probability:** < 10^-18 (requires simultaneous compromise of 2+ chains)

**Dashboard:** https://chronosvault.org/trinity-protocol

---

## 🔐 Mathematical Defense Layer - 7 Cryptographic Layers

All layers are formally verified with mathematical proofs:

1. **Zero-Knowledge Proofs** - Privacy-preserving verification (Theorem 25)
2. **Formal Verification** - 35/35 theorems proven with Lean 4
3. **Multi-Party Computation** - 3-of-5 threshold signatures (Theorem 22)
4. **Verifiable Delay Functions** - Non-bypassable time-locks (Theorem 21)
5. **AI + Crypto Governance** - AI decides, Math proves, Chain executes
6. **Quantum-Resistant Crypto** - ML-KEM-1024 + Dilithium-5 (Theorem 29)
7. **Trinity Protocol** - 2-of-3 blockchain consensus (Theorem 18)

**Learn More:** [FORMAL_VERIFICATION.md](./FORMAL_VERIFICATION.md)

