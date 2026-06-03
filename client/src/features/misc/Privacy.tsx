import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { useI18n } from "@/i18n";
import { LogoIcon } from "@/components/Logo";

export default function Privacy() {
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
            <Shield className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">
              {isRTL ? ' ' : 'Privacy Policy'}
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
                    {isRTL ? '   ' : 'Privacy Policy'}
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
                    <h2 className="text-xl font-bold text-accent mb-3">1. </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Amaalsense   .             .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">2.   </h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">    :</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li> :      </li>
                      <li> :      </li>
                      <li> :  IP    </li>
                      <li>  :   </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">3.   </h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">   :</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>  </li>
                      <li>   </li>
                      <li>     </li>
                      <li>Analysis    </li>
                      <li>    </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">4.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                             .                 .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">5.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                                SSL/TLS       .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">6. </h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">  :</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>   </li>
                      <li>   </li>
                      <li>Delete  </li>
                      <li>   </li>
                      <li>    </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">7.   </h2>
                    <p className="text-muted-foreground leading-relaxed">
                           .                  .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">8.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                                .   Delete    .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">9.   </h2>
                    <p className="text-muted-foreground leading-relaxed">
                              .           .
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">10.  </h2>
                    <p className="text-muted-foreground leading-relaxed">
                             : privacy@amaalsense.com
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">1. Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      At Amaalsense, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when using our platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">2. Information We Collect</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">We collect the following types of information:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Account information: Name, email, encrypted password</li>
                      <li>Usage data: Analyzed texts, search history, user preferences</li>
                      <li>Technical information: IP address, browser type, operating system</li>
                      <li>Cookies: To improve user experience</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">3. How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">We use your information for the following purposes:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Providing and improving our services</li>
                      <li>Personalizing your experience on the platform</li>
                      <li>Communicating with you about your account and service updates</li>
                      <li>Analyzing usage patterns to improve the platform</li>
                      <li>Ensuring platform security and preventing fraud</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">4. Data Sharing</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We do not sell or rent your personal information to third parties. We may share data with trusted service providers who help us operate the platform, under strict confidentiality agreements.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">5. Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We use advanced security measures to protect your data, including SSL/TLS encryption, encrypted password storage, and continuous system monitoring.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">6. Your Rights</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">You have the following rights:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Delete your account and data</li>
                      <li>Object to data processing</li>
                      <li>Transfer your data to another service</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">7. Cookies</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We use cookies to improve your experience. You can control cookie settings through your browser, but disabling them may affect some platform functionality.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">8. Data Retention</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We retain your data as long as your account is active or as needed to provide services. You can request deletion of your data at any time.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">9. Policy Changes</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any material changes via email or platform notification.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-accent mb-3">10. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      For any privacy inquiries, please contact us at: privacy@amaalsense.com
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
