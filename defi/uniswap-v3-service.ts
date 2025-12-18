/**
 * Uniswap V3 Service
 * 
 * Integrates with Uniswap V3 on Arbitrum for real ETH/CVT liquidity and pricing
 * Uses QuoterV2 contract for gas-free price quotes
 * 
 * Documentation: https://docs.uniswap.org/contracts/v3/guides/swaps/quoting
 */

import { ethers } from 'ethers';

// Well-known Arbitrum token addresses
export const ARBITRUM_TOKEN_ADDRESSES = {
  WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  USDC: '0xAF88d065e77c8cC2239327C5EDb3A432268e5831', // Native USDC
  USDC_BRIDGED: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // Bridged USDC.e
  USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  // Add CVT when deployed on Arbitrum
  CVT: '0xFb419D8E32c14F774279a4dEEf330dc893257147' // From deployment config
};

// Uniswap V3 fee tiers (in basis points)
export enum UniswapV3FeeTier {
  LOWEST = 100,    // 0.01% for very correlated pairs (stablecoins)
  LOW = 500,       // 0.05% for correlated pairs
  MEDIUM = 3000,   // 0.3% for standard pairs
  HIGH = 10000     // 1% for exotic pairs
}

interface QuoterResult {
  amountOut: bigint;
  sqrtPriceX96After: bigint;
  initializedTicksCrossed: number;
  gasEstimate: bigint;
}

export interface UniswapQuote {
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  outputAmount: string;
  minimumOutput: string;
  priceImpact: number;
  feeTier: number;
  gasEstimate: string;
  route: string[];
}

/**
 * Uniswap V3 Service for Arbitrum liquidity
 */
export class UniswapV3Service {
  private readonly QUOTER_V2_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Arbitrum
  private readonly RPC_URL: string;
  private provider: ethers.JsonRpcProvider;
  private quoterContract: ethers.Contract;

  // Helper to create BigInt powers of 10 (pure BigInt math to avoid precision loss)
  private pow10(exponent: number): bigint {
    let result = BigInt(1);
    const ten = BigInt(10);
    for (let i = 0; i < exponent; i++) {
      result *= ten;
    }
    return result;
  }

  // QuoterV2 ABI (simplified)
  private readonly QUOTER_ABI = [
    {
      inputs: [
        { name: 'tokenIn', type: 'address' },
        { name: 'tokenOut', type: 'address' },
        { name: 'fee', type: 'uint24' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'sqrtPriceLimitX96', type: 'uint160' }
      ],
      name: 'quoteExactInputSingle',
      outputs: [
        { name: 'amountOut', type: 'uint256' },
        { name: 'sqrtPriceX96After', type: 'uint160' },
        { name: 'initializedTicksCrossed', type: 'uint32' },
        { name: 'gasEstimate', type: 'uint256' }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ];

  constructor() {
    this.RPC_URL = process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc';
    this.provider = new ethers.JsonRpcProvider(this.RPC_URL);
    this.quoterContract = new ethers.Contract(
      this.QUOTER_V2_ADDRESS,
      this.QUOTER_ABI,
      this.provider
    );
  }

  /**
   * Get quote from Uniswap V3 for exact input amount
   */
  async getQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    feeTier: UniswapV3FeeTier = UniswapV3FeeTier.MEDIUM
  ): Promise<QuoterResult> {
    try {
      // Pass arguments individually for ethers v6 compatibility
      const result = await this.quoterContract.quoteExactInputSingle.staticCall(
        tokenIn,
        tokenOut,
        feeTier,
        amountIn,
        BigInt(0) // sqrtPriceLimitX96 - No price limit
      );
      
      return {
        amountOut: result[0],
        sqrtPriceX96After: result[1],
        initializedTicksCrossed: Number(result[2]),
        gasEstimate: result[3]
      };
    } catch (error) {
      console.error('Uniswap V3 quote failed:', error);
      throw new Error(`Failed to get Uniswap quote: ${error}`);
    }
  }

  /**
   * Get best quote by trying multiple fee tiers
   */
  async getBestQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint
  ): Promise<{
    quote: QuoterResult;
    feeTier: UniswapV3FeeTier;
    feeTierLabel: string;
  }> {
    const feeTiers = [
      { tier: UniswapV3FeeTier.LOW, label: '0.05%' },
      { tier: UniswapV3FeeTier.MEDIUM, label: '0.3%' },
      { tier: UniswapV3FeeTier.HIGH, label: '1%' }
    ];

    let bestQuote: QuoterResult | null = null;
    let bestFeeTier = UniswapV3FeeTier.MEDIUM;
    let bestLabel = '0.3%';

    for (const { tier, label } of feeTiers) {
      try {
        const quote = await this.getQuote(tokenIn, tokenOut, amountIn, tier);
        
        if (!bestQuote || quote.amountOut > bestQuote.amountOut) {
          bestQuote = quote;
          bestFeeTier = tier;
          bestLabel = label;
        }
      } catch (error) {
        // Pool might not exist for this fee tier, continue
        continue;
      }
    }

    if (!bestQuote) {
      throw new Error('No liquidity available for this pair');
    }

    return {
      quote: bestQuote,
      feeTier: bestFeeTier,
      feeTierLabel: bestLabel
    };
  }

  /**
   * Get current price for a token pair
   */
  async getPrice(tokenIn: string, tokenOut: string): Promise<number> {
    try {
      // Get price for 1 ETH equivalent (1e18)
      const baseAmount = this.pow10(18);
      const { quote } = await this.getBestQuote(tokenIn, tokenOut, baseAmount);
      
      const price = Number(quote.amountOut) / Number(baseAmount);
      return price;
    } catch (error) {
      console.error('Failed to get Uniswap price:', error);
      throw error;
    }
  }

  /**
   * Estimate swap output with slippage
   */
  async estimateSwapOutput(
    fromToken: string,
    toToken: string,
    fromAmount: bigint,
    slippageBps: number = 50 // 0.5% default
  ): Promise<UniswapQuote> {
    try {
      const { quote, feeTier, feeTierLabel } = await this.getBestQuote(
        fromToken,
        toToken,
        fromAmount
      );

      // Calculate minimum output with slippage
      const slippageMultiplier = (BigInt(10000) - BigInt(slippageBps)) * quote.amountOut / BigInt(10000);
      
      // Estimate price impact (simplified)
      const priceImpact = Number(quote.initializedTicksCrossed) * 0.01; // Rough estimate

      return {
        inputToken: fromToken,
        outputToken: toToken,
        inputAmount: fromAmount.toString(),
        outputAmount: quote.amountOut.toString(),
        minimumOutput: slippageMultiplier.toString(),
        priceImpact,
        feeTier,
        gasEstimate: quote.gasEstimate.toString(),
        route: [fromToken, toToken]
      };
    } catch (error) {
      console.error('Failed to estimate Uniswap swap:', error);
      throw error;
    }
  }

  /**
   * Check if liquidity exists for a pair
   */
  async hasLiquidity(tokenIn: string, tokenOut: string): Promise<boolean> {
    try {
      const testAmount = this.pow10(15); // 0.001 ETH
      await this.getBestQuote(tokenIn, tokenOut, testAmount);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get liquidity metrics for a pair
   */
  async getLiquidityMetrics(
    tokenIn: string,
    tokenOut: string
  ): Promise<{
    hasLiquidity: boolean;
    bestFeeTier: string;
    estimatedDepth: string;
  }> {
    try {
      // Test with different amounts to gauge depth
      const amounts = [
        this.pow10(16),  // 0.01 ETH
        this.pow10(17),  // 0.1 ETH  
        this.pow10(18)   // 1 ETH
      ];

      const results = await Promise.all(
        amounts.map(amt => this.getBestQuote(tokenIn, tokenOut, amt).catch(() => null))
      );

      const successfulResults = results.filter(r => r !== null);
      
      if (successfulResults.length === 0) {
        return {
          hasLiquidity: false,
          bestFeeTier: 'N/A',
          estimatedDepth: 'none'
        };
      }

      const bestResult = successfulResults[0]!;
      const depth = successfulResults.length === 3 ? 'high' : 
                    successfulResults.length === 2 ? 'medium' : 'low';

      return {
        hasLiquidity: true,
        bestFeeTier: bestResult.feeTierLabel,
        estimatedDepth: depth
      };
    } catch (error) {
      return {
        hasLiquidity: false,
        bestFeeTier: 'N/A',
        estimatedDepth: 'none'
      };
    }
  }

  /**
   * Get multiple quotes for price comparison
   */
  async getBatchQuotes(
    pairs: Array<{ tokenIn: string; tokenOut: string; amount: bigint }>
  ): Promise<UniswapQuote[]> {
    try {
      const quotes = await Promise.all(
        pairs.map(pair => 
          this.estimateSwapOutput(pair.tokenIn, pair.tokenOut, pair.amount)
        )
      );
      return quotes;
    } catch (error) {
      console.error('Failed to get batch Uniswap quotes:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const uniswapV3Service = new UniswapV3Service();
