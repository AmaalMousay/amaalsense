import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link, useLocation } from 'wouter';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Activity, 
  BarChart3, Zap, Shield, Clock, Globe, Users,
  ChevronRight, ArrowUpRight, ArrowDownRight, Minus,
  DollarSign, Bitcoin, Fuel, Cpu, Info,
  LineChart, Bell, Lock, RefreshCw, Eye,
  AlertCircle, CheckCircle, XCircle, Target,
  Gauge, Flame, Snowflake, TrendingUp as Rising
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/_core/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';

// Types
interface MarketAsset {
  id: string;
  name: string;
  nameAr: string;
  symbol: string;
  icon: React.ReactNode;
  sentimentScore: number;
  sentimentChange: number;
  sentimentTrend: 'rising' | 'falling' | 'reversing' | 'stable';
  fearSpike: number;
  fearChange: number;
  hypeIndex: number;
  hypeChange: number;
  momentum: 'bullish' | 'bearish' | 'neutral';
  signal: string;
  signalAr: string;
  signalType: 'warning' | 'opportunity' | 'neutral' | 'danger';
  lastUpdate: string;
}

// Enhanced market assets data with full trader scenario
const MARKET_ASSETS: MarketAsset[] = [
  {
    id: 'gold',
    name: 'Gold',
    nameAr: 'الذهب',
    symbol: 'XAU/USD',
    icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
    sentimentScore: 72,
    sentimentChange: 18,
    sentimentTrend: 'rising',
    fearSpike: 58,
    fearChange: 24,
    hypeIndex: 45,
    hypeChange: 12,
    momentum: 'bullish',
    signal: 'Fear rising rapidly (+24% in 24h) with "safe haven" mentions increasing. Historically precedes gold price surge.',
    signalAr: 'الخوف يرتفع بسرعة (+24% خلال 24 ساعة) مع زيادة ذكر "الملاذ الآمن". تاريخياً هذا يسبق ارتفاع سعر الذهب.',
    signalType: 'opportunity',
    lastUpdate: '3 min ago'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    nameAr: 'بيتكوين',
    symbol: 'BTC/USD',
    icon: <Bitcoin className="w-6 h-6 text-orange-400" />,
    sentimentScore: 78,
    sentimentChange: 8,
    sentimentTrend: 'stable',
    fearSpike: 22,
    fearChange: -5,
    hypeIndex: 85,
    hypeChange: 32,
    momentum: 'bullish',
    signal: 'CAUTION: Hype Index at 85% - extreme media amplification. Potential psychological bubble forming.',
    signalAr: 'تحذير: مؤشر التضخيم عند 85% - تضخيم إعلامي شديد. احتمال تشكل فقاعة نفسية.',
    signalType: 'warning',
    lastUpdate: '1 min ago'
  },
  {
    id: 'tech',
    name: 'Tech Stocks',
    nameAr: 'أسهم التكنولوجيا',
    symbol: 'NASDAQ',
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
    sentimentScore: 38,
    sentimentChange: -22,
    sentimentTrend: 'falling',
    fearSpike: 72,
    fearChange: 35,
    hypeIndex: 48,
    hypeChange: -8,
    momentum: 'bearish',
    signal: 'ALERT: Fear Spike at 72% - collective anxiety at 6-month high. Sentiment momentum reversing downward.',
    signalAr: 'تنبيه: مؤشر الذعر عند 72% - القلق الجماعي في أعلى نقطة منذ 6 أشهر. زخم المشاعر ينقلب نزولاً.',
    signalType: 'danger',
    lastUpdate: '5 min ago'
  },
  {
    id: 'oil',
    name: 'Crude Oil',
    nameAr: 'النفط الخام',
    symbol: 'WTI',
    icon: <Fuel className="w-6 h-6 text-emerald-400" />,
    sentimentScore: 52,
    sentimentChange: 3,
    sentimentTrend: 'stable',
    fearSpike: 38,
    fearChange: 2,
    hypeIndex: 35,
    hypeChange: -3,
    momentum: 'neutral',
    signal: 'Sentiment stable. No significant emotional signals detected. Market in equilibrium.',
    signalAr: 'المشاعر مستقرة. لا توجد إشارات عاطفية مهمة. السوق في حالة توازن.',
    signalType: 'neutral',
    lastUpdate: '8 min ago'
  },
  {
    id: 'sp500',
    name: 'S&P 500',
    nameAr: 'إس آند بي 500',
    symbol: 'SPX',
    icon: <LineChart className="w-6 h-6 text-indigo-400" />,
    sentimentScore: 55,
    sentimentChange: -8,
    sentimentTrend: 'reversing',
    fearSpike: 48,
    fearChange: 15,
    hypeIndex: 52,
    hypeChange: 5,
    momentum: 'neutral',
    signal: 'Sentiment momentum reversing. Watch for potential trend change in next 48-72 hours.',
    signalAr: 'زخم المشاعر ينقلب. راقب احتمال تغير الاتجاه خلال 48-72 ساعة القادمة.',
    signalType: 'warning',
    lastUpdate: '4 min ago'
  },
  {
    id: 'euro',
    name: 'EUR/USD',
    nameAr: 'اليورو/دولار',
    symbol: 'EUR/USD',
    icon: <Globe className="w-6 h-6 text-blue-300" />,
    sentimentScore: 48,
    sentimentChange: -4,
    sentimentTrend: 'falling',
    fearSpike: 42,
    fearChange: 8,
    hypeIndex: 28,
    hypeChange: -2,
    momentum: 'bearish',
    signal: 'Mild bearish sentiment. Fear slightly elevated due to economic uncertainty discussions.',
    signalAr: 'مشاعر سلبية خفيفة. الخوف مرتفع قليلاً بسبب نقاشات عدم اليقين الاقتصادي.',
    signalType: 'neutral',
    lastUpdate: '6 min ago'
  }
];

// Market mood calculation
const calculateMarketMood = () => {
  const avgSentiment = MARKET_ASSETS.reduce((acc, a) => acc + a.sentimentScore, 0) / MARKET_ASSETS.length;
  const avgFear = MARKET_ASSETS.reduce((acc, a) => acc + a.fearSpike, 0) / MARKET_ASSETS.length;
  const avgHype = MARKET_ASSETS.reduce((acc, a) => acc + a.hypeIndex, 0) / MARKET_ASSETS.length;
  
  if (avgFear > 60) return { mood: 'tense', moodAr: 'متوتر', color: 'text-red-400', bg: 'bg-red-500/20' };
  if (avgHype > 70) return { mood: 'euphoric', moodAr: 'مبتهج بشكل مفرط', color: 'text-purple-400', bg: 'bg-purple-500/20' };
  if (avgSentiment > 60) return { mood: 'optimistic', moodAr: 'متفائل', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (avgSentiment < 40) return { mood: 'pessimistic', moodAr: 'متشائم', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  return { mood: 'neutral', moodAr: 'محايد', color: 'text-gray-400', bg: 'bg-gray-500/20' };
};

// Helper functions
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

const getMomentumLabel = (momentum: string, isArabic: boolean) => {
  switch (momentum) {
    case 'bullish': return isArabic ? 'صاعد' : 'Bullish';
    case 'bearish': return isArabic ? 'هابط' : 'Bearish';
    default: return isArabic ? 'محايد' : 'Neutral';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'rising': return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'falling': return <TrendingDown className="w-4 h-4 text-red-400" />;
    case 'reversing': return <RefreshCw className="w-4 h-4 text-yellow-400" />;
    default: return <Minus className="w-4 h-4 text-gray-400" />;
  }
};

const getTrendLabel = (trend: string, isArabic: boolean) => {
  switch (trend) {
    case 'rising': return isArabic ? 'صاعد' : 'Rising';
    case 'falling': return isArabic ? 'هابط' : 'Falling';
    case 'reversing': return isArabic ? 'ينقلب' : 'Reversing';
    default: return isArabic ? 'مستقر' : 'Stable';
  }
};

const getSignalStyle = (type: string) => {
  switch (type) {
    case 'opportunity': return { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: <CheckCircle className="w-5 h-5 text-green-400" /> };
    case 'warning': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: <AlertTriangle className="w-5 h-5 text-yellow-400" /> };
    case 'danger': return { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <AlertCircle className="w-5 h-5 text-red-400" /> };
    default: return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: <Info className="w-5 h-5 text-gray-400" /> };
  }
};

const getFearLevel = (fear: number, isArabic: boolean) => {
  if (fear >= 70) return { label: isArabic ? 'ذعر شديد' : 'Extreme Fear', color: 'text-red-500', bg: 'bg-red-500' };
  if (fear >= 50) return { label: isArabic ? 'خوف مرتفع' : 'High Fear', color: 'text-orange-400', bg: 'bg-orange-500' };
  if (fear >= 30) return { label: isArabic ? 'معتدل' : 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500' };
  return { label: isArabic ? 'خوف منخفض' : 'Low Fear', color: 'text-green-400', bg: 'bg-green-500' };
};

const getHypeLevel = (hype: number, isArabic: boolean) => {
  if (hype >= 75) return { label: isArabic ? 'فقاعة محتملة!' : 'Potential Bubble!', color: 'text-purple-500', bg: 'bg-purple-500', warning: true };
  if (hype >= 60) return { label: isArabic ? 'تضخيم شديد' : 'Extreme Hype', color: 'text-purple-400', bg: 'bg-purple-500', warning: true };
  if (hype >= 40) return { label: isArabic ? 'تضخيم مرتفع' : 'High Hype', color: 'text-blue-400', bg: 'bg-blue-500', warning: false };
  return { label: isArabic ? 'طبيعي' : 'Normal', color: 'text-gray-400', bg: 'bg-gray-500', warning: false };
};

export default function Markets() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isArabic, setIsArabic] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const marketMood = calculateMarketMood();
  
  // Calculate overall market stats
  const marketStats = useMemo(() => {
    const avgFear = Math.round(MARKET_ASSETS.reduce((acc, a) => acc + a.fearSpike, 0) / MARKET_ASSETS.length);
    const avgHype = Math.round(MARKET_ASSETS.reduce((acc, a) => acc + a.hypeIndex, 0) / MARKET_ASSETS.length);
    const avgSentiment = Math.round(MARKET_ASSETS.reduce((acc, a) => acc + a.sentimentScore, 0) / MARKET_ASSETS.length);
    const bullishCount = MARKET_ASSETS.filter(a => a.momentum === 'bullish').length;
    const bearishCount = MARKET_ASSETS.filter(a => a.momentum === 'bearish').length;
    const warningCount = MARKET_ASSETS.filter(a => a.signalType === 'warning' || a.signalType === 'danger').length;
    
    return { avgFear, avgHype, avgSentiment, bullishCount, bearishCount, warningCount };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <LogoIcon size="sm" />
                <span className="text-lg font-bold text-foreground hidden sm:block">AmalSense</span>
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
              size="icon"
              onClick={handleRefresh}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {isArabic ? (
              <>نقيس <span className="text-green-400">مزاج السوق</span> قبل أن يتحرك</>
            ) : (
              <>We Measure <span className="text-green-400">Market Mood</span> Before It Moves</>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {isArabic 
              ? 'رادار نفسي للسوق - إشارات عاطفية للتداول الذكي'
              : 'Psychological Radar for Markets - Emotional Signals for Smarter Trading'
            }
          </p>
        </div>

        {/* Market Mood Banner */}
        <Card className={`mb-8 ${marketMood.bg} border-none`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-background/50">
                  <Gauge className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{isArabic ? 'مزاج السوق الآن' : 'Current Market Mood'}</p>
                  <p className={`text-2xl font-bold ${marketMood.color}`}>
                    {isArabic ? marketMood.moodAr : marketMood.mood.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">{isArabic ? 'صاعد' : 'Bullish'}</p>
                  <p className="text-xl font-bold text-green-400">{marketStats.bullishCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">{isArabic ? 'هابط' : 'Bearish'}</p>
                  <p className="text-xl font-bold text-red-400">{marketStats.bearishCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">{isArabic ? 'تحذيرات' : 'Warnings'}</p>
                  <p className="text-xl font-bold text-yellow-400">{marketStats.warningCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Indicators - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sentiment Momentum */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Sentiment Momentum</h3>
                    <p className="text-xs text-muted-foreground">{isArabic ? 'زخم المشاعر' : 'Emotion Direction'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isArabic ? 'المتوسط العام' : 'Average Score'}</span>
                  <span className="text-2xl font-bold text-foreground">{marketStats.avgSentiment}%</span>
                </div>
                <Progress value={marketStats.avgSentiment} className="h-3" />
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-green-500/10 rounded">
                    <TrendingUp className="w-4 h-4 mx-auto text-green-400 mb-1" />
                    <span className="text-muted-foreground">{isArabic ? 'صاعد' : 'Rising'}</span>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded">
                    <RefreshCw className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
                    <span className="text-muted-foreground">{isArabic ? 'ينقلب' : 'Reversing'}</span>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded">
                    <TrendingDown className="w-4 h-4 mx-auto text-red-400 mb-1" />
                    <span className="text-muted-foreground">{isArabic ? 'هابط' : 'Falling'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fear Spike Index */}
          <Card className={`bg-card border-border ${marketStats.avgFear >= 60 ? 'ring-2 ring-red-500/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Fear Spike Index</h3>
                    <p className="text-xs text-muted-foreground">{isArabic ? 'مؤشر الذعر' : 'Panic Detection'}</p>
                  </div>
                </div>
                {marketStats.avgFear >= 60 && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    {isArabic ? 'تحذير!' : 'ALERT!'}
                  </Badge>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isArabic ? 'المستوى الحالي' : 'Current Level'}</span>
                  <span className={`text-2xl font-bold ${getFearLevel(marketStats.avgFear, isArabic).color}`}>
                    {marketStats.avgFear}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${getFearLevel(marketStats.avgFear, isArabic).bg}`}
                    style={{ width: `${marketStats.avgFear}%` }}
                  />
                </div>
                <div className="p-2 bg-muted/50 rounded text-center">
                  <span className={`text-sm font-medium ${getFearLevel(marketStats.avgFear, isArabic).color}`}>
                    {getFearLevel(marketStats.avgFear, isArabic).label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hype Index */}
          <Card className={`bg-card border-border ${marketStats.avgHype >= 70 ? 'ring-2 ring-purple-500/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Hype Index</h3>
                    <p className="text-xs text-muted-foreground">{isArabic ? 'مؤشر التضخيم' : 'Media Bubble'}</p>
                  </div>
                </div>
                {getHypeLevel(marketStats.avgHype, isArabic).warning && (
                  <Badge className="bg-purple-500 text-white">
                    {isArabic ? 'راقب!' : 'WATCH!'}
                  </Badge>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isArabic ? 'التضخيم الإعلامي' : 'Media Amplification'}</span>
                  <span className={`text-2xl font-bold ${getHypeLevel(marketStats.avgHype, isArabic).color}`}>
                    {marketStats.avgHype}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${getHypeLevel(marketStats.avgHype, isArabic).bg}`}
                    style={{ width: `${marketStats.avgHype}%` }}
                  />
                </div>
                <div className="p-2 bg-muted/50 rounded text-center">
                  <span className={`text-sm font-medium ${getHypeLevel(marketStats.avgHype, isArabic).color}`}>
                    {getHypeLevel(marketStats.avgHype, isArabic).label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Grid with Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Asset List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {isArabic ? 'إشارات الأصول' : 'Asset Signals'}
              </h2>
              <Badge variant="outline" className="text-muted-foreground">
                {isArabic ? 'آخر تحديث: منذ دقيقة' : 'Updated: 1 min ago'}
              </Badge>
            </div>

            <div className="space-y-4">
              {MARKET_ASSETS.map(asset => {
                const signalStyle = getSignalStyle(asset.signalType);
                const fearLevel = getFearLevel(asset.fearSpike, isArabic);
                const hypeLevel = getHypeLevel(asset.hypeIndex, isArabic);
                
                return (
                  <Card 
                    key={asset.id}
                    className={`bg-card border-border hover:border-foreground/30 transition-all cursor-pointer ${selectedAsset?.id === asset.id ? 'ring-1 ring-foreground/30' : ''}`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Asset Icon */}
                        <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                          {asset.icon}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-foreground">{isArabic ? asset.nameAr : asset.name}</h3>
                              <span className="text-xs text-muted-foreground">{asset.symbol}</span>
                            </div>
                            <Badge className={getMomentumColor(asset.momentum)}>
                              {getMomentumIcon(asset.momentum)}
                              <span className="ml-1">{getMomentumLabel(asset.momentum, isArabic)}</span>
                            </Badge>
                          </div>

                          {/* Mini Indicators Row */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 bg-muted/50 rounded">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'المشاعر' : 'Sentiment'}</p>
                              <p className="font-bold text-foreground">{asset.sentimentScore}%</p>
                              <div className="flex items-center justify-center gap-1 text-xs">
                                {getTrendIcon(asset.sentimentTrend)}
                                <span className={asset.sentimentChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                  {asset.sentimentChange > 0 ? '+' : ''}{asset.sentimentChange}%
                                </span>
                              </div>
                            </div>
                            <div className="text-center p-2 bg-muted/50 rounded">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'الخوف' : 'Fear'}</p>
                              <p className={`font-bold ${fearLevel.color}`}>{asset.fearSpike}%</p>
                              <span className={`text-xs ${asset.fearChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {asset.fearChange > 0 ? '+' : ''}{asset.fearChange}%
                              </span>
                            </div>
                            <div className="text-center p-2 bg-muted/50 rounded">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'التضخيم' : 'Hype'}</p>
                              <p className={`font-bold ${hypeLevel.color}`}>{asset.hypeIndex}%</p>
                              <span className={`text-xs ${asset.hypeChange > 0 ? 'text-purple-400' : 'text-gray-400'}`}>
                                {asset.hypeChange > 0 ? '+' : ''}{asset.hypeChange}%
                              </span>
                            </div>
                          </div>

                          {/* Signal Box */}
                          <div className={`p-3 rounded-lg ${signalStyle.bg} border ${signalStyle.border}`}>
                            <div className="flex items-start gap-2">
                              {signalStyle.icon}
                              <p className="text-sm text-foreground">{isArabic ? asset.signalAr : asset.signal}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedAsset ? (
              <div className="sticky top-24 space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {selectedAsset.icon}
                      </div>
                      <div>
                        <CardTitle className="text-foreground">{isArabic ? selectedAsset.nameAr : selectedAsset.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selectedAsset.symbol}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sentiment Analysis */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {isArabic ? 'تحليل المشاعر' : 'Sentiment Analysis'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{isArabic ? 'النقاط' : 'Score'}</span>
                          <span className="text-xl font-bold text-foreground">{selectedAsset.sentimentScore}%</span>
                        </div>
                        <Progress value={selectedAsset.sentimentScore} className="h-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{isArabic ? 'الاتجاه' : 'Trend'}</span>
                          <span className="flex items-center gap-1">
                            {getTrendIcon(selectedAsset.sentimentTrend)}
                            {getTrendLabel(selectedAsset.sentimentTrend, isArabic)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fear Analysis */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        {isArabic ? 'مؤشر الخوف' : 'Fear Index'}
                      </h4>
                      <div className={`p-3 rounded-lg ${selectedAsset.fearSpike >= 60 ? 'bg-red-500/10 border border-red-500/30' : 'bg-muted/50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={getFearLevel(selectedAsset.fearSpike, isArabic).color}>
                            {getFearLevel(selectedAsset.fearSpike, isArabic).label}
                          </span>
                          <span className="font-bold text-foreground">{selectedAsset.fearSpike}%</span>
                        </div>
                        <Progress value={selectedAsset.fearSpike} className="h-2" />
                        {selectedAsset.fearSpike >= 60 && (
                          <p className="text-xs text-red-400 mt-2">
                            {isArabic ? 'تحذير: مستوى الخوف مرتفع - احتمال تصحيح قادم' : 'Warning: High fear level - potential correction ahead'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Hype Analysis */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        {isArabic ? 'مؤشر التضخيم' : 'Hype Index'}
                      </h4>
                      <div className={`p-3 rounded-lg ${selectedAsset.hypeIndex >= 70 ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-muted/50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={getHypeLevel(selectedAsset.hypeIndex, isArabic).color}>
                            {getHypeLevel(selectedAsset.hypeIndex, isArabic).label}
                          </span>
                          <span className="font-bold text-foreground">{selectedAsset.hypeIndex}%</span>
                        </div>
                        <Progress value={selectedAsset.hypeIndex} className="h-2" />
                        {selectedAsset.hypeIndex >= 70 && (
                          <p className="text-xs text-purple-400 mt-2">
                            {isArabic ? 'تحذير: فقاعة نفسية محتملة - راقب التصحيح' : 'Warning: Potential psychological bubble - watch for correction'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Trader Insight */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        {isArabic ? 'رؤية المتداول' : 'Trader Insight'}
                      </h4>
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-foreground">
                          {isArabic ? selectedAsset.signalAr : selectedAsset.signal}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                        <Bell className="w-4 h-4 ml-2" />
                        {isArabic ? 'تنبيه' : 'Alert'}
                      </Button>
                      <Button variant="outline">
                        <LineChart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-bold text-foreground mb-2">{isArabic ? 'اختر أصل' : 'Select an Asset'}</h3>
                  <p className="text-muted-foreground">
                    {isArabic ? 'اضغط على أي أصل لعرض التحليل المفصل' : 'Click any asset to view detailed analysis'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Asset Comparison Table */}
        <Card className="bg-card border-border mb-12">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isArabic ? 'مقارنة الأصول' : 'Asset Comparison'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right p-3 text-muted-foreground font-medium">{isArabic ? 'الأصل' : 'Asset'}</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">{isArabic ? 'المشاعر' : 'Sentiment'}</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">{isArabic ? 'الخوف' : 'Fear'}</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">{isArabic ? 'التضخيم' : 'Hype'}</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">{isArabic ? 'الاتجاه' : 'Momentum'}</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">{isArabic ? 'الإشارة' : 'Signal'}</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKET_ASSETS.map(asset => (
                    <tr key={asset.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {asset.icon}
                          <span className="font-medium text-foreground">{isArabic ? asset.nameAr : asset.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className={`font-bold ${asset.sentimentScore > 60 ? 'text-green-400' : asset.sentimentScore < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {asset.sentimentScore}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className={getFearLevel(asset.fearSpike, isArabic).color}>
                          {asset.fearSpike}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className={getHypeLevel(asset.hypeIndex, isArabic).color}>
                          {asset.hypeIndex}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <Badge className={getMomentumColor(asset.momentum)}>
                          {getMomentumLabel(asset.momentum, isArabic)}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        {getSignalStyle(asset.signalType).icon}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            {isArabic ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free */}
            <Card className="bg-card border-border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Free</h3>
                <p className="text-3xl font-bold text-foreground">$0</p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'مجاني للأبد' : 'Forever free'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'إشارات عامة' : 'General signals'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
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
            <Card className="bg-card border-border p-6 ring-2 ring-green-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Pro Trader</h3>
                <p className="text-3xl font-bold text-foreground">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'للمتداولين الأفراد' : 'For individual traders'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'جميع الأصول' : 'All assets'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تحديث كل 5 دقائق' : '5-min updates'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تنبيهات فورية' : 'Instant alerts'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تقارير PDF' : 'PDF reports'}
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                {isArabic ? 'اشترك الآن' : 'Subscribe Now'}
              </Button>
            </Card>

            {/* Fund */}
            <Card className="bg-card border-border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Fund</h3>
                <p className="text-3xl font-bold text-foreground">$199<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'للصناديق والمؤسسات' : 'For funds & institutions'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'كل مميزات Pro' : 'All Pro features'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'بيانات تاريخية' : 'Historical data'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تحليل مخصص' : 'Custom analysis'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'دعم مخصص' : 'Priority support'}
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {isArabic ? 'تواصل معنا' : 'Contact Sales'}
              </Button>
            </Card>

            {/* API */}
            <Card className="bg-card border-border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">API</h3>
                <p className="text-3xl font-bold text-foreground">{isArabic ? 'مخصص' : 'Custom'}</p>
                <p className="text-xs text-muted-foreground">{isArabic ? 'حسب الاستخدام' : 'Usage-based pricing'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'REST API كامل' : 'Full REST API'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  Webhooks
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'بيانات خام' : 'Raw data access'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
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
        <Card className="bg-yellow-500/5 border-yellow-500/30 p-6">
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
            © 2026 AmalSense Markets. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
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
