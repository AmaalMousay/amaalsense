import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Activity, 
  BarChart3, Zap, Shield, Clock, Globe, Users,
  ChevronRight, ArrowUpRight, ArrowDownRight, Minus,
  DollarSign, Bitcoin, Fuel, Cpu, Loader2, Info,
  LineChart, PieChart, Bell, Download, Lock
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/_core/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';

// Asset types for market analysis
interface MarketAsset {
  id: string;
  name: string;
  nameAr: string;
  symbol: string;
  icon: React.ReactNode;
  sentimentScore: number;
  sentimentChange: number;
  fearSpike: number;
  hypeIndex: number;
  momentum: 'bullish' | 'bearish' | 'neutral';
  signal: string;
  signalAr: string;
  lastUpdate: string;
}

// Sample market assets data
const MARKET_ASSETS: MarketAsset[] = [
  {
    id: 'gold',
    name: 'Gold',
    nameAr: 'الذهب',
    symbol: 'XAU',
    icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
    sentimentScore: 68,
    sentimentChange: 12,
    fearSpike: 35,
    hypeIndex: 42,
    momentum: 'bullish',
    signal: 'Optimism rising +32% in 48h, historically precedes significant price movements',
    signalAr: 'ارتفاع التفاؤل +32% خلال 48 ساعة، تاريخياً هذا النمط يسبق تحركات سعرية كبيرة',
    lastUpdate: '5 min ago'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    nameAr: 'بيتكوين',
    symbol: 'BTC',
    icon: <Bitcoin className="w-6 h-6 text-orange-400" />,
    sentimentScore: 72,
    sentimentChange: 8,
    fearSpike: 28,
    hypeIndex: 78,
    momentum: 'bullish',
    signal: 'High hype index (78%) - elevated media attention, monitor for potential volatility',
    signalAr: 'مؤشر التضخيم مرتفع (78%) - اهتمام إعلامي كبير، راقب التقلبات المحتملة',
    lastUpdate: '2 min ago'
  },
  {
    id: 'tech',
    name: 'Tech Stocks',
    nameAr: 'أسهم التكنولوجيا',
    symbol: 'TECH',
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
    sentimentScore: 45,
    sentimentChange: -15,
    fearSpike: 62,
    hypeIndex: 55,
    momentum: 'bearish',
    signal: 'Collective anxiety at 6-month high, sentiment momentum declining',
    signalAr: 'القلق الجماعي في أعلى نقطة منذ 6 أشهر، زخم المشاعر في انخفاض',
    lastUpdate: '8 min ago'
  },
  {
    id: 'oil',
    name: 'Crude Oil',
    nameAr: 'النفط الخام',
    symbol: 'WTI',
    icon: <Fuel className="w-6 h-6 text-gray-400" />,
    sentimentScore: 52,
    sentimentChange: 3,
    fearSpike: 45,
    hypeIndex: 38,
    momentum: 'neutral',
    signal: 'Sentiment stable, no significant emotional signals detected',
    signalAr: 'المشاعر مستقرة، لا توجد إشارات عاطفية مهمة',
    lastUpdate: '12 min ago'
  }
];

// Momentum color mapping
const getMomentumColor = (momentum: string) => {
  switch (momentum) {
    case 'bullish': return 'text-green-400 bg-green-400/20';
    case 'bearish': return 'text-red-400 bg-red-400/20';
    default: return 'text-yellow-400 bg-yellow-400/20';
  }
};

const getMomentumIcon = (momentum: string) => {
  switch (momentum) {
    case 'bullish': return <TrendingUp className="w-4 h-4" />;
    case 'bearish': return <TrendingDown className="w-4 h-4" />;
    default: return <Minus className="w-4 h-4" />;
  }
};

const getMomentumLabel = (momentum: string) => {
  switch (momentum) {
    case 'bullish': return 'صاعد';
    case 'bearish': return 'هابط';
    default: return 'محايد';
  }
};

// Fear level indicator
const getFearLevel = (fear: number) => {
  if (fear >= 70) return { label: 'Extreme Fear', labelAr: 'ذعر شديد', color: 'text-red-500' };
  if (fear >= 50) return { label: 'High Fear', labelAr: 'خوف مرتفع', color: 'text-orange-400' };
  if (fear >= 30) return { label: 'Moderate', labelAr: 'معتدل', color: 'text-yellow-400' };
  return { label: 'Low Fear', labelAr: 'خوف منخفض', color: 'text-green-400' };
};

// Hype level indicator
const getHypeLevel = (hype: number) => {
  if (hype >= 70) return { label: 'Extreme Hype', labelAr: 'تضخيم شديد', color: 'text-purple-500' };
  if (hype >= 50) return { label: 'High Hype', labelAr: 'تضخيم مرتفع', color: 'text-purple-400' };
  if (hype >= 30) return { label: 'Moderate', labelAr: 'معتدل', color: 'text-blue-400' };
  return { label: 'Low Hype', labelAr: 'تضخيم منخفض', color: 'text-gray-400' };
};

export default function Markets() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isArabic, setIsArabic] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <LogoIcon size="sm" />
                <span className="text-lg font-bold gradient-text hidden sm:block">AmalSense</span>
              </div>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-sm">Markets</span>
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">BETA</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsArabic(!isArabic)}
            >
              {isArabic ? 'EN' : 'عربي'}
            </Button>
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold cosmic-text mb-4">
            {isArabic ? (
              <>إشارات <span className="gradient-text">عاطفية</span> للأسواق</>
            ) : (
              <>Emotional <span className="gradient-text">Market</span> Signals</>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {isArabic 
              ? 'نحن لا نقول لك ماذا تفعل، نحن نريك كيف يشعر السوق قبل أن يتحرك.'
              : "We don't tell you what to do. We show you how the market feels before it moves."
            }
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{isArabic ? '15+ مصدر بيانات' : '15+ Data Sources'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{isArabic ? 'تحديث كل 5 دقائق' : 'Updated Every 5 Min'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>{isArabic ? 'ليست نصيحة مالية' : 'Not Financial Advice'}</span>
            </div>
          </div>
        </div>

        {/* Main Indicators Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Sentiment Momentum */}
          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Sentiment Momentum</h3>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'زخم المشاعر' : 'Emotion Direction'}</p>
                </div>
              </div>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{isArabic ? 'الاتجاه العام' : 'Overall Trend'}</span>
                <span className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  {isArabic ? 'صاعد' : 'Rising'}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isArabic 
                  ? 'المشاعر العامة تتحسن عبر معظم الأصول'
                  : 'General sentiment improving across most assets'
                }
              </p>
            </div>
          </Card>

          {/* Fear Spike Index */}
          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Fear Spike Index</h3>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'مؤشر الذعر' : 'Panic Detection'}</p>
                </div>
              </div>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{isArabic ? 'المستوى الحالي' : 'Current Level'}</span>
                <span className="text-2xl font-bold text-orange-400">42%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[42%] bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isArabic 
                  ? 'مستوى معتدل - لا توجد علامات ذعر'
                  : 'Moderate level - no panic signals detected'
                }
              </p>
            </div>
          </Card>

          {/* Hype Index */}
          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Hype Index</h3>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'مؤشر التضخيم' : 'Media Buzz'}</p>
                </div>
              </div>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{isArabic ? 'التضخيم الإعلامي' : 'Media Amplification'}</span>
                <span className="text-2xl font-bold text-purple-400">58%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[58%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isArabic 
                  ? 'اهتمام إعلامي مرتفع - راقب الفقاعات المحتملة'
                  : 'Elevated media attention - watch for potential bubbles'
                }
              </p>
            </div>
          </Card>
        </div>

        {/* Asset Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'إشارات الأصول' : 'Asset Signals'}
            </h2>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              {isArabic ? 'تنبيهات' : 'Set Alerts'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MARKET_ASSETS.map(asset => {
              const fearLevel = getFearLevel(asset.fearSpike);
              const hypeLevel = getHypeLevel(asset.hypeIndex);
              
              return (
                <Card 
                  key={asset.id} 
                  className="cosmic-card p-6 hover:border-green-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedAsset(asset.id === selectedAsset ? null : asset.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {asset.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{isArabic ? asset.nameAr : asset.name}</h3>
                        <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMomentumColor(asset.momentum)}`}>
                      {getMomentumIcon(asset.momentum)}
                      {isArabic ? getMomentumLabel(asset.momentum) : asset.momentum}
                    </div>
                  </div>

                  {/* Sentiment Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {isArabic ? 'نقاط المشاعر' : 'Sentiment Score'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{asset.sentimentScore}</span>
                        <span className={`text-sm flex items-center ${asset.sentimentChange > 0 ? 'text-green-400' : asset.sentimentChange < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                          {asset.sentimentChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : asset.sentimentChange < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                          {asset.sentimentChange > 0 ? '+' : ''}{asset.sentimentChange}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          asset.sentimentScore > 60 ? 'bg-green-500' : 
                          asset.sentimentScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${asset.sentimentScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Mini Indicators */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{isArabic ? 'الخوف' : 'Fear'}</span>
                        <span className={`text-sm font-medium ${fearLevel.color}`}>{asset.fearSpike}%</span>
                      </div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{isArabic ? 'التضخيم' : 'Hype'}</span>
                        <span className={`text-sm font-medium ${hypeLevel.color}`}>{asset.hypeIndex}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Signal Box */}
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{isArabic ? asset.signalAr : asset.signal}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isArabic ? 'آخر تحديث: ' : 'Updated: '}{asset.lastUpdate}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isArabic ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free */}
            <Card className="cosmic-card p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1">Free</h3>
                <p className="text-3xl font-bold">$0</p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'مجاني للأبد' : 'Forever free'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'إشارات عامة' : 'General signals'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? '4 أصول' : '4 assets'}
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  {isArabic ? 'تحديث كل ساعة' : 'Hourly updates'}
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {isArabic ? 'ابدأ مجاناً' : 'Start Free'}
              </Button>
            </Card>

            {/* Pro Trader */}
            <Card className="cosmic-card p-6 ring-2 ring-green-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1">Pro Trader</h3>
                <p className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'للمتداولين الأفراد' : 'For individual traders'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'جميع الأصول' : 'All assets'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تحديث كل 5 دقائق' : '5-min updates'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تنبيهات فورية' : 'Instant alerts'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تقارير PDF' : 'PDF reports'}
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {isArabic ? 'اشترك الآن' : 'Subscribe Now'}
              </Button>
            </Card>

            {/* Fund */}
            <Card className="cosmic-card p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1">Fund</h3>
                <p className="text-3xl font-bold">$199<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'للصناديق والمؤسسات' : 'For funds & institutions'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'كل مميزات Pro' : 'All Pro features'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'بيانات تاريخية' : 'Historical data'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تحليل مخصص' : 'Custom analysis'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'دعم مخصص' : 'Priority support'}
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {isArabic ? 'تواصل معنا' : 'Contact Sales'}
              </Button>
            </Card>

            {/* API */}
            <Card className="cosmic-card p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1">API</h3>
                <p className="text-3xl font-bold">{isArabic ? 'مخصص' : 'Custom'}</p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'حسب الاستخدام' : 'Usage-based pricing'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'REST API كامل' : 'Full REST API'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'Webhooks' : 'Webhooks'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'بيانات خام' : 'Raw data access'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'SLA مضمون' : 'SLA guarantee'}
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {isArabic ? 'طلب API' : 'Request API'}
              </Button>
            </Card>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <Card className="cosmic-card p-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">
                {isArabic ? 'إخلاء مسؤولية مهم' : 'Important Disclaimer'}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {isArabic 
                  ? 'AmalSense يقدم مؤشرات عاطفية وليس نصائح مالية. المعلومات المقدمة هي لأغراض تعليمية وبحثية فقط. لا ينبغي اعتبار أي محتوى على هذه المنصة توصية بشراء أو بيع أو الاحتفاظ بأي أصل مالي.'
                  : 'AmalSense provides emotional indicators, not financial advice. The information provided is for educational and research purposes only. No content on this platform should be considered a recommendation to buy, sell, or hold any financial asset.'
                }
              </p>
              <p className="text-xs text-yellow-400/80">
                {isArabic 
                  ? 'استشر مستشاراً مالياً مرخصاً قبل اتخاذ أي قرارات استثمارية.'
                  : 'Consult a licensed financial advisor before making any investment decisions.'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AmalSense Markets. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isArabic 
              ? 'مؤشرات عاطفية للأسواق - ليست نصيحة مالية'
              : 'Emotional Market Indicators - Not Financial Advice'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}
