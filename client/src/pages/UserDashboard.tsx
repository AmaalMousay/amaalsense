import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoIcon } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { UserMenu } from '@/components/UserMenu';
import { useI18n } from '@/i18n';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Globe,
  Bell,
  FileText,
  Settings,
  Clock,
  BarChart3,
  Brain,
  Heart,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Calendar,
  Zap,
  Home,
  Menu,
  X,
  Eye,
  Target
} from 'lucide-react';

// Domain labels
const DOMAIN_LABELS: Record<string, { ar: string; en: string }> = {
  politics: { ar: 'سياسة', en: 'Politics' },
  economy: { ar: 'اقتصاد', en: 'Economy' },
  mental_health: { ar: 'صحة نفسية', en: 'Mental Health' },
  medical: { ar: 'طب', en: 'Medical' },
  education: { ar: 'تعليم', en: 'Education' },
  society: { ar: 'مجتمع', en: 'Society' },
  entertainment: { ar: 'ترفيه', en: 'Entertainment' },
  general: { ar: 'عام', en: 'General' },
};

export default function UserDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const isRTL = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch real user statistics
  const { data: stats, isLoading: statsLoading } = trpc.userStats.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getSentimentColor = (emotion: string) => {
    switch (emotion) {
      case 'joy':
      case 'hope': return 'text-green-500';
      case 'fear':
      case 'anger':
      case 'sadness': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSentimentIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy':
      case 'hope': return <Heart className="w-4 h-4 text-green-500" />;
      case 'fear':
      case 'anger':
      case 'sadness': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getDomainLabel = (domain: string) => {
    const label = DOMAIN_LABELS[domain];
    return label ? (isRTL ? label.ar : label.en) : domain;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString(isRTL ? 'ar-LY' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8" />
            <span className="text-xl font-bold gradient-text">Amaalsense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                {isRTL ? 'الرئيسية' : 'Home'}
              </Button>
            </Link>
            <Link href="/analyzer">
              <Button variant="ghost" size="sm" className="gap-2">
                <Brain className="w-4 h-4" />
                {isRTL ? 'المحلل' : 'Analyzer'}
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                {isRTL ? 'الخريطة' : 'Map'}
              </Button>
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
            <UserMenu isRTL={isRTL} />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="container py-4 space-y-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="w-4 h-4" />
                  {isRTL ? 'الرئيسية' : 'Home'}
                </Button>
              </Link>
              <Link href="/analyzer">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Brain className="w-4 h-4" />
                  {isRTL ? 'المحلل' : 'Analyzer'}
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Globe className="w-4 h-4" />
                  {isRTL ? 'الخريطة' : 'Map'}
                </Button>
              </Link>
              <div className="flex items-center gap-4 pt-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold cosmic-text mb-2">
            {isRTL ? `مرحباً، ${user.name}!` : `Welcome back, ${user.name}!`}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? 'إليك نظرة عامة على نشاطك وتحليلاتك'
              : 'Here\'s an overview of your activity and analyses'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحليلات' : 'Analyses'}
                  </p>
                  <p className="text-2xl font-bold">{stats?.totalAnalyses || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.totalAnalyses === 0 
                  ? (isRTL ? 'ابدأ بتحليل أول عنوان' : 'Start by analyzing your first headline')
                  : (isRTL ? 'إجمالي تحليلاتك' : 'Your total analyses')}
              </p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التنبيهات النشطة' : 'Active Alerts'}
                  </p>
                  <p className="text-2xl font-bold">{stats?.activeAlerts || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.activeAlerts === 0 
                  ? (isRTL ? 'أنشئ تنبيهاً مخصصاً' : 'Create a custom alert')
                  : (isRTL ? 'تنبيهات مفعلة' : 'Active alerts')}
              </p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'المواضيع المتابعة' : 'Followed Topics'}
                  </p>
                  <p className="text-2xl font-bold">{stats?.followedTopics || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.followedTopics === 0 
                  ? (isRTL ? 'تابع موضوعاً للحصول على تنبيهات' : 'Follow a topic for alerts')
                  : (isRTL ? 'مواضيع تتابعها' : 'Topics you follow')}
              </p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التصنيفات المحللة' : 'Domains Analyzed'}
                  </p>
                  <p className="text-2xl font-bold">{stats?.countriesAnalyzed || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.countriesAnalyzed === 0 
                  ? (isRTL ? 'جرب تصنيفات مختلفة' : 'Try different domains')
                  : (isRTL ? 'تصنيفات مختلفة' : 'Different domains')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/analyzer">
            <Card className="cosmic-card hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{isRTL ? 'تحليل جديد' : 'New Analysis'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تحليل نص أو عنوان' : 'Analyze text or headline'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="cosmic-card hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{isRTL ? 'خريطة المشاعر' : 'Emotion Map'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'استكشاف المشاعر العالمية' : 'Explore global emotions'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/followed-topics">
            <Card className="cosmic-card hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{isRTL ? 'متابعة موضوع' : 'Follow Topic'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تنبيهات مخصصة' : 'Custom notifications'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Analyses */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {isRTL ? 'التحليلات الأخيرة' : 'Recent Analyses'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'آخر تحليلاتك' : 'Your latest analyses'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentAnalyses.map((analysis: any) => (
                    <div 
                      key={analysis.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getSentimentIcon(analysis.dominantEmotion)}
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{analysis.headline}</p>
                          <p className="text-xs text-muted-foreground">
                            {getDomainLabel(analysis.domain)} • {formatDate(analysis.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold ${getSentimentColor(analysis.dominantEmotion)}`}>
                        {analysis.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{isRTL ? 'لا توجد تحليلات بعد' : 'No analyses yet'}</p>
                  <Link href="/analyzer">
                    <Button variant="outline" className="mt-4">
                      {isRTL ? 'ابدأ التحليل' : 'Start Analyzing'}
                    </Button>
                  </Link>
                </div>
              )}
              {stats?.recentAnalyses && stats.recentAnalyses.length > 0 && (
                <Link href="/reports">
                  <Button variant="ghost" className="w-full mt-4 gap-2">
                    {isRTL ? 'عرض الكل' : 'View All'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {isRTL ? 'التنبيهات النشطة' : 'Active Alerts'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تنبيهاتك المخصصة' : 'Your custom alerts'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentAlerts && stats.recentAlerts.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentAlerts.map((alert: any) => (
                    <div 
                      key={alert.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${alert.isActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="font-medium text-sm">{alert.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.metric.toUpperCase()} {alert.condition} {alert.threshold}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.isActive 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {alert.isActive 
                          ? (isRTL ? 'نشط' : 'Active') 
                          : (isRTL ? 'متوقف' : 'Paused')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{isRTL ? 'لا توجد تنبيهات بعد' : 'No alerts yet'}</p>
                  <Link href="/alerts">
                    <Button variant="outline" className="mt-4">
                      {isRTL ? 'إنشاء تنبيه' : 'Create Alert'}
                    </Button>
                  </Link>
                </div>
              )}
              {stats?.recentAlerts && stats.recentAlerts.length > 0 && (
                <Link href="/alerts">
                  <Button variant="ghost" className="w-full mt-4 gap-2">
                    {isRTL ? 'إدارة التنبيهات' : 'Manage Alerts'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Member Info */}
        {stats?.memberSince && (
          <Card className="cosmic-card mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {isRTL ? 'عضو منذ' : 'Member Since'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(stats.memberSince)}
                    </p>
                  </div>
                </div>
                <Link href="/subscription">
                  <Button className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    {isRTL ? 'ترقية الاشتراك' : 'Upgrade Plan'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
