/**
 * Structured Response UI Component
 * Displays detailed analysis with mood, reasons, impact, recommendations, predictions, risks, what-if scenarios, and historical context
 * All nested properties are safely accessed with fallback defaults to prevent crashes
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, AlertTriangle, History, HelpCircle } from 'lucide-react';

interface AnalysisResponse {
  summary?: string;
  mood?: string;
  whyThisMood?: {
    mainReasons?: string[];
    emotionalFactors?: string[];
    dataPoints?: string[];
  };
  societalImpact?: {
    howPeopleThink?: string;
    behavioralChanges?: string[];
    economicImpact?: string;
    socialImpact?: string;
  };
  recommendations?: {
    immediate?: string[];
    shortTerm?: string[];
    longTerm?: string[];
    stakeholders?: string[];
  };
  predictions?: {
    nextWeek?: string;
    nextMonth?: string;
    nextQuarter?: string;
    confidence?: number;
  };
  risks?: {
    immediate?: string[];
    emerging?: string[];
    longTerm?: string[];
    mitigation?: string[];
  };
  whatIf?: {
    scenario1?: { condition?: string; outcome?: string; probability?: number };
    scenario2?: { condition?: string; outcome?: string; probability?: number };
    scenario3?: { condition?: string; outcome?: string; probability?: number };
  };
  historicalContext?: {
    similarPastEvents?: string[];
    outcomes?: string[];
    lessons?: string[];
  };
  confidence?: number;
  sources?: string[];
  // Allow any additional properties from the pipeline
  [key: string]: any;
}

interface StructuredResponseUIProps {
  analysis: AnalysisResponse;
  isLoading?: boolean;
  error?: string;
}

// Safe defaults
const emptyArr: string[] = [];
const defaultScenario = { condition: '', outcome: '', probability: 0 };

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

  if (!analysis) {
    return null;
  }

  // Safe access helpers
  const whyThisMood = analysis.whyThisMood || {};
  const mainReasons = whyThisMood.mainReasons || emptyArr;
  const emotionalFactors = whyThisMood.emotionalFactors || emptyArr;
  const dataPoints = whyThisMood.dataPoints || emptyArr;

  const societalImpact = analysis.societalImpact || {};
  const behavioralChanges = societalImpact.behavioralChanges || emptyArr;

  const recommendations = analysis.recommendations || {};
  const immediateActions = recommendations.immediate || emptyArr;
  const shortTermActions = recommendations.shortTerm || emptyArr;
  const longTermActions = recommendations.longTerm || emptyArr;
  const stakeholders = recommendations.stakeholders || emptyArr;

  const predictions = analysis.predictions || {};
  const predictionConfidence = predictions.confidence || 0;

  const risks = analysis.risks || {};
  const immediateRisks = risks.immediate || emptyArr;
  const emergingRisks = risks.emerging || emptyArr;
  const longTermRisks = risks.longTerm || emptyArr;
  const mitigationStrategies = risks.mitigation || emptyArr;

  const whatIf = analysis.whatIf || {};
  const scenario1 = whatIf.scenario1 || defaultScenario;
  const scenario2 = whatIf.scenario2 || defaultScenario;
  const scenario3 = whatIf.scenario3 || defaultScenario;
  const scenarios = [scenario1, scenario2, scenario3].filter(s => s.condition || s.outcome);

  const historicalContext = analysis.historicalContext || {};
  const similarPastEvents = historicalContext.similarPastEvents || emptyArr;
  const outcomes = historicalContext.outcomes || emptyArr;
  const lessons = historicalContext.lessons || emptyArr;

  const confidence = analysis.confidence || 0;
  const sources = analysis.sources || emptyArr;

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      {analysis.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Summary</span>
              {confidence > 0 && (
                <Badge variant="outline" className="ml-2">
                  Confidence: {Math.round(confidence * 100)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>
      )}

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
              <CardTitle className="text-2xl">{analysis.mood || 'Unknown'}</CardTitle>
              <CardDescription>Current emotional state and sentiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mainReasons.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Main Reasons</h4>
                  <ul className="space-y-2">
                    {mainReasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {emotionalFactors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Emotional Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {emotionalFactors.map((factor, i) => (
                      <Badge key={i} variant="secondary">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {dataPoints.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Supporting Data</h4>
                  <ul className="space-y-1 text-sm">
                    {dataPoints.map((point, i) => (
                      <li key={i} className="text-muted-foreground">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mainReasons.length === 0 && emotionalFactors.length === 0 && dataPoints.length === 0 && (
                <p className="text-muted-foreground text-sm">No detailed mood analysis available for this query.</p>
              )}
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
              {societalImpact.howPeopleThink && (
                <div>
                  <h4 className="font-semibold mb-2">How People Think</h4>
                  <p className="text-sm text-muted-foreground">{societalImpact.howPeopleThink}</p>
                </div>
              )}

              {behavioralChanges.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Behavioral Changes</h4>
                  <ul className="space-y-1 text-sm">
                    {behavioralChanges.map((change, i) => (
                      <li key={i}>• {change}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {societalImpact.economicImpact && (
                  <div>
                    <h4 className="font-semibold mb-2">Economic Impact</h4>
                    <p className="text-sm text-muted-foreground">{societalImpact.economicImpact}</p>
                  </div>
                )}
                {societalImpact.socialImpact && (
                  <div>
                    <h4 className="font-semibold mb-2">Social Impact</h4>
                    <p className="text-sm text-muted-foreground">{societalImpact.socialImpact}</p>
                  </div>
                )}
              </div>

              {!societalImpact.howPeopleThink && behavioralChanges.length === 0 && !societalImpact.economicImpact && !societalImpact.socialImpact && (
                <p className="text-muted-foreground text-sm">No societal impact data available for this query.</p>
              )}
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
              {immediateActions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Immediate Actions</h4>
                  <ul className="space-y-1 text-sm">
                    {immediateActions.map((action, i) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {shortTermActions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">Short-term (1-3 months)</h4>
                  <ul className="space-y-1 text-sm">
                    {shortTermActions.map((action, i) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {longTermActions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Long-term (6-12 months)</h4>
                  <ul className="space-y-1 text-sm">
                    {longTermActions.map((action, i) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {stakeholders.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Stakeholders</h4>
                  <div className="flex flex-wrap gap-2">
                    {stakeholders.map((stakeholder, i) => (
                      <Badge key={i} variant="outline">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {immediateActions.length === 0 && shortTermActions.length === 0 && longTermActions.length === 0 && (
                <p className="text-muted-foreground text-sm">No recommendations available for this query.</p>
              )}
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
              {predictionConfidence > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Confidence Level</h4>
                    <span className="text-sm font-semibold">{Math.round(predictionConfidence * 100)}%</span>
                  </div>
                  <Progress value={predictionConfidence * 100} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.nextWeek && (
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Next Week</h4>
                    <p className="text-sm text-muted-foreground">{predictions.nextWeek}</p>
                  </div>
                )}
                {predictions.nextMonth && (
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Next Month</h4>
                    <p className="text-sm text-muted-foreground">{predictions.nextMonth}</p>
                  </div>
                )}
                {predictions.nextQuarter && (
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Next Quarter</h4>
                    <p className="text-sm text-muted-foreground">{predictions.nextQuarter}</p>
                  </div>
                )}
              </div>

              {!predictions.nextWeek && !predictions.nextMonth && !predictions.nextQuarter && (
                <p className="text-muted-foreground text-sm">No predictions available for this query.</p>
              )}
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
              {immediateRisks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Immediate Risks</h4>
                  <ul className="space-y-1 text-sm">
                    {immediateRisks.map((risk, i) => (
                      <li key={i}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {emergingRisks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">Emerging Risks</h4>
                  <ul className="space-y-1 text-sm">
                    {emergingRisks.map((risk, i) => (
                      <li key={i}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {longTermRisks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Long-term Risks</h4>
                  <ul className="space-y-1 text-sm">
                    {longTermRisks.map((risk, i) => (
                      <li key={i}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {mitigationStrategies.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Mitigation Strategies</h4>
                  <ul className="space-y-1 text-sm">
                    {mitigationStrategies.map((strategy, i) => (
                      <li key={i}>✓ {strategy}</li>
                    ))}
                  </ul>
                </div>
              )}

              {immediateRisks.length === 0 && emergingRisks.length === 0 && longTermRisks.length === 0 && (
                <p className="text-muted-foreground text-sm">No risk assessment available for this query.</p>
              )}
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
              {scenarios.length > 0 ? (
                scenarios.map((scenario, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold">Scenario {i + 1}</h4>
                    {scenario.condition && (
                      <p className="text-sm">
                        <span className="font-semibold">If:</span> {scenario.condition}
                      </p>
                    )}
                    {scenario.outcome && (
                      <p className="text-sm">
                        <span className="font-semibold">Then:</span> {scenario.outcome}
                      </p>
                    )}
                    {(scenario.probability || 0) > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Probability:</span>
                        <Progress value={(scenario.probability || 0) * 100} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold">{Math.round((scenario.probability || 0) * 100)}%</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No what-if scenarios available for this query.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historical Context Card */}
      {(similarPastEvents.length > 0 || outcomes.length > 0 || lessons.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historical Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {similarPastEvents.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Similar Past Events</h4>
                <ul className="space-y-1 text-sm">
                  {similarPastEvents.map((event, i) => (
                    <li key={i}>• {event}</li>
                  ))}
                </ul>
              </div>
            )}

            {outcomes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Outcomes</h4>
                <ul className="space-y-1 text-sm">
                  {outcomes.map((outcome, i) => (
                    <li key={i}>→ {outcome}</li>
                  ))}
                </ul>
              </div>
            )}

            {lessons.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Lessons</h4>
                <ul className="space-y-1 text-sm">
                  {lessons.map((lesson, i) => (
                    <li key={i}>💡 {lesson}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sources Card */}
      {sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
