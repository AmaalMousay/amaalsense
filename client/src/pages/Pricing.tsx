import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  Building2, 
  Crown,
  Globe,
  ArrowRight,
  Star
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  priceLabel: string;
  description: string;
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
  limits: {
    analyses: string;
    apiCalls: string;
    countries: string;
    history: string;
  };
  icon: React.ReactNode;
  ctaText: string;
  ctaLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    nameAr: 'مجاني',
    price: 0,
    priceLabel: '$0',
    description: 'Perfect for individuals exploring collective emotion analysis',
    icon: <Zap className="w-6 h-6" />,
    ctaText: 'Get Started',
    ctaLink: '/analyzer',
    features: [
      { name: 'Basic emotion analysis', included: true },
      { name: 'Global indices (GMI, CFI, HRI)', included: true },
      { name: 'Theory & documentation access', included: true },
      { name: 'Social media analysis', included: false },
      { name: 'Emotional Weather forecasts', included: false },
      { name: 'PDF report export', included: false },
      { name: 'API access', included: false },
      { name: 'Early warning alerts', included: false },
      { name: 'Custom reports', included: false },
      { name: 'White-label solution', included: false },
    ],
    limits: {
      analyses: '50/day',
      apiCalls: 'None',
      countries: '5 countries',
      history: '24 hours',
    },
  },
  {
    id: 'pro',
    name: 'Professional',
    nameAr: 'احترافي',
    price: 49,
    priceLabel: '$49',
    description: 'For researchers and small teams needing deeper insights',
    popular: true,
    icon: <Star className="w-6 h-6" />,
    ctaText: 'Start Pro Trial',
    ctaLink: '/contact',
    features: [
      { name: 'Basic emotion analysis', included: true },
      { name: 'Global indices (GMI, CFI, HRI)', included: true },
      { name: 'Theory & documentation access', included: true },
      { name: 'Social media analysis', included: true },
      { name: 'Emotional Weather forecasts', included: true },
      { name: 'PDF report export', included: true },
      { name: 'API access', included: true },
      { name: 'Early warning alerts', included: false },
      { name: 'Custom reports', included: false },
      { name: 'White-label solution', included: false },
    ],
    limits: {
      analyses: '500/day',
      apiCalls: '1,000/day',
      countries: '25 countries',
      history: '30 days',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameAr: 'مؤسسي',
    price: 299,
    priceLabel: '$299',
    description: 'Full-featured solution for organizations and enterprises',
    icon: <Building2 className="w-6 h-6" />,
    ctaText: 'Contact Sales',
    ctaLink: '/contact',
    features: [
      { name: 'Basic emotion analysis', included: true },
      { name: 'Global indices (GMI, CFI, HRI)', included: true },
      { name: 'Theory & documentation access', included: true },
      { name: 'Social media analysis', included: true },
      { name: 'Emotional Weather forecasts', included: true },
      { name: 'PDF report export', included: true },
      { name: 'API access', included: true },
      { name: 'Early warning alerts', included: true },
      { name: 'Custom reports', included: true },
      { name: 'White-label solution', included: true },
    ],
    limits: {
      analyses: 'Unlimited',
      apiCalls: 'Unlimited',
      countries: 'All countries',
      history: '1 year',
    },
  },
  {
    id: 'government',
    name: 'Government & NGO',
    nameAr: 'حكومي ومنظمات',
    price: -1,
    priceLabel: 'Custom',
    description: 'Tailored solutions for governments and international organizations',
    icon: <Crown className="w-6 h-6" />,
    ctaText: 'Request Demo',
    ctaLink: '/contact',
    features: [
      { name: 'Basic emotion analysis', included: true },
      { name: 'Global indices (GMI, CFI, HRI)', included: true },
      { name: 'Theory & documentation access', included: true },
      { name: 'Social media analysis', included: true },
      { name: 'Emotional Weather forecasts', included: true },
      { name: 'PDF report export', included: true },
      { name: 'API access', included: true },
      { name: 'Early warning alerts', included: true },
      { name: 'Custom reports', included: true },
      { name: 'White-label solution', included: true },
    ],
    limits: {
      analyses: 'Unlimited',
      apiCalls: 'Unlimited',
      countries: 'All + Custom regions',
      history: 'Unlimited',
    },
  },
];

export default function Pricing() {
  const [, navigate] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-sm hover:text-accent transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-sm hover:text-accent transition-colors">
              Dashboard
            </button>
            <button onClick={() => navigate('/contact')} className="text-sm hover:text-accent transition-colors">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold cosmic-text mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock the power of collective emotion analysis for your organization
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={billingCycle === 'monthly' ? 'text-accent' : 'text-muted-foreground'}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-muted rounded-full transition-colors"
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-accent rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingCycle === 'annual' ? 'text-accent' : 'text-muted-foreground'}>
              Annual <span className="text-green-400 text-sm">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`cosmic-card p-6 relative flex flex-col ${
                  tier.popular ? 'ring-2 ring-accent' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-bold cosmic-text">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tier.nameAr}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold gradient-text">
                      {tier.price === -1 ? 'Custom' : tier.priceLabel}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  {billingCycle === 'annual' && tier.price > 0 && (
                    <p className="text-sm text-green-400 mt-1">
                      ${Math.round(tier.price * 12 * 0.8)}/year (Save ${Math.round(tier.price * 12 * 0.2)})
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                </div>

                {/* Limits */}
                <div className="space-y-2 mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Analyses</span>
                    <span className="font-medium">{tier.limits.analyses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Calls</span>
                    <span className="font-medium">{tier.limits.apiCalls}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Countries</span>
                    <span className="font-medium">{tier.limits.countries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">History</span>
                    <span className="font-medium">{tier.limits.history}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => navigate(tier.ctaLink)}
                  className={`w-full ${tier.popular ? 'glow-button text-white' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  {tier.ctaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 border-t border-border/50">
        <div className="container max-w-4xl text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 text-accent" />
          <h3 className="text-3xl font-bold cosmic-text mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            We work with governments, NGOs, and large enterprises to create tailored solutions
            for monitoring collective emotions at scale. Get dedicated support, custom integrations,
            and regional analysis capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/contact')}
              className="glow-button text-white px-8"
            >
              Schedule a Demo
            </Button>
            <Button
              onClick={() => navigate('/about')}
              variant="outline"
              className="px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container max-w-3xl">
          <h3 className="text-2xl font-bold cosmic-text text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="cosmic-card p-6 rounded-lg">
              <h4 className="font-bold mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for enterprise accounts.
              </p>
            </div>
            <div className="cosmic-card p-6 rounded-lg">
              <h4 className="font-bold mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can change your plan at any time. Changes take effect immediately,
                and we'll prorate your billing accordingly.
              </p>
            </div>
            <div className="cosmic-card p-6 rounded-lg">
              <h4 className="font-bold mb-2">Is there a free trial for paid plans?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 14-day free trial for the Professional plan. Enterprise and
                Government plans include a personalized demo and pilot period.
              </p>
            </div>
            <div className="cosmic-card p-6 rounded-lg">
              <h4 className="font-bold mb-2">Do you offer academic discounts?</h4>
              <p className="text-muted-foreground text-sm">
                Yes! Universities and research institutions receive 50% off all plans.
                Contact us with your academic credentials to apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>AmalSense Engine © 2025 | Transforming Human Emotion into Data | By Amaal Radwan</p>
        </div>
      </footer>
    </div>
  );
}
