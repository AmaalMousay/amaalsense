import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number; // 0-100
  alternatives?: string[];
  needsMoreInfo?: string[];
  disclaimers?: string[];
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  alternatives = [],
  needsMoreInfo = [],
  disclaimers = [],
}) => {
  const getConfidenceLevel = (conf: number) => {
    if (conf >= 80) return { label: 'عالية جداً', color: 'bg-green-500/20 border-green-500/30', icon: CheckCircle };
    if (conf >= 60) return { label: 'عالية', color: 'bg-blue-500/20 border-blue-500/30', icon: CheckCircle };
    if (conf >= 40) return { label: 'متوسطة', color: 'bg-yellow-500/20 border-yellow-500/30', icon: HelpCircle };
    return { label: 'منخفضة', color: 'bg-red-500/20 border-red-500/30', icon: AlertCircle };
  };

  const level = getConfidenceLevel(confidence);
  const Icon = level.icon;

  return (
    <div className="space-y-4">
      {/* Confidence Bar */}
      <Card className={`p-4 ${level.color} border`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm">مستوى الثقة</span>
            </div>
            <span className="text-lg font-bold">{confidence}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                confidence >= 80
                  ? 'bg-green-500'
                  : confidence >= 60
                  ? 'bg-blue-500'
                  : confidence >= 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="text-xs text-gray-300">
            {level.label} - {confidence < 50 ? 'يُنصح بالحذر من هذه الإجابة' : 'هذه الإجابة موثوقة نسبياً'}
          </p>
        </div>
      </Card>

      {/* Alternatives */}
      {alternatives.length > 0 && confidence < 70 && (
        <Card className="p-4 bg-purple-900/20 border-purple-500/30">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-purple-200">بدائل ممكنة</h4>
            <ul className="space-y-1">
              {alternatives.map((alt, idx) => (
                <li key={idx} className="text-sm text-purple-100 flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Needs More Info */}
      {needsMoreInfo.length > 0 && (
        <Card className="p-4 bg-blue-900/20 border-blue-500/30">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-200">لتحسين الإجابة، نحتاج إلى معلومات عن</h4>
            <ul className="space-y-1">
              {needsMoreInfo.map((info, idx) => (
                <li key={idx} className="text-sm text-blue-100 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">→</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Disclaimers */}
      {disclaimers.length > 0 && (
        <Card className="p-4 bg-orange-900/20 border-orange-500/30">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-200">تنويهات مهمة</h4>
            <ul className="space-y-1">
              {disclaimers.map((disclaimer, idx) => (
                <li key={idx} className="text-sm text-orange-100 flex items-start gap-2">
                  <span className="text-orange-400 mt-1">⚠️</span>
                  <span>{disclaimer}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ConfidenceIndicator;
