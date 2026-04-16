import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { ArrowLeft, ArrowRight, TrendingUp, Zap, Heart, Calendar, Download, Activity, CheckCircle, XCircle, AlertTriangle, ChevronRight, MapPin, DollarSign, Building2, Users } from 'lucide-react';
import { 
  EMOTION_COLORS, 
  GMI_COLORS, 
  CFI_COLORS, 
  HRI_COLORS 
} from '@shared/emotionColors';
import { ExportButton } from '@/components/ExportButton';
import { LiveDashboardPreview } from '@/components/LiveDashboardPreview';
import { StatisticsSection } from '@/components/StatisticsSection';
import UsageQuota from '@/components/UsageQuota';
import { ExportData } from '@/components/ExportData';
import { LiveAlertSystem } from '@/components/LiveAlertSystem';
import { useI18n } from '@/i18n';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';

function RecentEventsWidget({ isRTL }: { isRTL: boolean }) {
  const { data } = trpc.historicalEvents.getAll.useQuery({ page: 1, limit: 5, sortBy: 'date', sortOrder: 'desc' });
  const events = data?.events || [];
  
  const CATEGORY_COLORS: Record<string, string> = {
    conflict: '#E63946', economic: '#F4A261', political: '#457B9D',
    social: '#8D5CF6', environmental: '#2A9D8F', health: '#E9C46A',
    technological: '#3B82F6', cultural: '#EC4899', humanitarian: '#F97316',
  };
  
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>;
  }
  
  return (
    <div className="space-y-3">
      {events.map((event: any, i: number) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border-l-3" style={{ borderLeftColor: CATEGORY_COLORS[event.eventCategory] || '#6C757D', borderLeftWidth: '3px' }}>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{event.eventName}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.eventDate).getFullYear()}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.country}</span>
            </div>
            {event.impacts && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {event.impacts.political && (
                  <div className="text-xs p-1.5 rounded bg-blue-500/10 text-blue-400 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{isRTL ? 'سياسي' : 'Political'}</span>
                  </div>
                )}
                {event.impacts.economic && (
                  <div className="text-xs p-1.5 rounded bg-orange-500/10 text-orange-400 truncate flex items-center gap-1">
                    <DollarSign className="w-3 h-3 shrink-0" />
                    <span className="truncate">{isRTL ? 'اقتصادي' : 'Economic'}</span>
                  </div>
                )}
                {event.impacts.social && (
                  <div className="text-xs p-1.5 rounded bg-purple-500/10 text-purple-400 truncate flex items-center gap-1">
                    <Users className="w-3 h-3 shrink-0" />
                    <span className="truncate">{isRTL ? 'اجتماعي' : 'Social'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: (event.estimatedGMI >= 50 ? '#2A9D8F' : '#E63946') + '20', color: event.estimatedGMI >= 50 ? '#2A9D8F' : '#E63946' }}>
              GMI {event.estimatedGMI}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SourceHealthWidget() {
  const { data: sourceHealth } = trpc.engine.getSourceHealth.useQuery(undefined, {
    refetchInterval: 60000,
  });
  const [, navigate] = useLocation();

  if (!sourceHealth) return null;

  const sources = sourceHealth.sources || [];
  const online = sources.filter((s: any) => s.status === 'online').length;
  const total = sources.length;

  return (
    <Card className="cosmic-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold">Data Sources</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/source-monitor')}>
          View All
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl font-bold">
          <span className="text-emerald-400">{online}</span>
          <span className="text-muted-foreground text-lg">/{total}</span>
        </div>
        <span className="text-sm text-muted-foreground">sources online</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${total > 0 ? (online / total) * 100 : 0}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {sources.slice(0, 5).map((source: any) => (
          <div key={source.id} className="flex items-center gap-1.5 text-xs">
            {source.status === 'online' ? (
              <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            ) : source.status === 'degraded' ? (
              <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
            )}
            <span className="truncate text-muted-foreground">{source.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState(24);
  const [indices, setIndices] = useState({ gmi: 0, cfi: 0, hri: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const { t, isRTL } = useI18n();

  // Fetch analysis data using unified hook
  const { data: analysisData, isLoading: analysisLoading, refetch: refetchAnalysis } = useAnalysisData({
    autoFetch: true,
    timeframe: 'week'
  });

  // Fetch latest indices
  const { data: latestIndices } = trpc.engine.getLatestIndices.useQuery();

  // Fetch historical data
  const { data: historicalIndices } = trpc.engine.getHistoricalIndices.useQuery(
    { hoursBack: timeRange },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  useEffect(() => {
    // Use analysisData if available, otherwise use latestIndices
    if (analysisData) {
      setIndices({
        gmi: analysisData.gmi || 0,
        cfi: analysisData.cfi || 0,
        hri: analysisData.hri || 0,
      });
    } else if (latestIndices) {
      setIndices({
        gmi: latestIndices.gmi || 0,
        cfi: latestIndices.cfi || 0,
        hri: latestIndices.hri || 0,
      });
    }
  }, [analysisData, latestIndices]);

  useEffect(() => {
    if (historicalIndices && historicalIndices.length > 0) {
      const formattedData = historicalIndices.map((item: any) => ({
        time: new Date(item.analyzedAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        gmi: item.gmi,
        cfi: item.cfi,
        hri: item.hri,
        timestamp: new Date(item.analyzedAt).getTime(),
      }));
      setChartData(formattedData);
    }
  }, [historicalIndices]);

  const timeRanges = [
    { label: '1H', value: 1 },
    { label: '6H', value: 6 },
    { label: '24H', value: 24 },
    { label: '7D', value: 168 },
  ];

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <BackArrow className="w-5 h-5" />
            <span>{t.common.back}</span>
          </button>
          <h1 className="text-2xl font-bold gradient-text">{t.nav.dashboard}</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chat')}
            >
              💬 Chat
            </Button>
            <ExportButton type="global" timeRange="24h" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container space-y-8">
          {/* Live Indices */}
          <div>
            <h2 className="text-3xl font-bold cosmic-text mb-6">{t.home.liveIndices}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <IndexCard
                title={`${t.indices.gmi} (GMI)`}
                value={indices.gmi}
                min={-100}
                max={100}
                unit=""
                description={t.indices.gmiDesc}
                icon={<TrendingUp />}
                indexType="gmi"
              />
              <IndexCard
                title={`${t.indices.cfi} (CFI)`}
                value={indices.cfi}
                min={0}
                max={100}
                unit=""
                description={t.indices.cfiDesc}
                icon={<Zap />}
                indexType="cfi"
              />
              <IndexCard
                title={`${t.indices.hri} (HRI)`}
                value={indices.hri}
                min={0}
                max={100}
                unit=""
                description={t.indices.hriDesc}
                icon={<Heart />}
                indexType="hri"
              />
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t.dashboard.timeRange}:</span>
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                variant={timeRange === range.value ? 'default' : 'outline'}
                className={timeRange === range.value ? 'glow-button text-white' : ''}
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Charts */}
          {chartData.length > 0 ? (
            <div className="space-y-6">
              {/* GMI Chart */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4">{t.indices.gmi} (GMI)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGmi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GMI_COLORS.positive} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GMI_COLORS.positive} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[-100, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.9)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="gmi"
                      stroke={GMI_COLORS.positive}
                      fillOpacity={1}
                      fill="url(#colorGmi)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* CFI & HRI Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cosmic-card p-6">
                  <h3 className="text-lg font-bold cosmic-text mb-4">{t.indices.cfi} (CFI)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(20, 20, 30, 0.9)',
                          border: '1px solid rgba(34, 211, 238, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cfi"
                        stroke={CFI_COLORS.medium}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="cosmic-card p-6">
                  <h3 className="text-lg font-bold cosmic-text mb-4">{t.indices.hri} (HRI)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(20, 20, 30, 0.9)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="hri"
                        stroke={HRI_COLORS.high}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Combined Chart */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4">{t.dashboard.allIndices}</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[-100, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.9)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="gmi"
                      stroke={GMI_COLORS.positive}
                      strokeWidth={2}
                      dot={false}
                      name="GMI"
                    />
                    <Line
                      type="monotone"
                      dataKey="cfi"
                      stroke={CFI_COLORS.medium}
                      strokeWidth={2}
                      dot={false}
                      name="CFI"
                    />
                    <Line
                      type="monotone"
                      dataKey="hri"
                      stroke={HRI_COLORS.high}
                      strokeWidth={2}
                      dot={false}
                      name="HRI"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </div>
          ) : (
            <Card className="cosmic-card p-8 text-center">
              <p className="text-muted-foreground">{t.common.loading}...</p>
            </Card>
          )}

          {/* Recent Historical Events */}
          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold cosmic-text flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {isRTL ? 'أحدث الأحداث التاريخية' : 'Recent Historical Events'}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/historical-events')}>
                {isRTL ? 'عرض الكل' : 'View All'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <RecentEventsWidget isRTL={isRTL} />
          </Card>

          {/* Source Health Widget */}
          <SourceHealthWidget />

          {/* Live Dashboard Preview */}
          <LiveDashboardPreview />

          {/* Statistics Section */}
          <StatisticsSection />

          {/* Usage Quota */}
          <div className="mt-6">
            <UsageQuota compact={false} language="en" />
          </div>

          {/* Live Alert System */}
          <div className="mt-6">
            <LiveAlertSystem />
          </div>

          {/* Export Data */}
          <div className="mt-6">
            <ExportData 
              title="Export Dashboard Data"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
