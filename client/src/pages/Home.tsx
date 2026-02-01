import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StockStyleIndicator } from '@/components/StockStyleIndicator';
import { trpc } from '@/lib/trpc';
import { Link, useLocation } from 'wouter';
import { 
  TrendingUp, Zap, Heart, Menu, X, 
  BookOpen, Building2, HelpCircle, FileText,
  ChevronRight, Globe, Brain, Shield, Users, BarChart3, Clock, Bell, Loader2,
  LogIn, UserPlus, LayoutDashboard, User, Newspaper, GraduationCap
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { FooterLegend } from '@/components/EmotionLegend';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/i18n';
import { EmotionGoogleMap } from '@/components/EmotionGoogleMap';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/_core/hooks/useAuth';

// Country positions for the map
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; name: string; nameEn: string }> = {
  // Middle East & North Africa
  'LY': { x: 52, y: 38, name: 'ليبيا', nameEn: 'Libya' },
  'EG': { x: 54, y: 40, name: 'مصر', nameEn: 'Egypt' },
  'SA': { x: 58, y: 44, name: 'السعودية', nameEn: 'Saudi Arabia' },
  'AE': { x: 62, y: 44, name: 'الإمارات', nameEn: 'UAE' },
  'IQ': { x: 58, y: 38, name: 'العراق', nameEn: 'Iraq' },
  'SY': { x: 56, y: 36, name: 'سوريا', nameEn: 'Syria' },
  'JO': { x: 56, y: 40, name: 'الأردن', nameEn: 'Jordan' },
  'LB': { x: 56, y: 37, name: 'لبنان', nameEn: 'Lebanon' },
  'PS': { x: 55, y: 39, name: 'فلسطين', nameEn: 'Palestine' },
  'KW': { x: 60, y: 42, name: 'الكويت', nameEn: 'Kuwait' },
  'QA': { x: 61, y: 44, name: 'قطر', nameEn: 'Qatar' },
  'BH': { x: 61, y: 43, name: 'البحرين', nameEn: 'Bahrain' },
  'OM': { x: 64, y: 46, name: 'عمان', nameEn: 'Oman' },
  'YE': { x: 60, y: 48, name: 'اليمن', nameEn: 'Yemen' },
  'MA': { x: 44, y: 38, name: 'المغرب', nameEn: 'Morocco' },
  'DZ': { x: 48, y: 38, name: 'الجزائر', nameEn: 'Algeria' },
  'TN': { x: 50, y: 36, name: 'تونس', nameEn: 'Tunisia' },
  'SD': { x: 54, y: 48, name: 'السودان', nameEn: 'Sudan' },
  
  // Europe
  'GB': { x: 46, y: 26, name: 'بريطانيا', nameEn: 'UK' },
  'FR': { x: 48, y: 30, name: 'فرنسا', nameEn: 'France' },
  'DE': { x: 50, y: 28, name: 'ألمانيا', nameEn: 'Germany' },
  'IT': { x: 52, y: 32, name: 'إيطاليا', nameEn: 'Italy' },
  'ES': { x: 44, y: 32, name: 'إسبانيا', nameEn: 'Spain' },
  'NL': { x: 49, y: 27, name: 'هولندا', nameEn: 'Netherlands' },
  'BE': { x: 48, y: 28, name: 'بلجيكا', nameEn: 'Belgium' },
  'SE': { x: 52, y: 20, name: 'السويد', nameEn: 'Sweden' },
  'NO': { x: 50, y: 18, name: 'النرويج', nameEn: 'Norway' },
  'PL': { x: 54, y: 27, name: 'بولندا', nameEn: 'Poland' },
  'UA': { x: 58, y: 28, name: 'أوكرانيا', nameEn: 'Ukraine' },
  'RU': { x: 70, y: 20, name: 'روسيا', nameEn: 'Russia' },
  'TR': { x: 56, y: 34, name: 'تركيا', nameEn: 'Turkey' },
  'GR': { x: 54, y: 34, name: 'اليونان', nameEn: 'Greece' },
  'CH': { x: 49, y: 30, name: 'سويسرا', nameEn: 'Switzerland' },
  
  // Americas
  'US': { x: 20, y: 35, name: 'أمريكا', nameEn: 'USA' },
  'CA': { x: 18, y: 25, name: 'كندا', nameEn: 'Canada' },
  'MX': { x: 16, y: 42, name: 'المكسيك', nameEn: 'Mexico' },
  'BR': { x: 30, y: 55, name: 'البرازيل', nameEn: 'Brazil' },
  'AR': { x: 28, y: 68, name: 'الأرجنتين', nameEn: 'Argentina' },
  'CO': { x: 24, y: 50, name: 'كولومبيا', nameEn: 'Colombia' },
  'CL': { x: 26, y: 65, name: 'تشيلي', nameEn: 'Chile' },
  
  // Asia
  'CN': { x: 72, y: 38, name: 'الصين', nameEn: 'China' },
  'JP': { x: 82, y: 35, name: 'اليابان', nameEn: 'Japan' },
  'KR': { x: 80, y: 36, name: 'كوريا الجنوبية', nameEn: 'South Korea' },
  'IN': { x: 66, y: 45, name: 'الهند', nameEn: 'India' },
  'PK': { x: 64, y: 40, name: 'باكستان', nameEn: 'Pakistan' },
  'ID': { x: 74, y: 55, name: 'إندونيسيا', nameEn: 'Indonesia' },
  'TH': { x: 72, y: 48, name: 'تايلاند', nameEn: 'Thailand' },
  'VN': { x: 74, y: 48, name: 'فيتنام', nameEn: 'Vietnam' },
  'MY': { x: 72, y: 52, name: 'ماليزيا', nameEn: 'Malaysia' },
  'SG': { x: 73, y: 54, name: 'سنغافورة', nameEn: 'Singapore' },
  'PH': { x: 78, y: 48, name: 'الفلبين', nameEn: 'Philippines' },
  
  // Africa
  'NG': { x: 50, y: 50, name: 'نيجيريا', nameEn: 'Nigeria' },
  'ZA': { x: 54, y: 68, name: 'جنوب أفريقيا', nameEn: 'South Africa' },
  'KE': { x: 58, y: 54, name: 'كينيا', nameEn: 'Kenya' },
  'ET': { x: 58, y: 50, name: 'إثيوبيا', nameEn: 'Ethiopia' },
  'GH': { x: 46, y: 50, name: 'غانا', nameEn: 'Ghana' },
  
  // Oceania
  'AU': { x: 78, y: 65, name: 'أستراليا', nameEn: 'Australia' },
  'NZ': { x: 86, y: 72, name: 'نيوزيلندا', nameEn: 'New Zealand' },
};

// Function to determine mood from GMI, CFI, HRI
function getMoodFromIndices(gmi: number, cfi: number, hri: number): string {
  // High fear takes priority
  if (cfi > 60) return 'fear';
  if (cfi > 45) return 'neutral';
  
  // High hope
  if (hri > 60) return 'hope';
  
  // GMI-based
  if (gmi > 20) return 'hope';
  if (gmi > 0) return 'calm';
  if (gmi > -20) return 'neutral';
  if (gmi > -40) return 'fear';
  
  return 'anger';
}

// Mood colors
const MOOD_COLORS: Record<string, string> = {
  hope: '#2A9D8F',    // Green - Hope
  calm: '#457B9D',    // Blue - Calm
  neutral: '#E9C46A', // Yellow - Neutral
  fear: '#F4A261',    // Orange - Fear
  anger: '#E63946',   // Red - Anger
  sadness: '#8D5CF6', // Purple - Sadness
};

interface CountryData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

// World Map Component with real data
function InteractiveWorldMap({ 
  onCountryClick,
  countriesData,
  isLoading 
}: { 
  onCountryClick: (code: string, name: string) => void;
  countriesData: CountryData[];
  isLoading: boolean;
}) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  // Create a map of country data for quick lookup
  const countryDataMap = useMemo(() => {
    const map: Record<string, CountryData> = {};
    countriesData.forEach(c => {
      map[c.countryCode] = c;
    });
    return map;
  }, [countriesData]);

  // Get mood for a country
  const getCountryMood = (code: string): string => {
    const data = countryDataMap[code];
    if (!data) return 'neutral';
    return getMoodFromIndices(data.gmi, data.cfi, data.hri);
  };

  // Get tooltip info for a country
  const getCountryInfo = (code: string) => {
    const data = countryDataMap[code];
    const position = COUNTRY_POSITIONS[code];
    if (!data || !position) return null;
    return {
      name: position.name,
      nameEn: position.nameEn,
      gmi: data.gmi,
      cfi: data.cfi,
      hri: data.hri,
      mood: getMoodFromIndices(data.gmi, data.cfi, data.hri),
    };
  };

  const hoveredInfo = hoveredCountry ? getCountryInfo(hoveredCountry) : null;

  return (
    <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-slate-900/50 to-slate-800/50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl overflow-hidden border border-border/30">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري تحميل البيانات...</span>
          </div>
        </div>
      )}
      
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
        {Object.entries(COUNTRY_POSITIONS).map(([code, position]) => {
          const isHovered = hoveredCountry === code;
          const mood = getCountryMood(code);
          const color = MOOD_COLORS[mood] || MOOD_COLORS.neutral;
          
          return (
            <g 
              key={code}
              onClick={() => onCountryClick(code, position.nameEn)}
              onMouseEnter={() => setHoveredCountry(code)}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer"
            >
              {/* Glow effect */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isHovered ? 3 : 2}
                fill={color}
                opacity={isHovered ? 0.4 : 0.2}
                className="transition-all duration-300"
              />
              {/* Main dot */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isHovered ? 1.5 : 1}
                fill={color}
                className="transition-all duration-300"
              />
              {/* Pulse animation for hovered */}
              {isHovered && (
                <circle
                  cx={position.x}
                  cy={position.y}
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
      {hoveredInfo && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-border shadow-lg min-w-[200px]">
          <p className="text-sm font-medium mb-2">
            {hoveredInfo.name} ({hoveredInfo.nameEn})
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground">GMI</div>
              <div className={`font-bold ${hoveredInfo.gmi > 0 ? 'text-green-400' : hoveredInfo.gmi < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                {hoveredInfo.gmi > 0 ? '+' : ''}{hoveredInfo.gmi.toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">CFI</div>
              <div className={`font-bold ${hoveredInfo.cfi > 50 ? 'text-orange-400' : 'text-blue-400'}`}>
                {hoveredInfo.cfi.toFixed(0)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">HRI</div>
              <div className={`font-bold ${hoveredInfo.hri > 50 ? 'text-green-400' : 'text-gray-400'}`}>
                {hoveredInfo.hri.toFixed(0)}%
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">اضغط لعرض التفاصيل</p>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50">
        <p className="text-xs font-medium mb-2">المزاج السائد</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MOOD_COLORS).slice(0, 5).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">
                {mood === 'hope' ? 'أمل' : mood === 'calm' ? 'هدوء' : mood === 'neutral' ? 'محايد' : mood === 'fear' ? 'خوف' : 'غضب'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Data freshness indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          بيانات حية
        </span>
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
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Fetch latest indices with auto-refresh every 30 seconds
  const { data: latestIndices, isLoading: indicesLoading } = trpc.emotion.getLatestIndices.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );

  // Fetch all countries emotion data with auto-refresh every 30 seconds
  const { data: countriesData, isLoading: countriesLoading } = trpc.map.getAllCountriesEmotions.useQuery(
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
    { href: '/markets', label: isRTL ? 'الأسواق' : 'Markets' },
    { href: '/map', label: t.nav.map },
    { href: '/live', label: t.nav.live },
    { href: '/weather', label: t.nav.weather },
    { href: '/trends', label: 'Trends' },
    { href: '/theory', label: t.nav.theory },
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
            <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
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
            {isAuthenticated ? (
              <UserMenu isRTL={isRTL} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    {isRTL ? 'دخول' : 'Login'}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="glow-button text-white gap-2">
                    <UserPlus className="w-4 h-4" />
                    {isRTL ? 'تسجيل' : 'Sign Up'}
                  </Button>
                </Link>
              </>
            )}
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
              {isAuthenticated ? (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'مستخدم مسجل' : 'Logged in'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/user-dashboard">
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" />
                        {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-4 h-4" />
                        {isRTL ? 'الملف الشخصي' : 'Profile'}
                      </Button>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin">
                        <Button variant="outline" className="w-full justify-start gap-2 text-primary" onClick={() => setMobileMenuOpen(false)}>
                          <Shield className="w-4 h-4" />
                          {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-4">
                  <Link href="/login" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      {isRTL ? 'دخول' : 'Login'}
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button 
                      className="glow-button text-white w-full gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      {isRTL ? 'تسجيل' : 'Sign Up'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Clear Value Proposition */}
      <section className="py-16 border-b border-border/50">
        <div className="container max-w-5xl">
          <div className="text-center space-y-6">
            {/* Main Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold cosmic-text leading-tight">
              {isRTL ? (
                <>
                  افهم <span className="gradient-text">مشاعر الناس</span> تجاه أي قضية
                  <br className="hidden md:block" />
                  <span className="text-3xl md:text-4xl lg:text-5xl">خلال دقائق</span>
                </>
              ) : (
                <>
                  Understand <span className="gradient-text">How People Feel</span>
                  <br className="hidden md:block" />
                  <span className="text-3xl md:text-4xl lg:text-5xl">About Any Topic in Minutes</span>
                </>
              )}
            </h2>
            
            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isRTL 
                ? 'AmalSense يحلل ملايين المصادر الرقمية ليكشف لك المشاعر الجماعية الحقيقية - للصحفيين والباحثين والمؤسسات'
                : 'AmalSense analyzes millions of digital sources to reveal real collective emotions - for journalists, researchers, and organizations'
              }
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/analyzer')}
                className="glow-button text-white px-8 py-6 text-lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                {isRTL ? 'جرّب التحليل مجاناً' : 'Try Analysis Free'}
              </Button>
              <Button
                onClick={() => navigate('/how-it-works')}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                {isRTL ? 'كيف يعمل؟' : 'How It Works?'}
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{isRTL ? '15+ مصدر بيانات' : '15+ Data Sources'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{isRTL ? '50+ دولة' : '50+ Countries'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{isRTL ? 'تحليل فوري' : 'Real-time Analysis'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For? Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h3 className="text-2xl font-bold text-center cosmic-text mb-8">
            {isRTL ? 'لمن هذا؟' : 'Who Is This For?'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Journalist Card */}
            <Card 
              className="cosmic-card p-6 hover:border-foreground/30 transition-all cursor-pointer group"
              onClick={() => navigate('/journalist')}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-foreground/10 group-hover:scale-110 transition-transform">
                  <Newspaper className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">
                    {isRTL ? 'الصحفيين والإعلاميين' : 'Journalists & Media'}
                  </h4>
                  <p className="text-muted-foreground mb-3">
                    {isRTL 
                      ? 'اكتشف القصص التي يتفاعل معها الناس الآن. افهم المشاعر الجماعية قبل أن تصبح أخباراً.'
                      : 'Discover stories people are reacting to now. Understand collective emotions before they become news.'
                    }
                  </p>
                  <div className="flex items-center text-sm font-medium group-hover:gap-2 transition-all">
                    {isRTL ? 'استكشف لوحة الصحفي' : 'Explore Journalist Dashboard'}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Researcher Card */}
            <Card 
              className="cosmic-card p-6 hover:border-foreground/30 transition-all cursor-pointer group"
              onClick={() => navigate('/researcher')}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-foreground/10 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">
                    {isRTL ? 'الباحثين والأكاديميين' : 'Researchers & Academics'}
                  </h4>
                  <p className="text-muted-foreground mb-3">
                    {isRTL 
                      ? 'بيانات مشاعر حقيقية من ملايين المصادر. API قوي وبيانات جاهزة للتحليل الأكاديمي.'
                      : 'Real emotion data from millions of sources. Powerful API and data ready for academic analysis.'
                    }
                  </p>
                  <div className="flex items-center text-sm font-medium group-hover:gap-2 transition-all">
                    {isRTL ? 'استكشف لوحة الباحث' : 'Explore Researcher Dashboard'}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
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

      {/* World Map Section - Connected to Real Data */}
      <section className="py-8 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold cosmic-text mb-2">خريطة المشاعر العالمية</h3>
            <p className="text-muted-foreground text-sm">اضغط على أي دولة لعرض تفاصيل المزاج العام • يتم التحديث كل 30 ثانية</p>
          </div>
          
          <EmotionGoogleMap 
            className="h-[500px]"
            onCountryClick={handleCountryClick}
            countriesData={countriesData || []}
            isLoading={countriesLoading}
          />
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
                <span className="font-bold gradient-text">Amaalsense</span>
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
