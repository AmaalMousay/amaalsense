/**
 * الصفحة الرئيسية لـ AmalSense
 * AmalSense Home Page
 * 
 * تتضمن:
 * - شرح سريع عن المنصة
 * - جولة تفاعلية (Onboarding Tour)
 * - بحث سريع
 * - أمثلة على الاستخدام
 * - آخر التحديثات
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  TrendingUp,
  Globe,
  Heart,
  Zap,
  ArrowRight,
  Search,
  ChevronRight,
} from "lucide-react";

// ============================================================================
// ONBOARDING TOUR COMPONENT
// ============================================================================

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "فهم المشاعر الجماعية",
    description:
      "AmalSense تحلل المشاعر من مصادر رقمية متعددة حول العالم لفهم الحالة العاطفية الجماعية.",
    icon: <Heart className="h-12 w-12" />,
    color: "from-red-500 to-pink-500",
  },
  {
    id: 2,
    title: "تحليل متقدم",
    description:
      "نستخدم نظرية DCFT (Digital Collective Feeling Theory) لتحليل عميق وشامل للمشاعر والاتجاهات.",
    icon: <Brain className="h-12 w-12" />,
    color: "from-purple-500 to-blue-500",
  },
  {
    id: 3,
    title: "مؤشرات عالمية",
    description:
      "احصل على مؤشرات حقيقية: GMI (المزاج العالمي)، CFI (مؤشر الشعور الجماعي)، HRI (مؤشر حقوق الإنسان).",
    icon: <TrendingUp className="h-12 w-12" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "رؤى جغرافية",
    description:
      "اكتشف الفروقات الإقليمية والثقافية في المشاعر والاتجاهات حول العالم.",
    icon: <Globe className="h-12 w-12" />,
    color: "from-blue-500 to-cyan-500",
  },
];

function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const step = onboardingSteps[currentStep];

  if (isCompleted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md border-2 border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader className="space-y-4 pb-6">
          <div className={`flex justify-center rounded-lg bg-gradient-to-r ${step.color} p-4`}>
            <div className="text-white">{step.icon}</div>
          </div>
          <CardTitle className="text-center text-2xl">{step.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            {step.description}
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2">
            {onboardingSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx <= currentStep
                    ? "w-8 bg-purple-500"
                    : "w-2 bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCompleted(true)}
              className="flex-1"
            >
              تخطي الجولة
            </Button>

            {currentStep < onboardingSteps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
              >
                التالي <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setIsCompleted(true)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
              >
                ابدأ الآن <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// QUICK SEARCH COMPONENT
// ============================================================================

interface QuickSearchProps {
  onSearch: (query: string) => void;
}

function QuickSearch({ onSearch }: QuickSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث عن موضوع أو دولة أو حدث..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="pl-10 py-6 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["الذكاء الاصطناعي", "المشاعر العالمية", "الأحداث الجارية"].map(
          (tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-purple-500/20"
              onClick={() => {
                setQuery(tag);
                onSearch(tag);
              }}
            >
              {tag}
            </Badge>
          )
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURES SHOWCASE
// ============================================================================

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <Card className="border-slate-700/50 hover:border-slate-600/80 transition-all hover:shadow-lg hover:shadow-purple-500/10">
      <CardHeader className="pb-3">
        <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-r ${color} p-3`}>
          <div className="text-white">{icon}</div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN HOME PAGE
// ============================================================================

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(
      "amalsense_onboarding_completed"
    );
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("amalsense_onboarding_completed", "true");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to search results page
    // router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full bg-purple-500/10 p-4">
            <Brain className="h-8 w-8 animate-pulse text-purple-500" />
          </div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Onboarding Tour */}
      {showOnboarding && !user && (
        <OnboardingTour />
      )}

      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AmalSense
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  مرحباً، {user.name}
                </span>
                <Button variant="outline" size="sm">
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            فهم المشاعر{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              الجماعية
            </span>{" "}
            حول العالم
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AmalSense تحلل المشاعر والاتجاهات من مصادر رقمية متعددة باستخدام
            تقنيات ذكاء اصطناعي متقدمة لفهم الحالة العاطفية العالمية.
          </p>
        </div>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto">
          <QuickSearch onSearch={handleSearch} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { label: "دول مراقبة", value: "150+" },
            { label: "مصادر بيانات", value: "10,000+" },
            { label: "تحليلات يومية", value: "1M+" },
          ].map((stat) => (
            <Card key={stat.label} className="border-slate-700/50 text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-400">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">الميزات الرئيسية</h2>
          <p className="text-muted-foreground">
            اكتشف قوة تحليل المشاعر الجماعية
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="تحليل المشاعر العميق"
            description="تحليل شامل للمشاعر الجماعية من خلال DCFT (نظرية المشاعر الرقمية الجماعية)"
            color="from-red-500 to-pink-500"
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="ذكاء اصطناعي متقدم"
            description="استخدام نماذج LLM متقدمة مع فهم عميق للسياق والثقافة"
            color="from-purple-500 to-blue-500"
          />

          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="مؤشرات عالمية"
            description="GMI و CFI و HRI - مؤشرات حقيقية لقياس الحالة العاطفية العالمية"
            color="from-green-500 to-emerald-500"
          />

          <FeatureCard
            icon={<Globe className="h-6 w-6" />}
            title="رؤى جغرافية"
            description="اكتشف الفروقات الإقليمية والثقافية في المشاعر والاتجاهات"
            color="from-blue-500 to-cyan-500"
          />

          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="تحديثات فورية"
            description="احصل على تحديثات حية وفورية عن التغييرات في المشاعر العالمية"
            color="from-yellow-500 to-orange-500"
          />

          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="ذكاء إنساني"
            description="إجابات تفهم السياق والعاطفة والثقافة مع تكييف شخصي"
            color="from-pink-500 to-rose-500"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">كيف تعمل؟</h2>
          <p className="text-muted-foreground">
            رحلة البيانات من المصدر إلى الرؤى
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              step: 1,
              title: "جمع البيانات",
              description: "جمع البيانات من 10,000+ مصدر رقمي",
            },
            {
              step: 2,
              title: "معالجة المشاعر",
              description: "تحليل المشاعر باستخدام 4 محركات متخصصة",
            },
            {
              step: 3,
              title: "حساب المؤشرات",
              description: "حساب GMI و CFI و HRI الحقيقية",
            },
            {
              step: 4,
              title: "عرض الرؤى",
              description: "عرض الرؤى بطريقة سهلة وتفاعلية",
            },
          ].map((item) => (
            <Card
              key={item.step}
              className="border-slate-700/50 relative overflow-hidden"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </CardContent>

              {item.step < 4 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:block">
                  <ChevronRight className="h-6 w-6 text-slate-600" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">جاهز للبدء؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              انضم إلى آلاف المستخدمين الذين يستخدمون AmalSense لفهم المشاعر
              والاتجاهات العالمية.
            </p>

            {user ? (
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                اذهب إلى لوحة المعلومات <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                تسجيل الدخول الآن <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">عن AmalSense</h3>
              <p className="text-sm text-muted-foreground">
                منصة تحليل المشاعر الجماعية الرقمية
              </p>
            </div>

            {[
              {
                title: "المنتج",
                links: ["الميزات", "التسعير", "الأمان"],
              },
              {
                title: "الشركة",
                links: ["حول", "المدونة", "الوظائف"],
              },
              {
                title: "القانوني",
                links: ["الخصوصية", "الشروط", "الاتصال"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-foreground transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700/50 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 AmalSense. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
