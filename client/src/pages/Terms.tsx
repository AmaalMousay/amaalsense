import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Globe, Lock } from "lucide-react";
import { useI18n } from "@/i18n";
import { LogoIcon } from "@/components/Logo";
import { 
  CONTENT_DOMAINS, 
  SENSITIVITY_LEVELS,
  SensitivityIndicator 
} from '@/components/ContentClassification';

export default function Terms() {
  const { t, isRTL } = useI18n();

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t.common.back}</span>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">
              {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
            </h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container max-w-4xl">
          <Card className="cosmic-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <LogoIcon size="lg" />
                <div>
                  <CardTitle className="text-3xl gradient-text">Amaalsense</CardTitle>
                  <p className="text-muted-foreground">
                    {isRTL ? 'شروط الخدمة والاستخدام' : 'Terms of Service'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'آخر تحديث: يناير 2025' : 'Last Updated: January 2025'}
              </p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none space-y-6">
              {isRTL ? (
                <>
                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">1. قبول الشروط</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      باستخدامك لمنصة Amaalsense، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">2. وصف الخدمة</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Amaalsense هي منصة لتحليل المشاعر الجماعية الرقمية تستخدم الذكاء الاصطناعي لتحليل النصوص والأخبار ومنشورات وسائل التواصل الاجتماعي. نقدم مؤشرات عاطفية وتحليلات وتوقعات بناءً على البيانات المتاحة للعموم.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">3. حسابات المستخدمين</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. يجب عليك إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">4. الاستخدام المقبول</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      توافق على استخدام المنصة فقط للأغراض المشروعة. يُحظر استخدام الخدمة لأي نشاط غير قانوني أو ضار أو مسيء.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">5. الملكية الفكرية</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      جميع المحتويات والعلامات التجارية والشعارات والبرمجيات على المنصة مملوكة لـ Amaalsense أو مرخصيها. لا يجوز نسخ أو توزيع أي محتوى دون إذن كتابي مسبق.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">6. إخلاء المسؤولية</h2>
                    <div className="p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <p className="text-orange-800 dark:text-orange-300 font-semibold">
                          AmalSense لا يقدم تشخيص طبي ولا توصيات سياسية، بل تحليل إحصائي لمشاعر جماعية.
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      تُقدم الخدمة "كما هي" دون أي ضمانات. لا نضمن دقة أو اكتمال أو موثوقية أي تحليل أو توقع. لا ينبغي استخدام نتائجنا كأساس وحيد لاتخاذ القرارات المالية أو الاستثمارية.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">نظام تصنيف المحتوى</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      يستخدم AmalSense نظام تصنيف متقدم لتحديد نوع المحتوى ومستوى حساسيته:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {CONTENT_DOMAINS.map((domain) => {
                        const Icon = domain.icon;
                        return (
                          <div key={domain.id} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4" style={{ color: domain.color }} />
                              <span className="font-medium text-sm">{domain.labelAr}</span>
                            </div>
                            <SensitivityIndicator level={domain.sensitivity} size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">مستويات الحساسية</h2>
                    <div className="space-y-2">
                      {SENSITIVITY_LEVELS.map((level) => (
                        <div 
                          key={level.level} 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: level.bgColor }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium" style={{ color: level.color }}>
                              {level.labelAr}
                            </span>
                            <span className="text-sm text-muted-foreground">{level.description.ar}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">7. حدود المسؤولية</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      لن تكون Amaalsense مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">8. التعديلات</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تاريخ التحديث.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">9. الاتصال بنا</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      لأي استفسارات حول هذه الشروط، يرجى التواصل معنا عبر صفحة الاتصال أو البريد الإلكتروني: support@amalsense.com
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      By using Amaalsense, you agree to be bound by these terms and conditions. If you do not agree to any part of these terms, please do not use our services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">2. Description of Service</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Amaalsense is a digital collective emotion analysis platform that uses artificial intelligence to analyze texts, news, and social media posts. We provide emotional indices, analytics, and forecasts based on publicly available data.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">3. User Accounts</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      You are responsible for maintaining the confidentiality of your account and password. You must notify us immediately of any unauthorized use of your account.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">4. Acceptable Use</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      You agree to use the platform only for lawful purposes. Using the service for any illegal, harmful, or abusive activity is prohibited.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">5. Intellectual Property</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      All content, trademarks, logos, and software on the platform are owned by Amaalsense or its licensors. No content may be copied or distributed without prior written permission.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">6. Disclaimer</h2>
                    <div className="p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <p className="text-orange-800 dark:text-orange-300 font-semibold">
                          AmalSense does not provide medical diagnosis or political recommendations, but statistical analysis of collective emotions.
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      The service is provided "as is" without any warranties. We do not guarantee the accuracy, completeness, or reliability of any analysis or forecast. Our results should not be used as the sole basis for financial or investment decisions.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">Content Classification System</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      AmalSense uses an advanced classification system to determine content type and sensitivity level:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {CONTENT_DOMAINS.map((domain) => {
                        const Icon = domain.icon;
                        return (
                          <div key={domain.id} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4" style={{ color: domain.color }} />
                              <span className="font-medium text-sm">{domain.labelEn}</span>
                            </div>
                            <SensitivityIndicator level={domain.sensitivity} size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">Sensitivity Levels</h2>
                    <div className="space-y-2">
                      {SENSITIVITY_LEVELS.map((level) => (
                        <div 
                          key={level.level} 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: level.bgColor }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium" style={{ color: level.color }}>
                              {level.labelEn}
                            </span>
                            <span className="text-sm text-muted-foreground">{level.description.en}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">7. Limitation of Liability</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Amaalsense shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">8. Modifications</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We reserve the right to modify these terms at any time. Changes will be posted on this page with the update date.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">9. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      For any questions about these terms, please contact us through our contact page or email: support@amalsense.com
                    </p>
                  </section>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
