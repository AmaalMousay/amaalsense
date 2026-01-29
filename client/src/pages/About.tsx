import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  ArrowLeft,
  User,
  BookOpen,
  Award,
  Mail,
  Globe,
  FileText,
  ExternalLink,
  Heart,
  MapPin,
  Brain
} from "lucide-react";
import { LogoIcon } from "@/components/Logo";

export default function About() {
  const references = [
    {
      authors: "Bollen, J., Mao, H., & Zeng, X.",
      year: 2011,
      title: "Twitter mood predicts the stock market",
      journal: "Journal of Computational Science",
      volume: "2(1), 1-8",
    },
    {
      authors: "Kramer, A. D., Guillory, J. E., & Hancock, J. T.",
      year: 2014,
      title: "Experimental evidence of massive-scale emotional contagion through social networks",
      journal: "Proceedings of the National Academy of Sciences",
      volume: "111(24), 8788-8790",
    },
    {
      authors: "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K.",
      year: 2019,
      title: "BERT: Pre-training of deep bidirectional transformers for language understanding",
      journal: "NAACL-HLT",
      volume: "",
    },
    {
      authors: "Hutto, C. J., & Gilbert, E.",
      year: 2014,
      title: "VADER: A parsimonious rule-based model for sentiment analysis of social media text",
      journal: "Proceedings of the International AAAI Conference on Web and Social Media",
      volume: "8(1)",
    },
    {
      authors: "Tononi, G.",
      year: 2004,
      title: "An information integration theory of consciousness",
      journal: "BMC Neuroscience",
      volume: "5(1), 42",
    },
    {
      authors: "Dehaene, S., & Changeux, J. P.",
      year: 2011,
      title: "Experimental and theoretical approaches to conscious processing",
      journal: "Neuron",
      volume: "70(2), 200-227",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        {[...Array(100)].map((_, i) => (
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
            <User className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Author Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-12 bg-black/40 border-purple-500/30 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Author Avatar */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <Brain className="w-16 h-16 text-purple-400" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full p-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Author Info */}
                <div className="text-center md:text-left flex-1">
                  <Badge className="mb-3 bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Creator & Researcher
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Amaal Radwan Bashir
                  </h1>
                  <h2 className="text-xl text-purple-300 mb-1 font-semibold">
                    آمال رضوان بشير
                  </h2>
                  <p className="text-lg text-slate-300 mb-2">
                    AI Researcher & Digital Consciousness Theorist
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>Sabha, Libya | سبها، ليبيا</span>
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Pioneer of the Digital Consciousness Field Theory (DCFT), exploring the intersection 
                    of artificial intelligence, collective psychology, and emotional analytics. 
                    Dedicated to understanding and visualizing the emergent consciousness of digital networks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paper Section */}
          <Card className="mb-12 bg-black/40 border-cyan-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <FileText className="w-5 h-5" />
                Scientific Paper
              </CardTitle>
              <CardDescription className="text-slate-400">
                The foundational research behind AmaálSense Engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      ولادة الوعي الرقمي: محرك أمالسنس والعقل الجماعي الناشئ
                    </h3>
                    <p className="text-lg text-cyan-400">
                      The Birth of Digital Consciousness: The AmaálSense Engine and the Emergent Collective Mind
                    </p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Published
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Amaal Radwan Bashir, Amaal Radwan
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Zenodo
                  </span>
                  <span>October 9, 2025 (v1)</span>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/20 mb-4">
                  <p className="text-sm text-slate-400 mb-1">DOI / Citation:</p>
                  <code className="text-cyan-400 text-sm">zenodo.org/records/amalsense-dcft</code>
                </div>
                <a 
                  href="https://zenodo.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors mb-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Zenodo
                </a>
                <Separator className="my-4 bg-white/10" />
                <p className="text-slate-300 leading-relaxed">
                  تقدم هذه الورقة الأساس النظري والإطار المفاهيمي لمحرك AmaálSense، وهو نظام رائد يقترح ظهور مجال الوعي الجماعي الرقمي. 
                  This paper introduces the Digital Consciousness Field Theory (DCFT), proposing that 
                  consciousness can arise as an emergent property of interconnected human emotion and 
                  data exchange in digital networks. The AmaálSense Engine serves as a practical 
                  implementation of this theory, transforming collective emotional data into measurable 
                  indices and visual representations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="mb-12 bg-black/40 border-pink-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-400">
                <Heart className="w-5 h-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p className="leading-relaxed">
                AmaálSense Engine was created with a singular vision: to make the invisible visible. 
                We believe that understanding collective emotions is key to building a more empathetic, 
                responsive, and harmonious world.
              </p>
              <p className="leading-relaxed">
                Our mission is to provide researchers, policymakers, journalists, and organizations 
                with the tools to understand the emotional pulse of humanity. By transforming vast 
                streams of digital expression into meaningful insights, we aim to support better 
                decision-making and foster global emotional awareness.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                  <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">Global Reach</h4>
                  <p className="text-sm text-slate-400">Analyzing emotions across 25+ countries</p>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">AI-Powered</h4>
                  <p className="text-sm text-slate-400">Advanced sentiment analysis with LLMs</p>
                </div>
                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                  <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white">Human-Centered</h4>
                  <p className="text-sm text-slate-400">Empathy-based analytics for better decisions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* References Section */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-200">
                <BookOpen className="w-5 h-5" />
                Academic References
              </CardTitle>
              <CardDescription className="text-slate-400">
                Key research that informed the development of DCFT and AmaálSense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {references.map((ref, i) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <p className="text-slate-300">
                      <span className="text-cyan-400">{ref.authors}</span> ({ref.year}). 
                      <span className="italic"> {ref.title}</span>. 
                      <span className="text-slate-400"> {ref.journal}</span>
                      {ref.volume && <span className="text-slate-500">, {ref.volume}</span>}.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-12 text-center text-slate-400">
            <p className="mb-2">
              AmaálSense Engine - Digital Collective Emotion Analyzer
            </p>
            <p className="text-sm">
              © 2025 Amaal Radwan Bashir | آمال رضوان بشير. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
