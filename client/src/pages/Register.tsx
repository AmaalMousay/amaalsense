import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation } from 'wouter';
import { 
  User, Building2, Mail, Lock, Eye, EyeOff, 
  ArrowLeft, Check, Globe, AlertCircle, Loader2
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { useI18n } from '@/i18n';
import { getLoginUrl } from '@/const';
import { trpc } from '@/lib/trpc';

type AccountType = 'individual' | 'organization';

// Password strength calculator
function calculatePasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

export default function Register() {
  const [, navigate] = useLocation();
  const { t, isRTL } = useI18n();
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Organization fields
    orgName: '',
    orgWebsite: '',
    orgSize: '',
    jobTitle: '',
  });

  const registerMutation = trpc.registration.register.useMutation({
    onSuccess: () => {
      navigate('/login?registered=true');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(isRTL ? 'البريد الإلكتروني غير صالح' : 'Invalid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return false;
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return false;
    }

    // Organization validation
    if (accountType === 'organization' && !formData.orgName) {
      setError(isRTL ? 'اسم المؤسسة مطلوب' : 'Organization name is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      accountType,
      organizationName: accountType === 'organization' ? formData.orgName : undefined,
      organizationWebsite: accountType === 'organization' && formData.orgWebsite ? formData.orgWebsite : undefined,
      companySize: accountType === 'organization' ? formData.orgSize : undefined,
      jobTitle: accountType === 'organization' ? formData.jobTitle : undefined,
    });
  };

  const handleOAuthLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size="md" />
            <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold cosmic-text mb-2">
              {isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground">
              {isRTL ? 'اختر نوع حسابك للبدء' : 'Choose your account type to get started'}
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card 
              className={`p-6 cursor-pointer transition-all hover:border-accent/50 relative ${
                accountType === 'individual' 
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/30' 
                  : 'border-border'
              }`}
              onClick={() => setAccountType('individual')}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  accountType === 'individual' ? 'bg-accent text-white' : 'bg-muted'
                }`}>
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold">{isRTL ? 'فرد' : 'Individual'}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 'للاستخدام الشخصي' : 'For personal use'}
                  </p>
                </div>
                {accountType === 'individual' && (
                  <Check className="w-5 h-5 text-accent absolute top-2 right-2" />
                )}
              </div>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition-all hover:border-accent/50 relative ${
                accountType === 'organization' 
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/30' 
                  : 'border-border'
              }`}
              onClick={() => setAccountType('organization')}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  accountType === 'organization' ? 'bg-accent text-white' : 'bg-muted'
                }`}>
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold">{isRTL ? 'مؤسسة' : 'Organization'}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 'للشركات والفرق' : 'For teams & companies'}
                  </p>
                </div>
                {accountType === 'organization' && (
                  <Check className="w-5 h-5 text-accent absolute top-2 right-2" />
                )}
              </div>
            </Card>
          </div>

          {/* Registration Form */}
          <Card className="p-6 cosmic-card">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {isRTL ? 'الاسم الكامل' : 'Full Name'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              {/* Organization-specific Fields */}
              {accountType === 'organization' && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-medium mb-4 text-accent">
                      {isRTL ? 'معلومات المؤسسة' : 'Organization Details'}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orgName">
                      {isRTL ? 'اسم المؤسسة' : 'Organization Name'}
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="orgName"
                        name="orgName"
                        type="text"
                        placeholder={isRTL ? 'أدخل اسم المؤسسة' : 'Enter organization name'}
                        className="pl-10"
                        value={formData.orgName}
                        onChange={handleInputChange}
                        required={accountType === 'organization'}
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orgWebsite">
                      {isRTL ? 'الموقع الإلكتروني (اختياري)' : 'Website (optional)'}
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="orgWebsite"
                        name="orgWebsite"
                        type="url"
                        placeholder="https://example.com"
                        className="pl-10"
                        value={formData.orgWebsite}
                        onChange={handleInputChange}
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgSize">
                        {isRTL ? 'حجم المؤسسة' : 'Organization Size'}
                      </Label>
                      <select
                        id="orgSize"
                        name="orgSize"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        value={formData.orgSize}
                        onChange={handleInputChange}
                        required={accountType === 'organization'}
                        disabled={registerMutation.isPending}
                      >
                        <option value="">{isRTL ? 'اختر...' : 'Select...'}</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">
                        {isRTL ? 'المسمى الوظيفي' : 'Job Title'}
                      </Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        placeholder={isRTL ? 'مثال: مدير' : 'e.g. Manager'}
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= passwordStrength.score ? passwordStrength.color : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.score <= 2 ? 'text-red-500' : 
                      passwordStrength.score <= 4 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {isRTL ? (
                        passwordStrength.score <= 2 ? 'ضعيفة' : 
                        passwordStrength.score <= 4 ? 'متوسطة' : 'قوية'
                      ) : passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Confirm password'}
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full glow-button text-white mt-6"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isRTL ? 'جاري التسجيل...' : 'Creating Account...'}
                  </>
                ) : (
                  isRTL ? 'إنشاء الحساب' : 'Create Account'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {isRTL ? 'أو' : 'Or'}
                  </span>
                </div>
              </div>

              {/* OAuth Login */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleOAuthLogin}
                disabled={registerMutation.isPending}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                {isRTL ? 'تسجيل الدخول باستخدام Manus' : 'Continue with Manus'}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link href="/login">
                <span className="text-accent hover:underline cursor-pointer font-medium">
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </span>
              </Link>
            </p>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'تجربة مجانية' : 'Free Trial'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'بيانات آمنة' : 'Secure Data'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'وصول عالمي' : 'Global Access'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
