# Changelog

All notable changes to the Chronos Vault SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-21

### Added
- **Dual-Mode Operation**: SDK now supports both API and direct RPC modes
- **BridgeRPCClient**: New RPC client for direct cross-chain messaging
  - `getMessageFee()` - Get fee estimates for cross-chain messages
  - `sendMessage()` - Send messages to other chains
  - `initiateExit()` - Start L2 exit process
  - `getPendingExits()` - List pending exit operations
  - `getMessageStatus()` - Track message delivery status
- **VaultRPCClient**: Direct vault contract interaction
  - `deposit()` - Deposit assets directly
  - `withdraw()` - Withdraw with Trinity verification
  - `getVaultBalance()` - Query vault balances
- **HTLCRPCClient**: Direct atomic swap operations
  - `initiateSwap()` - Create swaps on-chain
  - `claimSwap()` - Claim with secret reveal
  - `refundSwap()` - Refund expired swaps
- **TrinityRPCClient**: Consensus verification
  - `verifyConsensus()` - Check 2-of-3 status
  - `getConsensusState()` - Get detailed state
- **Hybrid Mode**: Combine API convenience with RPC control
- **Multi-chain provider management**: Arbitrum, Solana, TON providers

### Changed
- Renamed main class from `ChronosVaultClient` to `ChronosVaultSDK`
- Updated all contract addresses to latest testnet deployments
- Improved error types with `ConsensusError`, `ProviderError`, `SDKError`
- Enhanced TypeScript types and exports

### Fixed
- Timeout handling for long-running operations
- Chain status detection reliability
- Memory leaks in WebSocket connections

## [1.0.0] - 2025-10-15

### Added
- Initial release
- **TrinityClient**: Protocol statistics and chain status
- **HTLCClient**: Atomic swap creation and management
- **VaultClient**: Vault creation, deposits, withdrawals
- **BridgeClient**: Cross-chain fee estimation and transfers
- API-based architecture
- TypeScript support with full type definitions
- Error handling with custom error classes
- Contract address constants for Arbitrum, Solana, TON

### Security
- Formal verification with Lean 4 proofs
- 2-of-3 consensus requirement for all operations
- Quantum-resistant cryptography support

---

## Upgrade Guide

### From 1.0.x to 1.1.0

1. **Update imports:**
   ```typescript
   // Before
   import { ChronosVaultClient } from '@chronos-vault/sdk';
   
   // After
   import { ChronosVaultSDK } from '@chronos-vault/sdk';
   ```

2. **New RPC mode (optional):**
   ```typescript
   const sdk = new ChronosVaultSDK({
     mode: 'rpc', // New option
     rpc: { arbitrum: { rpcUrl: '...', privateKey: '...' } }
   });
   ```

3. **Updated error handling:**
   ```typescript
   import { ConsensusError, ProviderError, SDKError } from '@chronos-vault/sdk';
   ```
