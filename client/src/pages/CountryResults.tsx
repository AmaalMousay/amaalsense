/**
 * Country Results Page
 * عرض بيانات الدولة العاطفية + 5 مواضيع ترند ساخنة
 */

import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin, 
  BarChart3, 
  Brain, 
  Heart, 
  Smile, 
  Frown, 
  AlertTriangle, 
  Zap, 
  Shield, 
  HelpCircle,
  Flame,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Globe
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
};

// Emotion configuration
const EMOTION_CONFIG: Record<string, { color: string; icon: string; label: string; labelAr: string }> = {
  joy: { color: "#22c55e", icon: "😊", label: "Joy", labelAr: "فرح" },
  hope: { color: "#2A9D8F", icon: "🌟", label: "Hope", labelAr: "أمل" },
  curiosity: { color: "#E9C46A", icon: "🤔", label: "Curiosity", labelAr: "فضول" },
  fear: { color: "#F4A261", icon: "😨", label: "Fear", labelAr: "خوف" },
  anger: { color: "#E63946", icon: "😠", label: "Anger", labelAr: "غضب" },
  sadness: { color: "#8D5CF6", icon: "😢", label: "Sadness", labelAr: "حزن" },
};

// Trending topics type
interface TrendingTopic {
  topic: string;
  topicAr: string;
  category: string;
  categoryAr: string;
  heat: number; // 0-100 how hot/trending
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionIntensity: number;
  sources: number;
  change24h: number; // percentage change
}

// Helper functions
function roundToOneDecimal(num: number): string {
  return (Math.round(num * 10) / 10).toFixed(1);
}

function getMoodStatus(gmi: number): { label: string; labelAr: string; color: string; emoji: string } {
  if (gmi >= 50) return { label: "Very Positive", labelAr: "إيجابي جداً", color: "text-green-500", emoji: "🟢" };
  if (gmi >= 20) return { label: "Positive", labelAr: "إيجابي", color: "text-green-400", emoji: "🟢" };
  if (gmi >= -20) return { label: "Neutral", labelAr: "محايد", color: "text-yellow-500", emoji: "🟡" };
  if (gmi >= -50) return { label: "Negative", labelAr: "سلبي", color: "text-orange-500", emoji: "🟠" };
  return { label: "Very Negative", labelAr: "سلبي جداً", color: "text-red-500", emoji: "🔴" };
}

function getHeatLevel(heat: number): { label: string; color: string; icon: any } {
  if (heat >= 80) return { label: "🔥🔥🔥 ساخن جداً", color: "text-red-500", icon: Flame };
  if (heat >= 60) return { label: "🔥🔥 ساخن", color: "text-orange-500", icon: Flame };
  if (heat >= 40) return { label: "🔥 دافئ", color: "text-yellow-500", icon: TrendingUp };
  return { label: "عادي", color: "text-gray-500", icon: Minus };
}

export default function CountryResults() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/country/:code");
  const countryCode = params?.code || "";
  
  const [countryData, setCountryData] = useState<any>(null);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topicAnalysis, setTopicAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get country name
  const countryInfo = COUNTRY_NAMES[countryCode] || { en: countryCode, ar: countryCode };

  // Fetch country emotion data
  const countryEmotionQuery = trpc.map.getCountryEmotions.useQuery(
    { countryCode },
    { enabled: !!countryCode }
  );

  // Analyze topic mutation
  const analyzeTopicMutation = trpc.topic.analyzeTopicInCountry.useMutation();

  // Generate trending topics for the country
  useEffect(() => {
    if (countryCode) {
      // Simulate trending topics based on country
      const topics = generateTrendingTopics(countryCode);
      setTrendingTopics(topics);
    }
  }, [countryCode]);

  // Set country data when loaded
  useEffect(() => {
    if (countryEmotionQuery.data) {
      setCountryData(countryEmotionQuery.data);
      setIsLoading(false);
    } else if (countryEmotionQuery.isError) {
      // Generate mock data if not found
      setCountryData(generateMockCountryData(countryCode));
      setIsLoading(false);
    }
  }, [countryEmotionQuery.data, countryEmotionQuery.isError, countryCode]);

  // Analyze selected topic
  const handleAnalyzeTopic = async (topic: TrendingTopic) => {
    setSelectedTopic(topic);
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeTopicMutation.mutateAsync({
        topic: topic.topic,
        countryCode,
        countryName: countryInfo.ar,
        timeRange: "week"
      });
      setTopicAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
      // Generate mock analysis
      setTopicAnalysis(generateMockTopicAnalysis(topic));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!countryCode) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <CardContent>
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">لم يتم تحديد دولة</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للخريطة
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
            <p className="text-muted-foreground">جاري تحميل بيانات {countryInfo.ar}...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const moodStatus = getMoodStatus(countryData?.gmi || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للخريطة
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-6xl">{getCountryFlag(countryCode)}</div>
            <div>
              <h1 className="text-3xl font-bold">{countryInfo.ar}</h1>
              <p className="text-muted-foreground">{countryInfo.en}</p>
            </div>
            <Badge className={`ml-auto text-lg px-4 py-2 ${moodStatus.color}`}>
              {moodStatus.emoji} {moodStatus.labelAr}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Country Emotional State */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6" />
            الحالة العاطفية للدولة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GMI */}
            <Card className="border-2" style={{ borderColor: moodStatus.color.includes('green') ? '#22c55e' : moodStatus.color.includes('red') ? '#ef4444' : '#eab308' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">GMI - مؤشر المزاج العام</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">{roundToOneDecimal(countryData?.gmi || 0)}</p>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <span className="text-3xl">{moodStatus.emoji}</span>
                </div>
                <p className={`text-sm font-medium ${moodStatus.color}`}>
                  {moodStatus.labelAr}
                </p>
              </CardContent>
            </Card>

            {/* CFI */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">CFI - مؤشر الخوف الجماعي</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">{roundToOneDecimal(countryData?.cfi || 50)}</p>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <span className="text-3xl">{(countryData?.cfi || 50) > 70 ? "🔴" : (countryData?.cfi || 50) > 30 ? "🟡" : "🟢"}</span>
                </div>
              </CardContent>
            </Card>

            {/* HRI */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">HRI - مؤشر الأمل والمرونة</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">{roundToOneDecimal(countryData?.hri || 50)}</p>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <span className="text-3xl">{(countryData?.hri || 50) > 70 ? "🟢" : (countryData?.hri || 50) > 30 ? "🟡" : "🔴"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trending Topics */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            المواضيع الساخنة في {countryInfo.ar}
            <Badge variant="secondary" className="ml-2">5 مواضيع</Badge>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topics List */}
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => {
                const heatLevel = getHeatLevel(topic.heat);
                const emotionConfig = EMOTION_CONFIG[topic.dominantEmotion] || EMOTION_CONFIG.curiosity;
                const isSelected = selectedTopic?.topic === topic.topic;
                
                return (
                  <Card 
                    key={topic.topic}
                    className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleAnalyzeTopic(topic)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold truncate">{topic.topicAr}</h3>
                            <Badge variant="outline" className="text-xs">{topic.categoryAr}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{topic.topic}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className={heatLevel.color}>{heatLevel.label}</span>
                            <span className="flex items-center gap-1">
                              {emotionConfig.icon} {emotionConfig.labelAr}
                            </span>
                            <span className={topic.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                              {topic.change24h >= 0 ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
                              {Math.abs(topic.change24h)}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Heat indicator */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                               style={{ backgroundColor: `rgba(239, 68, 68, ${topic.heat / 100})` }}>
                            <span className="text-white font-bold">{topic.heat}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Topic Analysis Panel */}
            <div>
              {isAnalyzing ? (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">جاري تحليل الموضوع...</p>
                  </CardContent>
                </Card>
              ) : selectedTopic && topicAnalysis ? (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      تحليل: {selectedTopic.topicAr}
                    </CardTitle>
                    <CardDescription>{selectedTopic.topic}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Indices */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{roundToOneDecimal(topicAnalysis.gmi || selectedTopic.gmi)}</p>
                        <p className="text-xs text-muted-foreground">GMI</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{roundToOneDecimal(topicAnalysis.cfi || selectedTopic.cfi)}</p>
                        <p className="text-xs text-muted-foreground">CFI</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{roundToOneDecimal(topicAnalysis.hri || selectedTopic.hri)}</p>
                        <p className="text-xs text-muted-foreground">HRI</p>
                      </div>
                    </div>

                    {/* Emotion Distribution */}
                    <div>
                      <h4 className="font-semibold mb-3">توزيع المشاعر</h4>
                      <div className="space-y-2">
                        {Object.entries(topicAnalysis.emotions || generateMockEmotions()).slice(0, 4).map(([emotion, value]) => {
                          const config = EMOTION_CONFIG[emotion];
                          if (!config) return null;
                          return (
                            <div key={emotion} className="flex items-center gap-2">
                              <span className="w-6">{config.icon}</span>
                              <span className="w-16 text-sm">{config.labelAr}</span>
                              <Progress value={Number(value)} className="flex-1" />
                              <span className="w-12 text-sm text-right">{roundToOneDecimal(Number(value))}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">مستوى الثقة في التحليل</span>
                      <Badge variant={topicAnalysis.confidence > 70 ? "default" : "secondary"}>
                        {topicAnalysis.confidence || 75}%
                      </Badge>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ThumbsUp className="h-4 w-4 ml-2" />
                        دقيق
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ThumbsDown className="h-4 w-4 ml-2" />
                        غير دقيق
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* View Full Analysis */}
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/analysis-results?topic=${encodeURIComponent(selectedTopic.topic)}&country=${countryCode}&countryName=${encodeURIComponent(countryInfo.ar)}`)}
                    >
                      عرض التحليل الكامل
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">اختر موضوعاً لعرض التحليل</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper: Get country flag emoji
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    LY: "🇱🇾", EG: "🇪🇬", SA: "🇸🇦", AE: "🇦🇪", US: "🇺🇸", GB: "🇬🇧",
    FR: "🇫🇷", DE: "🇩🇪", JP: "🇯🇵", CN: "🇨🇳", IN: "🇮🇳", BR: "🇧🇷",
    RU: "🇷🇺", TR: "🇹🇷", PS: "🇵🇸", IQ: "🇮🇶", SY: "🇸🇾", JO: "🇯🇴",
    LB: "🇱🇧", MA: "🇲🇦", DZ: "🇩🇿", TN: "🇹🇳", SD: "🇸🇩", QA: "🇶🇦",
    KW: "🇰🇼", BH: "🇧🇭", OM: "🇴🇲", YE: "🇾🇪",
  };
  return flags[code] || "🏳️";
}

// Helper: Generate trending topics for a country
function generateTrendingTopics(countryCode: string): TrendingTopic[] {
  const topicsByCountry: Record<string, TrendingTopic[]> = {
    LY: [
      { topic: "Oil Production Recovery", topicAr: "استئناف إنتاج النفط", category: "Economy", categoryAr: "اقتصاد", heat: 92, gmi: 45, cfi: 35, hri: 60, dominantEmotion: "hope", emotionIntensity: 72, sources: 156, change24h: 15 },
      { topic: "National Reconciliation Talks", topicAr: "محادثات المصالحة الوطنية", category: "Politics", categoryAr: "سياسة", heat: 88, gmi: 25, cfi: 55, hri: 45, dominantEmotion: "curiosity", emotionIntensity: 65, sources: 234, change24h: 8 },
      { topic: "Electricity Crisis", topicAr: "أزمة الكهرباء", category: "Infrastructure", categoryAr: "بنية تحتية", heat: 85, gmi: -35, cfi: 70, hri: 25, dominantEmotion: "anger", emotionIntensity: 78, sources: 189, change24h: -5 },
      { topic: "Youth Employment Initiative", topicAr: "مبادرة توظيف الشباب", category: "Social", categoryAr: "اجتماعي", heat: 72, gmi: 55, cfi: 25, hri: 70, dominantEmotion: "hope", emotionIntensity: 68, sources: 98, change24h: 22 },
      { topic: "Desert Festival Season", topicAr: "موسم مهرجانات الصحراء", category: "Culture", categoryAr: "ثقافة", heat: 65, gmi: 70, cfi: 15, hri: 75, dominantEmotion: "joy", emotionIntensity: 82, sources: 67, change24h: 35 },
    ],
    EG: [
      { topic: "New Administrative Capital", topicAr: "العاصمة الإدارية الجديدة", category: "Development", categoryAr: "تنمية", heat: 90, gmi: 40, cfi: 40, hri: 55, dominantEmotion: "curiosity", emotionIntensity: 70, sources: 312, change24h: 12 },
      { topic: "Suez Canal Revenue", topicAr: "إيرادات قناة السويس", category: "Economy", categoryAr: "اقتصاد", heat: 85, gmi: 50, cfi: 30, hri: 60, dominantEmotion: "hope", emotionIntensity: 65, sources: 245, change24h: 18 },
      { topic: "Education Reform", topicAr: "إصلاح التعليم", category: "Education", categoryAr: "تعليم", heat: 78, gmi: 20, cfi: 45, hri: 50, dominantEmotion: "curiosity", emotionIntensity: 58, sources: 178, change24h: 5 },
      { topic: "Tourism Recovery", topicAr: "انتعاش السياحة", category: "Tourism", categoryAr: "سياحة", heat: 75, gmi: 60, cfi: 25, hri: 65, dominantEmotion: "joy", emotionIntensity: 72, sources: 156, change24h: 25 },
      { topic: "Food Prices", topicAr: "أسعار الغذاء", category: "Economy", categoryAr: "اقتصاد", heat: 70, gmi: -25, cfi: 60, hri: 35, dominantEmotion: "fear", emotionIntensity: 68, sources: 198, change24h: -8 },
    ],
    US: [
      { topic: "AI Regulation Debate", topicAr: "نقاش تنظيم الذكاء الاصطناعي", category: "Technology", categoryAr: "تكنولوجيا", heat: 95, gmi: 15, cfi: 55, hri: 45, dominantEmotion: "curiosity", emotionIntensity: 75, sources: 567, change24h: 28 },
      { topic: "Climate Action Plans", topicAr: "خطط العمل المناخي", category: "Environment", categoryAr: "بيئة", heat: 88, gmi: 30, cfi: 50, hri: 55, dominantEmotion: "hope", emotionIntensity: 62, sources: 423, change24h: 15 },
      { topic: "Healthcare Costs", topicAr: "تكاليف الرعاية الصحية", category: "Health", categoryAr: "صحة", heat: 82, gmi: -20, cfi: 65, hri: 40, dominantEmotion: "anger", emotionIntensity: 70, sources: 356, change24h: -3 },
      { topic: "Space Exploration", topicAr: "استكشاف الفضاء", category: "Science", categoryAr: "علوم", heat: 75, gmi: 65, cfi: 20, hri: 70, dominantEmotion: "joy", emotionIntensity: 78, sources: 234, change24h: 32 },
      { topic: "Housing Market", topicAr: "سوق الإسكان", category: "Economy", categoryAr: "اقتصاد", heat: 70, gmi: -15, cfi: 55, hri: 35, dominantEmotion: "fear", emotionIntensity: 65, sources: 289, change24h: -12 },
    ],
  };

  // Default topics for countries not in the list
  const defaultTopics: TrendingTopic[] = [
    { topic: "Economic Development", topicAr: "التنمية الاقتصادية", category: "Economy", categoryAr: "اقتصاد", heat: 85, gmi: 35, cfi: 40, hri: 55, dominantEmotion: "hope", emotionIntensity: 65, sources: 150, change24h: 10 },
    { topic: "Political Stability", topicAr: "الاستقرار السياسي", category: "Politics", categoryAr: "سياسة", heat: 80, gmi: 20, cfi: 50, hri: 45, dominantEmotion: "curiosity", emotionIntensity: 60, sources: 120, change24h: 5 },
    { topic: "Social Issues", topicAr: "القضايا الاجتماعية", category: "Social", categoryAr: "اجتماعي", heat: 75, gmi: 10, cfi: 45, hri: 50, dominantEmotion: "curiosity", emotionIntensity: 55, sources: 100, change24h: 8 },
    { topic: "Technology Adoption", topicAr: "تبني التكنولوجيا", category: "Technology", categoryAr: "تكنولوجيا", heat: 70, gmi: 50, cfi: 30, hri: 60, dominantEmotion: "hope", emotionIntensity: 70, sources: 80, change24h: 15 },
    { topic: "Cultural Events", topicAr: "الفعاليات الثقافية", category: "Culture", categoryAr: "ثقافة", heat: 65, gmi: 60, cfi: 20, hri: 65, dominantEmotion: "joy", emotionIntensity: 75, sources: 60, change24h: 20 },
  ];

  return topicsByCountry[countryCode] || defaultTopics;
}

// Helper: Generate mock country data
function generateMockCountryData(countryCode: string) {
  return {
    code: countryCode,
    gmi: Math.random() * 100 - 50,
    cfi: Math.random() * 100,
    hri: Math.random() * 100,
    dominantEmotion: ["hope", "fear", "curiosity", "joy", "anger"][Math.floor(Math.random() * 5)],
  };
}

// Helper: Generate mock topic analysis
function generateMockTopicAnalysis(topic: TrendingTopic) {
  return {
    gmi: topic.gmi + (Math.random() * 10 - 5),
    cfi: topic.cfi + (Math.random() * 10 - 5),
    hri: topic.hri + (Math.random() * 10 - 5),
    emotions: generateMockEmotions(),
    confidence: 70 + Math.random() * 25,
  };
}

// Helper: Generate mock emotions
function generateMockEmotions() {
  const total = 100;
  const joy = Math.random() * 30;
  const hope = Math.random() * 25;
  const fear = Math.random() * 20;
  const anger = Math.random() * 15;
  const sadness = Math.random() * 10;
  const curiosity = total - joy - hope - fear - anger - sadness;
  
  return { joy, hope, fear, anger, sadness, curiosity };
}
