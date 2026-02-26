/**
 * Search History Component
 * مكون سجل البحث
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  isSaved?: boolean;
}

interface SearchHistoryProps {
  items?: SearchHistoryItem[];
  onSelectSearch?: (query: string) => void;
  onDeleteSearch?: (id: string) => void;
  onToggleSave?: (id: string) => void;
}

export function SearchHistory({ items, onSelectSearch, onDeleteSearch, onToggleSave }: SearchHistoryProps) {
  const defaultItems: SearchHistoryItem[] = [
    {
      id: '1',
      query: 'المشاعر العالمية في الشرق الأوسط',
      timestamp: 'منذ ساعة',
      resultsCount: 342,
      isSaved: true
    },
    {
      id: '2',
      query: 'تحليل الأمل والتفاؤل',
      timestamp: 'منذ 3 ساعات',
      resultsCount: 856,
      isSaved: false
    },
    {
      id: '3',
      query: 'الاتجاهات الاقتصادية',
      timestamp: 'منذ يوم',
      resultsCount: 1243,
      isSaved: true
    },
    {
      id: '4',
      query: 'تحليل الأزمات والتوترات',
      timestamp: 'منذ يومين',
      resultsCount: 567,
      isSaved: false
    },
    {
      id: '5',
      query: 'المؤشرات الاجتماعية',
      timestamp: 'منذ 3 أيام',
      resultsCount: 2341,
      isSaved: false
    }
  ];

  const displayItems = items || defaultItems;
  const [localSaved, setLocalSaved] = useState<Record<string, boolean>>(
    displayItems.reduce((acc, item) => ({
      ...acc,
      [item.id]: item.isSaved || false
    }), {})
  );

  const handleToggleSave = (id: string) => {
    setLocalSaved(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    onToggleSave?.(id);
  };

  return (
    <div className="space-y-4">
      <Card className="border-gray-300 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-black" />
              <CardTitle className="text-black">سجل البحث</CardTitle>
            </div>
            <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white">
              {displayItems.length} عمليات بحث
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onSelectSearch?.(item.query)}
                  >
                    <p className="font-medium text-black">{item.query}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-600">{item.timestamp}</span>
                      <span className="text-xs text-gray-600">
                        {item.resultsCount} نتيجة
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleSave(item.id)}
                      className={`text-gray-600 hover:bg-gray-200 ${
                        localSaved[item.id] ? 'text-black' : ''
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          localSaved[item.id] ? 'fill-black' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSearch?.(item.id)}
                      className="text-gray-600 hover:bg-gray-200 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Searches Section */}
      <Card className="border-gray-300 bg-white">
        <CardHeader>
          <CardTitle className="text-black">البحوث المحفوظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayItems
              .filter(item => localSaved[item.id])
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectSearch?.(item.query)}
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-black text-black" />
                      <p className="font-medium text-black">{item.query}</p>
                    </div>
                    <span className="text-xs text-gray-600">{item.resultsCount} نتيجة</span>
                  </div>
                </div>
              ))}
            {displayItems.filter(item => localSaved[item.id]).length === 0 && (
              <p className="text-center text-gray-600 py-4">لا توجد بحوث محفوظة</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
