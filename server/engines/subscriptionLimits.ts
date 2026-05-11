/**
 * Subscription Limits Configuration
 * Defines the limits and features for each subscription tier
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise' | 'government';

export interface TierLimits {
  // Analysis limits
  dailyAnalyses: number;
  
  // API limits
  dailyApiCalls: number;
  
  // Map features
  countriesAccess: number;
  
  // Historical data
  historicalDays: number;
  
  // Features
  features: {
    socialMediaAnalysis: boolean;
    emotionalWeather: boolean;
    exportPdf: boolean;
    apiAccess: boolean;
    earlyWarningSystem: boolean;
    customReports: boolean;
    whiteLabel: boolean;
    dedicatedSupport: boolean;
    training: boolean;
  };
}

export interface TierInfo {
  name: string;
  nameAr: string;
  price: number;
  priceLabel: string;
  description: string;
  descriptionAr: string;
  limits: TierLimits;
  popular?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierInfo> = {
  free: {
    name: 'Free',
    nameAr: 'مجاني',
    price: 0,
    priceLabel: '$0/month',
    description: 'Perfect for individuals exploring collective emotion analysis',
    descriptionAr: 'مثالي للأفراد الذين يستكشفون تحليل المشاعر الجماعية',
    limits: {
      dailyAnalyses: 50,
      dailyApiCalls: 0,
      countriesAccess: 5,
      historicalDays: 1,
      features: {
        socialMediaAnalysis: false,
        emotionalWeather: false,
        exportPdf: false,
        apiAccess: false,
        earlyWarningSystem: false,
        customReports: false,
        whiteLabel: false,
        dedicatedSupport: false,
        training: false,
      },
    },
  },
  
  pro: {
    name: 'Professional',
    nameAr: 'احترافي',
    price: 49,
    priceLabel: '$49/month',
    description: 'For researchers and small teams needing deeper insights',
    descriptionAr: 'للباحثين والفرق الصغيرة التي تحتاج رؤى أعمق',
    popular: true,
    limits: {
      dailyAnalyses: 500,
      dailyApiCalls: 1000,
      countriesAccess: 25,
      historicalDays: 30,
      features: {
        socialMediaAnalysis: true,
        emotionalWeather: true,
        exportPdf: true,
        apiAccess: true,
        earlyWarningSystem: false,
        customReports: false,
        whiteLabel: false,
        dedicatedSupport: false,
        training: false,
      },
    },
  },
  
  enterprise: {
    name: 'Enterprise',
    nameAr: 'مؤسسي',
    price: 299,
    priceLabel: '$299/month',
    description: 'Full-featured solution for organizations and enterprises',
    descriptionAr: 'حل متكامل للمؤسسات والشركات الكبرى',
    limits: {
      dailyAnalyses: -1, // Unlimited
      dailyApiCalls: -1, // Unlimited
      countriesAccess: -1, // All countries
      historicalDays: 365,
      features: {
        socialMediaAnalysis: true,
        emotionalWeather: true,
        exportPdf: true,
        apiAccess: true,
        earlyWarningSystem: true,
        customReports: true,
        whiteLabel: true,
        dedicatedSupport: true,
        training: true,
      },
    },
  },
  
  government: {
    name: 'Government & NGO',
    nameAr: 'حكومي ومنظمات',
    price: -1, // Custom pricing
    priceLabel: 'Custom',
    description: 'Tailored solutions for governments and international organizations',
    descriptionAr: 'حلول مخصصة للحكومات والمنظمات الدولية',
    limits: {
      dailyAnalyses: -1, // Unlimited
      dailyApiCalls: -1, // Unlimited
      countriesAccess: -1, // All countries + custom regions
      historicalDays: -1, // Unlimited
      features: {
        socialMediaAnalysis: true,
        emotionalWeather: true,
        exportPdf: true,
        apiAccess: true,
        earlyWarningSystem: true,
        customReports: true,
        whiteLabel: true,
        dedicatedSupport: true,
        training: true,
      },
    },
  },
};

/**
 * Check if a user has reached their daily limit for a specific usage type
 */
export function checkUsageLimit(
  tier: SubscriptionTier,
  usageType: 'analysis' | 'api_call',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const tierInfo = SUBSCRIPTION_TIERS[tier];
  let limit: number;
  
  switch (usageType) {
    case 'analysis':
      limit = tierInfo.limits.dailyAnalyses;
      break;
    case 'api_call':
      limit = tierInfo.limits.dailyApiCalls;
      break;
    default:
      limit = 0;
  }
  
  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }
  
  const remaining = Math.max(0, limit - currentUsage);
  return {
    allowed: currentUsage < limit,
    limit,
    remaining,
  };
}

/**
 * Check if a feature is available for a subscription tier
 */
export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof TierLimits['features']
): boolean {
  return SUBSCRIPTION_TIERS[tier].limits.features[feature];
}

/**
 * Get the number of countries a user can access
 */
export function getCountriesLimit(tier: SubscriptionTier): number {
  return SUBSCRIPTION_TIERS[tier].limits.countriesAccess;
}

/**
 * Get the historical data limit in days
 */
export function getHistoricalLimit(tier: SubscriptionTier): number {
  return SUBSCRIPTION_TIERS[tier].limits.historicalDays;
}

/**
 * Get all tier information for pricing page
 */
export function getAllTiers(): TierInfo[] {
  return Object.values(SUBSCRIPTION_TIERS);
}

/**
 * Get tier information by name
 */
export function getTierInfo(tier: SubscriptionTier): TierInfo {
  return SUBSCRIPTION_TIERS[tier];
}
