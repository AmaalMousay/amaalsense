import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import {
  Calendar, Globe, Search, Filter, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Shield, Heart, Brain, AlertTriangle,
  ArrowLeft, BarChart3, Clock, MapPin, Layers, Activity,
  Building2, Users, DollarSign, ChevronRight, Sparkles, X
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  conflict: '#E63946',
  economic: '#F4A261',
  political: '#457B9D',
  social: '#8D5CF6',
  environmental: '#2A9D8F',
  health: '#E9C46A',
  technological: '#3B82F6',
  cultural: '#EC4899',
  humanitarian: '#F97316',
};

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  conflict: { en: 'Conflict', ar: 'صراع' },
  economic: { en: 'Economic', ar: 'اقتصادي' },
  political: { en: 'Political', ar: 'سياسي' },
  social: { en: 'Social', ar: 'اجتماعي' },
  environmental: { en: 'Environmental', ar: 'بيئي' },
  health: { en: 'Health', ar: 'صحي' },
  technological: { en: 'Technological', ar: 'تكنولوجي' },
  cultural: { en: 'Cultural', ar: 'ثقافي' },
  humanitarian: { en: 'Humanitarian', ar: 'إنساني' },
};

function IndexBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${color}20`, color }}>
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function EmotionBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium w-8 text-right">{value}</span>
    </div>
  );
}

function ImpactSection({ icon: Icon, title, content, color }: { icon: any; title: string; content: string; color: string }) {
  return (
    <div className="p-3 rounded-lg border" style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-sm font-semibold" style={{ color }}>{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}

function EventCard({ event, isRTL }: { event: any; isRTL: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const categoryLabel = CATEGORY_LABELS[event.eventCategory]?.[isRTL ? 'ar' : 'en'] || event.eventCategory;
  const categoryColor = CATEGORY_COLORS[event.eventCategory] || '#6C757D';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: categoryColor }}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight mb-1">{event.eventName}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{event.eventDescription}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(event.eventDate).toLocaleDateString(isRTL ? 'ar-LY' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{event.country}</span>
          </div>
          {event.gdpImpact !== undefined && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>GDP: {event.gdpImpact > 0 ? '+' : ''}{event.gdpImpact}%</span>
            </div>
          )}
        </div>

        {/* Indices */}
        <div className="flex flex-wrap gap-2 mb-3">
          <IndexBadge label="GMI" value={event.estimatedGMI} color={event.estimatedGMI >= 50 ? '#2A9D8F' : '#E63946'} />
          <IndexBadge label="CFI" value={event.estimatedCFI} color={event.estimatedCFI >= 70 ? '#E63946' : event.estimatedCFI >= 40 ? '#F4A261' : '#2A9D8F'} />
          <IndexBadge label="HRI" value={event.estimatedHRI} color={event.estimatedHRI >= 50 ? '#2A9D8F' : '#E63946'} />
        </div>

        {/* Expand button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>{isRTL ? 'إخفاء التفاصيل' : 'Hide Details'} <ChevronUp className="w-3 h-3 ml-1" /></>
          ) : (
            <>{isRTL ? 'عرض التفاصيل والتأثيرات' : 'Show Details & Impacts'} <ChevronDown className="w-3 h-3 ml-1" /></>
          )}
        </Button>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            {/* Emotional Vector */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-500" />
                {isRTL ? 'الأبعاد العاطفية' : 'Emotional Dimensions'}
              </h4>
              <div className="space-y-1.5">
                <EmotionBar label={isRTL ? 'فرح' : 'Joy'} value={event.emotionalVector?.joy || 0} color="#2A9D8F" />
                <EmotionBar label={isRTL ? 'خوف' : 'Fear'} value={event.emotionalVector?.fear || 0} color="#F4A261" />
                <EmotionBar label={isRTL ? 'غضب' : 'Anger'} value={event.emotionalVector?.anger || 0} color="#E63946" />
                <EmotionBar label={isRTL ? 'حزن' : 'Sadness'} value={event.emotionalVector?.sadness || 0} color="#8D5CF6" />
                <EmotionBar label={isRTL ? 'أمل' : 'Hope'} value={event.emotionalVector?.hope || 0} color="#10B981" />
                <EmotionBar label={isRTL ? 'فضول' : 'Curiosity'} value={event.emotionalVector?.curiosity || 0} color="#E9C46A" />
              </div>
            </div>

            {/* Impacts */}
            {event.impacts && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-500" />
                  {isRTL ? 'التأثيرات' : 'Impacts'}
                </h4>
                <div className="grid gap-2">
                  {event.impacts.political && (
                    <ImpactSection
                      icon={Building2}
                      title={isRTL ? 'التأثيرات السياسية' : 'Political Impacts'}
                      content={event.impacts.political}
                      color="#457B9D"
                    />
                  )}
                  {event.impacts.economic && (
                    <ImpactSection
                      icon={DollarSign}
                      title={isRTL ? 'التأثيرات الاقتصادية' : 'Economic Impacts'}
                      content={event.impacts.economic}
                      color="#F4A261"
                    />
                  )}
                  {event.impacts.social && (
                    <ImpactSection
                      icon={Users}
                      title={isRTL ? 'التأثيرات الاجتماعية' : 'Social Impacts'}
                      content={event.impacts.social}
                      color="#8D5CF6"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Outcomes */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-500" />
                {isRTL ? 'النتائج' : 'Outcomes'}
              </h4>
              <div className="grid gap-2 text-xs">
                {event.shortTermOutcome && (
                  <div className="p-2 rounded bg-muted/50">
                    <span className="font-medium text-orange-500">{isRTL ? 'قصير المدى: ' : 'Short-term: '}</span>
                    <span className="text-muted-foreground">{event.shortTermOutcome}</span>
                  </div>
                )}
                {event.mediumTermOutcome && (
                  <div className="p-2 rounded bg-muted/50">
                    <span className="font-medium text-blue-500">{isRTL ? 'متوسط المدى: ' : 'Medium-term: '}</span>
                    <span className="text-muted-foreground">{event.mediumTermOutcome}</span>
                  </div>
                )}
                {event.longTermOutcome && (
                  <div className="p-2 rounded bg-muted/50">
                    <span className="font-medium text-green-500">{isRTL ? 'طويل المدى: ' : 'Long-term: '}</span>
                    <span className="text-muted-foreground">{event.longTermOutcome}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sources */}
            {event.sources && event.sources.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">{isRTL ? 'المصادر: ' : 'Sources: '}</span>
                {event.sources.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function HistoricalEvents() {
  const { language } = useI18n();
  const isRTL = language === 'ar';
  const [, navigate] = useLocation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'gmi' | 'cfi' | 'hri' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const pageSize = 20;

  // Queries
  const { data: filtersData } = trpc.historicalEvents.getFilters.useQuery();
  const { data: statsData } = trpc.historicalEvents.getStats.useQuery(undefined, { enabled: showStats });

  const { data: eventsData, isLoading } = trpc.historicalEvents.getAll.useQuery({
    page: currentPage,
    limit: pageSize,
    sortBy,
    sortOrder,
  });

  const { data: searchData, isLoading: isSearching } = trpc.historicalEvents.search.useQuery(
    { query: searchQuery, category: selectedCategory || undefined, country: selectedCountry || undefined },
    { enabled: searchQuery.length > 0 }
  );

  // Determine which events to show
  const events = searchQuery.length > 0 ? (searchData?.results || []) : (eventsData?.events || []);
  const totalEvents = searchQuery.length > 0 ? (searchData?.total || 0) : (eventsData?.pagination?.total || 0);
  const totalPages = eventsData?.pagination?.totalPages || 1;

  // Stats chart data
  const categoryChartData = useMemo(() => {
    if (!statsData) return [];
    return Object.entries(statsData.categoryDistribution).map(([key, value]) => ({
      name: CATEGORY_LABELS[key]?.[isRTL ? 'ar' : 'en'] || key,
      value: value as number,
      color: CATEGORY_COLORS[key] || '#6C757D',
    }));
  }, [statsData, isRTL]);

  const decadeChartData = useMemo(() => {
    if (!statsData) return [];
    return Object.entries(statsData.decadeDistribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        decade: key,
        count: value as number,
      }));
  }, [statsData]);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {isRTL ? 'الأحداث التاريخية' : 'Historical Events'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? `${totalEvents} حدث تاريخي موثق` : `${totalEvents} documented historical events`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/event-comparison')}
              >
                <Layers className="w-4 h-4 mr-1" />
                {isRTL ? 'مقارنة' : 'Compare'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/event-prediction')}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {isRTL ? 'تنبؤ' : 'Predict'}
              </Button>
              <Button
                variant={showStats ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                {isRTL ? 'إحصائيات' : 'Statistics'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Statistics Panel */}
        {showStats && statsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-300">
            {/* Total Events */}
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">{statsData.total}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'إجمالي الأحداث' : 'Total Events'}</div>
            </Card>
            {/* Average GMI */}
            <Card className="p-4">
              <div className="text-2xl font-bold" style={{ color: statsData.averageIndices.gmi >= 50 ? '#2A9D8F' : '#E63946' }}>
                {statsData.averageIndices.gmi}
              </div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'متوسط GMI' : 'Average GMI'}</div>
            </Card>
            {/* Average CFI */}
            <Card className="p-4">
              <div className="text-2xl font-bold text-orange-500">{statsData.averageIndices.cfi}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'متوسط CFI' : 'Average CFI'}</div>
            </Card>
            {/* Average HRI */}
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-500">{statsData.averageIndices.hri}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'متوسط HRI' : 'Average HRI'}</div>
            </Card>

            {/* Category Distribution Chart */}
            <Card className="p-4 md:col-span-2">
              <h3 className="text-sm font-semibold mb-3">{isRTL ? 'توزيع الفئات' : 'Category Distribution'}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Decade Distribution Chart */}
            <Card className="p-4 md:col-span-2">
              <h3 className="text-sm font-semibold mb-3">{isRTL ? 'توزيع العقود' : 'Events by Decade'}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={decadeChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="decade" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#457B9D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن حدث تاريخي...' : 'Search historical events...'}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-8 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">{isRTL ? 'جميع الفئات' : 'All Categories'}</option>
              {filtersData?.categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]?.[isRTL ? 'ar' : 'en'] || cat}
                </option>
              ))}
            </select>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[200px]"
            >
              <option value="">{isRTL ? 'جميع الدول' : 'All Countries'}</option>
              {filtersData?.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="date-desc">{isRTL ? 'الأحدث أولاً' : 'Newest First'}</option>
              <option value="date-asc">{isRTL ? 'الأقدم أولاً' : 'Oldest First'}</option>
              <option value="gmi-desc">{isRTL ? 'أعلى GMI' : 'Highest GMI'}</option>
              <option value="gmi-asc">{isRTL ? 'أقل GMI' : 'Lowest GMI'}</option>
              <option value="cfi-desc">{isRTL ? 'أعلى CFI' : 'Highest CFI'}</option>
              <option value="hri-desc">{isRTL ? 'أعلى HRI' : 'Highest HRI'}</option>
              <option value="name-asc">{isRTL ? 'أبجدي' : 'Alphabetical'}</option>
            </select>
          </div>

          {/* Active filters */}
          {(selectedCategory || selectedCountry || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQuery && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                  <Search className="w-3 h-3" /> "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory && (
                <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: `${CATEGORY_COLORS[selectedCategory]}20`, color: CATEGORY_COLORS[selectedCategory] }}>
                  {CATEGORY_LABELS[selectedCategory]?.[isRTL ? 'ar' : 'en']}
                  <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCountry && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {selectedCountry}
                  <button onClick={() => setSelectedCountry('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedCountry(''); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                {isRTL ? 'مسح الكل' : 'Clear all'}
              </button>
            </div>
          )}
        </Card>

        {/* Events List */}
        {(isLoading || isSearching) ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{isRTL ? 'لا توجد نتائج' : 'No Results Found'}</h3>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'جرب تغيير معايير البحث أو الفلترة' : 'Try changing your search or filter criteria'}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {events.map((event: any, index: number) => (
              <EventCard key={event.eventName + index} event={event} isRTL={isRTL} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!searchQuery && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              {isRTL ? 'السابق' : 'Previous'}
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              {isRTL ? 'التالي' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
