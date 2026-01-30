import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Search, Users, MapPin, TrendingUp, TrendingDown, Minus, Globe, ChevronDown } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { EMOTION_COLORS, getEmotionColor } from '@shared/emotionColors';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { FooterLegend } from '@/components/EmotionLegend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Country list for selection
const COUNTRIES = [
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية' },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات' },
  { code: 'US', name: 'United States', nameAr: 'أمريكا' },
  { code: 'GB', name: 'United Kingdom', nameAr: 'بريطانيا' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين' },
  { code: 'OM', name: 'Oman', nameAr: 'عمان' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان' },
];

export default function Analyzer() {
  const [, navigate] = useLocation();
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t, isRTL, language } = useI18n();
  
  // Advanced analysis state
  const [analysisMode, setAnalysisMode] = useState<'simple' | 'advanced'>('simple');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [topicResult, setTopicResult] = useState<any>(null);
  const [isTopicLoading, setIsTopicLoading] = useState(false);

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

  const analyzeTopicInCountry = trpc.topic.analyzeTopicInCountry.useMutation({
    onSuccess: (data) => {
      setTopicResult(data);
      setIsTopicLoading(false);
      toast.success(language === 'ar' ? 'اكتمل تحليل الموضوع!' : 'Topic analysis complete!');
    },
    onError: (error) => {
      setIsTopicLoading(false);
      toast.error(language === 'ar' ? 'فشل تحليل الموضوع' : 'Failed to analyze topic');
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

  const handleTopicAnalysis = async () => {
    if (!topic.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال موضوع' : 'Please enter a topic');
      return;
    }
    if (!selectedCountry) {
      toast.error(language === 'ar' ? 'يرجى اختيار دولة' : 'Please select a country');
      return;
    }

    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (!country) return;

    // Navigate to results page with parameters
    const countryName = language === 'ar' ? country.nameAr : country.name;
    const params = new URLSearchParams({
      topic,
      country: selectedCountry,
      countryName,
      timeRange,
    });
    navigate(`/analysis-results?${params.toString()}`);
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

  // Example topics
  const exampleTopics = language === 'ar' ? [
    'أسعار الوقود',
    'التعليم عن بعد',
    'الانتخابات',
    'كأس العالم',
  ] : [
    'Fuel prices',
    'Remote education',
    'Elections',
    'World Cup',
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
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold cosmic-text mb-4">{t.analyzer.title}</h2>
            <p className="text-muted-foreground">
              {t.analyzer.subtitle}
            </p>
          </div>

          {/* Analysis Mode Tabs */}
          <Tabs value={analysisMode} onValueChange={(v) => setAnalysisMode(v as 'simple' | 'advanced')} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {language === 'ar' ? 'تحليل بسيط' : 'Simple Analysis'}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {language === 'ar' ? 'تحليل متقدم' : 'Advanced Analysis'}
              </TabsTrigger>
            </TabsList>

            {/* Simple Analysis Tab */}
            <TabsContent value="simple" className="mt-8">
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

              {/* Simple Results Section */}
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

                  {/* Hybrid Fusion Info */}
                  {result.fusion && (
                    <Card className="cosmic-card p-6">
                      <h3 className="text-lg font-bold cosmic-text mb-4">
                        {language === 'ar' ? 'تفاصيل المحرك الهجين' : 'Hybrid Engine Details'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">DCFT</p>
                          <p className="text-2xl font-bold text-accent">{Math.round(result.fusion.dcftContribution * 100)}%</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">AI</p>
                          <p className="text-2xl font-bold text-primary">{Math.round(result.fusion.aiContribution * 100)}%</p>
                        </div>
                      </div>
                    </Card>
                  )}

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
            </TabsContent>

            {/* Advanced Analysis Tab */}
            <TabsContent value="advanced" className="mt-8">
              {/* Advanced Input Section */}
              <Card className="cosmic-card p-8 mb-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold cosmic-text flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {language === 'ar' ? 'تحليل موضوع في دولة محددة' : 'Analyze Topic in Specific Country'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country Selection */}
                    <div>
                      <label className="text-sm font-medium cosmic-text mb-2 block">
                        {language === 'ar' ? 'اختر الدولة' : 'Select Country'}
                      </label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={language === 'ar' ? 'اختر دولة...' : 'Choose a country...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {language === 'ar' ? country.nameAr : country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time Range */}
                    <div>
                      <label className="text-sm font-medium cosmic-text mb-2 block">
                        {language === 'ar' ? 'الفترة الزمنية' : 'Time Range'}
                      </label>
                      <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">{language === 'ar' ? 'آخر يوم' : 'Last Day'}</SelectItem>
                          <SelectItem value="week">{language === 'ar' ? 'آخر أسبوع' : 'Last Week'}</SelectItem>
                          <SelectItem value="month">{language === 'ar' ? 'آخر شهر' : 'Last Month'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div>
                    <label className="text-sm font-medium cosmic-text mb-2 block">
                      {language === 'ar' ? 'الموضوع أو الكلمة المفتاحية' : 'Topic or Keyword'}
                    </label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTopicAnalysis()}
                      placeholder={language === 'ar' ? 'مثال: أسعار الوقود، الانتخابات، كأس العالم...' : 'e.g., Fuel prices, Elections, World Cup...'}
                      className="w-full text-base"
                      disabled={isTopicLoading}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>

                  {/* Example Topics */}
                  <div className="flex flex-wrap gap-2">
                    {exampleTopics.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTopic(t)}
                        className="px-3 py-1 text-sm bg-accent/20 hover:bg-accent/30 rounded-full transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleTopicAnalysis}
                    disabled={isTopicLoading || !topic.trim() || !selectedCountry}
                    className="glow-button text-white w-full py-6 text-lg"
                  >
                    {isTopicLoading 
                      ? (language === 'ar' ? 'جاري التحليل...' : 'Analyzing...') 
                      : (language === 'ar' ? 'تحليل الموضوع' : 'Analyze Topic')}
                  </Button>
                </div>
              </Card>

              {/* Advanced Results Section */}
              {topicResult && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Topic Summary */}
                  <Card className="cosmic-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold cosmic-text">{topicResult.topic}</h3>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? `في ${topicResult.countryName}` : `in ${topicResult.countryName}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'حجم العينة' : 'Sample Size'}
                        </p>
                        <p className="text-xl font-bold">{topicResult.sampleSize.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Overall Support/Opposition */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-green-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'مؤيدون' : 'Support'}
                        </p>
                        <p className="text-3xl font-bold text-green-500">{topicResult.overallSupport}%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-500/20 rounded-lg">
                        <Minus className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'محايدون' : 'Neutral'}
                        </p>
                        <p className="text-3xl font-bold text-gray-500">{topicResult.overallNeutral}%</p>
                      </div>
                      <div className="text-center p-4 bg-red-500/20 rounded-lg">
                        <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-500" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'معارضون' : 'Opposition'}
                        </p>
                        <p className="text-3xl font-bold text-red-500">{topicResult.overallOpposition}%</p>
                      </div>
                    </div>
                  </Card>

                  {/* DCFT Indices */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                      {language === 'ar' ? 'مؤشرات DCFT' : 'DCFT Indices'}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">GMI</p>
                        <p className={`text-2xl font-bold ${topicResult.gmi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {topicResult.gmi > 0 ? '+' : ''}{topicResult.gmi}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">CFI</p>
                        <p className="text-2xl font-bold text-orange-500">{topicResult.cfi}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">HRI</p>
                        <p className="text-2xl font-bold text-cyan-500">{topicResult.hri}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Demographic Breakdown */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {language === 'ar' ? 'التحليل حسب الفئة العمرية' : 'Analysis by Age Group'}
                    </h3>
                    <div className="space-y-4">
                      {topicResult.demographics.map((demo: any) => (
                        <div key={demo.ageGroup} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-semibold cosmic-text">
                                {language === 'ar' ? demo.label : demo.labelEn}
                              </span>
                              <span className="text-sm text-muted-foreground ms-2">({demo.range})</span>
                            </div>
                            <span 
                              className="px-2 py-1 rounded text-sm"
                              style={{ backgroundColor: getEmotionColor(demo.dominantEmotion), color: 'white' }}
                            >
                              {getEmotionName(demo.dominantEmotion)}
                            </span>
                          </div>
                          
                          {/* Support/Opposition Bar */}
                          <div className="flex h-6 rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                              style={{ width: `${demo.support}%` }}
                            >
                              {demo.support > 15 && `${demo.support}%`}
                            </div>
                            <div 
                              className="bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
                              style={{ width: `${demo.neutral}%` }}
                            >
                              {demo.neutral > 15 && `${demo.neutral}%`}
                            </div>
                            <div 
                              className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                              style={{ width: `${demo.opposition}%` }}
                            >
                              {demo.opposition > 15 && `${demo.opposition}%`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Regional Breakdown */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {language === 'ar' ? 'التحليل حسب المنطقة' : 'Analysis by Region'}
                    </h3>
                    
                    {/* Top Supporting Regions */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-green-500 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {language === 'ar' ? 'المناطق الأكثر تأييداً' : 'Most Supporting Regions'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topicResult.topSupportingRegions.map((region: any, idx: number) => (
                          <div key={region.regionCode} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {language === 'ar' ? region.regionNameAr : region.regionName}
                              </span>
                              <span className="text-green-500 font-bold">{region.support}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'ar' ? 'السكان:' : 'Pop:'} {region.population.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Opposing Regions */}
                    <div>
                      <h4 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        {language === 'ar' ? 'المناطق الأكثر معارضة' : 'Most Opposing Regions'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topicResult.topOpposingRegions.map((region: any, idx: number) => (
                          <div key={region.regionCode} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {language === 'ar' ? region.regionNameAr : region.regionName}
                              </span>
                              <span className="text-red-500 font-bold">{region.opposition}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'ar' ? 'السكان:' : 'Pop:'} {region.population.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* All Regions Table */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4">
                      {language === 'ar' ? 'جميع المناطق' : 'All Regions'}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-start p-2">{language === 'ar' ? 'المنطقة' : 'Region'}</th>
                            <th className="text-center p-2">{language === 'ar' ? 'تأييد' : 'Support'}</th>
                            <th className="text-center p-2">{language === 'ar' ? 'محايد' : 'Neutral'}</th>
                            <th className="text-center p-2">{language === 'ar' ? 'معارضة' : 'Opposition'}</th>
                            <th className="text-center p-2">GMI</th>
                            <th className="text-center p-2">{language === 'ar' ? 'الشعور السائد' : 'Dominant'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topicResult.regions.map((region: any) => (
                            <tr key={region.regionCode} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="p-2 font-medium">
                                {language === 'ar' ? region.regionNameAr : region.regionName}
                              </td>
                              <td className="text-center p-2 text-green-500">{region.support}%</td>
                              <td className="text-center p-2 text-gray-500">{region.neutral}%</td>
                              <td className="text-center p-2 text-red-500">{region.opposition}%</td>
                              <td className={`text-center p-2 ${region.gmi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {region.gmi > 0 ? '+' : ''}{region.gmi}
                              </td>
                              <td className="text-center p-2">
                                <span 
                                  className="px-2 py-1 rounded text-xs"
                                  style={{ backgroundColor: getEmotionColor(region.dominantEmotion), color: 'white' }}
                                >
                                  {getEmotionName(region.dominantEmotion)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* New Analysis Button */}
                  <Button
                    onClick={() => {
                      setTopic('');
                      setTopicResult(null);
                    }}
                    variant="outline"
                    className="w-full py-6"
                  >
                    {language === 'ar' ? 'تحليل موضوع آخر' : 'Analyze Another Topic'}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
