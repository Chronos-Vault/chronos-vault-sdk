/**
 * Basic Vault Example
 *
 * This example demonstrates how to create and manage a vault
 * with Trinity Protocol security using the Chronos Vault SDK.
 */

import { ChronosVaultSDK } from '@chronos-vault/sdk';

async function main() {
  // Initialize the SDK
  const sdk = new ChronosVaultSDK({
    network: 'testnet',
    apiBaseUrl: 'https://testnet.chronosvault.org/api',
  });

  console.log('Chronos Vault SDK - Basic Vault Example\n');

  // 1. Check available vault types
  const vaultTypes = sdk.vault.getVaultTypes();
  console.log('Available vault types:');
  vaultTypes.forEach((type) => {
    console.log(`  - ${type.name}: ${type.description}`);
  });
  console.log();

  // 2. Create a new vault
  console.log('Creating a new vault...');
  const vault = await sdk.vault.createVault({
    name: 'My First Vault',
    vaultType: 'standard',
    chain: 'arbitrum',
    depositAmount: '0.1', // 0.1 ETH
  });

  console.log('Vault created successfully!');
  console.log(`  ID: ${vault.id}`);
  console.log(`  Address: ${vault.address}`);
  console.log(`  Balance: ${vault.balance} ETH`);
  console.log();

  // 3. Deposit more funds
  console.log('Depositing additional funds...');
  await sdk.vault.deposit(vault.id, '0.05');
  console.log('Deposit successful!');
  console.log();

  // 4. Check vault details
  console.log('Fetching vault details...');
  const details = await sdk.vault.getVault(vault.id);
  console.log(`  Name: ${details.name}`);
  console.log(`  Type: ${details.type}`);
  console.log(`  Chain: ${details.chain}`);
  console.log(`  Balance: ${details.balance} ETH`);
  console.log(`  Status: ${details.status}`);
  console.log();

  // 5. Withdraw funds (requires 2-of-3 consensus)
  console.log('Withdrawing funds (Trinity verification required)...');
  const withdrawal = await sdk.vault.withdraw(vault.id, '0.02');
  console.log('Withdrawal initiated!');
  console.log(`  Operation ID: ${withdrawal.operationId}`);
  console.log(`  Status: ${withdrawal.status}`);
  console.log();

  // 6. Track consensus progress
  if (withdrawal.operationId) {
    console.log('Tracking consensus...');
    const status = await sdk.trinity.getOperationStatus(withdrawal.operationId);
    console.log(`  Confirmations: ${status.confirmations} / 2 required`);
    console.log(`  Arbitrum: ${status.chains.arbitrum.confirmed ? '✓' : 'pending'}`);
    console.log(`  Solana: ${status.chains.solana.confirmed ? '✓' : 'pending'}`);
    console.log(`  TON: ${status.chains.ton.confirmed ? '✓' : 'pending'}`);
  }

  console.log('\nExample complete!');
}

main().catch(console.error);
