/**
 * AnalysisSkeleton - مكون تحميل متقدم لصفحات التحليل
 * يعرض هيكل عظمي متحرك يحاكي شكل النتائج الحقيقية
 */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Brain, BarChart3, Globe, Newspaper, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Shimmer animation base class
const shimmer = "animate-pulse bg-gradient-to-r from-muted/60 via-muted to-muted/60 rounded";

// Analysis steps for progress display
const ANALYSIS_STEPS = [
  { icon: Globe, labelAr: 'جمع البيانات من المصادر...', labelEn: 'Collecting data from sources...', duration: 3000 },
  { icon: Newspaper, labelAr: 'تحليل الأخبار والمنشورات...', labelEn: 'Analyzing news and posts...', duration: 5000 },
  { icon: Brain, labelAr: 'معالجة بالذكاء الاصطناعي...', labelEn: 'AI processing...', duration: 8000 },
  { icon: BarChart3, labelAr: 'حساب المؤشرات...', labelEn: 'Calculating indices...', duration: 10000 },
  { icon: Activity, labelAr: 'إعداد التقرير النهائي...', labelEn: 'Preparing final report...', duration: 12000 },
];

interface AnalysisSkeletonProps {
  variant?: 'full' | 'compact' | 'chat';
  topic?: string;
  showSteps?: boolean;
}

function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return <div className={cn(shimmer, width, height)} />;
}

function SkeletonCircle({ size = 'w-12 h-12' }: { size?: string }) {
  return <div className={cn(shimmer, size, "rounded-full")} />;
}

// Full page skeleton for TopicAnalysisResults
function FullSkeleton({ topic }: { topic?: string }) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={cn(shimmer, "w-10 h-10 rounded-full")} />
        <div className="space-y-2 flex-1">
          <SkeletonLine width="w-64" height="h-6" />
          <SkeletonLine width="w-40" height="h-3" />
        </div>
      </div>

      {/* Topic Info Card */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-primary animate-pulse" />
                <h2 className="text-lg font-bold text-foreground">
                  {topic ? `جاري تحليل: ${topic}` : 'جاري التحليل...'}
                </h2>
              </div>
              <div className="flex gap-2">
                <div className={cn(shimmer, "w-20 h-6 rounded-full")} />
                <div className={cn(shimmer, "w-24 h-6 rounded-full")} />
                <div className={cn(shimmer, "w-16 h-6 rounded-full")} />
              </div>
            </div>
            <div className="relative">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/30 border-t-primary" />
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Index Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['GMI', 'CFI', 'HRI'].map((name) => (
          <Card key={name} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <SkeletonLine width="w-32" height="h-5" />
                <div className={cn(shimmer, "w-12 h-8 rounded-md")} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={cn(shimmer, "w-full h-3 rounded-full")} />
                <div className="flex justify-between">
                  <SkeletonLine width="w-16" height="h-3" />
                  <SkeletonLine width="w-16" height="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotion Chart Skeleton */}
        <Card>
          <CardHeader>
            <SkeletonLine width="w-40" height="h-5" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-3 h-48">
              {[60, 80, 45, 90, 30, 70].map((h, i) => (
                <div
                  key={i}
                  className={cn(shimmer, "w-10 rounded-t-md")}
                  style={{ height: `${h}%`, animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Response Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              <SkeletonLine width="w-48" height="h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-11/12" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-9/12" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-7/12" />
          </CardContent>
        </Card>
      </div>

      {/* Sources Skeleton */}
      <Card>
        <CardHeader>
          <SkeletonLine width="w-32" height="h-5" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                <SkeletonCircle size="w-8 h-8" />
                <div className="space-y-1 flex-1">
                  <SkeletonLine width="w-20" height="h-3" />
                  <SkeletonLine width="w-12" height="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Compact skeleton for sidebar/panel analysis results
function CompactSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Index Cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <SkeletonLine width="w-24" height="h-4" />
            <div className={cn(shimmer, "w-10 h-6 rounded-md")} />
          </div>
          <div className={cn(shimmer, "w-full h-2 rounded-full")} />
        </div>
      ))}

      {/* Emotion Bars */}
      <div className="space-y-2 pt-4">
        <SkeletonLine width="w-32" height="h-4" />
        {[80, 60, 45, 30, 20].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonLine width="w-16" height="h-3" />
            <div className={cn(shimmer, "h-3 rounded-full")} style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>

      {/* AI Response */}
      <div className="space-y-2 pt-4">
        <SkeletonLine width="w-40" height="h-4" />
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-11/12" height="h-3" />
        <SkeletonLine width="w-9/12" height="h-3" />
      </div>
    </div>
  );
}

// Chat-style skeleton for SmartAnalysis chat view
function ChatSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <Brain className="w-4 h-4 text-primary animate-pulse" />
      </div>
      <div className="flex-1 space-y-3">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-3">
            {/* Typing indicator */}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {/* Content skeleton */}
            <div className="space-y-2">
              <SkeletonLine width="w-full" height="h-3" />
              <SkeletonLine width="w-10/12" height="h-3" />
              <SkeletonLine width="w-8/12" height="h-3" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Progress Steps component
function AnalysisProgress({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 500);
    return () => clearInterval(interval);
  }, [startTime]);

  const isRTL = typeof document !== 'undefined' && 
    (document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar');

  return (
    <div className="space-y-2 mt-4">
      {ANALYSIS_STEPS.map((step, index) => {
        const isActive = elapsed >= step.duration && (index === ANALYSIS_STEPS.length - 1 || elapsed < ANALYSIS_STEPS[index + 1].duration);
        const isComplete = index < ANALYSIS_STEPS.length - 1 && elapsed >= ANALYSIS_STEPS[index + 1].duration;
        const isPending = elapsed < step.duration;
        const Icon = step.icon;

        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500",
              isActive && "bg-primary/10 text-primary",
              isComplete && "text-muted-foreground/60",
              isPending && "text-muted-foreground/30"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all",
              isActive && "bg-primary/20",
              isComplete && "bg-green-500/20",
              isPending && "bg-muted"
            )}>
              {isComplete ? (
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : isActive ? (
                <Icon className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
            </div>
            <span className={cn("text-sm", isActive && "font-medium")}>
              {isRTL ? step.labelAr : step.labelEn}
            </span>
            {isActive && (
              <div className="mr-auto ml-2">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AnalysisSkeleton({ variant = 'full', topic, showSteps = false }: AnalysisSkeletonProps) {
  const [startTime] = useState(() => Date.now());

  if (variant === 'chat') {
    return <ChatSkeleton />;
  }

  if (variant === 'compact') {
    return <CompactSkeleton />;
  }

  return (
    <div>
      <FullSkeleton topic={topic} />
      {showSteps && (
        <div className="fixed bottom-4 right-4 z-50 w-72">
          <Card className="shadow-xl border-primary/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary/30 border-t-primary" />
                <span className="text-sm font-medium">جاري التحليل...</span>
              </div>
              <AnalysisProgress startTime={startTime} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AnalysisSkeleton;
