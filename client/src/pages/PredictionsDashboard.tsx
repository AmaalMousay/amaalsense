/**
 * Predictions Dashboard - لوحة التنبؤات المتقدمة
 * 
 * تعرض:
 * - تقرير تنبؤ شامل لدولة مختارة
 * - مؤشرات المخاطر
 * - نقاط التحول
 * - اتجاهات المؤشرات
 * - تنبؤات متعددة الأطر الزمنية
 * - تفسير AI
 * - سجل التنبؤات + التحقق
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertTriangle, TrendingUp, TrendingDown, Minus, Activity,
  Shield, Brain, Clock, BarChart3, Target, Zap,
  ChevronLeft, Globe, ArrowUpRight, ArrowDownRight,
  RefreshCw, CheckCircle2, XCircle, HelpCircle,
} from "lucide-react";
import { Link } from "wouter";

// Country list
const COUNTRIES = [
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya", region: "MENA" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", region: "MENA" },
  { code: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", region: "MENA" },
  { code: "AE", nameAr: "الإمارات", nameEn: "UAE", region: "MENA" },
  { code: "PS", nameAr: "فلسطين", nameEn: "Palestine", region: "MENA" },
  { code: "SY", nameAr: "سوريا", nameEn: "Syria", region: "MENA" },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq", region: "MENA" },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen", region: "MENA" },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan", region: "MENA" },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon", region: "MENA" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", region: "MENA" },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia", region: "MENA" },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria", region: "MENA" },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco", region: "MENA" },
  { code: "US", nameAr: "أمريكا", nameEn: "United States", region: "Americas" },
  { code: "GB", nameAr: "بريطانيا", nameEn: "United Kingdom", region: "Europe" },
  { code: "FR", nameAr: "فرنسا", nameEn: "France", region: "Europe" },
  { code: "DE", nameAr: "ألمانيا", nameEn: "Germany", region: "Europe" },
  { code: "RU", nameAr: "روسيا", nameEn: "Russia", region: "Europe" },
  { code: "UA", nameAr: "أوكرانيا", nameEn: "Ukraine", region: "Europe" },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey", region: "Europe" },
  { code: "CN", nameAr: "الصين", nameEn: "China", region: "Asia" },
  { code: "IN", nameAr: "الهند", nameEn: "India", region: "Asia" },
  { code: "JP", nameAr: "اليابان", nameEn: "Japan", region: "Asia" },
  { code: "BR", nameAr: "البرازيل", nameEn: "Brazil", region: "Americas" },
  { code: "NG", nameAr: "نيجيريا", nameEn: "Nigeria", region: "Africa" },
  { code: "ZA", nameAr: "جنوب أفريقيا", nameEn: "South Africa", region: "Africa" },
  { code: "AU", nameAr: "أستراليا", nameEn: "Australia", region: "Oceania" },
];

// Risk level colors
function getRiskColor(level: string) {
  switch (level) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'elevated': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'moderate': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    default: return 'text-muted-foreground bg-muted/50 border-border';
  }
}

function getRiskLabelAr(level: string) {
  switch (level) {
    case 'critical': return 'حرج';
    case 'high': return 'مرتفع';
    case 'elevated': return 'مرتفع نسبياً';
    case 'moderate': return 'معتدل';
    case 'low': return 'منخفض';
    default: return level;
  }
}

function getTrendIcon(direction: string) {
  switch (direction) {
    case 'rising': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case 'falling': return <TrendingDown className="w-4 h-4 text-red-500" />;
    case 'volatile': return <Activity className="w-4 h-4 text-yellow-500" />;
    default: return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
}

function getTrendLabelAr(direction: string) {
  switch (direction) {
    case 'rising': return 'صاعد';
    case 'falling': return 'هابط';
    case 'volatile': return 'متقلب';
    default: return 'مستقر';
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    default: return 'outline';
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PredictionsDashboard() {
  const [selectedCountry, setSelectedCountry] = useState("LY");
  const [activeTab, setActiveTab] = useState("report");
  
  const country = useMemo(() => COUNTRIES.find(c => c.code === selectedCountry), [selectedCountry]);
  
  // Fetch prediction report
  const predictionQuery = trpc.prediction.getCountryPrediction.useQuery({
    countryCode: selectedCountry,
    countryName: country?.nameEn,
    hoursBack: 72,
    includeAI: true,
  }, {
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  
  // Fetch risk score
  const riskQuery = trpc.prediction.getRiskScore.useQuery({
    countryCode: selectedCountry,
    hoursBack: 48,
  }, {
    staleTime: 5 * 60 * 1000,
  });
  
  // Fetch trends
  const trendsQuery = trpc.prediction.getTrends.useQuery({
    countryCode: selectedCountry,
    hoursBack: 48,
  }, {
    staleTime: 5 * 60 * 1000,
  });
  
  // Fetch tipping points
  const tippingQuery = trpc.prediction.getTippingPoints.useQuery({
    countryCode: selectedCountry,
    hoursBack: 48,
  }, {
    staleTime: 5 * 60 * 1000,
  });
  
  // Fetch prediction history
  const historyQuery = trpc.prediction.getPredictionHistory.useQuery({
    countryCode: selectedCountry,
    limit: 10,
  }, {
    staleTime: 5 * 60 * 1000,
  });
  
  // Fetch accuracy stats
  const accuracyQuery = trpc.prediction.getAccuracyStats.useQuery(undefined, {
    staleTime: 10 * 60 * 1000,
  });
  
  const report = predictionQuery.data?.success ? predictionQuery.data.data : null;
  const risk = riskQuery.data?.success ? riskQuery.data.data : null;
  const trends = trendsQuery.data?.success ? trendsQuery.data.data : null;
  const tippingPoints = tippingQuery.data?.success ? tippingQuery.data.data : null;
  const history = historyQuery.data?.success ? historyQuery.data.data : [];
  const accuracy = accuracyQuery.data?.success ? accuracyQuery.data.data : null;
  
  const isLoading = predictionQuery.isLoading;
  
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  نظام التنبؤ المتقدم
                </h1>
                <p className="text-sm text-muted-foreground">
                  تحليل اتجاهات، كشف نقاط تحول، تنبؤات ذكية
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Country Selector */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.nameAr} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  predictionQuery.refetch();
                  riskQuery.refetch();
                  trendsQuery.refetch();
                  tippingQuery.refetch();
                }}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-6 space-y-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Risk Score */}
          <Card className={`border ${risk ? getRiskColor(risk.level) : 'border-border'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5" />
                <span className="text-2xl font-bold">{risk?.overall ?? '...'}</span>
              </div>
              <p className="text-sm font-medium">مؤشر المخاطر</p>
              {risk && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {getRiskLabelAr(risk.level)}
                </Badge>
              )}
            </CardContent>
          </Card>
          
          {/* Current GMI */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold">
                  {report?.currentState.gmi ?? '...'}
                </span>
              </div>
              <p className="text-sm font-medium">GMI الحالي</p>
              {trends?.gmi && (
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(trends.gmi.direction)}
                  <span className="text-xs text-muted-foreground">{getTrendLabelAr(trends.gmi.direction)}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Current CFI */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-bold">
                  {report?.currentState.cfi ?? '...'}
                </span>
              </div>
              <p className="text-sm font-medium">CFI الحالي</p>
              {trends?.cfi && (
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(trends.cfi.direction)}
                  <span className="text-xs text-muted-foreground">{getTrendLabelAr(trends.cfi.direction)}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Current HRI */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-bold">
                  {report?.currentState.hri ?? '...'}
                </span>
              </div>
              <p className="text-sm font-medium">HRI الحالي</p>
              {trends?.hri && (
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(trends.hri.direction)}
                  <span className="text-xs text-muted-foreground">{getTrendLabelAr(trends.hri.direction)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="report" className="gap-1">
              <BarChart3 className="w-4 h-4" />
              التنبؤات
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-1">
              <Shield className="w-4 h-4" />
              المخاطر
            </TabsTrigger>
            <TabsTrigger value="tipping" className="gap-1">
              <AlertTriangle className="w-4 h-4" />
              نقاط التحول
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-1">
              <TrendingUp className="w-4 h-4" />
              الاتجاهات
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-1">
              <Brain className="w-4 h-4" />
              تفسير AI
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <Clock className="w-4 h-4" />
              السجل
            </TabsTrigger>
          </TabsList>
          
          {/* ============ PREDICTIONS TAB ============ */}
          <TabsContent value="report" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-40" /></CardContent></Card>
                ))}
              </div>
            ) : !report ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">بيانات غير كافية</h3>
                  <p className="text-muted-foreground">
                    يرجى تحليل بيانات لـ {country?.nameAr} أولاً من خلال صفحة التحليل الذكي أو لوحة المحرك
                  </p>
                  <Link href="/smart-analysis">
                    <Button className="mt-4">الذهاب للتحليل الذكي</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {report.predictions.map((pred: any) => (
                  <Card key={pred.timeframe} className="border border-border hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {pred.timeframe === '6h' ? 'خلال 6 ساعات' :
                           pred.timeframe === '24h' ? 'خلال 24 ساعة' :
                           pred.timeframe === '48h' ? 'خلال 48 ساعة' :
                           'خلال أسبوع'}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          ثقة: {Math.round(pred.confidence * 100)}%
                        </Badge>
                      </div>
                      <CardDescription>{pred.scenarioNameAr || pred.scenarioName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Predicted Values */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-blue-500/10 rounded-lg p-2">
                          <p className="text-xs text-muted-foreground">GMI</p>
                          <p className="text-lg font-bold text-blue-400">{pred.predictedGMI}</p>
                          <div className="flex items-center justify-center gap-1 text-xs">
                            {pred.predictedGMI > (report.currentState.gmi || 0) ? (
                              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-500" />
                            )}
                            <span>{Math.abs(pred.predictedGMI - (report.currentState.gmi || 0)).toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="bg-orange-500/10 rounded-lg p-2">
                          <p className="text-xs text-muted-foreground">CFI</p>
                          <p className="text-lg font-bold text-orange-400">{pred.predictedCFI}</p>
                          <div className="flex items-center justify-center gap-1 text-xs">
                            {pred.predictedCFI < (report.currentState.cfi || 0) ? (
                              <ArrowDownRight className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3 text-red-500" />
                            )}
                            <span>{Math.abs(pred.predictedCFI - (report.currentState.cfi || 0)).toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="bg-emerald-500/10 rounded-lg p-2">
                          <p className="text-xs text-muted-foreground">HRI</p>
                          <p className="text-lg font-bold text-emerald-400">{pred.predictedHRI}</p>
                          <div className="flex items-center justify-center gap-1 text-xs">
                            {pred.predictedHRI > (report.currentState.hri || 0) ? (
                              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-500" />
                            )}
                            <span>{Math.abs(pred.predictedHRI - (report.currentState.hri || 0)).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk for this prediction */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">العاطفة المتوقعة:</span>
                        <Badge variant="secondary">{pred.predictedDominantEmotion}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">مستوى المخاطر:</span>
                        <Badge variant="outline" className={getRiskColor(pred.riskScore?.level || 'low')}>
                          {getRiskLabelAr(pred.riskScore?.level || 'low')} ({pred.riskScore?.overall || 0})
                        </Badge>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                        {pred.descriptionAr || pred.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* ============ RISK TAB ============ */}
          <TabsContent value="risk" className="space-y-4">
            {risk ? (
              <>
                {/* Overall Risk */}
                <Card className={`border ${getRiskColor(risk.level)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      مؤشر المخاطر الإجمالي: {risk.overall}/100
                    </CardTitle>
                    <CardDescription>
                      مستوى: {getRiskLabelAr(risk.level)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={risk.overall} className="h-3 mb-4" />
                    
                    {/* Risk Components */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(risk.components).map(([key, value]) => {
                        const labels: Record<string, string> = {
                          emotionalInstability: 'عدم الاستقرار العاطفي',
                          fearEscalation: 'تصاعد الخوف',
                          hopeDegradation: 'تدهور الأمل',
                          moodDeterioration: 'تدهور المزاج',
                          volatility: 'التقلب',
                          trendDivergence: 'تباعد الاتجاهات',
                        };
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{labels[key] || key}</span>
                              <span className="font-mono">{value as number}%</span>
                            </div>
                            <Progress value={value as number} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-semibold mb-2">عوامل الخطر:</h4>
                      <ul className="space-y-1">
                        {risk.factorsAr.map((f: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Accuracy Stats */}
                {accuracy && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        إحصائيات دقة التنبؤ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{accuracy.totalPredictions}</p>
                          <p className="text-sm text-muted-foreground">إجمالي التنبؤات</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{accuracy.verifiedPredictions}</p>
                          <p className="text-sm text-muted-foreground">تم التحقق منها</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{accuracy.averageAccuracy}%</p>
                          <p className="text-sm text-muted-foreground">متوسط الدقة</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {accuracy.accuracyTrend === 'improving' ? 'يتحسن' :
                             accuracy.accuracyTrend === 'declining' ? 'يتراجع' :
                             accuracy.accuracyTrend === 'stable' ? 'مستقر' : 'غير كافي'}
                          </p>
                          <p className="text-sm text-muted-foreground">اتجاه الدقة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">بيانات غير كافية لحساب المخاطر</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* ============ TIPPING POINTS TAB ============ */}
          <TabsContent value="tipping" className="space-y-4">
            {tippingPoints && tippingPoints.length > 0 ? (
              tippingPoints.map((tp: any, i: number) => (
                <Card key={i} className={`border ${
                  tp.severity === 'critical' ? 'border-red-500/50 bg-red-500/5' :
                  tp.severity === 'high' ? 'border-orange-500/50 bg-orange-500/5' :
                  tp.severity === 'medium' ? 'border-yellow-500/50 bg-yellow-500/5' :
                  'border-border'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${
                          tp.severity === 'critical' ? 'text-red-500' :
                          tp.severity === 'high' ? 'text-orange-500' :
                          'text-yellow-500'
                        }`} />
                        {tp.type === 'crisis_onset' ? 'بداية أزمة' :
                         tp.type === 'recovery_start' ? 'بداية تعافي' :
                         tp.type === 'escalation' ? 'تصعيد' :
                         tp.type === 'stabilization' ? 'استقرار' :
                         'تحول عاطفي'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(tp.severity) as any}>
                          {tp.severity === 'critical' ? 'حرج' :
                           tp.severity === 'high' ? 'مرتفع' :
                           tp.severity === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                        <Badge variant="outline">
                          احتمالية: {Math.round(tp.probability * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{tp.descriptionAr || tp.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      الإطار الزمني: {tp.timeframe}
                    </div>
                    
                    {tp.indicators && tp.indicators.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tp.indicators.map((ind: string, j: number) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد نقاط تحول</h3>
                  <p className="text-muted-foreground">
                    لم يتم اكتشاف نقاط تحول حرجة لـ {country?.nameAr} حالياً
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* ============ TRENDS TAB ============ */}
          <TabsContent value="trends" className="space-y-4">
            {trends ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'gmi', label: 'GMI - مؤشر المزاج العالمي', data: trends.gmi, color: 'blue' },
                  { key: 'cfi', label: 'CFI - مؤشر الخوف الجماعي', data: trends.cfi, color: 'orange' },
                  { key: 'hri', label: 'HRI - مؤشر الأمل والمرونة', data: trends.hri, color: 'emerald' },
                ].map(({ key, label, data, color }) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        {getTrendIcon(data.direction)}
                        {label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <Badge variant="outline" className="text-lg px-4 py-1">
                          {getTrendLabelAr(data.direction)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          قوة: {data.strength}%
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ميل قصير المدى:</span>
                          <span className="font-mono">{data.shortTermSlope}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ميل طويل المدى:</span>
                          <span className="font-mono">{data.longTermSlope}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الزخم:</span>
                          <span className={`font-mono ${data.momentum > 0 ? 'text-emerald-500' : data.momentum < 0 ? 'text-red-500' : ''}`}>
                            {data.momentum > 0 ? '+' : ''}{data.momentum}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">التسارع:</span>
                          <span className={`font-mono ${data.acceleration > 0 ? 'text-emerald-500' : data.acceleration < 0 ? 'text-red-500' : ''}`}>
                            {data.acceleration > 0 ? '+' : ''}{data.acceleration}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">التباعد (MACD):</span>
                          <span className="font-mono">{data.divergence}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">بيانات غير كافية لتحليل الاتجاهات</p>
                </CardContent>
              </Card>
            )}
            
            {trends && (
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                  <p>
                    <strong>عدد نقاط البيانات:</strong> {trends.dataPoints} | 
                    <strong> النطاق الزمني:</strong> {new Date(trends.timeRange.from).toLocaleDateString('ar')} - {new Date(trends.timeRange.to).toLocaleDateString('ar')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* ============ AI INTERPRETATION TAB ============ */}
          <TabsContent value="ai" className="space-y-4">
            {report?.aiInterpretationAr || report?.aiInterpretation ? (
              <div className="space-y-4">
                {report.aiInterpretationAr && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        التفسير بالعربية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {report.aiInterpretationAr}
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {report.aiInterpretation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        English Interpretation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-line" dir="ltr">
                        {report.aiInterpretation}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا يوجد تفسير AI</h3>
                  <p className="text-muted-foreground">
                    {isLoading ? 'جاري تحميل التفسير...' : 'يرجى تحليل بيانات أولاً لتوليد تفسير ذكي'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* ============ HISTORY TAB ============ */}
          <TabsContent value="history" className="space-y-4">
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((pred: any) => (
                  <Card key={pred.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{pred.countryName}</Badge>
                          <Badge variant="outline" className="text-xs">{pred.timeframe}</Badge>
                          <Badge variant="outline" className={getRiskColor(pred.riskLevel)}>
                            {getRiskLabelAr(pred.riskLevel)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {pred.verified ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3 ml-1" />
                                    دقة: {pred.accuracyScore?.toFixed(0)}%
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>تم التحقق من هذا التنبؤ</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <HelpCircle className="w-3 h-3 ml-1" />
                              لم يتم التحقق
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="text-muted-foreground">GMI المتوقع</p>
                          <p className="font-bold text-blue-400">{pred.predictedGmi?.toFixed(1)}</p>
                          {pred.verified && pred.actualGmi != null && (
                            <p className="text-xs text-muted-foreground">فعلي: {pred.actualGmi.toFixed(1)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">CFI المتوقع</p>
                          <p className="font-bold text-orange-400">{pred.predictedCfi?.toFixed(1)}</p>
                          {pred.verified && pred.actualCfi != null && (
                            <p className="text-xs text-muted-foreground">فعلي: {pred.actualCfi.toFixed(1)}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">HRI المتوقع</p>
                          <p className="font-bold text-emerald-400">{pred.predictedHri?.toFixed(1)}</p>
                          {pred.verified && pred.actualHri != null && (
                            <p className="text-xs text-muted-foreground">فعلي: {pred.actualHri.toFixed(1)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>السيناريو: {pred.scenarioName}</span>
                        <span>ثقة: {(pred.confidence * 100).toFixed(0)}%</span>
                        <span>{new Date(pred.createdAt).toLocaleDateString('ar')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد تنبؤات سابقة</h3>
                  <p className="text-muted-foreground">
                    سيتم حفظ التنبؤات تلقائياً عند توليدها
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
