/**
 * Reports Page
 * Displays analytics and statistics about classified analyses
 * Includes charts for domain distribution, sensitivity levels, and trends over time
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  Shield,
  Landmark,
  DollarSign,
  Brain,
  Stethoscope,
  GraduationCap,
  Users,
  Gamepad2,
  Newspaper,
  Download,
  RefreshCw
} from "lucide-react";

// Domain configuration
const DOMAINS = [
  { id: 'politics', name: 'سياسة', nameEn: 'Politics', icon: Landmark, color: '#ef4444' },
  { id: 'economy', name: 'اقتصاد', nameEn: 'Economy', icon: DollarSign, color: '#f59e0b' },
  { id: 'mental_health', name: 'صحة نفسية', nameEn: 'Mental Health', icon: Brain, color: '#8b5cf6' },
  { id: 'medical', name: 'طب', nameEn: 'Medical', icon: Stethoscope, color: '#ec4899' },
  { id: 'education', name: 'تعليم', nameEn: 'Education', icon: GraduationCap, color: '#3b82f6' },
  { id: 'society', name: 'مجتمع', nameEn: 'Society', icon: Users, color: '#10b981' },
  { id: 'entertainment', name: 'ترفيه', nameEn: 'Entertainment', icon: Gamepad2, color: '#06b6d4' },
  { id: 'general', name: 'أخبار عامة', nameEn: 'General News', icon: Newspaper, color: '#6b7280' },
];

// Sensitivity configuration
const SENSITIVITIES = [
  { id: 'low', name: 'منخفض', nameEn: 'Low', color: '#22c55e' },
  { id: 'medium', name: 'متوسط', nameEn: 'Medium', color: '#f59e0b' },
  { id: 'high', name: 'عالي', nameEn: 'High', color: '#f97316' },
  { id: 'critical', name: 'حرج', nameEn: 'Critical', color: '#ef4444' },
];

export default function Reports() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>("30");

  // Fetch statistics
  const domainStatsQuery = trpc.engine.getDomainStats.useQuery();
  const sensitivityStatsQuery = trpc.engine.getSensitivityStats.useQuery();
  const analysesOverTimeQuery = trpc.engine.getAnalysesOverTime.useQuery({ days: parseInt(timeRange) });
  const allAnalysesQuery = trpc.engine.getAllAnalyses.useQuery({ limit: 100 });

  // Calculate totals
  const totalAnalyses = useMemo(() => {
    if (!domainStatsQuery.data) return 0;
    return domainStatsQuery.data.reduce((sum, d) => sum + Number(d.count || 0), 0);
  }, [domainStatsQuery.data]);

  const averageRisk = useMemo(() => {
    if (!domainStatsQuery.data || domainStatsQuery.data.length === 0) return 0;
    const total = domainStatsQuery.data.reduce((sum, d) => sum + Number(d.avgRisk || 0), 0);
    return Math.round(total / domainStatsQuery.data.length);
  }, [domainStatsQuery.data]);

  // Get domain icon
  const getDomainIcon = (domainId: string) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    return domain?.icon || Newspaper;
  };

  // Get domain color
  const getDomainColor = (domainId: string) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    return domain?.color || '#6b7280';
  };

  // Get sensitivity color
  const getSensitivityColor = (sensitivityId: string) => {
    const sensitivity = SENSITIVITIES.find(s => s.id === sensitivityId);
    return sensitivity?.color || '#6b7280';
  };

  // Get domain name
  const getDomainName = (domainId: string) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    return domain?.name || domainId;
  };

  // Get sensitivity name
  const getSensitivityName = (sensitivityId: string) => {
    const sensitivity = SENSITIVITIES.find(s => s.id === sensitivityId);
    return sensitivity?.name || sensitivityId;
  };

  // Calculate max count for bar scaling
  const maxDomainCount = useMemo(() => {
    if (!domainStatsQuery.data) return 1;
    return Math.max(...domainStatsQuery.data.map(d => Number(d.count || 0)), 1);
  }, [domainStatsQuery.data]);

  const maxSensitivityCount = useMemo(() => {
    if (!sensitivityStatsQuery.data) return 1;
    return Math.max(...sensitivityStatsQuery.data.map(s => Number(s.count || 0)), 1);
  }, [sensitivityStatsQuery.data]);

  const isLoading = domainStatsQuery.isLoading || sensitivityStatsQuery.isLoading;

  const refetchAll = () => {
    domainStatsQuery.refetch();
    sensitivityStatsQuery.refetch();
    analysesOverTimeQuery.refetch();
    allAnalysesQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50 border-b border-border/50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-400" />
                تقارير التحليلات
              </h1>
              <p className="text-muted-foreground mt-2">
                إحصائيات وتقارير شاملة عن التحليلات المصنفة
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الفترة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">آخر 7 أيام</SelectItem>
                  <SelectItem value="30">آخر 30 يوم</SelectItem>
                  <SelectItem value="90">آخر 90 يوم</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refetchAll} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي التحليلات</p>
                  <p className="text-3xl font-bold text-foreground">{totalAnalyses}</p>
                </div>
                <Activity className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">التصنيفات النشطة</p>
                  <p className="text-3xl font-bold text-foreground">{domainStatsQuery.data?.length || 0}</p>
                </div>
                <PieChart className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط المخاطر</p>
                  <p className="text-3xl font-bold text-foreground">{averageRisk}%</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مستوى الأمان</p>
                  <p className="text-3xl font-bold text-foreground">
                    {averageRisk < 40 ? 'آمن' : averageRisk < 70 ? 'متوسط' : 'مرتفع'}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="domains" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="domains">التصنيفات</TabsTrigger>
            <TabsTrigger value="sensitivity">الحساسية</TabsTrigger>
            <TabsTrigger value="recent">الأخيرة</TabsTrigger>
          </TabsList>

          {/* Domain Distribution Tab */}
          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-400" />
                  توزيع التحليلات حسب التصنيف
                </CardTitle>
                <CardDescription>
                  عدد التحليلات ومتوسط المخاطر لكل تصنيف محتوى
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : domainStatsQuery.data && domainStatsQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {DOMAINS.map((domain) => {
                      const stat = domainStatsQuery.data?.find(s => s.domain === domain.id);
                      const count = Number(stat?.count || 0);
                      const avgRisk = Math.round(Number(stat?.avgRisk || 0));
                      const percentage = totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0;
                      const Icon = domain.icon;

                      return (
                        <div key={domain.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${domain.color}20` }}
                              >
                                <Icon className="h-5 w-5" style={{ color: domain.color }} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{domain.name}</p>
                                <p className="text-sm text-muted-foreground">{domain.nameEn}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">{count} تحليل</p>
                              <p className="text-sm text-muted-foreground">
                                {percentage}% • خطورة {avgRisk}%
                              </p>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(count / maxDomainCount) * 100}%`,
                                backgroundColor: domain.color 
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <PieChart className="h-16 w-16 mb-4 opacity-50" />
                    <p>لا توجد بيانات متاحة</p>
                    <p className="text-sm">قم بإجراء بعض التحليلات لرؤية الإحصائيات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sensitivity Distribution Tab */}
          <TabsContent value="sensitivity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  توزيع مستويات الحساسية
                </CardTitle>
                <CardDescription>
                  عدد التحليلات حسب مستوى حساسية المحتوى
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : sensitivityStatsQuery.data && sensitivityStatsQuery.data.length > 0 ? (
                  <div className="space-y-6">
                    {SENSITIVITIES.map((sensitivity) => {
                      const stat = sensitivityStatsQuery.data?.find(s => s.sensitivity === sensitivity.id);
                      const count = Number(stat?.count || 0);
                      const percentage = totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0;

                      return (
                        <div key={sensitivity.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: sensitivity.color,
                                  color: sensitivity.color,
                                  backgroundColor: `${sensitivity.color}10`
                                }}
                              >
                                {sensitivity.name}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {sensitivity.nameEn}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">{count} تحليل</p>
                              <p className="text-sm text-muted-foreground">{percentage}%</p>
                            </div>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(count / maxSensitivityCount) * 100}%`,
                                backgroundColor: sensitivity.color 
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Risk Summary */}
                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">ملخص المخاطر</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">محتوى آمن (منخفض): </span>
                          <span className="font-medium text-green-500">
                            {sensitivityStatsQuery.data?.find(s => s.sensitivity === 'low')?.count || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">يحتاج مراجعة (متوسط): </span>
                          <span className="font-medium text-amber-500">
                            {sensitivityStatsQuery.data?.find(s => s.sensitivity === 'medium')?.count || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">حساس (عالي): </span>
                          <span className="font-medium text-orange-500">
                            {sensitivityStatsQuery.data?.find(s => s.sensitivity === 'high')?.count || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">حرج: </span>
                          <span className="font-medium text-red-500">
                            {sensitivityStatsQuery.data?.find(s => s.sensitivity === 'critical')?.count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <AlertTriangle className="h-16 w-16 mb-4 opacity-50" />
                    <p>لا توجد بيانات متاحة</p>
                    <p className="text-sm">قم بإجراء بعض التحليلات لرؤية الإحصائيات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Analyses Tab */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  التحليلات الأخيرة
                </CardTitle>
                <CardDescription>
                  آخر التحليلات المصنفة مع تفاصيلها
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allAnalysesQuery.isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : allAnalysesQuery.data && allAnalysesQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {allAnalysesQuery.data.slice(0, 20).map((analysis) => {
                      const domain = DOMAINS.find(d => d.id === analysis.domain);
                      const sensitivity = SENSITIVITIES.find(s => s.id === analysis.sensitivity);
                      const Icon = domain?.icon || Newspaper;

                      return (
                        <div 
                          key={analysis.id} 
                          className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div 
                                className="p-2 rounded-lg shrink-0"
                                style={{ backgroundColor: `${domain?.color || '#6b7280'}20` }}
                              >
                                <Icon className="h-5 w-5" style={{ color: domain?.color || '#6b7280' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground line-clamp-2">
                                  {analysis.headline}
                                </p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant="outline" style={{ borderColor: domain?.color, color: domain?.color }}>
                                    {domain?.name || analysis.domain}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    style={{ 
                                      borderColor: sensitivity?.color, 
                                      color: sensitivity?.color,
                                      backgroundColor: `${sensitivity?.color}10`
                                    }}
                                  >
                                    {sensitivity?.name || analysis.sensitivity}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    خطورة: {analysis.emotionalRiskScore}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-medium text-foreground">
                                {analysis.dominantEmotion}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(analysis.createdAt).toLocaleDateString('ar-LY')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Activity className="h-16 w-16 mb-4 opacity-50" />
                    <p>لا توجد تحليلات مصنفة</p>
                    <p className="text-sm">قم بإجراء تحليلات مع اختيار التصنيف لرؤيتها هنا</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
