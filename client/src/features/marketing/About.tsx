import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  ArrowLeft,
  User,
  Award,
  Mail,
  Globe,
  Brain,
  Target,
  Users,
  Rocket,
  Lightbulb
} from "lucide-react";
import { LogoIcon } from "@/components/Logo";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <LogoIcon className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            About AmalSense
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pioneering Cognitive Intelligence for Global Emotional Understanding
          </p>
        </div>

        {/* Founder Section */}
        <Card className="mb-12 border-purple-500/30 bg-slate-900/50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Amaal Rodwan Bashir</CardTitle>
                <CardDescription className="text-lg">Founder & Visionary Architect</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" /> Background
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Amaal Rodwan Bashir is a multidisciplinary researcher and technologist based in Sebha, Libya. 
                  She holds a Master's degree in Microbiology and combines deep scientific training with a strong passion for 
                  engineering, programming, and computer science. Her unique background bridges biological systems thinking 
                  with computational intelligence.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-400" /> Motivation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  AmalSense was born from a vision to decode collective human emotion at scale. 
                  Inspired by the complexity of biological systems and the power of artificial intelligence, 
                  Amaal set out to build technology that understands not just what people say, but how they feel — 
                  across cultures, languages, and real-time global events.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Overview */}
        <Card className="mb-12 border-purple-500/30 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Brain className="w-7 h-7 text-purple-400" /> The AmalSense Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is AmalSense?</h3>
              <p className="text-muted-foreground leading-relaxed">
                AmalSense is an advanced cognitive analysis platform that provides real-time emotional and cognitive intelligence 
                on global events. It mimics human cognitive processes to understand, interpret, and predict the impact of news 
                and social media narratives using a sophisticated 24-layer cognitive architecture and multi-agent AI system.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Core Technology</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="font-medium mb-2">24-Layer Cognitive Architecture</div>
                  <div className="text-sm text-muted-foreground">Processes information through perception, reasoning, emotion, and metacognition layers.</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="font-medium mb-2">Dynamic Cognitive Flow Transformation (DCFT)</div>
                  <div className="text-sm text-muted-foreground">Proprietary engine that transforms raw data into emotional indices (GMI, CFI, HRI).</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="font-medium mb-2">Multi-Agent System</div>
                  <div className="text-sm text-muted-foreground">Specialized AI agents handle data collection, analysis, and insight generation in parallel.</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50">
                  <div className="font-medium mb-2">Real-time Data Ingestion</div>
                  <div className="text-sm text-muted-foreground">Aggregates news, social media, and public discourse from multiple global sources.</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Key Outputs</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Global Emotional Weather maps and regional sentiment heatmaps</li>
                <li>Three proprietary indices: Global Mood Index (GMI), Cognitive Fear Index (CFI), Hope Resonance Index (HRI)</li>
                <li>Emotion vector analysis across 6 dimensions (Joy, Fear, Anger, Sadness, Hope, Curiosity)</li>
                <li>Predictive insights and causal inference on how events shape collective behavior</li>
                <li>Explainable AI (XAI) reports for transparency and trust</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Long-term Vision */}
        <Card className="mb-12 border-purple-500/30 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Rocket className="w-7 h-7 text-purple-400" /> Long-term Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AmalSense is currently in active development as a solo-founded project. The long-term vision is to establish 
              a technology startup company that commercializes cognitive intelligence tools for governments, media organizations, 
              research institutions, and enterprises seeking deeper understanding of public sentiment and narrative dynamics.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-purple-500/50">Startup Formation Planned</Badge>
              <Badge variant="outline" className="border-purple-500/50">Cognitive AI SaaS</Badge>
              <Badge variant="outline" className="border-purple-500/50">Global Emotional Intelligence Platform</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Previous Work */}
        <Card className="mb-12 border-purple-500/30 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Award className="w-7 h-7 text-purple-400" /> Previous Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Prior to AmalSense, the founder developed <strong>Sitora</strong>, an application demonstrating early interest 
              in building intelligent, user-centered software solutions. This experience laid the foundation for the 
              ambitious cognitive systems now being developed in AmalSense.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">For collaborations or inquiries</p>
          <a href="mailto:amaalmousay@gmail.com" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300">
            <Mail className="w-4 h-4" /> amaalmousay@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
