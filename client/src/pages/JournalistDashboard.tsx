import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Newspaper, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Search,
  Download,
  Bell,
  BarChart3,
  Globe,
  Users,
  ArrowRight,
  Zap,
  FileText
} from 'lucide-react';

export default function JournalistDashboard() {
  const [searchTopic, setSearchTopic] = useState('');

  // Trending stories data (simulated)
  const trendingStories = [
    {
      topic: 'الانتخابات الأمريكية 2024',
      emotion: 'قلق',
      change: '+23%',
      urgency: 'high',
      sources: 1250
    },
    {
      topic: 'أسعار النفط العالمية',
      emotion: 'خوف',
      change: '+18%',
      urgency: 'medium',
      sources: 890
    },
    {
      topic: 'كأس العالم 2026',
      emotion: 'حماس',
      change: '+45%',
      urgency: 'low',
      sources: 2100
    },
    {
      topic: 'التغير المناخي',
      emotion: 'قلق',
      change: '+12%',
      urgency: 'medium',
      sources: 650
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'عاجل';
      case 'medium': return 'مهم';
      case 'low': return 'عادي';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer">
                  AmalSense
                </span>
              </Link>
              <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Newspaper className="w-3 h-3 mr-1" />
                Journalist Pro
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Link href="/analyzer">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  تحليل موضوع جديد
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            لوحة تحكم <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">الصحفي</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            اكتشف القصص التي تهم الناس الآن. افهم المشاعر الجماعية قبل أن تصبح أخباراً.
          </p>
        </div>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث عن موضوع أو قضية..."
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="pr-12 py-6 text-lg bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Link href={searchTopic ? `/analyzer?topic=${encodeURIComponent(searchTopic)}` : '/analyzer'}>
              <Button className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
                تحليل
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Question */}
        <Card className="cosmic-card mb-12 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              السؤال الذي يجيب عليه AmalSense
            </h2>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              "ما هي القصة التي يتفاعل معها الناس الآن؟ ولماذا؟"
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">15+</div>
              <div className="text-slate-400">مصدر بيانات</div>
            </CardContent>
          </Card>
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-slate-400">منشور يومياً</div>
            </CardContent>
          </Card>
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">دقائق</div>
              <div className="text-slate-400">وقت التحليل</div>
            </CardContent>
          </Card>
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">6</div>
              <div className="text-slate-400">مشاعر أساسية</div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Stories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              القصص الأكثر تفاعلاً الآن
            </h2>
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
              عرض الكل <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingStories.map((story, index) => (
              <Card key={index} className="cosmic-card hover:border-purple-500/50 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{story.topic}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(story.urgency)}>
                          {getUrgencyLabel(story.urgency)}
                        </Badge>
                        <span className="text-sm text-slate-400">{story.sources} مصدر</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-green-400">{story.change}</div>
                      <div className="text-sm text-slate-400">تغير المشاعر</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">الشعور السائد:</span>
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {story.emotion}
                      </Badge>
                    </div>
                    <Link href={`/analyzer?topic=${encodeURIComponent(story.topic)}`}>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        تحليل مفصل <ArrowRight className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pro Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            مميزات <span className="text-purple-400">Journalist Pro</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cosmic-card">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">تنبيهات فورية</h3>
                <p className="text-slate-400">
                  احصل على إشعارات عند تصاعد المشاعر حول موضوع معين
                </p>
              </CardContent>
            </Card>
            <Card className="cosmic-card">
              <CardContent className="p-6 text-center">
                <FileText className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">تقارير PDF</h3>
                <p className="text-slate-400">
                  صدّر تحليلاتك كتقارير احترافية جاهزة للنشر
                </p>
              </CardContent>
            </Card>
            <Card className="cosmic-card">
              <CardContent className="p-6 text-center">
                <Download className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">تحميل البيانات</h3>
                <p className="text-slate-400">
                  حمّل البيانات الخام لتحليلك الخاص
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="cosmic-card max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              ابدأ تحليلك الأول الآن
            </h2>
            <p className="text-slate-400 mb-6">
              اكتشف ما يشعر به الناس تجاه أي قضية خلال دقائق
            </p>
            <Link href="/analyzer">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Search className="w-5 h-5 ml-2" />
                تحليل موضوع جديد
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
