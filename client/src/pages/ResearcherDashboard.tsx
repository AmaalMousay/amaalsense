import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LogoIcon } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/_core/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import { 
  GraduationCap, Database, Code, FileJson, Search, Download,
  BarChart3, Globe, Clock, BookOpen, Microscope, LineChart,
  Table, Copy, Check, Filter, Calendar, TrendingUp, TrendingDown,
  Heart, Frown, Angry, AlertTriangle, Smile, Meh, RefreshCw,
  FileSpreadsheet, FileText, Braces, Quote, ExternalLink,
  ChevronDown, ChevronUp, Info, Zap, Users, MapPin
} from 'lucide-react';

// Types
interface CountryData {
  country: string;
  countryAr: string;
  flag: string;
  fear: number;
  hope: number;
  anger: number;
  joy: number;
  sadness: number;
  polarization: number;
  dataPoints: number;
  lastUpdate: string;
}

interface ResearchVariable {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: 'index' | 'ratio' | 'score';
  range: string;
  icon: React.ReactNode;
  color: string;
  methodology: string;
}

// Research Variables - Quantitative measures ready for academic use
const RESEARCH_VARIABLES: ResearchVariable[] = [
  {
    id: 'fear_index',
    name: 'Fear Index',
    nameAr: 'مؤشر الخوف',
    description: 'Measures collective fear and anxiety levels from social discourse',
    descriptionAr: 'يقيس مستويات الخوف والقلق الجماعي من الخطاب الاجتماعي',
    type: 'index',
    range: '0-100',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-orange-400',
    methodology: 'NLP sentiment analysis + lexicon-based fear detection'
  },
  {
    id: 'hope_index',
    name: 'Hope Index',
    nameAr: 'مؤشر الأمل',
    description: 'Quantifies optimism and positive expectations in public discourse',
    descriptionAr: 'يقيس التفاؤل والتوقعات الإيجابية في الخطاب العام',
    type: 'index',
    range: '0-100',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-green-400',
    methodology: 'Transformer-based sentiment + hope lexicon mapping'
  },
  {
    id: 'anger_level',
    name: 'Anger Level',
    nameAr: 'مستوى الغضب',
    description: 'Tracks collective anger and frustration intensity',
    descriptionAr: 'يتتبع شدة الغضب والإحباط الجماعي',
    type: 'score',
    range: '0-100',
    icon: <Angry className="w-5 h-5" />,
    color: 'text-red-400',
    methodology: 'Multi-label emotion classification + intensity scoring'
  },
  {
    id: 'polarization_index',
    name: 'Polarization Index',
    nameAr: 'مؤشر الاستقطاب',
    description: 'Measures opinion divergence and social division on topics',
    descriptionAr: 'يقيس تباين الآراء والانقسام الاجتماعي حول المواضيع',
    type: 'index',
    range: '0-100',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-purple-400',
    methodology: 'Stance detection + sentiment variance analysis'
  },
  {
    id: 'emotional_volatility',
    name: 'Emotional Volatility',
    nameAr: 'التقلب العاطفي',
    description: 'Measures rate of emotional change over time',
    descriptionAr: 'يقيس معدل التغير العاطفي عبر الزمن',
    type: 'ratio',
    range: '0-1',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-yellow-400',
    methodology: 'Time-series analysis of emotion scores'
  },
  {
    id: 'joy_index',
    name: 'Joy Index',
    nameAr: 'مؤشر الفرح',
    description: 'Captures positive emotional expressions and celebrations',
    descriptionAr: 'يرصد التعبيرات العاطفية الإيجابية والاحتفالات',
    type: 'index',
    range: '0-100',
    icon: <Smile className="w-5 h-5" />,
    color: 'text-cyan-400',
    methodology: 'Emotion detection + positive sentiment aggregation'
  }
];

// Cross-cultural comparison data
const COUNTRY_DATA: CountryData[] = [
  { country: 'Libya', countryAr: 'ليبيا', flag: '🇱🇾', fear: 72, hope: 28, anger: 65, joy: 18, sadness: 58, polarization: 78, dataPoints: 125000, lastUpdate: '2026-01-31' },
  { country: 'Egypt', countryAr: 'مصر', flag: '🇪🇬', fear: 48, hope: 45, anger: 42, joy: 35, sadness: 38, polarization: 55, dataPoints: 450000, lastUpdate: '2026-01-31' },
  { country: 'Saudi Arabia', countryAr: 'السعودية', flag: '🇸🇦', fear: 32, hope: 58, anger: 28, joy: 52, sadness: 25, polarization: 35, dataPoints: 380000, lastUpdate: '2026-01-31' },
  { country: 'UAE', countryAr: 'الإمارات', flag: '🇦🇪', fear: 25, hope: 68, anger: 22, joy: 62, sadness: 18, polarization: 28, dataPoints: 220000, lastUpdate: '2026-01-31' },
  { country: 'Kuwait', countryAr: 'الكويت', flag: '🇰🇼', fear: 38, hope: 52, anger: 45, joy: 42, sadness: 32, polarization: 58, dataPoints: 95000, lastUpdate: '2026-01-31' },
  { country: 'Jordan', countryAr: 'الأردن', flag: '🇯🇴', fear: 42, hope: 48, anger: 38, joy: 38, sadness: 35, polarization: 45, dataPoints: 85000, lastUpdate: '2026-01-31' },
  { country: 'Morocco', countryAr: 'المغرب', flag: '🇲🇦', fear: 35, hope: 55, anger: 32, joy: 48, sadness: 28, polarization: 42, dataPoints: 180000, lastUpdate: '2026-01-31' },
  { country: 'Tunisia', countryAr: 'تونس', flag: '🇹🇳', fear: 45, hope: 42, anger: 48, joy: 32, sadness: 42, polarization: 62, dataPoints: 75000, lastUpdate: '2026-01-31' },
  { country: 'Algeria', countryAr: 'الجزائر', flag: '🇩🇿', fear: 40, hope: 45, anger: 42, joy: 35, sadness: 38, polarization: 48, dataPoints: 120000, lastUpdate: '2026-01-31' },
  { country: 'Iraq', countryAr: 'العراق', flag: '🇮🇶', fear: 68, hope: 32, anger: 58, joy: 22, sadness: 55, polarization: 72, dataPoints: 145000, lastUpdate: '2026-01-31' },
  { country: 'Syria', countryAr: 'سوريا', flag: '🇸🇾', fear: 75, hope: 25, anger: 62, joy: 15, sadness: 68, polarization: 65, dataPoints: 65000, lastUpdate: '2026-01-31' },
  { country: 'Lebanon', countryAr: 'لبنان', flag: '🇱🇧', fear: 58, hope: 35, anger: 55, joy: 28, sadness: 52, polarization: 75, dataPoints: 95000, lastUpdate: '2026-01-31' },
  { country: 'Palestine', countryAr: 'فلسطين', flag: '🇵🇸', fear: 78, hope: 35, anger: 72, joy: 18, sadness: 75, polarization: 45, dataPoints: 55000, lastUpdate: '2026-01-31' },
  { country: 'Yemen', countryAr: 'اليمن', flag: '🇾🇪', fear: 82, hope: 22, anger: 68, joy: 12, sadness: 72, polarization: 68, dataPoints: 42000, lastUpdate: '2026-01-31' },
  { country: 'Sudan', countryAr: 'السودان', flag: '🇸🇩', fear: 70, hope: 28, anger: 62, joy: 18, sadness: 58, polarization: 65, dataPoints: 38000, lastUpdate: '2026-01-31' },
];

// API Endpoints
const API_ENDPOINTS = [
  { method: 'GET', endpoint: '/api/v1/emotions', description: 'Get emotion scores for a topic', descriptionAr: 'الحصول على درجات المشاعر لموضوع' },
  { method: 'GET', endpoint: '/api/v1/countries/{code}', description: 'Get country-specific data', descriptionAr: 'الحصول على بيانات دولة محددة' },
  { method: 'GET', endpoint: '/api/v1/historical', description: 'Historical emotion data', descriptionAr: 'البيانات التاريخية للمشاعر' },
  { method: 'GET', endpoint: '/api/v1/compare', description: 'Cross-cultural comparison', descriptionAr: 'مقارنة عبر الثقافات' },
  { method: 'POST', endpoint: '/api/v1/analyze', description: 'Analyze custom text', descriptionAr: 'تحليل نص مخصص' },
  { method: 'GET', endpoint: '/api/v1/export', description: 'Export data (CSV/JSON)', descriptionAr: 'تصدير البيانات (CSV/JSON)' },
];

// Datasets
const DATASETS = [
  { name: 'Global Mood Index 2024-2026', nameAr: 'مؤشر المزاج العالمي 2024-2026', records: '5.2M', format: 'JSON/CSV', size: '2.8 GB', updated: '2026-01-31' },
  { name: 'Arabic Social Sentiment', nameAr: 'المشاعر الاجتماعية العربية', records: '2.1M', format: 'JSON/CSV', size: '1.2 GB', updated: '2026-01-31' },
  { name: 'Crisis Events Emotions', nameAr: 'مشاعر أحداث الأزمات', records: '850K', format: 'JSON/CSV', size: '480 MB', updated: '2026-01-30' },
  { name: 'Political Discourse Analysis', nameAr: 'تحليل الخطاب السياسي', records: '1.5M', format: 'JSON/CSV', size: '920 MB', updated: '2026-01-29' },
];

export default function ResearcherDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [isArabic, setIsArabic] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof CountryData>('fear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Sort countries
  const sortedCountries = useMemo(() => {
    return [...COUNTRY_DATA].sort((a, b) => {
      const aVal = a[sortBy] as number;
      const bVal = b[sortBy] as number;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [sortBy, sortOrder]);

  // Generate citation
  const generateCitation = (style: 'apa' | 'mla' | 'chicago') => {
    const year = new Date().getFullYear();
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    switch (style) {
      case 'apa':
        return `AmalSense. (${year}). Global Collective Emotions Dataset [Data set]. AmalSense Research Platform. https://amalsense.com/research`;
      case 'mla':
        return `"Global Collective Emotions Dataset." AmalSense Research Platform, ${year}, amalsense.com/research. Accessed ${date}.`;
      case 'chicago':
        return `AmalSense. "Global Collective Emotions Dataset." AmalSense Research Platform. Accessed ${date}. https://amalsense.com/research.`;
      default:
        return '';
    }
  };

  const handleCopyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleSort = (column: keyof CountryData) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getEmotionColor = (value: number) => {
    if (value >= 70) return 'text-red-400';
    if (value >= 50) return 'text-orange-400';
    if (value >= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <LogoIcon size="sm" />
                <span className="text-lg font-bold text-foreground hidden sm:block">AmalSense</span>
              </div>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-sm">Research</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">API</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsArabic(!isArabic)}
            >
              {isArabic ? 'EN' : 'عربي'}
            </Button>
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Microscope className="w-3 h-3 mr-1" />
            Computational Social Science
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {isArabic ? (
              <>مختبر <span className="text-blue-400">اجتماعي رقمي</span> عالمي</>
            ) : (
              <>A Global <span className="text-blue-400">Digital Social</span> Laboratory</>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            {isArabic 
              ? 'مجموعة بيانات واسعة النطاق للمشاعر الجماعية المُكمَّمة عبر الثقافات والزمن'
              : 'A large-scale dataset of quantified collective emotions across cultures and time'
            }
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">9.6M+</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'سجل بيانات' : 'Data Records'}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'دولة' : 'Countries'}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">3 {isArabic ? 'سنوات' : 'Years'}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'بيانات تاريخية' : 'Historical Data'}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">6</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'متغيرات' : 'Variables'}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Code className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">REST</div>
              <div className="text-xs text-muted-foreground">API</div>
            </CardContent>
          </Card>
        </div>

        {/* Research Variables Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Microscope className="w-6 h-6 text-blue-400" />
              {isArabic ? 'المتغيرات البحثية' : 'Research Variables'}
            </h2>
            <Badge variant="outline" className="text-muted-foreground">
              {isArabic ? 'جاهزة للنشر العلمي' : 'Publication-Ready'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESEARCH_VARIABLES.map(variable => (
              <Card 
                key={variable.id}
                className={`bg-card border-border hover:border-blue-500/50 transition-all cursor-pointer ${selectedVariable === variable.id ? 'ring-1 ring-blue-500' : ''}`}
                onClick={() => setSelectedVariable(selectedVariable === variable.id ? null : variable.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-muted ${variable.color}`}>
                        {variable.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{isArabic ? variable.nameAr : variable.name}</h3>
                        <Badge variant="outline" className="text-xs">{variable.type}</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{variable.range}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isArabic ? variable.descriptionAr : variable.description}
                  </p>
                  {selectedVariable === variable.id && (
                    <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                      <strong>Methodology:</strong> {variable.methodology}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cross-Cultural Comparison Table */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-400" />
              {isArabic ? 'مقارنة عبر الثقافات' : 'Cross-Cultural Comparison'}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {isArabic ? 'تصدير' : 'Export'}
              </Button>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-right p-3 text-muted-foreground font-medium">{isArabic ? 'الدولة' : 'Country'}</th>
                      <th 
                        className="text-center p-3 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('fear')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isArabic ? 'الخوف' : 'Fear'}
                          {sortBy === 'fear' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th 
                        className="text-center p-3 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('hope')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isArabic ? 'الأمل' : 'Hope'}
                          {sortBy === 'hope' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th 
                        className="text-center p-3 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('anger')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isArabic ? 'الغضب' : 'Anger'}
                          {sortBy === 'anger' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th 
                        className="text-center p-3 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('polarization')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isArabic ? 'الاستقطاب' : 'Polarization'}
                          {sortBy === 'polarization' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th className="text-center p-3 text-muted-foreground font-medium">{isArabic ? 'نقاط البيانات' : 'Data Points'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCountries.map(country => (
                      <tr key={country.country} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{country.flag}</span>
                            <span className="font-medium text-foreground">{isArabic ? country.countryAr : country.country}</span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-bold ${getEmotionColor(country.fear)}`}>{country.fear}%</span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-bold ${country.hope >= 50 ? 'text-green-400' : 'text-orange-400'}`}>{country.hope}%</span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-bold ${getEmotionColor(country.anger)}`}>{country.anger}%</span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-bold ${getEmotionColor(country.polarization)}`}>{country.polarization}%</span>
                        </td>
                        <td className="text-center p-3 text-muted-foreground">
                          {(country.dataPoints / 1000).toFixed(0)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Datasets & Export */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Available Datasets */}
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue-400" />
              {isArabic ? 'مجموعات البيانات' : 'Available Datasets'}
            </h2>
            <div className="space-y-3">
              {DATASETS.map((dataset, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileJson className="w-8 h-8 text-blue-400" />
                        <div>
                          <h3 className="font-bold text-foreground">{isArabic ? dataset.nameAr : dataset.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{dataset.records} records</span>
                            <span>•</span>
                            <span>{dataset.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-green-400" />
              {isArabic ? 'خيارات التصدير' : 'Export Options'}
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <FileSpreadsheet className="w-8 h-8 text-green-400" />
                    <span>CSV</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <Braces className="w-8 h-8 text-yellow-400" />
                    <span>JSON</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <span>Excel</span>
                  </Button>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <Info className="w-4 h-4 inline mr-2" />
                  {isArabic 
                    ? 'البيانات المُصدَّرة تتضمن جميع المتغيرات مع البيانات الوصفية الكاملة'
                    : 'Exported data includes all variables with full metadata'
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Citation Generator */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-purple-400" />
            {isArabic ? 'توليد الاستشهاد' : 'Citation Generator'}
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                {(['apa', 'mla', 'chicago'] as const).map(style => (
                  <div key={style} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{style.toUpperCase()}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopyCitation(generateCitation(style))}
                      >
                        {copiedCitation ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {generateCitation(style)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-cyan-400" />
            {isArabic ? 'توثيق API' : 'API Documentation'}
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="space-y-3 mb-6">
                {API_ENDPOINTS.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={api.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                        {api.method}
                      </Badge>
                      <code className="text-purple-400 font-mono text-sm">{api.endpoint}</code>
                    </div>
                    <span className="text-sm text-muted-foreground">{isArabic ? api.descriptionAr : api.description}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="text-foreground font-bold mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  {isArabic ? 'مثال على الاستخدام' : 'Example Usage'}
                </h4>
                <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`curl -X GET "https://api.amalsense.com/v1/emotions?topic=climate+change&countries=EG,SA,AE" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Response:
{
  "topic": "climate change",
  "emotions": {
    "fear": 45.2,
    "hope": 38.5,
    "anger": 28.1,
    "polarization": 52.3
  },
  "countries": [...],
  "data_points": 125000,
  "timestamp": "2026-01-31T12:00:00Z"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            {isArabic ? 'خطط الاشتراك للباحثين' : 'Research Subscription Plans'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Individual */}
            <Card className="bg-card border-border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">{isArabic ? 'باحث فردي' : 'Individual'}</h3>
                <p className="text-3xl font-bold text-foreground">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'جميع المتغيرات' : 'All variables'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تصدير CSV/JSON' : 'CSV/JSON export'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? '10K طلب API/شهر' : '10K API calls/mo'}
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {isArabic ? 'ابدأ الآن' : 'Get Started'}
              </Button>
            </Card>

            {/* University */}
            <Card className="bg-card border-border p-6 ring-2 ring-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                {isArabic ? 'للجامعات' : 'For Universities'}
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">{isArabic ? 'ترخيص جامعي' : 'University License'}</h3>
                <p className="text-3xl font-bold text-foreground">$1,500<span className="text-sm font-normal text-muted-foreground">/yr</span></p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'وصول غير محدود' : 'Unlimited access'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'حسابات متعددة' : 'Multiple accounts'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'بيانات تاريخية كاملة' : 'Full historical data'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'دعم أكاديمي' : 'Academic support'}
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </Button>
            </Card>

            {/* Research API */}
            <Card className="bg-card border-border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Research API</h3>
                <p className="text-3xl font-bold text-foreground">{isArabic ? 'مخصص' : 'Custom'}</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'API كامل' : 'Full API access'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'بيانات خام' : 'Raw data access'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  {isArabic ? 'تكامل مخصص' : 'Custom integration'}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="text-green-400">✓</span>
                  SLA
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {isArabic ? 'طلب عرض سعر' : 'Request Quote'}
              </Button>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isArabic ? 'ابدأ بحثك الآن' : 'Start Your Research Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {isArabic 
                ? 'انضم إلى مئات الباحثين الذين يستخدمون AmalSense لدراسة المشاعر الجماعية'
                : 'Join hundreds of researchers using AmalSense to study collective emotions'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/analyzer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Search className="w-5 h-5 mr-2" />
                  {isArabic ? 'تجربة التحليل' : 'Try Analysis'}
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Code className="w-5 h-5 mr-2" />
                {isArabic ? 'طلب API Key' : 'Request API Key'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 AmalSense Research. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isArabic 
              ? 'مختبر اجتماعي رقمي عالمي للعلوم الاجتماعية الحسابية'
              : 'A Global Digital Social Laboratory for Computational Social Science'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}
