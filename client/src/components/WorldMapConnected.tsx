// @ts-nocheck
/**
 * WORLD MAP - CONNECTED VERSION
 * 
 * يعرض خريطة العالم مع مؤشرات GMI/CFI/HRI الحقيقية
 * - يستخدم mapDataRouter.getWorldMapData للحصول على البيانات
 * - يعرض المؤشرات على مستوى العالم
 * - يسمح بالتفاعل والتحليل المقارن بين الدول
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, Globe } from 'lucide-react';

interface CountryData {
  country: string;
  code: string;
  gmi: number;
  cfi: number;
  hri: number;
  population: number;
  dominantEmotion: string;
  emotionIntensity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: Date;
}

interface WorldMapConnectedProps {
  limit?: number;
  onCountrySelect?: (country: CountryData) => void;
}

export function WorldMapConnected({
  limit = 100,
  onCountrySelect
}: WorldMapConnectedProps) {
  const [selectedCountry, setSelectedCountry] = React.useState<CountryData | null>(null);
  const [sortBy, setSortBy] = React.useState<'gmi' | 'cfi' | 'hri'>('gmi');

  // Fetch world map data from backend
  const { data: worldData, isLoading, error } = trpc.mapData.getWorldMapData.useQuery({
    limit
  });

  const countries = useMemo(() => worldData?.data || [], [worldData]);

  const sortedCountries = useMemo(() => {
    const sorted = [...countries].sort((a, b) => {
      if (sortBy === 'gmi') return b.gmi - a.gmi;
      if (sortBy === 'cfi') return b.cfi - a.cfi;
      return b.hri - a.hri;
    });
    return sorted;
  }, [countries, sortBy]);

  const handleCountryClick = (country: CountryData) => {
    setSelectedCountry(country);
    if (onCountrySelect) {
      onCountrySelect(country);
    }
  };

  const getIndicatorColor = (value: number) => {
    if (value >= 80) return '#000000';
    if (value >= 60) return '#333333';
    if (value >= 40) return '#666666';
    if (value >= 20) return '#999999';
    return '#CCCCCC';
  };

  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      joy: 'فرح',
      fear: 'خوف',
      anger: 'غضب',
      sadness: 'حزن',
      hope: 'أمل',
      curiosity: 'فضول'
    };
    return labels[emotion] || emotion;
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 bg-white border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">جاري تحميل خريطة العالم...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل خريطة العالم</span>
        </div>
      </Card>
    );
  }

  const globalStats = {
    avgGMI: (countries.reduce((sum, c) => sum + c.gmi, 0) / countries.length).toFixed(1),
    avgCFI: (countries.reduce((sum, c) => sum + c.cfi, 0) / countries.length).toFixed(1),
    avgHRI: (countries.reduce((sum, c) => sum + c.hri, 0) / countries.length).toFixed(1)
  };

  return (
    <div className="w-full space-y-4">
      {/* Global Statistics */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-gray-900" />
          <h3 className="text-lg font-bold text-gray-900">إحصائيات عالمية</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">GMI (Global Mood Index)</p>
            <p className="text-3xl font-bold text-gray-900">{globalStats.avgGMI}</p>
            <p className="text-xs text-gray-500 mt-1">متوسط عالمي</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">CFI (Crisis Fear Index)</p>
            <p className="text-3xl font-bold text-gray-900">{globalStats.avgCFI}</p>
            <p className="text-xs text-gray-500 mt-1">متوسط عالمي</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">HRI (Hope Resilience Index)</p>
            <p className="text-3xl font-bold text-gray-900">{globalStats.avgHRI}</p>
            <p className="text-xs text-gray-500 mt-1">متوسط عالمي</p>
          </div>
        </div>
      </Card>

      {/* Sort Controls */}
      <Card className="w-full p-4 bg-white border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('gmi')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'gmi'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ترتيب حسب GMI
          </button>
          <button
            onClick={() => setSortBy('cfi')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'cfi'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ترتيب حسب CFI
          </button>
          <button
            onClick={() => setSortBy('hri')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'hri'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ترتيب حسب HRI
          </button>
        </div>
      </Card>

      {/* Countries Grid */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">الدول والمناطق</h4>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedCountries.map((country, index) => (
            <div
              key={index}
              onClick={() => handleCountryClick(country)}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedCountry?.country === country.country
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-lg">{country.country}</p>
                  <p className={`text-xs ${selectedCountry?.country === country.country ? 'text-gray-300' : 'text-gray-600'}`}>
                    السكان: {(country.population / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-semibold ${selectedCountry?.country === country.country ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getEmotionLabel(country.dominantEmotion)}
                  </p>
                </div>
              </div>

              {/* Indicators */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 bg-gray-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1">GMI</p>
                  <p className="font-bold text-sm text-gray-900">{country.gmi.toFixed(1)}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1">CFI</p>
                  <p className="font-bold text-sm text-gray-900">{country.cfi.toFixed(1)}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1">HRI</p>
                  <p className="font-bold text-sm text-gray-900">{country.hri.toFixed(1)}</p>
                </div>
              </div>

              {/* Emotion Intensity Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${country.emotionIntensity}%`,
                      backgroundColor: getIndicatorColor(country.emotionIntensity)
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-10 text-right">
                  {country.emotionIntensity.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Country Details */}
      {selectedCountry && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            تحليل: {selectedCountry.country}
          </h4>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">GMI</p>
              <p className="text-3xl font-bold text-gray-900">{selectedCountry.gmi.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Global Mood Index</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">CFI</p>
              <p className="text-3xl font-bold text-gray-900">{selectedCountry.cfi.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Crisis Fear Index</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">HRI</p>
              <p className="text-3xl font-bold text-gray-900">{selectedCountry.hri.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Hope Resilience Index</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">العاطفة المهيمنة</p>
              <p className="font-semibold text-gray-900">
                {getEmotionLabel(selectedCountry.dominantEmotion)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">شدة العاطفة</p>
              <p className="font-semibold text-gray-900">
                {selectedCountry.emotionIntensity.toFixed(0)}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">السكان</p>
              <p className="font-semibold text-gray-900">
                {(selectedCountry.population / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">الاتجاه</p>
              <p className="font-semibold text-gray-900">
                {selectedCountry.trend === 'increasing' ? 'تصاعدي' : selectedCountry.trend === 'decreasing' ? 'تنازلي' : 'مستقر'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <p className="text-gray-600">
              آخر تحديث: {new Date(selectedCountry.timestamp).toLocaleString('ar-SA')}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
