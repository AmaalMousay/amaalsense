/**
 * Advanced Filters Component
 * مكون الفلاتر المتقدمة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  dateRange: [string, string];
  regions: string[];
  emotionTypes: string[];
  confidenceRange: [number, number];
  sourceTypes: string[];
}

interface AdvancedFiltersProps {
  onApplyFilters?: (filters: FilterOptions) => void;
  onClearFilters?: () => void;
}

export function AdvancedFilters({ onApplyFilters, onClearFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: ['2024-01-01', '2024-12-31'],
    regions: [],
    emotionTypes: [],
    confidenceRange: [0, 100],
    sourceTypes: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const regions = ['الشرق الأوسط', 'أوروبا', 'آسيا', 'أمريكا', 'أفريقيا', 'أوقيانوسيا'];
  const emotions = ['فرح', 'حزن', 'غضب', 'خوف', 'أمل', 'هدوء'];
  const sources = ['وسائل التواصل', 'الأخبار', 'المنتديات', 'المدونات', 'التطبيقات'];

  const handleRegionToggle = (region: string) => {
    setFilters(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const handleEmotionToggle = (emotion: string) => {
    setFilters(prev => ({
      ...prev,
      emotionTypes: prev.emotionTypes.includes(emotion)
        ? prev.emotionTypes.filter(e => e !== emotion)
        : [...prev.emotionTypes, emotion]
    }));
  };

  const handleSourceToggle = (source: string) => {
    setFilters(prev => ({
      ...prev,
      sourceTypes: prev.sourceTypes.includes(source)
        ? prev.sourceTypes.filter(s => s !== source)
        : [...prev.sourceTypes, source]
    }));
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
  };

  const handleClear = () => {
    setFilters({
      dateRange: ['2024-01-01', '2024-12-31'],
      regions: [],
      emotionTypes: [],
      confidenceRange: [0, 100],
      sourceTypes: []
    });
    onClearFilters?.();
  };

  return (
    <Card className="border-gray-300 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-black" />
            <CardTitle className="text-black">الفلاتر المتقدمة</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-black hover:bg-gray-100"
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 border-t border-gray-300 pt-6">
          {/* Date Range */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-black">نطاق التاريخ</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={filters.dateRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: [e.target.value, prev.dateRange[1]]
                }))}
                className="border-gray-300 text-black bg-white"
              />
              <Input
                type="date"
                value={filters.dateRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: [prev.dateRange[0], e.target.value]
                }))}
                className="border-gray-300 text-black bg-white"
              />
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-black">المناطق الجغرافية</label>
            <div className="grid grid-cols-2 gap-3">
              {regions.map(region => (
                <div key={region} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.regions.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                    className="border-gray-400"
                  />
                  <label className="text-sm text-gray-700 cursor-pointer">{region}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-black">أنواع العواطف</label>
            <div className="grid grid-cols-2 gap-3">
              {emotions.map(emotion => (
                <div key={emotion} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.emotionTypes.includes(emotion)}
                    onCheckedChange={() => handleEmotionToggle(emotion)}
                    className="border-gray-400"
                  />
                  <label className="text-sm text-gray-700 cursor-pointer">{emotion}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Range */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-black">
              نطاق الثقة: {filters.confidenceRange[0]}% - {filters.confidenceRange[1]}%
            </label>
            <Slider
              value={filters.confidenceRange}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                confidenceRange: [value[0], value[1]]
              }))}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-black">مصادر البيانات</label>
            <div className="grid grid-cols-2 gap-3">
              {sources.map(source => (
                <div key={source} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.sourceTypes.includes(source)}
                    onCheckedChange={() => handleSourceToggle(source)}
                    className="border-gray-400"
                  />
                  <label className="text-sm text-gray-700 cursor-pointer">{source}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-300">
            <Button
              onClick={handleApply}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              تطبيق الفلاتر
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1 border-gray-300 text-black hover:bg-gray-100"
            >
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
