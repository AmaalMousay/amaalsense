import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { IndexCard } from '@/components/IndexCard';
import { CountryHistoricalChart } from '@/components/CountryHistoricalChart';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { trpc } from '@/lib/trpc';
import { useLocation, useSearch } from 'wouter';
import { ArrowLeft, Globe, TrendingUp, TrendingDown, Minus, AlertTriangle, Heart, Shield, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n';
import { DataSourcesFooter } from '@/components/DataSourcesFooter';
import { Progress } from '@/components/ui/progress';

interface CountryEmotionData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
  mood?: string;
  moodAr?: string;
  moodColor?: string;
  dominantEmotion?: string;
  dataPoints?: number;
  lastUpdated?: Date;
}

interface HistoricalDataPoint {
  timestamp: Date;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

// Emotion percentages based on indices
function calculateEmotions(gmi: number, cfi: number, hri: number) {
  const total = 100;
  let hope = Math.max(0, Math.min(100, hri * 0.7 + (gmi > 0 ? gmi * 0.3 : 0)));
  let fear = Math.max(0, Math.min(100, cfi * 0.8));
  let anger = Math.max(0, Math.min(100, (gmi < -30 ? Math.abs(gmi) * 0.5 : 0) + (cfi > 50 ? (cfi - 50) * 0.3 : 0)));
  let sadness = Math.max(0, Math.min(100, (gmi < 0 ? Math.abs(gmi) * 0.4 : 0) + (hri < 40 ? (40 - hri) * 0.3 : 0)));
  let calm = Math.max(0, Math.min(100, (100 - cfi) * 0.5 + (gmi > 0 ? gmi * 0.2 : 0)));
  let curiosity = Math.max(0, Math.min(100, 50 - Math.abs(gmi) * 0.3 + hri * 0.2));
  
  // Normalize to 100%
  const sum = hope + fear + anger + sadness + calm + curiosity;
  if (sum > 0) {
    hope = (hope / sum) * total;
    fear = (fear / sum) * total;
    anger = (anger / sum) * total;
    sadness = (sadness / sum) * total;
    calm = (calm / sum) * total;
    curiosity = (curiosity / sum) * total;
  }
  
  return { hope, fear, anger, sadness, calm, curiosity };
}

export default function Map() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { t, isRTL } = useI18n();
  const [selectedCountryData, setSelectedCountryData] = useState<CountryEmotionData | null>(null);
  const [timeRange, setTimeRange] = useState<number>(24);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  // Parse URL parameters
  const params = new URLSearchParams(searchString);
  const countryCode = params.get('country') || 'LY';
  const countryName = params.get('name') || 'Libya';

  // Fetch specific country data
  const { data: countryData, isLoading } = trpc.map.getCountryEmotions.useQuery(
    { countryCode },
    { enabled: !!countryCode }
  );

  // Fetch historical data for selected country
  const { data: historicalCountryData, isLoading: isLoadingHistorical } = trpc.map.getCountryHistoricalData.useQuery(
    { countryCode, hoursBack: timeRange },
    { enabled: !!countryCode }
  );

  useEffect(() => {
    if (countryData) {
      setSelectedCountryData(countryData);
    }
  }, [countryData]);

  useEffect(() => {
    if (historicalCountryData) {
      setHistoricalData(
        historicalCountryData.map((d: any) => ({
          timestamp: new Date(d.timestamp),
          gmi: d.gmi,
          cfi: d.cfi,
          hri: d.hri,
          confidence: d.confidence,
        }))
      );
    }
  }, [historicalCountryData]);

  const handleTimeRangeChange = (hours: number) => {
    setTimeRange(hours);
  };

  // Calculate emotions
  const emotions = selectedCountryData 
    ? calculateEmotions(selectedCountryData.gmi, selectedCountryData.cfi, selectedCountryData.hri)
    : { hope: 0, fear: 0, anger: 0, sadness: 0, calm: 0, curiosity: 0 };

  const emotionsList = [
    { name: isRTL ? 'الأمل' : 'Hope', nameEn: 'Hope', value: emotions.hope, color: '#2A9D8F', icon: '🌟' },
    { name: isRTL ? 'الخوف' : 'Fear', nameEn: 'Fear', value: emotions.fear, color: '#F4A261', icon: '😰' },
    { name: isRTL ? 'الغضب' : 'Anger', nameEn: 'Anger', value: emotions.anger, color: '#E63946', icon: '😠' },
    { name: isRTL ? 'الحزن' : 'Sadness', nameEn: 'Sadness', value: emotions.sadness, color: '#8D5CF6', icon: '😢' },
    { name: isRTL ? 'الهدوء' : 'Calm', nameEn: 'Calm', value: emotions.calm, color: '#457B9D', icon: '😌' },
    { name: isRTL ? 'الفضول' : 'Curiosity', nameEn: 'Curiosity', value: emotions.curiosity, color: '#E9C46A', icon: '🤔' },
  ].sort((a, b) => b.value - a.value);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{isRTL ? 'جاري تحميل البيانات...' : 'Loading data...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t.common.back}</span>
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">
              {isRTL ? `تحليل ${countryName}` : `${countryName} Analysis`}
            </h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container space-y-8">
          {/* Time Range Selector */}
          <TimeRangeSelector
            selectedRange={timeRange}
            onRangeChange={handleTimeRangeChange}
            isLoading={isLoadingHistorical}
          />

          {/* Country Header with Mood */}
          {selectedCountryData && (
            <>
              {/* Mood Banner */}
              <Card className="cosmic-card p-6" style={{ borderColor: selectedCountryData.moodColor || '#8D5CF6' }}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold cosmic-text mb-2">{countryName}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{isRTL ? 'المزاج الحالي:' : 'Current Mood:'}</span>
                      <span className="text-2xl font-bold" style={{ color: selectedCountryData.moodColor || '#8D5CF6' }}>
                        {isRTL ? selectedCountryData.moodAr || 'محايد' : selectedCountryData.mood || 'Neutral'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'نقاط البيانات' : 'Data Points'}: {selectedCountryData.dataPoints || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'مستوى الثقة' : 'Confidence'}: {Math.round((selectedCountryData.confidence || 0) * 100)}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Main Indices */}
              <div>
                <h3 className="text-xl font-bold cosmic-text mb-4">
                  {isRTL ? 'المؤشرات الرئيسية' : 'Main Indices'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <IndexCard
                    title={t.indices.gmi}
                    value={selectedCountryData.gmi}
                    min={-100}
                    max={100}
                    unit=""
                    description={t.indices.gmiDesc}
                    indexType="gmi"
                  />
                  <IndexCard
                    title={t.indices.cfi}
                    value={selectedCountryData.cfi}
                    min={0}
                    max={100}
                    unit=""
                    description={t.indices.cfiDesc}
                    indexType="cfi"
                  />
                  <IndexCard
                    title={t.indices.hri}
                    value={selectedCountryData.hri}
                    min={0}
                    max={100}
                    unit=""
                    description={t.indices.hriDesc}
                    indexType="hri"
                  />
                </div>
              </div>

              {/* Emotion Percentages */}
              <Card className="cosmic-card p-6">
                <h3 className="text-xl font-bold cosmic-text mb-6">
                  {isRTL ? 'نسبة المشاعر' : 'Emotion Distribution'}
                </h3>
                <div className="space-y-4">
                  {emotionsList.map((emotion) => (
                    <div key={emotion.nameEn} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{emotion.icon}</span>
                          <span className="font-medium">{emotion.name}</span>
                        </div>
                        <span className="font-bold" style={{ color: emotion.color }}>
                          {emotion.value.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={emotion.value} 
                        className="h-3"
                        style={{ 
                          '--progress-background': emotion.color,
                        } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Emotional Profile */}
              <Card className="cosmic-card p-6">
                <h3 className="text-xl font-bold cosmic-text mb-4">
                  {isRTL ? 'الملف العاطفي' : 'Emotional Profile'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-3">
                    {selectedCountryData.gmi > 30 ? (
                      <TrendingUp className="w-8 h-8 text-green-500 mt-1" />
                    ) : selectedCountryData.gmi < -30 ? (
                      <TrendingDown className="w-8 h-8 text-red-500 mt-1" />
                    ) : (
                      <Minus className="w-8 h-8 text-yellow-500 mt-1" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isRTL ? 'المشاعر العامة' : 'Overall Sentiment'}
                      </p>
                      <p className="text-lg font-semibold cosmic-text">
                        {selectedCountryData.gmi > 30
                          ? isRTL ? 'متفائل' : 'Optimistic'
                          : selectedCountryData.gmi < -30
                          ? isRTL ? 'متشائم' : 'Pessimistic'
                          : isRTL ? 'محايد' : 'Neutral'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-8 h-8 mt-1 ${selectedCountryData.cfi > 60 ? 'text-red-500' : selectedCountryData.cfi < 30 ? 'text-green-500' : 'text-yellow-500'}`} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isRTL ? 'مستوى الخوف' : 'Fear Level'}
                      </p>
                      <p className="text-lg font-semibold cosmic-text">
                        {selectedCountryData.cfi > 60
                          ? isRTL ? 'مرتفع' : 'High'
                          : selectedCountryData.cfi < 30
                          ? isRTL ? 'منخفض' : 'Low'
                          : isRTL ? 'معتدل' : 'Moderate'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Heart className={`w-8 h-8 mt-1 ${selectedCountryData.hri > 60 ? 'text-green-500' : selectedCountryData.hri < 30 ? 'text-red-500' : 'text-yellow-500'}`} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isRTL ? 'الأمل والمرونة' : 'Hope & Resilience'}
                      </p>
                      <p className="text-lg font-semibold cosmic-text">
                        {selectedCountryData.hri > 60
                          ? isRTL ? 'قوي' : 'Strong'
                          : selectedCountryData.hri < 30
                          ? isRTL ? 'ضعيف' : 'Weak'
                          : isRTL ? 'معتدل' : 'Moderate'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-8 h-8 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {isRTL ? 'دقة التحليل' : 'Analysis Confidence'}
                      </p>
                      <p className="text-lg font-semibold cosmic-text">
                        {Math.round((selectedCountryData.confidence || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Historical Chart */}
              {isLoadingHistorical ? (
                <Card className="cosmic-card p-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.common.loading}...</span>
                  </div>
                </Card>
              ) : historicalData.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold cosmic-text mb-4">
                    {isRTL ? 'الاتجاهات التاريخية' : 'Historical Trends'}
                  </h3>
                  <CountryHistoricalChart
                    countryName={countryName}
                    data={historicalData}
                    chartType="area"
                  />
                </div>
              ) : null}

              {/* Interpretation */}
              <Card className="cosmic-card p-6">
                <h3 className="text-xl font-bold cosmic-text mb-4">
                  {isRTL ? 'التفسير' : 'Interpretation'}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {isRTL ? (
                    <>
                      تشهد <span className="text-accent font-semibold">{countryName}</span> حالياً{' '}
                      <span className="font-semibold" style={{ color: selectedCountryData.moodColor || '#8D5CF6' }}>
                        {selectedCountryData.gmi > 30
                          ? 'مناخاً عاطفياً إيجابياً'
                          : selectedCountryData.gmi < -30
                          ? 'ظروفاً عاطفية صعبة'
                          : 'حالة عاطفية متوازنة'}
                      </span>
                      . مؤشر الخوف الجماعي{' '}
                      <span className="text-cyan-400 font-semibold">
                        {selectedCountryData.cfi > 60
                          ? 'مرتفع'
                          : selectedCountryData.cfi < 30
                          ? 'منخفض'
                          : 'معتدل'}
                      </span>
                      ، بينما مستويات الأمل والمرونة{' '}
                      <span className="text-green-400 font-semibold">
                        {selectedCountryData.hri > 60
                          ? 'قوية'
                          : selectedCountryData.hri < 30
                          ? 'مقلقة'
                          : 'مستقرة'}
                      </span>
                      . المشاعر السائدة هي{' '}
                      <span className="font-semibold" style={{ color: emotionsList[0]?.color }}>
                        {emotionsList[0]?.name}
                      </span>
                      {' '}بنسبة {emotionsList[0]?.value.toFixed(1)}%.
                    </>
                  ) : (
                    <>
                      <span className="text-accent font-semibold">{countryName}</span> is currently experiencing{' '}
                      <span className="font-semibold" style={{ color: selectedCountryData.moodColor || '#8D5CF6' }}>
                        {selectedCountryData.gmi > 30
                          ? 'a positive emotional climate'
                          : selectedCountryData.gmi < -30
                          ? 'challenging emotional conditions'
                          : 'a balanced emotional state'}
                      </span>
                      . The collective fear index is{' '}
                      <span className="text-cyan-400 font-semibold">
                        {selectedCountryData.cfi > 60
                          ? 'elevated'
                          : selectedCountryData.cfi < 30
                          ? 'low'
                          : 'moderate'}
                      </span>
                      , while hope and resilience levels are{' '}
                      <span className="text-green-400 font-semibold">
                        {selectedCountryData.hri > 60
                          ? 'strong'
                          : selectedCountryData.hri < 30
                          ? 'concerning'
                          : 'stable'}
                      </span>
                      . The dominant emotion is{' '}
                      <span className="font-semibold" style={{ color: emotionsList[0]?.color }}>
                        {emotionsList[0]?.nameEn}
                      </span>
                      {' '}at {emotionsList[0]?.value.toFixed(1)}%.
                    </>
                  )}
                </p>
              </Card>

              {/* Data Sources */}
              <DataSourcesFooter compact />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
