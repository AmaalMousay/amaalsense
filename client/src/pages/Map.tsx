import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WorldMap } from '@/components/WorldMap';
import { IndexCard } from '@/components/IndexCard';
import { CountryHistoricalChart } from '@/components/CountryHistoricalChart';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, Globe } from 'lucide-react';
import { useI18n } from '@/i18n';

interface CountryEmotionData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

interface HistoricalDataPoint {
  timestamp: Date;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

export default function Map() {
  const [, navigate] = useLocation();
  const { t, language, isRTL } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countriesData, setCountriesData] = useState<CountryEmotionData[]>([]);
  const [selectedCountryData, setSelectedCountryData] = useState<CountryEmotionData | null>(null);
  const [timeRange, setTimeRange] = useState<number>(24);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  // Fetch all countries emotion data
  const { data: allCountriesData, isLoading } = trpc.map.getAllCountriesEmotions.useQuery();

  // Fetch specific country data when selected
  const { data: countryData } = trpc.map.getCountryEmotions.useQuery(
    { countryCode: selectedCountry || 'SA' },
    { enabled: !!selectedCountry }
  );

  // Fetch historical data for selected country
  const { data: historicalCountryData, isLoading: isLoadingHistorical } = trpc.map.getCountryHistoricalData.useQuery(
    { countryCode: selectedCountry || 'SA', hoursBack: timeRange },
    { enabled: !!selectedCountry }
  );

  useEffect(() => {
    if (allCountriesData) {
      setCountriesData(allCountriesData);
      if (!selectedCountry && allCountriesData.length > 0) {
        setSelectedCountry(allCountriesData[0].countryCode);
      }
    }
  }, [allCountriesData, selectedCountry]);

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

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleTimeRangeChange = (hours: number) => {
    setTimeRange(hours);
  };

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
            <h1 className="text-2xl font-bold gradient-text">{t.map.title}</h1>
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

          {/* World Map */}
          {isLoading ? (
            <Card className="cosmic-card p-8 text-center">
              <p className="text-muted-foreground">{t.common.loading}...</p>
            </Card>
          ) : (
            <WorldMap
              countriesData={countriesData}
              selectedCountry={selectedCountry || undefined}
              onCountrySelect={handleCountrySelect}
            />
          )}

          {/* Selected Country Details */}
          {selectedCountryData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold cosmic-text mb-4">
                  {isRTL ? `الملف العاطفي لـ ${selectedCountryData.countryName}` : `${selectedCountryData.countryName} Emotion Profile`}
                </h2>

                {/* Indices Cards */}
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

              {/* Historical Chart */}
              {isLoadingHistorical ? (
                <Card className="cosmic-card p-8 text-center">
                  <p className="text-muted-foreground">{t.common.loading}...</p>
                </Card>
              ) : historicalData.length > 0 ? (
                <CountryHistoricalChart
                  countryName={selectedCountryData.countryName}
                  data={historicalData}
                  chartType="area"
                />
              ) : null}

              {/* Country Statistics */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4">
                  {isRTL ? 'تحليل الحالة العاطفية' : 'Emotional State Analysis'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isRTL ? 'المشاعر العامة' : 'Overall Sentiment'}
                    </p>
                    <p className="text-lg font-semibold cosmic-text">
                      {selectedCountryData.gmi > 30
                        ? isRTL ? '📈 متفائل' : '📈 Optimistic'
                        : selectedCountryData.gmi < -30
                        ? isRTL ? '📉 متشائم' : '📉 Pessimistic'
                        : isRTL ? '➡️ محايد' : '➡️ Neutral'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isRTL ? 'مستوى الخوف' : 'Fear Level'}
                    </p>
                    <p className="text-lg font-semibold cosmic-text">
                      {selectedCountryData.cfi > 60
                        ? isRTL ? '😰 مرتفع' : '😰 High'
                        : selectedCountryData.cfi < 30
                        ? isRTL ? '😊 منخفض' : '😊 Low'
                        : isRTL ? '😐 معتدل' : '😐 Moderate'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isRTL ? 'الأمل والمرونة' : 'Hope & Resilience'}
                    </p>
                    <p className="text-lg font-semibold cosmic-text">
                      {selectedCountryData.hri > 60
                        ? isRTL ? '🌟 قوي' : '🌟 Strong'
                        : selectedCountryData.hri < 30
                        ? isRTL ? '💔 ضعيف' : '💔 Weak'
                        : isRTL ? '⚖️ معتدل' : '⚖️ Moderate'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isRTL ? 'دقة التحليل' : 'Analysis Confidence'}
                    </p>
                    <p className="text-lg font-semibold cosmic-text">{selectedCountryData.confidence}%</p>
                  </div>
                </div>
              </Card>

              {/* Interpretation */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4">
                  {isRTL ? 'التفسير' : 'Interpretation'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isRTL ? (
                    <>
                      تشهد {selectedCountryData.countryName} حالياً{' '}
                      <span className="text-accent font-semibold">
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
                      .
                    </>
                  ) : (
                    <>
                      {selectedCountryData.countryName} is currently experiencing{' '}
                      <span className="text-accent font-semibold">
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
                      .
                    </>
                  )}
                </p>
              </Card>
            </div>
          )}

          {/* Countries List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold cosmic-text">
              {isRTL ? 'جميع الدول' : 'All Countries'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {countriesData.map((country) => (
                <Button
                  key={country.countryCode}
                  onClick={() => handleCountrySelect(country.countryCode)}
                  variant={selectedCountry === country.countryCode ? 'default' : 'outline'}
                  className={
                    selectedCountry === country.countryCode
                      ? 'glow-button text-white'
                      : 'text-xs'
                  }
                >
                  {country.countryCode}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
