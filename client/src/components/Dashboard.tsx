/**
 * Dashboard Component
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MetricData {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  description: string;
}

interface DashboardProps {
  metrics?: {
    gmi: MetricData;
    cfi: MetricData;
    hri: MetricData;
  };
}

export function Dashboard({ metrics }: DashboardProps) {
  const defaultMetrics = {
    gmi: {
      label: 'Global Mood Index',
      value: 65,
      previousValue: 62,
      unit: '%',
      description: '  '
    },
    cfi: {
      label: 'Collective Feeling Index',
      value: 72,
      previousValue: 70,
      unit: '%',
      description: '  '
    },
    hri: {
      label: 'Hope Resonance Index',
      value: 58,
      previousValue: 60,
      unit: '%',
      description: '  '
    }
  };

  const displayMetrics = metrics || defaultMetrics;

  const MetricCard = ({ metric, icon }: { metric: MetricData; icon: React.ReactNode }) => {
    const trend = metric.value > metric.previousValue ? 'up' : metric.value < metric.previousValue ? 'down' : 'stable';
    const change = Math.abs(metric.value - metric.previousValue);

    return (
      <Card className="border-gray-300 bg-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-black">{icon}</div>
              <Badge
                variant="outline"
                className={`border-gray-300 ${
                  trend === 'up'
                    ? 'bg-gray-100 text-black'
                    : trend === 'down'
                    ? 'bg-gray-100 text-black'
                    : 'bg-white text-gray-700'
                }`}
              >
                {trend === 'up' && (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{change}%
                  </>
                )}
                {trend === 'down' && (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -{change}%
                  </>
                )}
                {trend === 'stable' && ''}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">{metric.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-black">{metric.value}</span>
                <span className="text-gray-600">{metric.unit}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-black"
                style={{ width: `${metric.value}%` }}
              />
            </div>

            {/* Comparison */}
            <div className="pt-2 border-t border-gray-300">
              <p className="text-xs text-gray-600">
                : <span className="font-semibold text-black">{metric.previousValue}%</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Indicators */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-black"> </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <MetricCard
            metric={displayMetrics.gmi}
            icon={<Activity className="h-6 w-6" />}
          />
          <MetricCard
            metric={displayMetrics.cfi}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <MetricCard
            metric={displayMetrics.hri}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 border border-gray-300">
          <TabsTrigger value="overview" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
            
          </TabsTrigger>
          <TabsTrigger value="regions" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
            
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="text-black"> </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: ' Analysis', value: '10,234' },
                  { label: ' ', value: '5,432' },
                  { label: ' ', value: '94%' },
                  { label: '  ', value: '1.2 ' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-300">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-bold text-black">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="text-black"> </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { trend: ' ', change: '+5%', time: '  24 ' },
                  { trend: ' Confidence', change: '0%', time: '  48 ' },
                  { trend: ' ', change: '-3%', time: '  ' },
                  { trend: ' ', change: '+7%', time: '  ' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-300">
                    <div>
                      <p className="font-medium text-black">{item.trend}</p>
                      <p className="text-xs text-gray-600">{item.time}</p>
                    </div>
                    <span className="font-bold text-black">{item.change}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card className="border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="text-black"> </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { region: ' ', gmi: 68, cfi: 75, hri: 62 },
                  { region: '', gmi: 62, cfi: 70, hri: 55 },
                  { region: '', gmi: 70, cfi: 72, hri: 60 },
                  { region: '', gmi: 65, cfi: 68, hri: 58 }
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-300">
                    <p className="font-medium text-black mb-2">{item.region}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-600">GMI</p>
                        <p className="font-bold text-black">{item.gmi}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">CFI</p>
                        <p className="font-bold text-black">{item.cfi}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">HRI</p>
                        <p className="font-bold text-black">{item.hri}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
