/**
 * Topic Analysis Results Page - AmalSense
 * "Emotional Decision Engine"
 * Storytelling Interface - النتيجة أولاً، ثم الأدلة
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useStreamingAnalysis, type StreamChunk } from "@/hooks/useStreamingAnalysis";
import { DynamicQuestionGenerator, type DynamicQuestion } from "@/services/dynamicQuestionGenerator";
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
  Newspaper, LineChart as LineChartIcon, Users, Database,
  ThumbsUp, ThumbsDown, Edit3, CheckCircle, XCircle,
  Lightbulb, AlertCircle, Info
} from "lucide-react";

// User modes
type UserMode = 'general' | 'journalist' | 'trader' | 'researcher';

// Action Signal colors
const ACTION_SIGNAL_STYLES = {
  opportunity: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500' },
  watch: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500' },
  caution: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500' },
  warning: { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500' },
  danger: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500' },
};

// Risk Level colors
const RISK_LEVEL_STYLES = {
  low: { bg: 'bg-green-500', text: 'text-green-500' },
  medium: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  high: { bg: 'bg-orange-500', text: 'text-orange-500' },
  critical: { bg: 'bg-red-500', text: 'text-red-500' },
};

// Final State colors
const FINAL_STATE_STYLES = {
  very_positive: { bg: 'bg-green-500/20', text: 'text-green-500', icon: '🌟' },
  positive_cautious: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', icon: '☀️' },
  neutral: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚖️' },
  negative_cautious: { bg: 'bg-orange-500/20', text: 'text-orange-500', icon: '⚠️' },
  very_negative: { bg: 'bg-red-500/20', text: 'text-red-500', icon: '🔴' },
};

// Region coordinates for heat map
const REGION_COORDINATES: Record<string, Record<string, { lat: number; lng: number }>> = {
  LY: {
    TRI: { lat: 32.8872, lng: 13.1913 },
    BEN: { lat: 32.1194, lng: 20.0868 },
    MIS: { lat: 32.3754, lng: 15.0925 },
    SEB: { lat: 27.0377, lng: 14.4283 },
    ZAW: { lat: 32.7571, lng: 12.7278 },
  },
  EG: {
    CAI: { lat: 30.0444, lng: 31.2357 },
    ALX: { lat: 31.2001, lng: 29.9187 },
  },
};

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
  
  // Parse URL search params
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
  
  // Streaming state
  const { state: streamingState, processChunks } = useStreamingAnalysis();
  const [isExporting, setIsExporting] = useState(false);
  
  // Feedback State
  const [feedbackGiven, setFeedbackGiven] = useState<'accurate' | 'inaccurate' | 'correction' | null>(null);
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [correctionEmotion, setCorrectionEmotion] = useState<string | null>(null);
  
  // Dynamic Questions State
  const [suggestedQuestions, setSuggestedQuestions] = useState<DynamicQuestion[]>([]);

  // Mutations
  const analyzeTopicMutation = trpc.topic.analyzeTopicInCountry.useMutation();
  const generatePdfMutation = trpc.pdfExport.generateAnalysisReport.useMutation();
  const createConversationMutation = trpc.conversations.create.useMutation();
  
  // Conversation state
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Export PDF
  const handleExportPDF = async () => {
    if (!analysisData) return;
    setIsExporting(true);
    try {
      const result = await generatePdfMutation.mutateAsync({
        topic,
        country: countryCode || 'ALL',
        countryName: countryName || 'Global',
        timeRange,
        analysisData,
      });
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
    if (type === 'correction') {
      setShowCorrectionDialog(true);
    } else {
      setFeedbackGiven(type);
      console.log('Feedback sent:', { type, topic, countryCode });
    }
  };

  const submitCorrection = () => {
    if (correctionEmotion) {
      setFeedbackGiven('correction');
      setShowCorrectionDialog(false);
      console.log('Correction sent:', { correctionEmotion, topic, countryCode });
    }
  };

  // Fetch analysis data
  useEffect(() => {
    if (topic) {
      setIsLoading(true);
      // Use the selected country code, or 'ALL' for global analysis
      const effectiveCountryCode = countryCode || 'ALL';
      const countryData = effectiveCountryCode !== 'ALL' ? getCountryByCode(effectiveCountryCode) : null;
      const effectiveCountryName = countryName || countryData?.nameEn || (effectiveCountryCode === 'ALL' ? 'Global' : effectiveCountryCode);
      
      analyzeTopicMutation.mutateAsync({ 
        topic, 
        countryCode: effectiveCountryCode, 
        countryName: effectiveCountryName, 
        timeRange 
      })
        .then((data) => {
          // Phase 67: Process streaming chunks
          if (data && typeof data === 'object' && 'chunks' in data) {
            const chunks = (data as any).chunks as StreamChunk[];
            processChunks(chunks);
            setAnalysisData((data as any).result);
          } else {
            setAnalysisData(data);
          }
          setIsLoading(false);
          
          // Generate dynamic questions
          const resultData = (data as any).result || data;
          if (resultData) {
            const questions = DynamicQuestionGenerator.generateQuestions(resultData);
            setSuggestedQuestions(questions);
          }
          
          // حفظ الدردشة تلقائياً بعد التحليل
          if (!conversationId) {
            // تحديد العاطفة السائدة من بيانات المشاعر
            // Get data from streaming result or direct data
            const resultData = (data as any).result || data;
            const emotions = (resultData as any).emotions || {};
            const emotionEntries = Object.entries(emotions) as [string, number][];
            const dominant = emotionEntries.length > 0 
              ? emotionEntries.sort((a, b) => b[1] - a[1])[0][0] 
              : 'neutral';
            
            // الحصول على الرد الذكي من البيانات
            const aiResponseText = streamingState.analysis ||
              (resultData as any).aiResponse || 
              (resultData as any).metaDecision?.finalRecommendation || 
              (resultData as any).intelligentResponse ||
              `تحليل ${topic} في ${effectiveCountryName}`;
            
            createConversationMutation.mutateAsync({
              topic: `${topic} - ${effectiveCountryName}`,
              countryCode: effectiveCountryCode !== 'ALL' ? effectiveCountryCode : undefined,
              initialAnalysis: {
                gmi: (resultData as any).gmi || 0,
                cfi: (resultData as any).cfi || 50,
                hri: (resultData as any).hri || 50,
                dominantEmotion: dominant,
                aiResponse: aiResponseText,
              },
            }).then((conv) => {
              setConversationId(conv.id);
              console.log('تم حفظ الدردشة:', conv.id);
            }).catch((err) => {
              console.error('فشل حفظ الدردشة:', err);
            });
          }
        })
        .catch((err) => {
          console.error('Analysis error:', err);
          setError(err);
          setIsLoading(false);
        });
    }
  }, [topic, countryCode, countryName, timeRange]);

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
            <div>
              <h3 className="font-bold text-lg">جاري تحليل المشاعر الجماعية...</h3>
              <p className="text-sm text-muted-foreground mt-2">
                يتم جمع البيانات من مصادر متعددة وتحليلها بالذكاء الاصطناعي
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center py-12 px-8">
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
  const metaDecision = analysisData.metaDecision || null;
  
  // ✅ Extract intelligent response from UnifiedPipeline (Phase 62)
  const intelligentResponse = analysisData.intelligentResponse || null;
  const pipelineMetadata = analysisData.pipelineMetadata || null;

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

  // Get styles based on meta decision
  const finalStateStyle = metaDecision ? FINAL_STATE_STYLES[metaDecision.finalState as keyof typeof FINAL_STATE_STYLES] || FINAL_STATE_STYLES.neutral : FINAL_STATE_STYLES.neutral;
  const actionSignalStyle = metaDecision ? ACTION_SIGNAL_STYLES[metaDecision.actionSignal as keyof typeof ACTION_SIGNAL_STYLES] || ACTION_SIGNAL_STYLES.watch : ACTION_SIGNAL_STYLES.watch;
  const riskLevelStyle = metaDecision ? RISK_LEVEL_STYLES[metaDecision.riskLevel as keyof typeof RISK_LEVEL_STYLES] || RISK_LEVEL_STYLES.medium : RISK_LEVEL_STYLES.medium;

  // Prepare heat map data
  const heatMapRegions = analysisData.regions?.map((region: any) => {
    const coords = countryCode && countryCode !== 'ALL' ? REGION_COORDINATES[countryCode]?.[region.regionCode] : null;
    const countryCenter = countryCode && countryCode !== 'ALL' ? (COUNTRY_CENTERS[countryCode] || { lat: 20, lng: 0 }) : { lat: 20, lng: 0 };
    
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
      {/* ========== STICKY HEADER ========== */}
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
                    {countryName || (countryCode === 'ALL' ? 'Global' : getCountryByCode(countryCode)?.nameEn || countryCode)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date().toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
        {/* ========== 1. INTELLIGENT RESPONSE FROM UNIFIED PIPELINE ========== */}
        {intelligentResponse && (
          <Card className={`relative overflow-hidden border-2 border-primary/50 bg-primary/5`}>
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl">🧠</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                التحليل الذكي
              </CardTitle>
              <CardDescription>
                رد مبني على 14 طبقة معرفية - نوع السؤال: {pipelineMetadata?.questionType || 'تحليلي'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {intelligentResponse}
                </p>
              </div>
              {pipelineMetadata && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">مسار:</span>
                      <p className="font-medium">{pipelineMetadata.cognitivePathway}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">الإجراء:</span>
                      <p className="font-medium">{pipelineMetadata.analysisAction}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">القرار:</span>
                      <p className="font-medium">{pipelineMetadata.gateDecision}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">الثقة:</span>
                      <p className="font-medium">{(pipelineMetadata.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ========== 2. EXECUTIVE SUMMARY (الخلاصة النهاية) - أول شيء ========== */}
        <Card className={`relative overflow-hidden border-2 ${finalStateStyle.bg} ${actionSignalStyle.border}`}>
          <div className="absolute top-0 right-0 p-4">
            <span className="text-4xl">{finalStateStyle.icon}</span>
          </div>
          <CardContent className="pt-8 pb-6">
            <div className="max-w-3xl">
              {/* Final State Label */}
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`text-lg px-4 py-2 ${finalStateStyle.bg} ${finalStateStyle.text} border-0`}>
                  {metaDecision?.finalStateAr || 'محايد'}
                </Badge>
                <Badge variant="outline" className={`${actionSignalStyle.text}`}>
                  {metaDecision?.actionSignalAr || 'مراقبة'}
                </Badge>
              </div>
              
              {/* Human Summary - الجملة الأهم */}
              <h2 className="text-2xl font-bold mb-4 leading-relaxed">
                {metaDecision?.humanSummaryAr || `المزاج العام تجاه "ربط الموضوع" ${gmi > 0 ? 'إيجابي' : gmi < 0 ? 'سلبي' : 'محايد'}.`}
              </h2>
              
              {/* Forecast & Risk */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">توقع 48 ساعة:</span>
                  <span className="font-medium">{metaDecision?.forecast48hAr || 'استقرار'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-4 w-4 ${riskLevelStyle.text}`} />
                  <span className="text-muted-foreground">مستوى الخطورة:</span>
                  <Badge variant="outline" className={riskLevelStyle.text}>
                    {metaDecision?.riskLevelAr || 'متوسط'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">الثقة:</span>
                  <span className="font-bold">{metaDecision?.confidence?.toFixed(0) || confidence.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 3. THREE INDICES WITH EXPLANATIONS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GMI */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">GMI</p>
                  <p className="text-xs text-muted-foreground">مؤشر المزاج العام</p>
                </div>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-4xl font-bold mb-2">{gmi > 0 ? '+' : ''}{gmi.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">
                {metaDecision?.gmiExplanationAr || (gmi > 0 ? 'إيجابي → تفاؤل عام' : gmi < 0 ? 'سلبي → قلق عام' : 'محايد → آراء متباينة')}
              </p>
            </CardContent>
          </Card>

          {/* HRI */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">HRI</p>
                  <p className="text-xs text-muted-foreground">مؤشر الأمل والمرونة</p>
                </div>
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold mb-2">{hri.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">
                {metaDecision?.hriExplanationAr || (hri > 60 ? 'مرتفع → تفاؤل بالمستقبل' : hri < 40 ? 'منخفض → تشاؤم' : 'متوسط → أمل معتدل')}
              </p>
            </CardContent>
          </Card>

          {/* CFI */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">CFI</p>
                  <p className="text-xs text-muted-foreground">مؤشر الخوف الجماعي</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold mb-2">{cfi.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">
                {metaDecision?.cfiExplanationAr || (cfi > 60 ? 'مرتفع → قلق شديد' : cfi < 40 ? 'منخفض → ثقة عالية' : 'متوسط → قلق موجود')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ========== 3. WHY THIS MOOD? (لماذا هذا المزاج؟) ========== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              لماذا هذا المزاج؟
            </CardTitle>
            <CardDescription>الأسباب الرئيسية وراء هذا التحليل</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(metaDecision?.mainReasonsAr || [
                `المزاج العام ${gmi > 0 ? 'إيجابي' : 'سلبي'} (GMI: ${gmi.toFixed(1)})`,
                `مستوى الخوف ${cfi > 60 ? 'مرتفع' : cfi < 40 ? 'منخفض' : 'متوسط'} (CFI: ${cfi.toFixed(1)}%)`,
                `مؤشر الأمل ${hri > 60 ? 'مرتفع' : hri < 40 ? 'منخفض' : 'متوسط'} (HRI: ${hri.toFixed(1)}%)`,
                `الشعور السائد هو ${dominantEmotion.name}`
              ]).map((reason: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-sm">{reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ========== 4. EMOTION COMPOSITION (ممّ يتكوّن هذا المزاج؟) ========== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              ممّ يتكوّن هذا المزاج؟
            </CardTitle>
            <CardDescription>توزيع المشاعر الجماعية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emotion Bars */}
              <div className="space-y-4">
                {emotionData.slice(0, 5).map((emotion, i) => (
                  <div key={emotion.nameEn} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{emotion.emoji}</span>
                        <span className="font-medium">{emotion.name}</span>
                      </div>
                      <span className="font-bold">{emotion.value.toFixed(1)}%</span>
                    </div>
                    <Progress value={emotion.value} className={`h-2 ${emotion.color}`} />
                  </div>
                ))}
              </div>

              {/* Dominant Emotion */}
              <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-4">الشعور السائد</p>
                <div className="text-6xl mb-2">{dominantEmotion.emoji}</div>
                <h3 className="text-2xl font-bold">{dominantEmotion.name}</h3>
                <Badge className="mt-3 text-lg px-4 py-1">{dominantEmotion.value.toFixed(1)}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== 5. REGIONAL MAP (للصحفي/المتداول/الباحث) ========== */}
        {userMode !== 'general' && heatMapRegions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                التوزيع الجغرافي للمشاعر
              </CardTitle>
              <CardDescription>كيف تختلف المشاعر حسب المنطقة</CardDescription>
            </CardHeader>
            <CardContent>
              <RegionalHeatMap 
                regions={heatMapRegions} 
                countryCode={countryCode || 'ALL'}
                countryName={countryName || 'Global'}
                topic={topic}
              />
            </CardContent>
          </Card>
        )}

        {/* ========== 6. SUGGESTED FOLLOW-UP QUESTIONS (أسئلة متابعة مقترحة) ========== */}
        {suggestedQuestions && suggestedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                أسئلة للاستكشاف الأعمق
              </CardTitle>
              <CardDescription>أسئلة مقترحة بناءً على التحليل</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start whitespace-normal hover:bg-primary/10 hover:border-primary"
                    onClick={() => {
                      // Handle question click - could trigger new analysis
                      console.log('Question clicked:', question.text);
                    }}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <p className="font-medium text-sm">{question.text}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {question.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {question.relevance}% ملاءمة
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========== 6. FEEDBACK SECTION ========== */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="font-bold text-lg">هل هذا التحليل دقيق؟</h3>
              <p className="text-sm text-muted-foreground">
                رأيك يساعدنا على تحسين دقة التحليلات المستقبلية
              </p>
              
              {!feedbackGiven ? (
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500"
                    onClick={() => handleFeedback('accurate')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    نعم، دقيق
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
                    onClick={() => handleFeedback('inaccurate')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    لا، غير دقيق
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500"
                    onClick={() => handleFeedback('correction')}
                  >
                    <Edit3 className="h-4 w-4" />
                    أريد التصحيح
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span>شكراً لك! تم تسجيل رأيك.</span>
                </div>
              )}

              {/* Correction Dialog */}
              {showCorrectionDialog && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm mb-4">ما هو الشعور الصحيح برأيك؟</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {['أمل', 'خوف', 'غضب', 'حزن', 'فرح', 'فضول', 'هدوء', 'محايد'].map((emotion) => (
                      <Button
                        key={emotion}
                        variant={correctionEmotion === emotion ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCorrectionEmotion(emotion)}
                      >
                        {emotion}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button onClick={submitCorrection} disabled={!correctionEmotion}>
                      إرسال التصحيح
                    </Button>
                    <Button variant="ghost" onClick={() => setShowCorrectionDialog(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ========== FOOTER DISCLAIMER ========== */}
        <div className="text-center text-xs text-muted-foreground py-4">
          <p>
            هذا التحليل مبني على الذكاء الاصطناعي وقد لا يعكس الواقع بدقة 100%.
            يُنصح بالتحقق من مصادر متعددة قبل اتخاذ أي قرارات.
          </p>
          <p className="mt-2">
            AmalSense v3.0 - Emotional Decision Engine
          </p>
        </div>
      </div>
    </div>
  );
}
