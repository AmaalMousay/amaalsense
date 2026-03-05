// @ts-nocheck
/**
 * RESPONSE EXPLAINABILITY - CONNECTED VERSION
 * 
 * يعرض شرح الاستجابة مع بيانات حقيقية من الخادم
 * - يستخدم explainabilityRouter.getResponseExplanation للحصول على البيانات
 * - يعرض الأسباب والمصادر والثقة
 * - يدعم التفاعل والاستفسارات المتقدمة
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, FileText, Link2, TrendingUp } from 'lucide-react';

interface ResponseExplanation {
  responseId: string;
  question: string;
  mainReason: string;
  supportingReasons: string[];
  sources: Array<{
    name: string;
    url: string;
    credibility: number;
    relevance: number;
    date: Date;
  }>;
  confidence: number;
  limitations: string[];
  alternativePerspectives: string[];
  methodology: string;
  dataQuality: number;
  timestamp: Date;
}

interface ResponseExplainabilityConnectedProps {
  responseId: string;
  onExplanationReady?: (explanation: ResponseExplanation) => void;
}

export function ResponseExplainabilityConnected({
  responseId,
  onExplanationReady
}: ResponseExplainabilityConnectedProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>('mainReason');

  // Fetch response explanation from backend
  const { data: explanationData, isLoading, error } = trpc.explainability.getResponseExplanation.useQuery({
    responseId
  });

  const explanation = explanationData?.data;

  React.useEffect(() => {
    if (explanation && onExplanationReady) {
      onExplanationReady(explanation);
    }
  }, [explanation, onExplanationReady]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#000000';
    if (confidence >= 60) return '#333333';
    if (confidence >= 40) return '#666666';
    return '#999999';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'عالية جداً';
    if (confidence >= 60) return 'عالية';
    if (confidence >= 40) return 'متوسطة';
    return 'منخفضة';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 bg-white border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">جاري تحميل شرح الاستجابة...</span>
        </div>
      </Card>
    );
  }

  if (error || !explanation) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل شرح الاستجابة</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Question and Confidence */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">السؤال:</p>
          <p className="text-lg font-semibold text-gray-900">{explanation.question}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">مستوى الثقة</p>
            <p className="text-2xl font-bold" style={{ color: getConfidenceColor(explanation.confidence) }}>
              {explanation.confidence.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">{getConfidenceLabel(explanation.confidence)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">جودة البيانات</p>
            <p className="text-2xl font-bold text-gray-900">{explanation.dataQuality.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 mt-1">معايير عالية</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">عدد المصادر</p>
            <p className="text-2xl font-bold text-gray-900">{explanation.sources.length}</p>
            <p className="text-xs text-gray-500 mt-1">مصدر موثوق</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">الثقة:</span>
          <div className="flex-1 bg-gray-200 rounded h-3">
            <div
              className="h-full rounded transition-all"
              style={{
                width: `${explanation.confidence}%`,
                backgroundColor: getConfidenceColor(explanation.confidence)
              }}
            />
          </div>
        </div>
      </Card>

      {/* Main Reason */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <button
          onClick={() => toggleSection('mainReason')}
          className="w-full flex items-start justify-between mb-4 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-gray-900 mt-0.5" />
            <h4 className="text-lg font-bold text-gray-900">السبب الرئيسي</h4>
          </div>
          <span className="text-gray-600">{expandedSection === 'mainReason' ? '−' : '+'}</span>
        </button>

        {expandedSection === 'mainReason' && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-900 leading-relaxed">{explanation.mainReason}</p>
          </div>
        )}
      </Card>

      {/* Supporting Reasons */}
      {explanation.supportingReasons.length > 0 && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <button
            onClick={() => toggleSection('supportingReasons')}
            className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
          >
            <h4 className="text-lg font-bold text-gray-900">الأسباب الداعمة</h4>
            <span className="text-gray-600">{expandedSection === 'supportingReasons' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'supportingReasons' && (
            <div className="space-y-3">
              {explanation.supportingReasons.map((reason, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-1">السبب {index + 1}:</p>
                  <p className="text-sm text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Sources */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <button
          onClick={() => toggleSection('sources')}
          className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-gray-900" />
            <h4 className="text-lg font-bold text-gray-900">المصادر</h4>
          </div>
          <span className="text-gray-600">{expandedSection === 'sources' ? '−' : '+'}</span>
        </button>

        {expandedSection === 'sources' && (
          <div className="space-y-3">
            {explanation.sources.map((source, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{source.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(source.date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">الموثوقية</p>
                    <p className="font-bold text-gray-900">{source.credibility.toFixed(0)}%</p>
                  </div>
                </div>

                {/* Credibility Bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-gray-200 rounded h-1.5">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${source.credibility}%`,
                        backgroundColor: getConfidenceColor(source.credibility)
                      }}
                    />
                  </div>
                </div>

                {/* Relevance */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">الملاءمة:</span>
                  <div className="flex-1 bg-gray-200 rounded h-1.5">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${source.relevance}%`,
                        backgroundColor: getConfidenceColor(source.relevance)
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                    {source.relevance.toFixed(0)}%
                  </span>
                </div>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-900 mt-2 inline-block underline"
                  >
                    عرض المصدر
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Limitations */}
      {explanation.limitations.length > 0 && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <button
            onClick={() => toggleSection('limitations')}
            className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
          >
            <h4 className="text-lg font-bold text-gray-900">القيود والتحفظات</h4>
            <span className="text-gray-600">{expandedSection === 'limitations' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'limitations' && (
            <div className="space-y-2">
              {explanation.limitations.map((limitation, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">• {limitation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Alternative Perspectives */}
      {explanation.alternativePerspectives.length > 0 && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <button
            onClick={() => toggleSection('perspectives')}
            className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
          >
            <h4 className="text-lg font-bold text-gray-900">وجهات نظر بديلة</h4>
            <span className="text-gray-600">{expandedSection === 'perspectives' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'perspectives' && (
            <div className="space-y-3">
              {explanation.alternativePerspectives.map((perspective, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-1">الوجهة {index + 1}:</p>
                  <p className="text-sm text-gray-700">{perspective}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Methodology */}
      {explanation.methodology && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <button
            onClick={() => toggleSection('methodology')}
            className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
          >
            <h4 className="text-lg font-bold text-gray-900">المنهجية</h4>
            <span className="text-gray-600">{expandedSection === 'methodology' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'methodology' && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{explanation.methodology}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
