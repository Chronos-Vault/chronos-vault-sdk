# Chronos Vault API Reference

**Version:** 1.1.0  
**Last Updated:** December 2025  
**Base URL:** `https://api.chronosvault.org/api`

---

## Overview

The Chronos Vault API provides RESTful endpoints for managing multi-chain digital vaults with Trinity Protocol security. All responses are in JSON format.

### Base URLs

**Production:**
```
https://api.chronosvault.org/api
```

**Testnet:**
```
https://testnet.chronosvault.org/api
```

**Local Development:**
```
http://localhost:5000/api
```

---

## Authentication

### Wallet-Based Authentication

Connect your blockchain wallet to authenticate. Supported wallets:

- **Ethereum/Arbitrum**: MetaMask, WalletConnect
- **TON**: TON Keeper, TON Wallet
- **Solana**: Phantom, Solflare

### API Key Authentication

For programmatic access:

```
Authorization: Bearer YOUR_API_KEY
```

---

## Core Endpoints

### Health Check

```
GET /api/health-check
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1703116800000,
  "version": "1.1.0"
}
```

### System Health

```
GET /api/health/system
```

**Response:**
```json
{
  "status": "healthy",
  "components": {
    "database": "connected",
    "blockchain": {
      "arbitrum": "online",
      "solana": "online",
      "ton": "online"
    }
  },
  "uptime": 1234567,
  "timestamp": 1703116800000
}
```

---

## Trinity Protocol API

### Get Protocol Statistics

```
GET /api/trinity/stats
```

**Response:**
```json
{
  "vaults": {
    "totalVaults": 1250,
    "totalValueLocked": "45000000.00"
  },
  "validators": {
    "activeValidators": 3,
    "consensusSuccessRate": 99.7
  },
  "chains": {
    "arbitrum": { "status": "active", "blockHeight": 12345678 },
    "solana": { "status": "active", "slot": 234567890 },
    "ton": { "status": "active", "seqno": 34567890 }
  }
}
```

### Get Chain Status

```
GET /api/trinity/chains
```

**Response:**
```json
{
  "chains": [
    {
      "id": "arbitrum",
      "name": "Arbitrum",
      "status": "active",
      "contract": "0x59396D58Fa856025bD5249E342729d5550Be151C",
      "latestBlock": 12345678
    },
    {
      "id": "solana",
      "name": "Solana",
      "status": "active",
      "program": "CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2",
      "latestSlot": 234567890
    },
    {
      "id": "ton",
      "name": "TON",
      "status": "active",
      "contract": "EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8",
      "latestSeqno": 34567890
    }
  ]
}
```

### Submit Consensus Operation

```
POST /api/trinity/operations
```

**Request:**
```json
{
  "operationType": "vault_unlock",
  "data": {
    "vaultId": "vault-123",
    "amount": "100.0"
  }
}
```

**Response:**
```json
{
  "operationId": "op-abc123",
  "status": "pending",
  "confirmations": 0,
  "requiredConfirmations": 2
}
```

### Get Operation Status

```
GET /api/trinity/operations/:operationId
```

**Response:**
```json
{
  "operationId": "op-abc123",
  "status": "confirmed",
  "confirmations": 2,
  "chains": {
    "arbitrum": { "confirmed": true, "txHash": "0x..." },
    "solana": { "confirmed": true, "signature": "..." },
    "ton": { "confirmed": false }
  }
}
```

---

## Vault Management API

### Create Vault

```
POST /api/vaults
```

**Request:**
```json
{
  "name": "My Secure Vault",
  "vaultType": "erc4626",
  "chain": "arbitrum",
  "depositAmount": "10.0"
}
```

**Response:**
```json
{
  "id": "vault-abc123",
  "name": "My Secure Vault",
  "type": "erc4626",
  "chain": "arbitrum",
  "address": "0x...",
  "balance": "10.0",
  "status": "active"
}
```

### Get Vault

```
GET /api/vaults/:vaultId
```

### List Vaults

```
GET /api/vaults
```

### Deposit to Vault

```
POST /api/vaults/:vaultId/deposit
```

**Request:**
```json
{
  "amount": "5.0"
}
```

### Withdraw from Vault

```
POST /api/vaults/:vaultId/withdraw
```

**Request:**
```json
{
  "amount": "2.5"
}
```

---

## HTLC API

### Create Swap

```
POST /api/htlc/swaps
```

**Request:**
```json
{
  "sourceChain": "arbitrum",
  "targetChain": "solana",
  "amount": "1.0",
  "participant": "0x...",
  "timeLockHours": 24
}
```

**Response:**
```json
{
  "swapId": "swap-abc123",
  "secretHash": "0x...",
  "timeLock": 1703203200,
  "status": "initiated"
}
```

### Get Swap Status

```
GET /api/htlc/swaps/:swapId
```

### Claim Swap

```
POST /api/htlc/swaps/:swapId/claim
```

**Request:**
```json
{
  "secret": "0x..."
}
```

### Refund Swap

```
POST /api/htlc/swaps/:swapId/refund
```

---

## Bridge API

### Get Bridge Status

```
GET /api/bridge/status/:sourceChain/:targetChain
```

### Estimate Fees

```
POST /api/bridge/estimate
```

**Request:**
```json
{
  "sourceChain": "arbitrum",
  "targetChain": "solana",
  "amount": "100.0",
  "assetType": "ETH"
}
```

**Response:**
```json
{
  "baseFee": "0.001",
  "percentageFee": 0.1,
  "estimatedGas": "150000",
  "totalFee": "0.101",
  "estimatedTime": 300
}
```

### Initiate Transfer

```
POST /api/bridge/transfer
```

**Request:**
```json
{
  "sourceChain": "arbitrum",
  "targetChain": "solana",
  "amount": "50.0",
  "assetType": "ETH",
  "senderAddress": "0x...",
  "recipientAddress": "..."
}
```

---

## WebSocket API

### Connection

```javascript
const ws = new WebSocket('wss://api.chronosvault.org/ws');
```

### Subscribe to Events

```json
{
  "action": "subscribe",
  "channel": "trinity.operations",
  "operationId": "op-abc123"
}
```

### Event Types

- `operation.confirmed` - Consensus confirmation received
- `vault.deposit` - Deposit completed
- `vault.withdraw` - Withdrawal completed
- `swap.claimed` - HTLC swap claimed
- `swap.refunded` - HTLC swap refunded

---

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "CONSENSUS_FAILED",
    "message": "Required confirmations not reached",
    "details": {
      "confirmations": 1,
      "required": 2
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Malformed request |
| `UNAUTHORIZED` | Invalid or missing authentication |
| `NOT_FOUND` | Resource not found |
| `CONSENSUS_FAILED` | Trinity consensus not achieved |
| `CHAIN_UNAVAILABLE` | Blockchain temporarily unavailable |
| `INSUFFICIENT_FUNDS` | Insufficient balance |
| `TIMELOCK_ACTIVE` | Timelock not expired |

---

## Rate Limits

| Plan | Requests/min | Burst |
|------|--------------|-------|
| Free | 60 | 10 |
| Developer | 600 | 100 |
| Enterprise | 6000 | 1000 |

---

## SDK

For easier integration, use our official SDK:

```bash
npm install @chronos-vault/sdk
```

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  apiBaseUrl: 'https://testnet.chronosvault.org/api',
});
```

---

*Last updated: December 2025*
