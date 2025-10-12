# Chronos Vault SDK

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
