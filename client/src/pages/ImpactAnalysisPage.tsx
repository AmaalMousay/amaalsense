/**
 * صفحة تحليل التأثير
 * Impact Analysis Page
 * 
 * تتضمن:
 * - التنبؤات طويلة المدى (30 يوم)
 * - تحليل السيناريوهات
 * - مؤشرات التأثير الرئيسية
 * - التوصيات الاستراتيجية
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Share2,
  Download,
  Bookmark,
  Target,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============================================================================
// IMPACT CARD COMPONENT
// ============================================================================

interface ImpactCardProps {
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  description: string;
  severity: "low" | "medium" | "high";
}

function ImpactCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  description,
  severity,
}: ImpactCardProps) {
  const trendColor =
    trend === "up" ? "text-red-500" : trend === "down" ? "text-green-500" : "text-gray-500";
  const severityColor =
    severity === "high"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : severity === "medium"
        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
        : "bg-green-500/20 text-green-400 border-green-500/30";

  return (
    <Card className="border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">
              {value}
              <span className="text-lg text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
          <Badge className={severityColor}>{severity.toUpperCase()}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1">
          <TrendingUp className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-xs font-semibold ${trendColor}`}>
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {trendValue}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN IMPACT ANALYSIS PAGE
// ============================================================================

export default function ImpactAnalysisPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("baseline");

  // Mock data for forecasting
  const forecastData = [
    { date: "2026-02-24", baseline: 72, optimistic: 75, pessimistic: 68 },
    { date: "2026-03-03", baseline: 73, optimistic: 77, pessimistic: 67 },
    { date: "2026-03-13", baseline: 74, optimistic: 79, pessimistic: 66 },
    { date: "2026-03-23", baseline: 75, optimistic: 81, pessimistic: 65 },
    { date: "2026-04-02", baseline: 76, optimistic: 83, pessimistic: 64 },
    { date: "2026-04-12", baseline: 77, optimistic: 85, pessimistic: 63 },
    { date: "2026-04-22", baseline: 78, optimistic: 87, pessimistic: 62 },
  ];

  const scenarioData = [
    { scenario: "Baseline", impact: 78, confidence: 85, description: "السيناريو الحالي بدون تدخلات" },
    { scenario: "Optimistic", impact: 87, confidence: 72, description: "تحسن كبير مع تدخلات استباقية" },
    { scenario: "Pessimistic", impact: 62, confidence: 78, description: "تدهور مع عدم التدخل" },
    { scenario: "Intervention", impact: 85, confidence: 80, description: "تحسن مع تدخلات مستهدفة" },
  ];

  const impactMetrics = [
    {
      title: "التأثير الإجمالي",
      value: 78,
      unit: "%",
      trend: "up" as const,
      trendValue: 6,
      description: "التأثير المتوقع على المؤشرات الرئيسية",
      severity: "medium" as const,
    },
    {
      title: "الثقة في التنبؤ",
      value: 85,
      unit: "%",
      trend: "up" as const,
      trendValue: 3,
      description: "دقة نموذج التنبؤ الحالي",
      severity: "low" as const,
    },
    {
      title: "الأحداث المتوقعة",
      value: 12,
      unit: "حدث",
      trend: "up" as const,
      trendValue: 4,
      description: "عدد الأحداث المتوقعة في الـ 30 يوم القادمة",
      severity: "high" as const,
    },
    {
      title: "معدل التغير",
      value: 2.5,
      unit: "نقطة/يوم",
      trend: "down" as const,
      trendValue: 1,
      description: "متوسط معدل التغير اليومي",
      severity: "low" as const,
    },
  ];

  const riskData = [
    { category: "سياسي", risk: 75, mitigation: 60 },
    { category: "اقتصادي", risk: 65, mitigation: 55 },
    { category: "اجتماعي", risk: 80, mitigation: 70 },
    { category: "تكنولوجي", risk: 45, mitigation: 80 },
    { category: "بيئي", risk: 55, mitigation: 65 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">تحليل التأثير والتنبؤات</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                التنبؤات طويلة المدى وتحليل السيناريوهات
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                تحميل
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                مشاركة
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                حفظ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">مؤشرات التأثير الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactMetrics.map((metric) => (
              <ImpactCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                unit={metric.unit}
                trend={metric.trend}
                trendValue={metric.trendValue}
                description={metric.description}
                severity={metric.severity}
              />
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">التنبؤات الزمنية</TabsTrigger>
            <TabsTrigger value="scenarios">تحليل السيناريوهات</TabsTrigger>
            <TabsTrigger value="risks">تقييم المخاطر</TabsTrigger>
          </TabsList>

          {/* Forecast Tab */}
          <TabsContent value="forecast">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  التنبؤات لـ 30 يوم القادمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="optimistic"
                      stroke="#22C55E"
                      fillOpacity={1}
                      fill="url(#colorOptimistic)"
                      name="متفائل"
                    />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stroke="#EAB308"
                      fillOpacity={1}
                      fill="url(#colorBaseline)"
                      name="الحالي"
                    />
                    <Area
                      type="monotone"
                      dataKey="pessimistic"
                      stroke="#EF4444"
                      fillOpacity={1}
                      fill="url(#colorPessimistic)"
                      name="متشائم"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  مقارنة السيناريوهات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="scenario" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="impact" fill="#EAB308" name="التأثير" />
                    <Bar dataKey="confidence" fill="#22C55E" name="الثقة" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {scenarioData.map((scenario) => (
                    <div
                      key={scenario.scenario}
                      className="p-3 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors"
                      onClick={() => setSelectedScenario(scenario.scenario)}
                    >
                      <p className="font-semibold">{scenario.scenario}</p>
                      <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-yellow-400">التأثير: {scenario.impact}%</span>
                        <span className="text-green-400">الثقة: {scenario.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  تقييم المخاطر والتخفيف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="category" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="risk" fill="#EF4444" name="المخاطر" />
                    <Bar dataKey="mitigation" fill="#22C55E" name="التخفيف" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <Card className="border-slate-700/50 mt-8">
          <CardHeader>
            <CardTitle>التوصيات الاستراتيجية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-semibold">اتخاذ إجراءات استباقية فوراً</p>
                  <p className="text-sm text-muted-foreground">
                    السيناريو المتفائل يتطلب تدخلات استراتيجية الآن لتحقيق النتائج المرغوبة
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mt-1">
                  ⚠
                </Badge>
                <div>
                  <p className="font-semibold">مراقبة المخاطر الاجتماعية</p>
                  <p className="text-sm text-muted-foreground">
                    أعلى مستويات المخاطر في القطاع الاجتماعي (80%)، تحتاج مراقبة مستمرة
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                  ℹ
                </Badge>
                <div>
                  <p className="font-semibold">تحسين القدرات التكنولوجية</p>
                  <p className="text-sm text-muted-foreground">
                    أقل المخاطر في القطاع التكنولوجي (45%) مع أعلى معدلات التخفيف (80%)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
