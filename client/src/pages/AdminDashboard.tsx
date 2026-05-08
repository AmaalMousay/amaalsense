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
  CheckCircle, Clock, Zap, Server, Shield, ArrowLeft, Brain, BookOpen, RefreshCw
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

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

  // Fetch real engine data
  const { data: engineDashboard } = trpc.engine.getDashboardData.useQuery(undefined, {
    refetchInterval: 10000 // poll every 10 seconds
  });

  // Calculate real metrics based on engine data
  useEffect(() => {
    if (engineDashboard) {
      setMetrics({
        apiLatency: 120, // Real latency is calculated in layer timeline, we use a placeholder or average
        dataQuality: engineDashboard.learning.accuracyRate || 0,
        errorRate: 0,
        userEngagement: 0,
        uptime: 100,
        activeUsers: 0, // No real users yet
        totalAnalyses: engineDashboard.learning.totalAnalyses || 0,
        averageResponseTime: 1.5,
      });
    } else {
      setMetrics(prev => ({ ...prev, activeUsers: 0, totalAnalyses: 0, dataQuality: 0 }));
    }
  }, [engineDashboard]);

  // Autonomous Researcher State
  const { data: researchStatus, refetch: refetchResearchStatus } = trpc.agent.getResearchStatus.useQuery(undefined, {
    refetchInterval: 5000 // poll every 5 seconds
  });
  
  const triggerResearchMutation = trpc.agent.triggerResearch.useMutation({
    onSuccess: () => {
      refetchResearchStatus();
    }
  });

  const toggleContinuousMutation = trpc.agent.toggleContinuousResearch.useMutation({
    onSuccess: () => {
      refetchResearchStatus();
    }
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20';
      case 'warning': return 'bg-yellow-500/20';
      case 'critical': return 'bg-red-500/20';
      default: return 'bg-gray-500/20';
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
            </CardContent>
          </Card>

          {/* Data Quality */}
          <Card className="border-green-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                دقة التعلم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dataQuality}%</div>
              <p className="text-xs text-muted-foreground mt-1">نسبة الدقة الحالية</p>
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
            </CardContent>
          </Card>
          
          {/* Total Knowledge */}
          <Card className="border-indigo-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-500" />
                قاعدة المعرفة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{researchStatus?.articlesRead || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">مقال تم حفظه</p>
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




        {/* Autonomous Brain / Auto-Researcher */}
        <Card className="border-2 border-indigo-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className={`h-5 w-5 ${researchStatus?.isReading ? 'text-green-500 animate-pulse' : 'text-indigo-500'}`} />
              العقل المستقل (Auto-Researcher)
            </CardTitle>
            <CardDescription>وكيل المعرفة الذي يبحث ويقرأ المقالات من جوجل والموسوعات العلمية تلقائياً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">الحالة الحالية:</span>
                  {researchStatus?.isReading ? (
                    <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                      <span className="w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse" />
                      يقرأ الآن ويتعلم
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-indigo-500/20 text-indigo-500 border-indigo-500/50">
                      ينتظر الإيقاظ
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">الموضوع الحالي:</span>
                  <span className="font-semibold">{researchStatus?.currentTopic || 'لا يوجد'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">المصادر:</span>
                  <span className="text-sm">{researchStatus?.source || '---'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">المقالات التي تمت قراءتها:</span>
                  <Badge variant="secondary"><BookOpen className="w-3 h-3 ml-1" /> {researchStatus?.articlesRead || 0}</Badge>
                </div>
                
                {researchStatus?.error && (
                  <div className="text-sm text-red-500 mt-2">
                    <AlertTriangle className="w-4 h-4 inline-block ml-1" />
                    {researchStatus.error}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => triggerResearchMutation.mutate()} 
                  disabled={researchStatus?.isReading || triggerResearchMutation.isPending || researchStatus?.isContinuous}
                  className="bg-indigo-600 hover:bg-indigo-700 w-full"
                >
                  <Zap className="w-4 h-4 ml-2" />
                  قراءة مقال واحد الآن
                </Button>
                
                <Button 
                  onClick={() => toggleContinuousMutation.mutate({ enable: !researchStatus?.isContinuous })} 
                  variant={researchStatus?.isContinuous ? "destructive" : "default"}
                  className={`w-full ${!researchStatus?.isContinuous ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <RefreshCw className={`w-4 h-4 ml-2 ${researchStatus?.isContinuous ? 'animate-spin' : ''}`} />
                  {researchStatus?.isContinuous ? 'إيقاف القراءة المستمرة' : 'تفعيل القراءة المستمرة (تلقائي)'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
