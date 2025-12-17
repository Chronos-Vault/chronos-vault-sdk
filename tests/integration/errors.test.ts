/**
 * Error Handling Tests
 */

import { describe, it, expect } from 'vitest';
import {
  SDKError,
  ProviderError,
  ValidationError,
  ConsensusError,
  TransactionError,
  TimeoutError,
  isSDKError,
  normalizeError
} from '../../src/errors';

describe('SDK Errors', () => {
  describe('SDKError', () => {
    it('should create base SDK error', () => {
      const error = new SDKError('Test error', 'TEST_CODE', { extra: 'data' });
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ extra: 'data' });
      expect(error.name).toBe('SDKError');
    });

    it('should serialize to JSON', () => {
      const error = new SDKError('Test error', 'TEST_CODE');
      const json = error.toJSON();
      expect(json.name).toBe('SDKError');
      expect(json.code).toBe('TEST_CODE');
      expect(json.message).toBe('Test error');
    });
  });

  describe('ProviderError', () => {
    it('should create provider error with chain info', () => {
      const error = new ProviderError('RPC failed', 'arbitrum', new Error('timeout'));
      expect(error.message).toBe('RPC failed');
      expect(error.chain).toBe('arbitrum');
      expect(error.code).toBe('PROVIDER_ERROR');
      expect(error.originalError).toBeDefined();
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with field', () => {
      const error = new ValidationError('Invalid address', 'recipientAddress');
      expect(error.message).toBe('Invalid address');
      expect(error.field).toBe('recipientAddress');
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('ConsensusError', () => {
    it('should create consensus error with operation details', () => {
      const error = new ConsensusError('Insufficient confirmations', '0x1234', 1);
      expect(error.message).toBe('Insufficient confirmations');
      expect(error.operationId).toBe('0x1234');
      expect(error.confirmations).toBe(1);
      expect(error.code).toBe('CONSENSUS_ERROR');
    });
  });

  describe('TransactionError', () => {
    it('should create transaction error with tx details', () => {
      const error = new TransactionError('Transaction reverted', '0xabc', 'arbitrum');
      expect(error.message).toBe('Transaction reverted');
      expect(error.txHash).toBe('0xabc');
      expect(error.chain).toBe('arbitrum');
      expect(error.code).toBe('TRANSACTION_ERROR');
    });
  });

  describe('TimeoutError', () => {
    it('should create timeout error with operation details', () => {
      const error = new TimeoutError('Operation timed out', 'fetchBalance', 30000);
      expect(error.message).toBe('Operation timed out');
      expect(error.operation).toBe('fetchBalance');
      expect(error.timeout).toBe(30000);
      expect(error.code).toBe('TIMEOUT_ERROR');
    });
  });

  describe('isSDKError', () => {
    it('should identify SDK errors', () => {
      const sdkError = new SDKError('test');
      expect(isSDKError(sdkError)).toBe(true);
      
      const providerError = new ProviderError('test', 'arbitrum');
      expect(isSDKError(providerError)).toBe(true);
    });

    it('should not identify regular errors', () => {
      const regularError = new Error('test');
      expect(isSDKError(regularError)).toBe(false);
    });

    it('should not identify non-errors', () => {
      expect(isSDKError('string')).toBe(false);
      expect(isSDKError(null)).toBe(false);
      expect(isSDKError(undefined)).toBe(false);
    });
  });

  describe('normalizeError', () => {
    it('should return SDK errors unchanged', () => {
      const original = new SDKError('test');
      const normalized = normalizeError(original);
      expect(normalized).toBe(original);
    });

    it('should wrap regular errors', () => {
      const original = new Error('test');
      const normalized = normalizeError(original);
      expect(normalized).toBeInstanceOf(SDKError);
      expect(normalized.message).toBe('test');
      expect(normalized.code).toBe('UNKNOWN_ERROR');
    });

    it('should wrap string errors', () => {
      const normalized = normalizeError('string error');
      expect(normalized).toBeInstanceOf(SDKError);
      expect(normalized.message).toBe('string error');
    });
  });
});
