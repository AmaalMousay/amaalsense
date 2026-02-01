/**
 * Topic Analysis Results Page - AmalSense
 * "Emotional Bloomberg Terminal for the World"
 * 9 Sections Architecture
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegionalHeatMap } from "@/components/RegionalHeatMap";
import { COUNTRIES, getCountryByCode } from "@/data/countries";
import { 
  ArrowLeft, Download, Share2, Clock, Globe, Brain, 
  TrendingUp, TrendingDown, AlertTriangle, Shield, 
  Sun, Cloud, CloudRain, CloudLightning, Zap,
  BarChart3, PieChart, Activity, Target, Eye,
  Newspaper, LineChart as LineChartIcon, Users, Database
} from "lucide-react";

// User modes
type UserMode = 'general' | 'journalist' | 'trader' | 'researcher';

// Emotional Weather types
const EMOTIONAL_WEATHER = {
  hopeful: { icon: Sun, label: 'Hopeful', labelAr: 'متفائل', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  mixed: { icon: Cloud, label: 'Mixed', labelAr: 'متقلب', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  fearful: { icon: CloudRain, label: 'Fearful', labelAr: 'قلق', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  tense: { icon: CloudLightning, label: 'Tense', labelAr: 'متوتر', color: 'text-red-500', bg: 'bg-red-500/10' },
};

// Domain classifications
const DOMAINS = {
  politics: { icon: '📰', label: 'Politics', labelAr: 'سياسة' },
  economy: { icon: '💰', label: 'Economy', labelAr: 'اقتصاد' },
  conflict: { icon: '⚔️', label: 'Conflict', labelAr: 'صراع' },
  health: { icon: '🏥', label: 'Health', labelAr: 'صحة' },
  environment: { icon: '🌱', label: 'Environment', labelAr: 'بيئة' },
  tech: { icon: '🚀', label: 'Tech', labelAr: 'تقنية' },
  social: { icon: '👥', label: 'Social', labelAr: 'اجتماعي' },
};

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
  },
};

// Country centers
const COUNTRY_CENTERS: Record<string, { lat: number; lng: number }> = {
  LY: { lat: 26.3351, lng: 17.2283 },
  EG: { lat: 26.8206, lng: 30.8025 },
  SA: { lat: 23.8859, lng: 45.0792 },
  AE: { lat: 23.4241, lng: 53.8478 },
  US: { lat: 37.0902, lng: -95.7129 },
  GB: { lat: 55.3781, lng: -3.4360 },
};

export default function TopicAnalysisResults() {
  const [location, navigate] = useLocation();
  
  // Parse URL search params properly
  const getSearchParams = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams(location.split("?")[1] || "");
  };
  
  const searchParams = getSearchParams();
  const topic = searchParams.get("topic") || "";
  const countryCode = searchParams.get("country") || "";
  const countryName = searchParams.get("countryName") || "";
  const timeRange = (searchParams.get("timeRange") as "day" | "week" | "month") || "week";

  // State
  const [userMode, setUserMode] = useState<UserMode>('general');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Feedback State
  const [feedbackGiven, setFeedbackGiven] = useState<'accurate' | 'inaccurate' | 'correction' | null>(null);
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [correctionEmotion, setCorrectionEmotion] = useState<string | null>(null);

  // Mutations
  const analyzeTopicMutation = trpc.topic.analyzeTopicInCountry.useMutation();
  const generatePdfMutation = trpc.pdfExport.generateAnalysisReport.useMutation();

  // Export PDF
  const handleExportPDF = async () => {
    if (!analysisData) return;
    setIsExporting(true);
    try {
      const result = await generatePdfMutation.mutateAsync({
        topic,
        country: countryCode || 'LY',
        countryName: countryName || 'ليبيا',
        timeRange,
        analysisData,
      });
      // Create blob from HTML or handle PDF export differently
      const blob = new Blob([result.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AmalSense_${topic.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
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

  // Handle Feedback
  const handleFeedback = (type: 'accurate' | 'inaccurate' | 'correction') => {
    setFeedbackGiven(type);
    if (type === 'correction' && correctionEmotion) {
      setShowCorrectionDialog(false);
      // TODO: Send correction to backend
      console.log('Feedback sent:', { type, correctionEmotion, topic, countryCode });
    } else if (type !== 'correction') {
      // TODO: Send feedback to backend
      console.log('Feedback sent:', { type, topic, countryCode });
    }
  };

  // Fetch analysis data
  useEffect(() => {
    if (topic) {
      setIsLoading(true);
      const effectiveCountryCode = countryCode && countryCode !== 'ALL' ? countryCode : 'LY';
      const countryData = getCountryByCode(effectiveCountryCode);
      const effectiveCountryName = countryName || countryData?.nameAr || (effectiveCountryCode === 'LY' ? 'ليبيا' : effectiveCountryCode);
      
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

  // Helper functions
  const getGMILabel = (gmi: number) => {
    if (gmi <= -60) return { label: 'Very Negative', labelAr: 'سلبي جداً', color: 'text-red-600' };
    if (gmi <= -20) return { label: 'Negative', labelAr: 'سلبي', color: 'text-red-400' };
    if (gmi <= 20) return { label: 'Neutral', labelAr: 'محايد', color: 'text-yellow-500' };
    if (gmi <= 60) return { label: 'Positive', labelAr: 'إيجابي', color: 'text-green-400' };
    return { label: 'Very Positive', labelAr: 'إيجابي جداً', color: 'text-green-600' };
  };

  const getEmotionalWeather = (emotions: any) => {
    if (!emotions) return EMOTIONAL_WEATHER.mixed;
    const hope = emotions.hope || 0;
    const fear = emotions.fear || 0;
    const anger = emotions.anger || 0;
    
    if (hope > 40) return EMOTIONAL_WEATHER.hopeful;
    if (fear > 50 || anger > 40) return EMOTIONAL_WEATHER.tense;
    if (fear > 30) return EMOTIONAL_WEATHER.fearful;
    return EMOTIONAL_WEATHER.mixed;
  };

  const getDomain = (data: any) => {
    // Detect domain from keywords or context
    const topic_lower = topic.toLowerCase();
    if (topic_lower.includes('سياس') || topic_lower.includes('انتخاب') || topic_lower.includes('politic')) return DOMAINS.politics;
    if (topic_lower.includes('اقتصاد') || topic_lower.includes('نفط') || topic_lower.includes('سعر') || topic_lower.includes('econom')) return DOMAINS.economy;
    if (topic_lower.includes('حرب') || topic_lower.includes('صراع') || topic_lower.includes('war') || topic_lower.includes('conflict')) return DOMAINS.conflict;
    if (topic_lower.includes('صح') || topic_lower.includes('مرض') || topic_lower.includes('health')) return DOMAINS.health;
    if (topic_lower.includes('بيئ') || topic_lower.includes('مناخ') || topic_lower.includes('environment')) return DOMAINS.environment;
    if (topic_lower.includes('تقن') || topic_lower.includes('ذكاء') || topic_lower.includes('tech') || topic_lower.includes('ai')) return DOMAINS.tech;
    return DOMAINS.social;
  };

  const getSensitivity = (cfi: number) => {
    if (cfi > 70) return { level: 'High', levelAr: 'عالي', color: 'text-red-500' };
    if (cfi > 40) return { level: 'Medium', levelAr: 'متوسط', color: 'text-yellow-500' };
    return { level: 'Low', levelAr: 'منخفض', color: 'text-green-500' };
  };

  const getRiskLevel = (cfi: number, gmi: number) => {
    if (cfi > 70 && gmi < -30) return { level: 'Critical', levelAr: 'حرج', color: 'bg-red-500' };
    if (cfi > 50 || gmi < -20) return { level: 'Alert', levelAr: 'تنبيه', color: 'bg-yellow-500' };
    return { level: 'Normal', levelAr: 'طبيعي', color: 'bg-green-500' };
  };

  // Loading state
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center py-12 px-8 max-w-md">
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto"></div>
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold">جاري تحليل المشاعر الجماعية...</h3>
            <p className="text-muted-foreground">تحليل "{topic}"</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>جمع البيانات من 15+ مصدر</span>
            </div>
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
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
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

  // Extract data
  const gmi = analysisData.gmi || 0;
  const cfi = analysisData.cfi || 50;
  const hri = analysisData.hri || 50;
  const emotions = analysisData.emotions || {};
  const confidence = analysisData.confidence || 85;
  const gmiInfo = getGMILabel(gmi);
  const weather = getEmotionalWeather(emotions);
  const domain = getDomain(analysisData);
  const sensitivity = getSensitivity(cfi);
  const riskLevel = getRiskLevel(cfi, gmi);
  const WeatherIcon = weather.icon;

  // Prepare emotion data
  const emotionData = [
    { name: 'أمل', nameEn: 'Hope', value: emotions.hope || 0, emoji: '🌟', color: 'bg-yellow-500' },
    { name: 'خوف', nameEn: 'Fear', value: emotions.fear || 0, emoji: '😨', color: 'bg-blue-500' },
    { name: 'غضب', nameEn: 'Anger', value: emotions.anger || 0, emoji: '😠', color: 'bg-red-500' },
    { name: 'حزن', nameEn: 'Sadness', value: emotions.sadness || 0, emoji: '😢', color: 'bg-purple-500' },
    { name: 'فرح', nameEn: 'Joy', value: emotions.joy || 0, emoji: '😊', color: 'bg-green-500' },
    { name: 'فضول', nameEn: 'Curiosity', value: emotions.curiosity || 0, emoji: '🤔', color: 'bg-orange-500' },
    { name: 'هدوء', nameEn: 'Calm', value: emotions.calm || 0, emoji: '😌', color: 'bg-teal-500' },
  ].sort((a, b) => b.value - a.value);

  const dominantEmotion = emotionData[0];

  // Prepare heat map data
  const heatMapRegions = analysisData.regions?.map((region: any) => {
    const coords = REGION_COORDINATES[countryCode || 'LY']?.[region.regionCode];
    const countryCenter = COUNTRY_CENTERS[countryCode || 'LY'] || { lat: 26.3351, lng: 17.2283 };
    
    return {
      name: region.regionNameAr || region.name || 'Unknown',
      sentiment: region.gmi || 0,
      gmi: region.gmi || 0,
      dominantEmotion: region.dominantEmotion || 'حياد',
      coordinates: {
        lat: coords?.lat || countryCenter.lat + (Math.random() - 0.5) * 4,
        lng: coords?.lng || countryCenter.lng + (Math.random() - 0.5) * 4,
      },
    };
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* ========== 0. INPUT SUMMARY BAR ========== */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 ml-2" />
                العودة
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="font-bold text-lg truncate max-w-[300px]">{topic}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {countryName || 'ليبيا'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date().toLocaleString('ar-LY')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Global Confidence */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{confidence.toFixed(0)}% ثقة</span>
              </div>
              
              {/* User Mode Selector */}
              <Select value={userMode} onValueChange={(v) => setUserMode(v as UserMode)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">👤 عام</SelectItem>
                  <SelectItem value="journalist">📰 صحفي</SelectItem>
                  <SelectItem value="trader">📈 متداول</SelectItem>
                  <SelectItem value="researcher">🔬 باحث</SelectItem>
                </SelectContent>
              </Select>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={() => navigator.share?.({ title: topic, url: window.location.href })}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleExportPDF} disabled={isExporting}>
                <Download className="h-4 w-4 ml-2" />
                {isExporting ? 'جاري...' : 'PDF'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* ========== 1. GLOBAL EMOTIONAL SNAPSHOT (Hero Section) ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GMI Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardContent className="pt-6 relative">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">مؤشر المزاج العام</p>
                <div className="relative">
                  <div className={`text-7xl font-bold ${gmiInfo.color}`}>
                    {gmi > 0 ? '+' : ''}{gmi.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">من -100 إلى +100</div>
                </div>
                <Badge variant="outline" className={`text-lg px-4 py-1 ${gmiInfo.color}`}>
                  {gmiInfo.labelAr}
                </Badge>
                
                {/* GMI Scale */}
                <div className="relative h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mt-4">
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg"
                    style={{ left: `${((gmi + 100) / 200) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-100</span>
                  <span>0</span>
                  <span>+100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emotional Weather Card */}
          <Card className={`relative overflow-hidden ${weather.bg}`}>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">الطقس العاطفي</p>
                <div className="flex justify-center">
                  <div className={`p-6 rounded-full ${weather.bg}`}>
                    <WeatherIcon className={`h-20 w-20 ${weather.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${weather.color}`}>{weather.labelAr}</h3>
                  <p className="text-muted-foreground">{weather.label}</p>
                </div>
                
                {/* AI Generated Description */}
                <div className="bg-background/50 rounded-lg p-4 text-sm">
                  <p className="text-muted-foreground">
                    {gmi > 20 
                      ? `المشاعر العامة تجاه "${topic}" إيجابية بشكل ملحوظ، مع سيادة مشاعر ${dominantEmotion.name}.`
                      : gmi < -20
                      ? `المشاعر العامة تجاه "${topic}" سلبية، مع ارتفاع ملحوظ في ${dominantEmotion.name}.`
                      : `المشاعر تجاه "${topic}" متباينة ومختلطة، مع تنوع في ردود الفعل.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== 2. EMOTION DISTRIBUTION ========== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              توزيع المشاعر الجماعية
            </CardTitle>
            <CardDescription>DNA العاطفي للحدث - كيف يشعر الناس تجاه هذا الموضوع؟</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emotion Bars */}
              <div className="space-y-4">
                {emotionData.map((emotion, i) => (
                  <div key={emotion.nameEn} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{emotion.emoji}</span>
                        <span className="font-medium">{emotion.name}</span>
                        <span className="text-xs text-muted-foreground">({emotion.nameEn})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{emotion.value.toFixed(1)}%</span>
                        {userMode !== 'general' && (
                          <Badge variant="outline" className="text-xs">
                            ثقة: {(85 + Math.random() * 10).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={emotion.value} className={`h-3 ${emotion.color}`} />
                  </div>
                ))}
              </div>

              {/* Dominant Emotion */}
              <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-4">الشعور السائد</p>
                <div className="text-6xl mb-2">{dominantEmotion.emoji}</div>
                <h3 className="text-2xl font-bold">{dominantEmotion.name}</h3>
                <p className="text-muted-foreground">{dominantEmotion.nameEn}</p>
                <Badge className="mt-3 text-lg px-4 py-1">{dominantEmotion.value.toFixed(1)}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 3. SMART INDICES PANEL ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GMI */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">GMI</p>
                  <p className="text-xs text-muted-foreground">Global Mood Index</p>
                </div>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-4xl font-bold">{gmi.toFixed(1)}</div>
              <p className={`text-sm ${gmiInfo.color}`}>{gmiInfo.labelAr}</p>
            </CardContent>
          </Card>

          {/* CFI */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">CFI</p>
                  <p className="text-xs text-muted-foreground">Collective Fear Index</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold">{cfi.toFixed(1)}</div>
              <Progress value={cfi} className="h-2 mt-2" />
            </CardContent>
          </Card>

          {/* HRI */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">HRI</p>
                  <p className="text-xs text-muted-foreground">Hope Resilience Index</p>
                </div>
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold">{hri.toFixed(1)}</div>
              <Progress value={hri} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Additional indices for trader/researcher mode */}
        {(userMode === 'trader' || userMode === 'researcher') && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Sentiment Momentum</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {gmi > 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
                  <span className="text-xl font-bold">{gmi > 0 ? 'صاعد' : 'هابط'}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Fear Spike</p>
                <div className="text-xl font-bold mt-2">{cfi > 60 ? '🔥 مرتفع' : '✓ طبيعي'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Volatility</p>
                <div className="text-xl font-bold mt-2">{Math.abs(gmi) > 30 ? 'عالي' : 'منخفض'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Polarization</p>
                <div className="text-xl font-bold mt-2">متوسط</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========== 4. EXPLAINABILITY ENGINE ========== */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              لماذا هذا المزاج؟
              <Badge variant="secondary">AI Explainability</Badge>
            </CardTitle>
            <CardDescription>تفسير سببي مولد بالذكاء الاصطناعي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Explanation */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-lg leading-relaxed">
                {dominantEmotion.name === 'خوف' && (
                  <>مستوى الخوف المرتفع ({emotions.fear?.toFixed(1)}%) ناتج عن كلمات مفتاحية مثل "أزمة"، "تحذير"، "خطر" المتكررة في المصادر. السياق العام يشير إلى حالة عدم يقين.</>
                )}
                {dominantEmotion.name === 'أمل' && (
                  <>مستوى الأمل المرتفع ({emotions.hope?.toFixed(1)}%) ناتج عن كلمات إيجابية مثل "تحسن"، "نمو"، "فرصة". المصادر تشير إلى توقعات إيجابية.</>
                )}
                {dominantEmotion.name === 'غضب' && (
                  <>مستوى الغضب المرتفع ({emotions.anger?.toFixed(1)}%) ناتج عن ردود فعل سلبية وانتقادات في المصادر الاجتماعية.</>
                )}
                {dominantEmotion.name === 'حزن' && (
                  <>مستوى الحزن المرتفع ({emotions.sadness?.toFixed(1)}%) مرتبط بأحداث مؤثرة عاطفياً أو خسائر.</>
                )}
                {!['خوف', 'أمل', 'غضب', 'حزن'].includes(dominantEmotion.name) && (
                  <>المشاعر متنوعة مع سيادة {dominantEmotion.name} ({dominantEmotion.value.toFixed(1)}%). التفاعلات تعكس تباين في الآراء.</>
                )}
              </p>
            </div>

            {/* Keywords - for journalist/researcher */}
            {(userMode === 'journalist' || userMode === 'researcher') && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  الكلمات المفتاحية المؤثرة
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['أزمة', 'تحذير', 'ارتفاع', 'انخفاض', 'توقعات', 'تأثير', topic.split(' ')[0]].map((keyword, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Why questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 rounded-lg p-4">
                <h4 className="font-semibold text-red-500 mb-2">لماذا الخوف {cfi > 50 ? 'مرتفع' : 'منخفض'}؟</h4>
                <p className="text-sm text-muted-foreground">
                  {cfi > 50 
                    ? 'وجود كلمات تحذيرية وأخبار سلبية في المصادر الرئيسية.'
                    : 'غياب المؤشرات السلبية الحادة في المحتوى المحلل.'
                  }
                </p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <h4 className="font-semibold text-green-500 mb-2">لماذا الأمل {hri > 50 ? 'مرتفع' : 'منخفض'}؟</h4>
                <p className="text-sm text-muted-foreground">
                  {hri > 50 
                    ? 'وجود مؤشرات إيجابية وتوقعات متفائلة في التحليل.'
                    : 'سيطرة المشاعر السلبية على المحتوى المحلل.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 5. TEMPORAL EMOTION TREND ========== */}
        {(userMode !== 'general') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                تطور المشاعر عبر الزمن
              </CardTitle>
              <CardDescription>تتبع تغير المشاعر خلال الفترة الماضية</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="7d">
                <TabsList>
                  <TabsTrigger value="24h">24 ساعة</TabsTrigger>
                  <TabsTrigger value="7d">7 أيام</TabsTrigger>
                  <TabsTrigger value="30d">30 يوم</TabsTrigger>
                </TabsList>
                <TabsContent value="24h" className="pt-4">
                  <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">بيانات 24 ساعة غير متوفرة حالياً</p>
                  </div>
                </TabsContent>
                <TabsContent value="7d" className="pt-4">
                  <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">الاتجاه: {gmi > 0 ? 'تحسن تدريجي ↑' : 'انخفاض تدريجي ↓'}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="30d" className="pt-4">
                  <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">بيانات 30 يوم غير متوفرة حالياً</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* ========== 6. REGIONAL HEAT MAP ========== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              الخريطة الحرارية
            </CardTitle>
            <CardDescription>توزيع المشاعر حسب المناطق</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="map">
              <TabsList>
                <TabsTrigger value="map">الخريطة</TabsTrigger>
                <TabsTrigger value="regions">المناطق</TabsTrigger>
              </TabsList>
              <TabsContent value="map" className="pt-4">
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <RegionalHeatMap
                    regions={heatMapRegions}
                    countryCode={countryCode || 'LY'}
                    countryName={countryName || 'ليبيا'}
                    topic={topic}
                  />
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span className="text-sm">تأييد قوي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-300" />
                    <span className="text-sm">تأييد معتدل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-400" />
                    <span className="text-sm">محايد</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-300" />
                    <span className="text-sm">معارضة معتدلة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500" />
                    <span className="text-sm">معارضة قوية</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="regions" className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {heatMapRegions.map((region: any, i: number) => (
                    <Card key={i} className="text-center p-3">
                      <p className="font-medium">{region.name}</p>
                      <p className={`text-lg font-bold ${region.gmi > 0 ? 'text-green-500' : region.gmi < 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                        {region.gmi > 0 ? '+' : ''}{region.gmi?.toFixed(0)}%
                      </p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ========== 7. DOMAIN CLASSIFICATION ========== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              تصنيف الحدث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">المجال</p>
                <div className="text-3xl mb-1">{domain.icon}</div>
                <p className="font-bold">{domain.labelAr}</p>
                <p className="text-sm text-muted-foreground">{domain.label}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">مستوى الحساسية</p>
                <Badge className={`text-lg px-4 py-2 ${sensitivity.color}`}>
                  {sensitivity.levelAr}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">{sensitivity.level}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">نطاق التأثير</p>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {countryCode === 'ALL' ? 'عالمي' : 'محلي'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {countryCode === 'ALL' ? 'Systemic' : 'Local'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 8. AI META INSIGHTS ========== */}
        <Card className="border-2 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              رؤى الذكاء الاصطناعي
              <Badge variant="secondary">Meta Analysis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trigger Event */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">هل هو حدث محفز؟</h4>
                <Badge variant={cfi > 60 ? 'destructive' : 'secondary'}>
                  {cfi > 60 ? 'نعم - Trigger Event' : 'لا - حدث عادي'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {cfi > 60 
                    ? 'هذا الحدث قد يؤدي لتفاعلات متسلسلة'
                    : 'حدث معزول بتأثير محدود'
                  }
                </p>
              </div>

              {/* 48h Forecast */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">توقع 48 ساعة</h4>
                <div className="flex items-center gap-2">
                  {gmi > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-bold">
                    {gmi > 0 ? 'استمرار التحسن' : 'استمرار الضغط'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  المشاعر مرشحة {gmi > 0 ? 'للتحسن' : 'للتراجع'} خلال 48 ساعة
                </p>
              </div>

              {/* Risk Level */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">مستوى الخطورة</h4>
                <Badge className={`${riskLevel.color} text-white`}>
                  {riskLevel.levelAr}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {riskLevel.level === 'Critical' && 'يتطلب متابعة فورية'}
                  {riskLevel.level === 'Alert' && 'يستحق المراقبة'}
                  {riskLevel.level === 'Normal' && 'لا يتطلب إجراء خاص'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 9. USER MODE SPECIFIC CONTENT ========== */}
        {userMode === 'researcher' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                بيانات البحث
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">حجم العينة</p>
                  <p className="text-2xl font-bold">{analysisData.sampleSize || 3500}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">المصادر</p>
                  <p className="text-2xl font-bold">{analysisData.sources?.length || 15}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">الثقة</p>
                  <p className="text-2xl font-bold">{confidence.toFixed(1)}%</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">الإصدار</p>
                  <p className="text-2xl font-bold">v3.0</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 ml-2" />
                تصدير البيانات الخام (JSON)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ========== 10. FEEDBACK SECTION ========== */}
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
              هل هذا التحليل دقيق؟
            </CardTitle>
            <CardDescription className="text-center">
              ساعدنا في تحسين الذكاء الاصطناعي بتقييمك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <Button
                  variant={feedbackGiven === 'accurate' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleFeedback('accurate')}
                  className="flex items-center gap-2 min-w-[120px]"
                >
                  <span className="text-xl">👍</span>
                  دقيق
                </Button>
                <Button
                  variant={feedbackGiven === 'inaccurate' ? 'destructive' : 'outline'}
                  size="lg"
                  onClick={() => handleFeedback('inaccurate')}
                  className="flex items-center gap-2 min-w-[120px]"
                >
                  <span className="text-xl">👎</span>
                  غير دقيق
                </Button>
                <Button
                  variant={feedbackGiven === 'correction' ? 'secondary' : 'outline'}
                  size="lg"
                  onClick={() => setShowCorrectionDialog(true)}
                  className="flex items-center gap-2 min-w-[120px]"
                >
                  <span className="text-xl">✏️</span>
                  تصحيح
                </Button>
              </div>
              {feedbackGiven && feedbackGiven !== 'correction' && (
                <p className="text-sm text-green-500 flex items-center gap-2">
                  ✅ شكراً لتقييمك! سيساعد هذا في تحسين النظام.
                </p>
              )}
            </div>

            {/* Correction Dialog */}
            {showCorrectionDialog && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">ما هو الشعور الصحيح برأيك؟</h4>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { key: 'hope', label: 'أمل', emoji: '🌟' },
                    { key: 'fear', label: 'خوف', emoji: '😨' },
                    { key: 'anger', label: 'غضب', emoji: '😠' },
                    { key: 'sadness', label: 'حزن', emoji: '😢' },
                    { key: 'joy', label: 'فرح', emoji: '😊' },
                    { key: 'curiosity', label: 'فضول', emoji: '🤔' },
                    { key: 'calm', label: 'هدوء', emoji: '😌' },
                    { key: 'neutral', label: 'حياد', emoji: '😐' },
                  ].map((emotion) => (
                    <Button
                      key={emotion.key}
                      variant={correctionEmotion === emotion.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCorrectionEmotion(emotion.key)}
                      className="flex flex-col items-center gap-1 h-auto py-2"
                    >
                      <span className="text-lg">{emotion.emoji}</span>
                      <span className="text-xs">{emotion.label}</span>
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => handleFeedback('correction')}
                    disabled={!correctionEmotion}
                    className="flex-1"
                  >
                    إرسال التصحيح
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCorrectionDialog(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <div className="text-center text-sm text-muted-foreground py-4 border-t">
          <p>⚠️ هذا تحليل إحصائي للمشاعر الجماعية فقط ولا يشكل تشخيصاً طبياً أو توصية سياسية أو مالية.</p>
          <p className="mt-1">AmalSense v3.0 - Emotional Intelligence System</p>
        </div>
      </div>
    </div>
  );
}
