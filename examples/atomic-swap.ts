/**
 * Atomic Swap Example
 *
 * This example demonstrates how to perform a trustless cross-chain
 * atomic swap using HTLC (Hash Time-Locked Contracts) with the SDK.
 */

import { ChronosVaultSDK } from '@chronos-vault/sdk';

async function main() {
  // Initialize the SDK
  const sdk = new ChronosVaultSDK({
    network: 'testnet',
    apiBaseUrl: 'https://testnet.chronosvault.org/api',
  });

  console.log('Chronos Vault SDK - Atomic Swap Example\n');

  // 1. Generate a cryptographic secret
  console.log('Step 1: Generate secret for the swap');
  const { secret, secretHash } = sdk.htlc.generateSecret();
  console.log(`  Secret Hash: ${secretHash}`);
  console.log('  (Keep the secret private until ready to claim)\n');

  // 2. Create the swap
  console.log('Step 2: Create the swap');
  console.log('  Source: Arbitrum (1 ETH)');
  console.log('  Target: Solana');
  console.log('  Time Lock: 24 hours\n');

  const swap = await sdk.htlc.createSwap({
    sourceChain: 'arbitrum',
    targetChain: 'solana',
    amount: '1.0',
    participant: '0x742d35Cc6634C0532925a3b844Bc9e7595f00000', // Counterparty
    timeLockHours: 24,
  });

  console.log('Swap created!');
  console.log(`  Swap ID: ${swap.id}`);
  console.log(`  Status: ${swap.status}`);
  console.log(`  Time Lock Expires: ${new Date(swap.timeLock * 1000).toISOString()}`);
  console.log();

  // 3. Get swap status
  console.log('Step 3: Check swap status');
  const swapStatus = await sdk.htlc.getSwapStatus(swap.id);
  console.log(`  Status: ${swapStatus.status}`);
  console.log(`  Source Funded: ${swapStatus.sourceFunded ? 'Yes' : 'No'}`);
  console.log(`  Target Funded: ${swapStatus.targetFunded ? 'Yes' : 'No'}`);
  console.log();

  // 4. List active swaps
  console.log('Step 4: List all active swaps');
  const activeSwaps = await sdk.htlc.listSwaps({ status: 'active' });
  console.log(`  Found ${activeSwaps.length} active swap(s)`);
  console.log();

  // 5. Claiming the swap (counterparty does this)
  console.log('Step 5: Claim the swap (counterparty action)');
  console.log('  When counterparty reveals the secret, they can claim:');
  console.log('  ```');
  console.log(`  await sdk.htlc.claimSwap({`);
  console.log(`    swapId: '${swap.id}',`);
  console.log(`    secret: '${secret}',`);
  console.log(`  });`);
  console.log('  ```');
  console.log();

  // 6. Refund if swap expires (initiator does this)
  console.log('Step 6: Refund expired swap (if time lock passes)');
  console.log('  If the counterparty never claims, you can refund after expiry:');
  console.log('  ```');
  console.log(`  await sdk.htlc.refundSwap('${swap.id}');`);
  console.log('  ```');

  console.log('\nExample complete!');
}

main().catch(console.error);
