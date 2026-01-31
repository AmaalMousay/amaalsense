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

// Country center coordinates for generating default region positions
const COUNTRY_CENTERS: Record<string, { lat: number; lng: number }> = {
  // Middle East & North Africa
  LY: { lat: 26.3351, lng: 17.2283 },
  EG: { lat: 26.8206, lng: 30.8025 },
  SA: { lat: 23.8859, lng: 45.0792 },
  AE: { lat: 23.4241, lng: 53.8478 },
  QA: { lat: 25.3548, lng: 51.1839 },
  KW: { lat: 29.3117, lng: 47.4818 },
  BH: { lat: 26.0667, lng: 50.5577 },
  OM: { lat: 21.4735, lng: 55.9754 },
  YE: { lat: 15.5527, lng: 48.5164 },
  JO: { lat: 30.5852, lng: 36.2384 },
  LB: { lat: 33.8547, lng: 35.8623 },
  SY: { lat: 34.8021, lng: 38.9968 },
  IQ: { lat: 33.2232, lng: 43.6793 },
  PS: { lat: 31.9522, lng: 35.2332 },
  TN: { lat: 33.8869, lng: 9.5375 },
  DZ: { lat: 28.0339, lng: 1.6596 },
  MA: { lat: 31.7917, lng: -7.0926 },
  SD: { lat: 12.8628, lng: 30.2176 },
  MR: { lat: 21.0079, lng: -10.9408 },
  SO: { lat: 5.1521, lng: 46.1996 },
  DJ: { lat: 11.8251, lng: 42.5903 },
  KM: { lat: -11.6455, lng: 43.3333 },
  
  // Europe
  GB: { lat: 55.3781, lng: -3.4360 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  PT: { lat: 39.3999, lng: -8.2245 },
  NL: { lat: 52.1326, lng: 5.2913 },
  BE: { lat: 50.5039, lng: 4.4699 },
  CH: { lat: 46.8182, lng: 8.2275 },
  AT: { lat: 47.5162, lng: 14.5501 },
  PL: { lat: 51.9194, lng: 19.1451 },
  CZ: { lat: 49.8175, lng: 15.4730 },
  SE: { lat: 60.1282, lng: 18.6435 },
  NO: { lat: 60.4720, lng: 8.4689 },
  DK: { lat: 56.2639, lng: 9.5018 },
  FI: { lat: 61.9241, lng: 25.7482 },
  IE: { lat: 53.1424, lng: -7.6921 },
  GR: { lat: 39.0742, lng: 21.8243 },
  TR: { lat: 38.9637, lng: 35.2433 },
  RU: { lat: 61.5240, lng: 105.3188 },
  UA: { lat: 48.3794, lng: 31.1656 },
  RO: { lat: 45.9432, lng: 24.9668 },
  HU: { lat: 47.1625, lng: 19.5033 },
  BG: { lat: 42.7339, lng: 25.4858 },
  RS: { lat: 44.0165, lng: 21.0059 },
  HR: { lat: 45.1000, lng: 15.2000 },
  SK: { lat: 48.6690, lng: 19.6990 },
  SI: { lat: 46.1512, lng: 14.9955 },
  
  // Americas
  US: { lat: 37.0902, lng: -95.7129 },
  CA: { lat: 56.1304, lng: -106.3468 },
  MX: { lat: 23.6345, lng: -102.5528 },
  BR: { lat: -14.2350, lng: -51.9253 },
  AR: { lat: -38.4161, lng: -63.6167 },
  CL: { lat: -35.6751, lng: -71.5430 },
  CO: { lat: 4.5709, lng: -74.2973 },
  PE: { lat: -9.1900, lng: -75.0152 },
  VE: { lat: 6.4238, lng: -66.5897 },
  EC: { lat: -1.8312, lng: -78.1834 },
  BO: { lat: -16.2902, lng: -63.5887 },
  PY: { lat: -23.4425, lng: -58.4438 },
  UY: { lat: -32.5228, lng: -55.7658 },
  CU: { lat: 21.5218, lng: -77.7812 },
  DO: { lat: 18.7357, lng: -70.1627 },
  PR: { lat: 18.2208, lng: -66.5901 },
  GT: { lat: 15.7835, lng: -90.2308 },
  HN: { lat: 15.2000, lng: -86.2419 },
  SV: { lat: 13.7942, lng: -88.8965 },
  NI: { lat: 12.8654, lng: -85.2072 },
  CR: { lat: 9.7489, lng: -83.7534 },
  PA: { lat: 8.5380, lng: -80.7821 },
  
  // Asia
  CN: { lat: 35.8617, lng: 104.1954 },
  JP: { lat: 36.2048, lng: 138.2529 },
  KR: { lat: 35.9078, lng: 127.7669 },
  IN: { lat: 20.5937, lng: 78.9629 },
  ID: { lat: -0.7893, lng: 113.9213 },
  TH: { lat: 15.8700, lng: 100.9925 },
  VN: { lat: 14.0583, lng: 108.2772 },
  MY: { lat: 4.2105, lng: 101.9758 },
  SG: { lat: 1.3521, lng: 103.8198 },
  PH: { lat: 12.8797, lng: 121.7740 },
  PK: { lat: 30.3753, lng: 69.3451 },
  BD: { lat: 23.6850, lng: 90.3563 },
  MM: { lat: 21.9162, lng: 95.9560 },
  NP: { lat: 28.3949, lng: 84.1240 },
  LK: { lat: 7.8731, lng: 80.7718 },
  KH: { lat: 12.5657, lng: 104.9910 },
  LA: { lat: 19.8563, lng: 102.4955 },
  TW: { lat: 23.6978, lng: 120.9605 },
  HK: { lat: 22.3193, lng: 114.1694 },
  MO: { lat: 22.1987, lng: 113.5439 },
  MN: { lat: 46.8625, lng: 103.8467 },
  KZ: { lat: 48.0196, lng: 66.9237 },
  UZ: { lat: 41.3775, lng: 64.5853 },
  AF: { lat: 33.9391, lng: 67.7100 },
  IR: { lat: 32.4279, lng: 53.6880 },
  
  // Africa
  NG: { lat: 9.0820, lng: 8.6753 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  KE: { lat: -0.0236, lng: 37.9062 },
  ET: { lat: 9.1450, lng: 40.4897 },
  GH: { lat: 7.9465, lng: -1.0232 },
  TZ: { lat: -6.3690, lng: 34.8888 },
  UG: { lat: 1.3733, lng: 32.2903 },
  RW: { lat: -1.9403, lng: 29.8739 },
  SN: { lat: 14.4974, lng: -14.4524 },
  CI: { lat: 7.5400, lng: -5.5471 },
  CM: { lat: 7.3697, lng: 12.3547 },
  AO: { lat: -11.2027, lng: 17.8739 },
  MZ: { lat: -18.6657, lng: 35.5296 },
  ZW: { lat: -19.0154, lng: 29.1549 },
  ZM: { lat: -13.1339, lng: 27.8493 },
  BW: { lat: -22.3285, lng: 24.6849 },
  NA: { lat: -22.9576, lng: 18.4904 },
  MW: { lat: -13.2543, lng: 34.3015 },
  MG: { lat: -18.7669, lng: 46.8691 },
  MU: { lat: -20.3484, lng: 57.5522 },
  
  // Oceania
  AU: { lat: -25.2744, lng: 133.7751 },
  NZ: { lat: -40.9006, lng: 174.8860 },
  FJ: { lat: -17.7134, lng: 178.0650 },
  PG: { lat: -6.3150, lng: 143.9555 },
};

// Default coordinates for unknown regions - uses country center
const DEFAULT_COORDS = { lat: 0, lng: 0 };

// Generate default region coordinates based on country center
function getDefaultRegionCoordinates(countryCode: string, regionCode: string): { lat: number; lng: number } {
  const center = COUNTRY_CENTERS[countryCode];
  if (!center) return DEFAULT_COORDS;
  
  // Offset based on region code to spread markers around the country
  const offsets: Record<string, { lat: number; lng: number }> = {
    CAP: { lat: 0, lng: 0 },           // Capital at center
    NOR: { lat: 2, lng: 0 },           // North
    SOU: { lat: -2, lng: 0 },          // South
    EAS: { lat: 0, lng: 2 },           // East
    WES: { lat: 0, lng: -2 },          // West
  };
  
  const offset = offsets[regionCode] || { lat: 0, lng: 0 };
  return {
    lat: center.lat + offset.lat,
    lng: center.lng + offset.lng,
  };
}

function getRegionCoordinates(countryCode: string, regionCode: string): { lat: number; lng: number } {
  // First check if we have specific coordinates for this region
  const specificCoords = REGION_COORDINATES[countryCode]?.[regionCode];
  if (specificCoords) return specificCoords;
  
  // Otherwise generate coordinates based on country center
  return getDefaultRegionCoordinates(countryCode, regionCode);
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
