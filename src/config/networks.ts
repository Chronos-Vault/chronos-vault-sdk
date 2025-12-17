/**
 * Network Configuration for Trinity Protocol
 * Real testnet endpoints and deployed contract addresses
 */

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  contracts: Record<string, string>;
}

export const ARBITRUM_SEPOLIA: NetworkConfig = {
  name: 'Arbitrum Sepolia',
  chainId: 421614,
  rpcUrl: 'https://arb-sepolia.g.alchemy.com/v2',
  explorerUrl: 'https://sepolia.arbiscan.io',
  contracts: {
    TrinityConsensusVerifier: '0x59396D58Fa856025bD5249E342729d5550Be151C',
    TrinityShieldVerifierV2: '0x5E1EE00E5DFa54488AC5052C747B97c7564872F9',
    EmergencyMultiSig: '0x066A39Af76b625c1074aE96ce9A111532950Fc41',
    TrinityKeeperRegistry: '0xAe9bd988011583D87d6bbc206C19e4a9Bda04830',
    TrinityGovernanceTimelock: '0xf6b9AB802b323f8Be35ca1C733e155D4BdcDb61b',
    CrossChainMessageRelay: '0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59',
    TrinityExitGateway: '0xE6FeBd695e4b5681DCF274fDB47d786523796C04',
    TrinityFeeSplitter: '0x4F777c8c7D3Ea270c7c6D9Db8250ceBe1648A058',
    TrinityRelayerCoordinator: '0x4023B7307BF9e1098e0c34F7E8653a435b20e635',
    HTLCChronosBridge: '0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca',
    HTLCArbToL1: '0xaDDAC5670941416063551c996e169b0fa569B8e1',
    ChronosVaultOptimized: '0xAE408eC592f0f865bA0012C480E8867e12B4F32D',
    TestERC20: '0x4567853BE0d5780099E3542Df2e00C5B633E0161',
  },
};

export const SOLANA_DEVNET: NetworkConfig = {
  name: 'Solana Devnet',
  chainId: 2,
  rpcUrl: 'https://api.devnet.solana.com',
  explorerUrl: 'https://explorer.solana.com',
  contracts: {
    TrinityValidator: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
  },
};

export const TON_TESTNET: NetworkConfig = {
  name: 'TON Testnet',
  chainId: 3,
  rpcUrl: 'https://testnet.toncenter.com/api/v2',
  explorerUrl: 'https://testnet.tonscan.org',
  contracts: {
    TrinityConsensus: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8',
    ChronosVault: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4',
    CrossChainBridge: 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
  },
};

export const VALIDATORS = {
  arbitrum: '0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8',
  solana: '0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5',
  ton: '0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4',
};

export const VERIFIED_TRANSACTIONS = {
  htlcSwap: '0x59b57008903db46787089f9f063272a0723407ec52ed9a373f7c0c24ea315e9e',
  arbitrum: '0xe085266cd3a1097dc8167a82339a787a85f232454d6b774be5dde62a4d497c5b',
  solana: '22sSb3Udn1hqYKdXKVZNM9zNKJsi7CUdMh6PMowdh62Mx5PpqUqGE58hEejU8pHZXXjHT1DjVWKBQqPS54rnddzx',
  ton: 'ehPo6QqXPMw2IF62KmwtvXeUIJoIwfPPa6HZKnbW56g',
};

export function getAlchemyRpcUrl(apiKey: string): string {
  return `${ARBITRUM_SEPOLIA.rpcUrl}/${apiKey}`;
}

export function getSolanaRpcUrls(): string[] {
  return [
    'https://api.devnet.solana.com',
    'https://devnet.helius-rpc.com',
    'https://rpc.ankr.com/solana_devnet',
  ];
}

export function getTonRpcUrl(apiKey?: string): string {
  if (apiKey) {
    return `https://testnet.toncenter.com/api/v2/jsonRPC?api_key=${apiKey}`;
  }
  return 'https://testnet.toncenter.com/api/v2/jsonRPC';
}
