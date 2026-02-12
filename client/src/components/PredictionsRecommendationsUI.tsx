/**
 * Predictions & Recommendations UI Component
 * Displays detailed predictions and actionable recommendations
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle2, Clock, Users, AlertCircle, Download } from 'lucide-react';

interface Prediction {
  timeframe: string;
  description: string;
  confidence: number;
  indicators: string[];
  probability: number;
}

interface Recommendation {
  priority: 'immediate' | 'short-term' | 'long-term';
  action: string;
  rationale: string;
  resources: string[];
  timeline: string;
  expectedOutcome: string;
  stakeholders: string[];
  metrics: string[];
}

interface PredictionsRecommendationsUIProps {
  predictions?: Prediction[];
  recommendations?: Recommendation[];
  isLoading?: boolean;
  onExport?: () => void;
}

const defaultPredictions: Prediction[] = [
  {
    timeframe: 'Next 7 Days',
    description: 'Expect continued volatility with slight improvement in sentiment',
    confidence: 0.85,
    indicators: ['GMI trending up', 'CFI stabilizing', 'News volume decreasing'],
    probability: 0.75
  },
  {
    timeframe: 'Next 30 Days',
    description: 'Stabilization expected as key issues are resolved',
    confidence: 0.72,
    indicators: ['Policy announcements', 'Economic data releases', 'Regional developments'],
    probability: 0.68
  },
  {
    timeframe: 'Next 90 Days',
    description: 'Long-term positive trend with potential challenges',
    confidence: 0.65,
    indicators: ['Structural reforms', 'International relations', 'Market performance'],
    probability: 0.60
  }
];

const defaultRecommendations: Recommendation[] = [
  {
    priority: 'immediate',
    action: 'Establish Crisis Communication Team',
    rationale: 'Rapid response to emerging issues can prevent sentiment deterioration',
    resources: ['Communications staff', 'Social media monitoring tools', 'Media contacts'],
    timeline: 'Within 24 hours',
    expectedOutcome: 'Faster response to public concerns, improved trust',
    stakeholders: ['Government', 'Media', 'Public'],
    metrics: ['Response time', 'Sentiment improvement', 'Public trust score']
  },
  {
    priority: 'immediate',
    action: 'Launch Transparency Initiative',
    rationale: 'Increased transparency directly correlates with improved public sentiment',
    resources: ['Data analysts', 'Communications team', 'Public relations'],
    timeline: 'Within 1 week',
    expectedOutcome: 'Increased public trust, reduced misinformation',
    stakeholders: ['Government', 'Civil society', 'Media'],
    metrics: ['Transparency index', 'Trust score', 'Misinformation incidents']
  },
  {
    priority: 'short-term',
    action: 'Implement Economic Support Programs',
    rationale: 'Direct economic support addresses root causes of negative sentiment',
    resources: ['Budget allocation', 'Program management', 'Distribution networks'],
    timeline: '2-4 weeks',
    expectedOutcome: 'Improved economic indicators, better public sentiment',
    stakeholders: ['Government', 'Businesses', 'Citizens'],
    metrics: ['Employment rate', 'Income levels', 'Economic confidence']
  },
  {
    priority: 'short-term',
    action: 'Strengthen Social Safety Nets',
    rationale: 'Security and stability are fundamental to positive sentiment',
    resources: ['Healthcare', 'Education', 'Social services'],
    timeline: '1-3 months',
    expectedOutcome: 'Improved quality of life, reduced anxiety',
    stakeholders: ['Government', 'Health sector', 'Citizens'],
    metrics: ['Healthcare access', 'Education quality', 'Safety perception']
  },
  {
    priority: 'long-term',
    action: 'Build Institutional Capacity',
    rationale: 'Strong institutions are essential for sustainable positive sentiment',
    resources: ['Training programs', 'Infrastructure', 'Technology'],
    timeline: '6-12 months',
    expectedOutcome: 'Improved governance, long-term stability',
    stakeholders: ['Government', 'Institutions', 'International partners'],
    metrics: ['Governance index', 'Institutional strength', 'Long-term stability']
  }
];

export function PredictionsRecommendationsUI({
  predictions = defaultPredictions,
  recommendations = defaultRecommendations,
  isLoading = false,
  onExport
}: PredictionsRecommendationsUIProps) {
  const [selectedPriority, setSelectedPriority] = useState<'immediate' | 'short-term' | 'long-term'>('immediate');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'short-term':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'long-term':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return <AlertCircle className="h-4 w-4" />;
      case 'short-term':
        return <Clock className="h-4 w-4" />;
      case 'long-term':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading predictions and recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Predictions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictions
              </CardTitle>
              <CardDescription>
                Forward-looking analysis based on current trends and historical patterns
              </CardDescription>
            </div>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((prediction, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold">{prediction.timeframe}</h4>
                <Badge variant="outline">
                  {Math.round(prediction.confidence * 100)}% Confidence
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{prediction.description}</p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">Probability</span>
                  <span className="text-xs font-semibold">{Math.round(prediction.probability * 100)}%</span>
                </div>
                <Progress value={prediction.probability * 100} className="h-2" />
              </div>

              <div>
                <p className="text-xs font-semibold mb-2">Key Indicators</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.indicators.map((indicator, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>
            Actionable steps prioritized by urgency and impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Priority Filter */}
          <div className="flex gap-2 border-b pb-4">
            {(['immediate', 'short-term', 'long-term'] as const).map(priority => (
              <Button
                key={priority}
                variant={selectedPriority === priority ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority(priority)}
                className="capitalize"
              >
                {priority === 'short-term' ? 'Short-term' : priority}
              </Button>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="space-y-3">
            {recommendations
              .filter(rec => rec.priority === selectedPriority)
              .map((recommendation, i) => (
                <div
                  key={i}
                  className={`border rounded-lg overflow-hidden ${getPriorityColor(recommendation.priority)}`}
                >
                  <button
                    onClick={() =>
                      setExpandedRecommendation(
                        expandedRecommendation === `${i}-${recommendation.priority}` ? null : `${i}-${recommendation.priority}`
                      )
                    }
                    className="w-full p-4 text-left hover:opacity-80 transition-opacity flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {getPriorityIcon(recommendation.priority)}
                      <div>
                        <p className="font-semibold text-sm">{recommendation.action}</p>
                        <p className="text-xs opacity-75 mt-1">{recommendation.timeline}</p>
                      </div>
                    </div>
                    <span className="text-xs opacity-75">
                      {expandedRecommendation === `${i}-${recommendation.priority}` ? '▼' : '▶'}
                    </span>
                  </button>

                  {expandedRecommendation === `${i}-${recommendation.priority}` && (
                    <div className="border-t p-4 bg-white/50 space-y-3">
                      <div>
                        <p className="text-xs font-semibold mb-1">Rationale</p>
                        <p className="text-sm">{recommendation.rationale}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-1">Expected Outcome</p>
                        <p className="text-sm">{recommendation.expectedOutcome}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-2">Resources Required</p>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.resources.map((resource, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-2">Key Stakeholders</p>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.stakeholders.map((stakeholder, j) => (
                            <Badge key={j} variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {stakeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold mb-2">Success Metrics</p>
                        <ul className="space-y-1">
                          {recommendation.metrics.map((metric, j) => (
                            <li key={j} className="text-xs flex items-center gap-2">
                              <span className="text-primary">✓</span>
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Immediate Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.filter(r => r.priority === 'immediate').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Actions within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Short-term Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.filter(r => r.priority === 'short-term').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Actions within 1-3 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Long-term Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.filter(r => r.priority === 'long-term').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Actions within 6-12 months</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
