import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StockStyleIndicator } from '@/components/StockStyleIndicator';
import { trpc } from '@/lib/trpc';
import { Link, useLocation } from 'wouter';
import { 
  TrendingUp, Zap, Heart, Menu, X, 
  BookOpen, Building2, HelpCircle, FileText,
  ChevronRight, Globe, Brain, Shield, Users, BarChart3, Clock, Bell
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { FooterLegend } from '@/components/EmotionLegend';
import { DataSourcesFooter } from '@/components/DataSourcesFooter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/i18n';

// World Map Component with Google-style interactive map
function InteractiveWorldMap({ onCountryClick }: { onCountryClick: (code: string, name: string) => void }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  // Country data with positions and mood colors
  const countries = [
    // Middle East & North Africa
    { code: 'LY', name: 'ليبيا', nameEn: 'Libya', x: 52, y: 38, mood: 'hope' },
    { code: 'EG', name: 'مصر', nameEn: 'Egypt', x: 54, y: 40, mood: 'neutral' },
    { code: 'SA', name: 'السعودية', nameEn: 'Saudi Arabia', x: 58, y: 44, mood: 'calm' },
    { code: 'AE', name: 'الإمارات', nameEn: 'UAE', x: 62, y: 44, mood: 'hope' },
    { code: 'IQ', name: 'العراق', nameEn: 'Iraq', x: 58, y: 38, mood: 'fear' },
    { code: 'SY', name: 'سوريا', nameEn: 'Syria', x: 56, y: 36, mood: 'fear' },
    { code: 'JO', name: 'الأردن', nameEn: 'Jordan', x: 56, y: 40, mood: 'neutral' },
    { code: 'LB', name: 'لبنان', nameEn: 'Lebanon', x: 56, y: 37, mood: 'fear' },
    { code: 'PS', name: 'فلسطين', nameEn: 'Palestine', x: 55, y: 39, mood: 'anger' },
    { code: 'KW', name: 'الكويت', nameEn: 'Kuwait', x: 60, y: 42, mood: 'calm' },
    { code: 'QA', name: 'قطر', nameEn: 'Qatar', x: 61, y: 44, mood: 'hope' },
    { code: 'BH', name: 'البحرين', nameEn: 'Bahrain', x: 61, y: 43, mood: 'calm' },
    { code: 'OM', name: 'عمان', nameEn: 'Oman', x: 64, y: 46, mood: 'calm' },
    { code: 'YE', name: 'اليمن', nameEn: 'Yemen', x: 60, y: 48, mood: 'fear' },
    { code: 'MA', name: 'المغرب', nameEn: 'Morocco', x: 44, y: 38, mood: 'hope' },
    { code: 'DZ', name: 'الجزائر', nameEn: 'Algeria', x: 48, y: 38, mood: 'neutral' },
    { code: 'TN', name: 'تونس', nameEn: 'Tunisia', x: 50, y: 36, mood: 'hope' },
    { code: 'SD', name: 'السودان', nameEn: 'Sudan', x: 54, y: 48, mood: 'fear' },
    
    // Europe
    { code: 'GB', name: 'بريطانيا', nameEn: 'UK', x: 46, y: 26, mood: 'neutral' },
    { code: 'FR', name: 'فرنسا', nameEn: 'France', x: 48, y: 30, mood: 'neutral' },
    { code: 'DE', name: 'ألمانيا', nameEn: 'Germany', x: 50, y: 28, mood: 'calm' },
    { code: 'IT', name: 'إيطاليا', nameEn: 'Italy', x: 52, y: 32, mood: 'neutral' },
    { code: 'ES', name: 'إسبانيا', nameEn: 'Spain', x: 44, y: 32, mood: 'hope' },
    { code: 'NL', name: 'هولندا', nameEn: 'Netherlands', x: 49, y: 27, mood: 'calm' },
    { code: 'BE', name: 'بلجيكا', nameEn: 'Belgium', x: 48, y: 28, mood: 'calm' },
    { code: 'SE', name: 'السويد', nameEn: 'Sweden', x: 52, y: 20, mood: 'calm' },
    { code: 'NO', name: 'النرويج', nameEn: 'Norway', x: 50, y: 18, mood: 'calm' },
    { code: 'PL', name: 'بولندا', nameEn: 'Poland', x: 54, y: 27, mood: 'neutral' },
    { code: 'UA', name: 'أوكرانيا', nameEn: 'Ukraine', x: 58, y: 28, mood: 'fear' },
    { code: 'RU', name: 'روسيا', nameEn: 'Russia', x: 70, y: 20, mood: 'neutral' },
    { code: 'TR', name: 'تركيا', nameEn: 'Turkey', x: 56, y: 34, mood: 'neutral' },
    { code: 'GR', name: 'اليونان', nameEn: 'Greece', x: 54, y: 34, mood: 'neutral' },
    
    // Americas
    { code: 'US', name: 'أمريكا', nameEn: 'USA', x: 20, y: 35, mood: 'neutral' },
    { code: 'CA', name: 'كندا', nameEn: 'Canada', x: 18, y: 25, mood: 'calm' },
    { code: 'MX', name: 'المكسيك', nameEn: 'Mexico', x: 16, y: 42, mood: 'neutral' },
    { code: 'BR', name: 'البرازيل', nameEn: 'Brazil', x: 30, y: 55, mood: 'hope' },
    { code: 'AR', name: 'الأرجنتين', nameEn: 'Argentina', x: 28, y: 68, mood: 'neutral' },
    { code: 'CO', name: 'كولومبيا', nameEn: 'Colombia', x: 24, y: 50, mood: 'hope' },
    { code: 'CL', name: 'تشيلي', nameEn: 'Chile', x: 26, y: 65, mood: 'hope' },
    
    // Asia
    { code: 'CN', name: 'الصين', nameEn: 'China', x: 72, y: 38, mood: 'neutral' },
    { code: 'JP', name: 'اليابان', nameEn: 'Japan', x: 82, y: 35, mood: 'calm' },
    { code: 'KR', name: 'كوريا الجنوبية', nameEn: 'South Korea', x: 80, y: 36, mood: 'hope' },
    { code: 'IN', name: 'الهند', nameEn: 'India', x: 66, y: 45, mood: 'hope' },
    { code: 'PK', name: 'باكستان', nameEn: 'Pakistan', x: 64, y: 40, mood: 'fear' },
    { code: 'ID', name: 'إندونيسيا', nameEn: 'Indonesia', x: 74, y: 55, mood: 'hope' },
    { code: 'TH', name: 'تايلاند', nameEn: 'Thailand', x: 72, y: 48, mood: 'hope' },
    { code: 'VN', name: 'فيتنام', nameEn: 'Vietnam', x: 74, y: 48, mood: 'hope' },
    { code: 'MY', name: 'ماليزيا', nameEn: 'Malaysia', x: 72, y: 52, mood: 'hope' },
    { code: 'SG', name: 'سنغافورة', nameEn: 'Singapore', x: 73, y: 54, mood: 'calm' },
    { code: 'PH', name: 'الفلبين', nameEn: 'Philippines', x: 78, y: 48, mood: 'hope' },
    
    // Africa
    { code: 'NG', name: 'نيجيريا', nameEn: 'Nigeria', x: 50, y: 50, mood: 'hope' },
    { code: 'ZA', name: 'جنوب أفريقيا', nameEn: 'South Africa', x: 54, y: 68, mood: 'neutral' },
    { code: 'KE', name: 'كينيا', nameEn: 'Kenya', x: 58, y: 54, mood: 'hope' },
    { code: 'ET', name: 'إثيوبيا', nameEn: 'Ethiopia', x: 58, y: 50, mood: 'fear' },
    { code: 'GH', name: 'غانا', nameEn: 'Ghana', x: 46, y: 50, mood: 'hope' },
    
    // Oceania
    { code: 'AU', name: 'أستراليا', nameEn: 'Australia', x: 78, y: 65, mood: 'calm' },
    { code: 'NZ', name: 'نيوزيلندا', nameEn: 'New Zealand', x: 86, y: 72, mood: 'calm' },
  ];

  // Mood colors
  const moodColors: Record<string, string> = {
    hope: '#2A9D8F',    // Green - Hope
    calm: '#457B9D',    // Blue - Calm
    neutral: '#E9C46A', // Yellow - Neutral
    fear: '#F4A261',    // Orange - Fear
    anger: '#E63946',   // Red - Anger
    sadness: '#8D5CF6', // Purple - Sadness
  };

  return (
    <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-border/30">
      {/* World Map Background */}
      <svg viewBox="0 0 100 80" className="w-full h-full">
        {/* Simple world outline */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect fill="url(#oceanGradient)" width="100" height="80" />
        
        {/* Grid lines */}
        {[20, 40, 60, 80].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="80" stroke="#334155" strokeWidth="0.1" strokeDasharray="1,1" />
        ))}
        {[20, 40, 60].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.1" strokeDasharray="1,1" />
        ))}
        
        {/* Country markers */}
        {countries.map((country) => {
          const isHovered = hoveredCountry === country.code;
          const color = moodColors[country.mood] || moodColors.neutral;
          
          return (
            <g 
              key={country.code}
              onClick={() => onCountryClick(country.code, country.nameEn)}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer"
            >
              {/* Glow effect */}
              <circle
                cx={country.x}
                cy={country.y}
                r={isHovered ? 3 : 2}
                fill={color}
                opacity={isHovered ? 0.4 : 0.2}
                className="transition-all duration-300"
              />
              {/* Main dot */}
              <circle
                cx={country.x}
                cy={country.y}
                r={isHovered ? 1.5 : 1}
                fill={color}
                className="transition-all duration-300"
              />
              {/* Pulse animation for hovered */}
              {isHovered && (
                <circle
                  cx={country.x}
                  cy={country.y}
                  r="2"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.3"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-lg">
          <p className="text-sm font-medium">
            {countries.find(c => c.code === hoveredCountry)?.name} ({countries.find(c => c.code === hoveredCountry)?.nameEn})
          </p>
          <p className="text-xs text-muted-foreground">اضغط لعرض التفاصيل</p>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50">
        <p className="text-xs font-medium mb-2">المزاج السائد</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(moodColors).slice(0, 4).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">
                {mood === 'hope' ? 'أمل' : mood === 'calm' ? 'هدوء' : mood === 'neutral' ? 'محايد' : mood === 'fear' ? 'خوف' : mood === 'anger' ? 'غضب' : 'حزن'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [indices, setIndices] = useState({ gmi: 0, cfi: 50, hri: 50 });
  const [previousIndices, setPreviousIndices] = useState({ gmi: 0, cfi: 50, hri: 50 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useI18n();

  // Fetch latest indices with auto-refresh every 30 seconds
  const { data: latestIndices, isLoading: indicesLoading } = trpc.emotion.getLatestIndices.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );

  // Fetch historical data for sparklines
  const { data: historicalIndices } = trpc.emotion.getHistoricalIndices.useQuery(
    { hoursBack: 6 },
    { refetchInterval: 60000 }
  );

  // Extract historical arrays for sparklines
  const historicalData = useMemo(() => {
    if (!historicalIndices || historicalIndices.length === 0) {
      return { gmi: [], cfi: [], hri: [] };
    }
    return {
      gmi: historicalIndices.map((h: any) => h.gmi),
      cfi: historicalIndices.map((h: any) => h.cfi),
      hri: historicalIndices.map((h: any) => h.hri),
    };
  }, [historicalIndices]);

  useEffect(() => {
    if (latestIndices) {
      // Store previous values for trend calculation
      setPreviousIndices(indices);
      setIndices({
        gmi: latestIndices.gmi || 0,
        cfi: latestIndices.cfi || 50,
        hri: latestIndices.hri || 50,
      });
    }
  }, [latestIndices]);

  const handleCountryClick = (code: string, name: string) => {
    navigate(`/map?country=${code}&name=${encodeURIComponent(name)}`);
  };

  const navLinks = [
    { href: '/dashboard', label: t.nav.dashboard },
    { href: '/analyzer', label: t.nav.analyzer },
    { href: '/map', label: t.nav.map },
    { href: '/live', label: t.nav.live },
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
            <LogoIcon size="md" />
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
            <ThemeToggle />
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
              <div className="pt-2 flex items-center gap-4">
                <ThemeToggle />
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

      {/* Hero Section - Compact */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold cosmic-text">
              {t.home.title.split(' ').map((word, i) => 
                word === 'Emotion' || word === 'المشاعر' || word === 'Émotion' || word === 'Emotion' || word === 'Эмоций' || word === 'Emociones' || word === '情感' ? 
                  <span key={i} className="gradient-text">{word} </span> : 
                  <span key={i}>{word} </span>
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Live Indices Section */}
      <section className="py-8 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold cosmic-text mb-2">{t.home.liveIndices}</h3>
            <p className="text-muted-foreground text-sm">{t.home.liveIndicesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StockStyleIndicator
              title={t.indices.gmi}
              shortName="GMI"
              value={indices.gmi}
              previousValue={previousIndices.gmi}
              min={-100}
              max={100}
              description={t.indices.gmiDesc}
              indexType="gmi"
              historicalData={historicalData.gmi}
              isLoading={indicesLoading}
            />
            <StockStyleIndicator
              title={t.indices.cfi}
              shortName="CFI"
              value={indices.cfi}
              previousValue={previousIndices.cfi}
              min={0}
              max={100}
              description={t.indices.cfiDesc}
              indexType="cfi"
              historicalData={historicalData.cfi}
              isLoading={indicesLoading}
            />
            <StockStyleIndicator
              title={t.indices.hri}
              shortName="HRI"
              value={indices.hri}
              previousValue={previousIndices.hri}
              min={0}
              max={100}
              description={t.indices.hriDesc}
              indexType="hri"
              historicalData={historicalData.hri}
              isLoading={indicesLoading}
            />
          </div>
        </div>
      </section>

      {/* World Map Section - NEW */}
      <section className="py-8 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold cosmic-text mb-2">خريطة المشاعر العالمية</h3>
            <p className="text-muted-foreground text-sm">اضغط على أي دولة لعرض تفاصيل المزاج العام</p>
          </div>
          
          <InteractiveWorldMap onCountryClick={handleCountryClick} />
        </div>
      </section>

      {/* Quick Features - Simplified */}
      <section className="py-12 border-t border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/analyzer">
              <Card className="cosmic-card p-4 text-center hover:border-accent/50 transition-colors cursor-pointer h-full">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold cosmic-text">{t.analyzer.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">تحليل النصوص والعناوين</p>
              </Card>
            </Link>

            <Link href="/map">
              <Card className="cosmic-card p-4 text-center hover:border-accent/50 transition-colors cursor-pointer h-full">
                <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold cosmic-text">{t.map.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">خريطة المشاعر التفاعلية</p>
              </Card>
            </Link>

            <Link href="/trends">
              <Card className="cosmic-card p-4 text-center hover:border-accent/50 transition-colors cursor-pointer h-full">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold cosmic-text">البيانات التاريخية</h4>
                <p className="text-xs text-muted-foreground mt-1">تتبع الاتجاهات عبر الزمن</p>
              </Card>
            </Link>

            <Link href="/alerts">
              <Card className="cosmic-card p-4 text-center hover:border-accent/50 transition-colors cursor-pointer h-full">
                <Bell className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold cosmic-text">التنبيهات</h4>
                <p className="text-xs text-muted-foreground mt-1">إشعارات مخصصة</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 border-t border-border/50">
        <div className="container text-center">
          <h3 className="text-2xl font-bold cosmic-text mb-4">{t.home.readyToStart}</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/analyzer')}
              className="glow-button text-white px-8 py-4"
            >
              {t.home.launchAnalyzer}
            </Button>
            <Button
              onClick={() => navigate('/use-cases')}
              variant="outline"
              className="px-8 py-4"
            >
              حالات الاستخدام
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Simplified */}
      <footer className="border-t border-border/50 py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LogoIcon size="sm" />
                <span className="font-bold gradient-text">AmalSense</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.home.subtitle}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t.footer.product}</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><Link href="/analyzer" className="hover:text-accent">{t.nav.analyzer}</Link></li>
                <li><Link href="/map" className="hover:text-accent">{t.nav.map}</Link></li>
                <li><Link href="/trends" className="hover:text-accent">Trends</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t.footer.resources}</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><Link href="/how-it-works" className="hover:text-accent">{t.nav.howItWorks}</Link></li>
                <li><Link href="/use-cases" className="hover:text-accent">Use Cases</Link></li>
                <li><Link href="/api-docs" className="hover:text-accent">API Docs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">{t.footer.company}</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><Link href="/about" className="hover:text-accent">{t.nav.about}</Link></li>
                <li><Link href="/contact" className="hover:text-accent">{t.nav.contact}</Link></li>
                <li><Link href="/terms" className="hover:text-accent">{t.footer.terms || 'Terms'}</Link></li>
                <li><Link href="/privacy" className="hover:text-accent">{t.footer.privacy || 'Privacy'}</Link></li>
              </ul>
            </div>
          </div>

          {/* Emotion Color Legend */}
          <FooterLegend />

          <div className="border-t border-border/50 mt-6 pt-6 text-center text-xs text-muted-foreground">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
