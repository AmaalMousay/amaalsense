import React, { useMemo } from 'react';
import { AlertCircle, Heart, MessageCircle, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EmotionalToneAdapterProps {
  emotion: {
    primary: string;
    intensity: number;
  };
  responseText: string;
  onToneChange?: (tone: 'formal' | 'casual' | 'empathetic' | 'encouraging') => void;
}

export const EmotionalToneAdapter: React.FC<EmotionalToneAdapterProps> = ({
  emotion,
  responseText,
  onToneChange,
}) => {
  const adaptedResponse = useMemo(() => {
    let tone: 'formal' | 'casual' | 'empathetic' | 'encouraging' = 'formal';
    let adaptedText = responseText;
    let supportMessage = '';

    // تحديد النبرة بناءً على العاطفة
    if (emotion.primary === 'sadness' || emotion.primary === 'fear') {
      tone = 'empathetic';
      supportMessage = 'نحن هنا لدعمك وفهم مشاعرك. هذا الموقف يستحق اهتماماً جاداً.';
      adaptedText = adaptedText.replace(/\./g, '.\n\nنحن نفهم أن هذا قد يكون صعباً.');
    } else if (emotion.primary === 'anger') {
      tone = 'empathetic';
      supportMessage = 'غضبك مشروع تماماً. دعنا نعمل معاً على حل هذه المشكلة.';
      adaptedText = adaptedText.replace(/\./g, '.\n\nهذا يتطلب إجراءً حاسماً.');
    } else if (emotion.primary === 'joy' || emotion.primary === 'surprise') {
      tone = 'encouraging';
      supportMessage = 'هذا رائع! دعنا نستفيد من هذه الطاقة الإيجابية.';
    } else {
      tone = 'casual';
      supportMessage = '';
    }

    onToneChange?.(tone);

    return {
      tone,
      adaptedText,
      supportMessage,
      shouldBeVerbose: emotion.intensity > 0.7,
    };
  }, [emotion, responseText, onToneChange]);

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'empathetic':
        return <Heart className="w-4 h-4" />;
      case 'encouraging':
        return <Lightbulb className="w-4 h-4" />;
      case 'casual':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      empathetic: 'تعاطفي',
      encouraging: 'محفز',
      casual: 'ودي',
      formal: 'رسمي',
    };
    return labels[tone] || tone;
  };

  return (
    <div className="space-y-4">
      {/* Tone Indicator */}
      <Card className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getToneIcon(adaptedResponse.tone)}
            <span className="text-sm font-medium">نبرة الإجابة المقترحة</span>
          </div>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-200">
            {getToneLabel(adaptedResponse.tone)}
          </Badge>
        </div>
      </Card>

      {/* Support Message */}
      {adaptedResponse.supportMessage && (
        <Card className="p-4 bg-blue-900/20 border-blue-500/30">
          <p className="text-sm text-blue-100">{adaptedResponse.supportMessage}</p>
        </Card>
      )}

      {/* Adapted Response */}
      <Card className="p-4 bg-gray-900/40 border-gray-700/50">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-200">الإجابة المكيفة</h4>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {adaptedResponse.adaptedText}
          </p>
        </div>
      </Card>

      {/* Verbosity Indicator */}
      {adaptedResponse.shouldBeVerbose && (
        <Card className="p-3 bg-amber-900/20 border-amber-500/30">
          <p className="text-xs text-amber-100">
            ⚠️ نظراً لكثافة العاطفة، قد تحتاج الإجابة إلى تفاصيل أكثر.
          </p>
        </Card>
      )}
    </div>
  );
};

export default EmotionalToneAdapter;
