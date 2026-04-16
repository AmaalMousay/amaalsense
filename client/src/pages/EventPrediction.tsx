import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import {
  ArrowLeft, Sparkles, AlertTriangle, TrendingUp, TrendingDown,
  Building2, DollarSign, Users, Heart, Clock, Target, Zap,
  BarChart3, Shield, Brain, Activity
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell
} from 'recharts';

const SEVERITY_COLORS = {
  low: '#2A9D8F',
  medium: '#F4A261',
  high: '#E63946',
  extreme: '#7C1D1D',
};

const CATEGORY_OPTIONS = [
  { value: 'conflict', label: { en: 'Conflict / War', ar: 'صراع / حرب' } },
  { value: 'economic', label: { en: 'Economic Crisis', ar: 'أزمة اقتصادية' } },
  { value: 'political', label: { en: 'Political Change', ar: 'تغيير سياسي' } },
  { value: 'social', label: { en: 'Social Movement', ar: 'حركة اجتماعية' } },
  { value: 'environmental', label: { en: 'Environmental Disaster', ar: 'كارثة بيئية' } },
  { value: 'health', label: { en: 'Health Crisis / Pandemic', ar: 'أزمة صحية / جائحة' } },
  { value: 'technological', label: { en: 'Technological Breakthrough', ar: 'اختراق تكنولوجي' } },
  { value: 'humanitarian', label: { en: 'Humanitarian Crisis', ar: 'أزمة إنسانية' } },
];

const SEVERITY_OPTIONS = [
  { value: 'low', label: { en: 'Low', ar: 'منخفض' } },
  { value: 'medium', label: { en: 'Medium', ar: 'متوسط' } },
  { value: 'high', label: { en: 'High', ar: 'مرتفع' } },
  { value: 'extreme', label: { en: 'Extreme', ar: 'شديد جداً' } },
];

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const color = confidence >= 70 ? '#2A9D8F' : confidence >= 40 ? '#F4A261' : '#E63946';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${confidence}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{confidence}%</span>
    </div>
  );
}

function ScenarioCard({ title, icon: Icon, scenario, color, isRTL }: {
  title: string; icon: any; scenario: any; color: string; isRTL: boolean;
}) {
  return (
    <Card className="p-4 border-t-4" style={{ borderTopColor: color }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-sm font-semibold" style={{ color }}>{title}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{scenario.name}</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-xs text-muted-foreground">GMI</div>
          <div className="text-sm font-bold">{scenario.gmi}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">CFI</div>
          <div className="text-sm font-bold">{scenario.cfi}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">HRI</div>
          <div className="text-sm font-bold">{scenario.hri}</div>
        </div>
      </div>
    </Card>
  );
}

export default function EventPrediction() {
  const { language } = useI18n();
  const isRTL = language === 'ar';
  const [, navigate] = useLocation();

  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [showPrediction, setShowPrediction] = useState(false);

  const { data: predictionData, isLoading } = trpc.historicalEvents.predict.useQuery(
    { eventType, severity, region: region || undefined, description: description || undefined },
    { enabled: showPrediction && eventType.length > 0 }
  );

  const handlePredict = () => {
    if (eventType) {
      setShowPrediction(true);
    }
  };

  const emotionRadarData = predictionData?.prediction?.emotionalVector
    ? [
        { emotion: isRTL ? 'فرح' : 'Joy', value: predictionData.prediction.emotionalVector.joy },
        { emotion: isRTL ? 'خوف' : 'Fear', value: predictionData.prediction.emotionalVector.fear },
        { emotion: isRTL ? 'غضب' : 'Anger', value: predictionData.prediction.emotionalVector.anger },
        { emotion: isRTL ? 'حزن' : 'Sadness', value: predictionData.prediction.emotionalVector.sadness },
        { emotion: isRTL ? 'أمل' : 'Hope', value: predictionData.prediction.emotionalVector.hope },
        { emotion: isRTL ? 'فضول' : 'Curiosity', value: predictionData.prediction.emotionalVector.curiosity },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/historical-events')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {isRTL ? 'التنبؤ بناءً على الأنماط التاريخية' : 'Pattern-Based Prediction'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'تنبؤ بالتأثيرات المحتملة بناءً على 202+ حدث تاريخي' : 'Predict potential impacts based on 202+ historical events'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Input Form */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            {isRTL ? 'وصف الحدث المتوقع' : 'Describe the Expected Event'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Event Type */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {isRTL ? 'نوع الحدث' : 'Event Type'}
              </label>
              <select
                value={eventType}
                onChange={(e) => { setEventType(e.target.value); setShowPrediction(false); }}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{isRTL ? 'اختر نوع الحدث...' : 'Select event type...'}</option>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label[isRTL ? 'ar' : 'en']}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {isRTL ? 'شدة الحدث' : 'Event Severity'}
              </label>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSeverity(opt.value as any); setShowPrediction(false); }}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      severity === opt.value
                        ? 'text-white border-transparent'
                        : 'bg-background hover:bg-muted/50'
                    }`}
                    style={severity === opt.value ? { backgroundColor: SEVERITY_COLORS[opt.value as keyof typeof SEVERITY_COLORS] } : {}}
                  >
                    {opt.label[isRTL ? 'ar' : 'en']}
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {isRTL ? 'المنطقة (اختياري)' : 'Region (optional)'}
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => { setRegion(e.target.value); setShowPrediction(false); }}
                placeholder={isRTL ? 'مثال: Libya, USA, Global...' : 'e.g., Libya, USA, Global...'}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {isRTL ? 'وصف مختصر (اختياري)' : 'Brief Description (optional)'}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setShowPrediction(false); }}
                placeholder={isRTL ? 'وصف مختصر للحدث...' : 'Brief event description...'}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={!eventType || isLoading}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading
              ? (isRTL ? 'جاري التحليل...' : 'Analyzing...')
              : (isRTL ? 'تنبؤ بالتأثيرات' : 'Predict Impacts')}
          </Button>
        </Card>

        {/* Prediction Results */}
        {predictionData?.prediction && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Confidence */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {isRTL ? 'مستوى الثقة' : 'Confidence Level'}
              </h3>
              <ConfidenceMeter confidence={predictionData.confidence} />
              <p className="text-xs text-muted-foreground mt-2">
                {isRTL
                  ? `بناءً على تحليل ${predictionData.sampleSize} حدث تاريخي مشابه`
                  : `Based on analysis of ${predictionData.sampleSize} similar historical events`}
              </p>
            </Card>

            {/* Predicted Indices */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                {isRTL ? 'المؤشرات المتوقعة' : 'Predicted Indices'}
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold" style={{ color: predictionData.prediction.estimatedGMI >= 50 ? '#2A9D8F' : '#E63946' }}>
                    {predictionData.prediction.estimatedGMI}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">GMI</div>
                  <div className="text-xs mt-1">
                    {predictionData.prediction.estimatedGMI >= 50
                      ? (isRTL ? 'مزاج إيجابي' : 'Positive Mood')
                      : (isRTL ? 'مزاج سلبي' : 'Negative Mood')}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold" style={{ color: predictionData.prediction.estimatedCFI >= 70 ? '#E63946' : '#F4A261' }}>
                    {predictionData.prediction.estimatedCFI}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">CFI</div>
                  <div className="text-xs mt-1">
                    {predictionData.prediction.estimatedCFI >= 70
                      ? (isRTL ? 'خوف مرتفع' : 'High Fear')
                      : (isRTL ? 'خوف معتدل' : 'Moderate Fear')}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold" style={{ color: predictionData.prediction.estimatedHRI >= 50 ? '#2A9D8F' : '#E63946' }}>
                    {predictionData.prediction.estimatedHRI}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">HRI</div>
                  <div className="text-xs mt-1">
                    {predictionData.prediction.estimatedHRI >= 50
                      ? (isRTL ? 'أمل مرتفع' : 'High Hope')
                      : (isRTL ? 'أمل منخفض' : 'Low Hope')}
                  </div>
                </div>
              </div>

              {predictionData.prediction.gdpImpact !== 0 && (
                <div className="text-center p-3 rounded-lg bg-muted/20 border">
                  <span className="text-xs text-muted-foreground">{isRTL ? 'تأثير GDP المتوقع: ' : 'Expected GDP Impact: '}</span>
                  <span className={`text-sm font-bold ${predictionData.prediction.gdpImpact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {predictionData.prediction.gdpImpact > 0 ? '+' : ''}{predictionData.prediction.gdpImpact}%
                  </span>
                </div>
              )}
            </Card>

            {/* Emotional Radar */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                {isRTL ? 'البصمة العاطفية المتوقعة' : 'Predicted Emotional Fingerprint'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={emotionRadarData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="emotion" fontSize={11} />
                  <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                  <Radar name={isRTL ? 'متوقع' : 'Predicted'} dataKey="value" stroke="#8D5CF6" fill="#8D5CF6" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Scenarios */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                {isRTL ? 'السيناريوهات المحتملة' : 'Possible Scenarios'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScenarioCard
                  title={isRTL ? 'أفضل سيناريو' : 'Best Case'}
                  icon={TrendingUp}
                  scenario={predictionData.prediction.scenarios.bestCase}
                  color="#2A9D8F"
                  isRTL={isRTL}
                />
                <ScenarioCard
                  title={isRTL ? 'الأكثر احتمالاً' : 'Most Likely'}
                  icon={Target}
                  scenario={predictionData.prediction.scenarios.mostLikely}
                  color="#F4A261"
                  isRTL={isRTL}
                />
                <ScenarioCard
                  title={isRTL ? 'أسوأ سيناريو' : 'Worst Case'}
                  icon={TrendingDown}
                  scenario={predictionData.prediction.scenarios.worstCase}
                  color="#E63946"
                  isRTL={isRTL}
                />
              </div>
            </div>

            {/* Predicted Impacts */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                {isRTL ? 'التأثيرات المتوقعة' : 'Predicted Impacts'}
              </h3>
              <div className="grid gap-4">
                {predictionData.prediction.predictedImpacts.political.length > 0 && (
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-700">{isRTL ? 'التأثيرات السياسية المتوقعة' : 'Expected Political Impacts'}</span>
                    </div>
                    <ul className="space-y-1">
                      {predictionData.prediction.predictedImpacts.political.map((imp: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-blue-400 mt-0.5">-</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {predictionData.prediction.predictedImpacts.economic.length > 0 && (
                  <div className="p-3 rounded-lg border border-orange-200 bg-orange-50/30">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-orange-700">{isRTL ? 'التأثيرات الاقتصادية المتوقعة' : 'Expected Economic Impacts'}</span>
                    </div>
                    <ul className="space-y-1">
                      {predictionData.prediction.predictedImpacts.economic.map((imp: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-orange-400 mt-0.5">-</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {predictionData.prediction.predictedImpacts.social.length > 0 && (
                  <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-700">{isRTL ? 'التأثيرات الاجتماعية المتوقعة' : 'Expected Social Impacts'}</span>
                    </div>
                    <ul className="space-y-1">
                      {predictionData.prediction.predictedImpacts.social.map((imp: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">-</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Based On */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                {isRTL ? 'بناءً على هذه الأحداث التاريخية' : 'Based on These Historical Events'}
              </h3>
              <div className="space-y-2">
                {predictionData.basedOn.map((event: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs">
                    <div>
                      <span className="font-medium">{event.name}</span>
                      <span className="text-muted-foreground ml-2">({event.country}, {new Date(event.date).getFullYear()})</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">GMI: {event.gmi}</span>
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500">CFI: {event.cfi}</span>
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">HRI: {event.hri}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* No prediction message */}
        {predictionData && !predictionData.prediction && showPrediction && (
          <Card className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-orange-500/50 mb-3" />
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? 'لا توجد بيانات كافية' : 'Not Enough Data'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {predictionData.message || (isRTL ? 'جرب تغيير نوع الحدث أو الشدة' : 'Try changing the event type or severity')}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
