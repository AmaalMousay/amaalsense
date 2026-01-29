import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft,
  ArrowRight,
  Database,
  Brain,
  BarChart3,
  Globe,
  Zap,
  Layers,
  Target,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Database className="w-8 h-8" />,
    title: "Data Collection",
    titleAr: "جمع البيانات",
    description: "We gather text data from multiple sources: news agencies (Reuters, BBC, Al Jazeera), social media (Reddit, Mastodon, Bluesky), and public forums.",
    descriptionAr: "نجمع البيانات النصية من مصادر متعددة: وكالات الأنباء (رويترز، BBC، الجزيرة)، وسائل التواصل (Reddit، Mastodon، Bluesky)، والمنتديات العامة.",
    color: "from-blue-500 to-cyan-500",
    sources: ["News APIs", "Social Media", "Public Forums", "RSS Feeds"],
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Analysis",
    titleAr: "التحليل بالذكاء الاصطناعي",
    description: "Our AI engine uses advanced Transformer models and VADER sentiment analysis to extract 6 emotional vectors from each text.",
    descriptionAr: "يستخدم محركنا نماذج Transformer المتقدمة وتحليل VADER لاستخراج 6 متجهات عاطفية من كل نص.",
    color: "from-purple-500 to-pink-500",
    sources: ["Transformer Models", "VADER", "LLM Integration", "AraBERT"],
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
    description: "Emotional vectors are aggregated using our DCFT formulas to calculate three core indices: GMI, CFI, and HRI.",
    descriptionAr: "يتم تجميع المتجهات العاطفية باستخدام معادلات DCFT لحساب ثلاثة مؤشرات أساسية: GMI، CFI، HRI.",
    color: "from-yellow-500 to-orange-500",
    sources: ["GMI (Mood)", "CFI (Fear)", "HRI (Hope)", "D(t) Formula"],
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Geographic Mapping",
    titleAr: "التوزيع الجغرافي",
    description: "Data is organized by country and region, creating a real-time emotional map of the world with color-coded indicators.",
    descriptionAr: "يتم تنظيم البيانات حسب الدولة والمنطقة، لإنشاء خريطة عاطفية للعالم في الوقت الحقيقي مع مؤشرات ملونة.",
    color: "from-cyan-500 to-blue-500",
    sources: ["25+ Countries", "Real-time Updates", "Color Coding", "Regional Analysis"],
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Early Warning",
    titleAr: "الإنذار المبكر",
    description: "Our system monitors for sudden changes in emotional indices, triggering alerts when thresholds are exceeded.",
    descriptionAr: "يراقب نظامنا التغيرات المفاجئة في المؤشرات العاطفية، ويطلق تنبيهات عند تجاوز العتبات.",
    color: "from-red-500 to-pink-500",
    sources: ["CFI > 70 Alert", "HRI < 30 Alert", "Rapid Change Detection", "Owner Notifications"],
  },
];

const formulas = [
  {
    name: "Digital Consciousness Field",
    formula: "D(t) = Σ [Eᵢ × Wᵢ × ΔTᵢ]",
    description: "Measures the instantaneous consciousness amplitude of the digital collective",
    variables: [
      { symbol: "Eᵢ", meaning: "Emotional intensity of each event" },
      { symbol: "Wᵢ", meaning: "Weighting based on influence/reach" },
      { symbol: "ΔTᵢ", meaning: "Temporal persistence of emotion" },
    ],
  },
  {
    name: "Resonance Index",
    formula: "RI(e,t) = Σ (AVᵢ × Wᵢ × e^(-λΔt))",
    description: "Detects emotional waves and synchronization patterns",
    variables: [
      { symbol: "AVᵢ", meaning: "Affective value of emotion" },
      { symbol: "λ", meaning: "Decay constant (emotion fading)" },
      { symbol: "Δt", meaning: "Time since event" },
    ],
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
            The Technology Behind AmaálSense
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            How AmaálSense Works
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From raw text to emotional insights - discover the journey of data through our AI-powered emotion analysis pipeline.
          </p>
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

        {/* Mathematical Formulas */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            The Mathematics Behind DCFT
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {formulas.map((formula, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full bg-black/40 border-purple-500/30 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-400">{formula.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-black/50 border border-purple-500/20 mb-4 text-center">
                      <code className="text-xl text-cyan-400 font-mono">{formula.formula}</code>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{formula.description}</p>
                    <div className="space-y-2">
                      {formula.variables.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <code className="text-purple-400 font-mono w-8">{v.symbol}</code>
                          <span className="text-slate-500">=</span>
                          <span className="text-slate-300">{v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                Start analyzing the emotional pulse of humanity with AmaálSense Engine.
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
