/**
 * HOW IT WORKS COMPONENT
 * 
 * شرح آلية العمل
 * - المحركات الأساسية
 * - خط سير البيانات
 * - المؤشرات والحسابات
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Brain, Database, Zap, TrendingUp, Layers, Filter } from 'lucide-react';

interface Engine {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  inputs: string[];
  outputs: string[];
  color: string;
}

interface HowItWorksProps {
  language?: 'en' | 'ar';
}

export function HowItWorks({
  language = 'ar'
}: HowItWorksProps) {
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'engines' | 'flow' | 'indicators'>('engines');

  const isArabic = language === 'ar';

  const engines: Engine[] = [
    {
      id: 'transformer',
      name: 'Transformer Engine',
      nameAr: 'محرك المحول',
      description: 'Deep learning model that understands context and semantics from text data',
      descriptionAr: 'نموذج التعلم العميق الذي يفهم السياق والمعاني من بيانات النصوص',
      icon: <Brain className="w-6 h-6" />,
      inputs: ['Raw text data', 'Social media posts', 'News articles'],
      outputs: ['Semantic embeddings', 'Context vectors', 'Topic classification'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 'vader',
      name: 'VADER Sentiment',
      nameAr: 'تحليل VADER',
      description: 'Lexicon-based sentiment analysis optimized for social media',
      descriptionAr: 'تحليل المشاعر القائم على القاموس المحسّن لوسائل التواصل الاجتماعي',
      icon: <Zap className="w-6 h-6" />,
      inputs: ['Processed text', 'Emotional keywords', 'Context markers'],
      outputs: ['Sentiment scores', 'Emotion labels', 'Intensity levels'],
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      id: 'temporal',
      name: 'Temporal Analysis',
      nameAr: 'التحليل الزمني',
      description: 'Tracks emotion trends over time and predicts future patterns',
      descriptionAr: 'يتتبع اتجاهات العاطفة عبر الزمن ويتنبأ بالأنماط المستقبلية',
      icon: <TrendingUp className="w-6 h-6" />,
      inputs: ['Historical data', 'Time series', 'Event markers'],
      outputs: ['Trend analysis', 'Predictions', 'Anomalies'],
      color: 'bg-green-100 border-green-300'
    },
    {
      id: 'aggregation',
      name: 'Aggregation Engine',
      nameAr: 'محرك التجميع',
      description: 'Combines data from multiple sources with weighted credibility scores',
      descriptionAr: 'يجمع البيانات من مصادر متعددة مع درجات موثوقية مرجحة',
      icon: <Layers className="w-6 h-6" />,
      inputs: ['Multiple sources', 'Credibility scores', 'Timestamps'],
      outputs: ['Aggregated metrics', 'Confidence scores', 'Source attribution'],
      color: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'filtering',
      name: 'Filtering & Cleaning',
      nameAr: 'التصفية والتنظيف',
      description: 'Removes noise, spam, and irrelevant data before analysis',
      descriptionAr: 'يزيل الضوضاء والبريد العشوائي والبيانات غير ذات الصلة قبل التحليل',
      icon: <Filter className="w-6 h-6" />,
      inputs: ['Raw data', 'Spam filters', 'Quality metrics'],
      outputs: ['Clean data', 'Quality scores', 'Metadata'],
      color: 'bg-orange-100 border-orange-300'
    },
    {
      id: 'database',
      name: 'Data Storage',
      nameAr: 'تخزين البيانات',
      description: 'Persistent storage with historical tracking and version control',
      descriptionAr: 'التخزين الدائم مع تتبع تاريخي والتحكم في الإصدارات',
      icon: <Database className="w-6 h-6" />,
      inputs: ['Processed data', 'Metadata', 'Timestamps'],
      outputs: ['Historical records', 'Trends', 'Comparisons'],
      color: 'bg-indigo-100 border-indigo-300'
    }
  ];

  const indicators = [
    {
      name: 'GMI',
      fullName: 'General Mood Index',
      fullNameAr: 'مؤشر المزاج العام',
      range: '-100 to +100',
      description: 'Overall emotional state of a population',
      descriptionAr: 'الحالة العاطفية الإجمالية للسكان',
      formula: 'Average of all positive emotions - Average of all negative emotions'
    },
    {
      name: 'CFI',
      fullName: 'Collective Fear Index',
      fullNameAr: 'مؤشر الخوف الجماعي',
      range: '0 to 100',
      description: 'Measures collective anxiety and fear levels',
      descriptionAr: 'يقيس مستويات القلق والخوف الجماعي',
      formula: 'Fear sentiment score × Intensity × Source credibility'
    },
    {
      name: 'HRI',
      fullName: 'Hope & Resilience Index',
      fullNameAr: 'مؤشر الأمل والمرونة',
      range: '0 to 100',
      description: 'Measures hope, optimism, and resilience in population',
      descriptionAr: 'يقيس الأمل والتفاؤل والمرونة في السكان',
      formula: 'Hope sentiment × Resilience markers × Positive momentum'
    },
    {
      name: 'AVI',
      fullName: 'Anger Volatility Index',
      fullNameAr: 'مؤشر تقلب الغضب',
      range: '0 to 100',
      description: 'Measures volatility and intensity of anger',
      descriptionAr: 'يقيس تقلب وشدة الغضب',
      formula: 'Anger intensity × Change rate × Frequency'
    }
  ];

  const dataFlow = [
    {
      step: 1,
      title: 'Data Collection',
      titleAr: 'جمع البيانات',
      description: 'Collect data from news, social media, forums, and APIs',
      descriptionAr: 'جمع البيانات من الأخبار ووسائل التواصل والمنتديات والواجهات البرمجية'
    },
    {
      step: 2,
      title: 'Data Cleaning',
      titleAr: 'تنظيف البيانات',
      description: 'Remove spam, duplicates, and irrelevant content',
      descriptionAr: 'إزالة البريد العشوائي والنسخ المكررة والمحتوى غير ذي الصلة'
    },
    {
      step: 3,
      title: 'Processing',
      titleAr: 'المعالجة',
      description: 'Apply NLP, sentiment analysis, and feature extraction',
      descriptionAr: 'تطبيق معالجة اللغة الطبيعية وتحليل المشاعر واستخراج الميزات'
    },
    {
      step: 4,
      title: 'Analysis',
      titleAr: 'التحليل',
      description: 'Run through all engines for comprehensive analysis',
      descriptionAr: 'تشغيل جميع المحركات للحصول على تحليل شامل'
    },
    {
      step: 5,
      title: 'Aggregation',
      titleAr: 'التجميع',
      description: 'Combine results with weighted credibility scores',
      descriptionAr: 'دمج النتائج مع درجات الموثوقية المرجحة'
    },
    {
      step: 6,
      title: 'Storage',
      titleAr: 'التخزين',
      description: 'Store in database with historical tracking',
      descriptionAr: 'التخزين في قاعدة البيانات مع التتبع التاريخي'
    },
    {
      step: 7,
      title: 'Visualization',
      titleAr: 'التصور',
      description: 'Display results in maps, charts, and dashboards',
      descriptionAr: 'عرض النتائج في الخرائط والرسوم البيانية لوحات التحكم'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-black mb-2">
          {isArabic ? 'كيف يعمل النظام' : 'How It Works'}
        </h2>
        <p className="text-gray-600">
          {isArabic
            ? 'فهم المحركات والخوارزميات والعمليات الأساسية'
            : 'Understand the engines, algorithms, and core processes'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'engines', label: isArabic ? 'المحركات' : 'Engines' },
          { id: 'flow', label: isArabic ? 'خط سير البيانات' : 'Data Flow' },
          { id: 'indicators', label: isArabic ? 'المؤشرات' : 'Indicators' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              selectedTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Engines Tab */}
      {selectedTab === 'engines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {engines.map(engine => (
            <Card
              key={engine.id}
              className={`p-4 border-2 cursor-pointer transition ${engine.color}`}
              onClick={() =>
                setExpandedEngine(
                  expandedEngine === engine.id ? null : engine.id
                )
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl mt-1">{engine.icon}</div>
                  <div>
                    <h3 className="font-bold text-black">
                      {isArabic ? engine.nameAr : engine.name}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {isArabic ? engine.descriptionAr : engine.description}
                    </p>
                  </div>
                </div>
                {expandedEngine === engine.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </div>

              {expandedEngine === engine.id && (
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      {isArabic ? 'المدخلات' : 'Inputs'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {engine.inputs.map((input, idx) => (
                        <Badge key={idx} className="bg-gray-200 text-gray-800">
                          {input}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      {isArabic ? 'المخرجات' : 'Outputs'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {engine.outputs.map((output, idx) => (
                        <Badge key={idx} className="bg-black text-white">
                          {output}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Data Flow Tab */}
      {selectedTab === 'flow' && (
        <div className="space-y-3">
          {dataFlow.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                {idx < dataFlow.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-300 mt-2" />
                )}
              </div>
              <Card className="flex-1 p-4 border border-gray-200">
                <h3 className="font-bold text-black">
                  {isArabic ? item.titleAr : item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isArabic ? item.descriptionAr : item.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Indicators Tab */}
      {selectedTab === 'indicators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indicators.map((indicator, idx) => (
            <Card key={idx} className="p-4 border-2 border-gray-200">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-black text-white font-bold">
                    {indicator.name}
                  </Badge>
                  <span className="text-xs text-gray-600">{indicator.range}</span>
                </div>
                <h3 className="font-bold text-black">
                  {isArabic ? indicator.fullNameAr : indicator.fullName}
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {isArabic ? indicator.descriptionAr : indicator.description}
              </p>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  {isArabic ? 'الصيغة' : 'Formula'}
                </p>
                <p className="text-xs text-gray-600 font-mono">
                  {indicator.formula}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Key Features */}
      <Card className="p-6 border-2 border-black bg-black text-white">
        <h3 className="text-lg font-bold mb-4">
          {isArabic ? 'الميزات الرئيسية' : 'Key Features'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: isArabic ? 'دقة عالية' : 'High Accuracy',
              desc: isArabic ? 'نماذج تعلم عميق متقدمة' : 'Advanced deep learning models'
            },
            {
              title: isArabic ? 'تحديث فوري' : 'Real-time Updates',
              desc: isArabic ? 'معالجة البيانات الحية' : 'Live data processing'
            },
            {
              title: isArabic ? 'موثوقية عالية' : 'High Reliability',
              desc: isArabic ? 'درجات موثوقية مرجحة' : 'Weighted credibility scores'
            }
          ].map((feature, idx) => (
            <div key={idx}>
              <p className="font-semibold mb-1">{feature.title}</p>
              <p className="text-sm text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
