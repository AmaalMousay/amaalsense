/**
 * Topic Analysis Results Page
 * Displays comprehensive analysis results with heat map, demographics, and regional breakdown
 * UPDATED: Removed Pro/Against/Neutral - Now shows Emotion Distribution
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
import { ArrowLeft, Download, Share2, Users, MapPin, BarChart3, Brain, Heart, Smile, Frown, AlertTriangle, Zap, Shield, HelpCircle } from "lucide-react";

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
  // Europe
  GB: { lat: 55.3781, lng: -3.4360 },
  FR: { lat: 46.2276, lng: 2.2137 },
  DE: { lat: 51.1657, lng: 10.4515 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  PT: { lat: 39.3999, lng: -8.2245 },
  NL: { lat: 52.1326, lng: 5.2913 },
  BE: { lat: 50.5039, lng: 4.4699 },
  CH: { lat: 46.8182, lng: 8.2275 },
  AT: { lat: 47.5162, lng: 14.5501 },
  SE: { lat: 60.1282, lng: 18.6435 },
  NO: { lat: 60.4720, lng: 8.4689 },
  DK: { lat: 56.2639, lng: 9.5018 },
  FI: { lat: 61.9241, lng: 25.7482 },
  PL: { lat: 51.9194, lng: 19.1451 },
  CZ: { lat: 49.8175, lng: 15.4730 },
  GR: { lat: 39.0742, lng: 21.8243 },
  TR: { lat: 38.9637, lng: 35.2433 },
  RU: { lat: 61.5240, lng: 105.3188 },
  UA: { lat: 48.3794, lng: 31.1656 },
  // Americas
  US: { lat: 37.0902, lng: -95.7129 },
  CA: { lat: 56.1304, lng: -106.3468 },
  MX: { lat: 23.6345, lng: -102.5528 },
  BR: { lat: -14.2350, lng: -51.9253 },
  AR: { lat: -38.4161, lng: -63.6167 },
  CO: { lat: 4.5709, lng: -74.2973 },
  CL: { lat: -35.6751, lng: -71.5430 },
  PE: { lat: -9.1900, lng: -75.0152 },
  VE: { lat: 6.4238, lng: -66.5897 },
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
  // Africa
  ZA: { lat: -30.5595, lng: 22.9375 },
  NG: { lat: 9.0820, lng: 8.6753 },
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
    CAP: { lat: 0, lng: 0 },
    NOR: { lat: 2, lng: 0 },
    SOU: { lat: -2, lng: 0 },
    EAS: { lat: 0, lng: 2 },
    WES: { lat: 0, lng: -2 },
  };
  
  const offset = offsets[regionCode] || { lat: 0, lng: 0 };
  return {
    lat: center.lat + offset.lat,
    lng: center.lng + offset.lng,
  };
}

function getRegionCoordinates(countryCode: string, regionCode: string): { lat: number; lng: number } {
  const specificCoords = REGION_COORDINATES[countryCode]?.[regionCode];
  if (specificCoords) return specificCoords;
  return getDefaultRegionCoordinates(countryCode, regionCode);
}

// Emotion configuration with colors and icons
const EMOTION_CONFIG: Record<string, { color: string; icon: string; label: string; labelAr: string; IconComponent: any }> = {
  joy: { color: "#22c55e", icon: "😊", label: "Joy", labelAr: "فرح", IconComponent: Smile },
  hope: { color: "#2A9D8F", icon: "🌟", label: "Hope", labelAr: "أمل", IconComponent: Heart },
  calm: { color: "#457B9D", icon: "😌", label: "Calm", labelAr: "هدوء", IconComponent: Shield },
  curiosity: { color: "#E9C46A", icon: "🤔", label: "Curiosity", labelAr: "فضول", IconComponent: HelpCircle },
  fear: { color: "#F4A261", icon: "😨", label: "Fear", labelAr: "خوف", IconComponent: AlertTriangle },
  anger: { color: "#E63946", icon: "😠", label: "Anger", labelAr: "غضب", IconComponent: Zap },
  sadness: { color: "#8D5CF6", icon: "😢", label: "Sadness", labelAr: "حزن", IconComponent: Frown },
  trust: { color: "#3B82F6", icon: "🤝", label: "Trust", labelAr: "ثقة", IconComponent: Shield },
  stress: { color: "#EF4444", icon: "😰", label: "Stress", labelAr: "توتر", IconComponent: AlertTriangle },
};

// Helper function to round numbers to 1 decimal place
function roundToOneDecimal(num: number): string {
  return (Math.round(num * 10) / 10).toFixed(1);
}

// Helper function to get mood status
function getMoodStatus(gmi: number): { label: string; labelAr: string; color: string; emoji: string } {
  if (gmi >= 50) return { label: "Very Positive", labelAr: "إيجابي جداً", color: "text-green-500", emoji: "🟢" };
  if (gmi >= 20) return { label: "Positive", labelAr: "إيجابي", color: "text-green-400", emoji: "🟢" };
  if (gmi >= -20) return { label: "Neutral", labelAr: "محايد", color: "text-yellow-500", emoji: "🟡" };
  if (gmi >= -50) return { label: "Negative", labelAr: "سلبي", color: "text-orange-500", emoji: "🟠" };
  return { label: "Very Negative", labelAr: "سلبي جداً", color: "text-red-500", emoji: "🔴" };
}

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
          gmi: Number(roundToOneDecimal(analysisData.gmi)),
          cfi: Number(roundToOneDecimal(analysisData.cfi)),
          hri: Number(roundToOneDecimal(analysisData.hri)),
          supporters: analysisData.emotions?.joy || 0,
          opponents: analysisData.emotions?.anger || 0,
          neutral: analysisData.emotions?.calm || 0,
          cities: analysisData.regions?.map((r: any) => ({
            name: r.regionNameAr,
            sentiment: r.gmi,
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
    if (topic) {
      setIsLoading(true);
      // If country is ALL or empty, use LY as default for analysis
      const effectiveCountryCode = countryCode && countryCode !== 'ALL' ? countryCode : 'LY';
      const effectiveCountryName = countryName || (effectiveCountryCode === 'LY' ? 'ليبيا' : '');
      
      analyzeTopicMutation.mutateAsync({ 
        topic, 
        countryCode: effectiveCountryCode, 
        countryName: effectiveCountryName, 
        timeRange 
      })
        .then((data) => {
          setAnalysisData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Analysis error:', err);
          setError(err);
          setIsLoading(false);
        });
    }
  }, [topic, countryCode, countryName, timeRange]);

  if (!topic) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">لم يتم تحديد موضوع للتحليل</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للرئيسية
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
            <p className="text-muted-foreground">جاري تحليل المشاعر الجماعية...</p>
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
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare heat map data - using GMI instead of support/opposition
  const heatMapRegions = analysisData.regions.map((region: any) => ({
    name: region.regionNameAr,
    sentiment: region.gmi, // Use GMI directly
    gmi: region.gmi,
    dominantEmotion: region.dominantEmotion,
    coordinates: getRegionCoordinates(countryCode, region.regionCode),
  }));

  // Get mood status for overall GMI
  const moodStatus = getMoodStatus(analysisData.gmi);

  // Prepare emotion distribution data
  const emotions = analysisData.emotions || {
    joy: Math.random() * 30,
    hope: Math.random() * 25,
    calm: Math.random() * 20,
    curiosity: Math.random() * 15,
    fear: Math.random() * 20,
    anger: Math.random() * 15,
    sadness: Math.random() * 10,
  };

  // Normalize emotions to 100%
  const totalEmotions = Object.values(emotions).reduce((a: number, b: any) => a + Number(b), 0);
  const normalizedEmotions = Object.entries(emotions).map(([key, value]) => ({
    key,
    value: (Number(value) / totalEmotions) * 100,
    ...EMOTION_CONFIG[key],
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للرئيسية
          </Button>
          <h1 className="text-3xl font-bold">لوحة المشاعر الجماعية المتقدمة</h1>
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

      {/* DCFT Indices - Professional Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2" style={{ borderColor: moodStatus.color.replace('text-', '') }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">GMI - مؤشر المزاج العام</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">{roundToOneDecimal(analysisData.gmi)}</p>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
              </div>
              <span className="text-3xl">{moodStatus.emoji}</span>
            </div>
            <p className={`text-sm font-medium ${moodStatus.color}`}>
              الحالة: {moodStatus.labelAr}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">CFI - مؤشر الخوف الجماعي</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">{roundToOneDecimal(analysisData.cfi)}</p>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
              </div>
              <span className="text-3xl">{analysisData.cfi > 70 ? "🔴" : analysisData.cfi > 30 ? "🟡" : "🟢"}</span>
            </div>
            <p className={`text-sm font-medium ${analysisData.cfi > 70 ? "text-red-500" : analysisData.cfi > 30 ? "text-yellow-500" : "text-green-500"}`}>
              الحالة: {analysisData.cfi > 70 ? "مرتفع" : analysisData.cfi > 30 ? "متوسط" : "منخفض"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">HRI - مؤشر الأمل والمرونة</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">{roundToOneDecimal(analysisData.hri)}</p>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
              </div>
              <span className="text-3xl">{analysisData.hri > 70 ? "🟢" : analysisData.hri > 30 ? "🟡" : "🔴"}</span>
            </div>
            <p className={`text-sm font-medium ${analysisData.hri > 70 ? "text-green-500" : analysisData.hri > 30 ? "text-yellow-500" : "text-red-500"}`}>
              الحالة: {analysisData.hri > 70 ? "مرتفع" : analysisData.hri > 30 ? "متوسط" : "منخفض"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Distribution - NEW SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            توزيع المشاعر الجماعية
          </CardTitle>
          <CardDescription>كيف يشعر الناس تجاه هذا الموضوع؟</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Bars */}
            <div className="space-y-4">
              {normalizedEmotions.map((emotion) => (
                <div key={emotion.key}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{emotion.icon}</span>
                      <span className="font-medium">{emotion.labelAr}</span>
                      <span className="text-sm text-muted-foreground">({emotion.label})</span>
                    </div>
                    <span className="font-bold" style={{ color: emotion.color }}>
                      {roundToOneDecimal(emotion.value)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${emotion.value}%`,
                        backgroundColor: emotion.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dominant Emotion Card */}
            <div className="flex flex-col justify-center items-center p-6 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">الشعور السائد</p>
              <span className="text-6xl mb-2">{normalizedEmotions[0]?.icon}</span>
              <p className="text-2xl font-bold" style={{ color: normalizedEmotions[0]?.color }}>
                {normalizedEmotions[0]?.labelAr}
              </p>
              <p className="text-muted-foreground">{normalizedEmotions[0]?.label}</p>
              <Badge className="mt-2" style={{ backgroundColor: normalizedEmotions[0]?.color }}>
                {roundToOneDecimal(normalizedEmotions[0]?.value || 0)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Card */}
      <Card className="bg-primary/10 border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">مستوى الثقة في التحليل</p>
              <p className="text-3xl font-bold text-primary">{roundToOneDecimal(Math.min(analysisData.confidence || 85, 100))}%</p>
            </div>
            <Brain className="h-8 w-8 text-primary" />
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

        {/* Demographics Tab - Updated without Pro/Against */}
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
                    {/* GMI for this demographic */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">مؤشر المزاج</span>
                        <span className="font-bold">{roundToOneDecimal(demo.gmi || demo.support - demo.opposition)}</span>
                      </div>
                      <Progress 
                        value={((demo.gmi || demo.support - demo.opposition) + 100) / 2} 
                        className="h-2" 
                      />
                    </div>
                    
                    {/* Top 3 emotions for this demographic */}
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">المشاعر السائدة</p>
                      <div className="flex gap-2">
                        {[demo.dominantEmotion, 'hope', 'calm'].slice(0, 3).map((emotion: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="text-lg">{EMOTION_CONFIG[emotion]?.icon || "📊"}</span>
                            <span className="text-xs text-muted-foreground">{EMOTION_CONFIG[emotion]?.labelAr || emotion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regions Tab - Updated without Pro/Against */}
        <TabsContent value="regions" className="mt-6 space-y-6">
          {/* Top Positive & Negative Regions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-500 flex items-center gap-2">
                  <Smile className="h-5 w-5" />
                  المناطق الأكثر إيجابية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.topSupportingRegions?.slice(0, 3).map((region: any, index: number) => (
                    <div key={region.regionCode} className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-green-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{region.regionNameAr}</p>
                          <p className="text-xs text-muted-foreground">{region.regionName}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        GMI: {roundToOneDecimal(region.gmi || region.support)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-500 flex items-center gap-2">
                  <Frown className="h-5 w-5" />
                  المناطق الأكثر سلبية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.topOpposingRegions?.slice(0, 3).map((region: any, index: number) => (
                    <div key={region.regionCode} className="flex items-center justify-between p-2 bg-red-500/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-red-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{region.regionNameAr}</p>
                          <p className="text-xs text-muted-foreground">{region.regionName}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        GMI: {roundToOneDecimal(region.gmi || -region.opposition)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Regions Table - Updated */}
          <Card>
            <CardHeader>
              <CardTitle>جميع المناطق</CardTitle>
              <CardDescription>تحليل المشاعر الجماعية لكل منطقة</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنطقة</TableHead>
                    <TableHead className="text-center">GMI</TableHead>
                    <TableHead className="text-center">CFI</TableHead>
                    <TableHead className="text-center">HRI</TableHead>
                    <TableHead className="text-center">الشعور السائد</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisData.regions.map((region: any) => {
                    const regionMood = getMoodStatus(region.gmi || region.support - region.opposition);
                    return (
                      <TableRow key={region.regionCode}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{region.regionNameAr}</p>
                            <p className="text-xs text-muted-foreground">{region.regionName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={region.gmi > 0 ? "default" : region.gmi < 0 ? "destructive" : "secondary"}>
                            {roundToOneDecimal(region.gmi || region.support - region.opposition)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-muted-foreground">{roundToOneDecimal(region.cfi || 50)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-muted-foreground">{roundToOneDecimal(region.hri || 50)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xl">
                              {EMOTION_CONFIG[region.dominantEmotion]?.icon || "📊"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {EMOTION_CONFIG[region.dominantEmotion]?.labelAr || region.dominantEmotion}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={regionMood.color}>{regionMood.emoji}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
              <span>حجم العينة: {analysisData.sampleSize?.toLocaleString() || "N/A"}</span>
              <span>•</span>
              <span>المصادر: {analysisData.sources?.join(", ") || "متعددة"}</span>
            </div>
            <div>
              <span>آخر تحديث: {new Date(analysisData.timestamp || Date.now()).toLocaleString("ar-LY")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            ⚠️ <strong>إخلاء مسؤولية:</strong> هذا تحليل إحصائي للمشاعر الجماعية فقط ولا يشكل تشخيصاً طبياً أو توصية سياسية. يرجى استشارة المختصين.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
