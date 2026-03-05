/**
 * Emotional Weather Page (Detailed View)
 * 
 * Displays global emotional climate using REAL data from country analysis:
 * - Current conditions computed from real news sentiment
 * - Country breakdown with real fear/hope indices
 * - Risk assessment based on actual data
 */

import { useMemo } from 'react';
import { useI18n } from '@/i18n';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Weather() {
  const { t, language } = useI18n();
  const [, navigate] = useLocation();
  const isAr = language === 'ar';

  // Fetch REAL data from all countries
  const { data: countries, isLoading, error } = trpc.map.getAllCountriesEmotions.useQuery();

  // Compute weather from real data
  const weatherData = useMemo(() => {
    if (!countries || countries.length === 0) return null;
    
    const real = countries.filter((c: any) => c.isRealData);
    if (real.length === 0) return null;

    const avgGmi = Math.round(real.reduce((s: number, c: any) => s + c.gmi, 0) / real.length);
    const avgCfi = Math.round(real.reduce((s: number, c: any) => s + c.cfi, 0) / real.length);
    const avgHri = Math.round(real.reduce((s: number, c: any) => s + c.hri, 0) / real.length);
    
    // Determine condition from real data
    const hopeLevel = Math.round((avgGmi + 100) / 2);
    const condition = hopeLevel > 65 ? 'sunny' as const : hopeLevel > 50 ? 'cloudy' as const : hopeLevel > 35 ? 'rainy' as const : 'stormy' as const;
    
    // Risk level from real data
    const riskLevel = avgCfi > 70 ? 'critical' as const : avgCfi > 50 ? 'high' as const : avgCfi > 30 ? 'moderate' as const : 'low' as const;
    
    // Stability from variance
    const variance = real.reduce((s: number, c: any) => s + Math.pow(c.gmi - avgGmi, 2), 0) / real.length;
    const stability = Math.max(10, Math.min(95, Math.round(100 - Math.sqrt(variance))));

    // Sort countries by different metrics
    const mostFearful = [...real].sort((a: any, b: any) => b.cfi - a.cfi).slice(0, 6);
    const mostHopeful = [...real].sort((a: any, b: any) => b.hri - a.hri).slice(0, 6);
    const mostNegative = [...real].sort((a: any, b: any) => a.gmi - b.gmi).slice(0, 6);

    return {
      hope: hopeLevel,
      fear: avgCfi,
      stability,
      condition,
      riskLevel,
      avgGmi,
      avgCfi,
      avgHri,
      mostFearful,
      mostHopeful,
      mostNegative,
      totalReal: real.length,
      totalCountries: countries.length,
    };
  }, [countries]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'stormy': return <AlertTriangle className="w-8 h-8 text-red-400" />;
      default: return <Cloud className="w-8 h-8" />;
    }
  };

  const getConditionText = (condition: string) => {
    const texts: Record<string, { ar: string; en: string }> = {
      sunny: { ar: 'مشمس - تفاؤل عالي', en: 'Sunny - High Optimism' },
      cloudy: { ar: 'غائم - قلق معتدل', en: 'Cloudy - Moderate Concern' },
      rainy: { ar: 'ماطر - قلق متزايد', en: 'Rainy - Rising Concern' },
      stormy: { ar: 'عاصف - قلق عالي', en: 'Stormy - High Concern' },
    };
    return isAr ? texts[condition]?.ar || condition : texts[condition]?.en || condition;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskText = (level: string) => {
    const texts: Record<string, { ar: string; en: string }> = {
      low: { ar: 'منخفض', en: 'Low' },
      moderate: { ar: 'متوسط', en: 'Moderate' },
      high: { ar: 'مرتفع', en: 'High' },
      critical: { ar: 'حرج', en: 'Critical' },
    };
    return isAr ? texts[level]?.ar || level : texts[level]?.en || level;
  };

  const getRecommendation = () => {
    if (!weatherData) return '';
    if (weatherData.riskLevel === 'low') return isAr ? 'المزاج العالمي إيجابي. وقت مناسب للمبادرات والمشاريع.' : 'Positive global sentiment. Good time for initiatives.';
    if (weatherData.riskLevel === 'moderate') return isAr ? 'قلق معتدل في بعض المناطق. يُنصح بمراقبة التطورات.' : 'Moderate concern in some regions. Monitor developments.';
    if (weatherData.riskLevel === 'high') return isAr ? 'مستوى قلق مرتفع. يُنصح بالحذر ومتابعة الأخبار.' : 'High concern level. Exercise caution and follow news.';
    return isAr ? 'وضع حرج. قلق عالمي واسع النطاق.' : 'Critical situation. Widespread global concern.';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">{isAr ? 'جاري تحليل المشاعر العالمية...' : 'Analyzing global sentiment...'}</p>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="bg-slate-800 border-slate-600 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">{isAr ? 'تعذر تحميل البيانات' : 'Failed to load data'}</h2>
          <Button onClick={() => window.location.reload()} className="mt-4">{isAr ? 'إعادة المحاولة' : 'Retry'}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 ${isAr ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t.weather?.title || (isAr ? '🌦️ الطقس العاطفي' : '🌦️ Emotional Weather')}</h1>
            <p className="text-slate-400">
              {isAr 
                ? `بيانات حقيقية من ${weatherData.totalReal} دولة`
                : `Real data from ${weatherData.totalReal} countries`}
            </p>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => navigate('/')}>
            {isAr ? '← العودة' : '← Back'}
          </Button>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="current">{t.weather?.currentConditions || (isAr ? 'الحالة الحالية' : 'Current')}</TabsTrigger>
            <TabsTrigger value="countries">{isAr ? 'تفاصيل الدول' : 'Countries'}</TabsTrigger>
            <TabsTrigger value="alerts">{t.weather?.alerts || (isAr ? 'التنبيهات' : 'Alerts')}</TabsTrigger>
          </TabsList>

          {/* Current Conditions - REAL DATA */}
          <TabsContent value="current" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  {getWeatherIcon(weatherData.condition)}
                  <span>{getConditionText(weatherData.condition)}</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {new Date().toLocaleDateString(isAr ? 'ar-LY' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Indicators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{t.weather?.hopeLevel || (isAr ? 'مستوى الأمل' : 'Hope Level')}</span>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{weatherData.hope}%</div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: `${weatherData.hope}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{t.weather?.fearLevel || (isAr ? 'مستوى الخوف' : 'Fear Level')}</span>
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{weatherData.fear}%</div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-400 to-rose-500 h-2 rounded-full" style={{ width: `${weatherData.fear}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{t.weather?.stabilityIndex || (isAr ? 'مؤشر الاستقرار' : 'Stability')}</span>
                      <Wind className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{weatherData.stability}%</div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full" style={{ width: `${weatherData.stability}%` }} />
                    </div>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300 font-medium">{t.weather?.riskLevel || (isAr ? 'مستوى المخاطر' : 'Risk Level')}</span>
                    <Badge className={getRiskColor(weatherData.riskLevel)}>{getRiskText(weatherData.riskLevel)}</Badge>
                  </div>
                  <p className="text-slate-300">{getRecommendation()}</p>
                </div>

                {/* Real Data Badge */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                  <h3 className="text-lg font-semibold text-white mb-2">{isAr ? 'تحليل حقيقي' : 'Real Analysis'}</h3>
                  <p className="text-slate-300">
                    {isAr 
                      ? `تم تحليل أخبار ${weatherData.totalReal} دولة عبر Google News و NewsAPI. مؤشر المزاج العام: ${weatherData.avgGmi} (من -100 إلى +100).`
                      : `Analyzed news from ${weatherData.totalReal} countries via Google News & NewsAPI. Global Mood Index: ${weatherData.avgGmi} (-100 to +100).`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countries Breakdown - REAL DATA */}
          <TabsContent value="countries" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Fearful */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-red-400">{isAr ? '🔴 أكثر الدول قلقاً' : '🔴 Most Concerned'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weatherData.mostFearful.map((c: any, i: number) => (
                    <div 
                      key={c.countryCode}
                      className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-600/50 transition-colors"
                      onClick={() => navigate(`/country/${c.countryCode}`)}
                    >
                      <span className="text-lg font-bold text-slate-500 w-6">{i + 1}</span>
                      <div className="flex-1">
                        <span className="text-white">{isAr ? (c.nameAr || c.countryName) : c.countryName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-red-400 font-bold">{c.cfi}%</div>
                        <div className="text-xs text-slate-500">{isAr ? 'خوف' : 'Fear'}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Most Hopeful */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400">{isAr ? '🟢 أكثر الدول تفاؤلاً' : '🟢 Most Hopeful'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weatherData.mostHopeful.map((c: any, i: number) => (
                    <div 
                      key={c.countryCode}
                      className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-600/50 transition-colors"
                      onClick={() => navigate(`/country/${c.countryCode}`)}
                    >
                      <span className="text-lg font-bold text-slate-500 w-6">{i + 1}</span>
                      <div className="flex-1">
                        <span className="text-white">{isAr ? (c.nameAr || c.countryName) : c.countryName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{c.hri}%</div>
                        <div className="text-xs text-slate-500">{isAr ? 'أمل' : 'Hope'}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts - REAL DATA */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{isAr ? 'تنبيهات المشاعر' : 'Sentiment Alerts'}</CardTitle>
                <CardDescription className="text-slate-400">
                  {isAr ? 'الدول ذات أعلى مؤشر سلبي' : 'Countries with highest negative sentiment'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {weatherData.mostNegative.map((c: any) => (
                  <div 
                    key={c.countryCode}
                    className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-600/50 transition-colors"
                    onClick={() => navigate(`/country/${c.countryCode}`)}
                  >
                    <AlertTriangle className={`w-6 h-6 ${c.gmi < -20 ? 'text-red-400' : c.gmi < -10 ? 'text-orange-400' : 'text-yellow-400'}`} />
                    <div className="flex-1">
                      <div className="text-white font-medium">{isAr ? (c.nameAr || c.countryName) : c.countryName}</div>
                      <div className="text-sm text-slate-400">
                        {isAr ? `مؤشر المزاج: ${c.gmi}` : `Mood Index: ${c.gmi}`} | {isAr ? `المشاعر: ${c.dominantEmotion}` : `Emotion: ${c.dominantEmotion}`}
                      </div>
                    </div>
                    <Badge className={getRiskColor(c.cfi > 50 ? 'high' : c.cfi > 30 ? 'moderate' : 'low')}>
                      {c.cfi > 50 ? (isAr ? 'مرتفع' : 'High') : c.cfi > 30 ? (isAr ? 'متوسط' : 'Moderate') : (isAr ? 'منخفض' : 'Low')}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data Source */}
            <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700/50 flex items-center justify-between">
              <p className="text-slate-300 text-sm">
                {isAr
                  ? `📡 بيانات حقيقية من ${weatherData.totalReal} دولة - تحليل مشاعر بالذكاء الاصطناعي`
                  : `📡 Real data from ${weatherData.totalReal} countries - AI sentiment analysis`}
              </p>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                {isAr ? 'بيانات حقيقية' : 'REAL DATA'}
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
