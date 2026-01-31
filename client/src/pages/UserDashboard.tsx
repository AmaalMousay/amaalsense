import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
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
  X
} from 'lucide-react';

// Mock data for user activity
const recentAnalyses = [
  { id: 1, topic: 'Climate Change News', date: '2026-01-31', sentiment: 'neutral', score: 62 },
  { id: 2, topic: 'Tech Industry Updates', date: '2026-01-30', sentiment: 'positive', score: 78 },
  { id: 3, topic: 'Economic Outlook', date: '2026-01-29', sentiment: 'negative', score: 35 },
  { id: 4, topic: 'Sports Headlines', date: '2026-01-28', sentiment: 'positive', score: 85 },
];

const savedAlerts = [
  { id: 1, name: 'Fear Index Alert', condition: 'CFI > 70', status: 'active' },
  { id: 2, name: 'Hope Surge', condition: 'HRI > 80', status: 'active' },
  { id: 3, name: 'Market Sentiment', condition: 'GMI < 30', status: 'paused' },
];

export default function UserDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const isRTL = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="w-4 h-4 text-green-500" />;
      case 'negative': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-yellow-500" />;
    }
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
              ? 'إليك نظرة عامة على نشاطك وتحليلاتك الأخيرة'
              : 'Here\'s an overview of your activity and recent analyses'}
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
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-green-500 mt-2">+12% {isRTL ? 'هذا الشهر' : 'this month'}</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التنبيهات النشطة' : 'Active Alerts'}
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">2 {isRTL ? 'تم تشغيلها اليوم' : 'triggered today'}</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'الدول المتابعة' : 'Tracked Countries'}
                  </p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{isRTL ? 'تحديث مباشر' : 'Live updates'}</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'نقاط API' : 'API Credits'}
                  </p>
                  <p className="text-2xl font-bold">850</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{isRTL ? 'من 1000' : 'of 1000'}</p>
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

          <Link href="/alerts">
            <Card className="cosmic-card hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{isRTL ? 'إنشاء تنبيه' : 'Create Alert'}</h3>
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
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div 
                    key={analysis.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getSentimentIcon(analysis.sentiment)}
                      <div>
                        <p className="font-medium text-sm">{analysis.topic}</p>
                        <p className="text-xs text-muted-foreground">{analysis.date}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.score}%
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/trends">
                <Button variant="ghost" className="w-full mt-4 gap-2">
                  {isRTL ? 'عرض الكل' : 'View All'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
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
              <div className="space-y-4">
                {savedAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${alert.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="font-medium text-sm">{alert.name}</p>
                        <p className="text-xs text-muted-foreground">{alert.condition}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.status === 'active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {alert.status === 'active' 
                        ? (isRTL ? 'نشط' : 'Active') 
                        : (isRTL ? 'متوقف' : 'Paused')}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/alerts">
                <Button variant="ghost" className="w-full mt-4 gap-2">
                  {isRTL ? 'إدارة التنبيهات' : 'Manage Alerts'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Info */}
        <Card className="cosmic-card mt-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{isRTL ? 'الخطة الحالية: مجانية' : 'Current Plan: Free'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL 
                      ? 'قم بالترقية للحصول على ميزات متقدمة وتحليلات غير محدودة'
                      : 'Upgrade for advanced features and unlimited analyses'}
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button className="glow-button text-white gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {isRTL ? 'ترقية الآن' : 'Upgrade Now'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
