import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation, useSearch } from 'wouter';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { useI18n } from '@/i18n';
import { trpc } from '@/lib/trpc';

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

export default function ResetPassword() {
  const { isRTL } = useI18n();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const token = params.get('token') || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetMutation = trpc.registration.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(isRTL ? 'رمز إعادة التعيين مفقود' : 'Reset token is missing');
      return;
    }

    if (password.length < 8) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    resetMutation.mutate({ token, newPassword: password });
  };

  if (!token) {
    return (
      <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
        <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon size="md" />
              <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="p-6 cosmic-card max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'رابط غير صالح' : 'Invalid Link'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isRTL 
                ? 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية.'
                : 'This reset link is invalid or has expired.'}
            </p>
            <Link href="/forgot-password">
              <Button className="glow-button text-white">
                {isRTL ? 'طلب رابط جديد' : 'Request New Link'}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size="md" />
            <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold cosmic-text mb-2">
              {isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
            </h2>
            <p className="text-muted-foreground">
              {isRTL 
                ? 'أدخل كلمة المرور الجديدة'
                : 'Enter your new password'}
            </p>
          </div>

          <Card className="p-6 cosmic-card">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? 'تم تغيير كلمة المرور!' : 'Password Changed!'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isRTL 
                    ? 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
                    : 'You can now log in with your new password.'}
                </p>
                <Link href="/login">
                  <Button className="glow-button text-white">
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isRTL ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={resetMutation.isPending}
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
                  {password && (
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={resetMutation.isPending}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">
                      {isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-button text-white mt-6"
                  disabled={resetMutation.isPending}
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isRTL ? 'جاري التغيير...' : 'Changing...'}
                    </>
                  ) : (
                    isRTL ? 'تغيير كلمة المرور' : 'Change Password'
                  )}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
