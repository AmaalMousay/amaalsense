import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { Link, useLocation } from 'wouter';
import { 
  Sparkles, TrendingUp, Zap, Heart, Menu, X, 
  BookOpen, Building2, HelpCircle, FileText,
  ChevronRight, Globe, Brain, Shield, Users
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Home() {
  const [, navigate] = useLocation();
  const [indices, setIndices] = useState({ gmi: 0, cfi: 50, hri: 50 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch latest indices
  const { data: latestIndices } = trpc.emotion.getLatestIndices.useQuery();

  useEffect(() => {
    if (latestIndices) {
      setIndices({
        gmi: latestIndices.gmi || 0,
        cfi: latestIndices.cfi || 50,
        hri: latestIndices.hri || 50,
      });
    }
  }, [latestIndices]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analyzer', label: 'Analyzer' },
    { href: '/map', label: 'Map' },
    { href: '/live', label: 'Live' },
    { href: '/social', label: 'Social' },
    { href: '/theory', label: 'Theory' },
    { href: '/weather', label: 'Weather' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const resourceLinks = [
    { href: '/how-it-works', label: 'How It Works', icon: <Zap className="w-4 h-4" /> },
    { href: '/case-studies', label: 'Case Studies', icon: <Building2 className="w-4 h-4" /> },
    { href: '/faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { href: '/blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.slice(0, 6).map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-sm hover:text-accent transition-colors cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="relative group">
              <button className="text-sm hover:text-accent transition-colors flex items-center gap-1">
                More <ChevronRight className="w-3 h-3 group-hover:rotate-90 transition-transform" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {navLinks.slice(6).map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="block px-4 py-2 text-sm hover:bg-accent/10 transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                ))}
                <div className="border-t border-border my-1" />
                {resourceLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/10 transition-colors cursor-pointer">
                      {link.icon} {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <LanguageSwitcher />
            <Button
              onClick={() => navigate('/contact')}
              className="glow-button text-white"
            >
              Contact Sales
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="container py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className="block py-2 text-sm hover:text-accent transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                {resourceLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span 
                      className="flex items-center gap-2 py-2 text-sm hover:text-accent transition-colors cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon} {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              <Button
                onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
                className="glow-button text-white w-full mt-4"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-4xl">
          <div className="text-center space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold cosmic-text">
                Digital Collective <span className="gradient-text">Emotion</span> Analyzer
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform the invisible pulse of human emotion into measurable, actionable insights.
                Understand the collective mood of society in real-time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/analyzer')}
                className="glow-button text-white px-8 py-6 text-lg"
              >
                Try Analyzer
              </Button>
              <Button
                onClick={() => navigate('/how-it-works')}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Indices Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">Live Collective Indices</h3>
            <p className="text-muted-foreground">Real-time emotional pulse of global consciousness</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <IndexCard
              title="Global Mood Index"
              value={indices.gmi}
              min={-100}
              max={100}
              unit=""
              description="Overall collective sentiment"
              icon={<TrendingUp />}
              color="purple"
            />
            <IndexCard
              title="Collective Fear Index"
              value={indices.cfi}
              min={0}
              max={100}
              unit=""
              description="Level of collective anxiety"
              icon={<Zap />}
              color="cyan"
            />
            <IndexCard
              title="Hope Resilience Index"
              value={indices.hri}
              min={0}
              max={100}
              unit=""
              description="Societal optimism & resilience"
              icon={<Heart />}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">Powered by Advanced AI</h3>
            <p className="text-muted-foreground">Combining Transformers and VADER for unprecedented accuracy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cosmic-card p-6">
              <Brain className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">Emotion Analysis</h4>
              <p className="text-muted-foreground text-sm">
                Detect six distinct emotions: Joy, Fear, Anger, Sadness, Hope, and Curiosity from any text.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <Globe className="w-8 h-8 text-cyan-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">Global Coverage</h4>
              <p className="text-muted-foreground text-sm">
                Monitor emotions across 25+ countries with real-time world map visualization.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">Historical Analysis</h4>
              <p className="text-muted-foreground text-sm">
                Compare emotional patterns across time periods and identify significant shifts.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <Shield className="w-8 h-8 text-red-400 mb-4" />
              <h4 className="text-lg font-bold cosmic-text mb-3">Early Warning</h4>
              <p className="text-muted-foreground text-sm">
                Get alerts when emotional indices cross critical thresholds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">Use Cases</h3>
            <p className="text-muted-foreground">Trusted by organizations worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-2">Governments & NGOs</h4>
              <p className="text-sm text-muted-foreground">
                Monitor social stability and predict crisis points before they escalate.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-2">Media & Journalism</h4>
              <p className="text-sm text-muted-foreground">
                Enhance data journalism with real-time emotional intelligence from news coverage.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-2">Enterprises</h4>
              <p className="text-sm text-muted-foreground">
                Understand market sentiment before launching campaigns or major initiatives.
              </p>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/case-studies">
              <Button variant="outline" className="gap-2">
                <Building2 className="w-4 h-4" />
                View Case Studies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 border-t border-border/50 bg-accent/5">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold cosmic-text mb-2">Resources</h3>
            <p className="text-muted-foreground">Learn more about AmalSense and emotion analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/how-it-works">
              <Card className="cosmic-card p-6 hover:border-accent/50 transition-colors cursor-pointer h-full">
                <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                <h4 className="text-lg font-bold cosmic-text mb-2">How It Works</h4>
                <p className="text-sm text-muted-foreground">
                  Understand the technology and methodology behind AmalSense.
                </p>
              </Card>
            </Link>

            <Link href="/case-studies">
              <Card className="cosmic-card p-6 hover:border-accent/50 transition-colors cursor-pointer h-full">
                <Building2 className="w-8 h-8 text-green-400 mb-4" />
                <h4 className="text-lg font-bold cosmic-text mb-2">Case Studies</h4>
                <p className="text-sm text-muted-foreground">
                  Real-world examples of how organizations use AmalSense.
                </p>
              </Card>
            </Link>

            <Link href="/faq">
              <Card className="cosmic-card p-6 hover:border-accent/50 transition-colors cursor-pointer h-full">
                <HelpCircle className="w-8 h-8 text-cyan-400 mb-4" />
                <h4 className="text-lg font-bold cosmic-text mb-2">FAQ</h4>
                <p className="text-sm text-muted-foreground">
                  Find answers to common questions about our platform.
                </p>
              </Card>
            </Link>

            <Link href="/blog">
              <Card className="cosmic-card p-6 hover:border-accent/50 transition-colors cursor-pointer h-full">
                <BookOpen className="w-8 h-8 text-orange-400 mb-4" />
                <h4 className="text-lg font-bold cosmic-text mb-2">Blog</h4>
                <p className="text-sm text-muted-foreground">
                  Latest research, tutorials, and insights on emotion analysis.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container text-center space-y-6">
          <h3 className="text-3xl font-bold cosmic-text">Ready to Understand Collective Emotion?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start analyzing headlines and discover the emotional pulse of society.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/analyzer')}
              className="glow-button text-white px-8 py-6 text-lg"
            >
              Launch Analyzer Now
            </Button>
            <Button
              onClick={() => navigate('/pricing')}
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
                <span className="text-xl font-bold gradient-text">AmalSense</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming Human Emotion into Data
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/analyzer"><span className="hover:text-accent cursor-pointer">Analyzer</span></Link></li>
                <li><Link href="/dashboard"><span className="hover:text-accent cursor-pointer">Dashboard</span></Link></li>
                <li><Link href="/map"><span className="hover:text-accent cursor-pointer">World Map</span></Link></li>
                <li><Link href="/weather"><span className="hover:text-accent cursor-pointer">Emotional Weather</span></Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/how-it-works"><span className="hover:text-accent cursor-pointer">How It Works</span></Link></li>
                <li><Link href="/case-studies"><span className="hover:text-accent cursor-pointer">Case Studies</span></Link></li>
                <li><Link href="/faq"><span className="hover:text-accent cursor-pointer">FAQ</span></Link></li>
                <li><Link href="/blog"><span className="hover:text-accent cursor-pointer">Blog</span></Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about"><span className="hover:text-accent cursor-pointer">About</span></Link></li>
                <li><Link href="/theory"><span className="hover:text-accent cursor-pointer">Theory</span></Link></li>
                <li><Link href="/pricing"><span className="hover:text-accent cursor-pointer">Pricing</span></Link></li>
                <li><Link href="/contact"><span className="hover:text-accent cursor-pointer">Contact</span></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>AmalSense Engine © 2025 | By Amaal Radwan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
