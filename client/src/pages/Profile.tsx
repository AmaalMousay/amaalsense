import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogoIcon } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { UserMenu } from '@/components/UserMenu';
import { useI18n } from '@/i18n';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Building2,
  MapPin,
  Calendar,
  Shield,
  Save,
  Home,
  Menu,
  X,
  LayoutDashboard,
  Key,
  Bell,
  CreditCard,
  Trash2,
  Globe,
  Brain,
  BarChart3,
  Target,
  Eye
} from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const isRTL = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch real user statistics
  const { data: stats, isLoading: statsLoading } = trpc.userStats.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    location: '',
    jobTitle: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/login');
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.openId || '',
        organization: '',
        location: '',
        jobTitle: ''
      });
    }
  }, [loading, isAuthenticated, setLocation, user]);

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

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(isRTL ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully');
    setIsSaving(false);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString(isRTL ? 'ar-LY' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tabs = [
    { id: 'profile', label: isRTL ? 'الملف الشخصي' : 'Profile', icon: User },
    { id: 'activity', label: isRTL ? 'النشاط' : 'Activity', icon: BarChart3 },
    { id: 'notifications', label: isRTL ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'subscription', label: isRTL ? 'الاشتراك' : 'Subscription', icon: CreditCard },
  ];

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
            <Link href="/user-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
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
              <Link href="/user-dashboard">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" />
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold cosmic-text mb-2">
            {isRTL ? 'إعدادات الحساب' : 'Account Settings'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? 'إدارة معلومات حسابك وتفضيلاتك'
              : 'Manage your account information and preferences'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="cosmic-card">
              <CardContent className="p-4">
                {/* User Avatar */}
                <div className="flex flex-col items-center mb-6 pt-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role === 'admin' ? (isRTL ? 'مسؤول' : 'Admin') : (isRTL ? 'مستخدم' : 'User')}</p>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'معلومات حسابك الأساسية' : 'Your basic account information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={user.name || ''}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{isRTL ? 'معرف الحساب' : 'Account ID'}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={user.openId || ''}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{isRTL ? 'نوع الحساب' : 'Account Type'}</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={user.role === 'admin' ? (isRTL ? 'مسؤول' : 'Administrator') : (isRTL ? 'مستخدم عادي' : 'Regular User')}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{isRTL ? 'تاريخ الانضمام' : 'Member Since'}</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={formatDate(stats?.memberSince || null)}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {isRTL 
                        ? 'يتم إدارة معلومات حسابك من خلال نظام المصادقة. للتعديل، يرجى التواصل مع الدعم.'
                        : 'Your account information is managed through the authentication system. To make changes, please contact support.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'activity' && (
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {isRTL ? 'إحصائيات النشاط' : 'Activity Statistics'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'نظرة عامة على نشاطك في المنصة' : 'Overview of your platform activity'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-muted rounded" />
                      <div className="h-20 bg-muted rounded" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          <span className="font-medium">{isRTL ? 'إجمالي التحليلات' : 'Total Analyses'}</span>
                        </div>
                        <p className="text-3xl font-bold">{stats?.totalAnalyses || 0}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats?.totalAnalyses === 0 
                            ? (isRTL ? 'لم تقم بأي تحليل بعد' : 'No analyses yet')
                            : (isRTL ? 'تحليل مكتمل' : 'completed analyses')}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium">{isRTL ? 'التنبيهات النشطة' : 'Active Alerts'}</span>
                        </div>
                        <p className="text-3xl font-bold">{stats?.activeAlerts || 0}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats?.activeAlerts === 0 
                            ? (isRTL ? 'لا توجد تنبيهات مفعلة' : 'No active alerts')
                            : (isRTL ? 'تنبيه نشط' : 'active alerts')}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Eye className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">{isRTL ? 'المواضيع المتابعة' : 'Followed Topics'}</span>
                        </div>
                        <p className="text-3xl font-bold">{stats?.followedTopics || 0}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats?.followedTopics === 0 
                            ? (isRTL ? 'لا تتابع أي موضوع' : 'Not following any topics')
                            : (isRTL ? 'موضوع متابع' : 'followed topics')}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">{isRTL ? 'التصنيفات المستخدمة' : 'Domains Used'}</span>
                        </div>
                        <p className="text-3xl font-bold">{stats?.countriesAnalyzed || 0}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats?.countriesAnalyzed === 0 
                            ? (isRTL ? 'لم تستخدم أي تصنيف بعد' : 'No domains used yet')
                            : (isRTL ? 'تصنيف مختلف' : 'different domains')}
                        </p>
                      </div>
                    </div>
                  )}

                  {stats?.lastActive && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'آخر نشاط: ' : 'Last active: '}
                        <span className="font-medium">{formatDate(stats?.lastActive || null)}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    {isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'تخصيص تفضيلات الإشعارات' : 'Customize your notification preferences'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{isRTL ? 'إعدادات الإشعارات قادمة قريباً' : 'Notification settings coming soon'}</p>
                    <Link href="/followed-topics">
                      <Button variant="outline" className="mt-4">
                        {isRTL ? 'إدارة المواضيع المتابعة' : 'Manage Followed Topics'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {isRTL ? 'الاشتراك' : 'Subscription'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'إدارة خطة اشتراكك' : 'Manage your subscription plan'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {isRTL ? 'الخطة المجانية' : 'Free Plan'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'الوصول الأساسي للمنصة' : 'Basic platform access'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
                        {isRTL ? 'نشط' : 'Active'}
                      </span>
                    </div>
                    <Link href="/subscription">
                      <Button className="w-full">
                        {isRTL ? 'ترقية الاشتراك' : 'Upgrade Plan'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
