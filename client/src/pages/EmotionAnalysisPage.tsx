/**
 * صفحة تحليل العواطف
 * Emotion Analysis Page
 * 
 * تتضمن:
 * - رسوم بيانية للعواطف الرئيسية
 * - توزيع العواطف حسب المنطقة
 * - الاتجاهات الزمنية للعواطف
 * - الرؤى والتوصيات
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  TrendingUp,
  Globe,
  BarChart3,
  Share2,
  Download,
  Bookmark,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============================================================================
// EMOTION CARD COMPONENT
// ============================================================================

interface EmotionCardProps {
  emotion: string;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  icon: React.ReactNode;
}

function EmotionCard({
  emotion,
  percentage,
  color,
  trend,
  trendValue,
  icon,
}: EmotionCardProps) {
  const trendColor =
    trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";

  return (
    <Card className="border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{emotion}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{percentage}%</p>
          </div>
          <div className={`rounded-lg bg-gradient-to-br ${color} bg-opacity-10 p-3`}>
            <div className={color}>{icon}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-1">
          <TrendingUp className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-xs font-semibold ${trendColor}`}>
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {trendValue}% منذ أمس
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN EMOTION ANALYSIS PAGE
// ============================================================================

export default function EmotionAnalysisPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Mock data
  const emotionData = [
    { emotion: "الفرح", percentage: 35, color: "text-yellow-500", trend: "up" as const, trendValue: 5, icon: "😊" },
    { emotion: "الثقة", percentage: 28, color: "text-green-500", trend: "up" as const, trendValue: 3, icon: "💪" },
    { emotion: "القلق", percentage: 18, color: "text-orange-500", trend: "down" as const, trendValue: 2, icon: "😟" },
    { emotion: "الحزن", percentage: 12, color: "text-blue-500", trend: "stable" as const, trendValue: 0, icon: "😢" },
    { emotion: "الغضب", percentage: 7, color: "text-red-500", trend: "down" as const, trendValue: 1, icon: "😠" },
  ];

  const timeSeriesData = [
    { date: "2026-02-15", joy: 32, trust: 25, anxiety: 20, sadness: 14, anger: 9 },
    { date: "2026-02-16", joy: 33, trust: 26, anxiety: 19, sadness: 13, anger: 9 },
    { date: "2026-02-17", joy: 34, trust: 27, anxiety: 18, sadness: 12, anger: 9 },
    { date: "2026-02-18", joy: 35, trust: 28, anxiety: 18, sadness: 12, anger: 7 },
    { date: "2026-02-19", joy: 35, trust: 28, anxiety: 18, sadness: 12, anger: 7 },
  ];

  const regionalData = [
    { region: "الشرق الأوسط", joy: 40, trust: 32, anxiety: 15, sadness: 8, anger: 5 },
    { region: "أوروبا", joy: 28, trust: 24, anxiety: 25, sadness: 15, anger: 8 },
    { region: "آسيا", joy: 36, trust: 29, anxiety: 18, sadness: 12, anger: 5 },
    { region: "أمريكا الشمالية", joy: 32, trust: 26, anxiety: 20, sadness: 14, anger: 8 },
    { region: "أفريقيا", joy: 38, trust: 30, anxiety: 16, sadness: 10, anger: 6 },
  ];

  const emotionDistribution = [
    { name: "الفرح", value: 35, fill: "#EAB308" },
    { name: "الثقة", value: 28, fill: "#22C55E" },
    { name: "القلق", value: 18, fill: "#F97316" },
    { name: "الحزن", value: 12, fill: "#3B82F6" },
    { name: "الغضب", value: 7, fill: "#EF4444" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">تحليل العواطف العالمية</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                تحليل شامل للعواطف والمشاعر حول العالم
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
        {/* Key Emotions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">العواطف الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {emotionData.map((emotion) => (
              <EmotionCard
                key={emotion.emotion}
                emotion={emotion.emotion}
                percentage={emotion.percentage}
                color={emotion.color}
                trend={emotion.trend}
                trendValue={emotion.trendValue}
                icon={emotion.icon}
              />
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">الاتجاهات الزمنية</TabsTrigger>
            <TabsTrigger value="regional">التوزيع الإقليمي</TabsTrigger>
            <TabsTrigger value="distribution">التوزيع العام</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  اتجاهات العواطف عبر الزمن
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
                      dataKey="joy"
                      stroke="#EAB308"
                      name="الفرح"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="trust"
                      stroke="#22C55E"
                      name="الثقة"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="anxiety"
                      stroke="#F97316"
                      name="القلق"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="sadness"
                      stroke="#3B82F6"
                      name="الحزن"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="anger"
                      stroke="#EF4444"
                      name="الغضب"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  التوزيع الإقليمي للعواطف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={regionalData}>
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
                    <Bar dataKey="joy" fill="#EAB308" name="الفرح" />
                    <Bar dataKey="trust" fill="#22C55E" name="الثقة" />
                    <Bar dataKey="anxiety" fill="#F97316" name="القلق" />
                    <Bar dataKey="sadness" fill="#3B82F6" name="الحزن" />
                    <Bar dataKey="anger" fill="#EF4444" name="الغضب" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  التوزيع العام للعواطف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "1px solid #475569",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card className="border-slate-700/50 mt-8">
          <CardHeader>
            <CardTitle>الرؤى والتوصيات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-semibold">العواطف الإيجابية تسيطر</p>
                  <p className="text-sm text-muted-foreground">
                    الفرح والثقة يمثلان 63% من المشاعر العالمية، مما يشير إلى حالة إيجابية عامة
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mt-1">
                  ⚠
                </Badge>
                <div>
                  <p className="font-semibold">القلق متزايد في أوروبا</p>
                  <p className="text-sm text-muted-foreground">
                    أوروبا تشهد مستويات قلق أعلى من المتوسط العالمي (25% مقابل 18%)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                  ℹ
                </Badge>
                <div>
                  <p className="font-semibold">الاتجاه الإيجابي مستمر</p>
                  <p className="text-sm text-muted-foreground">
                    الفرح والثقة في ارتفاع مستمر، بينما القلق والحزن في انخفاض
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
