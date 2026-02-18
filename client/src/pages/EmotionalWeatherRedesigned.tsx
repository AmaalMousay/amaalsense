

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EmotionData {
  name: string;
  value: number;
  color: string;
}

interface ForecastItem {
  time: string;
  mood: string;
  probability: number;
}

export default function EmotionalWeatherRedesigned() {
  const { t, language } = useI18n();
  const [currentMood, setCurrentMood] = useState('معتدل');
  const [moodTrend, setMoodTrend] = useState('stable');
  const [moodIndex, setMoodIndex] = useState(45);
  const [emotions, setEmotions] = useState<EmotionData[]>([
    { name: 'خوف', value: 38, color: '#F4A261' },
    { name: 'أمل', value: 24, color: '#2A9D8F' },
    { name: 'غضب', value: 18, color: '#E63946' },
    { name: 'حزن', value: 12, color: '#8D5CF6' },
    { name: 'فضول', value: 8, color: '#E9C46A' },
  ]);
  const [topFactors, setTopFactors] = useState([
    'توترات اقتصادية',
    'أخبار سياسية',
    'أحداث إقليمية'
  ]);
  const [forecast, setForecast] = useState<ForecastItem[]>([
    { time: '24h', mood: 'قلق معتدل', probability: 65 },
    { time: '48h', mood: 'قلق معتدل', probability: 58 },
  ]);
  const [stabilityIndex, setStabilityIndex] = useState(62);

  const getMoodColor = (index: number) => {
    if (index > 70) return '#2A9D8F'; // أخضر - أمل
    if (index > 50) return '#E9C46A'; // أصفر - قلق معتدل
    if (index > 30) return '#F4A261'; // برتقالي - خوف
    return '#E63946'; // أحمر - قلق عالي
  };

  const getMoodText = (index: number) => {
    if (index > 70) return language === 'ar' ? 'متفائل' : 'Optimistic';
    if (index > 50) return language === 'ar' ? 'قلق معتدل' : 'Moderate Concern';
    if (index > 30) return language === 'ar' ? 'قلق' : 'Concerned';
    return language === 'ar' ? 'قلق عالي' : 'High Concern';
  };

  const getTrendArrow = () => {
    if (moodTrend === 'up') return '↑';
    if (moodTrend === 'down') return '↓';
    return '→';
  };

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ar' ? '🌦️ الطقس العاطفي' : '🌦️ Emotional Weather'}
          </h1>
          <p className="text-slate-400">
            {language === 'ar' ? 'المزاج العام الآن وتوقعات المستقبل القريب' : 'Current global mood and near-term forecasts'}
          </p>
        </div>

        {/* Main Mood Card - الأهم */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 mb-6 p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              {language === 'ar' ? 'المزاج العام الآن' : 'Current Global Mood'}
            </h2>
            <span className="text-4xl">{getTrendArrow()}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="text-6xl font-bold mb-2" style={{ color: getMoodColor(moodIndex) }}>
                {getMoodText(moodIndex)}
              </div>
              <div className="text-slate-400 text-lg">
                {language === 'ar' ? 'مؤشر المزاج: ' : 'Mood Index: '} 
                <span className="text-white font-bold">{moodIndex}</span>
              </div>
            </div>
            
            {/* Visual Gauge */}
            <div className="w-32 h-32 rounded-full border-8 flex items-center justify-center" style={{ borderColor: getMoodColor(moodIndex) }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{moodIndex}</div>
                <div className="text-xs text-slate-400">/100</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Emotion Distribution */}
          <Card className="bg-slate-800 border-slate-600 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {language === 'ar' ? 'توزيع المشاعر' : 'Emotion Distribution'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emotions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Factors */}
          <Card className="bg-slate-800 border-slate-600 p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {language === 'ar' ? 'أهم العوامل المؤثرة' : 'Top Contributing Factors'}
            </h3>
            <div className="space-y-3">
              {topFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <span className="text-2xl">
                    {idx === 0 ? '📊' : idx === 1 ? '🏛️' : '🌍'}
                  </span>
                  <span className="text-white">{factor}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Forecast */}
        <Card className="bg-slate-800 border-slate-600 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {language === 'ar' ? 'التوقع (48 ساعة القادمة)' : 'Forecast (Next 48 Hours)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forecast.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-700 rounded-lg">
                <div className="text-slate-400 text-sm mb-2">
                  {language === 'ar' ? 'خلال ' : 'In '} {item.time}
                </div>
                <div className="text-white font-bold mb-2">{item.mood}</div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${item.probability}%` }}
                  ></div>
                </div>
                <div className="text-slate-400 text-xs mt-2">
                  {language === 'ar' ? 'احتمالية: ' : 'Probability: '} {item.probability}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Stability Indicator */}
        <Card className="bg-slate-800 border-slate-600 p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {language === 'ar' ? 'مؤشر الاستقرار' : 'Stability Index'}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ width: `${stabilityIndex}%` }}
                ></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stabilityIndex}%</div>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            {language === 'ar' 
              ? 'يعني أن المشاعر العامة مستقرة نسبياً ولا تتغير بسرعة كبيرة'
              : 'Indicates that public sentiment is relatively stable and not changing rapidly'
            }
          </p>
        </Card>

        {/* Human-like Insight */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg border border-blue-700">
          <p className="text-white text-lg leading-relaxed">
            {language === 'ar'
              ? '💡 المزاج العالمي اليوم يميل للقلق المعتدل، لكن دون إشارات خطر مرتفعة. الاستقرار النسبي يشير إلى أن الناس يراقبون الأوضاع لكن لم يصلوا لحالة ذعر.'
              : '💡 Global sentiment today leans toward moderate concern, but without high-risk indicators. The relative stability suggests people are monitoring the situation but haven\'t reached panic levels.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
