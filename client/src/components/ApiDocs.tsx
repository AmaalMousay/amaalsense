/**
 * API DOCUMENTATION COMPONENT
 * 
 * توثيق API
 * - نقاط النهاية المتاحة
 * - أمثلة الطلبات والاستجابات
 * - معاملات وخيارات
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Code, Play, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  parameters?: Parameter[];
  requestExample?: string;
  responseExample?: string;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  descriptionAr: string;
}

interface ApiDocsProps {
  language?: 'en' | 'ar';
}

export function ApiDocs({
  language = 'ar'
}: ApiDocsProps) {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isArabic = language === 'ar';

  const endpoints: ApiEndpoint[] = [
    {
      id: 'analyze',
      method: 'POST',
      path: '/api/analyze',
      title: 'Analyze Topic',
      titleAr: 'تحليل موضوع',
      description: 'Analyze emotions and indicators for a specific topic or country',
      descriptionAr: 'تحليل العواطف والمؤشرات لموضوع أو دولة معينة',
      parameters: [
        {
          name: 'query',
          type: 'string',
          required: true,
          description: 'Topic or country to analyze',
          descriptionAr: 'الموضوع أو الدولة المراد تحليلها'
        },
        {
          name: 'timeframe',
          type: 'string',
          required: false,
          description: 'Time period (day, week, month, year)',
          descriptionAr: 'الفترة الزمنية (يوم، أسبوع، شهر، سنة)'
        },
        {
          name: 'sources',
          type: 'array',
          required: false,
          description: 'Data sources to include',
          descriptionAr: 'مصادر البيانات المراد تضمينها'
        }
      ],
      requestExample: JSON.stringify({
        query: 'Egypt',
        timeframe: 'week',
        sources: ['news', 'social_media', 'forums']
      }, null, 2),
      responseExample: JSON.stringify({
        topic: 'Egypt',
        gmi: 45,
        cfi: 32,
        hri: 58,
        emotions: {
          joy: 35,
          fear: 28,
          anger: 22,
          sadness: 15,
          curiosity: 40,
          hope: 52
        },
        timestamp: '2026-03-03T00:00:00Z',
        confidence: 0.87
      }, null, 2)
    },
    {
      id: 'compare',
      method: 'POST',
      path: '/api/compare',
      title: 'Compare Countries',
      titleAr: 'مقارنة الدول',
      description: 'Compare emotional indicators between multiple countries',
      descriptionAr: 'مقارنة المؤشرات العاطفية بين دول متعددة',
      parameters: [
        {
          name: 'countries',
          type: 'array',
          required: true,
          description: 'List of country codes',
          descriptionAr: 'قائمة رموز الدول'
        },
        {
          name: 'metric',
          type: 'string',
          required: false,
          description: 'Metric to compare (gmi, cfi, hri, etc)',
          descriptionAr: 'المقياس المراد مقارنته'
        }
      ],
      requestExample: JSON.stringify({
        countries: ['EG', 'SA', 'AE', 'JO'],
        metric: 'gmi'
      }, null, 2),
      responseExample: JSON.stringify({
        comparison: [
          { country: 'EG', value: 45, rank: 2 },
          { country: 'SA', value: 52, rank: 1 },
          { country: 'AE', value: 48, rank: 3 },
          { country: 'JO', value: 41, rank: 4 }
        ]
      }, null, 2)
    },
    {
      id: 'trends',
      method: 'GET',
      path: '/api/trends',
      title: 'Get Trends',
      titleAr: 'الحصول على الاتجاهات',
      description: 'Get historical trends and predictions for a topic',
      descriptionAr: 'الحصول على الاتجاهات التاريخية والتنبؤات لموضوع',
      parameters: [
        {
          name: 'topic',
          type: 'string',
          required: true,
          description: 'Topic to get trends for',
          descriptionAr: 'الموضوع المراد الحصول على اتجاهاته'
        },
        {
          name: 'days',
          type: 'number',
          required: false,
          description: 'Number of days to look back',
          descriptionAr: 'عدد الأيام للنظر للخلف'
        }
      ],
      requestExample: JSON.stringify({
        topic: 'Technology',
        days: 30
      }, null, 2),
      responseExample: JSON.stringify({
        topic: 'Technology',
        trends: [
          { date: '2026-02-01', gmi: 42, cfi: 25 },
          { date: '2026-02-08', gmi: 45, cfi: 28 },
          { date: '2026-02-15', gmi: 48, cfi: 30 }
        ],
        prediction: { date: '2026-03-10', gmi: 52, confidence: 0.75 }
      }, null, 2)
    },
    {
      id: 'map',
      method: 'GET',
      path: '/api/map',
      title: 'Get Map Data',
      titleAr: 'الحصول على بيانات الخريطة',
      description: 'Get emotional data for world map visualization',
      descriptionAr: 'الحصول على البيانات العاطفية لتصور الخريطة العالمية',
      parameters: [
        {
          name: 'metric',
          type: 'string',
          required: false,
          description: 'Metric to display (gmi, cfi, hri)',
          descriptionAr: 'المقياس المراد عرضه'
        }
      ],
      requestExample: JSON.stringify({
        metric: 'gmi'
      }, null, 2),
      responseExample: JSON.stringify({
        countries: [
          { code: 'EG', name: 'Egypt', value: 45, color: '#FF6B6B' },
          { code: 'SA', name: 'Saudi Arabia', value: 52, color: '#4ECDC4' }
        ]
      }, null, 2)
    }
  ];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800';
      case 'POST':
        return 'bg-green-100 text-green-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-black mb-2">
          {isArabic ? 'توثيق API' : 'API Documentation'}
        </h2>
        <p className="text-gray-600">
          {isArabic
            ? 'نقاط النهاية والمعاملات والأمثلة'
            : 'Endpoints, parameters, and examples'}
        </p>
      </div>

      {/* Base URL */}
      <Card className="p-4 border-2 border-black bg-black text-white">
        <p className="text-sm font-semibold mb-2">
          {isArabic ? 'عنوان URL الأساسي' : 'Base URL'}
        </p>
        <div className="flex items-center justify-between bg-gray-900 p-3 rounded font-mono text-sm">
          <span>https://api.amalsense.com/v1</span>
          <button
            onClick={() => handleCopyCode('https://api.amalsense.com/v1', 'base-url')}
            className="p-1 hover:bg-gray-800 rounded transition"
          >
            {copiedCode === 'base-url' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </Card>

      {/* Authentication */}
      <Card className="p-4 border-2 border-gray-200">
        <h3 className="font-bold text-black mb-3">
          {isArabic ? 'المصادقة' : 'Authentication'}
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          {isArabic
            ? 'استخدم مفتاح API الخاص بك في رأس الطلب'
            : 'Include your API key in the request header'}
        </p>
        <div className="bg-gray-50 p-3 rounded font-mono text-sm overflow-x-auto">
          <pre>Authorization: Bearer YOUR_API_KEY</pre>
        </div>
      </Card>

      {/* Endpoints */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">
          {isArabic ? 'نقاط النهاية' : 'Endpoints'}
        </h3>

        {endpoints.map(endpoint => (
          <Card
            key={endpoint.id}
            className="border-2 border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
              onClick={() =>
                setExpandedEndpoint(
                  expandedEndpoint === endpoint.id ? null : endpoint.id
                )
              }
            >
              <div className="flex items-center gap-3 flex-1">
                <Badge className={getMethodColor(endpoint.method)}>
                  {endpoint.method}
                </Badge>
                <div>
                  <p className="font-mono text-sm text-gray-700">
                    {endpoint.path}
                  </p>
                  <p className="text-sm font-semibold text-black">
                    {isArabic ? endpoint.titleAr : endpoint.title}
                  </p>
                </div>
              </div>
              {expandedEndpoint === endpoint.id ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedEndpoint === endpoint.id && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-gray-700">
                    {isArabic
                      ? endpoint.descriptionAr
                      : endpoint.description}
                  </p>
                </div>

                {/* Parameters */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-black mb-2">
                      {isArabic ? 'المعاملات' : 'Parameters'}
                    </h4>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono text-black">
                              {param.name}
                            </code>
                            <Badge className="text-xs bg-gray-200 text-gray-800">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <Badge className="text-xs bg-red-100 text-red-800">
                                {isArabic ? 'مطلوب' : 'Required'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {isArabic
                              ? param.descriptionAr
                              : param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Example */}
                {endpoint.requestExample && (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {isArabic ? 'مثال الطلب' : 'Request Example'}
                    </h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto relative">
                      <pre>{endpoint.requestExample}</pre>
                      <button
                        onClick={() =>
                          handleCopyCode(endpoint.requestExample!, endpoint.id)
                        }
                        className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded transition"
                      >
                        {copiedCode === endpoint.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Response Example */}
                {endpoint.responseExample && (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {isArabic ? 'مثال الاستجابة' : 'Response Example'}
                    </h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto relative">
                      <pre>{endpoint.responseExample}</pre>
                      <button
                        onClick={() =>
                          handleCopyCode(endpoint.responseExample!, endpoint.id)
                        }
                        className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded transition"
                      >
                        {copiedCode === endpoint.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Try Button */}
                <Button className="w-full gap-2 bg-black text-white hover:bg-gray-800">
                  <Play className="w-4 h-4" />
                  {isArabic ? 'جرب الآن' : 'Try Now'}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Error Codes */}
      <Card className="p-4 border-2 border-gray-200">
        <h3 className="font-bold text-black mb-3">
          {isArabic ? 'رموز الخطأ' : 'Error Codes'}
        </h3>
        <div className="space-y-2">
          {[
            { code: 400, message: isArabic ? 'طلب سيء' : 'Bad Request' },
            { code: 401, message: isArabic ? 'غير مصرح' : 'Unauthorized' },
            { code: 403, message: isArabic ? 'محظور' : 'Forbidden' },
            { code: 404, message: isArabic ? 'غير موجود' : 'Not Found' },
            { code: 429, message: isArabic ? 'حد الطلبات' : 'Rate Limited' },
            { code: 500, message: isArabic ? 'خطأ الخادم' : 'Server Error' }
          ].map((error, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2">
              <Badge className="bg-red-100 text-red-800 font-mono">
                {error.code}
              </Badge>
              <span className="text-sm text-gray-700">{error.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
