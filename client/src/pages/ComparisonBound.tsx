/**
 * ميزات المقارنة المربوطة - مع API حقيقي
 * Comparison Features Bound - with Real API Integration
 */

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Download,
  Share2,
  Plus,
  X,
  Loader2,
  Zap,
} from "lucide-react";

const COLORS = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

export default function ComparisonBound() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["Egypt", "Saudi Arabia"]);
  const [comparisonType, setComparisonType] = useState<"countries" | "temporal" | "scenario">(
    "countries"
  );
  const [timeRange, setTimeRange] = useState("24h");
  const [scenario, setScenario] = useState("economic_growth");

  // Country comparison query
  const countryComparisonQuery = trpc.comparison.compareCountries.useQuery(
    { countries: selectedCountries, timeRange },
    { enabled: comparisonType === "countries" }
  );

  // Temporal comparison query
  const temporalQuery = trpc.comparison.temporalComparison.useQuery(
    {
      topic: selectedCountries[0] || "Global",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
    { enabled: comparisonType === "temporal" }
  );

  // What-if scenario query
  const scenarioQuery = trpc.comparison.whatIfScenario.useQuery(
    {
      scenario: scenario,
      parameters: { region: selectedCountries[0], intensity: 0.8 },
    },
    { enabled: comparisonType === "scenario" }
  );

  const comparisonData = countryComparisonQuery.data?.comparison.data || [];
  const timelineData = temporalQuery.data?.timeline || [];
  const scenarioResults = scenarioQuery.data?.results;

  // Prepare chart data
  const chartData = comparisonData.map((item: any) => ({
    name: item.country,
    sentiment: item.sentiment,
    joy: item.emotionProfile.joy,
    sadness: item.emotionProfile.sadness,
    anger: item.emotionProfile.anger,
  }));

  const addCountry = (country: string) => {
    if (!selectedCountries.includes(country) && selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter((c) => c !== country));
  };

  const countries = [
    "Egypt",
    "Saudi Arabia",
    "UAE",
    "Kuwait",
    "Qatar",
    "Bahrain",
    "Oman",
    "Jordan",
    "Lebanon",
    "Palestine",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            أداة المقارنة المتقدمة
          </h1>
          <p className="text-muted-foreground">
            قارن الدول والاتجاهات الزمنية والسيناريوهات الافتراضية
          </p>
        </div>

        {/* Comparison Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant={comparisonType === "countries" ? "default" : "outline"}
            onClick={() => setComparisonType("countries")}
            className="h-auto p-4 flex flex-col items-start"
          >
            <span className="font-semibold">مقارنة الدول</span>
            <span className="text-xs text-muted-foreground">قارن مؤشرات الدول</span>
          </Button>

          <Button
            variant={comparisonType === "temporal" ? "default" : "outline"}
            onClick={() => setComparisonType("temporal")}
            className="h-auto p-4 flex flex-col items-start"
          >
            <span className="font-semibold">المقارنة الزمنية</span>
            <span className="text-xs text-muted-foreground">تحليل الاتجاهات عبر الوقت</span>
          </Button>

          <Button
            variant={comparisonType === "scenario" ? "default" : "outline"}
            onClick={() => setComparisonType("scenario")}
            className="h-auto p-4 flex flex-col items-start"
          >
            <span className="font-semibold">سيناريوهات ماذا لو</span>
            <span className="text-xs text-muted-foreground">تحليل السيناريوهات الافتراضية</span>
          </Button>
        </div>

        {/* Country Comparison */}
        {comparisonType === "countries" && (
          <div className="space-y-6">
            {/* Country Selector */}
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-base">اختر الدول للمقارنة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCountries.map((country) => (
                    <Badge key={country} className="bg-purple-600 pl-1">
                      {country}
                      <button
                        onClick={() => removeCountry(country)}
                        className="ml-2 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <Select onValueChange={addCountry}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="أضف دولة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {countries
                      .filter((c) => !selectedCountries.includes(c))
                      .map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">الفترة الزمنية</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                      <SelectItem value="7d">آخر أسبوع</SelectItem>
                      <SelectItem value="30d">آخر شهر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Charts */}
            {countryComparisonQuery.isPending ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Comparison */}
                <Card className="border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-base">مقارنة المشاعر</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sentiment" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Emotion Distribution */}
                <Card className="border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-base">توزيع العواطف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="joy" fill="#FFD700" />
                        <Bar dataKey="sadness" fill="#4169E1" />
                        <Bar dataKey="anger" fill="#FF4500" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Comparison Table */}
            {comparisonData.length > 0 && (
              <Card className="border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-base">جدول المقارنة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-right py-2 px-4">الدولة</th>
                          <th className="text-right py-2 px-4">المشاعر</th>
                          <th className="text-right py-2 px-4">الفرح</th>
                          <th className="text-right py-2 px-4">الحزن</th>
                          <th className="text-right py-2 px-4">الغضب</th>
                          <th className="text-right py-2 px-4">نقاط البيانات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((item: any) => (
                          <tr key={item.country} className="border-b border-slate-700/50">
                            <td className="py-3 px-4">{item.country}</td>
                            <td className="py-3 px-4">{item.sentiment.toFixed(1)}%</td>
                            <td className="py-3 px-4">{item.emotionProfile.joy.toFixed(1)}%</td>
                            <td className="py-3 px-4">{item.emotionProfile.sadness.toFixed(1)}%</td>
                            <td className="py-3 px-4">{item.emotionProfile.anger.toFixed(1)}%</td>
                            <td className="py-3 px-4">{item.dataPoints.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Temporal Comparison */}
        {comparisonType === "temporal" && (
          <Card className="border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-base">تحليل الاتجاهات الزمنية</CardTitle>
            </CardHeader>
            <CardContent>
              {temporalQuery.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString("ar-SA")
                        }
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sentiment" stroke="#8B5CF6" />
                      <Line type="monotone" dataKey="volume" stroke="#10B981" />
                    </LineChart>
                  </ResponsiveContainer>

                  {temporalQuery.data?.prediction && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-slate-700/50 bg-slate-800/50">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">التنبؤ للأسبوع القادم</p>
                          <p className="text-2xl font-bold mt-2">
                            {temporalQuery.data.prediction.nextWeekSentiment.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            الثقة: {temporalQuery.data.prediction.confidence}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scenario Analysis */}
        {comparisonType === "scenario" && (
          <div className="space-y-6">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-base">اختر السيناريو</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economic_growth">نمو اقتصادي</SelectItem>
                    <SelectItem value="political_crisis">أزمة سياسية</SelectItem>
                    <SelectItem value="social_movement">حركة اجتماعية</SelectItem>
                    <SelectItem value="tech_disruption">تطور تكنولوجي</SelectItem>
                    <SelectItem value="environmental_change">تغير بيئي</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {scenarioQuery.isPending ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : (
              scenarioResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-slate-700/50 border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-500" />
                        النتيجة المتوقعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold mb-2">
                        {scenarioResults.expectedOutcome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        مستوى الثقة: {scenarioResults.confidence}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        الإطار الزمني: {scenarioResults.timeline}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-base">المخاطر والفرص</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-red-400 mb-2">المخاطر:</p>
                        <ul className="text-sm space-y-1">
                          {scenarioResults.risks.map((risk: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">
                              • {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-400 mb-2">الفرص:</p>
                        <ul className="text-sm space-y-1">
                          {scenarioResults.opportunities.map((opp: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">
                              • {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        )}

        {/* Export & Share */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            تحميل التقرير
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            مشاركة
          </Button>
        </div>
      </div>
    </div>
  );
}
