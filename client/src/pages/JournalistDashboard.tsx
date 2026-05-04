import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Clock, 
  Search,
  Download,
  Bell,
  BarChart3,
  Globe,
  Users,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Zap,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  MessageSquare,
  Share2,
  Flame,
  Target,
  MapPin
} from 'lucide-react';

// Types
interface Story {
  id: number;
  topic: string;
  topicEn: string;
  emotions: {
    anger: number;
    fear: number;
    hope: number;
    sadness: number;
    joy: number;
    neutral: number;
  };
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  sources: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  countries: string[];
  timestamp: string;
  dominantEmotion: string;
  engagementScore: number;
}

interface CountryData {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
}

// Countries data
const countries: CountryData[] = [
  { code: 'all', name: 'All Countries', nameAr: 'جميع الدول', flag: '🌍' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', flag: '🇮🇶' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', flag: '🇵🇸' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', flag: '🇸🇩' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭' },
];

// Country comparison data
const countryComparison = {
  'قرارات الجنسية في الكويت': [
    { country: 'الكويت', emotion: 'غضب شديد', percent: 78, color: '#E63946' },
    { country: 'السعودية', emotion: 'حياد', percent: 45, color: '#6C757D' },
    { country: 'الإمارات', emotion: 'تعاطف', percent: 62, color: '#457B9D' },
    { country: 'مصر', emotion: 'حياد', percent: 38, color: '#6C757D' },
  ]
};

export default function JournalistDashboard() {
  const [isArabic, setIsArabic] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time trending stories query
  const { data: trendingStories, isLoading, refetch, isRefetching } = trpc.engine.getTrendingStories.useQuery({
    countryCode: selectedCountry,
    limit: 20
  });

  const allStories = useMemo(() => {
    if (!trendingStories) return [];
    return trendingStories as unknown as Story[];
  }, [trendingStories]);

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Filter stories
  const filteredStories = useMemo(() => {
    let stories = allStories;
    
    if (searchQuery) {
      stories = stories.filter(story => 
        story.topic.includes(searchQuery) || story.topicEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return stories.sort((a, b) => b.engagementScore - a.engagementScore);
  }, [allStories, searchQuery]);

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'عاجل جداً';
      case 'high': return 'عاجل';
      case 'medium': return 'مهم';
      case 'low': return 'عادي';
      default: return 'غير محدد';
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'غضب': '#E63946',
      'خوف': '#F4A261',
      'أمل': '#2A9D8F',
      'حزن': '#8D5CF6',
      'فرح': '#2A9D8F',
      'حياد': '#6C757D'
    };
    return colors[emotion] || '#6C757D';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-red-400" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-green-400" />;
    return <span className="w-4 h-4 text-gray-400">—</span>;
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="text-2xl font-bold text-foreground cursor-pointer">
                  AmalSense
                </span>
              </Link>
              <Badge variant="outline" className="bg-foreground/10 text-foreground border-foreground/30">
                <Newspaper className="w-3 h-3 mr-1" />
                Journalist Pro
              </Badge>
            </div>
            <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading || isRefetching ? 'animate-spin' : ''}`} />
              {isArabic ? 'تحديث' : 'Refresh'}
            </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
              </Button>
              <Link href="/analyzer">
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  تحليل موضوع جديد
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            لوحة تحكم الصحفي
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف القصص التي يهتم بها الناس <strong>قبل أن تصبح ترند</strong>
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Country Filter */}
          <div className="flex-1">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full bg-card border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <SelectValue placeholder="اختر الدولة" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.nameAr}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن موضوع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Current Filter Info */}
        {selectedCountry !== 'all' && (
          <div className="mb-6 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCountryData?.flag}</span>
              <span className="font-bold text-foreground">{selectedCountryData?.nameAr}</span>
              <span className="text-muted-foreground">- أخبار خاصة بهذه الدولة</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCountry('all')}
                className="mr-auto"
              >
                عرض جميع الدول
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-foreground">{filteredStories.filter(s => s.urgency === 'critical').length}</div>
              <div className="text-sm text-muted-foreground">قصص عاجلة</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-foreground">{filteredStories.filter(s => s.trend === 'up').length}</div>
              <div className="text-sm text-muted-foreground">اتجاه صاعد</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">{filteredStories.reduce((acc, s) => acc + s.sources, 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">مصدر</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-foreground">{filteredStories.length}</div>
              <div className="text-sm text-muted-foreground">قصة نشطة</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stories List - Left Side */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                أهم 10 قصص الآن
              </h2>
              <Badge variant="outline" className="text-muted-foreground">
                آخر تحديث: منذ دقيقتين
              </Badge>
            </div>

            <div className="space-y-4">
              {filteredStories.slice(0, 10).map((story, index) => (
                <Card 
                  key={story.id} 
                  className={`bg-card border-border hover:border-foreground/30 transition-all cursor-pointer ${selectedStory?.id === story.id ? 'border-foreground/50 ring-1 ring-foreground/20' : ''}`}
                  onClick={() => setSelectedStory(story)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-foreground">
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-foreground text-lg">{story.topic}</h3>
                          <Badge className={getUrgencyStyle(story.urgency)}>
                            {getUrgencyLabel(story.urgency)}
                          </Badge>
                        </div>

                        {/* Emotion Bar */}
                        <div className="mb-3">
                          <div className="flex h-2 rounded-full overflow-hidden">
                            <div style={{ width: `${story.emotions.anger}%`, backgroundColor: '#E63946' }} />
                            <div style={{ width: `${story.emotions.fear}%`, backgroundColor: '#F4A261' }} />
                            <div style={{ width: `${story.emotions.hope}%`, backgroundColor: '#2A9D8F' }} />
                            <div style={{ width: `${story.emotions.sadness}%`, backgroundColor: '#8D5CF6' }} />
                            <div style={{ width: `${story.emotions.joy}%`, backgroundColor: '#2A9D8F' }} />
                            <div style={{ width: `${story.emotions.neutral}%`, backgroundColor: '#6C757D' }} />
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getEmotionColor(story.dominantEmotion) }}
                            />
                            {story.dominantEmotion}
                          </span>
                          <span className="flex items-center gap-1">
                            {getTrendIcon(story.trend)}
                            <span className={story.trend === 'up' ? 'text-red-400' : story.trend === 'down' ? 'text-green-400' : ''}>
                              {story.trend === 'up' ? '+' : story.trend === 'down' ? '-' : ''}{story.trendPercent}%
                            </span>
                          </span>
                          <span>{story.sources.toLocaleString()} مصدر</span>
                          <span className="flex items-center gap-1">
                            {story.countries.slice(0, 3).map(c => countries.find(co => co.code === c)?.flag).join(' ')}
                          </span>
                        </div>
                      </div>

                      {/* Engagement Score */}
                      <div className="flex-shrink-0 text-center">
                        <div className="text-2xl font-bold text-foreground">{story.engagementScore}</div>
                        <div className="text-xs text-muted-foreground">تفاعل</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Story Details - Right Side */}
          <div className="lg:col-span-1">
            {selectedStory ? (
              <div className="sticky top-24 space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">{selectedStory.topic}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Emotion Breakdown */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        تحليل المشاعر
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm text-muted-foreground">غضب</span>
                          <Progress value={selectedStory.emotions.anger} className="flex-1 h-2" style={{ '--progress-color': '#E63946' } as any} />
                          <span className="w-10 text-sm text-foreground">{selectedStory.emotions.anger}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm text-muted-foreground">خوف</span>
                          <Progress value={selectedStory.emotions.fear} className="flex-1 h-2" style={{ '--progress-color': '#F4A261' } as any} />
                          <span className="w-10 text-sm text-foreground">{selectedStory.emotions.fear}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm text-muted-foreground">أمل</span>
                          <Progress value={selectedStory.emotions.hope} className="flex-1 h-2" style={{ '--progress-color': '#2A9D8F' } as any} />
                          <span className="w-10 text-sm text-foreground">{selectedStory.emotions.hope}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm text-muted-foreground">حزن</span>
                          <Progress value={selectedStory.emotions.sadness} className="flex-1 h-2" style={{ '--progress-color': '#8D5CF6' } as any} />
                          <span className="w-10 text-sm text-foreground">{selectedStory.emotions.sadness}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm text-muted-foreground">فرح</span>
                          <Progress value={selectedStory.emotions.joy} className="flex-1 h-2" style={{ '--progress-color': '#2A9D8F' } as any} />
                          <span className="w-10 text-sm text-foreground">{selectedStory.emotions.joy}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Trend */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        {selectedStory.trend === 'up' ? <TrendingUp className="w-4 h-4 text-red-400" /> : <TrendingDown className="w-4 h-4 text-green-400" />}
                        اتجاه المشاعر
                      </h4>
                      <div className={`p-3 rounded-lg ${selectedStory.trend === 'up' ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">التغير خلال 24 ساعة</span>
                          <span className={`font-bold ${selectedStory.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                            {selectedStory.trend === 'up' ? '+' : '-'}{selectedStory.trendPercent}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedStory.trend === 'up' 
                            ? 'المشاعر تتصاعد - قصة ساخنة محتملة'
                            : 'المشاعر تهدأ - القصة تفقد زخمها'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Countries */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        الدول المتأثرة
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStory.countries.map(code => {
                          const country = countries.find(c => c.code === code);
                          return country ? (
                            <Badge key={code} variant="outline" className="bg-card">
                              {country.flag} {country.nameAr}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Suggested Angle */}
                    <div>
                      <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        زاوية التغطية المقترحة
                      </h4>
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-foreground">
                          {selectedStory.dominantEmotion === 'غضب' && `"${selectedStory.dominantEmotion} واسع في مواقع التواصل بعد ${selectedStory.topic}"`}
                          {selectedStory.dominantEmotion === 'خوف' && `"قلق متصاعد بين المواطنين حول ${selectedStory.topic}"`}
                          {selectedStory.dominantEmotion === 'أمل' && `"تفاؤل حذر يسود الشارع تجاه ${selectedStory.topic}"`}
                          {selectedStory.dominantEmotion === 'فرح' && `"احتفاء شعبي واسع بـ${selectedStory.topic}"`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/analyzer?topic=${encodeURIComponent(selectedStory.topic)}`} className="flex-1">
                        <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                          <Search className="w-4 h-4 ml-2" />
                          تحليل مفصل
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Country Comparison */}
                {countryComparison[selectedStory.topic as keyof typeof countryComparison] && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-base flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        مقارنة ردود الفعل بين الدول
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {countryComparison[selectedStory.topic as keyof typeof countryComparison].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-20 text-sm text-muted-foreground">{item.country}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                              />
                            </div>
                            <span className="w-24 text-sm text-foreground">{item.emotion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-bold text-foreground mb-2">اختر قصة</h3>
                  <p className="text-muted-foreground">
                    اضغط على أي قصة من القائمة لعرض التفاصيل والتحليل المفصل
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Emotion Legend */}
        <div className="mt-8 p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-foreground mb-3 text-center">دليل الألوان</h4>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E63946' }} />
              <span className="text-sm text-muted-foreground">غضب</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F4A261' }} />
              <span className="text-sm text-muted-foreground">خوف</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2A9D8F' }} />
              <span className="text-sm text-muted-foreground">أمل/فرح</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8D5CF6' }} />
              <span className="text-sm text-muted-foreground">حزن</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6C757D' }} />
              <span className="text-sm text-muted-foreground">حياد</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
