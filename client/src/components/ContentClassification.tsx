import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { 
  Building2, 
  TrendingUp, 
  Brain, 
  Stethoscope, 
  GraduationCap, 
  Users, 
  Gamepad2, 
  Newspaper,
  AlertTriangle,
  Shield,
  Info
} from 'lucide-react';

// Content Domain Types
export type ContentDomain = 
  | 'politics' 
  | 'economy' 
  | 'mental_health' 
  | 'medical' 
  | 'education' 
  | 'society' 
  | 'entertainment' 
  | 'general_news';

// Sensitivity Levels
export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';

// Domain Configuration
export const CONTENT_DOMAINS: {
  id: ContentDomain;
  icon: React.ComponentType<any>;
  labelEn: string;
  labelAr: string;
  sensitivity: SensitivityLevel;
  color: string;
  examples: { en: string; ar: string }[];
}[] = [
  {
    id: 'politics',
    icon: Building2,
    labelEn: 'Politics',
    labelAr: 'سياسة',
    sensitivity: 'high',
    color: '#E63946',
    examples: [
      { en: 'Elections, laws, governments', ar: 'انتخابات، قوانين، حكومات' }
    ]
  },
  {
    id: 'economy',
    icon: TrendingUp,
    labelEn: 'Economy',
    labelAr: 'اقتصاد',
    sensitivity: 'medium',
    color: '#F4A261',
    examples: [
      { en: 'Inflation, markets, jobs', ar: 'تضخم، أسواق، وظائف' }
    ]
  },
  {
    id: 'mental_health',
    icon: Brain,
    labelEn: 'Mental Health',
    labelAr: 'صحة نفسية',
    sensitivity: 'high',
    color: '#8D5CF6',
    examples: [
      { en: 'Depression, anxiety', ar: 'اكتئاب، قلق' }
    ]
  },
  {
    id: 'medical',
    icon: Stethoscope,
    labelEn: 'Medical',
    labelAr: 'طب',
    sensitivity: 'critical',
    color: '#DC2626',
    examples: [
      { en: 'Diseases, medications', ar: 'أمراض، أدوية' }
    ]
  },
  {
    id: 'education',
    icon: GraduationCap,
    labelEn: 'Education',
    labelAr: 'تعليم',
    sensitivity: 'medium',
    color: '#2A9D8F',
    examples: [
      { en: 'Curricula, students', ar: 'مناهج، طلاب' }
    ]
  },
  {
    id: 'society',
    icon: Users,
    labelEn: 'Society',
    labelAr: 'مجتمع',
    sensitivity: 'medium',
    color: '#457B9D',
    examples: [
      { en: 'Public opinion issues', ar: 'قضايا رأي عام' }
    ]
  },
  {
    id: 'entertainment',
    icon: Gamepad2,
    labelEn: 'Entertainment',
    labelAr: 'ترفيه',
    sensitivity: 'low',
    color: '#10B981',
    examples: [
      { en: 'Movies, celebrities', ar: 'أفلام، مشاهير' }
    ]
  },
  {
    id: 'general_news',
    icon: Newspaper,
    labelEn: 'General News',
    labelAr: 'أخبار عامة',
    sensitivity: 'medium',
    color: '#6B7280',
    examples: [
      { en: 'Disasters, events', ar: 'كوارث، أحداث' }
    ]
  }
];

// Sensitivity Level Configuration
export const SENSITIVITY_LEVELS: {
  level: SensitivityLevel;
  labelEn: string;
  labelAr: string;
  color: string;
  bgColor: string;
  description: { en: string; ar: string };
}[] = [
  {
    level: 'low',
    labelEn: 'Low',
    labelAr: 'منخفض',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    description: { 
      en: 'Entertainment, celebrities', 
      ar: 'ترفيه، مشاهير' 
    }
  },
  {
    level: 'medium',
    labelEn: 'Medium',
    labelAr: 'متوسط',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    description: { 
      en: 'Economy, education', 
      ar: 'اقتصاد، تعليم' 
    }
  },
  {
    level: 'high',
    labelEn: 'High',
    labelAr: 'عالي',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.2)',
    description: { 
      en: 'Politics, mental health', 
      ar: 'سياسة، صحة نفسية' 
    }
  },
  {
    level: 'critical',
    labelEn: 'Critical',
    labelAr: 'حرج',
    color: '#DC2626',
    bgColor: 'rgba(220, 38, 38, 0.3)',
    description: { 
      en: 'Medical, epidemics', 
      ar: 'طب، أوبئة' 
    }
  }
];

// Get sensitivity config
export const getSensitivityConfig = (level: SensitivityLevel) => {
  return SENSITIVITY_LEVELS.find(s => s.level === level) || SENSITIVITY_LEVELS[0];
};

// Get domain config
export const getDomainConfig = (domain: ContentDomain) => {
  return CONTENT_DOMAINS.find(d => d.id === domain);
};

// Content Domain Selector Component
interface ContentDomainSelectorProps {
  value: ContentDomain | '';
  onChange: (domain: ContentDomain) => void;
  disabled?: boolean;
}

export function ContentDomainSelector({ value, onChange, disabled }: ContentDomainSelectorProps) {
  const { language } = useI18n();
  
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium cosmic-text block">
        {language === 'ar' ? 'نوع الموضوع' : 'Topic Type'}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CONTENT_DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isSelected = value === domain.id;
          const sensitivity = getSensitivityConfig(domain.sensitivity);
          
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onChange(domain.id)}
              disabled={disabled}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${isSelected 
                  ? 'border-accent bg-accent/20' 
                  : 'border-border/50 hover:border-accent/50 bg-muted/30'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" style={{ color: domain.color }} />
                <span className="text-sm font-medium cosmic-text">
                  {language === 'ar' ? domain.labelAr : domain.labelEn}
                </span>
              </div>
              <div 
                className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{ 
                  backgroundColor: sensitivity.bgColor,
                  color: sensitivity.color
                }}
              >
                {language === 'ar' ? sensitivity.labelAr : sensitivity.labelEn}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Sensitivity Level Indicator Component
interface SensitivityIndicatorProps {
  level: SensitivityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SensitivityIndicator({ level, showLabel = true, size = 'md' }: SensitivityIndicatorProps) {
  const { language } = useI18n();
  const config = getSensitivityConfig(level);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };
  
  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: config.bgColor,
        color: config.color
      }}
    >
      {level === 'critical' && <AlertTriangle className="w-3 h-3" />}
      {level === 'high' && <Shield className="w-3 h-3" />}
      {showLabel && (language === 'ar' ? config.labelAr : config.labelEn)}
    </div>
  );
}

// Emotional Risk Meter Component
interface EmotionalRiskMeterProps {
  domain: ContentDomain;
  emotionIntensity?: number; // 0-100
  showDetails?: boolean;
}

export function EmotionalRiskMeter({ domain, emotionIntensity = 50, showDetails = true }: EmotionalRiskMeterProps) {
  const { language } = useI18n();
  const domainConfig = getDomainConfig(domain);
  
  if (!domainConfig) return null;
  
  const sensitivity = getSensitivityConfig(domainConfig.sensitivity);
  
  // Calculate risk level based on domain sensitivity and emotion intensity
  const getRiskLevel = (): { level: string; color: string; labelEn: string; labelAr: string } => {
    const baseRisk = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    }[domainConfig.sensitivity];
    
    const intensityFactor = emotionIntensity / 100;
    const totalRisk = baseRisk * (0.5 + intensityFactor * 0.5);
    
    if (totalRisk <= 1.5) return { level: 'low', color: '#10B981', labelEn: 'Low Risk', labelAr: 'خطر منخفض' };
    if (totalRisk <= 2.5) return { level: 'medium', color: '#F59E0B', labelEn: 'Medium Risk', labelAr: 'خطر متوسط' };
    if (totalRisk <= 3.5) return { level: 'high', color: '#EF4444', labelEn: 'High Risk', labelAr: 'خطر عالي' };
    return { level: 'critical', color: '#DC2626', labelEn: 'Critical Risk', labelAr: 'خطر حرج' };
  };
  
  const risk = getRiskLevel();
  
  return (
    <Card className="cosmic-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium cosmic-text flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {language === 'ar' ? 'مقياس المخاطر العاطفية' : 'Emotional Risk Meter'}
        </h4>
        <SensitivityIndicator level={domainConfig.sensitivity} size="sm" />
      </div>
      
      {/* Risk Gauge */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className="absolute inset-0 flex"
        >
          <div className="flex-1 bg-green-500/30" />
          <div className="flex-1 bg-yellow-500/30" />
          <div className="flex-1 bg-orange-500/30" />
          <div className="flex-1 bg-red-500/30" />
        </div>
        <div 
          className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
          style={{ 
            left: `${Math.min(95, (emotionIntensity / 100) * 100)}%`,
          }}
        />
      </div>
      
      {/* Risk Level Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: risk.color }}
          />
          <span className="font-semibold" style={{ color: risk.color }}>
            {language === 'ar' ? risk.labelAr : risk.labelEn}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {emotionIntensity}%
        </span>
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {language === 'ar' 
              ? `التصنيف: ${domainConfig.labelAr} | الحساسية: ${sensitivity.labelAr}`
              : `Domain: ${domainConfig.labelEn} | Sensitivity: ${sensitivity.labelEn}`
            }
          </p>
        </div>
      )}
    </Card>
  );
}

// Disclaimer Component
interface DisclaimerProps {
  domain?: ContentDomain;
  compact?: boolean;
}

export function Disclaimer({ domain, compact = false }: DisclaimerProps) {
  const { language } = useI18n();
  const domainConfig = domain ? getDomainConfig(domain) : null;
  
  const getDisclaimerText = () => {
    if (language === 'ar') {
      if (domainConfig?.sensitivity === 'critical' || domainConfig?.sensitivity === 'high') {
        return 'تنبيه: هذا التحليل إحصائي فقط ولا يُعد تشخيصاً طبياً أو توصية سياسية. يرجى استشارة المختصين.';
      }
      return 'AmalSense لا يقدم تشخيص طبي ولا توصيات سياسية، بل تحليل إحصائي لمشاعر جماعية.';
    }
    
    if (domainConfig?.sensitivity === 'critical' || domainConfig?.sensitivity === 'high') {
      return 'Warning: This is a statistical analysis only and does not constitute medical diagnosis or political advice. Please consult specialists.';
    }
    return 'AmalSense does not provide medical diagnosis or political recommendations, but statistical analysis of collective emotions.';
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Info className="w-3 h-3" />
        <span>{getDisclaimerText()}</span>
      </div>
    );
  }
  
  const showWarning = domainConfig?.sensitivity === 'critical' || domainConfig?.sensitivity === 'high';
  
  return (
    <Card className={`p-4 ${showWarning ? 'border-orange-500/50 bg-orange-500/10' : 'bg-muted/30'}`}>
      <div className="flex items-start gap-3">
        {showWarning ? (
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        ) : (
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className={`text-sm ${showWarning ? 'text-orange-200' : 'text-muted-foreground'}`}>
            {getDisclaimerText()}
          </p>
          {showWarning && (
            <p className="text-xs text-orange-300/70 mt-2">
              {language === 'ar' 
                ? 'المحتوى المحلل يتعلق بموضوع حساس. النتائج للأغراض المعلوماتية فقط.'
                : 'The analyzed content relates to a sensitive topic. Results are for informational purposes only.'
              }
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// Analysis Classification Badge
interface ClassificationBadgeProps {
  domain: ContentDomain;
  sensitivity: SensitivityLevel;
}

export function ClassificationBadge({ domain, sensitivity }: ClassificationBadgeProps) {
  const { language } = useI18n();
  const domainConfig = getDomainConfig(domain);
  const sensitivityConfig = getSensitivityConfig(sensitivity);
  
  if (!domainConfig) return null;
  
  const Icon = domainConfig.icon;
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
      <Icon className="w-4 h-4" style={{ color: domainConfig.color }} />
      <span className="text-sm font-medium cosmic-text">
        {language === 'ar' ? domainConfig.labelAr : domainConfig.labelEn}
      </span>
      <span className="text-muted-foreground">|</span>
      <span 
        className="text-xs font-medium"
        style={{ color: sensitivityConfig.color }}
      >
        {language === 'ar' ? sensitivityConfig.labelAr : sensitivityConfig.labelEn}
      </span>
    </div>
  );
}
