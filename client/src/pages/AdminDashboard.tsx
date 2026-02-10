import React, { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Activity, TrendingUp, Users, Database, AlertTriangle, 
  CheckCircle, Clock, Zap, Server, Shield, ArrowLeft
} from 'lucide-react';

interface SystemMetrics {
  apiLatency: number;
  dataQuality: number;
  errorRate: number;
  userEngagement: number;
  uptime: number;
  activeUsers: number;
  totalAnalyses: number;
  averageResponseTime: number;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    apiLatency: 245,
    dataQuality: 94,
    errorRate: 0.8,
    userEngagement: 78,
    uptime: 99.9,
    activeUsers: 342,
    totalAnalyses: 15847,
    averageResponseTime: 2.3,
  });

  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'healthy',
    message: 'All systems operational',
    timestamp: new Date(),
  });

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Mock data for charts
  const latencyData = [
    { time: '00:00', latency: 220 },
    { time: '04:00', latency: 245 },
    { time: '08:00', latency: 198 },
    { time: '12:00', latency: 267 },
    { time: '16:00', latency: 289 },
    { time: '20:00', latency: 234 },
  ];

  const errorData = [
    { name: 'Network Errors', value: 35 },
    { name: 'Timeout Errors', value: 28 },
    { name: 'Validation Errors', value: 22 },
    { name: 'Other Errors', value: 15 },
  ];

  const engagementData = [
    { day: 'Mon', users: 280, analyses: 1200 },
    { day: 'Tue', users: 320, analyses: 1400 },
    { day: 'Wed', users: 290, analyses: 1300 },
    { day: 'Thu', users: 350, analyses: 1600 },
    { day: 'Fri', users: 380, analyses: 1800 },
    { day: 'Sat', users: 320, analyses: 1500 },
    { day: 'Sun', users: 290, analyses: 1400 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20';
      case 'warning':
        return 'bg-yellow-500/20';
      case 'critical':
        return 'bg-red-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 ml-2" />
                العودة
              </Button>
              <div>
                <h1 className="font-bold text-xl">لوحة تحكم النظام</h1>
                <p className="text-sm text-muted-foreground">مراقبة صحة وأداء النظام</p>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor(healthStatus.status)}>
              <CheckCircle className="h-3 w-3 ml-2" />
              {healthStatus.status === 'healthy' ? 'سليم' : healthStatus.status === 'warning' ? 'تحذير' : 'حرج'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* API Latency */}
          <Card className="border-blue-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                زمن الاستجابة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.apiLatency}ms</div>
              <p className="text-xs text-muted-foreground mt-1">متوسط زمن الاستجابة</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.min(100 - (metrics.apiLatency / 500) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Quality */}
          <Card className="border-green-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                جودة البيانات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dataQuality}%</div>
              <p className="text-xs text-muted-foreground mt-1">دقة البيانات المحللة</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${metrics.dataQuality}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Rate */}
          <Card className="border-red-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                معدل الأخطاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.errorRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">نسبة الأخطاء المسجلة</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${Math.min(metrics.errorRate * 10, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Uptime */}
          <Card className="border-purple-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-500" />
                التوفر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.uptime}%</div>
              <p className="text-xs text-muted-foreground mt-1">وقت التشغيل الشهري</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${metrics.uptime}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                المستخدمون النشطون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">مستخدم نشط الآن</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                إجمالي التحليلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.totalAnalyses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">تحليل تم إجراؤه</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                متوسط وقت الاستجابة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.averageResponseTime}s</div>
              <p className="text-xs text-muted-foreground mt-1">ثانية لكل تحليل</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Latency Trend */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه زمن الاستجابة</CardTitle>
              <CardDescription>آخر 24 ساعة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #6b7280' }} />
                    <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Error Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع الأخطاء</CardTitle>
              <CardDescription>حسب نوع الخطأ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {errorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #6b7280' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>مشاركة المستخدمين</CardTitle>
            <CardDescription>آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #6b7280' }} />
                  <Legend />
                  <Bar dataKey="users" fill="#a78bfa" name="المستخدمون" />
                  <Bar dataKey="analyses" fill="#60a5fa" name="التحليلات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className={`border-2 ${getStatusBg(healthStatus.status)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className={`h-5 w-5 ${getStatusColor(healthStatus.status)}`} />
              حالة النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{healthStatus.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              آخر تحديث: {healthStatus.timestamp.toLocaleString('ar-SA')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
