/**
 * FOLLOWED TOPICS COMPONENT
 * 
 * الموضوعات المتابعة
 * - متابعة الموضوعات ذات الأهمية
 * - تلقي التحديثات الفورية
 * - إدارة قائمة المتابعة
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Trash2, Plus, TrendingUp, Eye, EyeOff, Settings } from 'lucide-react';

interface FollowedTopic {
  id: string;
  name: string;
  description: string;
  category: string;
  followers: number;
  latestUpdate: Date;
  emotionTrend: 'up' | 'down' | 'stable';
  currentEmotion: string;
  emotionScore: number;
  isNotificationEnabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  addedDate: Date;
}

interface FollowedTopicsProps {
  userId?: string;
  onTopicSelect?: (topic: FollowedTopic) => void;
}

export function FollowedTopics({
  userId,
  onTopicSelect
}: FollowedTopicsProps) {
  const [followedTopics, setFollowedTopics] = useState<FollowedTopic[]>([
    {
      id: 'topic-1',
      name: 'الاقتصاد العالمي',
      description: 'تطورات الأسواق المالية والاقتصاد العالمي',
      category: 'اقتصاد',
      followers: 2450,
      latestUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      emotionTrend: 'down',
      currentEmotion: 'قلق',
      emotionScore: 62,
      isNotificationEnabled: true,
      frequency: 'instant',
      addedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'topic-2',
      name: 'التطورات التكنولوجية',
      description: 'آخر الابتكارات والتطورات في عالم التكنولوجيا',
      category: 'تكنولوجيا',
      followers: 3120,
      latestUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      emotionTrend: 'up',
      currentEmotion: 'أمل',
      emotionScore: 78,
      isNotificationEnabled: true,
      frequency: 'daily',
      addedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'topic-3',
      name: 'التغيرات المناخية',
      description: 'أخبار ودراسات عن تغير المناخ والبيئة',
      category: 'بيئة',
      followers: 1890,
      latestUpdate: new Date(Date.now() - 5 * 60 * 60 * 1000),
      emotionTrend: 'down',
      currentEmotion: 'قلق',
      emotionScore: 58,
      isNotificationEnabled: false,
      frequency: 'weekly',
      addedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'topic-4',
      name: 'السياسة الدولية',
      description: 'التطورات السياسية والعلاقات الدولية',
      category: 'سياسة',
      followers: 2100,
      latestUpdate: new Date(Date.now() - 30 * 60 * 1000),
      emotionTrend: 'stable',
      currentEmotion: 'فضول',
      emotionScore: 65,
      isNotificationEnabled: true,
      frequency: 'instant',
      addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [sortBy, setSortBy] = useState<'latest' | 'followers' | 'emotion'>('latest');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(followedTopics.map(t => t.category)));
  }, [followedTopics]);

  // Sort and filter topics
  const sortedTopics = useMemo(() => {
    let filtered = followedTopics;

    if (filterCategory) {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return b.latestUpdate.getTime() - a.latestUpdate.getTime();
        case 'followers':
          return b.followers - a.followers;
        case 'emotion':
          return b.emotionScore - a.emotionScore;
        default:
          return 0;
      }
    });
  }, [followedTopics, sortBy, filterCategory]);

  const handleRemoveTopic = (id: string) => {
    setFollowedTopics(followedTopics.filter(t => t.id !== id));
  };

  const handleToggleNotification = (id: string) => {
    setFollowedTopics(followedTopics.map(t =>
      t.id === id ? { ...t, isNotificationEnabled: !t.isNotificationEnabled } : t
    ));
  };

  const handleChangeFrequency = (id: string, frequency: 'instant' | 'daily' | 'weekly') => {
    setFollowedTopics(followedTopics.map(t =>
      t.id === id ? { ...t, frequency } : t
    ));
    setShowSettings(null);
  };

  const getEmotionColor = (emotion: string): string => {
    switch (emotion) {
      case 'أمل':
        return 'bg-green-100 text-green-800';
      case 'قلق':
        return 'bg-red-100 text-red-800';
      case 'فضول':
        return 'bg-blue-100 text-blue-800';
      case 'فرح':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmotionTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <div className="w-4 h-4 text-gray-600">—</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">الموضوعات المتابعة</h2>
          <p className="text-sm text-gray-600 mt-1">
            تابع {followedTopics.length} موضوع وتلقَّ التحديثات الفورية
          </p>
        </div>
        <Button className="gap-2 bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          متابعة موضوع جديد
        </Button>
      </div>

      {/* Filters and Sort */}
      <Card className="p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-black mb-3">الفرز</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'latest' as const, label: 'الأحدث' },
                { value: 'followers' as const, label: 'الأكثر متابعة' },
                { value: 'emotion' as const, label: 'أعلى عاطفة' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    sortBy === value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">التصنيفات</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-4 py-2 rounded font-medium transition ${
                  filterCategory === null
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                الكل
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    filterCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Topics List */}
      <div className="space-y-3">
        {sortedTopics.map(topic => (
          <Card
            key={topic.id}
            className="p-4 border border-gray-200 hover:border-gray-400 transition cursor-pointer"
            onClick={() => onTopicSelect?.(topic)}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Topic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-black">{topic.name}</h3>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {topic.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{topic.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>👥 {topic.followers} متابع</span>
                  <span>⏱️ {Math.floor((Date.now() - topic.latestUpdate.getTime()) / (1000 * 60))} دقيقة</span>
                </div>
              </div>

              {/* Emotion and Actions */}
              <div className="flex flex-col items-end gap-3">
                {/* Emotion Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <Badge className={`${getEmotionColor(topic.currentEmotion)} text-xs`}>
                      {topic.currentEmotion}
                    </Badge>
                    <span className="text-xs text-gray-600 mt-1">{topic.emotionScore}%</span>
                  </div>
                  {getEmotionTrendIcon(topic.emotionTrend)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Notification Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleNotification(topic.id);
                    }}
                    className={`p-2 rounded transition ${
                      topic.isNotificationEnabled
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={topic.isNotificationEnabled ? 'تعطيل الإشعارات' : 'تفعيل الإشعارات'}
                  >
                    {topic.isNotificationEnabled ? (
                      <Bell className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  {/* Settings */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(showSettings === topic.id ? null : topic.id);
                      }}
                      className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      title="الإعدادات"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Settings Menu */}
                    {showSettings === topic.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-max">
                        <div className="p-2 space-y-1">
                          <p className="text-xs font-semibold text-gray-700 px-2 py-1">تكرار الإشعارات</p>
                          {['instant', 'daily', 'weekly'].map(freq => (
                            <button
                              key={freq}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeFrequency(topic.id, freq as any);
                              }}
                              className={`w-full text-left px-2 py-1 text-sm rounded transition ${
                                topic.frequency === freq
                                  ? 'bg-black text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {freq === 'instant' && 'فوري'}
                              {freq === 'daily' && 'يومي'}
                              {freq === 'weekly' && 'أسبوعي'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTopic(topic.id);
                    }}
                    className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
                    title="إزالة المتابعة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedTopics.length === 0 && (
        <Card className="p-12 border border-gray-200 text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-black mb-2">لا توجد موضوعات متابعة</h3>
          <p className="text-gray-600 mb-4">ابدأ بمتابعة الموضوعات التي تهمك لتلقي التحديثات الفورية</p>
          <Button className="gap-2 bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            متابعة موضوع الآن
          </Button>
        </Card>
      )}

      {/* Statistics */}
      <Card className="p-6 border border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-black mb-4">الإحصائيات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">إجمالي الموضوعات</p>
            <p className="text-2xl font-bold text-black mt-1">{followedTopics.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">مع إشعارات مفعلة</p>
            <p className="text-2xl font-bold text-black mt-1">
              {followedTopics.filter(t => t.isNotificationEnabled).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">متوسط المتابعين</p>
            <p className="text-2xl font-bold text-black mt-1">
              {Math.round(followedTopics.reduce((sum, t) => sum + t.followers, 0) / followedTopics.length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">متوسط العاطفة</p>
            <p className="text-2xl font-bold text-black mt-1">
              {Math.round(followedTopics.reduce((sum, t) => sum + t.emotionScore, 0) / followedTopics.length)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
