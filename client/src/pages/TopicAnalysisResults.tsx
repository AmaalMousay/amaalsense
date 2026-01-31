/**
 * Topic Analysis Results Page
 * Displays comprehensive analysis results with heat map, demographics, and regional breakdown
 */

import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RegionalHeatMap } from "@/components/RegionalHeatMap";
import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown, Users, MapPin, BarChart3, Brain } from "lucide-react";

// Region coordinates for heat map
const REGION_COORDINATES: Record<string, Record<string, { lat: number; lng: number }>> = {
  LY: {
    TRI: { lat: 32.8872, lng: 13.1913 },
    BEN: { lat: 32.1194, lng: 20.0868 },
    MIS: { lat: 32.3754, lng: 15.0925 },
    SEB: { lat: 27.0377, lng: 14.4283 },
    ZAW: { lat: 32.7571, lng: 12.7278 },
    ZLI: { lat: 32.4674, lng: 14.5687 },
    AJD: { lat: 30.7554, lng: 20.2263 },
    DER: { lat: 32.7648, lng: 22.6389 },
    SIR: { lat: 31.2089, lng: 16.5887 },
    GHA: { lat: 30.1333, lng: 9.5000 },
  },
  EG: {
    CAI: { lat: 30.0444, lng: 31.2357 },
    ALX: { lat: 31.2001, lng: 29.9187 },
    GIZ: { lat: 30.0131, lng: 31.2089 },
    ASW: { lat: 24.0889, lng: 32.8998 },
    LUX: { lat: 25.6872, lng: 32.6396 },
    PSD: { lat: 31.2653, lng: 32.3019 },
    SUE: { lat: 29.9668, lng: 32.5498 },
    MAN: { lat: 31.0409, lng: 31.3785 },
  },
  SA: {
    RUH: { lat: 24.7136, lng: 46.6753 },
    JED: { lat: 21.5433, lng: 39.1728 },
    MEC: { lat: 21.3891, lng: 39.8579 },
    MED: { lat: 24.5247, lng: 39.5692 },
    DAM: { lat: 26.4207, lng: 50.0888 },
    KHO: { lat: 26.2172, lng: 50.1971 },
    TAI: { lat: 21.2703, lng: 40.4158 },
    ABH: { lat: 18.2164, lng: 42.5053 },
  },
  AE: {
    DXB: { lat: 25.2048, lng: 55.2708 },
    AUH: { lat: 24.4539, lng: 54.3773 },
    SHJ: { lat: 25.3463, lng: 55.4209 },
    AJM: { lat: 25.4052, lng: 55.5136 },
    RAK: { lat: 25.7895, lng: 55.9432 },
    FUJ: { lat: 25.1288, lng: 56.3265 },
  },
  US: {
    NYC: { lat: 40.7128, lng: -74.0060 },
    LAX: { lat: 34.0522, lng: -118.2437 },
    CHI: { lat: 41.8781, lng: -87.6298 },
    HOU: { lat: 29.7604, lng: -95.3698 },
    PHX: { lat: 33.4484, lng: -112.0740 },
    MIA: { lat: 25.7617, lng: -80.1918 },
    SFO: { lat: 37.7749, lng: -122.4194 },
    WAS: { lat: 38.9072, lng: -77.0369 },
  },
  GB: {
    LON: { lat: 51.5074, lng: -0.1278 },
    BIR: { lat: 52.4862, lng: -1.8904 },
    MAN: { lat: 53.4808, lng: -2.2426 },
    LIV: { lat: 53.4084, lng: -2.9916 },
    EDI: { lat: 55.9533, lng: -3.1883 },
    GLA: { lat: 55.8642, lng: -4.2518 },
  },
};

// Default coordinates for unknown regions
const DEFAULT_COORDS = { lat: 0, lng: 0 };

function getRegionCoordinates(countryCode: string, regionCode: string): { lat: number; lng: number } {
  return REGION_COORDINATES[countryCode]?.[regionCode] || DEFAULT_COORDS;
}

// Emotion colors and icons
const EMOTION_CONFIG: Record<string, { color: string; icon: string }> = {
  joy: { color: "#22c55e", icon: "😊" },
  hope: { color: "#2A9D8F", icon: "🌟" },
  calm: { color: "#457B9D", icon: "😌" },
  curiosity: { color: "#E9C46A", icon: "🤔" },
  fear: { color: "#F4A261", icon: "😨" },
  anger: { color: "#E63946", icon: "😠" },
  sadness: { color: "#8D5CF6", icon: "😢" },
};

export default function TopicAnalysisResults() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/analysis-results");
  
  // Get analysis parameters from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const topic = searchParams.get("topic") || "";
  const countryCode = searchParams.get("country") || "";
  const countryName = searchParams.get("countryName") || "";
  const timeRange = (searchParams.get("timeRange") as "day" | "week" | "month") || "week";

  // Fetch analysis data using mutation
  const analyzeTopicMutation = trpc.topic.analyzeTopicInCountry.useMutation();
  const generatePdfMutation = trpc.pdfExport.generateAnalysisReport.useMutation();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Export PDF function
  const handleExportPDF = async () => {
    if (!analysisData) return;
    
    setIsExporting(true);
    try {
      const result = await generatePdfMutation.mutateAsync({
        topic,
        country: countryCode,
        countryName,
        timeRange,
        analysisData: {
          gmi: analysisData.gmi,
          cfi: analysisData.cfi,
          hri: analysisData.hri,
          supporters: analysisData.overallSupport,
          opponents: analysisData.overallOpposition,
          neutral: analysisData.overallNeutral,
          cities: analysisData.regions?.map((r: any) => ({
            name: r.regionNameAr,
            sentiment: r.support - r.opposition,
            change: r.change || 0,
          })),
        },
      });
      
      // Create and download HTML file
      const blob = new Blob([result.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (topic && countryCode) {
      setIsLoading(true);
      analyzeTopicMutation.mutateAsync({ topic, countryCode, countryName, timeRange })
        .then((data) => {
          setAnalysisData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [topic, countryCode, countryName, timeRange]);

  if (!topic || !countryCode) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">لم يتم تحديد موضوع أو دولة للتحليل</p>
            <Button onClick={() => navigate("/analyzer")}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للمحلل
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحليل الموضوع...</p>
            <p className="text-sm text-muted-foreground mt-2">
              تحليل "{topic}" في {countryName}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12 border-destructive">
          <CardContent>
            <p className="text-destructive mb-4">حدث خطأ أثناء التحليل</p>
            <Button onClick={() => navigate("/analyzer")} variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للمحلل
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare heat map data
  const heatMapRegions = analysisData.regions.map((region: any) => ({
    name: region.regionNameAr,
    sentiment: region.support - region.opposition, // -100 to +100
    gmi: region.gmi,
    dominantEmotion: region.dominantEmotion,
    coordinates: getRegionCoordinates(countryCode, region.regionCode),
  }));

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => navigate("/analyzer")} className="mb-2">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للمحلل
          </Button>
          <h1 className="text-3xl font-bold">نتائج التحليل</h1>
          <p className="text-muted-foreground">
            تحليل "{topic}" في {countryName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="ml-2 h-4 w-4" />
            مشاركة
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="ml-2 h-4 w-4" />
            {isExporting ? 'جاري التصدير...' : 'تصدير PDF'}
          </Button>
        </div>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المؤيدون</p>
                <p className="text-3xl font-bold text-green-500">{analysisData.overallSupport}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المعارضون</p>
                <p className="text-3xl font-bold text-red-500">{analysisData.overallOpposition}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المحايدون</p>
                <p className="text-3xl font-bold text-yellow-500">{analysisData.overallNeutral}%</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مستوى الثقة</p>
                <p className="text-3xl font-bold text-primary">{analysisData.confidence}%</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DCFT Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            مؤشرات DCFT
          </CardTitle>
          <CardDescription>المؤشرات المحسوبة باستخدام نظرية حقل الوعي الرقمي</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">GMI - مؤشر المزاج العام</span>
                <span className="text-sm text-muted-foreground">{analysisData.gmi}</span>
              </div>
              <Progress 
                value={(analysisData.gmi + 100) / 2} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {analysisData.gmi > 0 ? "إيجابي" : analysisData.gmi < 0 ? "سلبي" : "محايد"}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">CFI - مؤشر الخوف الجماعي</span>
                <span className="text-sm text-muted-foreground">{analysisData.cfi}</span>
              </div>
              <Progress 
                value={analysisData.cfi} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {analysisData.cfi > 70 ? "مرتفع" : analysisData.cfi > 30 ? "متوسط" : "منخفض"}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">HRI - مؤشر الأمل والمرونة</span>
                <span className="text-sm text-muted-foreground">{analysisData.hri}</span>
              </div>
              <Progress 
                value={analysisData.hri} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {analysisData.hri > 70 ? "مرتفع" : analysisData.hri > 30 ? "متوسط" : "منخفض"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            الخريطة الحرارية
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            الفئات العمرية
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            المناطق
          </TabsTrigger>
        </TabsList>

        {/* Heat Map Tab */}
        <TabsContent value="map" className="mt-6">
          <RegionalHeatMap
            countryCode={countryCode}
            countryName={countryName}
            regions={heatMapRegions}
            topic={topic}
          />
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisData.demographics.map((demo: any) => (
              <Card key={demo.ageGroup}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{demo.label}</span>
                    <Badge variant="outline">{demo.range}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Support/Opposition bars */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-500">مؤيد</span>
                        <span>{demo.support}%</span>
                      </div>
                      <Progress value={demo.support} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-500">معارض</span>
                        <span>{demo.opposition}%</span>
                      </div>
                      <Progress value={demo.opposition} className="h-2 bg-muted [&>div]:bg-red-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-yellow-500">محايد</span>
                        <span>{demo.neutral}%</span>
                      </div>
                      <Progress value={demo.neutral} className="h-2 bg-muted [&>div]:bg-yellow-500" />
                    </div>
                    
                    {/* Dominant emotion */}
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">الشعور السائد</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">
                          {EMOTION_CONFIG[demo.dominantEmotion]?.icon || "📊"}
                        </span>
                        <span className="font-medium capitalize">{demo.dominantEmotion}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="mt-6 space-y-6">
          {/* Top Supporting & Opposing Regions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-500 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  المناطق الأكثر تأييداً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.topSupportingRegions.map((region: any, index: number) => (
                    <div key={region.regionCode} className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-green-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{region.regionNameAr}</p>
                          <p className="text-xs text-muted-foreground">{region.regionName}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        {region.support}% مؤيد
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-500 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  المناطق الأكثر معارضة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.topOpposingRegions.map((region: any, index: number) => (
                    <div key={region.regionCode} className="flex items-center justify-between p-2 bg-red-500/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-red-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{region.regionNameAr}</p>
                          <p className="text-xs text-muted-foreground">{region.regionName}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        {region.opposition}% معارض
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Regions Table */}
          <Card>
            <CardHeader>
              <CardTitle>جميع المناطق</CardTitle>
              <CardDescription>تحليل تفصيلي لكل منطقة</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنطقة</TableHead>
                    <TableHead className="text-center">مؤيد</TableHead>
                    <TableHead className="text-center">معارض</TableHead>
                    <TableHead className="text-center">محايد</TableHead>
                    <TableHead className="text-center">GMI</TableHead>
                    <TableHead className="text-center">الشعور السائد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisData.regions.map((region: any) => (
                    <TableRow key={region.regionCode}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{region.regionNameAr}</p>
                          <p className="text-xs text-muted-foreground">{region.regionName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-green-500 font-medium">{region.support}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-red-500 font-medium">{region.opposition}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-yellow-500 font-medium">{region.neutral}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={region.gmi > 0 ? "default" : region.gmi < 0 ? "destructive" : "secondary"}>
                          {region.gmi}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xl">
                          {EMOTION_CONFIG[region.dominantEmotion]?.icon || "📊"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Metadata */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>حجم العينة: {analysisData.sampleSize.toLocaleString()}</span>
              <span>•</span>
              <span>المصادر: {analysisData.sources.join(", ")}</span>
            </div>
            <div>
              <span>آخر تحديث: {new Date(analysisData.timestamp).toLocaleString("ar-LY")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
