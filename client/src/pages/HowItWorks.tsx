import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft,
  Database,
  Brain,
  BarChart3,
  Globe,
  Zap,
  Layers,
  AlertTriangle,
  Cpu,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Database className="w-8 h-8" />,
    title: "Data Collection",
    titleAr: "جمع البيانات",
    description: "We gather text data from 8 diverse sources: news agencies, social media platforms, video platforms, and messaging channels - in both Arabic and English.",
    descriptionAr: "نجمع البيانات النصية من 8 مصادر متنوعة: وكالات الأنباء، منصات التواصل الاجتماعي، منصات الفيديو، وقنوات الرسائل - بالعربية والإنجليزية.",
    color: "from-blue-500 to-cyan-500",
    sources: ["News APIs", "Google RSS", "GNews", "Reddit", "Mastodon", "Bluesky", "YouTube", "Telegram"],
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Hybrid Engine Processing",
    titleAr: "معالجة المحرك الهجين",
    description: "Our unique Hybrid Engine combines proprietary mathematical formulas (70%) with advanced AI analysis (30%) for unprecedented accuracy in emotion detection.",
    descriptionAr: "يجمع محركنا الهجين الفريد بين معادلات رياضية خاصة (70%) وتحليل الذكاء الاصطناعي المتقدم (30%) لدقة غير مسبوقة في اكتشاف المشاعر.",
    color: "from-purple-500 to-pink-500",
    sources: ["70% Proprietary Formula", "30% AI Analysis", "Hybrid Fusion", "Real-time Processing"],
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Vector Extraction",
    titleAr: "استخراج المتجهات",
    description: "Each text is converted into 6 emotional dimensions: Joy, Fear, Anger, Sadness, Hope, and Curiosity - creating a complete emotional fingerprint.",
    descriptionAr: "يتم تحويل كل نص إلى 6 أبعاد عاطفية: الفرح، الخوف، الغضب، الحزن، الأمل، والفضول - لإنشاء بصمة عاطفية كاملة.",
    color: "from-green-500 to-emerald-500",
    sources: ["Joy 😊", "Fear 😨", "Anger 😠", "Sadness 😢", "Hope 🌟", "Curiosity 🔍"],
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Index Calculation",
    titleAr: "حساب المؤشرات",
    description: "Emotional vectors are aggregated using our proprietary DCFT methodology to calculate three core indices: GMI (Global Mood), CFI (Fear), and HRI (Hope).",
    descriptionAr: "يتم تجميع المتجهات العاطفية باستخدام منهجية DCFT الخاصة بنا لحساب ثلاثة مؤشرات أساسية: GMI (المزاج العام)، CFI (الخوف)، HRI (الأمل).",
    color: "from-yellow-500 to-orange-500",
    sources: ["GMI (Mood Index)", "CFI (Fear Index)", "HRI (Hope Index)", "Confidence Score"],
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Geographic Mapping",
    titleAr: "التوزيع الجغرافي",
    description: "Data is organized by country and region, creating a real-time emotional map of the world with color-coded indicators and city-level analysis.",
    descriptionAr: "يتم تنظيم البيانات حسب الدولة والمنطقة، لإنشاء خريطة عاطفية للعالم في الوقت الحقيقي مع مؤشرات ملونة وتحليل على مستوى المدن.",
    color: "from-cyan-500 to-blue-500",
    sources: ["25+ Countries", "City-level Analysis", "Heat Maps", "Regional Trends"],
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Early Warning System",
    titleAr: "نظام الإنذار المبكر",
    description: "Our system monitors for sudden changes in emotional indices, triggering Telegram alerts when significant shifts are detected.",
    descriptionAr: "يراقب نظامنا التغيرات المفاجئة في المؤشرات العاطفية، ويرسل تنبيهات عبر Telegram عند اكتشاف تحولات كبيرة.",
    color: "from-red-500 to-pink-500",
    sources: ["Real-time Monitoring", "Telegram Alerts", "Threshold Detection", "Daily Reports"],
  },
];

const hybridEngineFeatures = [
  {
    percentage: "70%",
    title: "Proprietary Mathematical Formula",
    titleAr: "معادلة رياضية خاصة",
    description: "Based on DCFT (Digital Collective Field Theory) - a unique methodology developed specifically for collective emotion analysis.",
    descriptionAr: "مبنية على نظرية DCFT (نظرية الحقل الجماعي الرقمي) - منهجية فريدة طُورت خصيصاً لتحليل المشاعر الجماعية.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    percentage: "30%",
    title: "Advanced AI Analysis",
    titleAr: "تحليل الذكاء الاصطناعي المتقدم",
    description: "Leverages state-of-the-art language models for nuanced sentiment understanding across Arabic and English content.",
    descriptionAr: "يستخدم أحدث نماذج اللغة لفهم المشاعر الدقيقة عبر المحتوى العربي والإنجليزي.",
    icon: <Brain className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            The Technology Behind Amaalsense
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            How Amaalsense Works
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From raw text to emotional insights - discover our revolutionary Hybrid Engine that combines proprietary formulas with AI.
          </p>
        </motion.div>

        {/* Hybrid Engine Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 via-black/40 to-cyan-500/10 border-purple-500/30 backdrop-blur-xl overflow-hidden">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Cpu className="w-8 h-8 text-purple-400" />
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  The Hybrid Engine
                </CardTitle>
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-slate-400">
                Our unique approach combines the best of both worlds
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {hybridEngineFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative"
                  >
                    <div className={`absolute -top-3 -left-3 w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {feature.percentage}
                    </div>
                    <Card className="bg-black/30 border-white/10 pt-8 h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                            {feature.icon}
                          </div>
                          <h3 className="font-bold text-white">{feature.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Fusion Indicator */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white">Hybrid Fusion = Maximum Accuracy</span>
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center text-white mb-12">
            The 6-Step Process
          </h2>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500 hidden md:block" />
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Step Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${step.color} text-white`}>
                          {step.icon}
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1 text-xs">
                            Step {index + 1}
                          </Badge>
                          <CardTitle className="text-lg text-white">{step.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-3">{step.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {step.sources.map((source, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-white/5">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-purple-500 items-center justify-center text-white font-bold">
                  {index + 1}
                </div>

                {/* Spacer */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emotional Vectors Visualization */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            The 6 Emotional Vectors
          </h2>
          
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "Joy", emoji: "😊", color: "from-yellow-400 to-orange-400", desc: "Happiness, excitement, pleasure" },
                  { name: "Fear", emoji: "😨", color: "from-purple-400 to-indigo-400", desc: "Anxiety, worry, concern" },
                  { name: "Anger", emoji: "😠", color: "from-red-400 to-pink-400", desc: "Frustration, outrage, irritation" },
                  { name: "Sadness", emoji: "😢", color: "from-blue-400 to-cyan-400", desc: "Grief, disappointment, sorrow" },
                  { name: "Hope", emoji: "🌟", color: "from-green-400 to-emerald-400", desc: "Optimism, anticipation, faith" },
                  { name: "Curiosity", emoji: "🔍", color: "from-cyan-400 to-blue-400", desc: "Interest, wonder, inquiry" },
                ].map((emotion, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="text-4xl mb-2">{emotion.emoji}</div>
                    <h3 className={`font-bold bg-gradient-to-r ${emotion.color} bg-clip-text text-transparent`}>
                      {emotion.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{emotion.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            8 Real-Time Data Sources
          </h2>
          
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "News API", icon: "📰", type: "News" },
                  { name: "Google RSS", icon: "🌐", type: "News" },
                  { name: "GNews", icon: "📱", type: "News" },
                  { name: "Reddit", icon: "🔴", type: "Social" },
                  { name: "Mastodon", icon: "🐘", type: "Social" },
                  { name: "Bluesky", icon: "🦋", type: "Social" },
                  { name: "YouTube", icon: "▶️", type: "Video" },
                  { name: "Telegram", icon: "✈️", type: "Messaging" },
                ].map((source, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="text-center p-4 rounded-lg bg-black/30 border border-white/5 hover:border-purple-500/30 transition-all"
                  >
                    <div className="text-3xl mb-2">{source.icon}</div>
                    <h3 className="font-bold text-white text-sm">{source.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{source.type}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Explore?</h3>
              <p className="text-slate-300 mb-6">
                Start analyzing the emotional pulse of humanity with Amaalsense Engine.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/analyzer">
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    <Zap className="w-4 h-4 mr-2" />
                    Try Analyzer
                  </Button>
                </Link>
                <Link href="/theory">
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                    <Brain className="w-4 h-4 mr-2" />
                    Learn DCFT Theory
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
