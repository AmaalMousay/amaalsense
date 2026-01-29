import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, TrendingUp, Zap, Heart, Calendar, Download } from 'lucide-react';
import { ExportButton } from '@/components/ExportButton';
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

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState(24);
  const [indices, setIndices] = useState({ gmi: 0, cfi: 50, hri: 50 });
  const [chartData, setChartData] = useState<any[]>([]);
  const { t, isRTL } = useI18n();

  // Fetch latest indices
  const { data: latestIndices } = trpc.emotion.getLatestIndices.useQuery();

  // Fetch historical data
  const { data: historicalIndices } = trpc.emotion.getHistoricalIndices.useQuery(
    { hoursBack: timeRange },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  useEffect(() => {
    if (latestIndices) {
      setIndices({
        gmi: latestIndices.gmi || 0,
        cfi: latestIndices.cfi || 50,
        hri: latestIndices.hri || 50,
      });
    }
  }, [latestIndices]);

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
          <ExportButton type="global" timeRange="24h" />
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
                color="purple"
              />
              <IndexCard
                title={`${t.indices.cfi} (CFI)`}
                value={indices.cfi}
                min={0}
                max={100}
                unit=""
                description={t.indices.cfiDesc}
                icon={<Zap />}
                color="cyan"
              />
              <IndexCard
                title={`${t.indices.hri} (HRI)`}
                value={indices.hri}
                min={0}
                max={100}
                unit=""
                description={t.indices.hriDesc}
                icon={<Heart />}
                color="green"
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
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
                      stroke="#a855f7"
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
                        stroke="#22d3ee"
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
                        stroke="#22c55e"
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
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                      name="GMI"
                    />
                    <Line
                      type="monotone"
                      dataKey="cfi"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={false}
                      name="CFI"
                    />
                    <Line
                      type="monotone"
                      dataKey="hri"
                      stroke="#22c55e"
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
        </div>
      </div>
    </div>
  );
}
