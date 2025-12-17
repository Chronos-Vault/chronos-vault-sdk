/**
 * Core types for Chronos Vault SDK
 */

export type ChainId = 'arbitrum' | 'solana' | 'ton';
export type NetworkType = 'mainnet' | 'testnet';

export interface ChronosVaultConfig {
  network: NetworkType;
  apiBaseUrl: string;
  arbitrumRpcUrl?: string;
  solanaRpcUrl?: string;
  tonRpcUrl?: string;
  apiKey?: string;
  timeout?: number;
}

export const DEFAULT_CONFIG: ChronosVaultConfig = {
  network: 'testnet',
  apiBaseUrl: 'https://api.chronosvault.org',
  timeout: 30000,
};

export interface Validator {
  id: number;
  walletAddress: string;
  operatorName: string;
  hardwareType: 'sgx' | 'sev';
  role: ChainId;
  status: 'draft' | 'submitted' | 'attesting' | 'approved' | 'rejected';
  isActive: boolean;
}

export interface ChainStatus {
  chainId: ChainId;
  chainName: string;
  status: 'active' | 'degraded' | 'offline';
  lastBlock?: string;
  txCount24h: number;
  avgBlockTime: number;
  contracts: Record<string, string>;
}

export interface TrinityStats {
  chains: Record<string, ChainStatus>;
  protocol: {
    totalConsensusOps: number;
    pendingConsensusOps: number;
    confirmedConsensusOps: number;
    failedConsensusOps: number;
    averageConfirmationTime: number;
  };
  vaults: {
    totalVaults: number;
    activeVaults: number;
    lockedValue: string;
    lockedValueUsd: string;
  };
  validators: {
    totalValidators: number;
    activeValidators: number;
    averageResponseTime: number;
    consensusSuccessRate: number;
  };
}

export interface SecurityLayer {
  id: number;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  type: string;
  description: string;
  verificationCount: number;
}

export interface TrinityShieldAttestation {
  id: number;
  validatorId: number;
  attestationType: 'sgx' | 'sev';
  quote: string;
  reportData: string;
  status: 'pending' | 'verified' | 'expired' | 'failed';
  expiresAt: string;
}

export interface LeanProof {
  id: string;
  theoremName: string;
  proofHash: string;
  status: 'verified' | 'pending' | 'failed';
  verifiedAt?: string;
  contractAddress?: string;
}

export interface ConsensusOperation {
  id: string;
  operationType: string;
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  confirmations: number;
  requiredConfirmations: number;
  chains: {
    arbitrum: boolean;
    solana: boolean;
    ton: boolean;
  };
  createdAt: string;
  expiresAt: string;
  txHashes?: {
    arbitrum?: string;
    solana?: string;
    ton?: string;
  };
}

export enum HTLCSwapStatus {
  INITIATED = 'initiated',
  FUNDED = 'funded',
  CLAIMED = 'claimed',
  REFUNDED = 'refunded',
  EXPIRED = 'expired'
}

export interface HTLCSwap {
  id: string;
  hashLock: string;
  timeLock: number;
  sourceChain: ChainId;
  targetChain: ChainId;
  initiator: string;
  participant: string;
  amount: string;
  status: HTLCSwapStatus;
  secretHash: string;
  secret?: string;
  createdAt: string;
  claimedAt?: string;
  refundedAt?: string;
}

export interface VaultConfig {
  name: string;
  vaultType: 'standard' | 'erc4626' | 'timelock' | 'multisig';
  chain: ChainId;
  depositAmount: string;
  beneficiaries?: string[];
  timeLockDuration?: number;
  requiredSignatures?: number;
}

export interface Vault {
  id: string;
  name: string;
  vaultType: string;
  chain: ChainId;
  contractAddress: string;
  owner: string;
  balance: string;
  status: 'active' | 'locked' | 'unlocked' | 'closed';
  createdAt: string;
  unlockAt?: string;
}

export enum BridgeTransactionStatus {
  PENDING = 'pending',
  CONFIRMING = 'confirming',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface BridgeTransaction {
  id: string;
  sourceChain: ChainId;
  targetChain: ChainId;
  amount: string;
  assetType: string;
  senderAddress: string;
  recipientAddress: string;
  status: BridgeTransactionStatus;
  sourceTransactionId?: string;
  targetTransactionId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface BridgeStatus {
  sourceChain: ChainId;
  targetChain: ChainId;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  pendingTransactions: number;
  successRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
