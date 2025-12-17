/**
 * Constants for Chronos Vault SDK
 */

export const CONTRACTS = {
  arbitrum: {
    testnet: {
      TrinityConsensusVerifier: '0x59396D58Fa856025bD5249E342729d5550Be151C',
      TrinityShieldVerifierV2: '0x5E1EE00E5DFa54488AC5052C747B97c7564872F9',
      TrinityShieldVerifier: '0x2971c0c3139F89808F87b2445e53E5Fb83b6A002', // DEPRECATED
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
    mainnet: {
      // To be deployed
    }
  },
  solana: {
    testnet: {
      TrinityProgram: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
      CVTToken: '5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4',
      BridgeProgram: '6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK',
      VestingProgram: '3dxjcEGP8MurCtodLCJi1V6JBizdRRAYg91nZkhmX1sB',
    },
    mainnet: {
      // To be deployed
    }
  },
  ton: {
    testnet: {
      TrinityConsensus: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8',
      ChronosVault: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4',
      CrossChainBridge: 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
      CVTJetton: 'EQDJAnXDPT-NivritpEhQeP0XmG20NdeUtxgh4nUiWH-DF7M',
      CVTBridge: 'EQAOJxa1WDjGZ7f3n53JILojhZoDdTOKWl6h41_yOWX3v0tq',
    },
    mainnet: {
      // To be deployed
    }
  }
} as const;

export const VALIDATORS = {
  testnet: {
    arbitrum: '0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8',
    solana: '0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5',
    ton: '0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4',
  },
  mainnet: {
    arbitrum: '',
    solana: '',
    ton: '',
  }
} as const;

export const RPC_URLS = {
  arbitrum: {
    testnet: 'https://sepolia-rollup.arbitrum.io/rpc',
    mainnet: 'https://arb1.arbitrum.io/rpc',
  },
  solana: {
    testnet: 'https://api.devnet.solana.com',
    mainnet: 'https://api.mainnet-beta.solana.com',
  },
  ton: {
    testnet: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    mainnet: 'https://toncenter.com/api/v2/jsonRPC',
  }
} as const;

export const CHAIN_IDS = {
  arbitrum: 1,
  solana: 2,
  ton: 3,
} as const;

export const SECURITY_LAYERS = [
  { id: 1, name: 'Zero-Knowledge Proof Engine', type: 'groth16' },
  { id: 2, name: 'Formal Verification Pipeline', type: 'lean4' },
  { id: 3, name: 'Multi-Party Computation', type: 'mpc' },
  { id: 4, name: 'Verifiable Delay Functions', type: 'vdf' },
  { id: 5, name: 'AI + Cryptographic Governance', type: 'ai-governance' },
  { id: 6, name: 'Quantum-Resistant Cryptography', type: 'pqc' },
  { id: 7, name: 'Trinity Protocol™ Consensus', type: 'consensus' },
  { id: 8, name: 'Trinity Shield™ TEE', type: 'tee' },
] as const;

export const CONSENSUS_THRESHOLD = 2;
export const TOTAL_VALIDATORS = 3;
export const ATTESTATION_VALIDITY_HOURS = 24;
export const MAX_QUOTE_AGE_MINUTES = 10;
