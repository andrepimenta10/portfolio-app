export interface Portfolio {
  name: string;
  portfolioId: number;
  nav: number;
  dailyReturn: number;
  monthlyReturn?: number;
  yearlyReturn?: number;
  volatility?: number;
  holdingSymbols: string[];
  holdingAmounts: number[];
}
