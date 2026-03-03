/**
 * SMART ALERTS COMPONENT
 * 
 * التنبيهات الذكية
 * - تنبيهات مخصصة بناءً على الأنماط
 * - توقعات ذكية
 * - إدارة قواعد التنبيهات
 */

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, TrendingUp, Eye, Trash2, Plus, Settings, Bell, CheckCircle } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  metric: 'gmi' | 'cfi' | 'hri' | 'emotion' | 'volatility';
  operator: '>' | '<' | '=' | 'change';
  topics: string[];
  regions: string[];
  isActive: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  createdDate: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

interface SmartAlert {
  id: string;
  ruleId: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  value: number;
  threshold: number;
  change: number;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

interface SmartAlertsProps {
  userId?: string;
  onAlertClick?: (alert: SmartAlert) => void;
}

export function SmartAlerts({
  userId,
  onAlertClick
}: SmartAlertsProps) {
  const [alerts, setAlerts] = useState<SmartAlert[]>([
    {
      id: 'alert-1',
      ruleId: 'rule-1',
      title: 'ارتفاع حاد في مؤشر الخوف الجماعي',
      message: 'ارتفع مؤشر الخوف الجماعي (CFI) بنسبة 15% في آخر ساعة',
      severity: 'critical',
      metric: 'CFI',
      value: 62.5,
      threshold: 50,
      change: 15,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      actionUrl: '/analysis/cfi'
    },
    {
      id: 'alert-2',
      ruleId: 'rule-2',
      title: 'تحسن في مؤشر الأمل والمرونة',
      message: 'ارتفع مؤشر الأمل والمرونة (HRI) بنسبة 8% في المنطقة الخليجية',
      severity: 'info',
      metric: 'HRI',
      value: 75.2,
      threshold: 70,
      change: 8,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true,
      actionUrl: '/analysis/hri'
    },
    {
      id: 'alert-3',
      ruleId: 'rule-3',
      title: 'موضوع جديد يكتسب زخماً',
      message: 'موضوع "التطورات التكنولوجية" يتصدر المحادثات مع زيادة 120% في الذكر',
      severity: 'warning',
      metric: 'Topic Momentum',
      value: 120,
      threshold: 100,
      change: 120,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false
    }
  ]);

  const [rules, setRules] = useState<AlertRule[]>([
    {
      id: 'rule-1',
      name: 'ارتفاع الخوف الجماعي',
      condition: 'CFI يرتفع بأكثر من 10%',
      threshold: 10,
      metric: 'cfi',
      operator: '>',
      topics: [],
      regions: [],
      isActive: true,
      frequency: 'instant',
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastTriggered: new Date(Date.now() - 5 * 60 * 1000),
      triggerCount: 12
    },
    {
      id: 'rule-2',
      name: 'تحسن الأمل والمرونة',
      condition: 'HRI يرتفع بأكثر من 5%',
      threshold: 5,
      metric: 'hri',
      operator: '>',
      topics: [],
      regions: ['الخليج'],
      isActive: true,
      frequency: 'daily',
      createdDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastTriggered: new Date(Date.now() - 15 * 60 * 1000),
      triggerCount: 8
    },
    {
      id: 'rule-3',
      name: 'موضوع جديد يكتسب زخماً',
      condition: 'موضوع يحصل على 100+ زيادة في الذكر',
      threshold: 100,
      metric: 'volatility',
      operator: '>',
      topics: [],
      regions: [],
      isActive: true,
      frequency: 'instant',
      createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
      triggerCount: 5
    }
  ]);

  const [showRuleForm, setShowRuleForm] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filterSeverity && alert.severity !== filterSeverity) return false;
      if (filterRead === 'unread' && alert.isRead) return false;
      if (filterRead === 'read' && !alert.isRead) return false;
      return true;
    });
  }, [alerts, filterSeverity, filterRead]);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">التنبيهات الذكية</h2>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount} تنبيهات جديدة {criticalCount > 0 && `(${criticalCount} حرجة)`}
          </p>
        </div>
        <Button className="gap-2 bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          قاعدة جديدة
        </Button>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black">التنبيهات الأخيرة</h3>
          <div className="flex gap-2">
            {['critical', 'warning', 'info'].map(severity => (
              <button
                key={severity}
                onClick={() => setFilterSeverity(filterSeverity === severity ? null : severity)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  filterSeverity === severity
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {severity === 'critical' && 'حرجة'}
                {severity === 'warning' && 'تحذير'}
                {severity === 'info' && 'معلومات'}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <Card
                key={alert.id}
                className={`p-4 border-l-4 cursor-pointer transition ${
                  alert.isRead
                    ? 'bg-gray-50 border-l-gray-300'
                    : `${getSeverityColor(alert.severity)} border-l-current`
                }`}
                onClick={() => {
                  handleMarkAsRead(alert.id);
                  onAlertClick?.(alert);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-black">{alert.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>📊 {alert.metric}: {alert.value}</span>
                        <span>📈 {alert.change > 0 ? '+' : ''}{alert.change}%</span>
                        <span>⏱️ {Math.floor((Date.now() - alert.timestamp.getTime()) / (1000 * 60))} دقيقة</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!alert.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(alert.id);
                        }}
                        className="p-2 rounded bg-black text-white hover:bg-gray-800 transition"
                        title="تحديد كمقروء"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlert(alert.id);
                      }}
                      className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 border border-gray-200 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">لا توجد تنبيهات حالياً</p>
            </Card>
          )}
        </div>
      </div>

      {/* Alert Rules Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-black">قواعد التنبيهات</h3>

        <div className="space-y-3">
          {rules.map(rule => (
            <Card key={rule.id} className="p-4 border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-black">{rule.name}</h4>
                    <Badge className={`text-xs ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rule.isActive ? 'مفعّلة' : 'معطّلة'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rule.condition}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>🔄 {rule.frequency === 'instant' ? 'فوري' : rule.frequency === 'daily' ? 'يومي' : 'أسبوعي'}</span>
                    <span>⚡ تم التشغيل {rule.triggerCount} مرة</span>
                    {rule.lastTriggered && (
                      <span>⏱️ آخر تشغيل: {Math.floor((Date.now() - rule.lastTriggered.getTime()) / (1000 * 60))} دقيقة</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      rule.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {rule.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                  <button
                    className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    title="تعديل"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <Card className="p-6 border border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-black mb-4">الإحصائيات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">إجمالي التنبيهات</p>
            <p className="text-2xl font-bold text-black mt-1">{alerts.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">غير مقروءة</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{unreadCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">القواعس النشطة</p>
            <p className="text-2xl font-bold text-black mt-1">
              {rules.filter(r => r.isActive).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">إجمالي التشغيلات</p>
            <p className="text-2xl font-bold text-black mt-1">
              {rules.reduce((sum, r) => sum + r.triggerCount, 0)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
