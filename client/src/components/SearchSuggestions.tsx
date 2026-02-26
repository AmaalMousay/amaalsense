/**
 * Search Suggestions Component
 * مكون اقتراحات البحث
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Clock } from 'lucide-react';

interface Suggestion {
  text: string;
  category: 'trending' | 'recent' | 'popular';
  count?: number;
}

interface SearchSuggestionsProps {
  suggestions?: Suggestion[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function SearchSuggestions({ suggestions, onSuggestionClick }: SearchSuggestionsProps) {
  const defaultSuggestions: Suggestion[] = [
    { text: 'المشاعر العالمية اليوم', category: 'trending', count: 1243 },
    { text: 'تحليل الأمل والتفاؤل', category: 'trending', count: 856 },
    { text: 'الاتجاهات الإقليمية', category: 'popular', count: 2341 },
    { text: 'المؤشرات الاقتصادية', category: 'popular', count: 1876 },
    { text: 'البحث السابق: المشاعر الاجتماعية', category: 'recent' },
    { text: 'البحث السابق: تحليل الأزمات', category: 'recent' },
  ];

  const displaySuggestions = suggestions || defaultSuggestions;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trending':
        return <Zap className="h-4 w-4" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4" />;
      case 'recent':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'trending':
        return 'رائج';
      case 'popular':
        return 'شهير';
      case 'recent':
        return 'حديث';
      default:
        return '';
    }
  };

  return (
    <Card className="border-gray-300 bg-white">
      <CardHeader>
        <CardTitle className="text-black">اقتراحات البحث</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displaySuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => onSuggestionClick?.(suggestion.text)}
              className="p-3 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-gray-600">
                    {getCategoryIcon(suggestion.category)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{suggestion.text}</p>
                    {suggestion.count && (
                      <p className="text-xs text-gray-600 mt-1">
                        {suggestion.count} نتيجة بحث
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-gray-300 text-gray-700 bg-white"
                >
                  {getCategoryLabel(suggestion.category)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
