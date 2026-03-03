/**
 * WHAT-IF SCENARIOS UI COMPONENT
 * 
 * سيناريوهات "ماذا لو"
 * - محاكاة السيناريوهات الافتراضية
 * - تحليل التأثيرات المحتملة
 * - التنبؤ بالنتائج
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
    title: 'نمو اقتصادي إيجابي',
    condition: 'إذا تحسنت المؤشرات الاقتصادية بنسبة 15%',
    description: 'نمو اقتصادي قوي مدفوع بزيادة الاستثمار وفرص العمل',
    probability: 0.65,
    impact: 'positive',
    outcomes: {
      shortTerm: [
        'زيادة ثقة المستهلك',
        'ارتفاع معدلات التوظيف',
        'تحسن معنويات الأعمال'
      ],
      mediumTerm: [
        'أجور أعلى والقوة الشرائية',
        'توسع استثمارات الأعمال',
        'تحسن الخدمات العامة'
      ],
      longTerm: [
        'تنمية اقتصادية مستدامة',
        'تقليل معدلات الفقر',
        'تحسن جودة الحياة'
      ]
    },
    indicators: ['نمو الناتج المحلي', 'معدل التوظيف', 'الإنفاق الاستهلاكي', 'استثمارات الأعمال'],
    timeline: '6-12 شهر',
    affectedAreas: ['الاقتصاد', 'التوظيف', 'معنويات المستهلك', 'بيئة الأعمال']
  },
  {
    id: 'scenario-2',
    title: 'عدم الاستقرار السياسي',
    condition: 'إذا تصعدت التوترات السياسية بشكل كبير',
    description: 'زيادة عدم اليقين السياسي مما يؤدي إلى تحديات مؤسسية',
    probability: 0.35,
    impact: 'negative',
    outcomes: {
      shortTerm: [
        'تقلبات السوق',
        'عدم يقين المستثمرين',
        'زيادة القلق العام'
      ],
      mediumTerm: [
        'هروب رأس المال',
        'تباطؤ اقتصادي',
        'تأخير السياسات'
      ],
      longTerm: [
        'ضعف المؤسسات',
        'ركود اقتصادي طويل الأجل',
        'تفكك اجتماعي'
      ]
    },
    indicators: ['مؤشر التوتر السياسي', 'تقلبات السوق', 'ثقة المستثمرين', 'الثقة العامة'],
    timeline: '3-6 أشهر',
    affectedAreas: ['السياسة', 'الاقتصاد', 'معنويات الجمهور', 'المؤسسات'],
    mitigation: [
      'تعزيز المؤسسات الديمقراطية',
      'زيادة الحوار السياسي',
      'ضمان الحكم الشفاف',
      'حماية ثقة المستثمرين'
    ]
  },
  {
    id: 'scenario-3',
    title: 'نقطة تحول في التعاون الإقليمي',
    condition: 'إذا تم توقيع اتفاقيات التعاون الإقليمي',
    description: 'تعزيز التكامل الإقليمي يؤدي إلى الازدهار المشترك',
    probability: 0.45,
    impact: 'positive',
    outcomes: {
      shortTerm: [
        'زيادة تدفقات التجارة',
        'مشاريع البنية التحتية المشتركة',
        'تحسن العلاقات الدبلوماسية'
      ],
      mediumTerm: [
        'فوائد التكامل الاقتصادي',
        'ترتيبات الأمن المشترك',
        'نمو التبادل الثقافي'
      ],
      longTerm: [
        'الاستقرار الإقليمي',
        'الازدهار الجماعي',
        'تقليل النزاعات'
      ]
    },
    indicators: ['حجم التجارة', 'العلاقات الدبلوماسية', 'تدفقات الاستثمار', 'الاستقرار الإقليمي'],
    timeline: '12-24 شهر',
    affectedAreas: ['العلاقات الدولية', 'التجارة', 'الاقتصاد', 'الأمن']
  },
  {
    id: 'scenario-4',
    title: 'تأثير أزمة المناخ',
    condition: 'إذا زادت الكوارث المرتبطة بالمناخ',
    description: 'التحديات البيئية تخلق ضغوطاً اقتصادية واجتماعية',
    probability: 0.55,
    impact: 'negative',
    outcomes: {
      shortTerm: [
        'زيادة تكاليف الاستجابة للكوارث',
        'تعطيل القطاع الزراعي',
        'أضرار البنية التحتية'
      ],
      mediumTerm: [
        'ضغوط الهجرة',
        'ندرة الموارد',
        'الخسائر الاقتصادية'
      ],
      longTerm: [
        'التحولات الديموغرافية',
        'التأثيرات الاقتصادية الدائمة',
        'عدم الاستقرار الاجتماعي'
      ]
    },
    indicators: ['أحداث المناخ', 'الإنتاج الزراعي', 'تكاليف الكوارث', 'تدفقات الهجرة'],
    timeline: 'مستمر',
    affectedAreas: ['البيئة', 'الزراعة', 'الاقتصاد', 'الاستقرار الاجتماعي'],
    mitigation: [
      'الاستثمار في المرونة المناخية',
      'تطوير استراتيجيات التكيف',
      'دعم المجتمعات المتضررة',
      'الانتقال إلى الطاقة المتجددة'
    ]
  }
];

const baselineScenario: Scenario = {
  id: 'baseline',
  title: 'السيناريو الأساسي',
  condition: 'استمرار الاتجاهات الحالية',
  description: 'استمرار المسار الحالي مع تقلبات طفيفة',
  probability: 1.0,
  impact: 'neutral',
  outcomes: {
    shortTerm: ['معنويات مستقرة', 'نمو معتدل', 'نتائج متوقعة'],
    mediumTerm: ['تحسنات تدريجية', 'تغييرات تدريجية', 'الحفاظ على الوضع الراهن'],
    longTerm: ['استقرار طويل الأجل', 'نمو مستدام', 'تعزيز المؤسسات']
  },
  indicators: ['الاتجاهات الحالية', 'الأنماط التاريخية', 'مقاييس الأساس'],
  timeline: 'مستمر',
  affectedAreas: ['جميع القطاعات']
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
            سيناريوهات "ماذا لو"
          </CardTitle>
          <CardDescription>
            استكشف المستقبليات البديلة وتأثيراتها المحتملة
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
              <span className="font-semibold text-sm text-black">{baseline.title}</span>
              <span className="text-xs text-gray-600 mt-1">{baseline.condition}</span>
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
                    <span className="font-semibold text-sm text-black">{scenario.title}</span>
                    <span className="text-xs opacity-75 mt-1 block text-gray-700">{scenario.condition}</span>
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
              <label className="text-sm font-semibold text-black">الاحتمالية</label>
              <span className="text-sm font-semibold text-black">
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
            <p className="text-sm font-semibold mb-1 text-black">الجدول الزمني</p>
            <p className="text-sm text-gray-600">{currentScenario.timeline}</p>
          </div>

          {/* Affected Areas */}
          <div>
            <p className="text-sm font-semibold mb-2 text-black">المناطق المتأثرة</p>
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
            <p className="text-sm font-semibold mb-2 text-black">المؤشرات الرئيسية للمراقبة</p>
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
          <CardTitle className="text-black">النتائج المحتملة</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="short-term" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="short-term">قصير الأجل (0-6 أشهر)</TabsTrigger>
              <TabsTrigger value="medium-term">متوسط الأجل (6-18 شهر)</TabsTrigger>
              <TabsTrigger value="long-term">طويل الأجل (18+ شهر)</TabsTrigger>
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
            <CardTitle className="text-black">استراتيجيات التخفيف</CardTitle>
            <CardDescription>
              إجراءات لتقليل التأثيرات السلبية أو تعزيز النتائج الإيجابية
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
          <CardTitle className="text-base text-black">مقارنة سريعة</CardTitle>
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
