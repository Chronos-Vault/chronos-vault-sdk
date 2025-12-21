/**
 * Consensus Tracking Example
 *
 * This example demonstrates how to submit operations that require
 * 2-of-3 Trinity Protocol consensus and track their progress.
 */

import { ChronosVaultSDK, ConsensusError } from '@chronos-vault/sdk';

async function main() {
  // Initialize the SDK
  const sdk = new ChronosVaultSDK({
    network: 'testnet',
    apiBaseUrl: 'https://testnet.chronosvault.org/api',
  });

  console.log('Chronos Vault SDK - Consensus Tracking Example\n');

  // 1. Get Trinity Protocol statistics
  console.log('Step 1: Protocol statistics');
  const stats = await sdk.trinity.getStats();
  console.log(`  Total Vaults: ${stats.vaults.totalVaults}`);
  console.log(`  Total Value Locked: $${stats.vaults.totalValueLocked}`);
  console.log(`  Active Validators: ${stats.validators.activeValidators}`);
  console.log(`  Consensus Success Rate: ${stats.validators.consensusSuccessRate}%`);
  console.log();

  // 2. Check chain status
  console.log('Step 2: Chain status');
  const chains = await sdk.trinity.getChains();
  for (const chain of chains) {
    console.log(`  ${chain.name}:`);
    console.log(`    Status: ${chain.status === 'active' ? '🟢 Active' : '🔴 Inactive'}`);
    console.log(`    Contract: ${chain.contract || chain.program}`);
  }
  console.log();

  // 3. Submit a consensus operation
  console.log('Step 3: Submit consensus operation');
  console.log('  Operation: Vault Unlock');
  console.log('  Requires: 2 of 3 chain confirmations');
  console.log();

  try {
    const operation = await sdk.trinity.submitConsensusOperation({
      operationType: 'vault_unlock',
      data: {
        vaultId: 'vault-example-123',
        amount: '5.0',
      },
    });

    console.log('Operation submitted!');
    console.log(`  Operation ID: ${operation.id}`);
    console.log(`  Status: ${operation.status}`);
    console.log();

    // 4. Poll for consensus
    console.log('Step 4: Tracking consensus progress...');
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const status = await sdk.trinity.getOperationStatus(operation.id);

      console.log(`\n  Attempt ${attempts + 1}/${maxAttempts}`);
      console.log(`  Confirmations: ${status.confirmations} / 2 required`);
      console.log(`  Arbitrum: ${status.chains.arbitrum.confirmed ? '✓ Confirmed' : '⏳ Pending'}`);
      console.log(`  Solana: ${status.chains.solana.confirmed ? '✓ Confirmed' : '⏳ Pending'}`);
      console.log(`  TON: ${status.chains.ton.confirmed ? '✓ Confirmed' : '⏳ Pending'}`);

      if (status.confirmations >= 2) {
        console.log('\n  ✅ Consensus reached! Operation approved.');
        break;
      }

      if (status.status === 'failed') {
        console.log('\n  ❌ Operation failed.');
        break;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (error) {
    if (error instanceof ConsensusError) {
      console.log('Consensus failed!');
      console.log(`  Got ${error.confirmations} confirmations, needed 2`);
      console.log('  Retry or check chain status');
    } else {
      throw error;
    }
  }

  // 5. View security layers
  console.log('\nStep 5: Active security layers');
  const layers = sdk.trinity.getSecurityLayers();
  layers.forEach((layer, index) => {
    console.log(`  ${index + 1}. ${layer.name}`);
    console.log(`     ${layer.description}`);
  });

  console.log('\nExample complete!');
}

main().catch(console.error);
