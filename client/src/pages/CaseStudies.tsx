import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  ArrowLeft,
  ArrowRight,
  Building2,
  Newspaper,
  Globe,
  TrendingUp,
  Quote,
  Star,
  CheckCircle,
  BarChart3,
  Users,
  Shield
} from "lucide-react";

const caseStudies = [
  {
    title: "Crisis Monitoring for International NGO",
    titleAr: "مراقبة الأزمات لمنظمة دولية",
    organization: "Global Humanitarian Watch",
    type: "NGO",
    challenge: "Needed real-time emotional monitoring across 15 conflict zones to prioritize resource allocation and anticipate humanitarian needs.",
    solution: "Deployed AmaálSense with custom CFI thresholds for each region, enabling 24/7 automated monitoring with instant alerts.",
    results: [
      "72% faster response to emerging crises",
      "40% improvement in resource allocation efficiency",
      "Early detection of 3 major displacement events",
    ],
    metrics: { countries: 15, alerts: 127, accuracy: "94%" },
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Public Sentiment Analysis for Government",
    titleAr: "تحليل الرأي العام للحكومة",
    organization: "Ministry of Digital Affairs",
    type: "Government",
    challenge: "Required understanding of public emotional response to new policies before and after implementation.",
    solution: "Integrated AmaálSense API with existing analytics dashboard, tracking GMI and HRI changes around policy announcements.",
    results: [
      "Real-time feedback on 12 major policies",
      "Identified 5 areas needing better communication",
      "23% increase in public trust scores",
    ],
    metrics: { policies: 12, dataPoints: "2.3M", satisfaction: "+23%" },
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Market Sentiment for Media Company",
    titleAr: "تحليل السوق لشركة إعلامية",
    organization: "Global News Network",
    type: "Media",
    challenge: "Wanted to understand emotional impact of their coverage and optimize content strategy.",
    solution: "Used AmaálSense to analyze reader emotional responses and compare with competitor coverage.",
    results: [
      "35% increase in reader engagement",
      "Balanced emotional coverage across topics",
      "New 'Emotional Weather' segment launched",
    ],
    metrics: { articles: "50K+", engagement: "+35%", reach: "12M" },
    color: "from-purple-500 to-pink-500",
  },
];

const testimonials = [
  {
    quote: "AmaálSense has transformed how we understand public sentiment. The early warning system alone has saved countless hours of manual monitoring.",
    author: "Dr. Sarah Chen",
    role: "Director of Research",
    organization: "Global Policy Institute",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The DCFT framework provides a scientific foundation that we've been missing in sentiment analysis. Finally, a tool built on solid theory.",
    author: "Prof. Ahmed Al-Rashid",
    role: "Professor of Digital Sociology",
    organization: "University of Technology",
    avatar: "AA",
    rating: 5,
  },
  {
    quote: "We integrated AmaálSense API in just 2 days. The documentation is excellent and the support team is incredibly responsive.",
    author: "Maria González",
    role: "Lead Developer",
    organization: "DataViz Solutions",
    avatar: "MG",
    rating: 5,
  },
  {
    quote: "The world map visualization is stunning and our stakeholders love it. It makes complex emotional data accessible to everyone.",
    author: "James Okonkwo",
    role: "Communications Director",
    organization: "African Development Forum",
    avatar: "JO",
    rating: 5,
  },
  {
    quote: "AmaálSense helped us identify emotional trends we would have completely missed. The Hope & Resilience Index is particularly valuable.",
    author: "Dr. Lisa Park",
    role: "Crisis Response Coordinator",
    organization: "International Relief Agency",
    avatar: "LP",
    rating: 5,
  },
  {
    quote: "As a researcher, I appreciate the transparency of the methodology. The DCFT formulas are well-documented and reproducible.",
    author: "Dr. Michael Torres",
    role: "Data Scientist",
    organization: "Emotion Analytics Lab",
    avatar: "MT",
    rating: 5,
  },
];

export default function CaseStudies() {
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
            <Building2 className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Case Studies
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
            Success Stories
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Real-World Impact
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See how organizations worldwide are using AmaálSense to understand collective emotions and make better decisions.
          </p>
        </div>

        {/* Case Studies */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Featured Case Studies
          </h2>
          
          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${study.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2 bg-white/10">{study.type}</Badge>
                      <CardTitle className="text-xl text-white">{study.title}</CardTitle>
                      <CardDescription className="text-slate-400">{study.organization}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Challenge */}
                    <div>
                      <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Challenge
                      </h4>
                      <p className="text-sm text-slate-300">{study.challenge}</p>
                    </div>
                    
                    {/* Solution */}
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Solution
                      </h4>
                      <p className="text-sm text-slate-300">{study.solution}</p>
                    </div>
                    
                    {/* Results */}
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Results
                      </h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {study.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <Separator className="my-6 bg-white/10" />
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(study.metrics).map(([key, value], i) => (
                      <div key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-lg font-bold text-white">{value}</div>
                        <div className="text-xs text-slate-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Quote className="w-6 h-6 text-purple-400" />
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/40 border-white/10 backdrop-blur-xl hover:border-purple-500/30 transition-all">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-slate-300 text-sm mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{testimonial.author}</div>
                      <div className="text-xs text-slate-500">{testimonial.role}</div>
                      <div className="text-xs text-purple-400">{testimonial.organization}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Join Our Success Stories</h3>
              <p className="text-slate-300 mb-6">
                Ready to transform how your organization understands collective emotions?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    Contact Sales
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                    View Pricing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
