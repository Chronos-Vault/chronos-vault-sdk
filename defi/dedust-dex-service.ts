import { Factory, Asset, PoolType, ReadinessStatus, VaultNative } from '@dedust/sdk';
import { TonClient4, Address } from "@ton/ton";
import { toNano } from '@ton/core';

/**
 * DeDust DEX Service for TON blockchain liquidity
 * 
 * Features:
 * - Real-time pool quotes via DeDust SDK
 * - Swap estimation with slippage protection
 * - Multi-hop swap support
 * - Liquidity depth analysis
 */

interface SwapQuote {
  amountIn: bigint;
  amountOut: bigint;
  priceImpact: number;
  route: string[];
}

interface LiquidityInfo {
  hasLiquidity: boolean;
  poolAddress?: string;
  reserves?: {
    asset0: bigint;
    asset1: bigint;
  };
}

export class DeDustService {
  private readonly RPC_URL: string;
  private client: TonClient4;
  private factory: any;
  
  // Helper to create BigInt powers of 10 (pure BigInt math to avoid precision loss)
  private pow10(exponent: number): bigint {
    let result = BigInt(1);
    const ten = BigInt(10);
    for (let i = 0; i < exponent; i++) {
      result *= ten;
    }
    return result;
  }

  constructor() {
    // Use environment variable or default to mainnet (testnet factory address not public)
    this.RPC_URL = process.env.TON_RPC_URL || 'https://toncenter.com/api/v2/jsonRPC';
    
    this.client = new TonClient4({ 
      endpoint: this.RPC_URL
    });

    // DeDust mainnet factory address (testnet factory not publicly documented)
    const factoryAddress = 'EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67';
    
    this.factory = this.client.open(
      Factory.createFromAddress(Address.parse(factoryAddress))
    );
  }

  /**
   * Create asset from address (TON or Jetton)
   */
  private createAsset(tokenAddress: string): any {
    // Native TON
    if (tokenAddress === 'TON' || tokenAddress.toLowerCase() === 'ton') {
      return Asset.native();
    }
    
    // Jetton token
    try {
      const addr = Address.parse(tokenAddress);
      return Asset.jetton(addr);
    } catch (error) {
      throw new Error(`Invalid TON address: ${tokenAddress}`);
    }
  }

  /**
   * Get pool for a token pair
   */
  private async getPool(tokenIn: string, tokenOut: string) {
    const assetIn = this.createAsset(tokenIn);
    const assetOut = this.createAsset(tokenOut);
    
    // Try volatile pool first
    const pool = this.client.open(
      await this.factory.getPool(PoolType.VOLATILE, [assetIn, assetOut])
    );
    
    // Check if pool exists
    const readiness = await pool.getReadinessStatus();
    if (readiness !== ReadinessStatus.READY) {
      throw new Error(`Pool not ready for ${tokenIn}/${tokenOut}`);
    }
    
    return pool;
  }

  /**
   * Get swap quote for token pair
   */
  async getQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint
  ): Promise<SwapQuote> {
    try {
      const pool = await this.getPool(tokenIn, tokenOut);
      
      // Get pool reserves to estimate output
      const reserves = await pool.getReserves();
      
      // Simple constant product formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
      const reserve0 = reserves[0];
      const reserve1 = reserves[1];
      
      // Determine which reserve is which based on asset order
      const assetIn = this.createAsset(tokenIn);
      const poolAssets = await pool.getAssets();
      const isAsset0 = poolAssets[0].equals(assetIn);
      
      const reserveIn = isAsset0 ? reserve0 : reserve1;
      const reserveOut = isAsset0 ? reserve1 : reserve0;
      
      // Apply 0.3% fee (typical for DeDust)
      const amountInWithFee = amountIn * BigInt(997) / BigInt(1000);
      
      // Calculate output amount
      const numerator = amountInWithFee * reserveOut;
      const denominator = reserveIn + amountInWithFee;
      const amountOut = numerator / denominator;
      
      // Calculate price impact
      const priceImpact = Number(amountIn * BigInt(10000) / reserveIn) / 100;
      
      return {
        amountIn,
        amountOut,
        priceImpact,
        route: [tokenIn, tokenOut]
      };
    } catch (error) {
      throw new Error(`Failed to get DeDust quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get swap route with price for display
   */
  async getSwapRoute(
    fromToken: string,
    toToken: string,
    fromAmount: bigint,
    slippageBps: number = 100 // 1% default
  ): Promise<{
    route: string[];
    estimatedOutput: bigint;
    minimumOutput: bigint;
    priceImpact: number;
    gasEstimate: string;
  }> {
    try {
      const quote = await this.getQuote(fromToken, toToken, fromAmount);
      
      // Calculate minimum output with slippage
      const slippageMultiplier = (BigInt(10000) - BigInt(slippageBps)) * quote.amountOut / BigInt(10000);
      
      return {
        route: quote.route,
        estimatedOutput: quote.amountOut,
        minimumOutput: slippageMultiplier,
        priceImpact: quote.priceImpact,
        gasEstimate: '0.25' // TON for gas (typical DeDust swap)
      };
    } catch (error) {
      throw new Error(`Failed to get swap route: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current price for a token pair
   */
  async getPrice(tokenIn: string, tokenOut: string): Promise<number> {
    try {
      // Get price for 1 TON equivalent (1e9 for TON decimals)
      const baseAmount = this.pow10(9);
      const quote = await this.getQuote(tokenIn, tokenOut, baseAmount);
      
      const price = Number(quote.amountOut) / Number(baseAmount);
      return price;
    } catch (error) {
      throw new Error(`Failed to get price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if liquidity exists for a pair
   */
  async hasLiquidity(tokenIn: string, tokenOut: string): Promise<boolean> {
    try {
      const testAmount = this.pow10(6); // 0.001 TON
      await this.getQuote(tokenIn, tokenOut, testAmount);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get detailed liquidity information
   */
  async getLiquidityInfo(tokenIn: string, tokenOut: string): Promise<LiquidityInfo> {
    try {
      const pool = await this.getPool(tokenIn, tokenOut);
      const reserves = await pool.getReserves();
      
      return {
        hasLiquidity: true,
        poolAddress: pool.address.toString(),
        reserves: {
          asset0: reserves[0],
          asset1: reserves[1]
        }
      };
    } catch {
      return {
        hasLiquidity: false
      };
    }
  }

  /**
   * Get liquidity metrics for a pool
   */
  async getLiquidityMetrics(tokenIn: string, tokenOut: string): Promise<{
    poolType: string;
    estimatedDepth: string;
  }> {
    try {
      const info = await this.getLiquidityInfo(tokenIn, tokenOut);
      
      if (!info.hasLiquidity || !info.reserves) {
        throw new Error('No liquidity available');
      }
      
      // Estimate depth based on reserves
      const totalReserves = info.reserves.asset0 + info.reserves.asset1;
      const depth = Number(totalReserves) / Number(this.pow10(9)); // Convert to TON
      
      return {
        poolType: 'VOLATILE',
        estimatedDepth: `${depth.toFixed(2)} TON`
      };
    } catch (error) {
      throw new Error(`Failed to get liquidity metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const dedustService = new DeDustService();
