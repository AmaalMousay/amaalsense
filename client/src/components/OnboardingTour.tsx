import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
  Brain,
  Target
} from "lucide-react";

interface TourStep {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to AmalSense",
    titleAr: "مرحباً بك في أمالسنس",
    description: "AmalSense is a revolutionary platform that analyzes collective emotions from digital sources worldwide. Let's take a quick tour!",
    descriptionAr: "أمالسنس هي منصة ثورية تحلل المشاعر الجماعية من المصادر الرقمية حول العالم. دعنا نأخذ جولة سريعة!",
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
  },
  {
    title: "Three Core Indices",
    titleAr: "ثلاثة مؤشرات أساسية",
    description: "GMI (General Mood Index), CFI (Collective Fear Index), and HRI (Hope & Resilience Index) - our unique emotional metrics.",
    descriptionAr: "GMI (مؤشر المزاج العام)، CFI (مؤشر الخوف الجماعي)، HRI (مؤشر الأمل والمرونة) - مقاييسنا العاطفية الفريدة.",
    icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    highlight: "dashboard",
  },
  {
    title: "Interactive World Map",
    titleAr: "خريطة العالم التفاعلية",
    description: "Explore emotional states across 25+ countries. Click any country to see detailed emotion analysis.",
    descriptionAr: "استكشف الحالات العاطفية عبر أكثر من 25 دولة. انقر على أي دولة لرؤية تحليل المشاعر التفصيلي.",
    icon: <Globe className="w-8 h-8 text-green-400" />,
    highlight: "map",
  },
  {
    title: "Real-Time Analysis",
    titleAr: "التحليل في الوقت الحقيقي",
    description: "Analyze news headlines and social media posts instantly using our AI-powered emotion engine.",
    descriptionAr: "حلل عناوين الأخبار ومنشورات وسائل التواصل فوراً باستخدام محرك المشاعر المدعوم بالذكاء الاصطناعي.",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    highlight: "analyzer",
  },
  {
    title: "DCFT Theory",
    titleAr: "نظرية DCFT",
    description: "Learn about the Digital Consciousness Field Theory - the scientific foundation behind AmalSense.",
    descriptionAr: "تعرف على نظرية مجال الوعي الرقمي - الأساس العلمي وراء أمالسنس.",
    icon: <Brain className="w-8 h-8 text-pink-400" />,
    highlight: "theory",
  },
  {
    title: "You're Ready!",
    titleAr: "أنت جاهز!",
    description: "Start exploring the emotional pulse of humanity. Upgrade to Pro for unlimited access and advanced features.",
    descriptionAr: "ابدأ باستكشاف النبض العاطفي للبشرية. قم بالترقية إلى Pro للوصول غير المحدود والميزات المتقدمة.",
    icon: <Target className="w-8 h-8 text-purple-400" />,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  language?: "en" | "ar";
}

export default function OnboardingTour({ onComplete, language = "en" }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const isArabic = language === "ar";
  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("amalsense_onboarding_complete", "true");
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 bg-slate-900/95 border-purple-500/30 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <CardContent className="p-6">
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step Content */}
          <div className={`text-center ${isArabic ? "rtl" : "ltr"}`}>
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                {step.icon}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {isArabic ? step.titleAr : step.title}
            </h2>

            {/* Description */}
            <p className="text-slate-300 mb-6 leading-relaxed">
              {isArabic ? step.descriptionAr : step.description}
            </p>

            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-purple-500"
                      : index < currentStep
                      ? "bg-purple-500/50"
                      : "bg-slate-600"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {isArabic ? "السابق" : "Previous"}
              </Button>

              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-300"
              >
                {isArabic ? "تخطي" : "Skip Tour"}
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                {currentStep === tourSteps.length - 1 
                  ? (isArabic ? "ابدأ الآن" : "Get Started")
                  : (isArabic ? "التالي" : "Next")
                }
                {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("amalsense_onboarding_complete");
    if (!completed) {
      // Delay showing tour to let page load
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const resetTour = () => {
    localStorage.removeItem("amalsense_onboarding_complete");
    setShowTour(true);
  };

  return { showTour, setShowTour, resetTour };
}
