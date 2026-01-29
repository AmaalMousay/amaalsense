import React from 'react';
import { EMOTION_COLORS, GMI_COLORS, CFI_COLORS, HRI_COLORS } from '@shared/emotionColors';
import { useI18n } from '@/i18n';

interface EmotionLegendProps {
  variant?: 'compact' | 'full';
  showIndices?: boolean;
}

/**
 * Unified Emotion Color Legend Component
 * Displays the psychological meaning of each color used in AmalSense
 */
export function EmotionLegend({ variant = 'compact', showIndices = false }: EmotionLegendProps) {
  const { t, language } = useI18n();

  const emotionItems = [
    { 
      color: EMOTION_COLORS.anger, 
      label: language === 'ar' ? 'غضب / توتر' : 'Anger / Tension',
      keywords: ['anger', 'crisis', 'conflict']
    },
    { 
      color: EMOTION_COLORS.fear, 
      label: language === 'ar' ? 'خوف / قلق' : 'Fear / Anxiety',
      keywords: ['fear', 'anxiety']
    },
    { 
      color: EMOTION_COLORS.curiosity, 
      label: language === 'ar' ? 'فضول / ترقب' : 'Curiosity / Uncertainty',
      keywords: ['curiosity', 'uncertainty']
    },
    { 
      color: EMOTION_COLORS.hope, 
      label: language === 'ar' ? 'أمل / توازن' : 'Hope / Balance',
      keywords: ['hope', 'resilience', 'balance']
    },
    { 
      color: EMOTION_COLORS.calm, 
      label: language === 'ar' ? 'هدوء / استقرار' : 'Calm / Stability',
      keywords: ['calm', 'neutrality']
    },
    { 
      color: EMOTION_COLORS.sadness, 
      label: language === 'ar' ? 'حزن / فقدان' : 'Sadness / Grief',
      keywords: ['sadness', 'grief']
    },
  ];

  const indexItems = [
    {
      name: 'GMI',
      fullName: language === 'ar' ? 'مؤشر المزاج العام' : 'Global Mood Index',
      colors: [
        { color: GMI_COLORS.negative, label: language === 'ar' ? 'سلبي' : 'Negative' },
        { color: GMI_COLORS.neutral, label: language === 'ar' ? 'محايد' : 'Neutral' },
        { color: GMI_COLORS.positive, label: language === 'ar' ? 'إيجابي' : 'Positive' },
      ]
    },
    {
      name: 'CFI',
      fullName: language === 'ar' ? 'مؤشر الخوف الجماعي' : 'Collective Fear Index',
      colors: [
        { color: CFI_COLORS.low, label: language === 'ar' ? 'منخفض' : 'Low' },
        { color: CFI_COLORS.medium, label: language === 'ar' ? 'متوسط' : 'Medium' },
        { color: CFI_COLORS.high, label: language === 'ar' ? 'مرتفع' : 'High' },
      ]
    },
    {
      name: 'HRI',
      fullName: language === 'ar' ? 'مؤشر الأمل والمرونة' : 'Hope & Resilience Index',
      colors: [
        { color: HRI_COLORS.low, label: language === 'ar' ? 'ضعيف' : 'Low' },
        { color: HRI_COLORS.medium, label: language === 'ar' ? 'جيد' : 'Good' },
        { color: HRI_COLORS.high, label: language === 'ar' ? 'قوي' : 'Strong' },
      ]
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 py-4 text-xs text-muted-foreground">
        <span className="font-medium">
          {language === 'ar' ? 'دليل الألوان:' : 'Color Guide:'}
        </span>
        {emotionItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-card/50 border border-border/50">
      <h4 className="text-lg font-semibold mb-4">
        {language === 'ar' ? 'دليل الألوان العاطفية' : 'Emotion Color Guide'}
      </h4>
      
      {/* Emotion Colors */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-muted-foreground mb-3">
          {language === 'ar' ? 'المشاعر الأساسية' : 'Core Emotions'}
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emotionItems.map((item) => (
            <div 
              key={item.label} 
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm" style={{ color: item.color }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Index Colors */}
      {showIndices && (
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-3">
            {language === 'ar' ? 'المؤشرات الثلاثة' : 'Key Indicators'}
          </h5>
          <div className="space-y-4">
            {indexItems.map((index) => (
              <div key={index.name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent/20 text-accent">
                    {index.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {index.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {index.colors.map((c, i) => (
                    <React.Fragment key={c.label}>
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-xs" style={{ color: c.color }}>
                          {c.label}
                        </span>
                      </div>
                      {i < index.colors.length - 1 && (
                        <span className="text-muted-foreground mx-1">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Footer Legend - Compact version for page footers
 */
export function FooterLegend() {
  const { language } = useI18n();
  
  return (
    <div className="border-t border-border/30 pt-6 mt-6">
      <EmotionLegend variant="compact" />
      <p className="text-center text-xs text-muted-foreground/60 mt-2">
        {language === 'ar' 
          ? 'الألوان تعكس المعاني النفسية للمشاعر الجماعية'
          : 'Colors reflect the psychological meaning of collective emotions'}
      </p>
    </div>
  );
}
