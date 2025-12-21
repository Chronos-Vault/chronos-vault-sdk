# Chronos Vault - Wallet Integration API

**Version:** 1.1.0  
**Last Updated:** December 2025  
**Protocol:** Trinity Protocol Multi-Chain Security

---

## Overview

The Chronos Vault Wallet Integration API provides secure endpoints for external wallet applications to leverage our Trinity Protocol security system. Enable your wallet users to benefit from:

- Multi-chain verification across Arbitrum, Solana, and TON
- AI-powered threat monitoring with real-time security alerts
- Mathematical security guarantees through formal verification
- Zero-knowledge privacy for confidential transactions
- Quantum-resistant cryptography for future-proof security

---

## Quick Start

### 1. Install SDK

```bash
npm install @chronos-vault/sdk
```

### 2. Initialize Client

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
  apiKey: 'your-api-key',
});
```

### 3. Connect User Wallet

```typescript
// Authenticate user
const session = await sdk.trinity.authenticate({
  walletAddress: userAddress,
  signature: signedMessage,
  chain: 'arbitrum',
});
```

---

## API Endpoints

### Authentication & Authorization

#### Register Wallet Application

```
POST /api/v1/wallet/register
```

**Request:**
```json
{
  "walletName": "YourWallet",
  "developerAddress": "0x...",
  "callbackUrl": "https://yourwallet.com/chronos-callback",
  "requestedPermissions": ["vault_creation", "transaction_monitoring"]
}
```

**Response:**
```json
{
  "apiKey": "cvt_live_...",
  "apiSecret": "cvt_secret_...",
  "walletId": "wallet_12345",
  "permissions": ["vault_creation", "transaction_monitoring"],
  "rateLimits": {
    "requestsPerMinute": 1000,
    "burstLimit": 100
  }
}
```

#### Generate User Session

```
POST /api/v1/wallet/session
```

**Headers:**
```
Authorization: Bearer {api_key}
X-Wallet-Signature: {signature}
```

**Request:**
```json
{
  "userAddress": "0x...",
  "walletSignature": "0x...",
  "chain": "arbitrum",
  "sessionDuration": 3600
}
```

**Response:**
```json
{
  "sessionToken": "sess_...",
  "expiresAt": 1703203200,
  "userSecurityScore": 98.5
}
```

---

### Vault Management

#### Create Vault

```
POST /api/v1/vault/create
```

**Headers:**
```
Authorization: Bearer {session_token}
X-Wallet-ID: {wallet_id}
```

**Request:**
```json
{
  "vaultType": "personal",
  "name": "My Secure Vault",
  "assets": [
    {
      "chain": "arbitrum",
      "tokenAddress": "0x...",
      "amount": "1000000000000000000"
    }
  ],
  "securityLevel": "enhanced",
  "timeLock": {
    "enabled": true,
    "unlockDate": "2025-06-01T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "vaultId": "vault_abc123",
  "address": "0x...",
  "status": "active",
  "trinityVerification": {
    "arbitrum": "confirmed",
    "solana": "confirmed",
    "ton": "pending"
  }
}
```

#### Get User Vaults

```
GET /api/v1/vault/list
```

#### Get Vault Details

```
GET /api/v1/vault/:vaultId
```

---

### Trinity Protocol Integration

#### Verify Trinity Consensus

```
POST /api/v1/trinity/verify
```

**Request:**
```json
{
  "operationType": "vault_unlock",
  "vaultId": "vault_abc123",
  "amount": "500000000000000000"
}
```

**Response:**
```json
{
  "operationId": "op_xyz789",
  "status": "pending",
  "confirmations": {
    "required": 2,
    "current": 0,
    "chains": {
      "arbitrum": "pending",
      "solana": "pending",
      "ton": "pending"
    }
  }
}
```

#### Get Consensus Status

```
GET /api/v1/trinity/status/:operationId
```

---

### Security Monitoring

#### Get Security Score

```
GET /api/v1/security/score/:userAddress
```

**Response:**
```json
{
  "overallScore": 98.5,
  "factors": {
    "walletAge": 95,
    "transactionHistory": 99,
    "crossChainActivity": 100,
    "riskExposure": 98
  },
  "recommendations": []
}
```

#### Subscribe to Security Alerts

```
POST /api/v1/security/alerts/subscribe
```

**Request:**
```json
{
  "userAddress": "0x...",
  "alertTypes": ["suspicious_activity", "large_transfer", "consensus_failure"],
  "webhookUrl": "https://yourwallet.com/alerts"
}
```

---

## WebSocket Events

### Connection

```javascript
const ws = new WebSocket('wss://api.chronosvault.org/ws');

ws.send(JSON.stringify({
  action: 'authenticate',
  sessionToken: 'sess_...'
}));
```

### Event Types

#### Consensus Updates

```json
{
  "event": "consensus.update",
  "data": {
    "operationId": "op_xyz789",
    "confirmations": 2,
    "status": "confirmed"
  }
}
```

#### Security Alerts

```json
{
  "event": "security.alert",
  "data": {
    "type": "suspicious_activity",
    "severity": "medium",
    "details": {
      "address": "0x...",
      "action": "unusual_withdrawal_pattern"
    }
  }
}
```

---

## Deployed Contract Addresses

### Arbitrum Sepolia

| Contract | Address |
|----------|---------|
| TrinityConsensusVerifier | `0x59396D58Fa856025bD5249E342729d5550Be151C` |
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

---

## Error Handling

```json
{
  "error": {
    "code": "CONSENSUS_TIMEOUT",
    "message": "Consensus not reached within timeout period",
    "details": {
      "operationId": "op_xyz789",
      "confirmations": 1,
      "required": 2
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_SESSION` | Session expired or invalid |
| `PERMISSION_DENIED` | Insufficient permissions |
| `CONSENSUS_TIMEOUT` | Consensus not reached in time |
| `VAULT_LOCKED` | Vault is time-locked |
| `CHAIN_UNAVAILABLE` | Blockchain temporarily unavailable |

---

## SDK Integration

For the best developer experience, use our official SDK:

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  mode: 'hybrid', // API + RPC
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
  rpc: {
    arbitrum: {
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    },
  },
});

// Create vault with Trinity verification
const vault = await sdk.vault.createVault({
  name: 'User Vault',
  vaultType: 'erc4626',
  chain: 'arbitrum',
  depositAmount: '1.0',
});

// Track consensus
const status = await sdk.trinity.getOperationStatus(vault.operationId);
```

---

## Resources

- SDK: https://github.com/Chronos-Vault/chronos-vault-sdk
- Documentation: https://docs.chronosvault.org
- Security Proofs: https://github.com/Chronos-Vault/chronos-vault-security

---

*Last updated: December 2025*
