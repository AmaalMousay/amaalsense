/**
 * Country Results Page - REAL DATA VERSION
 * عرض بيانات الدولة العاطفية + أخبار حقيقية مصنفة (سياسية، اقتصادية، اجتماعية)
 * يستخدم countryNewsAnalyzer لجلب أخبار حقيقية وتحليل المشاعر بالـ Groq LLM
 */

import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n";
import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3, 
  Brain, 
  Newspaper,
  Landmark,
  Banknote,
  Users,
  ExternalLink,
  Globe,
  RefreshCw,
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Country names mapping
const COUNTRY_NAMES: Record<string, { en: string; ar: string }> = {
  LY: { en: "Libya", ar: "ليبيا" },
  EG: { en: "Egypt", ar: "مصر" },
  SA: { en: "Saudi Arabia", ar: "السعودية" },
  AE: { en: "UAE", ar: "الإمارات" },
  US: { en: "United States", ar: "الولايات المتحدة" },
  GB: { en: "United Kingdom", ar: "المملكة المتحدة" },
  FR: { en: "France", ar: "فرنسا" },
  DE: { en: "Germany", ar: "ألمانيا" },
  JP: { en: "Japan", ar: "اليابان" },
  CN: { en: "China", ar: "الصين" },
  IN: { en: "India", ar: "الهند" },
  BR: { en: "Brazil", ar: "البرازيل" },
  RU: { en: "Russia", ar: "روسيا" },
  TR: { en: "Turkey", ar: "تركيا" },
  PS: { en: "Palestine", ar: "فلسطين" },
  IQ: { en: "Iraq", ar: "العراق" },
  SY: { en: "Syria", ar: "سوريا" },
  JO: { en: "Jordan", ar: "الأردن" },
  LB: { en: "Lebanon", ar: "لبنان" },
  MA: { en: "Morocco", ar: "المغرب" },
  DZ: { en: "Algeria", ar: "الجزائر" },
  TN: { en: "Tunisia", ar: "تونس" },
  SD: { en: "Sudan", ar: "السودان" },
  QA: { en: "Qatar", ar: "قطر" },
  KW: { en: "Kuwait", ar: "الكويت" },
  BH: { en: "Bahrain", ar: "البحرين" },
  OM: { en: "Oman", ar: "عُمان" },
  YE: { en: "Yemen", ar: "اليمن" },
  CA: { en: "Canada", ar: "كندا" },
  AU: { en: "Australia", ar: "أستراليا" },
  KR: { en: "South Korea", ar: "كوريا الجنوبية" },
  MX: { en: "Mexico", ar: "المكسيك" },
  ZA: { en: "South Africa", ar: "جنوب أفريقيا" },
  NG: { en: "Nigeria", ar: "نيجيريا" },
  KE: { en: "Kenya", ar: "كينيا" },
  ID: { en: "Indonesia", ar: "إندونيسيا" },
  PK: { en: "Pakistan", ar: "باكستان" },
  AR: { en: "Argentina", ar: "الأرجنتين" },
  CO: { en: "Colombia", ar: "كولومبيا" },
  IT: { en: "Italy", ar: "إيطاليا" },
  ES: { en: "Spain", ar: "إسبانيا" },
};

// Country flag emojis
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    LY: "🇱🇾", EG: "🇪🇬", SA: "🇸🇦", AE: "🇦🇪", US: "🇺🇸", GB: "🇬🇧",
    FR: "🇫🇷", DE: "🇩🇪", JP: "🇯🇵", CN: "🇨🇳", IN: "🇮🇳", BR: "🇧🇷",
    RU: "🇷🇺", TR: "🇹🇷", PS: "🇵🇸", IQ: "🇮🇶", SY: "🇸🇾", JO: "🇯🇴",
    LB: "🇱🇧", MA: "🇲🇦", DZ: "🇩🇿", TN: "🇹🇳", SD: "🇸🇩", QA: "🇶🇦",
    KW: "🇰🇼", BH: "🇧🇭", OM: "🇴🇲", YE: "🇾🇪", CA: "🇨🇦", AU: "🇦🇺",
    KR: "🇰🇷", MX: "🇲🇽", ZA: "🇿🇦", NG: "🇳🇬", KE: "🇰🇪", ID: "🇮🇩",
    PK: "🇵🇰", AR: "🇦🇷", CO: "🇨🇴", IT: "🇮🇹", ES: "🇪🇸",
  };
  return flags[code] || "🏳️";
}

// Mood helpers
function getMoodStatus(gmi: number) {
  if (gmi >= 50) return { label: "Very Positive", labelAr: "إيجابي جداً", color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" };
  if (gmi >= 20) return { label: "Positive", labelAr: "إيجابي", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/30" };
  if (gmi >= -20) return { label: "Neutral", labelAr: "محايد", color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30" };
  if (gmi >= -50) return { label: "Negative", labelAr: "سلبي", color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" };
  return { label: "Very Negative", labelAr: "سلبي جداً", color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/30" };
}

function getSentimentBadge(sentiment: string, isRTL: boolean) {
  switch (sentiment) {
    case 'positive':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />{isRTL ? 'إيجابي' : 'Positive'}</Badge>;
    case 'negative':
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />{isRTL ? 'سلبي' : 'Negative'}</Badge>;
    default:
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><Minus className="w-3 h-3 mr-1" />{isRTL ? 'محايد' : 'Neutral'}</Badge>;
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'political': return <Landmark className="w-4 h-4" />;
    case 'economic': return <Banknote className="w-4 h-4" />;
    case 'social': return <Users className="w-4 h-4" />;
    default: return <Newspaper className="w-4 h-4" />;
  }
}

// News item component
function NewsItem({ item, isRTL }: { item: any; isRTL: boolean }) {
  return (
    <div className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors bg-card/50">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-semibold text-sm leading-relaxed flex-1">{item.title}</h4>
        {getSentimentBadge(item.sentiment, isRTL)}
      </div>
      {item.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {item.source || (isRTL ? 'مصدر غير معروف' : 'Unknown source')}
          </span>
          {item.publishedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(item.publishedAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
            <ExternalLink className="w-3 h-3" />
            {isRTL ? 'المصدر' : 'Source'}
          </a>
        )}
      </div>
    </div>
  );
}

export default function CountryResults() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/country/:code");
  const countryCode = (params?.code || "").toUpperCase();
  const { isRTL } = useI18n();
  const [activeTab, setActiveTab] = useState("all");

  // Get country name from URL params or mapping
  const searchParams = new URLSearchParams(window.location.search);
  const urlName = searchParams.get('name');
  const countryInfo = COUNTRY_NAMES[countryCode] || { en: urlName || countryCode, ar: urlName || countryCode };

  // Fetch country data from Unified Engine
  const { data: countryData, isLoading, error, refetch, isRefetching } = trpc.engine.getCountryDetail.useQuery(
    { countryCode, countryName: countryInfo.en, includeAISummary: true, language: isRTL ? 'ar' : 'en' },
    { 
      enabled: !!countryCode && countryCode.length === 2,
      retry: 1,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  // No country code
  if (!countryCode) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <CardContent>
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">{isRTL ? 'لم يتم تحديد دولة' : 'No country selected'}</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              {isRTL ? 'العودة للخريطة' : 'Back to Map'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/50">
          <div className="container py-6">
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="ml-2 h-4 w-4" />
              {isRTL ? 'العودة للخريطة' : 'Back to Map'}
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-6xl">{getCountryFlag(countryCode)}</div>
              <div>
                <h1 className="text-3xl font-bold">{countryInfo.ar}</h1>
                <p className="text-muted-foreground">{countryInfo.en}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-8">
          <AnalysisSkeleton variant="full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/50">
          <div className="container py-6">
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="ml-2 h-4 w-4" />
              {isRTL ? 'العودة للخريطة' : 'Back to Map'}
            </Button>
          </div>
        </div>
        <div className="container py-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-bold mb-2">{isRTL ? 'حدث خطأ في التحليل' : 'Analysis Error'}</h3>
              <p className="text-muted-foreground mb-4">
                {isRTL ? 'لم نتمكن من جلب بيانات هذه الدولة. يرجى المحاولة مرة أخرى.' : 'Could not fetch data for this country. Please try again.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => refetch()}>
                  <RefreshCw className="ml-2 h-4 w-4" />
                  {isRTL ? 'إعادة المحاولة' : 'Retry'}
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  {isRTL ? 'العودة للخريطة' : 'Back to Map'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const moodStatus = getMoodStatus(countryData?.gmi || 0);
  const politicalNews = countryData?.news?.political || [];
  const economicNews = countryData?.news?.economic || [];
  const socialNews = countryData?.news?.social || [];
  const allNews = [...politicalNews, ...economicNews, ...socialNews];
  const trendingTopics = countryData?.trendingKeywords || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="ml-2 h-4 w-4" />
            {isRTL ? 'العودة للخريطة' : 'Back to Map'}
          </Button>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-6xl">{getCountryFlag(countryCode)}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{isRTL ? countryInfo.ar : countryInfo.en}</h1>
              <p className="text-muted-foreground">{isRTL ? countryInfo.en : countryInfo.ar}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`text-lg px-4 py-2 ${moodStatus.bgColor} ${moodStatus.color} ${moodStatus.borderColor}`}>
                {isRTL ? moodStatus.labelAr : moodStatus.label}
              </Badge>
              {countryData?.isRealData && (
                <Badge variant="outline" className="text-green-500 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {isRTL ? 'بيانات حقيقية' : 'Real Data'}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
                <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Indices Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6" />
            {isRTL ? 'المؤشرات العاطفية' : 'Emotional Indicators'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GMI */}
            <Card className={`border-2 ${moodStatus.borderColor}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">GMI - {isRTL ? 'مؤشر المزاج العام' : 'Global Mood Index'}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">{(countryData?.gmi ?? 0).toFixed(1)}</p>
                      <span className="text-muted-foreground text-sm">/ 100</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${moodStatus.bgColor}`}>
                    <span className={`text-2xl font-bold ${moodStatus.color}`}>
                      {(countryData?.gmi ?? 0) >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    </span>
                  </div>
                </div>
                <p className={`text-sm font-medium ${moodStatus.color}`}>{isRTL ? moodStatus.labelAr : moodStatus.label}</p>
              </CardContent>
            </Card>

            {/* CFI */}
            <Card className={`border-2 ${(countryData?.cfi ?? 50) > 60 ? 'border-red-500/30' : (countryData?.cfi ?? 50) > 40 ? 'border-yellow-500/30' : 'border-green-500/30'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">CFI - {isRTL ? 'مؤشر الخوف الجماعي' : 'Crisis Fear Index'}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">{(countryData?.cfi ?? 50).toFixed(1)}</p>
                      <span className="text-muted-foreground text-sm">/ 100</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${(countryData?.cfi ?? 50) > 60 ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                    <AlertTriangle className={`w-6 h-6 ${(countryData?.cfi ?? 50) > 60 ? 'text-red-500' : 'text-yellow-500'}`} />
                  </div>
                </div>
                <p className={`text-sm font-medium ${(countryData?.cfi ?? 50) > 60 ? 'text-red-500' : (countryData?.cfi ?? 50) > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {(countryData?.cfi ?? 50) > 60 ? (isRTL ? 'مرتفع' : 'High') : (countryData?.cfi ?? 50) > 40 ? (isRTL ? 'متوسط' : 'Medium') : (isRTL ? 'منخفض' : 'Low')}
                </p>
              </CardContent>
            </Card>

            {/* HRI */}
            <Card className={`border-2 ${(countryData?.hri ?? 50) > 60 ? 'border-green-500/30' : (countryData?.hri ?? 50) > 40 ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">HRI - {isRTL ? 'مؤشر الأمل والمرونة' : 'Hope Resilience Index'}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">{(countryData?.hri ?? 50).toFixed(1)}</p>
                      <span className="text-muted-foreground text-sm">/ 100</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${(countryData?.hri ?? 50) > 60 ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                    <TrendingUp className={`w-6 h-6 ${(countryData?.hri ?? 50) > 60 ? 'text-green-500' : 'text-yellow-500'}`} />
                  </div>
                </div>
                <p className={`text-sm font-medium ${(countryData?.hri ?? 50) > 60 ? 'text-green-500' : (countryData?.hri ?? 50) > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {(countryData?.hri ?? 50) > 60 ? (isRTL ? 'مرتفع' : 'High') : (countryData?.hri ?? 50) > 40 ? (isRTL ? 'متوسط' : 'Medium') : (isRTL ? 'منخفض' : 'Low')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Summary */}
        {countryData?.aiSummary && (
          <section>
            <Card className={`${moodStatus.bgColor} border ${moodStatus.borderColor}`}>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {isRTL ? 'ملخص التحليل' : 'Analysis Summary'}
                </h3>
                <p className="text-sm leading-relaxed">
                  {countryData?.aiSummary}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Newspaper className="w-3 h-3" />
                    {countryData?.sourceCount || allNews.length} {isRTL ? 'مصدر' : 'sources'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {isRTL ? 'آخر تحديث: الآن' : 'Last updated: now'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Trending Topics */}
        {trendingTopics.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              {isRTL ? 'المواضيع الساخنة' : 'Trending Topics'}
              <Badge variant="secondary" className="ml-2">{trendingTopics.length}</Badge>
            </h2>
            <div className="flex flex-wrap gap-3">
              {trendingTopics.map((topic: any, i: number) => (
                <Card key={i} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(`/smart-analysis?topic=${encodeURIComponent(topic.topic + ' ' + countryInfo.en)}`)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-sm">
                      {topic.heat || i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{topic.topicAr || topic.topic}</p>
                      <p className="text-xs text-muted-foreground">{topic.category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {topic.sentiment === 'positive' ? '😊' : topic.sentiment === 'negative' ? '😟' : '😐'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* News Section with Tabs */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            {isRTL ? 'الأخبار الحقيقية' : 'Real News'}
            <Badge variant="secondary">{allNews.length} {isRTL ? 'خبر' : 'articles'}</Badge>
          </h2>

          {allNews.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isRTL ? 'لا توجد أخبار متاحة حالياً لهذه الدولة' : 'No news currently available for this country'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  {isRTL ? 'الكل' : 'All'} ({allNews.length})
                </TabsTrigger>
                <TabsTrigger value="political" className="flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  {isRTL ? 'سياسي' : 'Political'} ({politicalNews.length})
                </TabsTrigger>
                <TabsTrigger value="economic" className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  {isRTL ? 'اقتصادي' : 'Economic'} ({economicNews.length})
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {isRTL ? 'اجتماعي' : 'Social'} ({socialNews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allNews.map((item: any, i: number) => (
                    <NewsItem key={i} item={item} isRTL={isRTL} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="political">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {politicalNews.length > 0 ? politicalNews.map((item: any, i: number) => (
                    <NewsItem key={i} item={item} isRTL={isRTL} />
                  )) : (
                    <p className="text-muted-foreground col-span-2 text-center py-8">{isRTL ? 'لا توجد أخبار سياسية' : 'No political news'}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="economic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {economicNews.length > 0 ? economicNews.map((item: any, i: number) => (
                    <NewsItem key={i} item={item} isRTL={isRTL} />
                  )) : (
                    <p className="text-muted-foreground col-span-2 text-center py-8">{isRTL ? 'لا توجد أخبار اقتصادية' : 'No economic news'}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {socialNews.length > 0 ? socialNews.map((item: any, i: number) => (
                    <NewsItem key={i} item={item} isRTL={isRTL} />
                  )) : (
                    <p className="text-muted-foreground col-span-2 text-center py-8">{isRTL ? 'لا توجد أخبار اجتماعية' : 'No social news'}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </section>

        {/* Analyze More Button */}
        <section className="text-center pb-8">
          <Button 
            size="lg"
            onClick={() => navigate(`/smart-analysis?topic=${encodeURIComponent(countryInfo.en + ' latest news and sentiment')}`)}
          >
            <Brain className="ml-2 h-5 w-5" />
            {isRTL ? `تحليل معمّق لـ ${countryInfo.ar}` : `Deep Analysis for ${countryInfo.en}`}
          </Button>
        </section>
      </div>
    </div>
  );
}
