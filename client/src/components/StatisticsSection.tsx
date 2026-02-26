/**
 * Statistics Section Component
 * قسم الإحصائيات
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
      label: 'دول مراقبة',
      value: 195,
      description: 'دول حول العالم',
      icon: <Globe className="h-6 w-6" />,
      color: 'text-blue-400'
    },
    {
      label: 'مستخدمين نشطين',
      value: '50K+',
      description: 'في آخر 30 يوم',
      icon: <Users className="h-6 w-6" />,
      color: 'text-green-400'
    },
    {
      label: 'تحليلات يومية',
      value: '10K+',
      description: 'تحليل يومي',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-purple-400'
    },
    {
      label: 'دقة التنبؤ',
      value: '94%',
      description: 'معدل الدقة',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-400'
    }
  ];

  const displayStatistics = statistics || defaultStatistics;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">إحصائيات AmalSense</h2>
        <p className="text-muted-foreground">معلومات حول نطاق وتأثير منصتنا</p>
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
          <CardTitle>الإنجازات الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'أكبر قاعدة بيانات عاطفية',
                description: 'أكثر من 500 مليون نقطة بيانات عاطفية مجمعة'
              },
              {
                title: 'تحليل فوري',
                description: 'معالجة البيانات والتحليل في أقل من 2 ثانية'
              },
              {
                title: 'دقة عالية',
                description: 'معدل دقة 94% في التنبؤ بالاتجاهات'
              },
              {
                title: 'تغطية عالمية',
                description: 'مراقبة 195 دولة بلغات متعددة'
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
