/**
 * Bridge Transfer Example
 *
 * This example demonstrates how to transfer assets between
 * Arbitrum, Solana, and TON using the cross-chain bridge.
 */

import { ChronosVaultSDK } from '@chronos-vault/sdk';

async function main() {
  // Initialize the SDK
  const sdk = new ChronosVaultSDK({
    network: 'testnet',
    apiBaseUrl: 'https://testnet.chronosvault.org/api',
  });

  console.log('Chronos Vault SDK - Bridge Transfer Example\n');

  // 1. Check bridge status
  console.log('Step 1: Check bridge status');
  const status = await sdk.bridge.getBridgeStatus('arbitrum', 'solana');
  console.log(`  Route: Arbitrum → Solana`);
  console.log(`  Status: ${status.active ? 'Active' : 'Inactive'}`);
  console.log(`  Liquidity: ${status.liquidity} ETH`);
  console.log();

  // 2. Estimate transfer fees
  console.log('Step 2: Estimate transfer fees');
  const fees = await sdk.bridge.estimateFees({
    sourceChain: 'arbitrum',
    targetChain: 'solana',
    amount: '10.0',
    assetType: 'ETH',
  });

  console.log(`  Amount: 10.0 ETH`);
  console.log(`  Base Fee: ${fees.baseFee} ETH`);
  console.log(`  Percentage Fee: ${fees.percentageFee}%`);
  console.log(`  Total Fee: ${fees.totalFee} ETH`);
  console.log(`  You'll receive: ${fees.receivedAmount} ETH (wrapped)`);
  console.log(`  Estimated Time: ${fees.estimatedTime} seconds`);
  console.log();

  // 3. Initiate transfer
  console.log('Step 3: Initiate transfer');
  const transfer = await sdk.bridge.initiateTransfer({
    sourceChain: 'arbitrum',
    targetChain: 'solana',
    amount: '10.0',
    assetType: 'ETH',
    senderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f00000',
    recipientAddress: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
  });

  console.log('Transfer initiated!');
  console.log(`  Transfer ID: ${transfer.id}`);
  console.log(`  Status: ${transfer.status}`);
  console.log(`  Source TX: ${transfer.sourceTxHash}`);
  console.log();

  // 4. Track transfer progress
  console.log('Step 4: Track transfer progress');
  const progress = await sdk.bridge.getTransferStatus(transfer.id);
  console.log(`  Status: ${progress.status}`);
  console.log(`  Confirmations: ${progress.confirmations} / ${progress.requiredConfirmations}`);
  console.log();

  // 5. Check supported routes
  console.log('Step 5: Supported bridge routes');
  const routes = [
    ['arbitrum', 'solana'],
    ['arbitrum', 'ton'],
    ['solana', 'arbitrum'],
    ['solana', 'ton'],
    ['ton', 'arbitrum'],
    ['ton', 'solana'],
  ];

  for (const [source, target] of routes) {
    console.log(`  ${source} → ${target}: ✓`);
  }

  console.log('\nExample complete!');
}

main().catch(console.error);
