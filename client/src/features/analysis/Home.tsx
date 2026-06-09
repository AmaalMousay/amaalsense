import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { 
  Brain, 
  Globe, 
  BarChart3, 
  Users, 
  Rocket,
  ArrowRight,
  Play
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';

export default function Home() {
  const [, navigate] = useLocation();
  const [analysisTopic, setAnalysisTopic] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!analysisTopic.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate(`/chat?topic=${encodeURIComponent(analysisTopic)}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-semibold text-lg">AmalSense</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-white transition-colors">About</Link>
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-white transition-colors">Analysis</Link>
            <Link href="/emotional-weather" className="text-sm text-muted-foreground hover:text-white transition-colors">Emotional Weather</Link>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/chat')}>
            Try Free
          </Button>
        </div>
      </nav>

    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <LogoIcon className="w-20 h-20" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            AmalSense
          </h1>
          
          <p className="text-2xl text-white mb-4">
            Cognitive Intelligence for Global Emotional Understanding
          </p>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Real-time analysis of how the world feels about any topic — 
            powered by a 24-layer cognitive architecture and multi-agent AI system.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14"
              onClick={() => navigate('/chat')}
            >
              Try AmalSense Now <Play className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 h-14"
              onClick={() => navigate('/about')}
            >
              Learn More <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Global Coverage
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" /> 24 Cognitive Layers
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Real-time Indices
            </div>
          </div>
        </div>
      </section>

      {/* What is AmalSense */}
      <section className="py-16 border-t border-white/10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">What is AmalSense?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-slate-900/50 border-purple-500/20">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cognitive AI Engine</h3>
              <p className="text-muted-foreground">
                A proprietary 24-layer cognitive architecture that processes information the way humans do — 
                through perception, reasoning, emotion, and metacognition.
              </p>
            </Card>

            <Card className="p-8 bg-slate-900/50 border-purple-500/20">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emotional Intelligence</h3>
              <p className="text-muted-foreground">
                Transforms raw news and social media into three proprietary indices: 
                Global Mood Index (GMI), Cognitive Fear Index (CFI), and Hope Resonance Index (HRI).
              </p>
            </Card>

            <Card className="p-8 bg-slate-900/50 border-purple-500/20">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Global Insights</h3>
              <p className="text-muted-foreground">
                Monitors emotions across countries and regions in real time, 
                helping organizations understand narrative dynamics and public sentiment at scale.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Try the Analyzer */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-4">Analyze Any Topic</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Enter any topic and discover how the world feels about it right now.
          </p>

          <Card className="p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                value={analysisTopic}
                onChange={(e) => setAnalysisTopic(e.target.value)}
                placeholder="e.g., Climate Change, AI Regulation, Middle East..."
                className="h-14 text-lg flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={!analysisTopic.trim() || isAnalyzing}
                className="h-14 px-8 text-lg"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Founder & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Founded by Amaal Rodwan Bashir</h2>
          <p className="text-lg text-muted-foreground mb-8">
            A multidisciplinary researcher from Sebha, Libya, combining expertise in microbiology 
            with a passion for artificial intelligence and cognitive systems. 
            AmalSense is the foundation of a future technology startup focused on emotional intelligence at scale.
          </p>
          <Button variant="outline" size="lg" onClick={() => navigate('/about')}>
            Read Full Story <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-white/10 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to understand global emotions?</h2>
          <Button size="lg" className="text-lg px-10 h-14" onClick={() => navigate('/chat')}>
            Start Free Analysis
          </Button>
        </div>
      </section>
    </div>
  );
}
