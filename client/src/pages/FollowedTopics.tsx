/**
 * Followed Topics Page
 * Allows users to follow topics and receive alerts when emotional risk changes
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Landmark,
  DollarSign,
  Brain,
  Stethoscope,
  GraduationCap,
  Users,
  Gamepad2,
  Newspaper,
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
  { id: 'general', name: 'أخبار عامة', nameEn: 'General', icon: Newspaper, color: '#6b7280' },
];

export default function FollowedTopics() {
  const { user, loading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    domain: 'all' as string,
    riskThreshold: 70,
    alertDirection: 'both' as 'increase' | 'decrease' | 'both',
  });

  // Fetch followed topics
  const followedTopicsQuery = trpc.topics.getFollowed.useQuery(undefined, {
    enabled: !!user,
  });

  // Fetch topic alerts
  const alertsQuery = trpc.topicAlerts.getAll.useQuery({ limit: 50 }, {
    enabled: !!user,
  });

  // Fetch unread count
  const unreadCountQuery = trpc.topicAlerts.getUnreadCount.useQuery(undefined, {
    enabled: !!user,
  });

  // Mutations
  const followTopicMutation = trpc.topics.follow.useMutation({
    onSuccess: () => {
      toast.success("تم متابعة الموضوع بنجاح");
      setIsDialogOpen(false);
      resetForm();
      followedTopicsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في متابعة الموضوع");
    },
  });

  const unfollowTopicMutation = trpc.topics.unfollow.useMutation({
    onSuccess: () => {
      toast.success("تم إلغاء المتابعة");
      followedTopicsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إلغاء المتابعة");
    },
  });

  const toggleActiveMutation = trpc.topics.toggleActive.useMutation({
    onSuccess: () => {
      followedTopicsQuery.refetch();
    },
  });

  const markAlertReadMutation = trpc.topicAlerts.markRead.useMutation({
    onSuccess: () => {
      alertsQuery.refetch();
      unreadCountQuery.refetch();
    },
  });

  const markAllReadMutation = trpc.topicAlerts.markAllRead.useMutation({
    onSuccess: () => {
      toast.success("تم تعليم جميع التنبيهات كمقروءة");
      alertsQuery.refetch();
      unreadCountQuery.refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      topic: '',
      domain: 'all',
      riskThreshold: 70,
      alertDirection: 'both',
    });
  };

  const handleSubmit = () => {
    if (!formData.topic.trim()) {
      toast.error("يرجى إدخال موضوع");
      return;
    }

    followTopicMutation.mutate({
      topic: formData.topic,
      domain: formData.domain === 'all' ? undefined : formData.domain as any,
      riskThreshold: formData.riskThreshold,
      alertDirection: formData.alertDirection,
    });
  };

  const getDomainIcon = (domainId: string) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    return domain?.icon || Newspaper;
  };

  const getDomainColor = (domainId: string) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    return domain?.color || '#6b7280';
  };

  const getDomainName = (domainId: string) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    return domain?.name || domainId;
  };

  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType) {
      case 'risk_increase': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'risk_decrease': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'threshold_exceeded': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertTypeName = (alertType: string) => {
    switch (alertType) {
      case 'risk_increase': return 'ارتفاع المخاطر';
      case 'risk_decrease': return 'انخفاض المخاطر';
      case 'threshold_exceeded': return 'تجاوز الحد';
      default: return 'تحليل جديد';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 text-center">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-2">تسجيل الدخول مطلوب</h1>
          <p className="text-muted-foreground mb-4">يجب تسجيل الدخول لمتابعة المواضيع والحصول على التنبيهات</p>
          <Button onClick={() => window.location.href = '/login'}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50 border-b border-border/50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Bell className="h-8 w-8 text-purple-400" />
                المواضيع المتابعة
              </h1>
              <p className="text-muted-foreground mt-2">
                تابع المواضيع واحصل على تنبيهات عند تغير مستوى المخاطر العاطفية
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  متابعة موضوع جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>متابعة موضوع جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>الموضوع</Label>
                    <Input
                      placeholder="مثال: الانتخابات في ليبيا"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>التصنيف (اختياري)</Label>
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => setFormData({ ...formData, domain: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع التصنيفات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع التصنيفات</SelectItem>
                        {DOMAINS.map((domain) => (
                          <SelectItem key={domain.id} value={domain.id}>
                            {domain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>حد المخاطر للتنبيه ({formData.riskThreshold}%)</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.riskThreshold}
                      onChange={(e) => setFormData({ ...formData, riskThreshold: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>نوع التنبيه</Label>
                    <Select
                      value={formData.alertDirection}
                      onValueChange={(value: 'increase' | 'decrease' | 'both') => 
                        setFormData({ ...formData, alertDirection: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">عند أي تغير</SelectItem>
                        <SelectItem value="increase">عند الارتفاع فقط</SelectItem>
                        <SelectItem value="decrease">عند الانخفاض فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSubmit} disabled={followTopicMutation.isPending}>
                    {followTopicMutation.isPending ? 'جاري الحفظ...' : 'متابعة'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="topics" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="topics">المواضيع المتابعة</TabsTrigger>
            <TabsTrigger value="alerts" className="relative">
              التنبيهات
              {(unreadCountQuery.data || 0) > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCountQuery.data}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Followed Topics Tab */}
          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  المواضيع التي تتابعها
                </CardTitle>
                <CardDescription>
                  ستحصل على تنبيهات عند تغير مستوى المخاطر العاطفية لهذه المواضيع
                </CardDescription>
              </CardHeader>
              <CardContent>
                {followedTopicsQuery.isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : followedTopicsQuery.data && followedTopicsQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {followedTopicsQuery.data.map((topic) => {
                      const Icon = topic.domain ? getDomainIcon(topic.domain) : Activity;
                      const color = topic.domain ? getDomainColor(topic.domain) : '#6b7280';

                      return (
                        <div
                          key={topic.id}
                          className={`p-4 rounded-lg border ${
                            topic.isActive ? 'bg-muted/30 border-border' : 'bg-muted/10 border-border/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="h-5 w-5" style={{ color }} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{topic.topic}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {topic.domain && (
                                    <Badge variant="outline" style={{ borderColor: color, color }}>
                                      {getDomainName(topic.domain)}
                                    </Badge>
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    حد التنبيه: {topic.riskThreshold || 'أي تغير'}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={topic.isActive === 1}
                                onCheckedChange={(checked) => 
                                  toggleActiveMutation.mutate({ id: topic.id, isActive: checked })
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => unfollowTopicMutation.mutate({ id: topic.id })}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Eye className="h-12 w-12 mb-2 opacity-50" />
                    <p>لا توجد مواضيع متابعة</p>
                    <p className="text-sm">اضغط على "متابعة موضوع جديد" للبدء</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-400" />
                      التنبيهات
                    </CardTitle>
                    <CardDescription>
                      تنبيهات حول تغيرات المخاطر العاطفية للمواضيع المتابعة
                    </CardDescription>
                  </div>
                  {(unreadCountQuery.data || 0) > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAllReadMutation.mutate()}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      تعليم الكل كمقروء
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {alertsQuery.isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : alertsQuery.data && alertsQuery.data.length > 0 ? (
                  <div className="space-y-3">
                    {alertsQuery.data.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${
                          alert.isRead ? 'bg-muted/10 border-border/50' : 'bg-muted/30 border-border'
                        }`}
                        onClick={() => !alert.isRead && markAlertReadMutation.mutate({ id: alert.id })}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getAlertTypeIcon(alert.alertType)}
                            <div>
                              <p className="font-medium text-foreground">{alert.topic}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {getAlertTypeName(alert.alertType)}
                                {alert.previousRiskScore !== null && (
                                  <span>
                                    : {alert.previousRiskScore}% → {alert.currentRiskScore}%
                                    {alert.changeAmount && (
                                      <span className={alert.changeAmount > 0 ? 'text-red-500' : 'text-green-500'}>
                                        {' '}({alert.changeAmount > 0 ? '+' : ''}{alert.changeAmount}%)
                                      </span>
                                    )}
                                  </span>
                                )}
                              </p>
                              {alert.message && (
                                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.createdAt).toLocaleDateString('ar-LY')}
                            </span>
                            {!alert.isRead && (
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Bell className="h-12 w-12 mb-2 opacity-50" />
                    <p>لا توجد تنبيهات</p>
                    <p className="text-sm">ستظهر التنبيهات هنا عند تغير مستوى المخاطر</p>
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
