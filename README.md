# Chronos Vault SDK

<div align="center">

**Official TypeScript/JavaScript SDK for Trinity Protocol v3.0 - Mathematically Provable Multi-Chain Security**

![npm version](https://img.shields.io/badge/npm-3.0.0-blue?style=for-the-badge&logo=npm)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

🔒 **78/78 Theorems Proven** • 🌐 **Multi-Chain** • ⚛️ **Quantum Resistant**

[Quick Start](#-quick-start) • [Examples](#-examples) • [API Reference](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Examples](#-examples)
- [API Reference](#-api-reference)
- [Supported Vault Types](#-supported-vault-types)
- [Multi-Language SDKs](#-multi-language-sdks)
- [Deployed Contracts](#-deployed-contracts)
- [Development](#-development)

---

## 📦 Overview

The official TypeScript/JavaScript SDK for integrating Chronos Vault's mathematically provable security into your applications. Build with confidence knowing every security claim is backed by formal verification.

### Trinity Protocol v3.0

- ✅ **78/78 Lean 4 formal proofs complete** (100%)
- ✅ **All 4 critical vulnerabilities fixed**
- ✅ **Production-ready**: November 3, 2025
- ✅ **Attack probability**: P < 10^-50

### Use Cases

- **DeFi Protocols**: Secure treasury management with multi-sig + time-locks
- **DAOs**: Decentralized governance with provable security
- **Institutions**: Enterprise-grade custody across multiple chains
- **Developers**: Build secure dApps with drop-in vault integration
- **Individuals**: Self-custody with quantum-resistant encryption

---

## ✨ Features

### Multi-Chain Support
- ✅ **Ethereum/Arbitrum L2** - Primary security layer
- ✅ **Solana** - High-frequency validation
- ✅ **TON** - Quantum-resistant backup

### Type-Safe Development
- ✅ Full TypeScript support with complete type definitions
- ✅ IntelliSense autocomplete for all methods
- ✅ Compile-time error checking

### Easy Integration
- ✅ Simple, intuitive API
- ✅ Promise-based async/await
- ✅ Comprehensive error handling
- ✅ Built-in retry logic

### Wallet Integration
- ✅ **MetaMask** (Ethereum/Arbitrum)
- ✅ **WalletConnect** (Multi-wallet)
- ✅ **Phantom** (Solana)
- ✅ **Solflare** (Solana)
- ✅ **TON Keeper** (TON)
- ✅ **TON Wallet** (TON)

### Advanced Features
- ✅ **Cross-Chain Bridging** - Seamless asset transfers
- ✅ **Zero-Knowledge Proofs** - Privacy-preserving operations
- ✅ **Quantum-Resistant Crypto** - ML-KEM-1024 & Dilithium-5
- ✅ **Trinity Consensus** - 2-of-3 multi-chain verification
- ✅ **Time-Lock Vaults** - VDF-enforced release schedules

---

## 📥 Installation

```bash
# npm
npm install @chronos-vault/sdk

# yarn
yarn add @chronos-vault/sdk

# pnpm
pnpm add @chronos-vault/sdk
```

**Requirements:**
- Node.js 18+ or modern browser
- TypeScript 5+ (optional, but recommended)

---

## 🚀 Quick Start

### Basic Setup

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

// Initialize SDK
const sdk = new ChronosVaultSDK({
  network: 'testnet', // or 'mainnet'
  chains: ['ethereum', 'solana', 'ton']
});

// Initialize connection
await sdk.initialize();

console.log('✅ SDK initialized successfully!');
```

### Create Your First Vault

```typescript
// Create a time-locked vault
const vault = await sdk.createVault({
  type: 'time-lock',
  unlockTime: Date.now() + 86400000, // 24 hours
  assets: [{
    token: 'ETH',
    amount: '1.0'
  }]
});

console.log(`✅ Vault created: ${vault.id}`);
console.log(`🔒 Unlocks at: ${new Date(vault.unlockTime)}`);
```

### Query Vault Status

```typescript
// Get vault details
const status = await sdk.getVault(vault.id);

console.log(`Vault Status: ${status.state}`);
console.log(`Assets: ${JSON.stringify(status.assets)}`);
console.log(`Owner: ${status.owner}`);
```

---

## 💻 Examples

### Example 1: Multi-Signature Vault

```typescript
// Create 3-of-5 multi-sig vault
const multiSigVault = await sdk.createVault({
  type: 'multi-signature',
  requiredSigners: 3,
  totalSigners: 5,
  signers: [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '0x123...',
    '0x456...',
    '0x789...',
    '0xabc...'
  ],
  assets: [{ token: 'USDC', amount: '10000' }]
});

// Propose withdrawal
const proposal = await sdk.proposeWithdrawal(multiSigVault.id, {
  amount: '1000',
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

// Sign proposal
await sdk.signProposal(proposal.id);

// Execute when 3/5 signatures collected
if (proposal.signatures >= multiSigVault.requiredSigners) {
  await sdk.executeProposal(proposal.id);
}
```

### Example 2: Cross-Chain Bridge

```typescript
// Bridge CVT tokens from Solana to Ethereum
const bridge = await sdk.bridgeAsset({
  from: 'solana',
  to: 'ethereum',
  token: 'CVT',
  amount: '100',
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

console.log(`Bridge initiated: ${bridge.id}`);

// Monitor Trinity Protocol consensus (2-of-3 required)
const consensus = await sdk.getCrossChainConsensus(bridge.id);
console.log(`Verified chains: ${consensus.verified.length}/3`);

// Wait for completion
await sdk.waitForBridgeCompletion(bridge.id);
console.log('✅ Bridge completed successfully!');
```

### Example 3: Zero-Knowledge Proof

```typescript
// Generate ownership proof without revealing identity
const proof = await sdk.generateOwnershipProof(vaultId);

console.log('Proof generated:', {
  proofType: proof.type,
  timestamp: proof.timestamp,
  // NO owner address revealed!
});

// Anyone can verify the proof
const isValid = await sdk.verifyProof(proof);
console.log(`✅ Proof valid: ${isValid}`);
```

### Example 4: Quantum-Resistant Vault

```typescript
// Create quantum-resistant vault with ML-KEM-1024
const quantumVault = await sdk.createVault({
  type: 'quantum-resistant',
  encryption: {
    algorithm: 'ML-KEM-1024',
    signature: 'Dilithium-5'
  },
  assets: [{
    token: 'BTC',
    amount: '0.5'
  }]
});

console.log('✅ Quantum-resistant vault created');
console.log('🔐 Protected for 50+ years against quantum attacks');
```

### Example 5: VDF Time-Lock

```typescript
// Create VDF time-locked vault (mathematically enforced)
const vdfVault = await sdk.createVault({
  type: 'vdf-timelock',
  vdfIterations: 1000000000, // ~1 hour on modern CPU
  assets: [{
    token: 'ETH',
    amount: '5.0'
  }]
});

// VDF guarantees cannot be unlocked early
// Even with infinite parallelization!
console.log('✅ VDF time-lock active');
console.log('⏱️ Unlock requires sequential computation');
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
  apiKey?: string;
}

const sdk = new ChronosVaultSDK(config);
await sdk.initialize();
```

### Vault Operations

```typescript
// Create vault
await sdk.createVault(config: VaultConfig): Promise<Vault>

// Get vault details
await sdk.getVault(vaultId: string): Promise<Vault>

// List all vaults
await sdk.listVaults(filters?: VaultFilters): Promise<Vault[]>

// Update vault
await sdk.updateVault(
  vaultId: string,
  updates: Partial<VaultConfig>
): Promise<Vault>

// Lock/unlock vault
await sdk.lockVault(vaultId: string): Promise<void>
await sdk.unlockVault(vaultId: string): Promise<void>

// Delete vault (if empty)
await sdk.deleteVault(vaultId: string): Promise<void>
```

### Cross-Chain Operations

```typescript
// Bridge assets between chains
await sdk.bridgeAsset(config: BridgeConfig): Promise<BridgeTx>

// Get Trinity Protocol consensus status
await sdk.getCrossChainConsensus(
  vaultId: string
): Promise<Consensus>

// Verify Trinity Protocol (2-of-3)
await sdk.verifyTrinityProtocol(
  ethereumTxHash: string,
  solanaTxHash: string,
  tonTxHash: string
): Promise<boolean>

// Wait for bridge completion
await sdk.waitForBridgeCompletion(
  bridgeId: string,
  timeout?: number
): Promise<BridgeTx>
```

### Zero-Knowledge Operations

```typescript
// Generate ownership proof
await sdk.generateOwnershipProof(
  vaultId: string
): Promise<Proof>

// Verify ZK proof
await sdk.verifyProof(
  proof: Proof
): Promise<boolean>

// Generate private query
await sdk.generatePrivateQuery(
  vaultId: string,
  queryType: 'balance' | 'ownership' | 'status'
): Promise<PrivateQuery>
```

### Multi-Signature Operations

```typescript
// Propose withdrawal
await sdk.proposeWithdrawal(
  vaultId: string,
  withdrawal: WithdrawalRequest
): Promise<Proposal>

// Sign proposal
await sdk.signProposal(
  proposalId: string
): Promise<Signature>

// Execute proposal (when threshold met)
await sdk.executeProposal(
  proposalId: string
): Promise<Transaction>

// Get proposal status
await sdk.getProposal(
  proposalId: string
): Promise<Proposal>
```

---

## 🗂️ Supported Vault Types

The SDK supports **22 different vault types**:

### Basic Vaults
1. **Standard Vault** - Simple custody
2. **Time-Locked Vault** - Schedule releases
3. **Multi-Signature Vault** - M-of-N approval

### Advanced Vaults
4. **Geo-Location Vault** - Location-based auth
5. **Quantum-Resistant Vault** - Post-quantum crypto
6. **Zero-Knowledge Vault** - Privacy-preserving
7. **Cross-Chain Fragment Vault** - Distributed storage
8. **VDF Time-Lock Vault** - Provable delays
9. **Inheritance Vault** - Estate planning
10. **Recurring Payment Vault** - Automated transfers

### Specialized Vaults
11. **Emergency Access Vault** - Disaster recovery
12. **Social Recovery Vault** - Friend-based recovery
13. **DAO Treasury Vault** - Governance integration
14. **NFT Custody Vault** - NFT-specific security
15. **Staking Vault** - Automated staking
16. **Yield Farming Vault** - DeFi integrations
17. **Insurance Vault** - Collateral management
18. **Escrow Vault** - Trustless escrow
19. **Subscription Vault** - Recurring payments
20. **Donation Vault** - Charitable giving
21. **Grant Vault** - Milestone-based releases
22. **Sovereign Fortress Vault** - Maximum security (all 7 MDL layers)

---

## 🌍 Multi-Language SDKs

### JavaScript/TypeScript (Official)
```bash
npm install @chronos-vault/sdk
```

### Python
```bash
pip install chronos-vault-sdk
```

```python
from chronos_vault_sdk import ChronosVaultClient

client = ChronosVaultClient(
    network='testnet',
    chains=['ethereum', 'solana', 'ton']
)
await client.initialize()
```

### Rust
```toml
[dependencies]
chronos-vault-sdk = "3.0"
```

```rust
use chronos_vault_sdk::ChronosVaultClient;

let client = ChronosVaultClient::new(Config {
    network: Network::Testnet,
    chains: vec!["ethereum", "solana", "ton"],
});
```

### Go
```bash
go get github.com/chronosvault/sdk-go
```

```go
import "github.com/chronosvault/sdk-go"

client := sdk.NewClient(sdk.Config{
    Network: "testnet",
    Chains: []string{"ethereum", "solana", "ton"},
})
```

### Java
```xml
<dependency>
  <groupId>org.chronosvault</groupId>
  <artifactId>chronos-vault-sdk</artifactId>
  <version>3.0.0</version>
</dependency>
```

```java
ChronosVaultClient client = new ChronosVaultClient(
    Config.builder()
        .network("testnet")
        .chains("ethereum", "solana", "ton")
        .build()
);
```

---

## 📍 Deployed Contracts (Trinity Protocol v3.0)

### Arbitrum Sepolia

| Contract | Address |
|----------|---------|
| CrossChainBridgeOptimized v2.2 | `0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30` |
| HTLCBridge v2.0 | `0x6cd3B1a72F67011839439f96a70290051fd66D57` |
| ChronosVault | `0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91` |
| CVT Token | `0xFb419D8E32c14F774279a4dEEf330dc893257147` |

### Solana Devnet

| Program | Address |
|---------|---------|
| Trinity Validator | `5oD8S1TtkdJbAX7qhsGticU7JKxjwY4AbEeBdnkUrrKY` |
| CVT Token | `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4` |
| CVT Bridge | `6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK` |

### TON Testnet

| Contract | Address |
|----------|---------|
| Trinity Consensus | `EQDx6yH5WH3Ex47h0PBnOBMzPCsmHdnL2snts3DZBO5CYVVJ` |
| ChronosVault | `EQDJAnXDPT-NivritpEhQeP0XmG20NdeUtxgh4nUiWH-DF7M` |

---

## 🛠️ Development

### Local Development

```bash
# Clone SDK repository
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

# Type checking
npm run typecheck
```

### Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Build with watch mode
npm run build:watch

# Generate type declarations
npm run build:types
```

---

## 📚 Documentation

For complete documentation, visit:

| Resource | Description | Link |
|----------|-------------|------|
| **Platform** | Main application | [chronos-vault-platform-](https://github.com/Chronos-Vault/chronos-vault-platform-) |
| **API Reference** | Complete API docs | [API_REFERENCE.md](https://github.com/Chronos-Vault/chronos-vault-docs/blob/main/docs/api/API_REFERENCE.md) |
| **Integration Guide** | Code examples | [INTEGRATION_EXAMPLES.md](https://github.com/Chronos-Vault/chronos-vault-docs/blob/main/docs/integration/INTEGRATION_EXAMPLES.md) |
| **Smart Contracts** | Contract source code | [chronos-vault-contracts](https://github.com/Chronos-Vault/chronos-vault-contracts) |
| **Security** | Formal verification | [chronos-vault-security](https://github.com/Chronos-Vault/chronos-vault-security) |

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
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Guidelines:**
- Write clear, concise code with comments
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure all tests pass

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

<div align="center">

**Chronos Vault SDK** - The easiest way to add mathematically provable security to your application. This TypeScript/JavaScript SDK (with Python, Rust, Go, and Java support) gives you drop-in access to Trinity Protocol's 2-of-3 multi-chain consensus, zero-knowledge proofs, and quantum-resistant cryptography.

**Our Role in the Ecosystem**: We abstract away blockchain complexity so you can focus on building great products. Create vaults, bridge assets, generate ZK proofs, and verify Trinity consensus with simple, type-safe APIs—all backed by 78 formally verified security theorems.

---

**Chronos Vault Team** | *Trust Math, Not Humans*

⭐ [Star us on GitHub](https://github.com/Chronos-Vault) • 📦 [Install SDK](https://www.npmjs.com/package/@chronos-vault/sdk) • 📖 [SDK Documentation](https://github.com/Chronos-Vault/chronos-vault-docs/blob/main/docs/sdk/SDK_USAGE.md) • 💡 [Code Examples](https://github.com/Chronos-Vault/chronos-vault-docs/blob/main/docs/integration/INTEGRATION_EXAMPLES.md)

Built for application developers who want enterprise-grade security without the complexity.

</div>
