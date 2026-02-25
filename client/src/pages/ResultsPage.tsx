/**
 * صفحة النتائج الشاملة
 * Comprehensive Results Page
 * 
 * تتضمن:
 * - عرض المؤشرات (GMI, CFI, HRI)
 * - تحليل العواطف
 * - الرسوم البيانية التفاعلية
 * - ميزات الذكاء الإنساني
 * - التوصيات والرؤى
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ComprehensiveHumanLikeAIDisplay,
} from "@/components/HumanLikeAIDisplay";
import { EmotionalToneAdapter } from "@/components/EmotionalToneAdapter";
import { SuggestionCards } from "@/components/SuggestionCards";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { DCFTAnalysisChart } from "@/components/DCFTAnalysisChart";
import { EmotionDistributionChart } from "@/components/EmotionDistributionChart";
import { TopicCloud } from "@/components/TopicCloud";
import { ImpactPredictionTimeline } from "@/components/ImpactPredictionTimeline";
import { RelatedEventsPanel } from "@/components/RelatedEventsPanel";
import {
  TrendingUp,
  Heart,
  Globe,
  BarChart3,
  Share2,
  Download,
  Bookmark,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";

// ============================================================================
// INDICATOR CARD COMPONENT
// ============================================================================

interface IndicatorCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

function IndicatorCard({
  title,
  value,
  description,
  icon,
  color,
  trend,
  trendValue,
}: IndicatorCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <Card className="border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          </div>
          <div className={`rounded-lg bg-gradient-to-br ${color} bg-opacity-10 p-3`}>
            <div className={color}>{icon}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1">
          <TrendingUp className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-xs font-semibold ${trendColor}`}>
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {trendValue}% منذ أمس
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EMOTION BREAKDOWN COMPONENT
// ============================================================================

interface EmotionData {
  emotion: string;
  percentage: number;
  count: number;
  emoji: string;
  color: string;
}

const emotionData: EmotionData[] = [
  { emotion: "Happy", percentage: 35, count: 3500, emoji: "😊", color: "bg-yellow-500" },
  { emotion: "Neutral", percentage: 28, count: 2800, emoji: "😐", color: "bg-gray-500" },
  { emotion: "Sad", percentage: 18, count: 1800, emoji: "😢", color: "bg-blue-500" },
  { emotion: "Excited", percentage: 12, count: 1200, emoji: "🤩", color: "bg-purple-500" },
  { emotion: "Angry", percentage: 5, count: 500, emoji: "😠", color: "bg-red-500" },
  { emotion: "Confused", percentage: 2, count: 200, emoji: "😕", color: "bg-orange-500" },
];

function EmotionBreakdown() {
  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          توزيع العواطف
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {emotionData.map((data) => (
          <div key={data.emotion} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{data.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{data.emotion}</p>
                  <p className="text-xs text-muted-foreground">
                    {data.count.toLocaleString()} تفاعل
                  </p>
                </div>
              </div>
              <span className="font-bold text-lg">{data.percentage}%</span>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-700 overflow-hidden">
              <div
                className={`h-full ${data.color}`}
                style={{ width: `${data.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// REGIONAL ANALYSIS COMPONENT
// ============================================================================

interface RegionalData {
  region: string;
  mood: number;
  trend: "up" | "down" | "stable";
  topEmotion: string;
  sources: number;
}

const regionalData: RegionalData[] = [
  {
    region: "الشرق الأوسط",
    mood: 72,
    trend: "up",
    topEmotion: "متفائل",
    sources: 2500,
  },
  {
    region: "آسيا",
    mood: 68,
    trend: "stable",
    topEmotion: "محايد",
    sources: 3200,
  },
  {
    region: "أوروبا",
    mood: 65,
    trend: "down",
    topEmotion: "قلق",
    sources: 1800,
  },
  {
    region: "الأمريكتان",
    mood: 70,
    trend: "up",
    topEmotion: "متفائل",
    sources: 2100,
  },
  {
    region: "أفريقيا",
    mood: 75,
    trend: "up",
    topEmotion: "متفائل",
    sources: 900,
  },
];

function RegionalAnalysis() {
  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          التحليل الإقليمي
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {regionalData.map((data) => (
            <div
              key={data.region}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition"
            >
              <div className="flex-1">
                <p className="font-semibold">{data.region}</p>
                <p className="text-xs text-muted-foreground">
                  {data.sources.toLocaleString()} مصدر
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{data.topEmotion}</p>
                  <p className="text-xs text-muted-foreground">المشاعر الرئيسية</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-400">
                      {data.mood}
                    </p>
                    <p className="text-xs text-muted-foreground">المزاج</p>
                  </div>

                  {data.trend === "up" && (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  )}
                  {data.trend === "down" && (
                    <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
                  )}
                  {data.trend === "stable" && (
                    <div className="h-5 w-5 text-gray-500">—</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// INSIGHTS AND RECOMMENDATIONS
// ============================================================================

interface Insight {
  id: string;
  type: "positive" | "negative" | "warning" | "info";
  title: string;
  description: string;
  icon: React.ReactNode;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "positive",
    title: "ارتفاع التفاؤل العالمي",
    description:
      "المؤشرات تظهر ارتفاعاً بنسبة 12% في مستويات التفاؤل العالمي خلال الأسبوع الماضي.",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  {
    id: "2",
    type: "warning",
    title: "قلق متزايد في أوروبا",
    description:
      "تقارير تشير إلى زيادة في مستويات القلق في المنطقة الأوروبية بنسبة 8%.",
    icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
  },
  {
    id: "3",
    type: "info",
    title: "اتجاهات جديدة في وسائل التواصل",
    description:
      "ظهور اتجاهات جديدة تركز على الصحة العقلية والرفاهية النفسية.",
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
  },
];

function InsightsSection() {
  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          الرؤى والتوصيات
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${
              insight.type === "positive"
                ? "border-green-500/30 bg-green-500/5"
                : insight.type === "negative"
                  ? "border-red-500/30 bg-red-500/5"
                  : insight.type === "warning"
                    ? "border-orange-500/30 bg-orange-500/5"
                    : "border-blue-500/30 bg-blue-500/5"
            }`}
          >
            <div className="flex gap-3">
              {insight.icon}
              <div className="flex-1">
                <p className="font-semibold text-sm">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN RESULTS PAGE
// ============================================================================

interface ResultsPageProps {
  data?: {
    response: string;
    confidence: {
      level: string;
      percentage: number;
      alternatives?: string[];
      missingInformation?: string[];
    };
    emotionalIntelligence: {
      detectedEmotions: Record<string, number>;
      dominantEmotion: string;
      adaptedTone: string;
      emotionIntensity: number;
    };
    humanLikeAI: {
      contextualUnderstanding: string;
      proactiveSuggestions: {
        followUpQuestions: Array<{
          question: string;
          relevance: number;
          expectedValue: string;
        }>;
        relatedTopics: string[];
        importantWarnings: string[];
      };
      uncertaintyAcknowledgment: {
        confidence: number;
        alternatives: string[];
        needsMoreInfo: string[];
        disclaimers: string[];
      };
    };
  };
}

export default function ResultsPage({ data }: ResultsPageProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showEmotionalAdapter, setShowEmotionalAdapter] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);

  // Use real data if available, otherwise fallback to mock
  const mockResponse = {
    answer:
      "المؤشرات العالمية تظهر حالة من التفاؤل المتزايد مع بعض المخاوف الإقليمية. الشرق الأوسط يشهد ارتفاعاً في المشاعر الإيجابية بنسبة 12%، بينما تظهر أوروبا علامات قلق متزايدة.",
    humanLikeAI: {
      context: {
          immediateContext: ["سؤال سابق 1", "سؤال سابق 2"],
          expandedContext: ["سياق موسع 1", "سياق موسع 2"],
          personalContext: {
            userId: "user123",
            preferences: { language: "ar", region: "mena" },
            history: ["تاريخ 1", "تاريخ 2"],
          },
          culturalContext: {
            region: "MENA",
            language: "ar",
            culturalNorms: ["احترام", "تعاون"],
          },
        },
      contextualInsights:
        "المستخدم مهتم بالتحليلات الإقليمية والمؤشرات العالمية",
      emotionalAdaptation: {
        detectedEmotion: {
          primary: "curious",
          intensity: 75,
        },
        responseAdaptation: {
          tone: "informative",
          length: "moderate",
          includeSupport: true,
          supportMessage: "نحن هنا لمساعدتك في فهم البيانات",
        },
      },
      suggestions: {
        followUpQuestions: [
          {
            question: "ما هي أسباب القلق المتزايد في أوروبا؟",
            relevance: 92,
            expectedValue: "تحليل عميق للعوامل الاقتصادية والاجتماعية",
          },
          {
            question: "كيف يمكن الاستفادة من التفاؤل المتزايد؟",
            relevance: 85,
            expectedValue: "فرص استثمارية وتطويرية",
          },
        ],
        relatedTopics: ["الاقتصاد العالمي", "الاستقرار الاجتماعي"],
        importantWarnings: [
          "البيانات تستند إلى عينات قد لا تمثل المجتمع بأكمله",
        ],
      },
      personalityConsistency: {
        traits: {
          formality: 60,
          empathy: 70,
          humor: 30,
          verbosity: 65,
        },
        communicationStyle: {
          preferredStructure: "mixed",
          useEmojis: false,
          includeExamples: true,
          citeSources: true,
        },
      },
      uncertainty: {
        confidence: 82,
        acknowledgment: "البيانات المعروضة تستند إلى عينات قد تختلف عن المجتمع الكامل",
        alternatives: ["تحليل بديل باستخدام مصادر أخرى"],
        missingInformation: ["بيانات من مناطق جغرافية محددة"],
        recommendedActions: ["التحقق من المصادر الأولية"],
      },
      ethicalAssessment: {
        isSensitive: false,
        riskLevel: "low",
        potentialHarms: [],
        potentialBenefits: [
          "فهم أفضل للاتجاهات العالمية",
          "اتخاذ قرارات مستنيرة",
        ],
        disclaimers: [],
        balancedPerspectives: [
          "البيانات تعكس آراء الأشخاص المتصلين بالإنترنت",
        ],
      },
      metadata: {
        confidence: 82,
        quality: 85,
      },
      finalAnswer:
        "المؤشرات العالمية تظهر حالة من التفاؤل المتزايد مع بعض المخاوف الإقليمية...",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">تحليل المشاعر العالمية</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                تم التحديث منذ 5 دقائق
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    isSaved ? "fill-purple-500 text-purple-500" : ""
                  }`}
                />
                {isSaved ? "محفوظ" : "حفظ"}
              </Button>

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="emotions">العواطف</TabsTrigger>
            <TabsTrigger value="regional">إقليمي</TabsTrigger>
            <TabsTrigger value="insights">الرؤى</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <IndicatorCard
                title="مؤشر المزاج العالمي (GMI)"
                value={72}
                description="مؤشر شامل للمزاج العالمي"
                icon={<TrendingUp className="h-6 w-6" />}
                color="text-purple-400"
                trend="up"
                trendValue={5}
              />

              <IndicatorCard
                title="مؤشر الشعور الجماعي (CFI)"
                value={68}
                description="مؤشر قوة المشاعر الجماعية"
                icon={<Heart className="h-6 w-6" />}
                color="text-red-400"
                trend="stable"
                trendValue={0}
              />

              <IndicatorCard
                title="مؤشر حقوق الإنسان (HRI)"
                value={75}
                description="مؤشر الوعي بحقوق الإنسان"
                icon={<Globe className="h-6 w-6" />}
                color="text-blue-400"
                trend="up"
                trendValue={3}
              />
            </div>

            {/* Main Answer */}
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle>التحليل الشامل</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  {mockResponse.answer}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {["متفائل", "مستقر", "إيجابي"].map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Human-like AI Features */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">ميزات الذكاء الإنساني</h2>
              
              {/* Emotional Tone Adapter */}
              {showEmotionalAdapter && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">تكييف النبرة العاطفية</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmotionalAdapter(!showEmotionalAdapter)}
                    >
                      إخفاء
                    </Button>
                  </div>
                  <EmotionalToneAdapter
                    emotion={{
                      primary: data?.emotionalIntelligence.dominantEmotion || mockResponse.humanLikeAI.emotionalAdaptation.detectedEmotion.primary,
                      intensity: data?.emotionalIntelligence.emotionIntensity ? data.emotionalIntelligence.emotionIntensity * 100 : mockResponse.humanLikeAI.emotionalAdaptation.detectedEmotion.intensity
                    }}
                    responseText={data?.response || mockResponse.answer}
                  />
                </div>
              )}
              
              {/* Confidence Indicator */}
              {showConfidence && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">مؤشر الثقة والموثوقية</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfidence(!showConfidence)}
                    >
                      إخفاء
                    </Button>
                  </div>
                  <ConfidenceIndicator
                    confidence={data?.humanLikeAI.uncertaintyAcknowledgment.confidence || mockResponse.humanLikeAI.uncertainty.confidence}
                    alternatives={data?.humanLikeAI.uncertaintyAcknowledgment.alternatives || mockResponse.humanLikeAI.uncertainty.alternatives}
                    needsMoreInfo={data?.humanLikeAI.uncertaintyAcknowledgment.needsMoreInfo || mockResponse.humanLikeAI.uncertainty.missingInformation}
                    disclaimers={data?.humanLikeAI.uncertaintyAcknowledgment.disclaimers || mockResponse.humanLikeAI.ethicalAssessment.balancedPerspectives}
                  />
                </div>
              )}
              
              {/* Suggestion Cards */}
              {showSuggestions && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">الاقتراحات والمتابعة</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                      إخفاء
                    </Button>
                  </div>
                  <SuggestionCards
                    followUpQuestions={data?.humanLikeAI.proactiveSuggestions.followUpQuestions || mockResponse.humanLikeAI.suggestions.followUpQuestions}
                    relatedTopics={data?.humanLikeAI.proactiveSuggestions.relatedTopics || mockResponse.humanLikeAI.suggestions.relatedTopics}
                    importantWarnings={data?.humanLikeAI.proactiveSuggestions.importantWarnings || mockResponse.humanLikeAI.suggestions.importantWarnings}
                    onSuggestionClick={(suggestion) => console.log("Suggestion clicked:", suggestion)}
                  />
                </div>
              )}
              
              {/* Main Human-like AI Display */}
              <ComprehensiveHumanLikeAIDisplay
                response={mockResponse.humanLikeAI}
                onQuestionClick={(q) => console.log("New question:", q)}
              />
            </div>
          </TabsContent>

          {/* Emotions Tab */}
          <TabsContent value="emotions">
            <EmotionBreakdown />
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional">
            <RegionalAnalysis />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* DCFT Analysis */}
              <DCFTAnalysisChart 
                currentScore={data?.confidence.percentage || 65}
                trend="up"
              />
              
              {/* Emotion Distribution */}
              <EmotionDistributionChart 
                emotions={data?.emotionalIntelligence.detectedEmotions}
                dominantEmotion={data?.emotionalIntelligence.dominantEmotion}
              />
            </div>

            {/* Topic Cloud */}
            <TopicCloud 
              onTopicClick={(topic) => console.log('Topic clicked:', topic)}
            />

            {/* Impact Prediction Timeline */}
            <ImpactPredictionTimeline />

            {/* Related Events */}
            <RelatedEventsPanel 
              onEventClick={(eventId) => console.log('Event clicked:', eventId)}
            />

            {/* Original Insights Section */}
            <InsightsSection />
          </TabsContent>
        </Tabs>

        {/* Related Analysis */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">تحليلات ذات صلة</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "تطور المشاعر العالمية",
                description: "رسم بياني يظهر تطور المشاعر خلال الأسابيع الماضية",
              },
              {
                title: "مقارنة إقليمية",
                description: "مقارنة بين المشاعر في المناطق المختلفة",
              },
            ].map((analysis) => (
              <Card
                key={analysis.title}
                className="border-slate-700/50 cursor-pointer hover:border-slate-600/80 transition"
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">{analysis.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      عرض التحليل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
