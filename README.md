# Chronos Vault SDK


![NPM Version](https://img.shields.io/badge/npm-v1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Multi Chain](https://img.shields.io/badge/chains-Arbitrum%20%7C%20Solana%20%7C%20TON-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## TypeScript/JavaScript SDK for Mathematical Defense Layer

Professional client library for interacting with Chronos Vault's mathematically provable security platform.

## Installation

```bash
npm install @chronos-vault/sdk
```

## Usage

```typescript
import { ChronosVaultClient } from '@chronos-vault/sdk';

const client = new ChronosVaultClient({
  apiUrl: 'https://api.chronosvault.org',
  websocketUrl: 'wss://ws.chronosvault.org'
});

// Create vault with MDL validation
const vault = await client.createVault({
  vaultType: 'TIME_LOCK',
  securityLevel: 'MAXIMUM',
  enableQuantumResistant: true,
  chainPreference: 'arbitrum'
});

// Subscribe to real-time MDL updates
client.subscribe('mdl-status', (data) => {
  console.log('MDL Status:', data);
});
```

## Features

- ✅ Full TypeScript support with type definitions
- ✅ Real-time WebSocket monitoring
- ✅ MDL validation helpers
- ✅ Multi-chain vault operations
- ✅ Trinity Protocol consensus tracking
- ✅ AI governance proposal monitoring

## API Reference

See [documentation](https://docs.chronosvault.org/sdk) for complete API reference.

## License

MIT - Chronos Vault
