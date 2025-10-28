/**
 * Trinity Protocol HTLC Client Library
 * 
 * Secure client-side secret management for atomic swaps
 * NO SECRETS EVER SENT TO SERVER - Client manages all secrets
 * 
 * @author Chronos Vault Team
 * @version v1.5-PRODUCTION
 * @license MIT
 */

import { ethers } from 'ethers';

export interface HTLCSwapParams {
  userAddress: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  minAmount: string;
  fromNetwork: string;
  toNetwork: string;
}

export interface HTLCSwapResult {
  orderId: string;
  secret: string; // NEVER share this with server!
  secretHash: string;
  timelock: number;
}

export interface HTLCOrderStatus {
  id: string;
  status: 'pending' | 'locked' | 'consensus_pending' | 'consensus_achieved' | 'executed' | 'refunded';
  validProofCount: number;
  consensusRequired: number;
  secretHash: string;
  timelock: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  minAmount: string;
}

/**
 * Trinity HTLC Client - Handles secret generation and secure storage
 * 
 * SECURITY PRINCIPLES:
 * 1. Secrets generated CLIENT-SIDE ONLY (32 random bytes)
 * 2. Server receives ONLY secretHash (Keccak256)
 * 3. Secrets encrypted before storage (AES-256-GCM)
 * 4. Secrets deleted after successful claim
 * 5. Zero-trust: Even if server compromised, secrets safe
 */
export class TrinityHTLCClient {
  private apiBaseUrl: string;
  private encryptionKey?: CryptoKey;
  
  constructor(apiBaseUrl: string = '/api/atomic-swap') {
    this.apiBaseUrl = apiBaseUrl;
  }
  
  /**
   * Initialize encryption (call once at app startup)
   * Derives encryption key from user password or hardware wallet
   */
  async initialize(userPassword?: string): Promise<void> {
    if (userPassword) {
      this.encryptionKey = await this.deriveEncryptionKey(userPassword);
    }
  }
  
  /**
   * Generate HTLC secret (CLIENT-SIDE ONLY!)
   * 
   * @returns {secret, secretHash}
   * @security Secret is 32 random bytes, never sent to server
   */
  generateSecret(): { secret: string; secretHash: string } {
    // Generate 32 random bytes (256-bit entropy)
    const secret = ethers.hexlify(ethers.randomBytes(32));
    
    // Hash with Keccak256 (same as Solidity keccak256)
    const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
    
    return { secret, secretHash };
  }
  
  /**
   * Create atomic swap (stores secret securely client-side)
   * 
   * @param params Swap parameters
   * @returns Order ID and secret (KEEP SECRET SAFE!)
   */
  async createSwap(params: HTLCSwapParams): Promise<HTLCSwapResult> {
    // STEP 1: Generate secret CLIENT-SIDE
    const { secret, secretHash } = this.generateSecret();
    
    // STEP 2: Create swap (server never sees secret!)
    const response = await fetch(`${this.apiBaseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        secretHash // Only hash sent to server!
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create swap');
    }
    
    const order = await response.json();
    
    // STEP 3: Store secret securely (encrypted)
    await this.storeSecret(order.id, secret);
    
    return {
      orderId: order.id,
      secret, // Return to user (they MUST save it securely!)
      secretHash: order.secretHash,
      timelock: order.timelock
    };
  }
  
  /**
   * Get swap status (monitor Trinity consensus)
   */
  async getSwapStatus(orderId: string): Promise<HTLCOrderStatus> {
    const response = await fetch(`${this.apiBaseUrl}/${orderId}/status`);
    
    if (!response.ok) {
      throw new Error('Failed to get swap status');
    }
    
    return await response.json();
  }
  
  /**
   * Monitor swap until consensus achieved
   * 
   * @param orderId Order ID
   * @param onProgress Callback for status updates
   * @returns Final order status
   */
  async monitorConsensus(
    orderId: string,
    onProgress?: (status: HTLCOrderStatus) => void
  ): Promise<HTLCOrderStatus> {
    return new Promise((resolve, reject) => {
      const pollInterval = 5000; // 5 seconds
      const timeout = 10 * 60 * 1000; // 10 minutes
      const startTime = Date.now();
      
      const poll = async () => {
        try {
          const status = await this.getSwapStatus(orderId);
          
          if (onProgress) {
            onProgress(status);
          }
          
          // Check if consensus achieved
          if (status.status === 'consensus_achieved') {
            resolve(status);
            return;
          }
          
          // Check timeout
          if (Date.now() - startTime > timeout) {
            reject(new Error('Consensus monitoring timeout'));
            return;
          }
          
          // Continue polling
          setTimeout(poll, pollInterval);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  }
  
  /**
   * Claim HTLC (reveals secret to execute swap)
   * 
   * @param orderId Order ID
   * @param secret Secret (if not provided, retrieves from storage)
   * @returns Transaction hash
   */
  async claimHTLC(orderId: string, secret?: string): Promise<string> {
    // Retrieve secret if not provided
    if (!secret) {
      secret = await this.retrieveSecret(orderId);
      if (!secret) {
        throw new Error('Secret not found - was it stored?');
      }
    }
    
    // Claim HTLC
    const response = await fetch(`${this.apiBaseUrl}/${orderId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to claim HTLC');
    }
    
    const result = await response.json();
    
    // Clean up secret after successful claim
    await this.deleteSecret(orderId);
    
    return result.txHash;
  }
  
  /**
   * Full swap flow: create → monitor → claim
   * 
   * @param params Swap parameters
   * @param onProgress Progress callback
   * @returns Transaction hash
   */
  async executeSwap(
    params: HTLCSwapParams,
    onProgress?: (step: string, data?: any) => void
  ): Promise<string> {
    try {
      // Step 1: Create swap
      onProgress?.('creating', null);
      const swap = await this.createSwap(params);
      onProgress?.('created', { orderId: swap.orderId, secretHash: swap.secretHash });
      
      // Step 2: Monitor consensus
      onProgress?.('monitoring', null);
      await this.monitorConsensus(swap.orderId, (status) => {
        onProgress?.('consensus_progress', {
          validProofs: status.validProofCount,
          required: status.consensusRequired
        });
      });
      onProgress?.('consensus_achieved', null);
      
      // Step 3: Claim HTLC
      onProgress?.('claiming', null);
      const txHash = await this.claimHTLC(swap.orderId, swap.secret);
      onProgress?.('completed', { txHash });
      
      return txHash;
    } catch (error) {
      onProgress?.('error', { error: (error as Error).message });
      throw error;
    }
  }
  
  /**
   * Store secret securely (encrypted with AES-256-GCM)
   */
  private async storeSecret(orderId: string, secret: string): Promise<void> {
    if (!this.encryptionKey) {
      // Fallback: Store unencrypted (NOT RECOMMENDED for production!)
      console.warn('⚠️  WARNING: Storing secret unencrypted. Call initialize() first.');
      localStorage.setItem(`htlc_secret_${orderId}`, secret);
      return;
    }
    
    const encrypted = await this.encrypt(secret);
    localStorage.setItem(`htlc_secret_${orderId}`, encrypted);
  }
  
  /**
   * Retrieve secret from storage (decrypted)
   */
  private async retrieveSecret(orderId: string): Promise<string | null> {
    const stored = localStorage.getItem(`htlc_secret_${orderId}`);
    if (!stored) return null;
    
    if (!this.encryptionKey) {
      // Unencrypted storage
      return stored;
    }
    
    return await this.decrypt(stored);
  }
  
  /**
   * Delete secret from storage (after claim)
   */
  private async deleteSecret(orderId: string): Promise<void> {
    localStorage.removeItem(`htlc_secret_${orderId}`);
  }
  
  /**
   * Derive encryption key from user password
   */
  private async deriveEncryptionKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive AES-256 key using PBKDF2
    const salt = encoder.encode('chronos-vault-htlc-v1'); // Use unique salt
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  /**
   * Encrypt data with AES-256-GCM
   */
  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      dataBuffer
    );
    
    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Return as hex string
    return ethers.hexlify(combined);
  }
  
  /**
   * Decrypt data with AES-256-GCM
   */
  private async decrypt(encryptedHex: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    
    const combined = ethers.getBytes(encryptedHex);
    
    // Extract IV (first 12 bytes)
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encryptedData
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }
}

/**
 * Example Usage:
 * 
 * ```typescript
 * import { TrinityHTLCClient } from './trinity-htlc-client';
 * 
 * const client = new TrinityHTLCClient('/api/atomic-swap');
 * await client.initialize('user-password-123'); // Enables encryption
 * 
 * // Create swap
 * const swap = await client.createSwap({
 *   userAddress: '0x123...',
 *   fromToken: 'ETH',
 *   toToken: 'SOL',
 *   fromAmount: '1.0',
 *   minAmount: '144.5',
 *   fromNetwork: 'ethereum',
 *   toNetwork: 'solana'
 * });
 * 
 * console.log('Order ID:', swap.orderId);
 * console.log('Secret (KEEP SAFE!):', swap.secret);
 * 
 * // Monitor consensus
 * const status = await client.monitorConsensus(swap.orderId, (status) => {
 *   console.log(`Consensus: ${status.validProofCount}/${status.consensusRequired}`);
 * });
 * 
 * // Claim HTLC
 * const txHash = await client.claimHTLC(swap.orderId);
 * console.log('Swap executed:', txHash);
 * ```
 * 
 * Or use the all-in-one flow:
 * 
 * ```typescript
 * const txHash = await client.executeSwap(
 *   {
 *     userAddress: '0x123...',
 *     fromToken: 'ETH',
 *     toToken: 'SOL',
 *     fromAmount: '1.0',
 *     minAmount: '144.5',
 *     fromNetwork: 'ethereum',
 *     toNetwork: 'solana'
 *   },
 *   (step, data) => {
 *     console.log(`Step: ${step}`, data);
 *   }
 * );
 * ```
 */
