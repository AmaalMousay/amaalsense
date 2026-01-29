import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { EMOTION_COLORS, getEmotionColor } from '@shared/emotionColors';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { FooterLegend } from '@/components/EmotionLegend';

export default function Analyzer() {
  const [, navigate] = useLocation();
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t, isRTL, language } = useI18n();

  const analyzeHeadline = trpc.emotion.analyzeHeadline.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsLoading(false);
      toast.success(language === 'ar' ? 'اكتمل تحليل المشاعر!' : 'Emotion analysis complete!');
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(language === 'ar' ? 'فشل تحليل العنوان' : 'Failed to analyze headline');
    },
  });

  const handleAnalyze = async () => {
    if (!headline.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال عنوان' : 'Please enter a headline');
      return;
    }

    setIsLoading(true);
    analyzeHeadline.mutate({ headline });
  };

  // Use unified emotion color system
  const getEmotionStyle = (emotion: string) => {
    const color = getEmotionColor(emotion);
    return { backgroundColor: color };
  };

  // Translate emotion names
  const getEmotionName = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      joy: t.emotions.joy,
      fear: t.emotions.fear,
      anger: t.emotions.anger,
      sadness: t.emotions.sadness,
      hope: t.emotions.hope,
      curiosity: t.emotions.curiosity,
    };
    return emotionMap[emotion] || emotion;
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  // Example headlines based on language
  const exampleHeadlines = language === 'ar' ? [
    'علماء يكتشفون اختراقاً في تكنولوجيا الطاقة المتجددة',
    'الأسواق العالمية تواجه حالة عدم يقين غير مسبوقة',
    'المجتمع يحتفل بانتصار تاريخي في حركة العدالة الاجتماعية',
    'باحثون يحذرون من تسارع محتمل لأزمة المناخ',
  ] : [
    'Scientists discover breakthrough in renewable energy technology',
    'Global markets face unprecedented uncertainty amid economic concerns',
    'Community celebrates historic victory in social justice movement',
    'Researchers warn of potential climate crisis acceleration',
  ];

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <BackArrow className="w-5 h-5" />
            <span>{t.common.back}</span>
          </button>
          <div className="flex items-center gap-2">
            <LogoIcon size="md" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold cosmic-text mb-4">{t.analyzer.title}</h2>
            <p className="text-muted-foreground">
              {t.analyzer.subtitle}
            </p>
          </div>

          {/* Input Section */}
          <Card className="cosmic-card p-8 mb-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium cosmic-text mb-2 block">
                  {language === 'ar' ? 'العنوان الإخباري' : 'News Headline'}
                </span>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder={t.analyzer.placeholder}
                  className="w-full text-base"
                  disabled={isLoading}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </label>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !headline.trim()}
                className="glow-button text-white w-full py-6 text-lg"
              >
                {isLoading ? t.analyzer.analyzing : t.analyzer.analyze}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          {result && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Analyzed Headline */}
              <Card className="cosmic-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {language === 'ar' ? 'العنوان المحلل' : 'Analyzed Headline'}
                </h3>
                <p className="text-lg font-semibold cosmic-text">{result.headline}</p>
              </Card>

              {/* Emotion Vectors */}
              <div>
                <h3 className="text-xl font-bold cosmic-text mb-6">{t.analyzer.emotionVector}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.emotions).map(([emotion, score]: [string, any]) => (
                    <Card key={emotion} className="cosmic-card p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold cosmic-text">
                            {getEmotionName(emotion)}
                          </span>
                          <span className="text-2xl font-bold gradient-text">
                            {score.toFixed(0)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 rounded-full"
                            style={{ 
                              width: `${score}%`,
                              backgroundColor: getEmotionColor(emotion)
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Analysis Summary */}
              <Card className="cosmic-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t.analyzer.dominantEmotion}</p>
                    <p className="text-2xl font-bold gradient-text">
                      {getEmotionName(result.dominantEmotion)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t.analyzer.confidence}</p>
                    <p className="text-2xl font-bold cosmic-text">{result.confidence}%</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t.analyzer.model}</p>
                    <p className="text-2xl font-bold cosmic-text capitalize">{result.model}</p>
                  </div>
                </div>
              </Card>

              {/* New Analysis Button */}
              <Button
                onClick={() => {
                  setHeadline('');
                  setResult(null);
                }}
                variant="outline"
                className="w-full py-6"
              >
                {language === 'ar' ? 'تحليل عنوان آخر' : 'Analyze Another Headline'}
              </Button>
            </div>
          )}

          {/* Example Headlines */}
          {!result && (
            <div className="mt-12">
              <h3 className="text-lg font-bold cosmic-text mb-4">
                {language === 'ar' ? 'جرب هذه الأمثلة:' : 'Try These Examples:'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleHeadlines.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeadline(example)}
                    className="cosmic-card p-4 text-left hover:border-accent transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <p className="text-sm text-muted-foreground">{example}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Legend */}
      <footer className="border-t border-border/50 py-6">
        <div className="container">
          <FooterLegend />
        </div>
      </footer>
    </div>
  );
}
