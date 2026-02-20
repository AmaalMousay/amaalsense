import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockStyleIndicator } from '@/components/StockStyleIndicator';
import { trpc } from '@/lib/trpc';
import { Link, useLocation } from 'wouter';
import { 
  TrendingUp, Zap, Heart, Menu, X, 
  BookOpen, Building2, HelpCircle, FileText,
  ChevronRight, Globe, Brain, Shield, Users, BarChart3, Clock, Bell, Loader2,
  LogIn, UserPlus, LayoutDashboard, User, Newspaper, GraduationCap, Search, ArrowRight,
  MessageCircle, Cloud
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CurrentDateTime, LastUpdated, RealTimePulse } from '@/components/CurrentDateTime';
import { FooterLegend } from '@/components/EmotionLegend';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/i18n';
import { EmotionGoogleMap } from '@/components/EmotionGoogleMap';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/_core/hooks/useAuth';
import { COUNTRIES } from '@/data/countries';

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
            <span>Loading data...</span>
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
          <p className="text-xs text-muted-foreground mt-2 text-center">Click to view details</p>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50">
        <p className="text-xs font-medium mb-2">Dominant Mood</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MOOD_COLORS).slice(0, 5).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">
                {mood === 'hope' ? 'Hope' : mood === 'calm' ? 'Calm' : mood === 'neutral' ? 'Neutral' : mood === 'fear' ? 'Fear' : 'Anger'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Data freshness indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Data
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
  const [analysisTopic, setAnalysisTopic] = useState('');
  // Country will be auto-detected by AI from topic context
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { t, isRTL } = useI18n();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!analysisTopic.trim()) return;
    setIsAnalyzing(true);
    // Navigate to new AI-powered analysis page (country auto-detected)
    navigate(`/smart-analysis?topic=${encodeURIComponent(analysisTopic)}`);
  };

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
    // Navigate to Smart Analysis with country context
    navigate(`/smart-analysis?topic=${encodeURIComponent(name + ' economy and politics')}`);
  };

  // Navigation links - Dashboard only for logged-in users via UserMenu
  const navLinks = [
    { href: '/smart-analysis', label: isRTL ? 'التحليل الذكي' : 'Smart Analysis', icon: <Brain className="w-4 h-4" /> },
    { href: '/chat', label: isRTL ? 'محادثة' : 'Chat', icon: <MessageCircle className="w-4 h-4" /> },
    { href: '/emotional-weather', label: isRTL ? 'طقس العاطفي' : 'Emotional Weather', icon: <Cloud className="w-4 h-4" /> },
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
                <span className="text-sm hover:text-accent transition-colors cursor-pointer flex items-center gap-1">
                  {link.icon && link.icon}
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
                    className="flex items-center gap-2 py-2 text-sm hover:text-accent transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon && link.icon}
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

      {/* Hero Section - جرب التحليل الآن */}
      <section id="analysis-section" className="py-20 border-b border-border/50">
        <div className="container max-w-4xl">
          <div className="text-center space-y-8">
            {/* Main Headline - بارز وكبير */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {isRTL ? (
                <>
                  <span className="gradient-text">جرب التحليل</span> الآن
                </>
              ) : (
                <>
                  <span className="gradient-text">Try Analysis</span> Now
                </>
              )}
            </h2>
            
            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isRTL 
                ? 'أدخل أي موضوع واكتشف كيف يشعر الناس تجاهه'
                : 'Enter any topic and discover how people feel about it'
              }
            </p>
            
            {/* Analysis Input Box - بارز */}
            <Card className="cosmic-card p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'الموضوع' : 'Topic'}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={analysisTopic}
                      onChange={(e) => setAnalysisTopic(e.target.value)}
                      placeholder={isRTL ? 'مثال: الانتخابات الأمريكية، أسعار النفط، الذكاء الاصطناعي...' : 'e.g., US Elections, Oil Prices, AI Technology...'}
                      className="pl-10 h-14 text-lg bg-background/50"
                    />
                  </div>
                </div>
                
                {/* AI will auto-detect country from topic context */}
                
                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!analysisTopic.trim() || isAnalyzing}
                  className="w-full h-14 text-lg glow-button text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {isRTL ? 'جاري التحليل...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      {isRTL ? 'حلل الآن' : 'Analyze Now'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
            

          </div>
        </div>
      </section>



      {/* Live Indices Section */}
      <section className="py-8 border-t border-border/50">
        <div className="container">
          {/* Real-time Header with Date/Time */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="text-center md:text-start">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h3 className="text-2xl font-bold cosmic-text">{t.home.liveIndices}</h3>
                <RealTimePulse isRTL={isRTL} />
              </div>
              <p className="text-muted-foreground text-sm">{t.home.liveIndicesDesc}</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <CurrentDateTime 
                showDate={true} 
                showTime={true} 
                showTimezone={true}
                isRTL={isRTL}
                variant="full"
                className="text-sm"
              />
              <LastUpdated 
                timestamp={Date.now() - 120000} 
                isRTL={isRTL}
                showIcon={true}
              />
            </div>
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
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="text-center md:text-start">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h3 className="text-2xl font-bold cosmic-text">
                  {isRTL ? 'خريطة المشاعر العالمية' : 'Global Emotion Map'}
                </h3>
                <RealTimePulse isRTL={isRTL} />
              </div>
              <p className="text-muted-foreground text-sm">
                {isRTL ? 'اضغط على أي دولة لعرض تفاصيل المزاج • يتحدث كل 30 ثانية' : 'Click on any country to view mood details • Updates every 30 seconds'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CurrentDateTime 
                showDate={false} 
                showTime={true} 
                showTimezone={true}
                isRTL={isRTL}
                variant="compact"
              />
            </div>
          </div>
          
          <EmotionGoogleMap 
            className="h-[500px]"
            onCountryClick={handleCountryClick}
            countriesData={countriesData || []}
            isLoading={countriesLoading}
          />
        </div>
      </section>

      {/* How It Works - كيف يعمل */}
      <section className="py-12 border-t border-border/50">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold cosmic-text mb-2">
              {isRTL ? 'كيف يعمل AmalSense؟' : 'How AmalSense Works?'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-bold mb-2">{isRTL ? 'أدخل الموضوع' : 'Enter Topic'}</h4>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'اكتب أي موضوع أو قضية تريد تحليلها' : 'Type any topic or issue you want to analyze'}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-bold mb-2">{isRTL ? 'الذكاء يحلل' : 'AI Analyzes'}</h4>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'الذكاء يكتشف السياق ويحلل المشاعر' : 'AI detects context and analyzes emotions'}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-bold mb-2">{isRTL ? 'احصل على النتائج' : 'Get Results'}</h4>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'شاهد تحليل المشاعر والأسباب والتوصيات' : 'View emotion analysis, causes, and recommendations'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 border-t border-border/50">
        <div className="container text-center">
          <h3 className="text-2xl font-bold cosmic-text mb-4">{t.home.readyToStart}</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="glow-button text-white px-8 py-4"
            >
              {t.home.launchAnalyzer}
            </Button>
            <Button
              onClick={() => navigate('/use-cases')}
              variant="outline"
              className="px-8 py-4"
            >
              Use Cases
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
                <li><Link href="/dashboard" className="hover:text-accent">Dashboard</Link></li>
                <li><Link href="/smart-analysis" className="hover:text-accent">Smart Analysis</Link></li>
                <li><Link href="/theory" className="hover:text-accent">Theory</Link></li>
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
