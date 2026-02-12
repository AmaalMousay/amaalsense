/**
 * What-If Scenarios UI Component
 * Displays alternative scenarios with probability sliders and outcome comparisons
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, TrendingDown, TrendingUp, Zap } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  condition: string;
  description: string;
  probability: number;
  impact: 'positive' | 'negative' | 'neutral';
  outcomes: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  indicators: string[];
  timeline: string;
  affectedAreas: string[];
  mitigation?: string[];
}

interface WhatIfScenariosUIProps {
  scenarios?: Scenario[];
  baselineScenario?: Scenario;
  isLoading?: boolean;
  onScenarioSelect?: (scenarioId: string) => void;
}

const defaultScenarios: Scenario[] = [
  {
    id: 'scenario-1',
    title: 'Positive Economic Growth',
    condition: 'If economic indicators improve by 15%',
    description: 'Strong economic growth driven by increased investment and job creation',
    probability: 0.65,
    impact: 'positive',
    outcomes: {
      shortTerm: [
        'Increased consumer confidence',
        'Rising employment rates',
        'Improved business sentiment'
      ],
      mediumTerm: [
        'Higher wages and purchasing power',
        'Expanded business investments',
        'Improved public services'
      ],
      longTerm: [
        'Sustainable economic development',
        'Reduced poverty rates',
        'Improved quality of life'
      ]
    },
    indicators: ['GDP growth', 'Employment rate', 'Consumer spending', 'Business investment'],
    timeline: '6-12 months',
    affectedAreas: ['Economy', 'Employment', 'Consumer sentiment', 'Business environment']
  },
  {
    id: 'scenario-2',
    title: 'Political Instability',
    condition: 'If political tensions escalate significantly',
    description: 'Increased political uncertainty leading to institutional challenges',
    probability: 0.35,
    impact: 'negative',
    outcomes: {
      shortTerm: [
        'Market volatility',
        'Investor uncertainty',
        'Public anxiety increases'
      ],
      mediumTerm: [
        'Capital flight',
        'Economic slowdown',
        'Policy delays'
      ],
      longTerm: [
        'Institutional weakening',
        'Long-term economic stagnation',
        'Social fragmentation'
      ]
    },
    indicators: ['Political tension index', 'Market volatility', 'Investor confidence', 'Public trust'],
    timeline: '3-6 months',
    affectedAreas: ['Politics', 'Economy', 'Public sentiment', 'Institutions'],
    mitigation: [
      'Strengthen democratic institutions',
      'Increase political dialogue',
      'Ensure transparent governance',
      'Protect investor confidence'
    ]
  },
  {
    id: 'scenario-3',
    title: 'Regional Cooperation Breakthrough',
    condition: 'If regional cooperation agreements are signed',
    description: 'Enhanced regional integration leading to shared prosperity',
    probability: 0.45,
    impact: 'positive',
    outcomes: {
      shortTerm: [
        'Increased trade flows',
        'Joint infrastructure projects',
        'Improved diplomatic relations'
      ],
      mediumTerm: [
        'Economic integration benefits',
        'Shared security arrangements',
        'Cultural exchange growth'
      ],
      longTerm: [
        'Regional stability',
        'Collective prosperity',
        'Reduced conflicts'
      ]
    },
    indicators: ['Trade volume', 'Diplomatic relations', 'Investment flows', 'Regional stability'],
    timeline: '12-24 months',
    affectedAreas: ['International relations', 'Trade', 'Economy', 'Security']
  },
  {
    id: 'scenario-4',
    title: 'Climate Crisis Impact',
    condition: 'If climate-related disasters increase',
    description: 'Environmental challenges creating economic and social pressures',
    probability: 0.55,
    impact: 'negative',
    outcomes: {
      shortTerm: [
        'Increased disaster response costs',
        'Agricultural disruption',
        'Infrastructure damage'
      ],
      mediumTerm: [
        'Migration pressures',
        'Resource scarcity',
        'Economic losses'
      ],
      longTerm: [
        'Demographic shifts',
        'Permanent economic impacts',
        'Social instability'
      ]
    },
    indicators: ['Climate events', 'Agricultural output', 'Disaster costs', 'Migration flows'],
    timeline: 'Ongoing',
    affectedAreas: ['Environment', 'Agriculture', 'Economy', 'Social stability'],
    mitigation: [
      'Invest in climate resilience',
      'Develop adaptation strategies',
      'Support affected communities',
      'Transition to renewable energy'
    ]
  }
];

const baselineScenario: Scenario = {
  id: 'baseline',
  title: 'Baseline Scenario',
  condition: 'Current trends continue',
  description: 'Continuation of current trajectory with minor fluctuations',
  probability: 1.0,
  impact: 'neutral',
  outcomes: {
    shortTerm: ['Stable sentiment', 'Moderate growth', 'Predictable outcomes'],
    mediumTerm: ['Gradual improvements', 'Incremental changes', 'Status quo maintenance'],
    longTerm: ['Long-term stability', 'Sustainable growth', 'Institutional strengthening']
  },
  indicators: ['Current trends', 'Historical patterns', 'Baseline metrics'],
  timeline: 'Ongoing',
  affectedAreas: ['All sectors']
};

export function WhatIfScenariosUI({
  scenarios = defaultScenarios,
  baselineScenario: baseline = baselineScenario,
  isLoading = false,
  onScenarioSelect
}: WhatIfScenariosUIProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>(baseline.id);
  const [probabilityAdjustment, setProbabilityAdjustment] = useState<Record<string, number>>({});
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-5 w-5" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5" />;
      case 'neutral':
        return <Zap className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const currentScenario = selectedScenario === 'baseline' 
    ? baseline 
    : scenarios.find(s => s.id === selectedScenario) || baseline;

  const adjustedProbability = probabilityAdjustment[selectedScenario] || currentScenario.probability;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading scenarios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            What-If Scenarios
          </CardTitle>
          <CardDescription>
            Explore alternative futures and their potential impacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Baseline */}
            <Button
              variant={selectedScenario === 'baseline' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedScenario('baseline');
                onScenarioSelect?.('baseline');
              }}
              className="h-auto flex flex-col items-start p-3 text-left"
            >
              <span className="font-semibold text-sm">{baseline.title}</span>
              <span className="text-xs text-muted-foreground mt-1">{baseline.condition}</span>
            </Button>

            {/* Alternative Scenarios */}
            {scenarios.map(scenario => (
              <Button
                key={scenario.id}
                variant={selectedScenario === scenario.id ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedScenario(scenario.id);
                  onScenarioSelect?.(scenario.id);
                }}
                className={`h-auto flex flex-col items-start p-3 text-left ${getImpactColor(scenario.impact)}`}
              >
                <div className="flex items-start gap-2 w-full">
                  {getImpactIcon(scenario.impact)}
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{scenario.title}</span>
                    <span className="text-xs opacity-75 mt-1 block">{scenario.condition}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Details */}
      <Card className={getImpactColor(currentScenario.impact)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getImpactIcon(currentScenario.impact)}
                {currentScenario.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {currentScenario.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {currentScenario.impact}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Probability Adjustment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Probability</label>
              <span className="text-sm font-semibold">
                {Math.round(adjustedProbability * 100)}%
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={adjustedProbability * 100} className="h-2" />
              <Slider
                value={[adjustedProbability * 100]}
                onValueChange={(value) =>
                  setProbabilityAdjustment({
                    ...probabilityAdjustment,
                    [selectedScenario]: value[0] / 100
                  })
                }
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-sm font-semibold mb-1">Timeline</p>
            <p className="text-sm text-muted-foreground">{currentScenario.timeline}</p>
          </div>

          {/* Affected Areas */}
          <div>
            <p className="text-sm font-semibold mb-2">Affected Areas</p>
            <div className="flex flex-wrap gap-2">
              {currentScenario.affectedAreas.map((area, i) => (
                <Badge key={i} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Key Indicators */}
          <div>
            <p className="text-sm font-semibold mb-2">Key Indicators to Watch</p>
            <ul className="space-y-1">
              {currentScenario.indicators.map((indicator, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <span className="text-primary">→</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Outcomes by Timeframe */}
      <Card>
        <CardHeader>
          <CardTitle>Potential Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="short-term" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="short-term">Short-term (0-6 months)</TabsTrigger>
              <TabsTrigger value="medium-term">Medium-term (6-18 months)</TabsTrigger>
              <TabsTrigger value="long-term">Long-term (18+ months)</TabsTrigger>
            </TabsList>

            <TabsContent value="short-term" className="space-y-2 mt-4">
              {currentScenario.outcomes.shortTerm.map((outcome, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded hover:bg-accent">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{outcome}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="medium-term" className="space-y-2 mt-4">
              {currentScenario.outcomes.mediumTerm.map((outcome, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded hover:bg-accent">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{outcome}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="long-term" className="space-y-2 mt-4">
              {currentScenario.outcomes.longTerm.map((outcome, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded hover:bg-accent">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{outcome}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mitigation Strategies */}
      {currentScenario.mitigation && currentScenario.mitigation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mitigation Strategies</CardTitle>
            <CardDescription>
              Actions to reduce negative impacts or enhance positive outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentScenario.mitigation.map((strategy, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold">✓</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Scenario Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[baseline, ...scenarios].map(scenario => (
              <div key={scenario.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getImpactIcon(scenario.impact)}
                  <span className="text-sm font-medium">{scenario.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(probabilityAdjustment[scenario.id] || scenario.probability) * 100}
                      className="w-20 h-2"
                    />
                    <span className="text-xs font-semibold min-w-10">
                      {Math.round((probabilityAdjustment[scenario.id] || scenario.probability) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
