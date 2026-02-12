/**
 * New Features Dashboard
 * 
 * Displays Daily Emotional Weather, Universal Q&A, and Quick Explanations
 */

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function NewFeaturesDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<'global' | 'mena' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania'>('global');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('is_world_dangerous');
  const [activeTab, setActiveTab] = useState<'weather' | 'questions' | 'explanation' | 'predictions'>('weather');

  // Fetch Daily Weather
  const weatherQuery = trpc.newFeatures.getDailyWeather.useQuery(
    { region: selectedRegion },
    { enabled: activeTab === 'weather' }
  );

  // Fetch Universal Questions
  const questionsQuery = trpc.newFeatures.getAvailableQuestions.useQuery(
    undefined,
    { enabled: activeTab === 'questions' }
  );

  // Fetch Answer
  const answerQuery = trpc.newFeatures.answerQuestion.useQuery(
    { question: selectedQuestion as any },
    { enabled: activeTab === 'questions' && !!selectedQuestion }
  );

  // Fetch Quick Explanation
  const explanationQuery = trpc.newFeatures.getQuickExplanation.useQuery(
    undefined,
    { enabled: activeTab === 'explanation' }
  );

  // Fetch Aggregated Metrics
  const metricsQuery = trpc.newFeatures.getAggregatedMetrics.useQuery(
    { region: selectedRegion },
    { enabled: true }
  );

  const regions = ['global', 'mena', 'europe', 'asia', 'americas', 'africa', 'oceania'] as const;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AmalSense Dashboard</h1>
        <p className="text-muted-foreground">Global Emotional Intelligence Platform</p>
      </div>

      {/* Region Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {regions.map(region => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                onClick={() => setSelectedRegion(region)}
                className="capitalize"
              >
                {region}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="questions">Q&A</TabsTrigger>
          <TabsTrigger value="explanation">What's Happening</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Daily Emotional Weather Tab */}
        <TabsContent value="weather" className="space-y-4">
          {weatherQuery.isLoading ? (
            <div className="text-center py-8">Loading weather data...</div>
          ) : weatherQuery.data ? (
            <div className="space-y-4">
              {/* Global Indices */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Global Mood */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Global Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{weatherQuery.data.data.globalMood.index}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {weatherQuery.data.data.globalMood.label}
                    </p>
                    <div className="mt-2 text-2xl">{weatherQuery.data.data.globalMood.emoji}</div>
                  </CardContent>
                </Card>

                {/* Fear Level */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fear Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{weatherQuery.data.data.fearLevel.index}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {weatherQuery.data.data.fearLevel.label}
                    </p>
                    <div className="mt-2 text-2xl">{weatherQuery.data.data.fearLevel.emoji}</div>
                  </CardContent>
                </Card>

                {/* Stability */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Stability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{weatherQuery.data.data.stabilityIndex.index}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {weatherQuery.data.data.stabilityIndex.label}
                    </p>
                    <div className="mt-2 text-2xl">{weatherQuery.data.data.stabilityIndex.emoji}</div>
                  </CardContent>
                </Card>

                {/* Hope Index */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Hope Index</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{weatherQuery.data.data.hopeIndex.index}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {weatherQuery.data.data.hopeIndex.label}
                    </p>
                    <div className="mt-2 text-2xl">{weatherQuery.data.data.hopeIndex.emoji}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Hotspots */}
              <Card>
                <CardHeader>
                  <CardTitle>Hotspots (Most Affected Regions)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherQuery.data.data.hotspots.map((hotspot, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{hotspot.region}{hotspot.country ? ` (${hotspot.country})` : ''}</p>
                          <p className="text-sm text-muted-foreground">{hotspot.mainConcern}</p>
                          <p className="text-xs text-muted-foreground">Affected: {hotspot.affectedPopulation}</p>
                        </div>
                        <Badge variant={hotspot.severity > 70 ? 'destructive' : hotspot.severity > 40 ? 'default' : 'secondary'}>
                          {hotspot.severity}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Root Causes */}
              <Card>
                <CardHeader>
                  <CardTitle>Root Causes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherQuery.data.data.rootCauses.map((cause, idx) => (
                      <div key={idx} className="p-3 border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium capitalize">{cause.topic}</p>
                          <Badge variant="outline">{cause.impact}/100</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{cause.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Trend: {cause.trend}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Next Hours</p>
                    <p className="text-sm text-muted-foreground">{weatherQuery.data.data.forecast.nextHours}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Next Days</p>
                    <p className="text-sm text-muted-foreground">{weatherQuery.data.data.forecast.nextDays}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Next Weeks</p>
                    <p className="text-sm text-muted-foreground">{weatherQuery.data.data.forecast.nextWeeks}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{weatherQuery.data.data.summary}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No data available</div>
          )}
        </TabsContent>

        {/* Universal Q&A Tab */}
        <TabsContent value="questions" className="space-y-4">
          {questionsQuery.isLoading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : questionsQuery.data ? (
            <div className="space-y-4">
              {/* Question Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Select a Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {questionsQuery.data.data.map(q => (
                      <Button
                        key={q.id}
                        variant={selectedQuestion === q.id ? 'default' : 'outline'}
                        onClick={() => setSelectedQuestion(q.id)}
                        className="w-full justify-start text-left h-auto py-2"
                      >
                        <div>
                          <p className="font-medium">{q.text}</p>
                          <p className="text-xs text-muted-foreground">{q.textArabic}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Answer */}
              {answerQuery.isLoading ? (
                <div className="text-center py-8">Loading answer...</div>
              ) : answerQuery.data ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span>{answerQuery.data.data.emoji}</span>
                        {answerQuery.data.data.answerLabel}
                      </CardTitle>
                      <Badge variant="secondary">{answerQuery.data.data.confidence}% confidence</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Explanation</p>
                      <p className="text-sm text-muted-foreground">{answerQuery.data.data.explanation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Arabic</p>
                      <p className="text-sm text-muted-foreground">{answerQuery.data.data.explanationArabic}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Supporting Data</p>
                      <div className="space-y-2">
                        {answerQuery.data.data.supportingData.map((d, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{d.metric}</span>
                            <span className="font-medium">{d.value} ({d.trend})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Recommendation</p>
                      <p className="text-sm text-muted-foreground">{answerQuery.data.data.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}
        </TabsContent>

        {/* What's Happening Tab */}
        <TabsContent value="explanation" className="space-y-4">
          {explanationQuery.isLoading ? (
            <div className="text-center py-8">Loading explanation...</div>
          ) : explanationQuery.data ? (
            <div className="space-y-4">
              {/* Main Theme */}
              <Card>
                <CardHeader>
                  <CardTitle>Main Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{explanationQuery.data.data.mainTheme}</p>
                  <p className="text-sm text-muted-foreground">{explanationQuery.data.data.mainThemeArabic}</p>
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {explanationQuery.data.data.recentEvents.map((event, idx) => (
                      <div key={idx} className="p-3 border rounded">
                        <p className="font-medium text-sm">{event.event}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{event.topic}</Badge>
                          <Badge variant="outline">{event.region}</Badge>
                          <Badge variant={event.impact === 'critical' ? 'destructive' : event.impact === 'high' ? 'default' : 'secondary'}>
                            {event.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Happening (3 Sentences)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm">{explanationQuery.data.data.explanation.sentence1}</p>
                  </div>
                  <div>
                    <p className="text-sm">{explanationQuery.data.data.explanation.sentence2}</p>
                  </div>
                  <div>
                    <p className="text-sm">{explanationQuery.data.data.explanation.sentence3}</p>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Arabic</p>
                    <div className="space-y-2">
                      <p className="text-sm">{explanationQuery.data.data.explanationArabic.sentence1}</p>
                      <p className="text-sm">{explanationQuery.data.data.explanationArabic.sentence2}</p>
                      <p className="text-sm">{explanationQuery.data.data.explanationArabic.sentence3}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connections */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {explanationQuery.data.data.connections.map((conn, idx) => (
                      <div key={idx} className="p-3 border rounded">
                        <p className="text-sm font-medium mb-2">{conn.connection}</p>
                        <p className="text-xs text-muted-foreground">{conn.connectionArabic}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>What Comes Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{explanationQuery.data.data.forecast.nextStep}</p>
                  <p className="text-sm text-muted-foreground mb-3">{explanationQuery.data.data.forecast.nextStepArabic}</p>
                  <p className="text-xs text-muted-foreground">Timeframe: {explanationQuery.data.data.forecast.timeframe}</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>

      {/* Metrics Summary */}
      {metricsQuery.data && (
        <Card>
          <CardHeader>
            <CardTitle>Aggregated Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">GMI</p>
                <p className="text-2xl font-bold">{metricsQuery.data.data.gmi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CFI</p>
                <p className="text-2xl font-bold">{metricsQuery.data.data.cfi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HRI</p>
                <p className="text-2xl font-bold">{metricsQuery.data.data.hri}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className="text-2xl font-bold capitalize">{metricsQuery.data.data.trend}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
