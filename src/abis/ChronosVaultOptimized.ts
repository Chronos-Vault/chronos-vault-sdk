/**
 * ChronosVaultOptimized ABI
 * ERC-4626 compliant investment vault with Trinity consensus
 */

export const CHRONOS_VAULT_OPTIMIZED_ABI = [
  {
    "inputs": [],
    "name": "asset",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "shares", "type": "uint256" }],
    "name": "convertToAssets",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "assets", "type": "uint256" }],
    "name": "convertToShares",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "assets", "type": "uint256" },
      { "name": "receiver", "type": "address" }
    ],
    "name": "deposit",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "shares", "type": "uint256" },
      { "name": "receiver", "type": "address" }
    ],
    "name": "mint",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "assets", "type": "uint256" },
      { "name": "receiver", "type": "address" },
      { "name": "owner", "type": "address" }
    ],
    "name": "withdraw",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "shares", "type": "uint256" },
      { "name": "receiver", "type": "address" },
      { "name": "owner", "type": "address" }
    ],
    "name": "redeem",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "receiver", "type": "address" }],
    "name": "maxDeposit",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "owner", "type": "address" }],
    "name": "maxWithdraw",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "consensusRequired",
    "outputs": [{ "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "trinityVerifier",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "sender", "type": "address" },
      { "indexed": true, "name": "owner", "type": "address" },
      { "indexed": false, "name": "assets", "type": "uint256" },
      { "indexed": false, "name": "shares", "type": "uint256" }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "sender", "type": "address" },
      { "indexed": true, "name": "receiver", "type": "address" },
      { "indexed": true, "name": "owner", "type": "address" },
      { "indexed": false, "name": "assets", "type": "uint256" },
      { "indexed": false, "name": "shares", "type": "uint256" }
    ],
    "name": "Withdraw",
    "type": "event"
  }
];

export const CHRONOS_VAULT_OPTIMIZED_ADDRESS = '0xAE408eC592f0f865bA0012C480E8867e12B4F32D';

export default CHRONOS_VAULT_OPTIMIZED_ABI;
