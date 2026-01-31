import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Zap,
  Globe,
  Brain,
  Shield,
  CreditCard,
  Code
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    category: "General",
    icon: <HelpCircle className="w-5 h-5" />,
    color: "text-cyan-400",
    questions: [
      {
        q: "What is Amaalsense?",
        a: "Amaalsense is an AI-powered platform that analyzes collective emotions from digital text sources (news, social media, forums) and converts them into measurable indices. It helps organizations understand the emotional pulse of societies in real-time."
      },
      {
        q: "How is Amaalsense different from other sentiment analysis tools?",
        a: "Unlike traditional sentiment analysis that only measures positive/negative, Amaalsense uses the Digital Consciousness Field Theory (DCFT) to extract 6 emotional dimensions (Joy, Fear, Anger, Sadness, Hope, Curiosity) and calculates unique indices like the Hope & Resilience Index (HRI) that other tools don't provide."
      },
      {
        q: "Who can benefit from using Amaalsense?",
        a: "Amaalsense is designed for governments, NGOs, media companies, research institutions, and enterprises who need to understand public sentiment, monitor crises, track policy impact, or analyze market emotions."
      },
    ]
  },
  {
    category: "Technology",
    icon: <Brain className="w-5 h-5" />,
    color: "text-purple-400",
    questions: [
      {
        q: "What AI models does Amaalsense use?",
        a: "Amaalsense uses a combination of Transformer-based models (similar to BERT) for deep contextual understanding and VADER for rapid sentiment scoring. For Arabic text, we use AraBERT for culturally-aware analysis."
      },
      {
        q: "What is DCFT (Digital Consciousness Field Theory)?",
        a: "DCFT is the scientific framework behind Amaalsense, developed by Amaal Radwan. It treats collective digital emotions as a measurable field with mathematical formulas like D(t) = Σ [Ei × Wi × ΔTi] to quantify the emotional state of digital communities."
      },
      {
        q: "How accurate is the emotion analysis?",
        a: "Our models achieve 85-94% accuracy depending on the language and context. We continuously improve accuracy through feedback loops and model updates. The confidence score shown with each analysis indicates reliability."
      },
      {
        q: "What data sources does Amaalsense use?",
        a: "We aggregate data from news APIs (GNews, NewsAPI), social platforms (Reddit, Mastodon, Bluesky), YouTube comments, Telegram public channels, and RSS feeds. Enterprise customers can add custom data sources."
      },
    ]
  },
  {
    category: "Indices & Metrics",
    icon: <Globe className="w-5 h-5" />,
    color: "text-green-400",
    questions: [
      {
        q: "What is GMI (Global Mood Index)?",
        a: "GMI measures the overall emotional valence of a population, ranging from -100 (extremely negative) to +100 (extremely positive). It's calculated by weighing positive emotions (Joy, Hope) against negative ones (Fear, Anger, Sadness)."
      },
      {
        q: "What is CFI (Collective Fear Index)?",
        a: "CFI specifically tracks fear and anxiety levels in public discourse, ranging from 0 to 100. Values above 70 trigger early warning alerts as they may indicate emerging crises or social instability."
      },
      {
        q: "What is HRI (Hope & Resilience Index)?",
        a: "HRI is our unique index measuring hope, optimism, and collective resilience. It's particularly valuable for tracking recovery after crises and identifying communities with strong social cohesion. Range: 0-100."
      },
    ]
  },
  {
    category: "Pricing & Plans",
    icon: <CreditCard className="w-5 h-5" />,
    color: "text-yellow-400",
    questions: [
      {
        q: "Is there a free plan?",
        a: "Yes! Our free plan includes 50 analyses per day, access to 5 countries on the world map, 24-hour historical data, and full access to the Theory and Documentation pages."
      },
      {
        q: "What's included in the Pro plan?",
        a: "Pro ($49/month) includes 500 analyses/day, 25 countries, 30-day history, social media analysis, Emotional Weather forecasts, PDF exports, and 1,000 API calls/day."
      },
      {
        q: "What does Enterprise include?",
        a: "Enterprise ($299/month) offers unlimited analyses, all countries + custom regions, 1-year history, early warning alerts, white-label options, dedicated support, and unlimited API access."
      },
      {
        q: "Do you offer discounts for academics or NGOs?",
        a: "Yes! We offer 50% discount for academic institutions and special pricing for registered NGOs. Contact us for details."
      },
    ]
  },
  {
    category: "API & Integration",
    icon: <Code className="w-5 h-5" />,
    color: "text-orange-400",
    questions: [
      {
        q: "Is there an API available?",
        a: "Yes! Pro and Enterprise plans include API access. Our RESTful API allows you to integrate emotion analysis into your own applications. Full documentation is available for subscribers."
      },
      {
        q: "What programming languages are supported?",
        a: "Our API is language-agnostic (REST/JSON). We provide SDKs and code examples for Python, JavaScript, and cURL. Any language that can make HTTP requests can use our API."
      },
      {
        q: "Can I integrate Amaalsense with my existing tools?",
        a: "Absolutely! Our API can be integrated with dashboards, BI tools, Slack/Teams for alerts, and custom applications. Enterprise customers get dedicated integration support."
      },
    ]
  },
  {
    category: "Privacy & Security",
    icon: <Shield className="w-5 h-5" />,
    color: "text-red-400",
    questions: [
      {
        q: "Is my data secure?",
        a: "Yes. We use industry-standard encryption (TLS 1.3) for all data transmission. User data is never sold or shared. Enterprise customers can opt for dedicated infrastructure."
      },
      {
        q: "Do you store the text I analyze?",
        a: "By default, analyzed text is stored temporarily for improving our models. You can opt out of this in your account settings. Enterprise plans include full data isolation."
      },
      {
        q: "Is Amaalsense GDPR compliant?",
        a: "Yes, we are fully GDPR compliant. Users can request data deletion at any time. We only process publicly available data and do not collect personal information without consent."
      },
    ]
  },
];

export default function FAQ() {
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
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              FAQ
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Find answers to common questions about Amaalsense, our technology, pricing, and more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto mb-20">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={category.color}>{category.icon}</span>
                <h2 className="text-xl font-bold text-white">{category.category}</h2>
              </div>
              
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${catIndex}-${faqIndex}`}
                        className="border-b border-white/5 last:border-0"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left text-white hover:text-cyan-400 hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-slate-300">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Still Have Questions?</h3>
              <p className="text-slate-300 mb-6">
                Can't find what you're looking for? Our team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <Zap className="w-4 h-4 mr-2" />
                    How It Works
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
