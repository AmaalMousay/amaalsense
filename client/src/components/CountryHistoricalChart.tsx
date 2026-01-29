import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { 
  GMI_COLORS, 
  CFI_COLORS, 
  HRI_COLORS,
  withOpacity 
} from '@shared/emotionColors';

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
          <p style={{ color: GMI_COLORS.positive }}>GMI: {data.gmi}</p>
          <p style={{ color: CFI_COLORS.medium }}>CFI: {data.cfi}</p>
          <p style={{ color: HRI_COLORS.high }}>HRI: {data.hri}</p>
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
                <stop offset="5%" stopColor={GMI_COLORS.positive} stopOpacity={0.8} />
                <stop offset="95%" stopColor={GMI_COLORS.positive} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCFI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CFI_COLORS.medium} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CFI_COLORS.medium} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHRI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={HRI_COLORS.high} stopOpacity={0.8} />
                <stop offset="95%" stopColor={HRI_COLORS.high} stopOpacity={0} />
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
              stroke={GMI_COLORS.positive}
              fillOpacity={1}
              fill="url(#colorGMI)"
              name="GMI"
            />
            <Area
              type="monotone"
              dataKey="cfi"
              stroke={CFI_COLORS.medium}
              fillOpacity={1}
              fill="url(#colorCFI)"
              name="CFI"
            />
            <Area
              type="monotone"
              dataKey="hri"
              stroke={HRI_COLORS.high}
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
              stroke={GMI_COLORS.positive}
              dot={false}
              strokeWidth={2}
              name="GMI"
            />
            <Line
              type="monotone"
              dataKey="cfi"
              stroke={CFI_COLORS.medium}
              dot={false}
              strokeWidth={2}
              name="CFI"
            />
            <Line
              type="monotone"
              dataKey="hri"
              stroke={HRI_COLORS.high}
              dot={false}
              strokeWidth={2}
              name="HRI"
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Statistics - Using unified color system */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: withOpacity(GMI_COLORS.positive, 0.1) }}
        >
          <p className="text-muted-foreground">GMI Range</p>
          <p className="text-lg font-semibold" style={{ color: GMI_COLORS.positive }}>
            {Math.min(...data.map((d) => d.gmi))} to {Math.max(...data.map((d) => d.gmi))}
          </p>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: withOpacity(CFI_COLORS.medium, 0.1) }}
        >
          <p className="text-muted-foreground">CFI Range</p>
          <p className="text-lg font-semibold" style={{ color: CFI_COLORS.medium }}>
            {Math.min(...data.map((d) => d.cfi))} to {Math.max(...data.map((d) => d.cfi))}
          </p>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: withOpacity(HRI_COLORS.high, 0.1) }}
        >
          <p className="text-muted-foreground">HRI Range</p>
          <p className="text-lg font-semibold" style={{ color: HRI_COLORS.high }}>
            {Math.min(...data.map((d) => d.hri))} to {Math.max(...data.map((d) => d.hri))}
          </p>
        </div>
      </div>
    </Card>
  );
}
