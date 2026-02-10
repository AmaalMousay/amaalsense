import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DCFTIndices {
  gmi: number;
  cfi: number;
  hri: number;
  aci: number;
  sdi: number;
  confidence: number;
  breakdown: {
    positiveEnergy: number;
    negativeEnergy: number;
    neutralEnergy: number;
    emotionalIntensity: number;
  };
}

interface DCFTVisualizationProps {
  indices: DCFTIndices;
  language?: 'ar' | 'en';
}

const labels = {
  ar: {
    gmi: 'مؤشر المزاج العام',
    cfi: 'مؤشر الخوف الجماعي',
    hri: 'مؤشر الأمل والمرونة',
    aci: 'مؤشر الاستقطاب',
    sdi: 'مؤشر الاستقرار الديناميكي',
    confidence: 'درجة الثقة',
    positiveEnergy: 'الطاقة الإيجابية',
    negativeEnergy: 'الطاقة السلبية',
    neutralEnergy: 'الطاقة المحايدة',
    emotionalIntensity: 'شدة المشاعر',
  },
  en: {
    gmi: 'Global Mood Index',
    cfi: 'Collective Fear Index',
    hri: 'Hope & Resilience Index',
    aci: 'Antagonism & Conflict Index',
    sdi: 'Stability & Dynamics Index',
    confidence: 'Confidence Score',
    positiveEnergy: 'Positive Energy',
    negativeEnergy: 'Negative Energy',
    neutralEnergy: 'Neutral Energy',
    emotionalIntensity: 'Emotional Intensity',
  },
};

const getColorForValue = (value: number): string => {
  if (value >= 70) return '#10b981'; // Green - positive
  if (value >= 50) return '#f59e0b'; // Amber - neutral
  if (value >= 30) return '#ef4444'; // Red - negative
  return '#991b1b'; // Dark red - very negative
};

const getInterpretation = (index: string, value: number, language: 'ar' | 'en' = 'en'): string => {
  const interpretations = {
    ar: {
      gmi: {
        high: 'المزاج العام إيجابي وتفاؤلي',
        medium: 'المزاج العام متوازن',
        low: 'المزاج العام سلبي وقلق',
      },
      cfi: {
        high: 'مستويات خوف عالية جداً',
        medium: 'مستويات خوف معتدلة',
        low: 'مستويات خوف منخفضة',
      },
      hri: {
        high: 'أمل وثقة عالية جداً',
        medium: 'أمل وثقة معتدلة',
        low: 'أمل وثقة منخفضة',
      },
      aci: {
        high: 'استقطاب واستقطاب عالي جداً',
        medium: 'استقطاب معتدل',
        low: 'استقطاب منخفض - توافق عالي',
      },
      sdi: {
        high: 'استقرار ديناميكي عالي',
        medium: 'استقرار ديناميكي معتدل',
        low: 'عدم استقرار ديناميكي',
      },
    },
    en: {
      gmi: {
        high: 'Overall mood is positive and optimistic',
        medium: 'Overall mood is balanced',
        low: 'Overall mood is negative and anxious',
      },
      cfi: {
        high: 'Very high levels of fear',
        medium: 'Moderate levels of fear',
        low: 'Low levels of fear',
      },
      hri: {
        high: 'Very high hope and confidence',
        medium: 'Moderate hope and confidence',
        low: 'Low hope and confidence',
      },
      aci: {
        high: 'High polarization and conflict',
        medium: 'Moderate polarization',
        low: 'Low polarization - high consensus',
      },
      sdi: {
        high: 'High dynamic stability',
        medium: 'Moderate dynamic stability',
        low: 'Dynamic instability',
      },
    },
  };

  const indexKey = index as keyof typeof interpretations['en'];
  const level = value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low';
  
  return interpretations[language][indexKey]?.[level] || '';
};

export const DCFTVisualization: React.FC<DCFTVisualizationProps> = ({ indices, language = 'en' }) => {
  const lang = labels[language];
  const isArabic = language === 'ar';

  // Prepare data for radar chart
  const radarData = [
    { name: lang.gmi, value: indices.gmi, fullMark: 100 },
    { name: lang.cfi, value: indices.cfi, fullMark: 100 },
    { name: lang.hri, value: indices.hri, fullMark: 100 },
    { name: lang.aci, value: indices.aci, fullMark: 100 },
    { name: lang.sdi, value: indices.sdi, fullMark: 100 },
  ];

  // Prepare data for bar chart
  const barData = [
    { name: lang.gmi, value: Math.round(indices.gmi), color: getColorForValue(indices.gmi) },
    { name: lang.cfi, value: Math.round(indices.cfi), color: getColorForValue(indices.cfi) },
    { name: lang.hri, value: Math.round(indices.hri), color: getColorForValue(indices.hri) },
    { name: lang.aci, value: Math.round(indices.aci), color: getColorForValue(indices.aci) },
    { name: lang.sdi, value: Math.round(indices.sdi), color: getColorForValue(indices.sdi) },
  ];

  // Prepare data for breakdown chart
  const breakdownData = [
    { name: lang.positiveEnergy, value: Math.round(indices.breakdown.positiveEnergy) },
    { name: lang.negativeEnergy, value: Math.round(indices.breakdown.negativeEnergy) },
    { name: lang.neutralEnergy, value: Math.round(indices.breakdown.neutralEnergy) },
  ];

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Main DCFT Indices Card */}
      <Card className="border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {isArabic ? 'مؤشرات DCFT' : 'DCFT Indices'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'تحليل ديناميكي شامل للعواطف الجماعية' 
              : 'Comprehensive Dynamic Contextual Fusion Transform Analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Radar Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#6b7280" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Score" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #6b7280' }}
                  formatter={(value) => `${Math.round(value as number)}`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Individual Index Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { key: 'gmi', value: indices.gmi, icon: '😊' },
              { key: 'cfi', value: indices.cfi, icon: '😨' },
              { key: 'hri', value: indices.hri, icon: '🙏' },
              { key: 'aci', value: indices.aci, icon: '⚔️' },
              { key: 'sdi', value: indices.sdi, icon: '⚖️' },
            ].map(({ key, value, icon }) => (
              <div
                key={key}
                className="p-4 rounded-lg border-2 transition-all hover:shadow-lg"
                style={{
                  borderColor: getColorForValue(value),
                  backgroundColor: `${getColorForValue(value)}20`,
                }}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-sm font-semibold text-gray-300">
                  {lang[key as keyof typeof lang]}
                </div>
                <div className="text-2xl font-bold mt-2" style={{ color: getColorForValue(value) }}>
                  {Math.round(value)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {getInterpretation(key, value, language)}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(value, 100)}%`,
                      backgroundColor: getColorForValue(value),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Confidence Score */}
          <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{lang.confidence}</span>
              <span className="text-2xl font-bold text-blue-400">
                {Math.round(indices.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(indices.confidence * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Breakdown Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-4">
              {isArabic ? 'تحليل الطاقة العاطفية' : 'Emotional Energy Breakdown'}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #6b7280' }}
                    formatter={(value) => `${Math.round(value as number)}%`}
                  />
                  <Bar dataKey="value" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emotional Intensity */}
          <div className="p-4 rounded-lg border border-orange-500/50 bg-orange-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{lang.emotionalIntensity}</span>
              <span className="text-2xl font-bold text-orange-400">
                {Math.round(indices.breakdown.emotionalIntensity)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500 transition-all"
                style={{ width: `${Math.min(indices.breakdown.emotionalIntensity, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {isArabic 
                ? 'مدى شدة المشاعر المكتشفة في البيانات'
                : 'Intensity of emotions detected in the data'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
