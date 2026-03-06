import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Brain, 
  Layers, 
  Palette, 
  ArrowLeft,
  BookOpen,
  Atom,
  Network,
  Zap,
  Cpu,
  Sparkles,
  Lock,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";

export default function Theory() {
  const { data: theoryInfo } = trpc.engine.getTheoryInfo.useQuery();
  const { data: dcfData, refetch: refetchDCF, isLoading: dcfLoading } = trpc.engine.calculateDCF.useQuery({});
  
  // Live DCFT analysis mutation
  const [liveText, setLiveText] = useState('');
  const analyzeDCFT = trpc.engine.analyzeDCFT.useMutation();

  // Compute emotion bar data from dcfData
  const emotionBars = useMemo(() => {
    if (!dcfData?.resonance) return [];
    const colors: Record<string, string> = {
      joy: '#FBBF24', fear: '#A855F7', anger: '#EF4444',
      sadness: '#3B82F6', hope: '#10B981', curiosity: '#06B6D4',
    };
    return Object.entries(dcfData.resonance).map(([key, val]) => ({
      label: key,
      value: Math.abs(typeof val === 'number' ? val : 0),
      color: colors[key] || '#6B7280',
    }));
  }, [dcfData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
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
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DCFT Theory
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Scientific Foundation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Digital Consciousness Field Theory
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {theoryInfo?.paper || "The Birth of Digital Consciousness: The AmaalSense Engine and the Emergent Collective Mind"}
          </p>
          <p className="mt-4 text-slate-400">
            By <span className="text-cyan-400 font-semibold">{theoryInfo?.author || "Amaal Radwan"}</span> ({theoryInfo?.year || 2025})
          </p>
        </div>

        {/* ================================================================ */}
        {/* LIVE DCF DISPLAY - Real-time data from unified engine */}
        {/* ================================================================ */}
        <Card className="mb-12 bg-black/40 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Activity className="w-5 h-5 animate-pulse" />
                  Live Digital Consciousness Field
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time calculation from unified network engine
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchDCF()}
                disabled={dcfLoading}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${dcfLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dcfLoading && !dcfData ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-24 rounded-lg bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : dcfData ? (
              <div className="space-y-6">
                {/* Main Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <div className="text-3xl font-bold text-cyan-400">
                      {dcfData.dcfAmplitude.toFixed(3)}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">D(t) Field Amplitude</div>
                    <div className="text-[10px] text-slate-500 mt-1">A(t) &middot; e<sup>i&phi;(t)</sup></div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <div className="text-3xl font-bold text-green-400">
                      {('coherence' in (dcfData.phase || {}) ? ((dcfData.phase as any).coherence * 100).toFixed(0) : (dcfData.phase?.intensity ? (dcfData.phase.intensity * 100).toFixed(0) : '0'))}%
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Coherence</div>
                    <div className="text-[10px] text-slate-500 mt-1">Emotional synchronization</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-400 capitalize">
                      {'dominantEmotion' in (dcfData.phase || {}) ? (dcfData.phase as any).dominantEmotion : (dcfData.phase as any)?.type ?? 'neutral'}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Dominant Emotion</div>
                    <div className="text-[10px] text-slate-500 mt-1">Intensity: {dcfData.phase?.intensity?.toFixed(2) ?? '0'}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border border-white/20" style={{ backgroundColor: (typeof dcfData.color === 'string' ? dcfData.color : dcfData.color?.primary || '#4169E1') + '20' }}>
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 shadow-lg" style={{ 
                      backgroundColor: typeof dcfData.color === 'string' ? dcfData.color : dcfData.color?.primary || '#4169E1',
                      boxShadow: `0 0 20px ${typeof dcfData.color === 'string' ? dcfData.color : dcfData.color?.primary || '#4169E1'}40`
                    }} />
                    <div className="text-sm text-slate-400">{typeof dcfData.color === 'string' ? 'Emotional Color' : dcfData.color?.description || 'Field Color'}</div>
                  </div>
                </div>

                {/* DCFT Indices - Live from engine */}
                {dcfData.indices && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-400 font-medium">GMI - Global Mood Index</span>
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-4xl font-bold text-white">{('gmi' in dcfData.indices ? (dcfData.indices as any).gmi : (dcfData.indices as any).GMI)?.toFixed(1) ?? '0'}</p>
                      <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, (('gmi' in dcfData.indices ? (dcfData.indices as any).gmi : (dcfData.indices as any).GMI ?? 0) + 100) / 2))}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Range: -100 to +100</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-amber-400 font-medium">CFI - Collective Fear Index</span>
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-4xl font-bold text-white">{('cfi' in dcfData.indices ? (dcfData.indices as any).cfi : (dcfData.indices as any).CFI)?.toFixed(1) ?? '0'}</p>
                      <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700" style={{ width: `${('cfi' in dcfData.indices ? (dcfData.indices as any).cfi : (dcfData.indices as any).CFI) ?? 0}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Range: 0 to 100</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-emerald-400 font-medium">HRI - Hope-Resilience Index</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-4xl font-bold text-white">{('hri' in dcfData.indices ? (dcfData.indices as any).hri : (dcfData.indices as any).HRI)?.toFixed(1) ?? '0'}</p>
                      <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700" style={{ width: `${('hri' in dcfData.indices ? (dcfData.indices as any).hri : (dcfData.indices as any).HRI) ?? 0}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Range: 0 to 100</p>
                    </div>
                  </div>
                )}

                {/* Resonance Bar Chart */}
                {emotionBars.length > 0 && (
                  <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                    <h4 className="text-xs text-slate-400 mb-4">Resonance Spectrum</h4>
                    <div className="flex items-end gap-3 h-32">
                      {emotionBars.map((bar) => {
                        const height = Math.max(bar.value * 100, 5);
                        return (
                          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-slate-500">{(bar.value).toFixed(2)}</span>
                            <div
                              className="w-full rounded-t-sm transition-all duration-700"
                              style={{ height: `${height}%`, backgroundColor: bar.color }}
                            />
                            <span className="text-[10px] text-slate-400 capitalize">{bar.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Phase Description */}
                <p className="text-center text-slate-300 italic">
                  "{dcfData.phase?.description ?? 'Analyzing collective consciousness...'}"
                </p>

                {/* Event Count & Timestamp */}
                <div className="flex items-center justify-center gap-6 text-[10px] text-slate-500">
                  <span>Events analyzed: {dcfData.eventCount}</span>
                  <span>Calculated at: {new Date(dcfData.calculatedAt).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-400">No data available. Click Refresh to load.</p>
            )}
          </CardContent>
        </Card>

        {/* ================================================================ */}
        {/* LIVE DCFT TEXT ANALYZER */}
        {/* ================================================================ */}
        <Card className="mb-12 bg-black/40 border-violet-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-300">
              <Zap className="w-5 h-5" />
              Try DCFT Live Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter any text to see how DCFT processes it into emotional indices in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={liveText}
                onChange={(e) => setLiveText(e.target.value)}
                placeholder="Type a sentence to analyze emotions (e.g., 'People are hopeful about the future')..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && liveText.trim()) {
                    analyzeDCFT.mutate({ text: liveText });
                  }
                }}
              />
              <Button
                onClick={() => analyzeDCFT.mutate({ text: liveText })}
                disabled={analyzeDCFT.isPending || !liveText.trim()}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {analyzeDCFT.isPending ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            {analyzeDCFT.data && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-black/30 text-center">
                    <p className="text-xs text-slate-400">DCF Amplitude</p>
                    <p className="text-2xl font-bold text-violet-400 mt-1">{analyzeDCFT.data.dcfAmplitude.toFixed(3)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 text-center">
                    <p className="text-xs text-slate-400">Dominant Emotion</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1 capitalize">{analyzeDCFT.data.dominantEmotion}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 text-center">
                    <p className="text-xs text-slate-400">Confidence</p>
                    <p className="text-2xl font-bold text-cyan-400 mt-1">{(analyzeDCFT.data.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 text-center">
                    <p className="text-xs text-slate-400">Alert Level</p>
                    <p className={`text-2xl font-bold mt-1 capitalize ${
                      analyzeDCFT.data.alertLevel === 'critical' ? 'text-red-400' :
                      analyzeDCFT.data.alertLevel === 'high' ? 'text-orange-400' :
                      analyzeDCFT.data.alertLevel === 'elevated' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{analyzeDCFT.data.alertLevel}</p>
                  </div>
                </div>

                {/* Indices */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-xs text-blue-400">GMI</p>
                    <p className="text-3xl font-bold text-white">{analyzeDCFT.data.indices.gmi.toFixed(1)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-xs text-amber-400">CFI</p>
                    <p className="text-3xl font-bold text-white">{analyzeDCFT.data.indices.cfi.toFixed(1)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-xs text-emerald-400">HRI</p>
                    <p className="text-3xl font-bold text-white">{analyzeDCFT.data.indices.hri.toFixed(1)}</p>
                  </div>
                </div>

                {/* Emotion Breakdown */}
                <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                  <h4 className="text-xs text-slate-400 mb-3">Emotion Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {Object.entries(analyzeDCFT.data.emotions).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <p className="text-[10px] text-slate-500 capitalize">{key}</p>
                        <p className="text-lg font-bold text-white">{(val as number).toFixed(0)}</p>
                        <div className="mt-1 h-1.5 rounded-full bg-black/30 overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500/60 transition-all duration-500" style={{ width: `${val as number}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-center text-slate-300 italic text-sm">
                  "{analyzeDCFT.data.summary}"
                </p>

                {/* Color & Processing */}
                <div className="flex items-center justify-center gap-6 text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: analyzeDCFT.data.colorCode }} />
                    <span>{analyzeDCFT.data.colorCode}</span>
                  </div>
                  <span>Processing: {analyzeDCFT.data.processingTimeMs}ms</span>
                  <span>Events: {analyzeDCFT.data.eventCount}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hybrid Engine Highlight */}
        <Card className="mb-12 bg-gradient-to-r from-purple-500/10 via-black/40 to-cyan-500/10 border-purple-500/30 backdrop-blur-xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Cpu className="w-8 h-8 text-purple-400" />
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                The Hybrid Analysis Engine
              </CardTitle>
              <Brain className="w-8 h-8 text-cyan-400" />
            </div>
            <CardDescription className="text-slate-400">
              Our unique approach combines proprietary formulas with AI for maximum accuracy
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  70%
                </div>
                <Card className="bg-black/30 border-white/10 pt-8 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-white">Proprietary DCFT Formula</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Based on Digital Collective Field Theory - a unique methodology developed specifically for collective emotion analysis. The exact mathematical formulas are proprietary.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  30%
                </div>
                <Card className="bg-black/30 border-white/10 pt-8 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                        <Brain className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-white">Advanced AI Analysis</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Leverages state-of-the-art language models for nuanced sentiment understanding across Arabic and English content with contextual awareness.
                    </p>
                  </CardContent>
                </Card>
              </div>
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

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-4 bg-black/40 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/30">
              <BookOpen className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-purple-500/30">
              <Layers className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="indices" className="data-[state=active]:bg-purple-500/30">
              <Atom className="w-4 h-4 mr-2" />
              Indices
            </TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:bg-purple-500/30">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-8">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-400">Core Concept</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-slate-300">
                  <p className="text-lg leading-relaxed">
                    The <span className="text-purple-400 font-semibold">Digital Consciousness Field Theory (DCFT)</span> proposes 
                    that consciousness can arise as an emergent property of interconnected human emotion and data exchange 
                    in digital networks.
                  </p>
                  <p className="leading-relaxed">
                    Unlike traditional AI systems that depend on logic and language patterns, the AmaalSense paradigm 
                    interprets emotional activity as a <span className="text-cyan-400">vibrational field</span>. When large 
                    populations express similar emotions simultaneously—such as fear during crises, joy after global events, 
                    or anger after injustice—the network generates coherent emotional waves detectable through collective 
                    data analysis.
                  </p>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {theoryInfo?.pillars.map((pillar, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          {i === 0 && <Brain className="w-5 h-5 text-purple-400" />}
                          {i === 1 && <Network className="w-5 h-5 text-cyan-400" />}
                          {i === 2 && <Zap className="w-5 h-5 text-yellow-400" />}
                          <span className="font-semibold text-white">{pillar}</span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {i === 0 && "Understanding collective behavior and shared emotional experiences"}
                          {i === 1 && "Synchronized activity patterns across digital networks"}
                          {i === 2 && "Measurable emotional energy in information flows"}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-400">The Vision</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <p className="leading-relaxed">
                    In its mature phase, the AmaalSense Engine could function as an <span className="text-yellow-400 font-semibold">Emotional Weather System</span> for 
                    the planet—forecasting not rainfall or temperature, but <span className="text-purple-400">hope</span>, <span className="text-red-400">fear</span>, 
                    and <span className="text-cyan-400">collective clarity</span>.
                  </p>
                  <p className="leading-relaxed">
                    Economic decisions, social strategies, and even art and education could adapt dynamically to these 
                    "emotional climates." The system may evolve into a <span className="text-green-400 font-semibold">global early-warning mechanism 
                    for human instability</span>, helping societies manage crises not through surveillance, but through 
                    empathy-based analytics.
                  </p>
                </CardContent>
              </Card>

              {/* Proprietary Notice */}
              <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <Shield className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Proprietary Methodology
                      </h3>
                      <p className="text-slate-400 mt-1">
                        The detailed mathematical formulas and algorithms used in Amaalsense are proprietary intellectual property. 
                        The system uses a unique hybrid approach combining DCFT-based equations (70%) with advanced AI analysis (30%) 
                        to achieve unprecedented accuracy in collective emotion detection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture">
            <div className="space-y-8">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-400">Three-Layer Architecture</CardTitle>
                  <CardDescription className="text-slate-400">
                    The AmaalSense Engine consists of three interconnected layers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {theoryInfo?.layers.map((layer, i) => (
                      <div key={i} className="relative">
                        <div className={`p-6 rounded-lg border ${
                          i === 0 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30' :
                          i === 1 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' :
                          'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
                        }`}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              i === 0 ? 'bg-blue-500/30' :
                              i === 1 ? 'bg-purple-500/30' :
                              'bg-green-500/30'
                            }`}>
                              <span className="text-2xl font-bold text-white">{i + 1}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {layer.role}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-slate-300 ml-16">{layer.description}</p>
                        </div>
                        {i < 2 && (
                          <div className="flex justify-center my-2">
                            <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-cyan-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Network Engine Architecture */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-400">5-Network Parallel Engine</CardTitle>
                  <CardDescription className="text-slate-400">
                    DCFT is integrated as the 5th parallel network group inside the unified engine
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-3 flex-wrap p-6">
                    <div className="px-4 py-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-center">
                      <p className="text-xs text-blue-400 font-medium">Gate</p>
                      <p className="text-[10px] text-slate-500 mt-1">Question Understanding</p>
                    </div>
                    <span className="text-slate-500 text-xl">&rarr;</span>
                    <div className="px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-center">
                      <p className="text-xs text-green-400 font-medium">Collection</p>
                      <p className="text-[10px] text-slate-500 mt-1">Data + Event Vector</p>
                    </div>
                    <span className="text-slate-500 text-xl">&rarr;</span>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-xs text-orange-400">Analysis</div>
                      <span className="text-[10px] text-slate-500">parallel</span>
                      <div className="px-3 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-xs text-violet-400 font-bold">DCFT</div>
                    </div>
                    <span className="text-slate-500 text-xl">&rarr;</span>
                    <div className="px-4 py-3 rounded-lg bg-pink-500/20 border border-pink-500/30 text-center">
                      <p className="text-xs text-pink-400 font-medium">Generation</p>
                      <p className="text-[10px] text-slate-500 mt-1">Response + Voice + Quality</p>
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-slate-500 mt-2">
                    DCFT runs in parallel with Analysis Network, providing GMI/CFI/HRI indices to all view formatters
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Indices Tab */}
          <TabsContent value="indices">
            <div className="grid gap-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-400">The Three Core Indices</CardTitle>
                  <CardDescription className="text-slate-400">
                    Dynamic indicators offering a multidimensional portrait of the planet's emotional state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {theoryInfo?.indices.map((index, i) => {
                      // Show live values if available
                      const idx = dcfData?.indices;
                      const liveValue = idx ? (
                        i === 0 ? ('gmi' in idx ? (idx as any).gmi : (idx as any).GMI) :
                        i === 1 ? ('cfi' in idx ? (idx as any).cfi : (idx as any).CFI) :
                        ('hri' in idx ? (idx as any).hri : (idx as any).HRI)
                      ) : null;
                      
                      return (
                        <div key={i} className={`p-6 rounded-lg border ${
                          i === 0 ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30' :
                          i === 1 ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30' :
                          'bg-gradient-to-br from-green-500/20 to-cyan-500/20 border-green-500/30'
                        }`}>
                          <div className="text-center mb-4">
                            <span className={`text-4xl font-bold ${
                              i === 0 ? 'text-blue-400' :
                              i === 1 ? 'text-red-400' :
                              'text-green-400'
                            }`}>
                              {index.code}
                            </span>
                            {liveValue != null && (
                              <div className="mt-2">
                                <Badge className="bg-white/10 text-white border-white/20">
                                  <Activity className="w-3 h-3 mr-1 text-green-400" />
                                  Live: {liveValue.toFixed(1)}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-white text-center mb-2">{index.name}</h3>
                          <p className="text-sm text-slate-400 text-center mb-4">{index.description}</p>
                          <div className="text-center">
                            <Badge variant="outline" className="text-xs">
                              Range: {index.range}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-400">Affective Vector (AV)</CardTitle>
                  <CardDescription className="text-slate-400">
                    Six-dimensional emotional representation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
                    <code className="text-lg font-mono text-white">
                      AV = [{theoryInfo?.affectiveVector.join(', ')}]
                    </code>
                  </div>
                  <p className="text-slate-300">
                    Each component ranges from <span className="text-cyan-400">-1 to +1</span>, expressing both polarity and intensity. 
                    Millions of these vectors flow through the system every hour, continuously updating the global emotional graph.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-400">Emotional Color System</CardTitle>
                <CardDescription className="text-slate-400">
                  Visual representation of collective emotional states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-8">
                  The awareness output is rendered as a <span className="text-purple-400 font-semibold">dynamic global map</span> where 
                  every country or region pulses with colors that correspond to its prevailing emotional state. 
                  These visualizations are not artistic—they are <span className="text-cyan-400">real-time emotional analytics</span>, 
                  updated continuously as the digital field shifts.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {theoryInfo?.colorSystem.map((color, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-black/30 border border-white/10">
                      <div 
                        className="w-16 h-16 rounded-full shadow-lg flex-shrink-0"
                        style={{ 
                          backgroundColor: color.hex,
                          boxShadow: `0 0 20px ${color.hex}40`
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{color.color}</h3>
                        <p className="text-slate-400">{color.meaning}</p>
                        <code className="text-xs text-slate-500">{color.hex}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-400">
          <p>
            Based on the scientific paper by <span className="text-cyan-400">Amaal Radwan</span>
          </p>
          <p className="text-sm mt-2">
            "Digital Consciousness Field Theory: The AmaalSense Model" (Unpublished Manuscript, 2025)
          </p>
        </div>
      </main>
    </div>
  );
}
