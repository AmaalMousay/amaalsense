import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  TrendingUp,
  AlertTriangle,
  Crown
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface UsageQuotaProps {
  compact?: boolean;
  language?: "en" | "ar";
}

export default function UsageQuota({ compact = false, language = "en" }: UsageQuotaProps) {
  const { user, isAuthenticated } = useAuth();
  const isArabic = language === "ar";
  
  // Get usage data from API
  const { data: usageData } = trpc.subscription.getUsage.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refresh every minute
  });

  // Default values for non-authenticated users
  const tier = user?.subscriptionTier || "free";
  const used = usageData?.analysesUsed || 0;
  const limit = usageData?.analysesLimit || 50;
  const percentage = Math.min((used / limit) * 100, 100);
  
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const tierLabels = {
    free: { en: "Free", ar: "مجاني" },
    pro: { en: "Pro", ar: "احترافي" },
    enterprise: { en: "Enterprise", ar: "مؤسسي" },
    government: { en: "Government", ar: "حكومي" },
  };

  const tierColors = {
    free: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    pro: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    enterprise: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    government: "bg-green-500/20 text-green-300 border-green-500/30",
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={tierColors[tier as keyof typeof tierColors]}>
          {tierLabels[tier as keyof typeof tierLabels]?.[isArabic ? "ar" : "en"] || tier}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <Zap className="w-3 h-3" />
          <span>{used}/{limit}</span>
        </div>
        {isNearLimit && !isAtLimit && (
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        )}
        {isAtLimit && (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-black/40 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${isAtLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-cyan-400"}`} />
          <span className="font-medium text-white">
            {isArabic ? "حصة الاستخدام اليومية" : "Daily Usage Quota"}
          </span>
        </div>
        <Badge className={tierColors[tier as keyof typeof tierColors]}>
          {tier === "free" ? null : <Crown className="w-3 h-3 mr-1" />}
          {tierLabels[tier as keyof typeof tierLabels]?.[isArabic ? "ar" : "en"] || tier}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <Progress 
          value={percentage} 
          className={`h-2 ${isAtLimit ? "[&>div]:bg-red-500" : isNearLimit ? "[&>div]:bg-yellow-500" : "[&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500"}`}
        />
      </div>

      {/* Usage Text */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {isArabic 
            ? `${used} من ${limit} تحليل مستخدم`
            : `${used} of ${limit} analyses used`
          }
        </span>
        <span className={`font-medium ${isAtLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-green-400"}`}>
          {limit - used} {isArabic ? "متبقي" : "remaining"}
        </span>
      </div>

      {/* Warning/Upgrade Message */}
      {isAtLimit && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">
              {isArabic ? "وصلت للحد الأقصى!" : "Limit Reached!"}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-2">
            {isArabic 
              ? "قم بالترقية للحصول على تحليلات غير محدودة"
              : "Upgrade to get unlimited analyses"
            }
          </p>
          <Link href="/pricing">
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              {isArabic ? "ترقية الآن" : "Upgrade Now"}
            </Button>
          </Link>
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {isArabic 
                ? "أنت قريب من الحد الأقصى. فكر في الترقية!"
                : "You're approaching your limit. Consider upgrading!"
              }
            </span>
          </div>
        </div>
      )}

      {tier === "free" && !isNearLimit && (
        <div className="mt-3">
          <Link href="/pricing">
            <Button variant="outline" size="sm" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
              <Crown className="w-4 h-4 mr-2" />
              {isArabic ? "ترقية للمزيد من الميزات" : "Upgrade for More Features"}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
