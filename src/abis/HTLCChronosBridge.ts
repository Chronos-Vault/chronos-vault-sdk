/**
 * HTLCChronosBridge ABI
 * Hash Time-Locked Contract for cross-chain atomic swaps
 */

export const HTLC_CHRONOS_BRIDGE_ABI = [
  {
    "inputs": [
      { "name": "recipient", "type": "address" },
      { "name": "hashlock", "type": "bytes32" },
      { "name": "timelock", "type": "uint256" },
      { "name": "destinationChainId", "type": "uint256" }
    ],
    "name": "createSwap",
    "outputs": [{ "name": "swapId", "type": "bytes32" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "swapId", "type": "bytes32" },
      { "name": "preimage", "type": "bytes32" }
    ],
    "name": "claimSwap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "swapId", "type": "bytes32" }],
    "name": "refundSwap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "swapId", "type": "bytes32" }],
    "name": "swaps",
    "outputs": [
      { "name": "sender", "type": "address" },
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "hashlock", "type": "bytes32" },
      { "name": "timelock", "type": "uint256" },
      { "name": "destinationChainId", "type": "uint256" },
      { "name": "claimed", "type": "bool" },
      { "name": "refunded", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "swapId", "type": "bytes32" }],
    "name": "getSwapStatus",
    "outputs": [
      { "name": "exists", "type": "bool" },
      { "name": "claimed", "type": "bool" },
      { "name": "refunded", "type": "bool" },
      { "name": "expired", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_TIMELOCK",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_TIMELOCK",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "swapId", "type": "bytes32" },
      { "indexed": true, "name": "sender", "type": "address" },
      { "indexed": true, "name": "recipient", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" },
      { "indexed": false, "name": "hashlock", "type": "bytes32" },
      { "indexed": false, "name": "timelock", "type": "uint256" }
    ],
    "name": "SwapCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "swapId", "type": "bytes32" },
      { "indexed": false, "name": "preimage", "type": "bytes32" }
    ],
    "name": "SwapClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "swapId", "type": "bytes32" }
    ],
    "name": "SwapRefunded",
    "type": "event"
  }
];

export const HTLC_CHRONOS_BRIDGE_ADDRESS = '0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca';

export default HTLC_CHRONOS_BRIDGE_ABI;
