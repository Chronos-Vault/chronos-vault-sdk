# Solana Deployment Guide

**Last Updated:** December 2025  
**SDK Version:** 1.1.0

## Overview

This guide covers deploying and interacting with Trinity Protocol programs on Solana.

## Deployed Programs (Devnet)

| Program | Address |
|---------|---------|
| Trinity Validator | `CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2` |
| CVT Token | `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4` |
| Bridge Program | `6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK` |
| Vesting Program | `3dxjcEGP8MurCtodLCJi1V6JBizdRRAYg91nZkhmX1sB` |

## SDK Integration

### Initialize Solana Provider

```typescript
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  mode: 'rpc',
  rpc: {
    solana: {
      rpcUrl: 'https://api.devnet.solana.com',
      commitment: 'confirmed',
    },
  },
});
```

### Using with Private Key

```typescript
const sdk = new ChronosVaultSDK({
  network: 'testnet',
  mode: 'rpc',
  rpc: {
    solana: {
      rpcUrl: 'https://api.devnet.solana.com',
      privateKey: process.env.SOLANA_PRIVATE_KEY, // Base58 encoded
      commitment: 'confirmed',
    },
  },
});
```

## Trinity Validator Program

The Trinity Validator program verifies cross-chain consensus on Solana.

### Verify Consensus

```typescript
// Submit verification from Solana
const result = await sdk.trinity.verifyOnSolana({
  operationId: 'op-123',
  proof: proofData,
});

console.log('Verification TX:', result.signature);
```

## CVT Token (SPL Token)

The CVT token is the native token for Trinity Protocol on Solana.

### Token Details

- **Mint Address:** `5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4`
- **Decimals:** 9
- **Standard:** SPL Token

### Get Token Balance

```typescript
const balance = await sdk.solana.getTokenBalance(
  walletAddress,
  '5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4'
);
console.log('CVT Balance:', balance);
```

## Bridge Program

The Bridge Program handles cross-chain message relay from Arbitrum and TON.

### Receive Cross-Chain Message

```typescript
// Messages are automatically relayed by the Trinity Relayer
// Check pending messages for your address
const messages = await sdk.bridge.getPendingMessages('solana', walletAddress);
```

### Claim Bridged Assets

```typescript
const claim = await sdk.bridge.claimOnSolana({
  messageId: 'msg-123',
  proof: merkleProof,
});
```

## Testing on Devnet

### Get Devnet SOL

```bash
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

### Verify Program Deployment

```bash
solana program show CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2 --url devnet
```

## Program Architecture

```
Trinity Validator (CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2)
├── verify_consensus()     - Verify 2-of-3 consensus
├── submit_attestation()   - Submit chain attestation
└── get_consensus_state()  - Query consensus status

Bridge Program (6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK)
├── receive_message()      - Receive cross-chain message
├── claim_tokens()         - Claim bridged tokens
└── initiate_exit()        - Start exit to other chain

CVT Token (5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4)
├── Standard SPL Token
├── Mint authority: Bridge Program
└── Used for protocol fees
```

## Security Considerations

1. **Private Keys**: Never expose private keys in code
2. **RPC Endpoints**: Use reliable RPC providers for production
3. **Transaction Confirmation**: Wait for `confirmed` or `finalized` commitment
4. **Program Verification**: Verify program addresses before transactions

## Resources

- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [SDK Documentation](https://docs.chronosvault.org)
- [Trinity Protocol Docs](https://docs.chronosvault.org/trinity)
