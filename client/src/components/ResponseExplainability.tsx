import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Calendar, TrendingUp, Award } from 'lucide-react';

interface ExplainabilityData {
  sourcesCount: number;
  articlesCount: number;
  studiesCount: number;
  credibilityScore: number;
  analysisDate: string;
  timeRange: string;
  sources?: Array<{
    name: string;
    credibility: number;
    relevance: number;
  }>;
}

interface ResponseExplainabilityProps {
  data?: ExplainabilityData;
}

export function ResponseExplainability({ data }: ResponseExplainabilityProps) {
  if (!data) return null;

  const credibilityColor = 
    data.credibilityScore >= 80 ? 'text-green-400' :
    data.credibilityScore >= 60 ? 'text-yellow-400' :
    'text-orange-400';

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 animate-card-slide-in">
      <h3 className="text-sm font-semibold text-indigo-400 mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Response Explainability
      </h3>

      <div className="space-y-3">
        {/* Credibility Score */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-muted-foreground">Credibility Score</span>
          </div>
          <span className={`font-semibold ${credibilityColor}`}>
            {data.credibilityScore}%
          </span>
        </div>

        {/* Sources Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">Sources</div>
            <div className="text-lg font-semibold text-blue-400">{data.sourcesCount}</div>
          </div>
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">Articles</div>
            <div className="text-lg font-semibold text-purple-400">{data.articlesCount}</div>
          </div>
          <div className="p-3 bg-background/50 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">Studies</div>
            <div className="text-lg font-semibold text-pink-400">{data.studiesCount}</div>
          </div>
        </div>

        {/* Analysis Metadata */}
        <div className="space-y-2 pt-2 border-t border-indigo-500/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              Analysis Date
            </div>
            <span className="text-foreground font-medium">{data.analysisDate}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              Time Range
            </div>
            <span className="text-foreground font-medium">{data.timeRange}</span>
          </div>
        </div>

        {/* Top Sources */}
        {data.sources && data.sources.length > 0 && (
          <div className="pt-2 border-t border-indigo-500/20">
            <p className="text-xs font-semibold text-indigo-300 mb-2">Top Sources</p>
            <div className="space-y-1">
              {data.sources.slice(0, 3).map((source, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{source.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {source.credibility}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
