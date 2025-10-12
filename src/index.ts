/**
 * Chronos Vault SDK
 * 
 * Professional TypeScript client library for interacting with Chronos Vault's
 * Mathematical Defense Layer
 */

export interface ChronosVaultConfig {
  apiUrl: string;
  websocketUrl: string;
  apiKey?: string;
}

export interface VaultCreateRequest {
  vaultType: string;
  securityLevel: string;
  enableQuantumResistant: boolean;
  chainPreference: string;
}

export class ChronosVaultClient {
  private config: ChronosVaultConfig;
  private ws?: WebSocket;

  constructor(config: ChronosVaultConfig) {
    this.config = config;
  }

  /**
   * Create a new vault with Mathematical Defense Layer validation
   */
  async createVault(request: VaultCreateRequest): Promise<any> {
    const response = await fetch(`${this.config.apiUrl}/api/vault/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify(request)
    });
    return response.json();
  }

  /**
   * Subscribe to real-time MDL updates
   */
  subscribe(event: string, callback: (data: any) => void): void {
    if (!this.ws) {
      this.ws = new WebSocket(this.config.websocketUrl);
    }
    
    this.ws.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === event) {
        callback(data);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }
}

export default ChronosVaultClient;
