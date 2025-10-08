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
  apiEndpoint: 'https://api.chronosvault.org',
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
        apiEndpoint: 'https://api.chronosvault.org'
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
