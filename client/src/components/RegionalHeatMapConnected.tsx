/**
 * REGIONAL HEAT MAP - CONNECTED VERSION
 * 
 * يعرض خريطة حرارية إقليمية مع بيانات حقيقية من الخادم
 * - يستخدم mapDataRouter.getRegionalHeatMapData للحصول على البيانات
 * - يعرض شدة العواطف على مستوى المناطق
 * - يسمح بالتفاعل والتحليل المقارن
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface RegionalData {
  region: string;
  country: string;
  intensity: number;
  dominantEmotion: string;
  emotionBreakdown: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  population: number;
  timestamp: Date;
}

interface RegionalHeatMapConnectedProps {
  country?: string;
  limit?: number;
  onRegionSelect?: (region: RegionalData) => void;
}

export function RegionalHeatMapConnected({
  country,
  limit = 50,
  onRegionSelect
}: RegionalHeatMapConnectedProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<RegionalData | null>(null);

  // Fetch regional heatmap data from backend
  const { data: heatmapData, isLoading, error } = trpc.mapData.getRegionalHeatMapData.useQuery({
    country,
    limit
  });

  const regions = useMemo(() => heatmapData?.data || [], [heatmapData]);

  const handleRegionClick = (region: RegionalData) => {
    setSelectedRegion(region);
    if (onRegionSelect) {
      onRegionSelect(region);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return '#000000';
    if (intensity >= 60) return '#333333';
    if (intensity >= 40) return '#666666';
    if (intensity >= 20) return '#999999';
    return '#CCCCCC';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4" />;
    return <div className="w-4 h-4 text-gray-400">—</div>;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return 'text-red-600';
    if (trend === 'decreasing') return 'text-green-600';
    return 'text-gray-600';
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
          <span className="text-gray-600">جاري تحميل الخريطة الحرارية الإقليمية...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل الخريطة الحرارية</span>
        </div>
      </Card>
    );
  }

  const sortedRegions = [...regions].sort((a, b) => b.intensity - a.intensity);

  return (
    <div className="w-full space-y-4">
      <Card className="w-full p-6 bg-white border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">الخريطة الحرارية الإقليمية</h3>
          <p className="text-sm text-gray-600">
            عدد المناطق: {regions.length} | أعلى شدة: {Math.max(...regions.map(r => r.intensity), 0).toFixed(0)}%
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {sortedRegions.map((region, index) => (
            <div
              key={index}
              onClick={() => handleRegionClick(region)}
              className={`aspect-square rounded-lg cursor-pointer transition-all flex items-center justify-center text-center p-2 border-2 ${
                selectedRegion?.region === region.region
                  ? 'border-gray-900 ring-2 ring-gray-400'
                  : 'border-gray-300 hover:border-gray-600'
              }`}
              style={{ backgroundColor: getIntensityColor(region.intensity) }}
              title={`${region.region}: ${region.intensity.toFixed(0)}%`}
            >
              <div className="text-white text-xs font-bold">
                {region.region.substring(0, 3)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs mb-4 px-2">
          <span className="text-gray-600">منخفضة</span>
          <div className="flex gap-1">
            {[0, 20, 40, 60, 80].map(intensity => (
              <div
                key={intensity}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: getIntensityColor(intensity) }}
                title={`${intensity}%`}
              />
            ))}
          </div>
          <span className="text-gray-600">عالية جداً</span>
        </div>
      </Card>

      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">تفاصيل المناطق</h4>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedRegions.map((region, index) => (
            <div
              key={index}
              onClick={() => handleRegionClick(region)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedRegion?.region === region.region
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">{region.region}</p>
                  <p className={`text-xs ${selectedRegion?.region === region.region ? 'text-gray-300' : 'text-gray-600'}`}>
                    {region.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-bold text-lg">{region.intensity.toFixed(0)}%</p>
                    <p className={`text-xs flex items-center gap-1 ${getTrendColor(region.trend)}`}>
                      {getTrendIcon(region.trend)}
                      {region.change > 0 ? '+' : ''}{region.change.toFixed(1)}%
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: getIntensityColor(region.intensity) }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {Object.entries(region.emotionBreakdown).map(([emotion, value]) => (
                  <div key={emotion} className="flex flex-col items-center gap-1">
                    <div className="w-full bg-gray-200 rounded h-1.5">
                      <div
                        className="h-full rounded transition-all"
                        style={{
                          width: `${value}%`,
                          backgroundColor: getIntensityColor(value)
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{emotion.substring(0, 2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedRegion && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            تحليل: {selectedRegion.region}
          </h4>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">الشدة الكلية</p>
              <p className="text-2xl font-bold text-gray-900">{selectedRegion.intensity.toFixed(0)}%</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">الاتجاه</p>
              <div className={`flex items-center gap-2 ${getTrendColor(selectedRegion.trend)}`}>
                {getTrendIcon(selectedRegion.trend)}
                <span className="font-semibold">
                  {selectedRegion.trend === 'increasing' ? 'تصاعدي' : selectedRegion.trend === 'decreasing' ? 'تنازلي' : 'مستقر'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">التغير</p>
              <p className={`text-2xl font-bold ${selectedRegion.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {selectedRegion.change > 0 ? '+' : ''}{selectedRegion.change.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900">توزيع العواطف</h5>
            {Object.entries(selectedRegion.emotionBreakdown).map(([emotion, value]) => (
              <div key={emotion} className="flex items-center gap-3">
                <span className="w-20 text-sm text-gray-600">
                  {getEmotionLabel(emotion)}
                </span>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${value}%`,
                      backgroundColor: getIntensityColor(value)
                    }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-gray-900">
                  {value.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <p className="text-gray-600">
              <span className="font-semibold">السكان:</span> {(selectedRegion.population / 1000000).toFixed(1)}M
            </p>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">العاطفة المهيمنة:</span> {getEmotionLabel(selectedRegion.dominantEmotion)}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
