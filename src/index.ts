/**
 * Chronos Vault SDK
 * Official TypeScript SDK for multi-chain security vaults
 * 
 * @packageDocumentation
 */

export { ChronosVaultSDK } from './ChronosVaultSDK';

// Export types
export type {
  VaultConfig,
  Vault,
  WalletConnection,
  TransferConfig,
  SecurityStatus,
  SDKConfig
} from './ChronosVaultSDK';

// Export constants
export const CONTRACTS = {
  ARBITRUM_SEPOLIA: {
    CrossChainBridgeV3: '0x39601883CD9A115Aba0228fe0620f468Dc710d54',
    CVTBridgeV3: '0x00d02550f2a8Fd2CeCa0d6b7882f05Beead1E5d0',
    EmergencyMultiSig: '0xFafCA23a7c085A842E827f53A853141C8243F924',
    CVTToken: '0xFb419D8E32c14F774279a4dEEf330dc893257147'
  }
};

export const CHAIN_IDS = {
  ARBITRUM_SEPOLIA: 421614,
  SOLANA_DEVNET: 'devnet',
  TON_TESTNET: 'testnet'
};

export const RPC_URLS = {
  ARBITRUM_SEPOLIA: 'https://sepolia-rollup.arbitrum.io/rpc',
  SOLANA_DEVNET: 'https://api.devnet.solana.org',
  TON_TESTNET: 'https://testnet.toncenter.com/api/v2/jsonRPC'
};
