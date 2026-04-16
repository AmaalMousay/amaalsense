import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import {
  ArrowLeft, Search, X, BarChart3, Scale, Building2, DollarSign,
  Users, Heart, TrendingUp, TrendingDown, Clock, AlertTriangle,
  ChevronDown, Plus, Minus
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell
} from 'recharts';

const EVENT_COLORS = ['#E63946', '#457B9D', '#2A9D8F', '#F4A261', '#8D5CF6'];

function ComparisonIndexChart({ data, isRTL }: { data: any[]; isRTL: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis type="number" domain={[-100, 100]} fontSize={11} />
        <YAxis type="category" dataKey="metric" width={60} fontSize={11} />
        <Tooltip />
        <Legend />
        {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'metric').map((key, i) => (
          <Bar key={key} dataKey={key} fill={EVENT_COLORS[i % EVENT_COLORS.length]} radius={[0, 4, 4, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function ComparisonEmotionRadar({ data, isRTL }: { data: any[]; isRTL: boolean }) {
  const emotions = [
    { key: 'joy', label: isRTL ? 'فرح' : 'Joy' },
    { key: 'fear', label: isRTL ? 'خوف' : 'Fear' },
    { key: 'anger', label: isRTL ? 'غضب' : 'Anger' },
    { key: 'sadness', label: isRTL ? 'حزن' : 'Sadness' },
    { key: 'hope', label: isRTL ? 'أمل' : 'Hope' },
    { key: 'curiosity', label: isRTL ? 'فضول' : 'Curiosity' },
  ];

  const radarData = emotions.map(em => {
    const point: any = { emotion: em.label };
    data.forEach((d, i) => {
      point[d.name] = d[em.key];
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={radarData}>
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="emotion" fontSize={11} />
        <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
        {data.map((d, i) => (
          <Radar
            key={d.name}
            name={d.name}
            dataKey={d.name}
            stroke={EVENT_COLORS[i]}
            fill={EVENT_COLORS[i]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default function EventComparison() {
  const { language } = useI18n();
  const isRTL = language === 'ar';
  const [, navigate] = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(true);

  // Search for events
  const { data: searchResults } = trpc.historicalEvents.search.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: searchQuery.length > 2 }
  );

  // Compare selected events
  const { data: comparisonData, isLoading: isComparing } = trpc.historicalEvents.compare.useQuery(
    { eventNames: selectedEvents },
    { enabled: selectedEvents.length >= 2 }
  );

  const addEvent = (name: string) => {
    if (selectedEvents.length < 5 && !selectedEvents.includes(name)) {
      setSelectedEvents([...selectedEvents, name]);
      setSearchQuery('');
    }
  };

  const removeEvent = (name: string) => {
    setSelectedEvents(selectedEvents.filter(n => n !== name));
  };

  // Prepare chart data
  const indexChartData = useMemo(() => {
    if (!comparisonData?.comparison) return [];
    const metrics = [
      { key: 'gmi', label: 'GMI' },
      { key: 'cfi', label: 'CFI' },
      { key: 'hri', label: 'HRI' },
      { key: 'gdpImpact', label: 'GDP %' },
    ];
    return metrics.map(m => {
      const point: any = { metric: m.label };
      comparisonData.comparison!.indices.forEach((idx: any) => {
        const shortName = idx.name.length > 25 ? idx.name.substring(0, 25) + '...' : idx.name;
        point[shortName] = idx[m.key];
      });
      return point;
    });
  }, [comparisonData]);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/historical-events')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                {isRTL ? 'مقارنة الأحداث التاريخية' : 'Historical Event Comparison'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'قارن بين 2-5 أحداث تاريخية جنباً إلى جنب' : 'Compare 2-5 historical events side by side'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Event Selection */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isRTL ? 'اختر الأحداث للمقارنة (2-5)' : 'Select Events to Compare (2-5)'}
          </h3>

          {/* Selected events chips */}
          {selectedEvents.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedEvents.map((name, i) => (
                <span
                  key={name}
                  className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium text-white"
                  style={{ backgroundColor: EVENT_COLORS[i] }}
                >
                  {name.length > 30 ? name.substring(0, 30) + '...' : name}
                  <button onClick={() => removeEvent(name)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input */}
          {selectedEvents.length < 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن حدث لإضافته...' : 'Search for an event to add...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery.length > 2 && searchResults && searchResults.results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {searchResults.results
                    .filter((e: any) => !selectedEvents.includes(e.eventName))
                    .slice(0, 10)
                    .map((event: any) => (
                      <button
                        key={event.eventName}
                        className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm border-b last:border-0 flex items-center justify-between"
                        onClick={() => addEvent(event.eventName)}
                      >
                        <div>
                          <div className="font-medium">{event.eventName}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.country} - {new Date(event.eventDate).getFullYear()}
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-primary shrink-0" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {selectedEvents.length < 2 && (
            <p className="text-xs text-muted-foreground mt-2">
              {isRTL
                ? `اختر ${2 - selectedEvents.length} حدث/أحداث إضافية على الأقل للبدء بالمقارنة`
                : `Select at least ${2 - selectedEvents.length} more event(s) to start comparing`}
            </p>
          )}
        </Card>

        {/* Comparison Results */}
        {isComparing && (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                <div className="h-48 bg-muted rounded" />
              </Card>
            ))}
          </div>
        )}

        {comparisonData?.found && comparisonData.comparison && (
          <div className="space-y-6">
            {/* Indices Comparison Chart */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                {isRTL ? 'مقارنة المؤشرات' : 'Index Comparison'}
              </h3>
              <ComparisonIndexChart data={indexChartData} isRTL={isRTL} />
            </Card>

            {/* Emotional Radar */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                {isRTL ? 'مقارنة الأبعاد العاطفية' : 'Emotional Dimensions Comparison'}
              </h3>
              <ComparisonEmotionRadar data={comparisonData.comparison.emotions} isRTL={isRTL} />
            </Card>

            {/* Impacts Comparison Table */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                {isRTL ? 'مقارنة التأثيرات' : 'Impact Comparison'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">{isRTL ? 'النوع' : 'Type'}</th>
                      {comparisonData.comparison.impacts.map((imp: any, i: number) => (
                        <th key={imp.name} className="text-left p-2 font-semibold" style={{ color: EVENT_COLORS[i] }}>
                          {imp.name.length > 20 ? imp.name.substring(0, 20) + '...' : imp.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-500" />
                        {isRTL ? 'سياسي' : 'Political'}
                      </td>
                      {comparisonData.comparison.impacts.map((imp: any) => (
                        <td key={imp.name + 'pol'} className="p-2 text-muted-foreground">{imp.political}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-orange-500" />
                        {isRTL ? 'اقتصادي' : 'Economic'}
                      </td>
                      {comparisonData.comparison.impacts.map((imp: any) => (
                        <td key={imp.name + 'eco'} className="p-2 text-muted-foreground">{imp.economic}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-500" />
                        {isRTL ? 'اجتماعي' : 'Social'}
                      </td>
                      {comparisonData.comparison.impacts.map((imp: any) => (
                        <td key={imp.name + 'soc'} className="p-2 text-muted-foreground">{imp.social}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Outcomes Comparison */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                {isRTL ? 'مقارنة النتائج' : 'Outcomes Comparison'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">{isRTL ? 'المدى' : 'Term'}</th>
                      {comparisonData.comparison.outcomes.map((out: any, i: number) => (
                        <th key={out.name} className="text-left p-2 font-semibold" style={{ color: EVENT_COLORS[i] }}>
                          {out.name.length > 20 ? out.name.substring(0, 20) + '...' : out.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium text-orange-500">{isRTL ? 'قصير' : 'Short'}</td>
                      {comparisonData.comparison.outcomes.map((out: any) => (
                        <td key={out.name + 'st'} className="p-2 text-muted-foreground">{out.shortTerm}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium text-blue-500">{isRTL ? 'متوسط' : 'Medium'}</td>
                      {comparisonData.comparison.outcomes.map((out: any) => (
                        <td key={out.name + 'mt'} className="p-2 text-muted-foreground">{out.mediumTerm}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-green-500">{isRTL ? 'طويل' : 'Long'}</td>
                      {comparisonData.comparison.outcomes.map((out: any) => (
                        <td key={out.name + 'lt'} className="p-2 text-muted-foreground">{out.longTerm}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {selectedEvents.length >= 2 && !isComparing && !comparisonData?.found && (
          <Card className="p-12 text-center">
            <Scale className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? 'لم يتم العثور على بيانات كافية' : 'Not Enough Data Found'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'تأكد من اختيار أحداث موجودة في قاعدة البيانات' : 'Make sure selected events exist in the database'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
