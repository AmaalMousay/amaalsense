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
              {isRTL ? ' ' : 'Terms of Service'}
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
                    {isRTL ? '  ' : 'Terms of Service'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? ' :  2025' : 'Last Updated: January 2025'}
              </p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none space-y-6">
              {isRTL ? (
                <>
                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">1.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Amaalsense       .              .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">2.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Amaalsense   Analysis Emotions      Analysis      .    Analysis      .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">3.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                              .          .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">4.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                            .           .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">5.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                                Amaalsense  .           .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">6.  </h2>
                    <div className="p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <p className="text-orange-800 dark:text-orange-300 font-semibold">
                          AmalSense         Analysis   .
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        " "   .         Analysis  .           .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">  </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                       AmalSense        :
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
                    <h2 className="text-xl font-bold text-accent mb-3"> </h2>
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
                    <h2 className="text-xl font-bold text-accent mb-3">7.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Amaalsense                     .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">8. Edit</h2>
                    <p className="text-muted-foreground leading-relaxed">
                         Edit     .         .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">9.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                                   : support@amalsense.com
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
