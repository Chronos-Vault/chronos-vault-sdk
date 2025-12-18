/**
 * Jupiter DEX Service
 * 
 * Integrates with Jupiter v6 API for real Solana DEX aggregation
 * Jupiter aggregates liquidity from Raydium, Orca, Meteora, and 20+ other DEXs
 * 
 * API Documentation: https://dev.jup.ag/docs/swap-api
 */

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string; // Min amount after slippage
  swapMode: 'ExactIn' | 'ExactOut';
  slippageBps: number;
  platformFee: any | null;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string; // DEX name (e.g., "Raydium", "Orca")
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
}

export interface JupiterSwapData {
  swapTransaction: string; // Base64 encoded transaction
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

// Well-known Solana token mints
export const SOLANA_TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  // CVT Token - Deploy with: npm run deploy:cvt
  // See: contracts/solana/cvt_token/deploy-cvt-spl.ts
  // After deployment, update this with the mint address from cvt-deployment.json
  CVT: process.env.SOLANA_CVT_MINT || 'CVT_MINT_PENDING_DEPLOYMENT'
};

/**
 * Jupiter DEX Service for Solana liquidity aggregation
 */
export class JupiterDexService {
  private readonly JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';
  private readonly DEFAULT_SLIPPAGE_BPS = 50; // 0.5%

  /**
   * Get swap quote from Jupiter aggregator
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = this.DEFAULT_SLIPPAGE_BPS
  ): Promise<JupiterQuote> {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
        onlyDirectRoutes: 'false', // Allow multi-hop routes for best price
        maxAccounts: '64' // Full account limit
      });

      const response = await fetch(`${this.JUPITER_API_BASE}/quote?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Jupiter API error: ${error.error || response.statusText}`);
      }

      const quote: JupiterQuote = await response.json();
      return quote;
    } catch (error) {
      console.error('Failed to get Jupiter quote:', error);
      throw error;
    }
  }

  /**
   * Get multiple quotes for different amounts (for price discovery)
   */
  async getBatchQuotes(
    inputMint: string,
    outputMint: string,
    amounts: number[]
  ): Promise<JupiterQuote[]> {
    try {
      const quotes = await Promise.all(
        amounts.map(amount => this.getQuote(inputMint, outputMint, amount))
      );
      return quotes;
    } catch (error) {
      console.error('Failed to get batch Jupiter quotes:', error);
      throw error;
    }
  }

  /**
   * Get best price route with detailed breakdown
   */
  async getBestRoute(
    inputToken: string,
    outputToken: string,
    inputAmount: number | bigint | string
  ): Promise<{
    quote: JupiterQuote;
    estimatedOutput: string;
    minimumOutput: string; // After slippage
    priceImpact: number;
    dexes: string[];
    fee: string;
  }> {
    // Convert to number for Jupiter API (lamports are integers, safe within JS precision for typical swaps)
    const amount = typeof inputAmount === 'bigint' ? Number(inputAmount) : 
                   typeof inputAmount === 'string' ? Number(inputAmount) : 
                   inputAmount;
    
    const quote = await this.getQuote(
      inputToken,
      outputToken,
      amount
    );

    const dexes = quote.routePlan.map(route => route.swapInfo.label);
    const totalFee = quote.routePlan.reduce(
      (sum, route) => sum + parseInt(route.swapInfo.feeAmount),
      0
    );

    return {
      quote,
      estimatedOutput: quote.outAmount,
      minimumOutput: quote.otherAmountThreshold,
      priceImpact: parseFloat(quote.priceImpactPct),
      dexes: [...new Set(dexes)], // Unique DEXs
      fee: totalFee.toString()
    };
  }

  /**
   * Get current price for a token pair (1 unit of input)
   */
  async getPrice(
    inputMint: string,
    outputMint: string
  ): Promise<number> {
    try {
      // Query price for 1 SOL (1e9 lamports) or 1 token unit
      const baseAmount = inputMint === SOLANA_TOKEN_MINTS.SOL ? 1e9 : 1e6;
      const quote = await this.getQuote(inputMint, outputMint, baseAmount);
      
      const outputAmount = parseInt(quote.outAmount);
      const inputAmount = parseInt(quote.inAmount);
      
      return outputAmount / inputAmount;
    } catch (error) {
      console.error('Failed to get Jupiter price:', error);
      throw error;
    }
  }

  /**
   * Get liquidity depth for a token pair
   */
  async getLiquidityDepth(
    inputMint: string,
    outputMint: string
  ): Promise<{
    totalLiquidity: string;
    dexCount: number;
    majorDexes: string[];
  }> {
    try {
      // Sample different amounts to gauge liquidity
      const amounts = [1e8, 1e9, 1e10]; // 0.1, 1, 10 SOL equivalent
      const quotes = await this.getBatchQuotes(inputMint, outputMint, amounts);
      
      const dexSets = quotes.map(q => 
        q.routePlan.map(r => r.swapInfo.label)
      );
      
      const allDexes = [...new Set(dexSets.flat())];
      const majorDexes = allDexes.filter(dex => 
        dexSets.every(set => set.includes(dex))
      );

      return {
        totalLiquidity: 'high', // Jupiter auto-routes to best liquidity
        dexCount: allDexes.length,
        majorDexes
      };
    } catch (error) {
      console.error('Failed to get liquidity depth:', error);
      return {
        totalLiquidity: 'unknown',
        dexCount: 0,
        majorDexes: []
      };
    }
  }

  /**
   * Estimate output amount for UI display
   */
  async estimateSwapOutput(
    fromToken: string,
    toToken: string,
    fromAmount: number
  ): Promise<{
    outputAmount: string;
    minimumReceived: string;
    priceImpact: string;
    route: string[];
  }> {
    try {
      const quote = await this.getQuote(fromToken, toToken, fromAmount);
      
      return {
        outputAmount: quote.outAmount,
        minimumReceived: quote.otherAmountThreshold,
        priceImpact: quote.priceImpactPct,
        route: quote.routePlan.map(r => r.swapInfo.label)
      };
    } catch (error) {
      console.error('Failed to estimate swap output:', error);
      throw error;
    }
  }

  /**
   * Check if a token pair has sufficient liquidity
   */
  async hasLiquidity(inputMint: string, outputMint: string): Promise<boolean> {
    try {
      await this.getQuote(inputMint, outputMint, 1e6); // Try small amount
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get supported DEXs for current quote
   */
  async getSupportedDexs(
    inputMint: string,
    outputMint: string
  ): Promise<string[]> {
    try {
      const quote = await this.getQuote(inputMint, outputMint, 1e9);
      const dexes = quote.routePlan.map(route => route.swapInfo.label);
      return [...new Set(dexes)];
    } catch (error) {
      console.error('Failed to get supported DEXs:', error);
      return [];
    }
  }
}

// Export singleton instance
export const jupiterDexService = new JupiterDexService();
