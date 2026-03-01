/**
 * DCFT VISUALIZATION - CONNECTED VERSION
 * 
 * يعرض تصور DCFT (Discrete Collective Fourier Transform) مع بيانات حقيقية
 * - يستخدم analysisDataRouter.getDCFTVisualization للحصول على البيانات
 * - يعرض المتناسقات والموجات
 * - يدعم التحليل الطيفي للعواطف
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, BarChart3 } from 'lucide-react';

interface Harmonic {
  frequency: number;
  amplitude: number;
  phase: number;
  emotion: string;
  strength: number;
}

interface DCFTData {
  topic: string;
  country: string;
  harmonics: Harmonic[];
  dominantFrequency: number;
  totalEnergy: number;
  complexity: number;
  stability: number;
  timestamp: Date;
}

interface DCFTVisualizationConnectedProps {
  topic: string;
  country?: string;
  onHarmonicSelect?: (harmonic: Harmonic) => void;
}

export function DCFTVisualizationConnected({
  topic,
  country,
  onHarmonicSelect
}: DCFTVisualizationConnectedProps) {
  const [selectedHarmonic, setSelectedHarmonic] = React.useState<Harmonic | null>(null);

  // Fetch DCFT visualization data from backend
  const { data: dcftData, isLoading, error } = trpc.analysisData.getDCFTVisualization.useQuery({
    topic,
    country
  });

  const analysis = dcftData?.data;

  const handleHarmonicClick = (harmonic: Harmonic) => {
    setSelectedHarmonic(harmonic);
    if (onHarmonicSelect) {
      onHarmonicSelect(harmonic);
    }
  };

  const getAmplitudeColor = (amplitude: number, maxAmplitude: number) => {
    const normalized = amplitude / maxAmplitude;
    if (normalized >= 0.8) return '#000000';
    if (normalized >= 0.6) return '#333333';
    if (normalized >= 0.4) return '#666666';
    if (normalized >= 0.2) return '#999999';
    return '#CCCCCC';
  };

  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      joy: 'فرح',
      fear: 'خوف',
      anger: 'غضب',
      sadness: 'حزن',
      hope: 'أمل',
      curiosity: 'فضول'
    };
    return labels[emotion] || emotion;
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 bg-white border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">جاري تحميل تصور DCFT...</span>
        </div>
      </Card>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل تصور DCFT</span>
        </div>
      </Card>
    );
  }

  const maxAmplitude = Math.max(...analysis.harmonics.map(h => h.amplitude), 1);
  const sortedHarmonics = [...analysis.harmonics].sort((a, b) => b.amplitude - a.amplitude);

  return (
    <div className="w-full space-y-4">
      {/* DCFT Overview */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-900" />
          <h3 className="text-lg font-bold text-gray-900">تحليل DCFT</h3>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">التردد المهيمن</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.dominantFrequency.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Hz</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">الطاقة الكلية</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.totalEnergy.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">وحدة طاقة</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">التعقيد</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.complexity.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">درجة</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">الاستقرار</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.stability.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 mt-1">مستقر</p>
          </div>
        </div>
      </Card>

      {/* Harmonics Visualization */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">المتناسقات (Harmonics)</h4>
        
        <div className="space-y-3 mb-6">
          {sortedHarmonics.slice(0, 10).map((harmonic, index) => (
            <div
              key={index}
              onClick={() => handleHarmonicClick(harmonic)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedHarmonic?.frequency === harmonic.frequency
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">
                    المتناسق #{index + 1} - {getEmotionLabel(harmonic.emotion)}
                  </p>
                  <p className={`text-xs ${selectedHarmonic?.frequency === harmonic.frequency ? 'text-gray-300' : 'text-gray-600'}`}>
                    التردد: {harmonic.frequency.toFixed(2)} Hz | الطور: {harmonic.phase.toFixed(1)}°
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{harmonic.amplitude.toFixed(1)}</p>
                  <p className={`text-xs ${selectedHarmonic?.frequency === harmonic.frequency ? 'text-gray-300' : 'text-gray-600'}`}>
                    السعة
                  </p>
                </div>
              </div>

              {/* Amplitude Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${(harmonic.amplitude / maxAmplitude) * 100}%`,
                      backgroundColor: getAmplitudeColor(harmonic.amplitude, maxAmplitude)
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">
                  {((harmonic.amplitude / maxAmplitude) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Harmonic Details */}
      {selectedHarmonic && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            تفاصيل المتناسق: {getEmotionLabel(selectedHarmonic.emotion)}
          </h4>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">التردد</p>
              <p className="text-2xl font-bold text-gray-900">{selectedHarmonic.frequency.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Hz</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">السعة</p>
              <p className="text-2xl font-bold text-gray-900">{selectedHarmonic.amplitude.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">وحدة</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">الطور</p>
              <p className="text-2xl font-bold text-gray-900">{selectedHarmonic.phase.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">درجة</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">القوة</p>
              <p className="text-2xl font-bold text-gray-900">{selectedHarmonic.strength.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 mt-1">نسبة</p>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">قوة المتناسق</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded h-3">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${selectedHarmonic.strength}%`,
                    backgroundColor: getAmplitudeColor(selectedHarmonic.strength, 100)
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                {selectedHarmonic.strength.toFixed(0)}%
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Frequency Spectrum */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">طيف التردد</h4>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-end justify-between h-40 gap-1">
            {sortedHarmonics.slice(0, 20).map((harmonic, index) => (
              <div
                key={index}
                className="flex-1 bg-gray-300 rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  height: `${(harmonic.amplitude / maxAmplitude) * 100}%`,
                  backgroundColor: getAmplitudeColor(harmonic.amplitude, maxAmplitude)
                }}
                title={`${harmonic.emotion}: ${harmonic.amplitude.toFixed(1)}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            أعلى 20 متناسق
          </p>
        </div>
      </Card>
    </div>
  );
}
