/**
 * Structured Response UI Component
 * Displays detailed analysis with mood, reasons, impact, recommendations, predictions, risks, what-if scenarios, and historical context
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, AlertTriangle, History, HelpCircle } from 'lucide-react';

interface AnalysisResponse {
  summary: string;
  mood: string;
  whyThisMood: {
    mainReasons: string[];
    emotionalFactors: string[];
    dataPoints: string[];
  };
  societalImpact: {
    howPeopleThink: string;
    behavioralChanges: string[];
    economicImpact: string;
    socialImpact: string;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    stakeholders: string[];
  };
  predictions: {
    nextWeek: string;
    nextMonth: string;
    nextQuarter: string;
    confidence: number;
  };
  risks: {
    immediate: string[];
    emerging: string[];
    longTerm: string[];
    mitigation: string[];
  };
  whatIf: {
    scenario1: { condition: string; outcome: string; probability: number };
    scenario2: { condition: string; outcome: string; probability: number };
    scenario3: { condition: string; outcome: string; probability: number };
  };
  historicalContext: {
    similarPastEvents: string[];
    outcomes: string[];
    lessons: string[];
  };
  confidence: number;
  sources: string[];
}

interface StructuredResponseUIProps {
  analysis: AnalysisResponse;
  isLoading?: boolean;
  error?: string;
}

export function StructuredResponseUI({ analysis, isLoading, error }: StructuredResponseUIProps) {
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Analysis Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analysis Summary</span>
            <Badge variant="outline" className="ml-2">
              Confidence: {Math.round(analysis.confidence * 100)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        {/* Mood Tab */}
        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{analysis.mood}</CardTitle>
              <CardDescription>Current emotional state and sentiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Main Reasons</h4>
                <ul className="space-y-2">
                  {analysis.whyThisMood.mainReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Emotional Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.whyThisMood.emotionalFactors.map((factor, i) => (
                    <Badge key={i} variant="secondary">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Supporting Data</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.whyThisMood.dataPoints.map((point, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Societal Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How People Think</h4>
                <p className="text-sm text-muted-foreground">{analysis.societalImpact.howPeopleThink}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Behavioral Changes</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.societalImpact.behavioralChanges.map((change, i) => (
                    <li key={i}>• {change}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Economic Impact</h4>
                  <p className="text-sm text-muted-foreground">{analysis.societalImpact.economicImpact}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social Impact</h4>
                  <p className="text-sm text-muted-foreground">{analysis.societalImpact.socialImpact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-red-600">Immediate Actions</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.recommendations.immediate.map((action, i) => (
                    <li key={i}>• {action}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-orange-600">Short-term (1-3 months)</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.recommendations.shortTerm.map((action, i) => (
                    <li key={i}>• {action}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Long-term (6-12 months)</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.recommendations.longTerm.map((action, i) => (
                    <li key={i}>• {action}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Stakeholders</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendations.stakeholders.map((stakeholder, i) => (
                    <Badge key={i} variant="outline">
                      {stakeholder}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Confidence Level</h4>
                  <span className="text-sm font-semibold">{Math.round(analysis.predictions.confidence * 100)}%</span>
                </div>
                <Progress value={analysis.predictions.confidence * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Next Week</h4>
                  <p className="text-sm text-muted-foreground">{analysis.predictions.nextWeek}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Next Month</h4>
                  <p className="text-sm text-muted-foreground">{analysis.predictions.nextMonth}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Next Quarter</h4>
                  <p className="text-sm text-muted-foreground">{analysis.predictions.nextQuarter}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-red-600">Immediate Risks</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.risks.immediate.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-orange-600">Emerging Risks</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.risks.emerging.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Long-term Risks</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.risks.longTerm.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Mitigation Strategies</h4>
                <ul className="space-y-1 text-sm">
                  {analysis.risks.mitigation.map((strategy, i) => (
                    <li key={i}>✓ {strategy}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                What-If Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[analysis.whatIf.scenario1, analysis.whatIf.scenario2, analysis.whatIf.scenario3].map((scenario, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Scenario {i + 1}</h4>
                  <p className="text-sm">
                    <span className="font-semibold">If:</span> {scenario.condition}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Then:</span> {scenario.outcome}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Probability:</span>
                    <Progress value={scenario.probability * 100} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold">{Math.round(scenario.probability * 100)}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historical Context Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historical Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Similar Past Events</h4>
            <ul className="space-y-1 text-sm">
              {analysis.historicalContext.similarPastEvents.map((event, i) => (
                <li key={i}>• {event}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Outcomes</h4>
            <ul className="space-y-1 text-sm">
              {analysis.historicalContext.outcomes.map((outcome, i) => (
                <li key={i}>→ {outcome}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Key Lessons</h4>
            <ul className="space-y-1 text-sm">
              {analysis.historicalContext.lessons.map((lesson, i) => (
                <li key={i}>💡 {lesson}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Sources Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.sources.map((source, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
