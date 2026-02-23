/**
 * مكونات عرض ميزات الذكاء الإنساني
 * Human-like AI Display Components
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lightbulb, Heart, Brain, Shield, Zap } from "lucide-react";

// ============================================================================
// 1. CONTEXTUAL UNDERSTANDING DISPLAY
// ============================================================================

interface ContextualUnderstandingProps {
  context: {
    immediateContext: string[];
    expandedContext: string[];
    personalContext: {
      userId: string;
      preferences: Record<string, any>;
      history: string[];
    };
    culturalContext: {
      region: string;
      language: string;
      culturalNorms: string[];
    };
  };
  insights: string;
}

export function ContextualUnderstandingDisplay({
  context,
  insights,
}: ContextualUnderstandingProps) {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-blue-500" />
          فهم السياق
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          <p className="mb-2 font-semibold">رؤى السياق:</p>
          <p className="rounded bg-background/50 p-2">{insights}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="font-semibold text-foreground">المنطقة</p>
            <Badge variant="outline">{context.culturalContext.region}</Badge>
          </div>
          <div>
            <p className="font-semibold text-foreground">اللغة</p>
            <Badge variant="outline">{context.culturalContext.language}</Badge>
          </div>
        </div>

        {context.culturalContext.culturalNorms.length > 0 && (
          <div className="text-xs">
            <p className="mb-1 font-semibold text-foreground">المعايير الثقافية</p>
            <div className="flex flex-wrap gap-1">
              {context.culturalContext.culturalNorms.map((norm) => (
                <Badge key={norm} variant="secondary" className="text-xs">
                  {norm}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 2. EMOTIONAL INTELLIGENCE DISPLAY
// ============================================================================

interface EmotionalIntelligenceProps {
  emotion: {
    primary: string;
    intensity: number;
  };
  adaptation: {
    tone: string;
    length: string;
    includeSupport: boolean;
    supportMessage: string;
  };
}

export function EmotionalIntelligenceDisplay({
  emotion,
  adaptation,
}: EmotionalIntelligenceProps) {
  const emotionColors: Record<string, string> = {
    happy: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    sad: "bg-blue-500/20 text-blue-700 border-blue-500/30",
    angry: "bg-red-500/20 text-red-700 border-red-500/30",
    neutral: "bg-gray-500/20 text-gray-700 border-gray-500/30",
    excited: "bg-purple-500/20 text-purple-700 border-purple-500/30",
    confused: "bg-orange-500/20 text-orange-700 border-orange-500/30",
    frustrated: "bg-red-500/20 text-red-700 border-red-500/30",
  };

  const emotionEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
    excited: "🤩",
    confused: "😕",
    frustrated: "😤",
  };

  return (
    <Card className="border-pink-500/20 bg-pink-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="h-4 w-4 text-pink-500" />
          الذكاء العاطفي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {emotionEmojis[emotion.primary] || "😐"}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold capitalize">{emotion.primary}</span>
              <span className="text-xs text-muted-foreground">
                {emotion.intensity}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-background/50">
              <div
                className="h-full rounded-full bg-pink-500"
                style={{ width: `${emotion.intensity}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/50 pt-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">النبرة</span>
            <Badge variant="outline" className="capitalize">
              {adaptation.tone}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الطول</span>
            <Badge variant="outline" className="capitalize">
              {adaptation.length}
            </Badge>
          </div>
        </div>

        {adaptation.includeSupport && (
          <div className="rounded bg-background/50 p-2 text-xs italic text-foreground/70">
            💬 {adaptation.supportMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 3. PROACTIVE SUGGESTIONS DISPLAY
// ============================================================================

interface ProactiveSuggestionsProps {
  suggestions: {
    followUpQuestions: Array<{
      question: string;
      relevance: number;
      expectedValue: string;
    }>;
    relatedTopics: string[];
    importantWarnings: string[];
  };
  onQuestionClick?: (question: string) => void;
}

export function ProactiveSuggestionsDisplay({
  suggestions,
  onQuestionClick,
}: ProactiveSuggestionsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          اقتراحات ذكية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* أسئلة المتابعة */}
        {suggestions.followUpQuestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">
              أسئلة متابعة مقترحة
            </p>
            <div className="space-y-2">
              {suggestions.followUpQuestions.slice(0, 3).map((q, idx) => (
                <div key={idx} className="space-y-1">
                  <button
                    onClick={() => {
                      setExpandedQuestion(
                        expandedQuestion === idx ? null : idx
                      );
                      onQuestionClick?.(q.question);
                    }}
                    className="w-full rounded bg-background/50 p-2 text-left text-xs hover:bg-background/70"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex-1">{q.question}</span>
                      <Badge
                        variant="secondary"
                        className="ml-2 whitespace-nowrap text-xs"
                      >
                        {q.relevance}%
                      </Badge>
                    </div>
                  </button>
                  {expandedQuestion === idx && (
                    <p className="text-xs text-muted-foreground">
                      💡 {q.expectedValue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* المواضيع ذات الصلة */}
        {suggestions.relatedTopics.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-foreground">
              مواضيع ذات صلة
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestions.relatedTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* التحذيرات المهمة */}
        {suggestions.importantWarnings.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-foreground">
              تحذيرات مهمة
            </p>
            <div className="space-y-1">
              {suggestions.importantWarnings.map((warning, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 rounded bg-red-500/10 p-2 text-xs text-red-700"
                >
                  <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 4. UNCERTAINTY ACKNOWLEDGMENT DISPLAY
// ============================================================================

interface UncertaintyProps {
  confidence: number;
  acknowledgment: string;
  alternatives: string[];
  missingInformation: string[];
  recommendedActions: string[];
}

export function UncertaintyAcknowledgmentDisplay({
  confidence,
  acknowledgment,
  alternatives,
  missingInformation,
  recommendedActions,
}: UncertaintyProps) {
  const confidenceColor =
    confidence >= 80
      ? "bg-green-500/20 text-green-700"
      : confidence >= 50
        ? "bg-yellow-500/20 text-yellow-700"
        : "bg-red-500/20 text-red-700";

  return (
    <Card className="border-orange-500/20 bg-orange-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            مستوى الثقة
          </span>
          <Badge className={confidenceColor}>{confidence}%</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {confidence < 80 && (
          <div className="rounded bg-background/50 p-2 text-xs text-muted-foreground">
            ⚠️ {acknowledgment}
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">
              بدائل ممكنة
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {alternatives.map((alt, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-foreground/50">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {missingInformation.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-foreground">
              معلومات مفقودة
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {missingInformation.map((info, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-foreground/50">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendedActions.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-foreground">
              إجراءات موصى بها
            </p>
            <div className="space-y-1">
              {recommendedActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 5. ETHICAL ASSESSMENT DISPLAY
// ============================================================================

interface EthicalAssessmentProps {
  assessment: {
    isSensitive: boolean;
    riskLevel: "low" | "medium" | "high";
    potentialHarms: string[];
    potentialBenefits: string[];
    disclaimers: string[];
    balancedPerspectives: string[];
  };
}

export function EthicalAssessmentDisplay({
  assessment,
}: EthicalAssessmentProps) {
  const riskColors = {
    low: "bg-green-500/20 text-green-700",
    medium: "bg-yellow-500/20 text-yellow-700",
    high: "bg-red-500/20 text-red-700",
  };

  return (
    <Card className="border-purple-500/20 bg-purple-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" />
            التقييم الأخلاقي
          </span>
          {assessment.isSensitive && (
            <Badge className={riskColors[assessment.riskLevel]}>
              {assessment.riskLevel}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assessment.isSensitive && (
          <div className="rounded bg-background/50 p-2 text-xs text-muted-foreground">
            ⚖️ هذا الموضوع يتطلب دراسة أخلاقية متوازنة
          </div>
        )}

        {assessment.disclaimers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">تحذيرات</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {assessment.disclaimers.map((disc, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-foreground/50">⚠️</span>
                  <span>{disc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {assessment.balancedPerspectives.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-foreground">
              وجهات نظر متوازنة
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {assessment.balancedPerspectives.map((persp, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-foreground/50">💭</span>
                  <span>{persp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {assessment.potentialHarms.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-red-700">أضرار محتملة</p>
            <ul className="space-y-1 text-xs text-red-600">
              {assessment.potentialHarms.map((harm, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>•</span>
                  <span>{harm}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {assessment.potentialBenefits.length > 0 && (
          <div className="space-y-2 border-t border-border/50 pt-2">
            <p className="text-xs font-semibold text-green-700">فوائد محتملة</p>
            <ul className="space-y-1 text-xs text-green-600">
              {assessment.potentialBenefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 6. COMPREHENSIVE HUMAN-LIKE AI DISPLAY
// ============================================================================

interface ComprehensiveHumanLikeAIProps {
  response: {
    context: any;
    contextualInsights: string;
    emotionalAdaptation: any;
    suggestions: any;
    uncertainty: any;
    ethicalAssessment: any;
    metadata: {
      confidence: number;
      quality: number;
    };
  };
  onQuestionClick?: (question: string) => void;
}

export function ComprehensiveHumanLikeAIDisplay({
  response,
  onQuestionClick,
}: ComprehensiveHumanLikeAIProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {/* Contextual Understanding */}
      <div
        onClick={() =>
          setExpandedSection(
            expandedSection === "context" ? null : "context"
          )
        }
        className="cursor-pointer"
      >
        {expandedSection === "context" && (
          <ContextualUnderstandingDisplay
            context={response.context}
            insights={response.contextualInsights}
          />
        )}
      </div>

      {/* Emotional Intelligence */}
      <div
        onClick={() =>
          setExpandedSection(
            expandedSection === "emotion" ? null : "emotion"
          )
        }
        className="cursor-pointer"
      >
        {expandedSection === "emotion" && (
          <EmotionalIntelligenceDisplay
            emotion={response.emotionalAdaptation.detectedEmotion}
            adaptation={response.emotionalAdaptation.responseAdaptation}
          />
        )}
      </div>

      {/* Proactive Suggestions */}
      <div
        onClick={() =>
          setExpandedSection(
            expandedSection === "suggestions" ? null : "suggestions"
          )
        }
        className="cursor-pointer"
      >
        {expandedSection === "suggestions" && (
          <ProactiveSuggestionsDisplay
            suggestions={response.suggestions}
            onQuestionClick={onQuestionClick}
          />
        )}
      </div>

      {/* Uncertainty */}
      <div
        onClick={() =>
          setExpandedSection(
            expandedSection === "uncertainty" ? null : "uncertainty"
          )
        }
        className="cursor-pointer"
      >
        {expandedSection === "uncertainty" && (
          <UncertaintyAcknowledgmentDisplay
            confidence={response.uncertainty.confidence}
            acknowledgment={response.uncertainty.acknowledgment}
            alternatives={response.uncertainty.alternatives}
            missingInformation={response.uncertainty.missingInformation}
            recommendedActions={response.uncertainty.recommendedActions}
          />
        )}
      </div>

      {/* Ethical Assessment */}
      <div
        onClick={() =>
          setExpandedSection(
            expandedSection === "ethical" ? null : "ethical"
          )
        }
        className="cursor-pointer"
      >
        {expandedSection === "ethical" && (
          <EthicalAssessmentDisplay assessment={response.ethicalAssessment} />
        )}
      </div>

      {/* Quality Metrics */}
      <Card className="border-slate-500/20 bg-slate-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs">مؤشرات الجودة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">جودة الإجابة</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-background/50">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${response.metadata.quality}%` }}
                />
              </div>
              <span className="font-semibold">{response.metadata.quality}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">مستوى الثقة</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-background/50">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${response.metadata.confidence}%` }}
                />
              </div>
              <span className="font-semibold">
                {response.metadata.confidence}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
