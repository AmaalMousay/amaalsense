import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, AlertTriangle, Link as LinkIcon } from 'lucide-react';

interface Suggestion {
  question: string;
  relevance: number;
  expectedValue: string;
}

interface SuggestionCardsProps {
  followUpQuestions?: Suggestion[];
  relatedTopics?: string[];
  importantWarnings?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export const SuggestionCards: React.FC<SuggestionCardsProps> = ({
  followUpQuestions = [],
  relatedTopics = [],
  importantWarnings = [],
  onSuggestionClick,
}) => {
  const renderRelevanceBadge = (relevance: number) => {
    const percentage = Math.round(relevance * 100);
    let color = 'bg-red-500/20 text-red-200';
    
    if (relevance >= 0.8) {
      color = 'bg-green-500/20 text-green-200';
    } else if (relevance >= 0.6) {
      color = 'bg-yellow-500/20 text-yellow-200';
    } else if (relevance >= 0.4) {
      color = 'bg-orange-500/20 text-orange-200';
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
        {percentage}% ملاءمة
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Follow-up Questions */}
      {followUpQuestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            أسئلة متابعة مقترحة
          </h3>
          <div className="grid gap-2">
            {followUpQuestions.map((q, idx) => (
              <Card
                key={idx}
                className="p-3 bg-gray-900/40 border-gray-700/50 hover:border-purple-500/50 cursor-pointer transition-all"
                onClick={() => onSuggestionClick?.(q.question)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-300 flex-1">{q.question}</p>
                    <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    {renderRelevanceBadge(q.relevance)}
                    <span className="text-xs text-gray-400">{q.expectedValue}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Related Topics */}
      {relatedTopics.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-blue-400" />
            موضوعات ذات صلة
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="bg-blue-900/20 border-blue-500/30 text-blue-200 hover:bg-blue-900/40 hover:border-blue-500/50"
                onClick={() => onSuggestionClick?.(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Important Warnings */}
      {importantWarnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            تحذيرات مهمة
          </h3>
          <div className="space-y-2">
            {importantWarnings.map((warning, idx) => (
              <Card
                key={idx}
                className="p-3 bg-red-900/20 border-red-500/30"
              >
                <p className="text-sm text-red-200">{warning}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {followUpQuestions.length === 0 &&
        relatedTopics.length === 0 &&
        importantWarnings.length === 0 && (
          <Card className="p-4 bg-gray-900/40 border-gray-700/50 text-center">
            <p className="text-sm text-gray-400">لا توجد اقتراحات إضافية في الوقت الحالي</p>
          </Card>
        )}
    </div>
  );
};

export default SuggestionCards;
