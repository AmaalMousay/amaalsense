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
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">Global Emotion Map</h1>
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
              <p className="text-muted-foreground">Loading world emotion map...</p>
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
                  {selectedCountryData.countryName} Emotion Profile
                </h2>

                {/* Indices Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <IndexCard
                    title="Global Mood Index"
                    value={selectedCountryData.gmi}
                    min={-100}
                    max={100}
                    unit=""
                    description="Overall sentiment"
                    indexType="gmi"
                  />
                  <IndexCard
                    title="Collective Fear Index"
                    value={selectedCountryData.cfi}
                    min={0}
                    max={100}
                    unit=""
                    description="Anxiety level"
                    indexType="cfi"
                  />
                  <IndexCard
                    title="Hope Resilience Index"
                    value={selectedCountryData.hri}
                    min={0}
                    max={100}
                    unit=""
                    description="Optimism level"
                    indexType="hri"
                  />
                </div>
              </div>

              {/* Historical Chart */}
              {isLoadingHistorical ? (
                <Card className="cosmic-card p-8 text-center">
                  <p className="text-muted-foreground">Loading historical data...</p>
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
                <h3 className="text-lg font-bold cosmic-text mb-4">Emotional State Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Overall Sentiment</p>
                    <p className="text-lg font-semibold cosmic-text">
                      {selectedCountryData.gmi > 30
                        ? '📈 Optimistic'
                        : selectedCountryData.gmi < -30
                        ? '📉 Pessimistic'
                        : '➡️ Neutral'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Fear Level</p>
                    <p className="text-lg font-semibold cosmic-text">
                      {selectedCountryData.cfi > 60
                        ? '😰 High'
                        : selectedCountryData.cfi < 30
                        ? '😊 Low'
                        : '😐 Moderate'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Hope & Resilience</p>
                    <p className="text-lg font-semibold cosmic-text">
                      {selectedCountryData.hri > 60
                        ? '🌟 Strong'
                        : selectedCountryData.hri < 30
                        ? '💔 Weak'
                        : '⚖️ Moderate'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Analysis Confidence</p>
                    <p className="text-lg font-semibold cosmic-text">{selectedCountryData.confidence}%</p>
                  </div>
                </div>
              </Card>

              {/* Interpretation */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4">Interpretation</h3>
                <p className="text-muted-foreground leading-relaxed">
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
                </p>
              </Card>
            </div>
          )}

          {/* Countries List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold cosmic-text">All Countries</h3>
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
