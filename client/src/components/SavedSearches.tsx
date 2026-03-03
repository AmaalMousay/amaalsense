/**
 * SAVED SEARCHES COMPONENT
 * 
 * البحوث المحفوظة
 * - حفظ الاستعلامات المهمة
 * - إعادة تشغيل البحوث السابقة
 * - إدارة المجلدات والعلامات
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Copy, Share2, Folder, Tag, Calendar, Play, Edit2, Star } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  description: string;
  tags: string[];
  folder: string;
  createdDate: Date;
  lastUsed: Date;
  resultsCount: number;
  isFavorite: boolean;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  filters: {
    dateRange?: { from: Date; to: Date };
    regions?: string[];
    emotions?: string[];
    sources?: string[];
  };
}

interface SavedSearchesProps {
  userId?: string;
  onSearchSelect?: (search: SavedSearch) => void;
}

export function SavedSearches({
  userId,
  onSearchSelect
}: SavedSearchesProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([
    {
      id: 'search-1',
      name: 'أخبار الاقتصاد العالمي',
      query: 'الاقتصاد العالمي الأسواق المالية',
      description: 'متابعة أخبار الاقتصاد والأسواق المالية العالمية',
      tags: ['اقتصاد', 'أسواق', 'عالمي'],
      folder: 'الاقتصاد',
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resultsCount: 1250,
      isFavorite: true,
      frequency: 'daily',
      filters: {
        regions: ['عالمي'],
        emotions: ['قلق', 'فضول']
      }
    },
    {
      id: 'search-2',
      name: 'التطورات التكنولوجية الحديثة',
      query: 'تكنولوجيا ذكاء اصطناعي ابتكار',
      description: 'آخر التطورات في عالم التكنولوجيا والذكاء الاصطناعي',
      tags: ['تكنولوجيا', 'ذكاء اصطناعي', 'ابتكار'],
      folder: 'التكنولوجيا',
      createdDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000),
      resultsCount: 890,
      isFavorite: true,
      frequency: 'daily',
      filters: {
        emotions: ['أمل', 'فضول']
      }
    },
    {
      id: 'search-3',
      name: 'التغيرات المناخية والبيئة',
      query: 'تغير المناخ البيئة الاحتباس الحراري',
      description: 'أخبار ودراسات عن تغير المناخ والقضايا البيئية',
      tags: ['بيئة', 'مناخ', 'استدامة'],
      folder: 'البيئة',
      createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      resultsCount: 650,
      isFavorite: false,
      frequency: 'weekly',
      filters: {
        emotions: ['قلق', 'أمل']
      }
    },
    {
      id: 'search-4',
      name: 'الأخبار السياسية الدولية',
      query: 'سياسة دولية علاقات دبلوماسية',
      description: 'تطورات سياسية وعلاقات دولية',
      tags: ['سياسة', 'دولي', 'دبلوماسية'],
      folder: 'السياسة',
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      resultsCount: 2100,
      isFavorite: false,
      frequency: 'instant',
      filters: {
        emotions: ['فضول', 'قلق']
      }
    }
  ]);

  const [sortBy, setSortBy] = useState<'recent' | 'favorite' | 'popular'>('recent');
  const [filterFolder, setFilterFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSearch, setShowNewSearch] = useState(false);

  // Get unique folders
  const folders = useMemo(() => {
    return Array.from(new Set(searches.map(s => s.folder)));
  }, [searches]);

  // Sort and filter searches
  const sortedSearches = useMemo(() => {
    let filtered = searches;

    if (filterFolder) {
      filtered = filtered.filter(s => s.folder === filterFolder);
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.includes(searchQuery) ||
        s.query.includes(searchQuery) ||
        s.tags.some(t => t.includes(searchQuery))
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.lastUsed.getTime() - a.lastUsed.getTime();
        case 'favorite':
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        case 'popular':
          return b.resultsCount - a.resultsCount;
        default:
          return 0;
      }
    });
  }, [searches, sortBy, filterFolder, searchQuery]);

  const handleToggleFavorite = (id: string) => {
    setSearches(searches.map(s =>
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const handleDeleteSearch = (id: string) => {
    setSearches(searches.filter(s => s.id !== id));
  };

  const handleDuplicateSearch = (search: SavedSearch) => {
    const newSearch: SavedSearch = {
      ...search,
      id: `search-${Date.now()}`,
      name: `${search.name} (نسخة)`,
      createdDate: new Date()
    };
    setSearches([...searches, newSearch]);
  };

  const handleRunSearch = (search: SavedSearch) => {
    setSearches(searches.map(s =>
      s.id === search.id ? { ...s, lastUsed: new Date() } : s
    ));
    onSearchSelect?.(search);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">البحوث المحفوظة</h2>
          <p className="text-sm text-gray-600 mt-1">
            {searches.length} بحث محفوظ
          </p>
        </div>
        <Button className="gap-2 bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          بحث جديد
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن البحوث المحفوظة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
      </Card>

      {/* Filters and Sort */}
      <Card className="p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-black mb-3">الفرز</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'recent' as const, label: 'الأحدث استخداماً' },
                { value: 'favorite' as const, label: 'المفضلة' },
                { value: 'popular' as const, label: 'الأكثر نتائج' }
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
            <h3 className="font-semibold text-black mb-3">المجلدات</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterFolder(null)}
                className={`px-4 py-2 rounded font-medium transition ${
                  filterFolder === null
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                الكل
              </button>
              {folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setFilterFolder(folder)}
                  className={`px-4 py-2 rounded font-medium transition flex items-center gap-2 ${
                    filterFolder === folder
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  {folder}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Searches List */}
      <div className="space-y-3">
        {sortedSearches.map(search => (
          <Card
            key={search.id}
            className="p-4 border border-gray-200 hover:border-gray-400 transition"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Search Info */}
              <div className="flex-1 cursor-pointer" onClick={() => handleRunSearch(search)}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-black">{search.name}</h3>
                  {search.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {search.query}
                  </code>
                </p>
                <p className="text-xs text-gray-600 mb-3">{search.description}</p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {search.tags.map(tag => (
                    <Badge key={tag} className="bg-gray-100 text-gray-800 text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>📊 {search.resultsCount} نتيجة</span>
                  <span>📅 {Math.floor((Date.now() - search.lastUsed.getTime()) / (1000 * 60))} دقيقة</span>
                  <span>🔄 {
                    search.frequency === 'once' ? 'مرة واحدة' :
                    search.frequency === 'daily' ? 'يومي' :
                    search.frequency === 'weekly' ? 'أسبوعي' :
                    'شهري'
                  }</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Run Search */}
                <button
                  onClick={() => handleRunSearch(search)}
                  className="p-2 rounded bg-black text-white hover:bg-gray-800 transition"
                  title="تشغيل البحث"
                >
                  <Play className="w-4 h-4" />
                </button>

                {/* Toggle Favorite */}
                <button
                  onClick={() => handleToggleFavorite(search.id)}
                  className={`p-2 rounded transition ${
                    search.isFavorite
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={search.isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                >
                  <Star className="w-4 h-4" />
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => handleDuplicateSearch(search)}
                  className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  title="نسخ البحث"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Share */}
                <button
                  className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  title="مشاركة البحث"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteSearch(search.id)}
                  className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
                  title="حذف البحث"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedSearches.length === 0 && (
        <Card className="p-12 border border-gray-200 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-black mb-2">لا توجد بحوث محفوظة</h3>
          <p className="text-gray-600 mb-4">احفظ البحوث المهمة لإعادة استخدامها لاحقاً</p>
          <Button className="gap-2 bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            إنشاء بحث جديد
          </Button>
        </Card>
      )}

      {/* Statistics */}
      <Card className="p-6 border border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-black mb-4">الإحصائيات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">إجمالي البحوث</p>
            <p className="text-2xl font-bold text-black mt-1">{searches.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">المفضلة</p>
            <p className="text-2xl font-bold text-black mt-1">
              {searches.filter(s => s.isFavorite).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">إجمالي النتائج</p>
            <p className="text-2xl font-bold text-black mt-1">
              {searches.reduce((sum, s) => sum + s.resultsCount, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">آخر استخدام</p>
            <p className="text-sm font-bold text-black mt-1">
              {Math.floor((Date.now() - Math.max(...searches.map(s => s.lastUsed.getTime()))) / (1000 * 60))} دقيقة
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Add missing import
import { Plus } from 'lucide-react';
