/**
 * TrinityConsensusVerifier ABI
 * Core 2-of-3 consensus verification contract
 */

export const TRINITY_CONSENSUS_VERIFIER_ABI = [
  {
    "inputs": [],
    "name": "CONSENSUS_THRESHOLD",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TOTAL_CHAINS",
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "chainId", "type": "uint256" }],
    "name": "validators",
    "outputs": [{ "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "operationId", "type": "bytes32" }],
    "name": "operations",
    "outputs": [
      { "name": "chainConfirmations", "type": "uint256" },
      { "name": "arbitrumConfirmed", "type": "bool" },
      { "name": "solanaConfirmed", "type": "bool" },
      { "name": "tonConfirmed", "type": "bool" },
      { "name": "expiresAt", "type": "uint256" },
      { "name": "executed", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "operationId", "type": "bytes32" },
      { "name": "chainId", "type": "uint256" },
      { "name": "signature", "type": "bytes" }
    ],
    "name": "confirmOperation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "operationId", "type": "bytes32" }],
    "name": "hasConsensus",
    "outputs": [{ "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "operationId", "type": "bytes32" }],
    "name": "getConfirmationStatus",
    "outputs": [
      { "name": "confirmations", "type": "uint256" },
      { "name": "arbitrum", "type": "bool" },
      { "name": "solana", "type": "bool" },
      { "name": "ton", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "operationId", "type": "bytes32" },
      { "name": "target", "type": "address" },
      { "name": "data", "type": "bytes" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "executeOperation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "chainId", "type": "uint256" },
      { "name": "validator", "type": "address" }
    ],
    "name": "registerValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "operationId", "type": "bytes32" },
      { "indexed": true, "name": "chainId", "type": "uint256" },
      { "indexed": false, "name": "validator", "type": "address" }
    ],
    "name": "OperationConfirmed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "operationId", "type": "bytes32" },
      { "indexed": false, "name": "target", "type": "address" }
    ],
    "name": "OperationExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "operationId", "type": "bytes32" }
    ],
    "name": "ConsensusReached",
    "type": "event"
  }
];

export const TRINITY_CONSENSUS_VERIFIER_ADDRESS = '0x59396D58Fa856025bD5249E342729d5550Be151C';

export default TRINITY_CONSENSUS_VERIFIER_ABI;
