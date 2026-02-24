/**
 * صفحة تحليل المناطق الجغرافية
 * Region Analysis Page
 * 
 * تتضمن:
 * - خرائط جغرافية تفاعلية
 * - توزيع المؤشرات حسب المنطقة
 * - الاتجاهات الإقليمية
 * - المقارنات بين المناطق
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  TrendingUp,
  BarChart3,
  Share2,
  Download,
  Bookmark,
  MapPin,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============================================================================
// REGION CARD COMPONENT
// ============================================================================

interface RegionCardProps {
  region: string;
  gmi: number;
  cfi: number;
  hri: number;
  population: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

function RegionCard({
  region,
  gmi,
  cfi,
  hri,
  population,
  trend,
  trendValue,
}: RegionCardProps) {
  const trendColor =
    trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";

  return (
    <Card className="border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{region}</p>
            <p className="text-2xl font-bold mt-2">{gmi}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-10 p-3">
            <MapPin className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">CFI</p>
            <p className="font-semibold text-green-500">{cfi}</p>
          </div>
          <div>
            <p className="text-muted-foreground">HRI</p>
            <p className="font-semibold text-orange-500">{hri}</p>
          </div>
        </div>
        <div className="border-t border-slate-700/50 pt-2">
          <p className="text-xs text-muted-foreground mb-1">السكان</p>
          <p className="font-semibold">{(population / 1000000).toFixed(1)}M</p>
        </div>
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
// MAIN REGION ANALYSIS PAGE
// ============================================================================

export default function RegionAnalysisPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Mock data
  const regionData = [
    { region: "الشرق الأوسط", gmi: 72, cfi: 68, hri: 75, population: 400000000, trend: "up" as const, trendValue: 5 },
    { region: "أوروبا", gmi: 58, cfi: 55, hri: 62, population: 450000000, trend: "down" as const, trendValue: 2 },
    { region: "آسيا", gmi: 68, cfi: 65, hri: 70, population: 4600000000, trend: "up" as const, trendValue: 4 },
    { region: "أمريكا الشمالية", gmi: 65, cfi: 62, hri: 68, population: 580000000, trend: "stable" as const, trendValue: 0 },
    { region: "أفريقيا", gmi: 70, cfi: 67, hri: 73, population: 1400000000, trend: "up" as const, trendValue: 6 },
  ];

  const timeSeriesData = [
    { date: "2026-02-15", "الشرق الأوسط": 70, "أوروبا": 57, "آسيا": 66, "أمريكا الشمالية": 64, "أفريقيا": 68 },
    { date: "2026-02-16", "الشرق الأوسط": 71, "أوروبا": 57, "آسيا": 67, "أمريكا الشمالية": 64, "أفريقيا": 69 },
    { date: "2026-02-17", "الشرق الأوسط": 71, "أوروبا": 58, "آسيا": 67, "أمريكا الشمالية": 65, "أفريقيا": 69 },
    { date: "2026-02-18", "الشرق الأوسط": 72, "أوروبا": 58, "آسيا": 68, "أمريكا الشمالية": 65, "أفريقيا": 70 },
    { date: "2026-02-19", "الشرق الأوسط": 72, "أوروبا": 58, "آسيا": 68, "أمريكا الشمالية": 65, "أفريقيا": 70 },
  ];

  const comparisonData = [
    { region: "الشرق الأوسط", gmi: 72, cfi: 68, hri: 75 },
    { region: "أوروبا", gmi: 58, cfi: 55, hri: 62 },
    { region: "آسيا", gmi: 68, cfi: 65, hri: 70 },
    { region: "أمريكا الشمالية", gmi: 65, cfi: 62, hri: 68 },
    { region: "أفريقيا", gmi: 70, cfi: 67, hri: 73 },
  ];

  const scatterData = [
    { region: "الشرق الأوسط", gmi: 72, population: 400, hri: 75 },
    { region: "أوروبا", gmi: 58, population: 450, hri: 62 },
    { region: "آسيا", gmi: 68, population: 4600, hri: 70 },
    { region: "أمريكا الشمالية", gmi: 65, population: 580, hri: 68 },
    { region: "أفريقيا", gmi: 70, population: 1400, hri: 73 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">تحليل المناطق الجغرافية</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                توزيع المؤشرات والاتجاهات حسب المنطقة الجغرافية
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
        {/* Key Regions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">المناطق الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {regionData.map((region) => (
              <RegionCard
                key={region.region}
                region={region.region}
                gmi={region.gmi}
                cfi={region.cfi}
                hri={region.hri}
                population={region.population}
                trend={region.trend}
                trendValue={region.trendValue}
              />
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">الاتجاهات الزمنية</TabsTrigger>
            <TabsTrigger value="comparison">المقارنة بين المناطق</TabsTrigger>
            <TabsTrigger value="scatter">العلاقة بين المؤشرات</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  اتجاهات GMI حسب المنطقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData}>
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
                    <Line
                      type="monotone"
                      dataKey="الشرق الأوسط"
                      stroke="#EAB308"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="أوروبا"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="آسيا"
                      stroke="#22C55E"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="أمريكا الشمالية"
                      stroke="#F97316"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="أفريقيا"
                      stroke="#EC4899"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  مقارنة المؤشرات الثلاثة حسب المنطقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="region" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="gmi" fill="#EAB308" name="GMI" />
                    <Bar dataKey="cfi" fill="#22C55E" name="CFI" />
                    <Bar dataKey="hri" fill="#F97316" name="HRI" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scatter Tab */}
          <TabsContent value="scatter">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  العلاقة بين السكان والمؤشرات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="population"
                      name="السكان (مليون)"
                      stroke="#94A3B8"
                    />
                    <YAxis dataKey="gmi" name="GMI" stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #475569",
                      }}
                      cursor={{ strokeDasharray: "3 3" }}
                    />
                    <Scatter
                      name="المناطق"
                      data={scatterData}
                      fill="#8884d8"
                      shape="circle"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card className="border-slate-700/50 mt-8">
          <CardHeader>
            <CardTitle>الرؤى والتوصيات الإقليمية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-semibold">الشرق الأوسط وأفريقيا يقودان النمو</p>
                  <p className="text-sm text-muted-foreground">
                    أعلى مؤشرات GMI (72 و 70) مع اتجاهات صعودية قوية (+5% و +6%)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mt-1">
                  ⚠
                </Badge>
                <div>
                  <p className="font-semibold">أوروبا تحتاج اهتماماً خاصاً</p>
                  <p className="text-sm text-muted-foreground">
                    أقل مؤشرات GMI (58) مع اتجاه مستقر، قد تحتاج تدخلات استراتيجية
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                  ℹ
                </Badge>
                <div>
                  <p className="font-semibold">آسيا تحافظ على التوازن</p>
                  <p className="text-sm text-muted-foreground">
                    مؤشرات متوسطة مستقرة (68) مع نمو معتدل (+4%)، تمثل استقراراً إقليمياً
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
