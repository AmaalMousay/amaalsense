import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DCFTMetrics {
  gmi: number; // Global Mood Index
  cfi: number; // Collective Feeling Index
  hri: number; // Human Resilience Index
  timestamp: Date;
  trend?: 'up' | 'down' | 'stable';
}

interface DCFTResultsDisplayProps {
  metrics: DCFTMetrics;
  isLoading?: boolean;
}

export function DCFTResultsDisplay({ metrics, isLoading }: DCFTResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const getMetricColor = (value: number) => {
    if (value >= 0.7) return 'text-green-600';
    if (value >= 0.4) return 'text-blue-600';
    return 'text-red-600';
  };

  const getMetricBgColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-50';
    if (value >= 0.4) return 'bg-blue-50';
    return 'bg-red-50';
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Main Overview Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl">Digital Collective Feeling Analysis</CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Analyzed on {metrics.timestamp.toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GMI Card */}
            <div className={`p-6 rounded-lg ${getMetricBgColor(metrics.gmi)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Global Mood Index</h3>
                {getTrendIcon(metrics.trend)}
              </div>
              <div className={`text-4xl font-bold ${getMetricColor(metrics.gmi)}`}>
                {(metrics.gmi * 100).toFixed(1)}%
              </div>
              <div className="mt-4 w-full bg-gray-300 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metrics.gmi >= 0.7
                      ? 'bg-green-600'
                      : metrics.gmi >= 0.4
                      ? 'bg-blue-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${metrics.gmi * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {metrics.gmi >= 0.7
                  ? 'Positive sentiment'
                  : metrics.gmi >= 0.4
                  ? 'Neutral sentiment'
                  : 'Negative sentiment'}
              </p>
            </div>

            {/* CFI Card */}
            <div className={`p-6 rounded-lg ${getMetricBgColor(metrics.cfi)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Collective Feeling Index</h3>
              </div>
              <div className={`text-4xl font-bold ${getMetricColor(metrics.cfi)}`}>
                {(metrics.cfi * 100).toFixed(1)}%
              </div>
              <div className="mt-4 w-full bg-gray-300 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metrics.cfi >= 0.7
                      ? 'bg-green-600'
                      : metrics.cfi >= 0.4
                      ? 'bg-blue-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${metrics.cfi * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Collective emotional coherence
              </p>
            </div>

            {/* HRI Card */}
            <div className={`p-6 rounded-lg ${getMetricBgColor(metrics.hri)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Human Resilience Index</h3>
              </div>
              <div className={`text-4xl font-bold ${getMetricColor(metrics.hri)}`}>
                {(metrics.hri * 100).toFixed(1)}%
              </div>
              <div className="mt-4 w-full bg-gray-300 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metrics.hri >= 0.7
                      ? 'bg-green-600'
                      : metrics.hri >= 0.4
                      ? 'bg-blue-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${metrics.hri * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Societal resilience level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpretation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <p className="font-semibold text-sm">Global Mood</p>
                <p className="text-sm text-gray-600">
                  {metrics.gmi >= 0.7
                    ? 'The global sentiment is predominantly positive, indicating optimism and hope.'
                    : metrics.gmi >= 0.4
                    ? 'The global sentiment is mixed, with both positive and negative emotions present.'
                    : 'The global sentiment is predominantly negative, indicating concern and anxiety.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <p className="font-semibold text-sm">Collective Coherence</p>
                <p className="text-sm text-gray-600">
                  {metrics.cfi >= 0.7
                    ? 'Strong collective agreement on emotional responses to current events.'
                    : metrics.cfi >= 0.4
                    ? 'Moderate diversity in emotional responses across different groups.'
                    : 'Significant polarization in emotional responses across groups.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <p className="font-semibold text-sm">Resilience</p>
                <p className="text-sm text-gray-600">
                  {metrics.hri >= 0.7
                    ? 'Society demonstrates strong resilience and adaptive capacity.'
                    : metrics.hri >= 0.4
                    ? 'Society shows moderate resilience with some vulnerabilities.'
                    : 'Society faces significant resilience challenges.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
