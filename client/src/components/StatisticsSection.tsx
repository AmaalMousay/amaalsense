/**
 * Statistics Section Component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Globe, TrendingUp } from 'lucide-react';

interface StatisticItem {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface StatisticsSectionProps {
  statistics?: StatisticItem[];
}

export function StatisticsSection({ statistics }: StatisticsSectionProps) {
  const defaultStatistics: StatisticItem[] = [
    {
      label: ' ',
      value: 195,
      description: '  ',
      icon: <Globe className="h-6 w-6" />,
      color: 'text-blue-400'
    },
    {
      label: ' ',
      value: '50K+',
      description: '  30 ',
      icon: <Users className="h-6 w-6" />,
      color: 'text-green-400'
    },
    {
      label: 'Analysis ',
      value: '10K+',
      description: 'Analysis ',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-purple-400'
    },
    {
      label: ' ',
      value: '94%',
      description: ' ',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-400'
    }
  ];

  const displayStatistics = statistics || defaultStatistics;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2"> AmalSense</h2>
        <p className="text-muted-foreground">    </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStatistics.map((stat, index) => (
          <Card
            key={index}
            className="border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-slate-600/80 transition"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Achievements */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle> Home</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: '   ',
                description: '  500     '
              },
              {
                title: 'Analysis ',
                description: '  Analysis    2 '
              },
              {
                title: ' ',
                description: '  94%   '
              },
              {
                title: ' ',
                description: ' 195   '
              }
            ].map((achievement, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30"
              >
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
