
// @ts-nocheck
/**
 * Economic Data Service
 *     (   )
 *     
 */

//   
export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface EconomicData {
  currencies: CurrencyRate[];
  commodities: CommodityPrice[];
  lastUpdated: Date;
  source: string;
}

// Cache  (  15 )
let cachedData: EconomicData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 

//    -   Fallback    (  Math.random)
let lastKnownCommodities: CommodityPrice[] | null = null;

/**
 *     Frankfurter API (  )
 */
async function fetchCurrencyRates(): Promise<CurrencyRate[]> {
  try {
    // Frankfurter API -    
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,LYD,EGP,TND,SAR,AED');
    
    if (!response.ok) {
      console.error('Failed to fetch currency rates:', response.status);
      return getDefaultCurrencyRates();
    }
    
    const data = await response.json();
    const rates: CurrencyRate[] = [];
    
    //  
    const currencyNames: Record<string, string> = {
      'EUR': `يورو`,
      'GBP': `جنيه إسترليني`,
      'LYD': `دينار ليبي`,
      'EGP': `جنيه مصري`,
      'TND': `دينار تونسي`,
      'SAR': `ريال سعودي`,
      'AED': `درهم إماراتي`
    };
    
    for (const [code, rate] of Object.entries(data.rates)) {
      //   Math.random() -      API
      //      -      
      const change = 0;
      const changePercent = 0;
      
      rates.push({
        code,
        name: currencyNames[code] || code,
        rate: rate as number,
        change: parseFloat(change.toFixed(4)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        direction: change > 0.001 ? 'up' : change < -0.001 ? 'down' : 'stable',
        lastUpdated: new Date(data.date)
      });
    }
    
    //   
    rates.unshift({
      code: 'USD',
      name: `دولار أمريكي`,
      rate: 1,
      change: 0,
      changePercent: 0,
      direction: 'stable',
      lastUpdated: new Date(data.date)
    });
    
    return rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return getDefaultCurrencyRates();
  }
}

/**
 *       API  
 *  metals-api.com    Open Exchange Rates
 */
async function fetchCommodityPrices(): Promise<CommodityPrice[]> {
  try {
    // 1.      metals.live (API )
    const goldRes = await fetch('https://metals.live/api/spot');
    if (goldRes.ok) {
      const metals = await goldRes.json();
      // metals.live  [{metal:'gold',price:...}, ...]
      const goldEntry = Array.isArray(metals)
        ? metals.find((m: any) => m.metal?.toLowerCase() === 'gold')
        : null;
      const silverEntry = Array.isArray(metals)
        ? metals.find((m: any) => m.metal?.toLowerCase() === 'silver')
        : null;

      if (goldEntry) {
        const commodities: CommodityPrice[] = [
          {
            name: `الذهب`,
            symbol: 'XAU',
            price: goldEntry.price,
            currency: 'USD',
            change: 0, //    
            changePercent: 0,
            direction: 'stable',
            lastUpdated: new Date()
          },
          {
            name: `الفضة`,
            symbol: 'XAG',
            price: silverEntry?.price ?? 31,
            currency: 'USD',
            change: 0,
            changePercent: 0,
            direction: 'stable',
            lastUpdated: new Date()
          },
          //    metals.live -     
          lastKnownCommodities?.find(c => c.symbol === 'BRENT') ?? {
            name: `نفط برنت`,
            symbol: 'BRENT',
            price: 78,
            currency: 'USD',
            change: 0,
            changePercent: 0,
            direction: 'stable',
            lastUpdated: new Date()
          },
          lastKnownCommodities?.find(c => c.symbol === 'WTI') ?? {
            name: `نفط WTI`,
            symbol: 'WTI',
            price: 74,
            currency: 'USD',
            change: 0,
            changePercent: 0,
            direction: 'stable',
            lastUpdated: new Date()
          }
        ];

        //    
        lastKnownCommodities = commodities;
        return commodities;
      }
    }
  } catch (err) {
    console.warn('[EconomicDataService] metals.live API failed:', err);
  }

  // 2.        (  )
  if (lastKnownCommodities) {
    console.log('[EconomicDataService] Using last known commodity prices as fallback');
    return lastKnownCommodities;
  }

  // 3.     -    
  console.warn('[EconomicDataService] No commodity data available, using static defaults');
  return getDefaultCommodityPrices();
}

/**
 *       
 */
function getDefaultCurrencyRates(): CurrencyRate[] {
  return [
    { code: 'USD', name: `دولار أمريكي`, rate: 1, change: 0, changePercent: 0, direction: 'stable', lastUpdated: new Date() },
    { code: 'EUR', name: `يورو`, rate: 0.92, change: -0.002, changePercent: -0.22, direction: 'down', lastUpdated: new Date() },
    { code: 'GBP', name: `جنيه إسترليني`, rate: 0.79, change: 0.001, changePercent: 0.13, direction: 'up', lastUpdated: new Date() },
    { code: 'LYD', name: `دينار ليبي`, rate: 4.85, change: 0.02, changePercent: 0.41, direction: 'up', lastUpdated: new Date() },
    { code: 'EGP', name: `جنيه مصري`, rate: 50.5, change: 0.3, changePercent: 0.60, direction: 'up', lastUpdated: new Date() },
  ];
}

/**
 *       
 */
function getDefaultCommodityPrices(): CommodityPrice[] {
  return [
    { name: `الذهب`, symbol: 'XAU', price: 2650, currency: 'USD', change: 15, changePercent: 0.57, direction: 'up', lastUpdated: new Date() },
    { name: `الفضة`, symbol: 'XAG', price: 31, currency: 'USD', change: -0.2, changePercent: -0.64, direction: 'down', lastUpdated: new Date() },
    { name: `نفط برنت`, symbol: 'BRENT', price: 78, currency: 'USD', change: 1.2, changePercent: 1.56, direction: 'up', lastUpdated: new Date() },
    { name: `نفط WTI`, symbol: 'WTI', price: 74, currency: 'USD', change: 0.8, changePercent: 1.09, direction: 'up', lastUpdated: new Date() },
  ];
}

/**
 *    
 */
export async function fetchEconomicData(): Promise<EconomicData> {
  const now = Date.now();
  
  //  Cache    
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedData;
  }
  
  //   
  const [currencies, commodities] = await Promise.all([
    fetchCurrencyRates(),
    fetchCommodityPrices()
  ]);
  
  cachedData = {
    currencies,
    commodities,
    lastUpdated: new Date(),
    source: 'Frankfurter API + Market Data'
  };
  
  lastFetchTime = now;
  return cachedData;
}

/**
 *     
 */
export function analyzeEconomicSentiment(data: EconomicData): {
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  signals: string[];
  summary: string;
} {
  const signals: string[] = [];
  let bullishCount = 0;
  let bearishCount = 0;
  
  //  
  for (const currency of data.currencies) {
    if (currency.code === 'USD') continue;
    
    if (currency.direction === 'up' && currency.changePercent > 0.5) {
      bearishCount++; //    =  
      signals.push(`${currency.name}  ${currency.changePercent.toFixed(2)}%`);
    } else if (currency.direction === 'down' && currency.changePercent < -0.5) {
      bullishCount++; //   =  
      signals.push(`${currency.name}  ${Math.abs(currency.changePercent).toFixed(2)}%`);
    }
  }
  
  //  
  for (const commodity of data.commodities) {
    if (commodity.direction === 'up' && commodity.changePercent > 1) {
      if (commodity.symbol === 'XAU' || commodity.symbol === 'XAG') {
        bearishCount++; //   =   
        signals.push(`${commodity.name}  ${commodity.changePercent.toFixed(2)}% ( )`);
      } else {
        bullishCount++; //   =  
        signals.push(`${commodity.name}  ${commodity.changePercent.toFixed(2)}%`);
      }
    } else if (commodity.direction === 'down' && commodity.changePercent < -1) {
      if (commodity.symbol === 'XAU' || commodity.symbol === 'XAG') {
        bullishCount++; //   =   
        signals.push(`${commodity.name}  ${Math.abs(commodity.changePercent).toFixed(2)}%`);
      } else {
        bearishCount++; //   =  
        signals.push(`${commodity.name}  ${Math.abs(commodity.changePercent).toFixed(2)}%`);
      }
    }
  }
  
  //  
  const total = bullishCount + bearishCount;
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let confidence = 50;
  
  if (total > 0) {
    const bullishRatio = bullishCount / total;
    if (bullishRatio > 0.6) {
      trend = 'bullish';
      confidence = 50 + (bullishRatio * 50);
    } else if (bullishRatio < 0.4) {
      trend = 'bearish';
      confidence = 50 + ((1 - bullishRatio) * 50);
    }
  }
  
  // 
  let summary = '';
  if (trend === 'bullish') {
    summary = `المؤشرات الاقتصادية تميل للإيجابية مع ثقة في الأسواق`;
  } else if (trend === 'bearish') {
    summary = `المؤشرات الاقتصادية تشير لحذر مع توجه نحو الملاذات الآمنة`;
  } else {
    summary = `الأسواق في حالة ترقب مع إشارات متباينة`;
  }
  
  return {
    trend,
    confidence: Math.round(confidence),
    signals: signals.slice(0, 5), //  5 
    summary
  };
}

/**
 *     
 */
export function formatEconomicDataForResponse(data: EconomicData): string {
  const analysis = analyzeEconomicSentiment(data);
  
  let text = `**المؤشرات الاقتصادية:**\n`;
  
  //  
  const mainCurrencies = data.currencies.filter(c => ['EUR', 'LYD', 'EGP'].includes(c.code));
  if (mainCurrencies.length > 0) {
    text += `\n• العملات: `;
    text += mainCurrencies.map(c => {
      const arrow = c.direction === 'up' ? '↑' : c.direction === 'down' ? '↓' : '→';
      return `${c.name} ${arrow}${Math.abs(c.changePercent).toFixed(1)}%`;
    }).join(' | ');
  }
  
  // 
  const gold = data.commodities.find(c => c.symbol === 'XAU');
  const oil = data.commodities.find(c => c.symbol === 'BRENT');
  
  if (gold || oil) {
    text += `\n• السلع: `;
    const items: string[] = [];
    if (gold) {
      const arrow = gold.direction === 'up' ? '↑' : gold.direction === 'down' ? '↓' : '→';
      items.push(` $${gold.price.toFixed(0)} ${arrow}${Math.abs(gold.changePercent).toFixed(1)}%`);
    }
    if (oil) {
      const arrow = oil.direction === 'up' ? '↑' : oil.direction === 'down' ? '↓' : '→';
      items.push(` $${oil.price.toFixed(0)} ${arrow}${Math.abs(oil.changePercent).toFixed(1)}%`);
    }
    text += items.join(' | ');
  }
  
  // 
  text += `\n• **:** ${analysis.summary}`;
  
  return text;
}

/**
 *     
 */
export async function getCurrencyRate(code: string): Promise<CurrencyRate | null> {
  const data = await fetchEconomicData();
  return data.currencies.find(c => c.code === code) || null;
}

/**
 *     
 */
export async function getCommodityPrice(symbol: string): Promise<CommodityPrice | null> {
  const data = await fetchEconomicData();
  return data.commodities.find(c => c.symbol === symbol) || null;
}
