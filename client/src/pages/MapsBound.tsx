// @ts-nocheck
/**
 * خريطة العواطف العالمية - مربوطة بـ API
 * Global Emotion Map - API Bound
 */

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  TrendingUp,
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface RegionData {
  name: string;
  sentiment: number;
  emotionDistribution: Record<string, number>;
  coordinates: { lat: number; lng: number };
  population: number;
  dataPoints: number;
}

export default function MapsBound() {
  const [region, setRegion] = useState("global");
  const [timeRange, setTimeRange] = useState("24h");
  const [zoom, setZoom] = useState(2);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);

  // Fetch geographic data
  const geoQuery = trpc.maps.getGeographicData.useQuery(
    { region, timeRange },
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  // Fetch regional trends
  const trendsQuery = trpc.maps.getRegionalTrends.useQuery(
    { region: selectedRegion?.name || region },
    { enabled: !!selectedRegion }
  );

  // Fetch hotspots
  const hotspotsQuery = trpc.maps.getHotspots.useQuery();

  const regions = geoQuery.data?.data.regions || [];
  const hotspots = hotspotsQuery.data?.hotspots || [];
  const globalSentiment = geoQuery.data?.data.globalSentiment || 0;

  // Get emotion color
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joy: "#FFD700",
      sadness: "#4169E1",
      anger: "#FF4500",
      fear: "#8B008B",
      hope: "#32CD32",
      neutral: "#808080",
    };
    return colors[emotion] || "#808080";
  };

  // Get sentiment color
  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 70) return "#10B981"; // Green
    if (sentiment >= 50) return "#F59E0B"; // Amber
    if (sentiment >= 30) return "#EF4444"; // Red
    return "#7F1D1D"; // Dark red
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-purple-500" />
            خريطة العواطف العالمية
          </h1>
          <p className="text-muted-foreground">
            تصور توزيع العواطف والمشاعر حول العالم في الوقت الفعلي
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">المنطقة</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">عالمي</SelectItem>
                <SelectItem value="mena">الشرق الأوسط وشمال أفريقيا</SelectItem>
                <SelectItem value="asia">آسيا</SelectItem>
                <SelectItem value="europe">أوروبا</SelectItem>
                <SelectItem value="americas">الأمريكتان</SelectItem>
                <SelectItem value="africa">أفريقيا</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="90d">آخر 3 أشهر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">التكبير</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(zoom + 1, 5))}
                className="flex-1"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(zoom - 1, 1))}
                className="flex-1"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">&nbsp;</label>
            <Button
              variant="outline"
              onClick={() => {
                setZoom(2);
                setSelectedRegion(null);
              }}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </div>

        {/* Global Sentiment Card */}
        <Card className="border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المشاعر العالمية</p>
                <p className="text-4xl font-bold mt-2">{globalSentiment.toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: getSentimentColor(globalSentiment),
                    opacity: 0.2,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ backgroundColor: getSentimentColor(globalSentiment) }}
                  >
                    {globalSentiment > 60 ? "إيجابي" : globalSentiment > 40 ? "محايد" : "سلبي"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Visualization */}
          <div className="lg:col-span-2">
            <Card className="border-slate-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-base">توزيع المناطق</CardTitle>
              </CardHeader>
              <CardContent>
                {geoQuery.isPending ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {regions.map((region) => (
                      <div
                        key={region.name}
                        onClick={() => setSelectedRegion(region)}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-all border border-slate-700/50 hover:border-purple-500/50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{region.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              السكان: {(region.population / 1000000).toFixed(0)}M | البيانات: {region.dataPoints.toLocaleString()}
                            </p>
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-sm font-semibold"
                            style={{ backgroundColor: getSentimentColor(region.sentiment) }}
                          >
                            {region.sentiment.toFixed(0)}%
                          </div>
                        </div>

                        {/* Emotion Distribution */}
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(region.emotionDistribution).map(([emotion, value]) => (
                            <div
                              key={emotion}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: getEmotionColor(emotion),
                                opacity: 0.2,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getEmotionColor(emotion) }}
                              />
                              {emotion}: {value.toFixed(0)}%
                            </div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${region.sentiment}%`,
                              backgroundColor: getSentimentColor(region.sentiment),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hotspots & Trends */}
          <div className="space-y-6">
            {/* Hotspots */}
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  نقاط ساخنة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hotspotsQuery.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  hotspotsQuery.data?.hotspots.map((hotspot, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/50 rounded-lg border border-red-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{hotspot.location}</h4>
                        <div className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                          {hotspot.intensity}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        العاطفة: {hotspot.dominantEmotion} | النوع: {hotspot.eventType}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Trends */}
            {selectedRegion && (
              <Card className="border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    الاتجاهات - {selectedRegion.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trendsQuery.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="space-y-2">
                      {trendsQuery.data?.trends.map((trend, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(trend.date).toLocaleDateString("ar-SA")}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500"
                                style={{ width: `${trend.sentiment}%` }}
                              />
                            </div>
                            <span className="font-semibold">{trend.sentiment.toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
