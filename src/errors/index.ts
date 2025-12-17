/**
 * SDK Error Classes
 * Standardized error handling for Trinity Protocol SDK
 */

export class SDKError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string = 'SDK_ERROR', details?: any) {
    super(message);
    this.name = 'SDKError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, SDKError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

export class ProviderError extends SDKError {
  public readonly chain: string;
  public readonly originalError?: any;

  constructor(message: string, chain: string, originalError?: any) {
    super(message, 'PROVIDER_ERROR', { chain, originalError });
    this.name = 'ProviderError';
    this.chain = chain;
    this.originalError = originalError;
    Object.setPrototypeOf(this, ProviderError.prototype);
  }
}

export class ValidationError extends SDKError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', { field });
    this.name = 'ValidationError';
    this.field = field;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ConsensusError extends SDKError {
  public readonly operationId?: string;
  public readonly confirmations?: number;

  constructor(message: string, operationId?: string, confirmations?: number) {
    super(message, 'CONSENSUS_ERROR', { operationId, confirmations });
    this.name = 'ConsensusError';
    this.operationId = operationId;
    this.confirmations = confirmations;
    Object.setPrototypeOf(this, ConsensusError.prototype);
  }
}

export class TransactionError extends SDKError {
  public readonly txHash?: string;
  public readonly chain?: string;

  constructor(message: string, txHash?: string, chain?: string) {
    super(message, 'TRANSACTION_ERROR', { txHash, chain });
    this.name = 'TransactionError';
    this.txHash = txHash;
    this.chain = chain;
    Object.setPrototypeOf(this, TransactionError.prototype);
  }
}

export class TimeoutError extends SDKError {
  public readonly operation?: string;
  public readonly timeout?: number;

  constructor(message: string, operation?: string, timeout?: number) {
    super(message, 'TIMEOUT_ERROR', { operation, timeout });
    this.name = 'TimeoutError';
    this.operation = operation;
    this.timeout = timeout;
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export function isSDKError(error: any): error is SDKError {
  return error instanceof SDKError;
}

export function normalizeError(error: any): SDKError {
  if (isSDKError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return new SDKError(error.message, 'UNKNOWN_ERROR', { 
      originalName: error.name,
      stack: error.stack 
    });
  }
  
  return new SDKError(String(error), 'UNKNOWN_ERROR');
}
