import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { useI18n } from '@/i18n';
import { trpc } from '@/lib/trpc';

export default function ForgotPassword() {
  const { isRTL } = useI18n();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetMutation = trpc.registration.requestPasswordReset.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(isRTL ? 'البريد الإلكتروني غير صالح' : 'Invalid email address');
      return;
    }

    resetMutation.mutate({ email });
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
              {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </h2>
            <p className="text-muted-foreground">
              {isRTL 
                ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين'
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          <Card className="p-6 cosmic-card">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isRTL ? 'تم إرسال الرابط!' : 'Reset Link Sent!'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isRTL 
                    ? 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط إعادة التعيين قريباً.'
                    : 'If your email is registered, you\'ll receive a reset link shortly.'}
                </p>
                <Link href="/login">
                  <Button className="glow-button text-white">
                    {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={resetMutation.isPending}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-button text-white mt-6"
                  disabled={resetMutation.isPending}
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    isRTL ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'
                  )}
                </Button>
              </form>
            )}

            {/* Login Link */}
            {!success && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                {isRTL ? 'تذكرت كلمة المرور؟' : 'Remember your password?'}{' '}
                <Link href="/login">
                  <span className="text-accent hover:underline cursor-pointer font-medium">
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </span>
                </Link>
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
