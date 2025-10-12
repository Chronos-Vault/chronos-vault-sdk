# 🚀 Chronos Vault SDK - Developer Portal Integration

**SDK Version:** 1.0.0  
**Platform URL:** https://chronosvault.org  
**API Base:** https://chronosvault.org/api  
**Last Updated:** October 2025

---

## 📋 Overview

The Chronos Vault Developer Portal provides comprehensive tools, documentation, and resources for integrating multi-chain vault technology. Access interactive documentation, smart contract interfaces, and real-time monitoring tools.

---

## 🌐 Real Platform Routes

### **Available Developer Pages**

| Page | URL | Description |
|------|-----|-------------|
| **Developer Portal** | https://chronosvault.org/developer-portal | Main developer hub |
| **SDK Documentation** | https://chronosvault.org/sdk-documentation | Complete SDK reference |
| **Smart Contract SDK** | https://chronosvault.org/smart-contract-sdk | Contract interaction tools |
| **Integration Guide** | https://chronosvault.org/integration-guide | Step-by-step integration |
| **API Documentation** | https://chronosvault.org/api-documentation | REST API reference |
| **Integration Examples** | https://chronosvault.org/integration-examples | Code examples |
| **API Keys** | https://chronosvault.org/developer-api-keys | Generate API keys |
| **Wallet Demo** | https://chronosvault.org/wallet-integration-demo | Test wallet integration |

### **Trinity Protocol & Security**

| Page | URL | Description |
|------|-----|-------------|
| **Trinity Protocol** | https://chronosvault.org/trinity-protocol | 2-of-3 consensus dashboard |
| **Security Dashboard** | https://chronosvault.org/security-dashboard | Multi-chain security monitoring |
| **Zero-Knowledge** | https://chronosvault.org/zero-knowledge-verification | ZK proof verification |
| **Quantum Resistant** | https://chronosvault.org/quantum-resistant-vault | Quantum-safe vaults |
| **Cross-Chain Security** | https://chronosvault.org/cross-chain-security | Multi-chain security |

### **Blockchain Integration**

| Page | URL | Description |
|------|-----|-------------|
| **Ethereum Integration** | https://chronosvault.org/ethereum-integration | Arbitrum L2 guide |
| **Solana Integration** | https://chronosvault.org/solana-integration | Solana program guide |
| **TON Integration** | https://chronosvault.org/ton-integration | TON blockchain guide |

---

## 🔗 API Endpoints

### **IMPORTANT: API Structure**

The Chronos Vault API is served from the **same domain** as the platform:

```typescript
// ✅ CORRECT - API on same domain
const API_BASE = 'https://chronosvault.org/api';

// ❌ WRONG - No separate api subdomain
// const API_BASE = 'https://chronosvault.org/api';
```

### **Production API**

```typescript
const PRODUCTION_CONFIG = {
  baseURL: 'https://chronosvault.org',
  apiPath: '/api',
  
  // Example endpoints
  vaults: '/api/vaults',
  wallet: '/api/wallet',
  bridge: '/api/bridge',
  zeroKnowledge: '/api/zk'
};

// Make API calls
const response = await fetch('https://chronosvault.org/api/vaults');
```

### **Testnet API**

For testnet/development, use relative paths or localhost:

```typescript
const TESTNET_CONFIG = {
  // Development (relative paths work)
  apiPath: '/api',
  
  // Or explicit localhost
  baseURL: 'http://localhost:5000',
  apiPath: '/api'
};
```

### **Available API Routes**

```typescript
const API_ROUTES = {
  // Wallet & Auth
  walletVerify: '/api/wallet/verify-signature',
  walletStatus: '/api/wallet/status',
  requestNonce: '/api/vault/request-nonce',
  
  // Vaults
  vaults: '/api/vaults',
  createVault: '/api/vault-creation',
  vaultChain: '/api/vault-chain',
  
  // Cross-Chain
  bridge: '/api/bridge',
  crossChainOps: '/api/cross-chain-operations',
  chainFees: '/api/chain-fees',
  
  // Security
  zeroKnowledge: '/api/zk',
  geoVault: '/api/geo-vault',
  
  // Monitoring
  performance: '/api/performance',
  health: '/api/health',
  explorer: '/api/explorer'
};
```

### **Blockchain RPCs**

```typescript
const RPC_ENDPOINTS = {
  // Production
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  solana: 'https://api.mainnet-beta.solana.com',
  ton: 'https://toncenter.com/api/v2/jsonRPC',
  
  // Testnet
  arbitrumSepolia: 'https://sepolia-rollup.arbitrum.io/rpc',
  solanaDevnet: 'https://api.devnet.solana.com',
  tonTestnet: 'https://testnet.toncenter.com/api/v2/jsonRPC'
};
```

---

## 🚀 SDK Integration

### Initialize with Correct API Configuration

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  // ✅ CORRECT - Use platform domain
  apiEndpoint: 'https://chronosvault.org',
  apiPath: '/api',
  
  // Trinity Protocol - 2-of-3 Consensus
  enableTrinityProtocol: true,
  
  // Mathematical Defense Layer - 7 Layers
  enableZeroKnowledge: true,      // Layer 1: ZK Proofs
  enableQuantumResistance: true,  // Layer 6: Quantum-safe crypto
  enableMPC: true,                // Layer 3: Multi-party computation
  enableVDF: true,                // Layer 4: Verifiable delay functions
  
  // Security Level
  securityLevel: 'maximum'
});

await sdk.initialize();
```

### Make API Requests

```typescript
// Using SDK (recommended)
const vaults = await sdk.getVaults();

// Direct API calls
const response = await fetch('https://chronosvault.org/api/vaults', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});

const vaults = await response.json();
```

---

## 🛡️ Trinity Protocol - 2-of-3 Consensus

The Trinity Protocol ensures mathematical security through cross-chain consensus:

```typescript
// Check Trinity Protocol status
const consensus = await sdk.getCrossChainConsensus(vaultId);

console.log('Consensus status:', consensus);
// {
//   arbitrum: { approved: true, blockNumber: 12345 },
//   solana: { approved: true, slot: 98765 },
//   ton: { approved: false, seqno: 54321 }
// }

// Requires 2-of-3 approval ✅
```

**View Trinity Dashboard:** https://chronosvault.org/trinity-protocol

---

## 🔐 Mathematical Defense Layer - 7 Cryptographic Layers

### Layer 1: Zero-Knowledge Proofs
```typescript
// Create ZK proof
const proof = await sdk.createZKProof(vaultId);

// Verify ZK proof
const verified = await sdk.verifyZKProof(proof);
```
**Test ZK Proofs:** https://chronosvault.org/zero-knowledge-verification

### Layer 2: Formal Verification
- **35/35 theorems proven** using Lean 4
- 100% coverage of security properties
- View in [FORMAL_VERIFICATION.md](./FORMAL_VERIFICATION.md)

### Layer 3: Multi-Party Computation (MPC)
```typescript
// Generate MPC key shares (3-of-5 threshold)
const keyShares = await sdk.generateMPCKeyShares(vaultId, 5, 3);
```

### Layer 4: Verifiable Delay Functions (VDF)
```typescript
// Create VDF time-lock
const timeLock = await sdk.createVDFTimeLock(unlockTime);
```

### Layer 5: AI + Cryptographic Governance
- AI proposes, Math proves, Chain executes
- Multi-layer cryptographic validation

### Layer 6: Quantum-Resistant Cryptography
```typescript
// Create quantum-resistant vault
const vault = await sdk.createVault({
  type: 'quantum-resistant',
  encryption: 'ML-KEM-1024',
  signature: 'Dilithium-5'
});
```
**Learn More:** https://chronosvault.org/quantum-resistant-vault

### Layer 7: Trinity Protocol
- 2-of-3 blockchain consensus
- Attack probability < 10^-18
- **Dashboard:** https://chronosvault.org/trinity-protocol

---

## 📊 V3 Smart Contracts

### Deployed Addresses

```typescript
const V3_CONTRACTS = {
  // Arbitrum Sepolia (Testnet)
  CrossChainBridgeV3: '0x5bC40A7a47A2b767D948FEEc475b24c027B43867',
  CVTBridgeV3: '0x7693a841Eec79Da879241BC0eCcc80710F39f399',
  EmergencyMultiSig: '0xFafCA23a7c085A842E827f53A853141C8243F924'
};

// Access contracts through SDK
const contracts = await sdk.getV3Contracts();
```

**Contract Interface:** https://chronosvault.org/smart-contract-sdk

---

## 🌐 Platform Integration Examples

### Example 1: Create Vault with Trinity Protocol

```typescript
// Initialize SDK with correct API
const sdk = new ChronosVaultSDK({
  apiEndpoint: 'https://chronosvault.org',
  apiPath: '/api',
  enableTrinityProtocol: true
});

// Create multi-signature vault
const vault = await sdk.createVault({
  name: 'Production Vault',
  type: 'multi-signature',
  requiredSignatures: 3,
  signers: [address1, address2, address3]
});

// Monitor Trinity consensus
const consensus = await sdk.getCrossChainConsensus(vault.id);
console.log('Approved by Arbitrum:', consensus.arbitrum.approved);
console.log('Approved by Solana:', consensus.solana.approved);
console.log('Approved by TON:', consensus.ton.approved);
```

### Example 2: Direct API Call

```typescript
// Wallet verification
const response = await fetch('https://chronosvault.org/api/wallet/verify-signature', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    address: walletAddress,
    signature: signature,
    message: message
  })
});

const result = await response.json();
```

---

## 📖 Documentation Resources

### SDK & Integration
- **[SDK Documentation](https://chronosvault.org/sdk-documentation)** - Complete SDK reference
- **[Integration Guide](https://chronosvault.org/integration-guide)** - Step-by-step guide
- **[Integration Examples](https://chronosvault.org/integration-examples)** - Code examples
- **[API Documentation](https://chronosvault.org/api-documentation)** - REST API reference

### Security & Verification
- **[Trinity Protocol](https://chronosvault.org/trinity-protocol)** - 2-of-3 consensus
- **[Security Dashboard](https://chronosvault.org/security-dashboard)** - Multi-chain monitoring
- **[Formal Verification](./FORMAL_VERIFICATION.md)** - Mathematical proofs
- **[Cross-Chain Security](https://chronosvault.org/cross-chain-security)** - Security architecture

### Blockchain Integration
- **[Ethereum/Arbitrum](https://chronosvault.org/ethereum-integration)** - L2 integration guide
- **[Solana](https://chronosvault.org/solana-integration)** - Solana program guide
- **[TON](https://chronosvault.org/ton-integration)** - TON blockchain guide

### GitHub Repositories
- **[Platform Source](https://github.com/Chronos-Vault/chronos-vault-platform-)** - Main application
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Contract code
- **[Technical Docs](https://github.com/Chronos-Vault/chronos-vault-docs)** - Documentation
- **[Security & Proofs](https://github.com/Chronos-Vault/chronos-vault-security)** - Formal verification

---

## 🔑 Authentication

### Wallet-Based Auth

```typescript
// Authenticate with wallet
const auth = await sdk.authenticateWithWallet({
  provider: 'metamask' // or 'phantom', 'tonkeeper'
});

console.log('Authenticated:', auth.address);
```

### API Key Generation

Visit **[Developer API Keys](https://chronosvault.org/developer-api-keys)** to generate your credentials.

---

<div align="center">

## 🌟 Build with Chronos Vault

**Trinity Protocol • 7 Cryptographic Layers • 35/35 Theorems Proven**

[Developer Portal](https://chronosvault.org/developer-portal) • [SDK Docs](./README.md) • [Trinity Protocol](https://chronosvault.org/trinity-protocol)

</div>
