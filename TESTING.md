# SDK Testing Guide

**Version:** 1.1.0  
**Last Updated:** December 2025

## Overview

The SDK includes comprehensive tests covering:
- Unit tests for individual modules
- Integration tests with mocked providers
- Real testnet tests (optional)
- Type safety checks

## Running Tests

### Run All Tests

```bash
npm test
```

### Watch Mode (During Development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Specific Test File

```bash
npm test -- tests/integration/vault.test.ts
```

### Match Pattern

```bash
npm test -- --grep "vault"
```

## Test Structure

```
tests/
├── integration/
│   ├── trinity.test.ts      # Trinity Protocol tests
│   ├── htlc.test.ts         # Atomic swap tests
│   ├── vault.test.ts        # Vault management tests
│   ├── bridge.test.ts       # Cross-chain bridge tests
│   ├── multichain.test.ts   # Multi-chain coordination
│   ├── sdk-modes.test.ts    # API/RPC mode tests
│   ├── rpc-clients.test.ts  # RPC client tests
│   ├── real-testnet.test.ts # Real testnet (optional)
│   └── errors.test.ts       # Error handling
└── mocks/
    ├── arbitrum-provider.ts # Arbitrum provider mock
    ├── solana-provider.ts   # Solana provider mock
    ├── ton-provider.ts      # TON provider mock
    └── index.ts             # Mock utilities
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ChronosVaultSDK } from '@chronos-vault/sdk';

describe('VaultClient', () => {
  let sdk: ChronosVaultSDK;

  beforeEach(() => {
    sdk = new ChronosVaultSDK({
      network: 'testnet',
      apiBaseUrl: 'http://localhost:3000/api',
    });
  });

  it('should create a vault', async () => {
    const vault = await sdk.vault.createVault({
      name: 'Test Vault',
      vaultType: 'standard',
      chain: 'arbitrum',
      depositAmount: '1.0',
    });

    expect(vault.id).toBeDefined();
    expect(vault.address).toBeDefined();
    expect(vault.name).toBe('Test Vault');
  });

  it('should handle errors gracefully', async () => {
    await expect(
      sdk.vault.createVault({
        name: 'Invalid',
        vaultType: 'invalid' as any,
      })
    ).rejects.toThrow();
  });
});
```

### Mocking Providers

```typescript
import { MockArbitrumProvider, MockSolanaProvider } from '../mocks';

describe('Trinity Protocol', () => {
  it('should verify consensus with mocked providers', async () => {
    const arbitrum = new MockArbitrumProvider();
    const solana = new MockSolanaProvider();

    const sdk = new ChronosVaultSDK({
      network: 'testnet',
      mode: 'rpc',
      rpc: {
        arbitrum: { rpcUrl: 'mock' },
        solana: { rpcUrl: 'mock' },
      },
    });

    // Test consensus logic
  });
});
```

## Test Categories

### Unit Tests

Test individual functions without external dependencies:

```typescript
it('should generate valid secret hash', () => {
  const { secret, secretHash } = sdk.htlc.generateSecret();
  expect(secret).toMatch(/^0x[a-f0-9]{64}$/);
  expect(secretHash).toMatch(/^0x[a-f0-9]{64}$/);
});
```

### Integration Tests

Test module interactions:

```typescript
it('should create and manage vault lifecycle', async () => {
  const vault = await sdk.vault.createVault({ ... });
  await sdk.vault.deposit(vault.id, '1.0');
  const details = await sdk.vault.getVault(vault.id);
  expect(details.balance).toBe('1.0');
});
```

### Type Safety Tests

Verify TypeScript types work correctly:

```typescript
import type { Vault, SwapStatus } from '@chronos-vault/sdk';

it('should have correct types', () => {
  const vault: Vault = {
    id: 'vault-123',
    address: '0x...',
    name: 'Test',
    // IDE should suggest all properties
  };
});
```

## Real Testnet Testing

For testing against live testnets:

```typescript
// In real-testnet.test.ts
import { ChronosVaultSDK } from '@chronos-vault/sdk';

const sdk = new ChronosVaultSDK({
  network: 'testnet',
  mode: 'rpc',
  rpc: {
    arbitrum: {
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
      privateKey: process.env.PRIVATE_KEY,
    },
  },
});

it('should create vault on Arbitrum Sepolia', async () => {
  const vault = await sdk.vault.createVault({
    name: 'Real Testnet Vault',
    vaultType: 'standard',
    chain: 'arbitrum',
    depositAmount: '0.01', // Small amount for testing
  });

  expect(vault.address).toMatch(/^0x[a-f0-9]{40}$/);
}, { timeout: 60000 });
```

**Note:** Real testnet tests require:
- Valid RPC URLs
- Private key with test funds
- Extended timeout (60 seconds)
- Run separately: `npm test -- real-testnet.test.ts`

## Error Handling Tests

```typescript
import { ConsensusError, SDKError } from '@chronos-vault/sdk';

it('should throw ConsensusError when not enough confirmations', async () => {
  try {
    await sdk.trinity.submitConsensusOperation({
      operationType: 'invalid_operation' as any,
    });
  } catch (error) {
    expect(error).toBeInstanceOf(ConsensusError);
    expect(error.confirmations).toBeLessThan(2);
  }
});
```

## Coverage Report

```bash
npm run test:coverage
```

Generates coverage in `coverage/` directory. View with:

```bash
open coverage/index.html
```

Target coverage:
- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

## Debugging Tests

### Run with Debugging Output

```bash
npm test -- --reporter=verbose
```

### Use Debug Helper

```typescript
import { describe, it, expect, debug } from 'vitest';

it('debug test', async () => {
  const result = await sdk.trinity.getStats();
  debug(result); // Print to console
  expect(result).toBeDefined();
});
```

### Use Node Inspector

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

Then open `chrome://inspect` in Chrome DevTools.

## Continuous Integration

Tests run automatically on:
- Push to `main` branch
- Pull requests
- Before publishing to npm

## Performance Testing

```typescript
it('should handle 1000 operations', async () => {
  const start = performance.now();
  
  for (let i = 0; i < 1000; i++) {
    await sdk.trinity.getStats();
  }
  
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(5000); // 5 seconds
});
```

## Mocking External APIs

Mock failed API responses:

```typescript
it('should handle network errors', async () => {
  const sdk = new ChronosVaultSDK({
    network: 'testnet',
    apiBaseUrl: 'http://unreachable.invalid/api',
    timeout: 5000,
  });

  await expect(sdk.trinity.getStats()).rejects.toThrow();
});
```

## Testing Checklist

Before committing:

- [ ] All tests pass: `npm test`
- [ ] Types check: `npm run typecheck`
- [ ] Coverage acceptable: `npm run test:coverage`
- [ ] No console errors
- [ ] No memory leaks (monitor with DevTools)
- [ ] Tests are deterministic (pass every time)

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Best Practices](https://vitest.dev/guide/why.html)
- [Mocking Guide](https://vitest.dev/guide/mocking.html)
