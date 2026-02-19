import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Zap, Eye } from 'lucide-react';

interface ContextualData {
  previousContext?: string[];
  detectedTopic?: string;
  conversationHistory?: number;
  contextRelevance?: number;
}

interface ContextualUnderstandingCardProps {
  contextual?: ContextualData;
}

export function ContextualUnderstandingCard({ contextual }: ContextualUnderstandingCardProps) {
  if (!contextual) return null;

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
      <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Contextual Understanding
      </h3>

      <div className="space-y-3">
        {/* Detected Topic */}
        {contextual.detectedTopic && (
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Detected Topic:</p>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                {contextual.detectedTopic}
              </Badge>
            </div>
          </div>
        )}

        {/* Previous Context */}
        {contextual.previousContext && contextual.previousContext.length > 0 && (
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Previous Context:</p>
              <div className="space-y-1">
                {contextual.previousContext.slice(0, 3).map((context, idx) => (
                  <p key={idx} className="text-xs text-teal-300 line-clamp-1">
                    • {context}
                  </p>
                ))}
                {contextual.previousContext.length > 3 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{contextual.previousContext.length - 3} more
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Conversation History */}
        {contextual.conversationHistory !== undefined && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Conversation Messages:</span>
            <span className="font-medium text-teal-300">{contextual.conversationHistory}</span>
          </div>
        )}

        {/* Context Relevance */}
        {contextual.contextRelevance !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Context Relevance:</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${contextual.contextRelevance}%` }}
              />
            </div>
            <span className="text-xs font-medium text-emerald-400">
              {Math.round(contextual.contextRelevance)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
