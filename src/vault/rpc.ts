/**
 * Vault RPC Client
 * Direct blockchain integration for ERC-4626 vault operations
 */

import { ArbitrumProvider } from '../providers/arbitrum';
import { CHRONOS_VAULT_OPTIMIZED_ABI, CHRONOS_VAULT_OPTIMIZED_ADDRESS } from '../abis/ChronosVaultOptimized';
import { RPCConfig } from '../types';

class SDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SDKError';
  }
}

export interface VaultInfo {
  asset: string;
  totalAssets: string;
  totalSupply: string;
  consensusRequired: boolean;
  trinityVerifier: string;
}

export class VaultRPCClient {
  private arbitrum?: ArbitrumProvider;

  constructor(config: RPCConfig) {
    if (config.arbitrum) {
      this.arbitrum = new ArbitrumProvider(config.arbitrum);
    }
  }

  async getVaultInfo(vaultAddress?: string): Promise<VaultInfo> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;

    const [asset, totalAssets, totalSupply, consensusRequired, trinityVerifier] = await Promise.all([
      this.arbitrum.callContractMethod(address, CHRONOS_VAULT_OPTIMIZED_ABI, 'asset'),
      this.arbitrum.callContractMethod(address, CHRONOS_VAULT_OPTIMIZED_ABI, 'totalAssets'),
      this.arbitrum.callContractMethod(address, CHRONOS_VAULT_OPTIMIZED_ABI, 'totalSupply'),
      this.arbitrum.callContractMethod(address, CHRONOS_VAULT_OPTIMIZED_ABI, 'consensusRequired'),
      this.arbitrum.callContractMethod(address, CHRONOS_VAULT_OPTIMIZED_ABI, 'trinityVerifier')
    ]);

    return {
      asset,
      totalAssets: totalAssets.toString(),
      totalSupply: totalSupply.toString(),
      consensusRequired,
      trinityVerifier
    };
  }

  async getBalance(account: string, vaultAddress?: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const result = await this.arbitrum.callContractMethod(
      address, 
      CHRONOS_VAULT_OPTIMIZED_ABI, 
      'balanceOf',
      [account]
    );

    return result.toString();
  }

  async convertToAssets(shares: string, vaultAddress?: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const result = await this.arbitrum.callContractMethod(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'convertToAssets',
      [shares]
    );

    return result.toString();
  }

  async convertToShares(assets: string, vaultAddress?: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const result = await this.arbitrum.callContractMethod(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'convertToShares',
      [assets]
    );

    return result.toString();
  }

  async deposit(assets: string, receiver: string, vaultAddress?: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const tx = await this.arbitrum.sendTransaction(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'deposit',
      [assets, receiver]
    );

    return tx.hash;
  }

  async withdraw(
    assets: string,
    receiver: string,
    owner: string,
    vaultAddress?: string
  ): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const tx = await this.arbitrum.sendTransaction(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'withdraw',
      [assets, receiver, owner]
    );

    return tx.hash;
  }

  async redeem(
    shares: string,
    receiver: string,
    owner: string,
    vaultAddress?: string
  ): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const tx = await this.arbitrum.sendTransaction(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'redeem',
      [shares, receiver, owner]
    );

    return tx.hash;
  }

  async maxDeposit(receiver: string, vaultAddress?: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const result = await this.arbitrum.callContractMethod(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'maxDeposit',
      [receiver]
    );

    return result.toString();
  }

  async maxWithdraw(owner: string, vaultAddress?: string): Promise<string> {
    if (!this.arbitrum) {
      throw new SDKError('Arbitrum provider not configured');
    }

    const address = vaultAddress || CHRONOS_VAULT_OPTIMIZED_ADDRESS;
    const result = await this.arbitrum.callContractMethod(
      address,
      CHRONOS_VAULT_OPTIMIZED_ABI,
      'maxWithdraw',
      [owner]
    );

    return result.toString();
  }
}

export default VaultRPCClient;
