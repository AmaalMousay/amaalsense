/**
 * PageErrorBoundary - مكون حماية من الأخطاء مخصص لكل صفحة
 * يعرض رسائل ودية بالعربية والإنجليزية مع خيارات إعادة المحاولة
 */
import { Component, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home, RefreshCw, WifiOff, Clock, ServerCrash, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  pageName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Detect error type and provide user-friendly messages
function getErrorDetails(error: Error | null) {
  const message = error?.message?.toLowerCase() || '';
  const stack = error?.stack?.toLowerCase() || '';
  
  // LLM Usage Exhausted
  if (message.includes('usage exhausted') || message.includes('412') || message.includes('precondition failed')) {
    return {
      type: 'llm_exhausted' as const,
      icon: Brain,
      titleAr: 'تم استنفاد حصة الذكاء الاصطناعي',
      titleEn: 'AI Usage Limit Reached',
      descAr: 'تم الوصول للحد الأقصى من استخدام نموذج الذكاء الاصطناعي. يرجى المحاولة لاحقاً أو التواصل مع المسؤول.',
      descEn: 'The AI model usage limit has been reached. Please try again later or contact the administrator.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      canRetry: true,
    };
  }
  
  // Timeout
  if (message.includes('timeout') || message.includes('timed out') || message.includes('took too long')) {
    return {
      type: 'timeout' as const,
      icon: Clock,
      titleAr: 'انتهت مهلة الطلب',
      titleEn: 'Request Timed Out',
      descAr: 'استغرق التحليل وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى بموضوع أبسط.',
      descEn: 'The analysis took longer than expected. Please try again with a simpler topic.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      canRetry: true,
    };
  }
  
  // Network Error
  if (message.includes('network') || message.includes('fetch') || message.includes('econnrefused') || message.includes('failed to fetch')) {
    return {
      type: 'network' as const,
      icon: WifiOff,
      titleAr: 'خطأ في الاتصال',
      titleEn: 'Connection Error',
      descAr: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
      descEn: 'Could not connect to the server. Please check your internet connection and try again.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      canRetry: true,
    };
  }
  
  // Server Error
  if (message.includes('500') || message.includes('internal server') || message.includes('server error')) {
    return {
      type: 'server' as const,
      icon: ServerCrash,
      titleAr: 'خطأ في الخادم',
      titleEn: 'Server Error',
      descAr: 'حدث خطأ داخلي في الخادم. فريقنا يعمل على حل المشكلة.',
      descEn: 'An internal server error occurred. Our team is working on resolving it.',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      canRetry: true,
    };
  }
  
  // Cannot read properties of undefined/null
  if (message.includes('cannot read properties') || message.includes('undefined') || message.includes('null')) {
    return {
      type: 'data' as const,
      icon: AlertTriangle,
      titleAr: 'خطأ في البيانات',
      titleEn: 'Data Error',
      descAr: 'حدث خطأ أثناء معالجة البيانات. يرجى المحاولة مرة أخرى.',
      descEn: 'An error occurred while processing data. Please try again.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      canRetry: true,
    };
  }
  
  // Generic error
  return {
    type: 'unknown' as const,
    icon: AlertTriangle,
    titleAr: 'حدث خطأ غير متوقع',
    titleEn: 'An Unexpected Error Occurred',
    descAr: 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.',
    descEn: 'We apologize for this error. Please try again.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    canRetry: true,
  };
}

// Detect if the page is RTL
function isPageRTL() {
  if (typeof document !== 'undefined') {
    return document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  }
  return true; // Default to Arabic
}

class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error(`[PageErrorBoundary${this.props.pageName ? ` - ${this.props.pageName}` : ''}]`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const details = getErrorDetails(this.state.error);
      const rtl = isPageRTL();
      const IconComponent = details.icon;

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6" dir={rtl ? 'rtl' : 'ltr'}>
          <Card className="w-full max-w-lg border-border/50 shadow-lg">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon */}
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", details.bgColor)}>
                  <IconComponent className={cn("w-8 h-8", details.color)} />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-foreground">
                  {rtl ? details.titleAr : details.titleEn}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                  {rtl ? details.descAr : details.descEn}
                </p>

                {/* Error details (collapsible for dev) */}
                {this.state.error && (
                  <details className="w-full">
                    <summary className="text-xs text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors">
                      {rtl ? 'تفاصيل تقنية' : 'Technical Details'}
                    </summary>
                    <div className="mt-2 p-3 rounded-md bg-muted/50 text-xs text-muted-foreground font-mono text-left overflow-auto max-h-32" dir="ltr">
                      {this.state.error.message}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2 justify-center">
                  {details.canRetry && (
                    <Button
                      onClick={this.handleRetry}
                      className="gap-2"
                      variant="default"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {rtl ? 'إعادة المحاولة' : 'Try Again'}
                    </Button>
                  )}
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="gap-2"
                  >
                    <Home className="w-4 h-4" />
                    {rtl ? 'الصفحة الرئيسية' : 'Go Home'}
                  </Button>
                  <Button
                    onClick={this.handleReload}
                    variant="ghost"
                    className="gap-2"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {rtl ? 'تحديث الصفحة' : 'Reload Page'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
