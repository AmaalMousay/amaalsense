/**
 * Temporal Comparison Component - Feature #3
 * Allows users to compare emotional indices across two time periods
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export interface TemporalData {
  timestamp: number;
  gmi: number;
  cfi: number;
  hri: number;
  topic?: string;
  country?: string;
}

export interface TemporalComparisonProps {
  data: TemporalData[];
  onDateRangeChange?: (from: number, to: number) => void;
}

interface DateRange {
  label: string;
  start: number;
  end: number;
}

export const TemporalComparison: React.FC<TemporalComparisonProps> = ({ data, onDateRangeChange }) => {
  const [period1, setPeriod1] = useState<DateRange | null>(null);
  const [period2, setPeriod2] = useState<DateRange | null>(null);
  const [comparisonType, setComparisonType] = useState<'overlay' | 'side-by-side'>('overlay');

  // Generate date range options (last 7 days, 30 days, 90 days, 1 year)
  const dateRangeOptions: DateRange[] = useMemo(() => {
    const now = Date.now();
    return [
      {
        label: 'Last 7 Days',
        start: now - 7 * 24 * 60 * 60 * 1000,
        end: now,
      },
      {
        label: 'Last 30 Days',
        start: now - 30 * 24 * 60 * 60 * 1000,
        end: now,
      },
      {
        label: 'Last 90 Days',
        start: now - 90 * 24 * 60 * 60 * 1000,
        end: now,
      },
      {
        label: 'Last Year',
        start: now - 365 * 24 * 60 * 60 * 1000,
        end: now,
      },
    ];
  }, []);

  // Filter data for each period
  const period1Data = useMemo(() => {
    if (!period1) return [];
    return data.filter(d => d.timestamp >= period1.start && d.timestamp <= period1.end);
  }, [data, period1]);

  const period2Data = useMemo(() => {
    if (!period2) return [];
    return data.filter(d => d.timestamp >= period2.start && d.timestamp <= period2.end);
  }, [data, period2]);

  // Calculate statistics
  const calculateStats = (periodData: TemporalData[]) => {
    if (periodData.length === 0) {
      return { gmi: 0, cfi: 0, hri: 0, avgGmi: 0, avgCfi: 0, avgHri: 0 };
    }

    const avgGmi = periodData.reduce((sum, d) => sum + d.gmi, 0) / periodData.length;
    const avgCfi = periodData.reduce((sum, d) => sum + d.cfi, 0) / periodData.length;
    const avgHri = periodData.reduce((sum, d) => sum + d.hri, 0) / periodData.length;

    return {
      gmi: periodData[periodData.length - 1].gmi,
      cfi: periodData[periodData.length - 1].cfi,
      hri: periodData[periodData.length - 1].hri,
      avgGmi,
      avgCfi,
      avgHri,
    };
  };

  const stats1 = calculateStats(period1Data);
  const stats2 = calculateStats(period2Data);

  // Calculate changes
  const calculateChange = (old: number, new_: number) => {
    if (old === 0) return 0;
    return ((new_ - old) / old) * 100;
  };

  const gmiChange = calculateChange(stats1.avgGmi, stats2.avgGmi);
  const cfiChange = calculateChange(stats1.avgCfi, stats2.avgCfi);
  const hriChange = calculateChange(stats1.avgHri, stats2.avgHri);

  // Prepare chart data for overlay
  const overlayData = useMemo(() => {
    const combined: any[] = [];
    
    // Add period 1 data
    period1Data.forEach((d, i) => {
      combined.push({
        time: i,
        period1_gmi: d.gmi,
        period1_cfi: d.cfi,
        period1_hri: d.hri,
      });
    });

    // Add period 2 data
    period2Data.forEach((d, i) => {
      if (combined[i]) {
        combined[i].period2_gmi = d.gmi;
        combined[i].period2_cfi = d.cfi;
        combined[i].period2_hri = d.hri;
      } else {
        combined.push({
          time: i,
          period2_gmi: d.gmi,
          period2_cfi: d.cfi,
          period2_hri: d.hri,
        });
      }
    });

    return combined;
  }, [period1Data, period2Data]);

  const renderChangeIndicator = (change: number) => {
    if (change > 0) {
      return <span className="text-green-600 font-semibold">↑ +{change.toFixed(1)}%</span>;
    } else if (change < 0) {
      return <span className="text-red-600 font-semibold">↓ {change.toFixed(1)}%</span>;
    } else {
      return <span className="text-gray-600 font-semibold">→ 0%</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Time Periods to Compare</CardTitle>
          <CardDescription>Choose two periods to analyze emotional trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Period 1 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Period 1</label>
              <div className="flex flex-wrap gap-2">
                {dateRangeOptions.map((range) => (
                  <Button
                    key={range.label}
                    variant={period1?.label === range.label ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setPeriod1(range);
                      onDateRangeChange?.(range.start, range.end);
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Period 2 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Period 2</label>
              <div className="flex flex-wrap gap-2">
                {dateRangeOptions.map((range) => (
                  <Button
                    key={range.label}
                    variant={period2?.label === range.label ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setPeriod2(range);
                      onDateRangeChange?.(range.start, range.end);
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Display Type</label>
            <div className="flex gap-2">
              <Button
                variant={comparisonType === 'overlay' ? 'default' : 'outline'}
                onClick={() => setComparisonType('overlay')}
              >
                Overlay
              </Button>
              <Button
                variant={comparisonType === 'side-by-side' ? 'default' : 'outline'}
                onClick={() => setComparisonType('side-by-side')}
              >
                Side by Side
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Comparison */}
      {period1 && period2 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
            <CardDescription>
              {period1.label} vs {period2.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GMI Comparison */}
              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Global Mood Index (GMI)</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Period 1</p>
                        <p className="text-lg font-bold">{stats1.avgGmi.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Period 2</p>
                        <p className="text-lg font-bold">{stats2.avgGmi.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      {renderChangeIndicator(gmiChange)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CFI Comparison */}
              <Card className="bg-orange-50 dark:bg-orange-900/20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Collective Fear Index (CFI)</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Period 1</p>
                        <p className="text-lg font-bold">{stats1.avgCfi.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Period 2</p>
                        <p className="text-lg font-bold">{stats2.avgCfi.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      {renderChangeIndicator(cfiChange)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* HRI Comparison */}
              <Card className="bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Hope Resilience Index (HRI)</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Period 1</p>
                        <p className="text-lg font-bold">{stats1.avgHri.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Period 2</p>
                        <p className="text-lg font-bold">{stats2.avgHri.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      {renderChangeIndicator(hriChange)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      {period1 && period2 && overlayData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {comparisonType === 'overlay' ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={overlayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="period1_gmi" stroke="#3b82f6" name="Period 1 - GMI" />
                  <Line type="monotone" dataKey="period2_gmi" stroke="#1e40af" name="Period 2 - GMI" />
                  <Line type="monotone" dataKey="period1_cfi" stroke="#f97316" name="Period 1 - CFI" />
                  <Line type="monotone" dataKey="period2_cfi" stroke="#c2410c" name="Period 2 - CFI" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={[
                  {
                    name: 'GMI',
                    'Period 1': stats1.avgGmi,
                    'Period 2': stats2.avgGmi,
                  },
                  {
                    name: 'CFI',
                    'Period 1': stats1.avgCfi,
                    'Period 2': stats2.avgCfi,
                  },
                  {
                    name: 'HRI',
                    'Period 1': stats1.avgHri,
                    'Period 2': stats2.avgHri,
                  },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Period 1" fill="#3b82f6" />
                  <Bar dataKey="Period 2" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {(!period1 || !period2) && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-4">
            <p className="text-yellow-700 dark:text-yellow-300">
              Select two time periods to see the comparison
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemporalComparison;
