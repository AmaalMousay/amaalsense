/**
 * Topic Cloud Component
 * سحابة الموضوعات - عرض الموضوعات الرائجة بأحجام مختلفة
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Topic {
  text: string;
  weight: number;
  trend?: 'up' | 'down' | 'stable';
  category?: string;
}

interface TopicCloudProps {
  topics?: Topic[];
  onTopicClick?: (topic: string) => void;
}

export function TopicCloud({ 
  topics = [],
  onTopicClick
}: TopicCloudProps) {
  // Generate mock topics if not provided
  const displayTopics: Topic[] = topics.length > 0 ? topics : [
    { text: 'الاقتصاد العالمي', weight: 95, trend: 'up', category: 'economy' },
    { text: 'التغير المناخي', weight: 88, trend: 'up', category: 'environment' },
    { text: 'التكنولوجيا', weight: 82, trend: 'stable', category: 'tech' },
    { text: 'الصحة العامة', weight: 75, trend: 'down', category: 'health' },
    { text: 'التعليم', weight: 70, trend: 'up', category: 'education' },
    { text: 'الطاقة المتجددة', weight: 65, trend: 'up', category: 'environment' },
    { text: 'الذكاء الاصطناعي', weight: 60, trend: 'up', category: 'tech' },
    { text: 'الأمن السيبراني', weight: 55, trend: 'stable', category: 'tech' },
    { text: 'التنمية المستدامة', weight: 50, trend: 'up', category: 'environment' },
    { text: 'الابتكار', weight: 45, trend: 'stable', category: 'tech' },
    { text: 'السياسة الدولية', weight: 40, trend: 'down', category: 'politics' },
    { text: 'الرياضة', weight: 35, trend: 'stable', category: 'sports' },
  ];

  const maxWeight = Math.max(...displayTopics.map(t => t.weight));
  const minWeight = Math.min(...displayTopics.map(t => t.weight));

  const getFontSize = (weight: number) => {
    const normalized = (weight - minWeight) / (maxWeight - minWeight);
    return 12 + normalized * 24; // Font size between 12px and 36px
  };

  const getColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400 hover:text-green-300';
      case 'down':
        return 'text-red-400 hover:text-red-300';
      default:
        return 'text-blue-400 hover:text-blue-300';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'economy':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'environment':
        return 'bg-green-500/20 border-green-500/30';
      case 'tech':
        return 'bg-purple-500/20 border-purple-500/30';
      case 'health':
        return 'bg-red-500/20 border-red-500/30';
      case 'education':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'politics':
        return 'bg-orange-500/20 border-orange-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-cyan-500" />
          سحابة الموضوعات
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cloud Visualization */}
        <div className="min-h-[300px] p-6 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 flex flex-wrap items-center justify-center gap-4">
          {displayTopics.map((topic, index) => {
            const fontSize = getFontSize(topic.weight);
            const color = getColor(topic.trend);

            return (
              <button
                key={index}
                onClick={() => onTopicClick?.(topic.text)}
                className={`${color} font-bold transition-all duration-200 hover:scale-110 cursor-pointer relative group`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {topic.text}
                {topic.trend === 'up' && (
                  <TrendingUp className="inline-block h-3 w-3 ml-1 text-green-500" />
                )}
                {topic.trend === 'down' && (
                  <TrendingUp className="inline-block h-3 w-3 ml-1 text-red-500 rotate-180" />
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <p className="text-xs font-semibold">الوزن: {topic.weight}</p>
                  <p className="text-xs text-muted-foreground">
                    {topic.trend === 'up' && 'رائج ↑'}
                    {topic.trend === 'down' && 'متراجع ↓'}
                    {topic.trend === 'stable' && 'مستقر →'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">التصنيفات</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(displayTopics.map(t => t.category).filter(Boolean))).map((category) => {
              const count = displayTopics.filter(t => t.category === category).length;
              
              return (
                <Badge
                  key={category}
                  variant="outline"
                  className={`${getCategoryColor(category)} cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  {category} ({count})
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Top Trending Topics */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">الموضوعات الأكثر رواجاً</p>
          <div className="space-y-2">
            {displayTopics
              .filter(t => t.trend === 'up')
              .slice(0, 5)
              .map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => onTopicClick?.(topic.text)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-400">#{index + 1}</span>
                    <span className="text-sm">{topic.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{topic.weight}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">إجمالي الموضوعات</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{displayTopics.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">رائجة</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {displayTopics.filter(t => t.trend === 'up').length}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">متراجعة</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {displayTopics.filter(t => t.trend === 'down').length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
