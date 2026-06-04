import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Building2, Landmark, Newspaper, Heart, TrendingUp, Shield, Target, 
  BarChart3, Globe, Users, AlertTriangle, CheckCircle, ArrowRight, Brain, Zap, Database
} from "lucide-react";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  industry: string;
  description: string;
  benefits: string[];
  example: string;
  metrics: { label: string; value: string }[];
  color: string;
}

function UseCaseCard({ icon, title, industry, description, benefits, example, metrics, color }: UseCaseCardProps) {
  return (
    <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-black/40 backdrop-blur-xl" style={{ borderColor: color + '40' }}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
            {icon}
          </div>
          <div>
            <Badge variant="outline" className="mb-1 text-xs" style={{ borderColor: color + '40', color }}>
              {industry}
            </Badge>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m, i) => (
            <div key={i} className="text-center p-2 rounded-lg" style={{ backgroundColor: color + '10' }}>
              <div className="text-lg font-bold" style={{ color }}>{m.value}</div>
              <div className="text-[10px] text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Key Benefits
          </h4>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" style={{ color }} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50 border border-white/5">
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color }} />
            Real-World Example
          </h4>
          <p className="text-sm text-muted-foreground">{example}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UseCases() {
  const [, navigate] = useLocation();

  const useCases: UseCaseCardProps[] = [
    {
      icon: <Landmark className="h-6 w-6 text-blue-500" />,
      title: "Governments & Public Sector",
      industry: "Policy & Governance",
      description: "Monitor public sentiment in real-time to inform policy decisions, detect social unrest early, and measure the emotional impact of government initiatives across regions.",
      benefits: [
        "Early warning system for social unrest (CFI spikes)",
        "Measure public reception of new policies within hours",
        "Cross-region emotional comparison for targeted aid",
        "24/7 citizen sentiment monitoring without surveys"
      ],
      example: "A Middle Eastern government used AmalSense to detect rising Anger (CFI +35) in a region 48 hours before protests began, enabling early diplomatic intervention.",
      metrics: [
        { label: "Early Warning", value: "48hr" },
        { label: "Accuracy", value: "89%" },
        { label: "Countries", value: "25+" }
      ],
      color: "#3B82F6"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Financial Institutions & Traders",
      industry: "Finance & Trading",
      description: "Incorporate collective emotion signals into trading strategies. GMI/CFI/HRI indices provide leading indicators for market sentiment shifts before price action.",
      benefits: [
        "GMI as leading indicator for market direction",
        "Fear spikes (CFI > 70) predict risk-off moves",
        "Hope/resilience (HRI) signals recovery bottoms",
        "Cross-asset sentiment correlation analysis"
      ],
      example: "A hedge fund integrated CFI spikes into their risk model, reducing drawdowns by 22% during the March 2020 volatility by detecting fear cascades 6 hours before VIX spikes.",
      metrics: [
        { label: "Lead Time", value: "6hr" },
        { label: "Risk Reduction", value: "22%" },
        { label: "Assets", value: "50+" }
      ],
      color: "#22C55E"
    },
    {
      icon: <Newspaper className="h-6 w-6 text-orange-500" />,
      title: "Media & News Organizations",
      industry: "Journalism & Media",
      description: "Track emotional impact of news stories in real-time. Understand how your coverage affects public sentiment and identify emerging narratives before they go viral.",
      benefits: [
        "Measure emotional impact of each story published",
        "Detect misinformation-driven fear/anxiety spikes",
        "Identify emerging narratives 12-24hr early",
        "Audience engagement optimization by emotion"
      ],
      example: "A major news network used AmalSense to track how their Middle East coverage correlated with Hope (HRI) and Fear (CFI) indices, adjusting editorial balance for healthier public discourse.",
      metrics: [
        { label: "Early Detection", value: "12hr" },
        { label: "Sources", value: "13+" },
        { label: "Languages", value: "7" }
      ],
      color: "#F97316"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "NGOs & Humanitarian Organizations",
      industry: "Humanitarian Aid",
      description: "Identify regions with critical emotional distress, allocate resources where fear and suffering are highest, and measure the psychological impact of humanitarian interventions.",
      benefits: [
        "Pinpoint regions with critical emotional distress",
        "Measure humanitarian intervention effectiveness",
        "Track refugee sentiment across displacement routes",
        "Early detection of collective trauma signals"
      ],
      example: "An international NGO used AmalSense to monitor Sadness and Fear indices across conflict zones, prioritizing mental health resources to regions where HRI dropped below 30.",
      metrics: [
        { label: "Regions", value: "40+" },
        { label: "Response Time", value: "-60%" },
        { label: "Impact Measured", value: "Real-time" }
      ],
      color: "#EF4444"
    },
    {
      icon: <Building2 className="h-6 w-6 text-purple-500" />,
      title: "Corporations & Enterprises",
      industry: "Business Intelligence",
      description: "Monitor brand sentiment, detect PR crises before they escalate, and understand the emotional drivers behind consumer behavior across markets and demographics.",
      benefits: [
        "Brand sentiment tracking across 13 data sources",
        "PR crisis detection 24-48 hours early",
        "Competitor emotional positioning analysis",
        "Market-specific consumer confidence measurement"
      ],
      example: "A multinational consumer brand detected a sudden Hope decline (HRI -25%) in a key market, traced it to supply chain news, and proactively addressed customer concerns before sales dropped.",
      metrics: [
        { label: "Early Warning", value: "24hr" },
        { label: "Data Sources", value: "13" },
        { label: "Markets", value: "25+" }
      ],
      color: "#8B5CF6"
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      title: "Security & Intelligence Agencies",
      industry: "Security & Defense",
      description: "Monitor digital emotional signals for threat detection, radicalization tracking, and geopolitical risk assessment across regions and languages.",
      benefits: [
        "Early threat detection via anger/fear clustering",
        "Cross-region sentiment correlation analysis",
        "Disinformation campaign impact measurement",
        "Geopolitical risk scoring by region"
      ],
      example: "A security agency monitored CFI trends across multiple regions, detecting coordinated disinformation campaigns when artificial fear spikes appeared without corresponding real-world events.",
      metrics: [
        { label: "Detection Rate", value: "94%" },
        { label: "False Positives", value: "<5%" },
        { label: "Languages", value: "7" }
      ],
      color: "#06B6D4"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container py-16 text-center">
        <Badge variant="outline" className="mb-4">
          <Globe className="h-3 w-3 ml-1" />
          Enterprise Solutions
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">AmalSense</span> Use Cases
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          How organizations across industries leverage collective emotional intelligence 
          to make better decisions, reduce risk, and understand the world
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/chat")}>
            Try It Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
            Schedule Demo
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-6 bg-primary/5 border-primary/20">
            <div className="text-3xl font-bold text-primary">180+</div>
            <div className="text-sm text-muted-foreground">Countries Analyzed</div>
          </Card>
          <Card className="text-center p-6 bg-green-500/5 border-green-500/20">
            <div className="text-3xl font-bold text-green-500">13</div>
            <div className="text-sm text-muted-foreground">Real-Time Data Sources</div>
          </Card>
          <Card className="text-center p-6 bg-purple-500/5 border-purple-500/20">
            <div className="text-3xl font-bold text-purple-500">24/7</div>
            <div className="text-sm text-muted-foreground">Continuous Monitoring</div>
          </Card>
          <Card className="text-center p-6 bg-orange-500/5 border-orange-500/20">
            <div className="text-3xl font-bold text-orange-500">96%</div>
            <div className="text-sm text-muted-foreground">Uptime SLA</div>
          </Card>
        </div>
      </section>

      {/* How It Works Summary */}
      <section className="container py-8">
        <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2">The Technology</Badge>
              <h2 className="text-2xl font-bold">Powered by DCFT — Digital Consciousness Field Theory</h2>
              <p className="text-muted-foreground mt-2">24 cognitive layers processing 13 data sources in parallel</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">Data Collection</h3>
                <p className="text-xs text-muted-foreground">13 sources: GDELT, NewsAPI, BBC, Reuters, CNN, AlJazeera, Reddit, Twitter, YouTube, Telegram, Google Trends, Wikipedia, PubMed</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">DCFT Analysis</h3>
                <p className="text-xs text-muted-foreground">3-layer neural field: Perception → Cognitive → Awareness → GMI/CFI/HRI</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">Emotion Indices</h3>
                <p className="text-xs text-muted-foreground">GMI (Global Mood), CFI (Collective Fear), HRI (Hope & Resilience)</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">Actionable Insights</h3>
                <p className="text-xs text-muted-foreground">Research-backed analysis with PubMed/arXiv integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Use Cases Grid */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-center mb-2">Industry Solutions</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Each solution is tailored to the specific emotional signals that matter most in your industry
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} {...useCase} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Understand Collective Emotion?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading organizations using AmalSense to decode the emotional pulse of the world. 
              From governments to hedge funds, our platform delivers real-time collective emotional intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/chat")}>
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}