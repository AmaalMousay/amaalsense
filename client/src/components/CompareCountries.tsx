/**
 * COMPARE COUNTRIES COMPONENT
 * 
 * مقارنة الدول والمناطق
 * - مقارنة المؤشرات بين دول مختلفة
 * - عرض الفروقات والاتجاهات
 * - تحليل العوامل المؤثرة
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Plus, X, Download } from 'lucide-react';

interface CountryData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionDistribution: Record<string, number>;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  population: number;
  region: string;
  lastUpdated: Date;
}

interface ComparisonMetric {
  metric: 'gmi' | 'cfi' | 'hri' | 'emotion';
  label: string;
}

interface CompareCountriesProps {
  selectedCountries?: string[];
  onCountriesChange?: (countries: string[]) => void;
  comparisonType?: 'bar' | 'line' | 'radar';
}

export function CompareCountries({
  selectedCountries = ['SA', 'AE', 'EG'],
  onCountriesChange,
  comparisonType = 'bar'
}: CompareCountriesProps) {
  const [countries, setCountries] = useState<string[]>(selectedCountries);
  const [selectedMetric, setSelectedMetric] = useState<ComparisonMetric['metric']>('gmi');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [showDetails, setShowDetails] = useState(false);

  // Mock data for demonstration
  const mockCountries: Record<string, CountryData> = {
    'SA': {
      countryCode: 'SA',
      countryName: 'السعودية',
      gmi: 72,
      cfi: 68,
      hri: 75,
      dominantEmotion: 'hope',
      emotionDistribution: { hope: 35, joy: 25, curiosity: 20, sadness: 10, anger: 7, fear: 3 },
      trend: 'up',
      trendPercent: 2.5,
      population: 36000000,
      region: 'Middle East',
      lastUpdated: new Date()
    },
    'AE': {
      countryCode: 'AE',
      countryName: 'الإمارات',
      gmi: 75,
      cfi: 72,
      hri: 78,
      dominantEmotion: 'joy',
      emotionDistribution: { joy: 38, hope: 28, curiosity: 18, sadness: 8, anger: 5, fear: 3 },
      trend: 'up',
      trendPercent: 1.8,
      population: 10000000,
      region: 'Middle East',
      lastUpdated: new Date()
    },
    'EG': {
      countryCode: 'EG',
      countryName: 'مصر',
      gmi: 65,
      cfi: 62,
      hri: 68,
      dominantEmotion: 'curiosity',
      emotionDistribution: { curiosity: 30, hope: 25, joy: 20, sadness: 15, anger: 7, fear: 3 },
      trend: 'down',
      trendPercent: -1.2,
      population: 105000000,
      region: 'Middle East',
      lastUpdated: new Date()
    },
    'US': {
      countryCode: 'US',
      countryName: 'الولايات المتحدة',
      gmi: 68,
      cfi: 70,
      hri: 72,
      dominantEmotion: 'curiosity',
      emotionDistribution: { curiosity: 32, hope: 26, joy: 22, sadness: 12, anger: 6, fear: 2 },
      trend: 'stable',
      trendPercent: 0.1,
      population: 335000000,
      region: 'North America',
      lastUpdated: new Date()
    },
    'GB': {
      countryCode: 'GB',
      countryName: 'المملكة المتحدة',
      gmi: 70,
      cfi: 68,
      hri: 71,
      dominantEmotion: 'curiosity',
      emotionDistribution: { curiosity: 31, hope: 27, joy: 23, sadness: 11, anger: 6, fear: 2 },
      trend: 'up',
      trendPercent: 0.8,
      population: 68000000,
      region: 'Europe',
      lastUpdated: new Date()
    },
    'FR': {
      countryCode: 'FR',
      countryName: 'فرنسا',
      gmi: 69,
      cfi: 67,
      hri: 70,
      dominantEmotion: 'curiosity',
      emotionDistribution: { curiosity: 30, hope: 26, joy: 24, sadness: 12, anger: 6, fear: 2 },
      trend: 'down',
      trendPercent: -0.5,
      population: 68000000,
      region: 'Europe',
      lastUpdated: new Date()
    }
  };

  // Prepare comparison data
  const comparisonData = useMemo(() => {
    return countries.map(code => {
      const data = mockCountries[code];
      return {
        name: data.countryName,
        code: code,
        gmi: data.gmi,
        cfi: data.cfi,
        hri: data.hri,
        average: Math.round((data.gmi + data.cfi + data.hri) / 3)
      };
    });
  }, [countries]);

  // Prepare emotion distribution data
  const emotionData = useMemo(() => {
    if (countries.length === 0) return [];
    const firstCountry = mockCountries[countries[0]];
    return Object.entries(firstCountry.emotionDistribution).map(([emotion, value]) => ({
      name: emotion,
      value: value
    }));
  }, [countries]);

  const handleAddCountry = (code: string) => {
    if (!countries.includes(code)) {
      const newCountries = [...countries, code];
      setCountries(newCountries);
      if (onCountriesChange) onCountriesChange(newCountries);
    }
  };

  const handleRemoveCountry = (code: string) => {
    const newCountries = countries.filter(c => c !== code);
    setCountries(newCountries);
    if (onCountriesChange) onCountriesChange(newCountries);
  };

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#EEEEEE'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">مقارنة الدول</h2>
          <p className="text-sm text-gray-600 mt-1">
            قارن المؤشرات العاطفية بين دول مختلفة
          </p>
        </div>
      </div>

      {/* Country Selection */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4">الدول المختارة</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {countries.map(code => (
            <div
              key={code}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
            >
              <span className="text-sm font-medium text-black">
                {mockCountries[code]?.countryName || code}
              </span>
              <button
                onClick={() => handleRemoveCountry(code)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">إضافة دول للمقارنة:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(mockCountries).map(([code, data]) => (
              <button
                key={code}
                onClick={() => handleAddCountry(code)}
                disabled={countries.includes(code)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${
                  countries.includes(code)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                }`}
              >
                {data.countryName}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Metrics Selection */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4">اختر المؤشر</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: 'gmi' as const, label: 'GMI - مؤشر المشاعر' },
            { value: 'cfi' as const, label: 'CFI - مؤشر الثقة' },
            { value: 'hri' as const, label: 'HRI - مؤشر الأمل' },
            { value: 'emotion' as const, label: 'توزيع العواطف' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedMetric(value)}
              className={`px-4 py-2 rounded font-medium transition ${
                selectedMetric === value
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Chart Type Selection */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4">نوع الرسم البياني</h3>
        <div className="flex gap-3">
          {[
            { value: 'bar' as const, label: 'أعمدة' },
            { value: 'line' as const, label: 'خطوط' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setChartType(value)}
              className={`px-4 py-2 rounded font-medium transition ${
                chartType === value
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Comparison Chart */}
      {selectedMetric !== 'emotion' && (
        <Card className="p-6 border border-gray-200">
          <h3 className="font-semibold text-black mb-4">
            {selectedMetric === 'gmi' && 'مقارنة مؤشر المشاعر العالمية'}
            {selectedMetric === 'cfi' && 'مقارنة مؤشر الثقة الجماعية'}
            {selectedMetric === 'hri' && 'مقارنة مؤشر الأمل والمرونة'}
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={selectedMetric}
                  fill="#000000"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: '#000000', r: 5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Card>
      )}

      {/* Emotion Distribution */}
      {selectedMetric === 'emotion' && countries.length > 0 && (
        <Card className="p-6 border border-gray-200">
          <h3 className="font-semibold text-black mb-4">
            توزيع العواطف في {mockCountries[countries[0]]?.countryName}
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#000000"
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Detailed Comparison Table */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">التفاصيل المقارنة</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-600 hover:text-black"
          >
            {showDetails ? 'إخفاء' : 'عرض'}
          </button>
        </div>

        {showDetails && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-right font-semibold text-black">الدولة</th>
                  <th className="px-4 py-2 text-right font-semibold text-black">GMI</th>
                  <th className="px-4 py-2 text-right font-semibold text-black">CFI</th>
                  <th className="px-4 py-2 text-right font-semibold text-black">HRI</th>
                  <th className="px-4 py-2 text-right font-semibold text-black">الاتجاه</th>
                </tr>
              </thead>
              <tbody>
                {countries.map(code => {
                  const data = mockCountries[code];
                  return (
                    <tr key={code} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2 text-black font-medium">{data.countryName}</td>
                      <td className="px-4 py-2 text-black">{data.gmi}</td>
                      <td className="px-4 py-2 text-black">{data.cfi}</td>
                      <td className="px-4 py-2 text-black">{data.hri}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          {data.trend === 'up' ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">+{data.trendPercent}%</span>
                            </>
                          ) : data.trend === 'down' ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">{data.trendPercent}%</span>
                            </>
                          ) : (
                            <span className="text-gray-600">مستقر</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Export Button */}
      <div className="flex gap-3">
        <Button className="gap-2 bg-black text-white hover:bg-gray-800">
          <Download className="w-4 h-4" />
          تحميل المقارنة
        </Button>
      </div>
    </div>
  );
}
