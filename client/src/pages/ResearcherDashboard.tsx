import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Database, 
  Code, 
  FileJson,
  Search,
  Download,
  BarChart3,
  Globe,
  Clock,
  ArrowRight,
  BookOpen,
  Microscope,
  LineChart,
  Table
} from 'lucide-react';

export default function ResearcherDashboard() {
  const [searchTopic, setSearchTopic] = useState('');

  // Research datasets (simulated)
  const datasets = [
    {
      name: 'Global Mood Index 2024',
      records: '2.5M',
      format: 'JSON/CSV',
      updated: '2024-01-15'
    },
    {
      name: 'Arabic Social Sentiment',
      records: '850K',
      format: 'JSON/CSV',
      updated: '2024-01-14'
    },
    {
      name: 'Crisis Events Emotions',
      records: '120K',
      format: 'JSON/CSV',
      updated: '2024-01-10'
    }
  ];

  // API endpoints
  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/analyze',
      description: 'تحليل موضوع محدد'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/trends',
      description: 'المواضيع الرائجة'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/historical',
      description: 'البيانات التاريخية'
    }
  ];

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
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <GraduationCap className="w-3 h-3 mr-1" />
                Research API
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/analyzer">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
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
            لوحة تحكم <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">الباحث</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            بيانات المشاعر الجماعية جاهزة للتحليل. API قوي للباحثين والأكاديميين.
          </p>
        </div>

        {/* Key Value Proposition */}
        <Card className="cosmic-card mb-12 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <Microscope className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              ما يقدمه AmalSense للباحثين
            </h2>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              "بيانات مشاعر حقيقية من ملايين المصادر، جاهزة للتحليل الأكاديمي"
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">5M+</div>
              <div className="text-slate-400">سجل بيانات</div>
            </CardContent>
          </Card>
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-slate-400">دولة مغطاة</div>
            </CardContent>
          </Card>
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">3 سنوات</div>
              <div className="text-slate-400">بيانات تاريخية</div>
            </CardContent>
          </Card>
          <Card className="cosmic-card">
            <CardContent className="p-6 text-center">
              <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">REST</div>
              <div className="text-slate-400">API متاح</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Datasets */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Table className="w-6 h-6 text-blue-400" />
              مجموعات البيانات المتاحة
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {datasets.map((dataset, index) => (
              <Card key={index} className="cosmic-card hover:border-blue-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileJson className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{dataset.name}</h3>
                      <span className="text-sm text-slate-400">آخر تحديث: {dataset.updated}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-slate-400">السجلات:</span>
                      <span className="text-white font-bold mr-2">{dataset.records}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {dataset.format}
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    <Download className="w-4 h-4 ml-2" />
                    تحميل البيانات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-green-400" />
              API Endpoints
            </h2>
          </div>
          
          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                {apiEndpoints.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className={api.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                        {api.method}
                      </Badge>
                      <code className="text-purple-400 font-mono">{api.endpoint}</code>
                    </div>
                    <span className="text-slate-400">{api.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-bold mb-2">مثال على الاستخدام:</h4>
                <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`curl -X GET "https://api.amalsense.com/v1/analyze?topic=climate+change" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Research Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            مميزات <span className="text-blue-400">Research API</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cosmic-card">
              <CardContent className="p-6 text-center">
                <LineChart className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">تحليل زمني</h3>
                <p className="text-slate-400">
                  تتبع تطور المشاعر عبر الزمن لأي موضوع
                </p>
              </CardContent>
            </Card>
            <Card className="cosmic-card">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">توثيق كامل</h3>
                <p className="text-slate-400">
                  وثائق API شاملة مع أمثلة بلغات متعددة
                </p>
              </CardContent>
            </Card>
            <Card className="cosmic-card">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">بيانات خام</h3>
                <p className="text-slate-400">
                  تصدير البيانات بصيغ JSON/CSV للتحليل
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="cosmic-card max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              ابدأ بحثك الآن
            </h2>
            <p className="text-slate-400 mb-6">
              احصل على مفتاح API واستكشف بيانات المشاعر الجماعية
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/analyzer">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Search className="w-5 h-5 ml-2" />
                  تجربة التحليل
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                <Code className="w-5 h-5 ml-2" />
                طلب API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
