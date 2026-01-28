import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface HistoricalDataPoint {
  timestamp: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

interface CountryHistoricalChartProps {
  countryName: string;
  data: Array<{
    timestamp: Date;
    gmi: number;
    cfi: number;
    hri: number;
    confidence: number;
  }>;
  chartType?: 'line' | 'area';
}

export function CountryHistoricalChart({
  countryName,
  data,
  chartType = 'line',
}: CountryHistoricalChartProps) {
  // Format data for recharts
  const formattedData: HistoricalDataPoint[] = data.map((point) => ({
    timestamp: point.timestamp instanceof Date
      ? point.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : String(point.timestamp),
    gmi: point.gmi,
    cfi: point.cfi,
    hri: point.hri,
    confidence: point.confidence,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="cosmic-card p-3 text-xs">
          <p className="font-semibold text-accent">{data.timestamp}</p>
          <p className="text-purple-400">GMI: {data.gmi}</p>
          <p className="text-cyan-400">CFI: {data.cfi}</p>
          <p className="text-green-400">HRI: {data.hri}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="cosmic-card p-6 w-full">
      <h3 className="text-lg font-bold cosmic-text mb-4">{countryName} - Historical Trends</h3>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'area' ? (
          <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGMI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCFI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHRI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" domain={[-100, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="gmi"
              stroke="#a78bfa"
              fillOpacity={1}
              fill="url(#colorGMI)"
              name="GMI"
            />
            <Area
              type="monotone"
              dataKey="cfi"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#colorCFI)"
              name="CFI"
            />
            <Area
              type="monotone"
              dataKey="hri"
              stroke="#4ade80"
              fillOpacity={1}
              fill="url(#colorHRI)"
              name="HRI"
            />
          </AreaChart>
        ) : (
          <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" domain={[-100, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="gmi"
              stroke="#a78bfa"
              dot={false}
              strokeWidth={2}
              name="GMI"
            />
            <Line
              type="monotone"
              dataKey="cfi"
              stroke="#06b6d4"
              dot={false}
              strokeWidth={2}
              name="CFI"
            />
            <Line
              type="monotone"
              dataKey="hri"
              stroke="#4ade80"
              dot={false}
              strokeWidth={2}
              name="HRI"
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-purple-900/20 rounded-lg">
          <p className="text-muted-foreground">GMI Range</p>
          <p className="text-lg font-semibold text-purple-400">
            {Math.min(...data.map((d) => d.gmi))} to {Math.max(...data.map((d) => d.gmi))}
          </p>
        </div>
        <div className="p-3 bg-cyan-900/20 rounded-lg">
          <p className="text-muted-foreground">CFI Range</p>
          <p className="text-lg font-semibold text-cyan-400">
            {Math.min(...data.map((d) => d.cfi))} to {Math.max(...data.map((d) => d.cfi))}
          </p>
        </div>
        <div className="p-3 bg-green-900/20 rounded-lg">
          <p className="text-muted-foreground">HRI Range</p>
          <p className="text-lg font-semibold text-green-400">
            {Math.min(...data.map((d) => d.hri))} to {Math.max(...data.map((d) => d.hri))}
          </p>
        </div>
      </div>
    </Card>
  );
}
