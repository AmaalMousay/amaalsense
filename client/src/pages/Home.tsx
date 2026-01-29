import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { Link, useLocation } from 'wouter';
import { 
  Sparkles, TrendingUp, Zap, Heart, Menu, X, 
  BookOpen, Building2, HelpCircle, FileText,
  ChevronRight, Globe, Brain, Shield, Users
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useI18n } from '@/i18n';

export default function Home() {
  const [, navigate] = useLocation();
  const [indices, setIndices] = useState({ gmi: 0, cfi: 50, hri: 50 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useI18n();

  // Fetch latest indices
  const { data: latestIndices } = trpc.emotion.getLatestIndices.useQuery();

  useEffect(() => {
    if (latestIndices) {
      setIndices({
        gmi: latestIndices.gmi || 0,
        cfi: latestIndices.cfi || 50,
        hri: latestIndices.hri || 50,
      });
    }
  }, [latestIndices]);

  const navLinks = [
    { href: '/dashboard', label: t.nav.dashboard },
    { href: '/analyzer', label: t.nav.analyzer },
    { href: '/map', label: t.nav.map },
    { href: '/live', label: t.nav.live },
    { href: '/social', label: t.nav.social },
    { href: '/theory', label: t.nav.theory },
    { href: '/weather', label: t.nav.weather },
    { href: '/trends', label: 'Trends' },
    { href: '/about', label: t.nav.about },
    { href: '/pricing', label: t.nav.pricing },
  ];

  const resourceLinks = [
    { href: '/how-it-works', label: t.nav.howItWorks, icon: <Zap className="w-4 h-4" /> },
    { href: '/case-studies', label: t.nav.caseStudies, icon: <Building2 className="w-4 h-4" /> },
    { href: '/faq', label: t.nav.faq, icon: <HelpCircle className="w-4 h-4" /> },
    { href: '/blog', label: t.nav.blog, icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.slice(0, 6).map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-sm hover:text-accent transition-colors cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="relative group">
              <button className="text-sm hover:text-accent transition-colors flex items-center gap-1">
                {t.nav.more} <ChevronRight className={`w-3 h-3 group-hover:rotate-90 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all`}>
                {navLinks.slice(6).map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="block px-4 py-2 text-sm hover:bg-accent/10 transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                ))}
                <div className="border-t border-border my-1" />
                {resourceLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/10 transition-colors cursor-pointer">
                      {link.icon} {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <LanguageSwitcher />
            <Button
              onClick={() => navigate('/contact')}
              className="glow-button text-white"
            >
              {t.nav.contactSales}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="container py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className="block py-2 text-sm hover:text-accent transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                {resourceLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span 
                      className="flex items-center gap-2 py-2 text-sm hover:text-accent transition-colors cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon} {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
              <Button
                onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
                className="glow-button text-white w-full mt-4"
              >
                {t.nav.contactSales}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-4xl">
          <div className="text-center space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold cosmic-text">
                {t.home.title.split(' ').map((word, i) => 
                  word === 'Emotion' || word === 'المشاعر' || word === 'Émotion' || word === 'Emotion' || word === 'Эмоций' || word === 'Emociones' || word === '情感' ? 
                    <span key={i} className="gradient-text">{word} </span> : 
                    <span key={i}>{word} </span>
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.home.subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/analyzer')}
                className="glow-button text-white px-8 py-6 text-lg"
              >
                {t.home.tryAnalyzer}
              </Button>
              <Button
                onClick={() => navigate('/how-it-works')}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                {t.nav.howItWorks}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Indices Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">{t.home.liveIndices}</h3>
            <p className="text-muted-foreground">{t.home.liveIndicesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <IndexCard
              title={`${t.indices.gmi} (GMI)`}
              value={indices.gmi}
              min={-100}
              max={100}
              unit=""
              description={t.indices.gmiDesc}
              icon={<TrendingUp />}
              color="purple"
            />
            <IndexCard
              title={`${t.indices.cfi} (CFI)`}
              value={indices.cfi}
              min={0}
              max={100}
              unit=""
              description={t.indices.cfiDesc}
              icon={<Zap />}
              color="cyan"
            />
            <IndexCard
              title={`${t.indices.hri} (HRI)`}
              value={indices.hri}
              min={0}
              max={100}
              unit=""
              description={t.indices.hriDesc}
              icon={<Heart />}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">{t.home.poweredByAI}</h3>
            <p className="text-muted-foreground">{t.home.aiDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cosmic-card p-6">
              <Brain className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">{t.analyzer.title}</h4>
              <p className="text-muted-foreground text-sm">
                {t.emotions.joy}, {t.emotions.fear}, {t.emotions.anger}, {t.emotions.sadness}, {t.emotions.hope}, {t.emotions.curiosity}
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <Globe className="w-8 h-8 text-cyan-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">{t.map.title}</h4>
              <p className="text-muted-foreground text-sm">
                {t.map.subtitle}
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">{t.dashboard.historicalData}</h4>
              <p className="text-muted-foreground text-sm">
                {t.map.historicalTrends}
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <Shield className="w-8 h-8 text-red-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">{t.weather.alerts}</h4>
              <p className="text-muted-foreground text-sm">
                {t.alerts.subtitle}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">{t.home.useCases}</h3>
            <p className="text-muted-foreground">{t.home.useCasesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cosmic-card p-6 text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-2">{t.pricing.government}</h4>
              <p className="text-muted-foreground text-sm">
                Policy makers & public health officials
              </p>
            </Card>

            <Card className="cosmic-card p-6 text-center">
              <Building2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-2">{t.pricing.enterprise}</h4>
              <p className="text-muted-foreground text-sm">
                Market research & brand monitoring
              </p>
            </Card>

            <Card className="cosmic-card p-6 text-center">
              <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-2">Research</h4>
              <p className="text-muted-foreground text-sm">
                Academic studies & social science
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container text-center">
          <h3 className="text-3xl font-bold cosmic-text mb-4">{t.home.readyToStart}</h3>
          <Button
            onClick={() => navigate('/analyzer')}
            className="glow-button text-white px-8 py-6 text-lg"
          >
            {t.home.launchAnalyzer}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="font-bold gradient-text">AmalSense</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.home.subtitle}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/analyzer" className="hover:text-accent">{t.nav.analyzer}</Link></li>
                <li><Link href="/dashboard" className="hover:text-accent">{t.nav.dashboard}</Link></li>
                <li><Link href="/map" className="hover:text-accent">{t.nav.map}</Link></li>
                <li><Link href="/pricing" className="hover:text-accent">{t.nav.pricing}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/how-it-works" className="hover:text-accent">{t.nav.howItWorks}</Link></li>
                <li><Link href="/case-studies" className="hover:text-accent">{t.nav.caseStudies}</Link></li>
                <li><Link href="/faq" className="hover:text-accent">{t.nav.faq}</Link></li>
                <li><Link href="/blog" className="hover:text-accent">{t.nav.blog}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-accent">{t.nav.about}</Link></li>
                <li><Link href="/theory" className="hover:text-accent">{t.nav.theory}</Link></li>
                <li><Link href="/contact" className="hover:text-accent">{t.nav.contact}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
