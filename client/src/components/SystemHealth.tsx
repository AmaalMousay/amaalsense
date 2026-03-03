/**
 * SYSTEM HEALTH COMPONENT
 * 
 * صحة النظام
 * - مراقبة الأداء
 * - التنبيهات الفورية
 * - السجلات التاريخية
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Zap, Database, Server, Clock } from 'lucide-react';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: number;
  history: number[];
  lastUpdated: Date;
}

interface SystemHealthProps {
  userId?: string;
  onAlert?: (alert: string) => void;
}

export function SystemHealth({
  userId,
  onAlert
}: SystemHealthProps) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      name: 'استخدام CPU',
      status: 'healthy',
      value: 45,
      unit: '%',
      threshold: 80,
      history: [42, 44, 45, 46, 45, 44, 45],
      lastUpdated: new Date()
    },
    {
      name: 'استخدام الذاكرة',
      status: 'warning',
      value: 72,
      unit: '%',
      threshold: 80,
      history: [65, 68, 70, 71, 72, 72, 72],
      lastUpdated: new Date()
    },
    {
      name: 'توفر قاعدة البيانات',
      status: 'healthy',
      value: 99.9,
      unit: '%',
      threshold: 99,
      history: [99.9, 99.9, 99.8, 99.9, 99.9, 99.9, 99.9],
      lastUpdated: new Date()
    },
    {
      name: 'سرعة الاستجابة',
      status: 'healthy',
      value: 125,
      unit: 'ms',
      threshold: 500,
      history: [120, 122, 125, 128, 125, 123, 125],
      lastUpdated: new Date()
    },
    {
      name: 'معدل الخطأ',
      status: 'healthy',
      value: 0.02,
      unit: '%',
      threshold: 1,
      history: [0.01, 0.02, 0.02, 0.01, 0.02, 0.02, 0.02],
      lastUpdated: new Date()
    },
    {
      name: 'مساحة التخزين',
      status: 'critical',
      value: 92,
      unit: '%',
      threshold: 85,
      history: [78, 82, 86, 89, 90, 91, 92],
      lastUpdated: new Date()
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics(prevMetrics =>
        prevMetrics.map(metric => {
          const change = (Math.random() - 0.5) * 2;
          const newValue = Math.max(0, metric.value + change);
          let newStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

          if (newValue > metric.threshold * 1.1) {
            newStatus = 'critical';
          } else if (newValue > metric.threshold * 0.9) {
            newStatus = 'warning';
          }

          return {
            ...metric,
            value: Math.round(newValue * 100) / 100,
            status: newStatus,
            history: [...metric.history.slice(1), newValue],
            lastUpdated: new Date()
          };
        })
      );
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrend = (history: number[]) => {
    if (history.length < 2) return 0;
    return history[history.length - 1] - history[0];
  };

  const criticalCount = metrics.filter(m => m.status === 'critical').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const healthyCount = metrics.filter(m => m.status === 'healthy').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">صحة النظام</h2>
          <p className="text-sm text-gray-600 mt-1">
            مراقبة فعلية لأداء وصحة النظام
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">تحديث فوري</span>
          </label>
          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="px-2 py-1 rounded border border-gray-300 text-sm"
            >
              <option value="5">كل 5 ثوان</option>
              <option value="10">كل 10 ثوان</option>
              <option value="30">كل 30 ثانية</option>
              <option value="60">كل دقيقة</option>
            </select>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">سليم</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{healthyCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4 border border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تحذير</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{warningCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4 border border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">حرج</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, idx) => {
          const trend = getTrend(metric.history);
          const trendPercent = ((trend / metric.history[0]) * 100).toFixed(1);

          return (
            <Card
              key={idx}
              className={`p-6 border-2 ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {metric.name === 'استخدام CPU' && <Zap className="w-5 h-5 text-gray-600" />}
                    {metric.name === 'مساحة التخزين' && <Database className="w-5 h-5 text-gray-600" />}
                    {metric.name === 'استخدام الذاكرة' && <Server className="w-5 h-5 text-gray-600" />}
                    {!['استخدام CPU', 'مساحة التخزين', 'استخدام الذاكرة'].includes(metric.name) && (
                      <Activity className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{metric.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      الحد الأقصى: {metric.threshold}{metric.unit}
                    </p>
                  </div>
                </div>
                {getStatusIcon(metric.status)}
              </div>

              {/* Value Display */}
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-3xl font-bold text-black">
                    {metric.value}{metric.unit}
                  </p>
                  <Badge className={`text-xs ${getStatusBadge(metric.status)}`}>
                    {metric.status === 'healthy' && 'سليم'}
                    {metric.status === 'warning' && 'تحذير'}
                    {metric.status === 'critical' && 'حرج'}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metric.status === 'healthy'
                        ? 'bg-green-500'
                        : metric.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  {trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <span className={trend > 0 ? 'text-red-600' : 'text-green-600'}>
                    {trend > 0 ? '+' : ''}{trendPercent}%
                  </span>
                </div>
                <span className="text-gray-600 text-xs">
                  آخر تحديث: {metric.lastUpdated.toLocaleTimeString('ar-SA')}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {(criticalCount > 0 || warningCount > 0) && (
        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            التنبيهات النشطة
          </h3>

          <div className="space-y-2">
            {metrics
              .filter(m => m.status !== 'healthy')
              .map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                  <div>
                    <p className="text-sm font-medium text-black">{metric.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      القيمة الحالية: {metric.value}{metric.unit} (الحد: {metric.threshold}{metric.unit})
                    </p>
                  </div>
                  <Badge className={`text-xs ${getStatusBadge(metric.status)}`}>
                    {metric.status === 'warning' ? 'تحذير' : 'حرج'}
                  </Badge>
                </div>
              ))}
          </div>

          <Button className="w-full mt-4 gap-2 bg-red-600 text-white hover:bg-red-700">
            <AlertTriangle className="w-4 h-4" />
            اتخاذ إجراء
          </Button>
        </Card>
      )}

      {/* System Info */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          معلومات النظام
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600">الإصدار</p>
            <p className="text-sm font-medium text-black mt-1">v2.4.1</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">وقت التشغيل</p>
            <p className="text-sm font-medium text-black mt-1">45 يوم 12 ساعة</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">البيئة</p>
            <p className="text-sm font-medium text-black mt-1">الإنتاج</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">معالج</p>
            <p className="text-sm font-medium text-black mt-1">Intel Xeon</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">الذاكرة الكلية</p>
            <p className="text-sm font-medium text-black mt-1">64 GB</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">التخزين الكلي</p>
            <p className="text-sm font-medium text-black mt-1">2 TB</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
