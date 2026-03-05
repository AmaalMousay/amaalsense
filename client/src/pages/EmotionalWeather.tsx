import React, { useMemo } from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

export default function EmotionalWeather() {
  const { language } = useI18n();
  const [, navigate] = useLocation();
  const isAr = language === 'ar';

  // Fetch data from Unified Engine
  const { data: countries, isLoading, error } = trpc.engine.getMapData.useQuery();

  // Compute global mood from real country data
  const globalStats = useMemo(() => {
    if (!countries || countries.length === 0) return null;
    
    const realCountries = countries.filter((c: any) => c.isRealData);
    if (realCountries.length === 0) return null;

    const avgGmi = Math.round(realCountries.reduce((s: number, c: any) => s + c.gmi, 0) / realCountries.length);
    const avgCfi = Math.round(realCountries.reduce((s: number, c: any) => s + c.cfi, 0) / realCountries.length);
    const avgHri = Math.round(realCountries.reduce((s: number, c: any) => s + c.hri, 0) / realCountries.length);

    // Count emotions
    const emotionCounts: Record<string, number> = {};
    realCountries.forEach((c: any) => {
      emotionCounts[c.dominantEmotion] = (emotionCounts[c.dominantEmotion] || 0) + 1;
    });

    const emotionNames: Record<string, { ar: string; en: string; color: string }> = {
      fear: { ar: 'خوف', en: 'Fear', color: '#F4A261' },
      hope: { ar: 'أمل', en: 'Hope', color: '#2A9D8F' },
      anger: { ar: 'غضب', en: 'Anger', color: '#E63946' },
      sadness: { ar: 'حزن', en: 'Sadness', color: '#8D5CF6' },
      joy: { ar: 'فرح', en: 'Joy', color: '#06D6A0' },
      curiosity: { ar: 'فضول', en: 'Curiosity', color: '#E9C46A' },
      neutral: { ar: 'محايد', en: 'Neutral', color: '#94A3B8' },
    };

    const emotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        name: isAr ? (emotionNames[emotion]?.ar || emotion) : (emotionNames[emotion]?.en || emotion),
        value: Math.round((count / realCountries.length) * 100),
        color: emotionNames[emotion]?.color || '#94A3B8',
      }))
      .sort((a, b) => b.value - a.value);

    // Top concerned countries (highest CFI)
    const topConcerned = [...realCountries]
      .sort((a: any, b: any) => b.cfi - a.cfi)
      .slice(0, 5);

    // Most hopeful countries (highest HRI)
    const topHopeful = [...realCountries]
      .sort((a: any, b: any) => b.hri - a.hri)
      .slice(0, 5);

    // Mood index (0-100 scale, 50 = neutral)
    const moodIndex = Math.round((avgGmi + 100) / 2);

    // Stability: how much variance in GMI across countries (less variance = more stable)
    const variance = realCountries.reduce((s: number, c: any) => s + Math.pow(c.gmi - avgGmi, 2), 0) / realCountries.length;
    const stabilityIndex = Math.max(10, Math.min(95, Math.round(100 - Math.sqrt(variance))));

    return {
      avgGmi,
      avgCfi,
      avgHri,
      moodIndex,
      stabilityIndex,
      emotions,
      topConcerned,
      topHopeful,
      totalCountries: countries.length,
      realCountries: realCountries.length,
    };
  }, [countries, isAr]);

  const getMoodColor = (index: number) => {
    if (index > 70) return '#2A9D8F';
    if (index > 50) return '#E9C46A';
    if (index > 30) return '#F4A261';
    return '#E63946';
  };

  const getMoodText = (index: number) => {
    if (index > 70) return isAr ? 'متفائل' : 'Optimistic';
    if (index > 50) return isAr ? 'معتدل' : 'Moderate';
    if (index > 30) return isAr ? 'قلق' : 'Concerned';
    return isAr ? 'قلق عالي' : 'High Concern';
  };

  const getMoodEmoji = (index: number) => {
    if (index > 70) return '☀️';
    if (index > 50) return '⛅';
    if (index > 30) return '🌥️';
    return '🌧️';
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isAr ? 'rtl' : 'ltr'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-700 rounded w-1/3"></div>
            <div className="h-48 bg-slate-700 rounded"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64 bg-slate-700 rounded"></div>
              <div className="h-64 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !globalStats) {
    return (
      <div className={`min-h-screen ${isAr ? 'rtl' : 'ltr'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 flex items-center justify-center`}>
        <Card className="bg-slate-800 border-slate-600 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">
            {isAr ? 'تعذر تحميل البيانات' : 'Failed to load data'}
          </h2>
          <p className="text-slate-400 mb-4">
            {isAr ? 'يرجى المحاولة مرة أخرى لاحقاً' : 'Please try again later'}
          </p>
          <Button onClick={() => window.location.reload()}>
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isAr ? 'rtl' : 'ltr'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {getMoodEmoji(globalStats.moodIndex)} {isAr ? 'الطقس العاطفي العالمي' : 'Global Emotional Weather'}
            </h1>
            <p className="text-slate-400">
              {isAr 
                ? `بيانات حقيقية من ${globalStats.realCountries} دولة - آخر تحديث الآن`
                : `Real data from ${globalStats.realCountries} countries - updated now`}
            </p>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => navigate('/')}>
            {isAr ? '← العودة' : '← Back'}
          </Button>
        </div>

        {/* Main Mood Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 mb-6 p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              {isAr ? 'المزاج العالمي الآن' : 'Current Global Mood'}
            </h2>
            <span className="text-5xl">{getMoodEmoji(globalStats.moodIndex)}</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-5xl font-bold mb-2" style={{ color: getMoodColor(globalStats.moodIndex) }}>
                {getMoodText(globalStats.moodIndex)}
              </div>
              <div className="text-slate-400 text-lg mt-2">
                {isAr ? 'مؤشر المزاج العام: ' : 'Global Mood Index: '} 
                <span className="text-white font-bold">{globalStats.avgGmi}</span>
                <span className="text-slate-500"> (-100 {isAr ? 'إلى' : 'to'} +100)</span>
              </div>
              <div className="flex gap-6 mt-4">
                <div>
                  <span className="text-red-400 text-sm">{isAr ? 'مؤشر الخوف' : 'Fear Index'}</span>
                  <div className="text-white font-bold text-xl">{globalStats.avgCfi}%</div>
                </div>
                <div>
                  <span className="text-green-400 text-sm">{isAr ? 'مؤشر الأمل' : 'Hope Index'}</span>
                  <div className="text-white font-bold text-xl">{globalStats.avgHri}%</div>
                </div>
              </div>
            </div>
            
            {/* Visual Gauge */}
            <div className="w-36 h-36 rounded-full border-8 flex items-center justify-center" style={{ borderColor: getMoodColor(globalStats.moodIndex) }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{globalStats.moodIndex}</div>
                <div className="text-xs text-slate-400">/100</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Emotion Distribution - REAL DATA */}
          <Card className="bg-slate-800 border-slate-600 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {isAr ? 'توزيع المشاعر العالمية' : 'Global Emotion Distribution'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={globalStats.emotions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {globalStats.emotions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Concerned Countries - REAL DATA */}
          <Card className="bg-slate-800 border-slate-600 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {isAr ? '🔴 أكثر الدول قلقاً' : '🔴 Most Concerned Countries'}
            </h3>
            <div className="space-y-3">
              {globalStats.topConcerned.map((country: any, idx: number) => (
                <div 
                  key={country.countryCode} 
                  className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => navigate(`/country/${country.countryCode}`)}
                >
                  <span className="text-lg font-bold text-slate-400 w-6">{idx + 1}</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">
                      {isAr ? (country.nameAr || country.countryName) : country.countryName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">{country.cfi}%</div>
                    <div className="text-xs text-slate-500">{isAr ? 'مؤشر الخوف' : 'Fear'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Most Hopeful Countries */}
        <Card className="bg-slate-800 border-slate-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {isAr ? '🟢 أكثر الدول تفاؤلاً' : '🟢 Most Hopeful Countries'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={globalStats.topHopeful.map((c: any) => ({
              name: isAr ? (c.nameAr || c.countryName) : c.countryName,
              hri: c.hri,
              code: c.countryCode,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94A3B8' }} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="hri" fill="#2A9D8F" radius={[4, 4, 0, 0]} name={isAr ? 'مؤشر الأمل' : 'Hope Index'} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Stability Indicator - REAL DATA */}
        <Card className="bg-slate-800 border-slate-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {isAr ? 'مؤشر الاستقرار العاطفي' : 'Emotional Stability Index'}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className="h-4 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${globalStats.stabilityIndex}%`,
                    backgroundColor: globalStats.stabilityIndex > 60 ? '#2A9D8F' : globalStats.stabilityIndex > 40 ? '#E9C46A' : '#E63946'
                  }}
                ></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{globalStats.stabilityIndex}%</div>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            {isAr 
              ? `يقيس مدى تقارب المشاعر بين ${globalStats.realCountries} دولة. كلما ارتفع المؤشر، كان المزاج العالمي أكثر استقراراً.`
              : `Measures emotional convergence across ${globalStats.realCountries} countries. Higher values indicate more stable global mood.`
            }
          </p>
        </Card>

        {/* Data Source Badge */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700/50 flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            {isAr
              ? `📡 بيانات حقيقية من ${globalStats.realCountries} دولة عبر Google News و NewsAPI - تحليل المشاعر بالذكاء الاصطناعي`
              : `📡 Real data from ${globalStats.realCountries} countries via Google News & NewsAPI - AI sentiment analysis`
            }
          </p>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
            {isAr ? 'بيانات حقيقية' : 'REAL DATA'}
          </span>
        </div>
      </div>
    </div>
  );
}
