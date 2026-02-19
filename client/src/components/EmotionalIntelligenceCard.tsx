import { Card } from '@/components/ui/card';
import { Sparkles, Activity } from 'lucide-react';

interface EmotionalIntelligenceData {
  detectedEmotion?: string;
  adaptedTone?: string;
  emotionalContext?: string;
}

interface ConfidenceData {
  percentage: number;
  level: string;
  factors?: string[];
}

interface EmotionalIntelligenceCardProps {
  emotional?: EmotionalIntelligenceData;
  confidence?: ConfidenceData;
}

export function EmotionalIntelligenceCard({ emotional, confidence }: EmotionalIntelligenceCardProps) {
  return (
    <>
      {/* Emotional Intelligence Display */}
      {emotional && (
        <Card className="p-4 mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 animate-card-slide-in">
          <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Emotional Intelligence Analysis
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Detected Emotion:</span>
              <span className="font-medium capitalize text-purple-400">
                {emotional.detectedEmotion || 'Neutral'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Adapted Tone:</span>
              <span className="font-medium capitalize text-pink-400">
                {emotional.adaptedTone || 'Professional'}
              </span>
            </div>
            {emotional.emotionalContext && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Context:</span>
                <span className="text-xs text-pink-300 text-right max-w-[60%]">
                  {emotional.emotionalContext}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Confidence Indicator */}
      {confidence && (
        <Card className="p-4 mb-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 animate-card-slide-in">
          <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Confidence Score
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    confidence.percentage >= 80 ? 'bg-green-500' :
                    confidence.percentage >= 60 ? 'bg-yellow-500' :
                    confidence.percentage >= 40 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${confidence.percentage}%` }}
                />
              </div>
            </div>
            <span className="font-semibold text-blue-400 min-w-fit">
              {confidence.percentage}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {confidence.level}
          </p>
          {confidence.factors && confidence.factors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-500/20">
              <p className="text-xs font-semibold text-blue-300 mb-2">Confidence Factors:</p>
              <div className="flex flex-wrap gap-1">
                {confidence.factors.map((factor, idx) => (
                  <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
