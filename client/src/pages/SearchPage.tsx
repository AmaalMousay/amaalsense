/**
 * صفحة البحث المتقدمة
 * Advanced Search Page
 * 
 * تتضمن:
 * - بحث متقدم مع فلاتر
 * - اقتراحات ذكية
 * - نتائج البحث
 * - حفظ البحث المفضل
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

// ============================================================================
// SEARCH FILTERS COMPONENT
// ============================================================================

interface SearchFilters {
  query: string;
  region: string;
  timeRange: string;
  emotionType: string;
  source: string;
  sortBy: string;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

function SearchFiltersPanel({ filters, onFiltersChange }: SearchFiltersProps) {
  return (
    <Card className="border-slate-700/50 h-fit sticky top-20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          الفلاتر
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Region Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">المنطقة</label>
          <Select
            value={filters.region}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, region: value })
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
              onFiltersChange({ ...filters, timeRange: value })
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
              onFiltersChange({ ...filters, emotionType: value })
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
              onFiltersChange({ ...filters, source: value })
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
              onFiltersChange({ ...filters, sortBy: value })
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

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            onFiltersChange({
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
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SEARCH RESULT CARD
// ============================================================================

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

interface SearchResultCardProps {
  result: SearchResult;
  onSave: (id: string) => void;
}

function SearchResultCard({ result, onSave }: SearchResultCardProps) {
  const emotionColors: Record<string, string> = {
    happy: "bg-yellow-500/20 text-yellow-700",
    sad: "bg-blue-500/20 text-blue-700",
    angry: "bg-red-500/20 text-red-700",
    neutral: "bg-gray-500/20 text-gray-700",
    excited: "bg-purple-500/20 text-purple-700",
    confused: "bg-orange-500/20 text-orange-700",
    frustrated: "bg-red-500/20 text-red-700",
  };

  const emotionEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
    excited: "🤩",
    confused: "😕",
    frustrated: "😤",
  };

  return (
    <Card className="border-slate-700/50 hover:border-slate-600/80 transition-all hover:shadow-lg hover:shadow-purple-500/10">
      <CardContent className="pt-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg hover:text-purple-400 cursor-pointer transition">
              {result.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {result.description}
            </p>
          </div>

          <button
            onClick={() => onSave(result.id)}
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

        {/* Emotion Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {emotionEmojis[result.emotion] || "😐"}
          </span>
          <Badge className={emotionColors[result.emotion] || ""}>
            {result.emotion}
          </Badge>
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

        {/* Metadata */}
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
            ملاءمة: {result.relevance}%
          </div>
          <Badge variant="secondary" className="text-xs">
            {result.source}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SEARCH SUGGESTIONS
// ============================================================================

interface SearchSuggestion {
  text: string;
  category: string;
  trending: boolean;
}

const searchSuggestions: SearchSuggestion[] = [
  { text: "الذكاء الاصطناعي", category: "تكنولوجيا", trending: true },
  { text: "المشاعر العالمية", category: "تحليل", trending: true },
  { text: "الأحداث الجارية", category: "أخبار", trending: false },
  { text: "الاقتصاد العالمي", category: "اقتصاد", trending: true },
  { text: "التغير المناخي", category: "بيئة", trending: false },
  { text: "الصحة العقلية", category: "صحة", trending: true },
];

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">الاقتراحات الشهيرة</h3>

      <div className="grid grid-cols-2 gap-3">
        {searchSuggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50 hover:border-slate-600/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{suggestion.text}</span>
              {suggestion.trending && (
                <TrendingUp className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {suggestion.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN SEARCH PAGE
// ============================================================================

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    region: "global",
    timeRange: "24h",
    emotionType: "all",
    source: "all",
    sortBy: "relevance",
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    {
      id: "1",
      title: "الذكاء الاصطناعي يغير مستقبل التعليم",
      description:
        "دراسة جديدة تظهر تأثير الذكاء الاصطناعي على طرق التعليس الحديثة...",
      emotion: "excited",
      emotionIntensity: 78,
      region: "الشرق الأوسط",
      source: "أخبار",
      date: "منذ 2 ساعة",
      relevance: 95,
      isSaved: false,
    },
    {
      id: "2",
      title: "قلق عالمي من تأثيرات تغير المناخ",
      description:
        "تقارير جديدة تؤكد تزايد القلق العالمي من التأثيرات السلبية للتغير المناخي...",
      emotion: "sad",
      emotionIntensity: 85,
      region: "عالمي",
      source: "وسائل التواصل",
      date: "منذ 4 ساعات",
      relevance: 88,
      isSaved: false,
    },
    {
      id: "3",
      title: "تفاؤل بشأن الاقتصاد العالمي",
      description:
        "المؤشرات الاقتصادية الأخيرة تظهر تحسناً ملحوظاً في الاقتصاد العالمي...",
      emotion: "happy",
      emotionIntensity: 72,
      region: "عالمي",
      source: "أخبار",
      date: "منذ 6 ساعات",
      relevance: 82,
      isSaved: false,
    },
  ]);

  const [savedResults, setSavedResults] = useState<Set<string>>(new Set());

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setFilters({ ...filters, query: searchQuery });
    // TODO: Call API to search
  };

  const handleSaveResult = (id: string) => {
    const newSaved = new Set(savedResults);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedResults(newSaved);

    // Update results
    setSearchResults(
      searchResults.map((result) =>
        result.id === id ? { ...result, isSaved: newSaved.has(id) } : result
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">بحث متقدم</h1>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث عن موضوع أو دولة أو حدث..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
                className="pl-10 py-6 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <SearchFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
              />

              {query === "" && (
                <SearchSuggestions onSuggestionClick={handleSearch} />
              )}
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            {query === "" ? (
              <div className="space-y-6">
                <Card className="border-slate-700/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <CardContent className="pt-12 pb-12 text-center space-y-4">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h2 className="text-2xl font-bold">ابدأ البحث</h2>
                    <p className="text-muted-foreground">
                      أدخل موضوعاً أو دولة لاستكشاف المشاعر والاتجاهات
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    نتائج البحث عن "{query}"
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {searchResults.length} نتيجة
                  </span>
                </div>

                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <SearchResultCard
                      key={result.id}
                      result={result}
                      onSave={handleSaveResult}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" disabled>
                    السابق
                  </Button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "outline"}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline">التالي</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
