import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
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
  Brain
} from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const isRTL = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

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

  const tabs = [
    { id: 'profile', label: isRTL ? 'الملف الشخصي' : 'Profile', icon: User },
    { id: 'security', label: isRTL ? 'الأمان' : 'Security', icon: Shield },
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
                    {isRTL ? 'تحديث معلومات ملفك الشخصي' : 'Update your profile information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{isRTL ? 'الاسم الكامل' : 'Full Name'}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">{isRTL ? 'المؤسسة' : 'Organization'}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="organization"
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          className="pl-10"
                          placeholder={isRTL ? 'اختياري' : 'Optional'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{isRTL ? 'الموقع' : 'Location'}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="pl-10"
                          placeholder={isRTL ? 'اختياري' : 'Optional'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="jobTitle">{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</Label>
                      <Input 
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        placeholder={isRTL ? 'اختياري' : 'Optional'}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="glow-button text-white gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving 
                        ? (isRTL ? 'جاري الحفظ...' : 'Saving...') 
                        : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {isRTL ? 'الأمان' : 'Security'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'إدارة إعدادات الأمان الخاصة بك' : 'Manage your security settings'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{isRTL ? 'كلمة المرور' : 'Password'}</p>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'آخر تغيير: منذ 30 يوم' : 'Last changed: 30 days ago'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      {isRTL ? 'تغيير' : 'Change'}
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</p>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'غير مفعل' : 'Not enabled'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      {isRTL ? 'تفعيل' : 'Enable'}
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Trash2 className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">{isRTL ? 'حذف الحساب' : 'Delete Account'}</p>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'سيتم حذف جميع بياناتك نهائياً' : 'All your data will be permanently deleted'}
                        </p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      {isRTL ? 'حذف الحساب' : 'Delete Account'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    {isRTL ? 'الإشعارات' : 'Notifications'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'إدارة تفضيلات الإشعارات' : 'Manage your notification preferences'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: isRTL ? 'تنبيهات المشاعر' : 'Emotion Alerts', desc: isRTL ? 'عند تغير المؤشرات بشكل كبير' : 'When indices change significantly' },
                    { label: isRTL ? 'تقارير أسبوعية' : 'Weekly Reports', desc: isRTL ? 'ملخص أسبوعي للتحليلات' : 'Weekly analysis summary' },
                    { label: isRTL ? 'أخبار المنصة' : 'Platform News', desc: isRTL ? 'تحديثات وميزات جديدة' : 'Updates and new features' },
                    { label: isRTL ? 'نصائح وإرشادات' : 'Tips & Guides', desc: isRTL ? 'كيفية الاستفادة من المنصة' : 'How to use the platform' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
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
                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'الخطة الحالية' : 'Current Plan'}</p>
                        <p className="text-2xl font-bold">{isRTL ? 'مجانية' : 'Free'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{isRTL ? 'نقاط API المتبقية' : 'API Credits Left'}</p>
                        <p className="text-2xl font-bold">850 / 1000</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">{isRTL ? 'ميزات خطتك' : 'Your Plan Features'}</h3>
                    <ul className="space-y-2">
                      {[
                        isRTL ? '1000 نقطة API شهرياً' : '1000 API credits/month',
                        isRTL ? 'تحليل 100 نص يومياً' : '100 text analyses/day',
                        isRTL ? 'الوصول للخريطة العالمية' : 'Global map access',
                        isRTL ? '3 تنبيهات مخصصة' : '3 custom alerts',
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/pricing">
                    <Button className="w-full mt-6 glow-button text-white">
                      {isRTL ? 'ترقية الخطة' : 'Upgrade Plan'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
