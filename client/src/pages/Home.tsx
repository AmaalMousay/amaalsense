import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { Sparkles, TrendingUp, Zap, Heart } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();
  const [indices, setIndices] = useState({ gmi: 0, cfi: 50, hri: 50 });

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

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm hover:text-accent transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/analyzer')}
              className="text-sm hover:text-accent transition-colors"
            >
              Analyzer
            </button>
            <button
              onClick={() => navigate('/map')}
              className="text-sm hover:text-accent transition-colors"
            >
              Map
            </button>
            <button
              onClick={() => navigate('/live')}
              className="text-sm hover:text-accent transition-colors"
            >
              Live
            </button>
            <button
              onClick={() => navigate('/social')}
              className="text-sm hover:text-accent transition-colors"
            >
              Social
            </button>
            <button
              onClick={() => navigate('/theory')}
              className="text-sm hover:text-accent transition-colors"
            >
              Theory
            </button>
            <button
              onClick={() => navigate('/weather')}
              className="text-sm hover:text-accent transition-colors"
            >
              Weather
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-sm hover:text-accent transition-colors"
            >
              About
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="text-sm hover:text-accent transition-colors"
            >
              Pricing
            </button>
            <Button
              onClick={() => navigate('/contact')}
              className="glow-button text-white"
            >
              Contact Sales
            </Button>
          </div>
        </div>
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
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                View Dashboard
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-3">Emotion Analysis</h4>
              <p className="text-muted-foreground">
                Detect six distinct emotions: Joy, Fear, Anger, Sadness, Hope, and Curiosity from any text.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-3">Real-Time Tracking</h4>
              <p className="text-muted-foreground">
                Monitor collective emotions as they evolve, with time-decay algorithms for accurate trends.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-3">Historical Analysis</h4>
              <p className="text-muted-foreground">
                Compare emotional patterns across time periods and identify significant shifts in sentiment.
              </p>
            </Card>

            <Card className="cosmic-card p-6">
              <h4 className="text-lg font-bold cosmic-text mb-3">Actionable Insights</h4>
              <p className="text-muted-foreground">
                Transform raw emotion data into strategic intelligence for organizations and researchers.
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container text-center space-y-6">
          <h3 className="text-3xl font-bold cosmic-text">Ready to Understand Collective Emotion?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start analyzing headlines and discover the emotional pulse of society.
          </p>
          <Button
            onClick={() => navigate('/analyzer')}
            className="glow-button text-white px-8 py-6 text-lg"
          >
            Launch Analyzer Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>AmalSense Engine © 2025 | Transforming Human Emotion into Data | By Amaal Radwan</p>
        </div>
      </footer>
    </div>
  );
}
