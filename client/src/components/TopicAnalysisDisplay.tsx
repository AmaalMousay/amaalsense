// @ts-nocheck
/**
 * TOPIC ANALYSIS DISPLAY - CONNECTED VERSION
 * 
 * يعرض تحليل الموضوعات مع بيانات حقيقية من الخادم
 * - يستخدم analysisDataRouter.getTopicAnalysis للحصول على البيانات
 * - يعرض الموضوعات الرئيسية والفرعية
 * - يدعم المقارنة بين الموضوعات
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface TopicData {
  topic: string;
  subtopics: string[];
  sentiment: number;
  volume: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  relatedTopics: string[];
  emotionalContext: Record<string, number>;
  sources: Array<{ name: string; credibility: number; count: number }>;
  timestamp: Date;
}

interface TopicAnalysisDisplayConnectedProps {
  topic: string;
  country?: string;
  timeRange?: 'week' | 'month' | 'year';
  onTopicSelect?: (topic: TopicData) => void;
}

export function TopicAnalysisDisplayConnected({
  topic,
  country,
  timeRange = 'month',
  onTopicSelect
}: TopicAnalysisDisplayConnectedProps) {
  const [selectedSubtopic, setSelectedSubtopic] = React.useState<string | null>(null);

  // Fetch topic analysis data from backend
  const { data: topicData, isLoading, error } = trpc.engine.getTopicAnalysis.useQuery({
    topic,
    country,
    timeRange
  });

  const analysis = topicData?.data;

  const handleSubtopicClick = (subtopic: string) => {
    setSelectedSubtopic(subtopic);
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return '#000000'; // Positive - Black
    if (sentiment >= 40) return '#666666'; // Neutral - Gray
    return '#333333'; // Negative - Dark Gray
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 70) return 'إيجابي';
    if (sentiment >= 40) return 'محايد';
    return 'سلبي';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4" />;
    return <div className="w-4 h-4 text-gray-400">—</div>;
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 bg-white border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">جاري تحميل تحليل الموضوع...</span>
        </div>
      </Card>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل تحليل الموضوع</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Topic Overview */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{analysis.topic}</h3>
          <p className="text-sm text-gray-600">
            الفترة الزمنية: {timeRange === 'week' ? 'أسبوع' : timeRange === 'month' ? 'شهر' : 'سنة'}
            {country && ` | الدولة: ${country}`}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">المشاعر</p>
            <p className="text-2xl font-bold" style={{ color: getSentimentColor(analysis.sentiment) }}>
              {analysis.sentiment.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">{getSentimentLabel(analysis.sentiment)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">حجم المحتوى</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.volume.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">منشور وتغريدة</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">الاتجاه</p>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(analysis.trend)}
              <span className="font-semibold text-gray-900">
                {analysis.trend === 'increasing' ? 'تصاعدي' : analysis.trend === 'decreasing' ? 'تنازلي' : 'مستقر'}
              </span>
            </div>
            <p className={`text-xs mt-1 ${analysis.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {analysis.change > 0 ? '+' : ''}{analysis.change.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">الموثوقية</p>
            <p className="text-2xl font-bold text-gray-900">
              {(analysis.sources.reduce((sum, s) => sum + s.credibility, 0) / analysis.sources.length).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">متوسط المصادر</p>
          </div>
        </div>

        {/* Sentiment Bar */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">المشاعر:</span>
          <div className="flex-1 bg-gray-200 rounded h-3">
            <div
              className="h-full rounded transition-all"
              style={{
                width: `${analysis.sentiment}%`,
                backgroundColor: getSentimentColor(analysis.sentiment)
              }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900 w-12 text-right">
            {analysis.sentiment.toFixed(0)}%
          </span>
        </div>
      </Card>

      {/* Subtopics */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">الموضوعات الفرعية</h4>
        
        <div className="grid grid-cols-2 gap-3">
          {analysis.subtopics.map((subtopic, index) => (
            <div
              key={index}
              onClick={() => handleSubtopicClick(subtopic)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedSubtopic === subtopic
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <p className="font-semibold">{subtopic}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emotional Context */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">السياق العاطفي</h4>
        
        <div className="space-y-3">
          {Object.entries(analysis.emotionalContext).map(([emotion, value]) => (
            <div key={emotion} className="flex items-center gap-3">
              <span className="w-20 text-sm text-gray-600 capitalize">{emotion}</span>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${value}%`,
                    backgroundColor: getSentimentColor(value)
                  }}
                />
              </div>
              <span className="w-12 text-right text-sm font-semibold text-gray-900">
                {value.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Sources */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">المصادر الرئيسية</h4>
        
        <div className="space-y-2">
          {analysis.sources.map((source, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">{source.name}</p>
                <p className="text-sm font-semibold text-gray-600">
                  {source.count.toLocaleString()} منشور
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">الموثوقية:</span>
                <div className="flex-1 bg-gray-200 rounded h-1.5">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${source.credibility}%`,
                      backgroundColor: getSentimentColor(source.credibility)
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                  {source.credibility.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Related Topics */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">موضوعات ذات صلة</h4>
        
        <div className="flex flex-wrap gap-2">
          {analysis.relatedTopics.map((relatedTopic, index) => (
            <button
              key={index}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-semibold transition-all border border-gray-200"
            >
              {relatedTopic}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
