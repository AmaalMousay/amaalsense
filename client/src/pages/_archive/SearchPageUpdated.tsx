/**
 * صفحة البحث المتقدمة - محدثة
 * Advanced Search Page - Updated with Cache Integration
 * 
 * تتضمن:
 * - بحث متقدم مع فلاتر
 * - اقتراحات ذكية
 * - نتائج البحث مع التخزين المؤقت
 * - حفظ البحث المفضل
 */

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCachedAnalysisData } from "@/hooks/useCache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { SearchSuggestions as SearchSuggestionsComponent } from "@/components/SearchSuggestions";
import { SearchHistory } from "@/components/SearchHistory";
import { TrendChart } from "@/components/TrendChart";
import { ComparisonChart } from "@/components/ComparisonChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  Globe,
  TrendingUp,
  Clock,
  Heart,
  Bookmark,
  X,
  RefreshCw,
  Zap,
} from "lucide-react";

interface SearchFilters {
  query: string;
  region: string;
  timeRange: string;
  emotionType: string;
  source: string;
  sortBy: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  emotion: string;
  emotionIntensity: number;
  region: string;
  source: string;
  date: string;
  relevance: number;
  isSaved: boolean;
}

export default function SearchPageUpdated() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    region: "global",
    timeRange: "24h",
    emotionType: "all",
    source: "all",
    sortBy: "relevance",
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [isCached, setIsCached] = useState(false);

  // Create cache key based on filters
  const cacheKey = `search_${JSON.stringify(filters)}`;

  // Fetch search results with caching
  const fetchSearchResults = useCallback(async () => {
    if (!filters.query) return [];

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [filters]);

  // Use cached analysis data
  const { data: cachedResults, isLoading: isFetching, refresh } = useCachedAnalysisData(
    cacheKey,
    fetchSearchResults,
    { ttl: 10 * 60 * 1000 } // 10 minutes cache
  );

  // Update search results when cached data changes
  useEffect(() => {
    if (cachedResults) {
      setSearchResults(cachedResults);
      setIsCached(true);
    }
  }, [cachedResults]);

  const handleSearch = async () => {
    if (!filters.query.trim()) return;

    // Add to search history
    setSearchHistory(prev => {
      const updated = [filters.query, ...prev.filter(q => q !== filters.query)].slice(0, 10);
      return updated;
    });

    // Trigger search with cache
    await refresh();
  };

  const handleSaveResult = (id: string) => {
    setSearchResults(prev =>
      prev.map(result =>
        result.id === id ? { ...result, isSaved: !result.isSaved } : result
      )
    );
    setSavedSearches(prev => [...new Set([...prev, id])]);
  };

  const handleClearCache = () => {
    setSearchResults([]);
    setIsCached(false);
  };

  const handleQuickSearch = (query: string) => {
    setFilters({ ...filters, query });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Search className="h-8 w-8 text-purple-500" />
            البحث المتقدم
          </h1>
          <p className="text-muted-foreground">ابحث عن الموضوعات والعواطف والاتجاهات العالمية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-slate-700/50 sticky top-20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  الفلاتر
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">البحث</label>
                  <Input
                    placeholder="ابحث عن موضوع..."
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                {/* Region Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">المنطقة</label>
                  <Select
                    value={filters.region}
                    onValueChange={(value) =>
                      setFilters({ ...filters, region: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">عالمي</SelectItem>
                      <SelectItem value="mena">الشرق الأوسط وشمال أفريقيا</SelectItem>
                      <SelectItem value="asia">آسيا</SelectItem>
                      <SelectItem value="europe">أوروبا</SelectItem>
                      <SelectItem value="americas">الأمريكتان</SelectItem>
                      <SelectItem value="africa">أفريقيا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">الفترة الزمنية</label>
                  <Select
                    value={filters.timeRange}
                    onValueChange={(value) =>
                      setFilters({ ...filters, timeRange: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                      <SelectItem value="7d">آخر أسبوع</SelectItem>
                      <SelectItem value="30d">آخر شهر</SelectItem>
                      <SelectItem value="90d">آخر 3 أشهر</SelectItem>
                      <SelectItem value="1y">آخر سنة</SelectItem>
                      <SelectItem value="all">كل الوقت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Emotion Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">نوع العاطفة</label>
                  <Select
                    value={filters.emotionType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, emotionType: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العواطف</SelectItem>
                      <SelectItem value="positive">إيجابية</SelectItem>
                      <SelectItem value="negative">سلبية</SelectItem>
                      <SelectItem value="neutral">محايدة</SelectItem>
                      <SelectItem value="mixed">مختلطة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Source Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">المصدر</label>
                  <Select
                    value={filters.source}
                    onValueChange={(value) =>
                      setFilters({ ...filters, source: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المصادر</SelectItem>
                      <SelectItem value="news">الأخبار</SelectItem>
                      <SelectItem value="social">وسائل التواصل</SelectItem>
                      <SelectItem value="forums">المنتديات</SelectItem>
                      <SelectItem value="blogs">المدونات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">ترتيب</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">الملاءمة</SelectItem>
                      <SelectItem value="recent">الأحدث</SelectItem>
                      <SelectItem value="trending">الأكثر اتجاهاً</SelectItem>
                      <SelectItem value="emotion">قوة العاطفة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isFetching}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isFetching ? 'جاري البحث...' : 'بحث'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setFilters({
                        query: filters.query,
                        region: "global",
                        timeRange: "24h",
                        emotionType: "all",
                        source: "all",
                        sortBy: "relevance",
                      })
                    }
                  >
                    إعادة تعيين الفلاتر
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Cache Status */}
            {isCached && !isFetching && (
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-blue-400 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    النتائج مأخوذة من الذاكرة المؤقتة (تم التحديث قبل قليل)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isFetching && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-muted-foreground">جاري البحث...</p>
              </div>
            )}

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    النتائج ({searchResults.length})
                  </h3>
                  {isCached && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCache}
                      className="text-xs"
                    >
                      <X className="h-4 w-4 mr-1" />
                      مسح الذاكرة المؤقتة
                    </Button>
                  )}
                </div>
                {searchResults.map((result) => (
                  <Card key={result.id} className="border-slate-700/50 hover:border-slate-600/80 transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg hover:text-purple-400 cursor-pointer">
                            {result.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            {result.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSaveResult(result.id)}
                          className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition"
                        >
                          <Bookmark
                            className={`h-5 w-5 ${
                              result.isSaved
                                ? "fill-purple-500 text-purple-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge>{result.emotion}</Badge>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${result.emotionIntensity}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {result.emotionIntensity}%
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {result.region}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {result.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          الملاءمة: {result.relevance}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isFetching && searchResults.length === 0 && filters.query && (
              <Card className="border-slate-700/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لم يتم العثور على نتائج</p>
                </CardContent>
              </Card>
            )}

            {/* Initial State */}
            {!isFetching && searchResults.length === 0 && !filters.query && (
              <Card className="border-slate-700/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">ابدأ البحث عن موضوع يهمك</p>
                  {searchHistory.length > 0 && (
                    <div className="mt-6 text-left">
                      <p className="text-sm font-semibold mb-3">البحوث السابقة:</p>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((query, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickSearch(query)}
                            className="text-xs"
                          >
                            {query}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
