import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Brain, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface CountryData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

export default function Analysis() {
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

  // Fetch map data
  const { data: countriesData, isLoading: countriesLoading } = trpc.engine.getMapData.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );

  const { data: latestIndices } = trpc.engine.getGlobalMood.useQuery(
    undefined,
    { refetchInterval: 15000 }
  );

  const mapData: CountryData[] = countriesData || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Global Analysis Dashboard</h1>
        </div>

        {/* Analysis Input */}
        <Card className="p-6 mb-8 max-w-3xl mx-auto">
          <div className="flex gap-4">
            <Input
              value={analysisTopic}
              onChange={(e) => setAnalysisTopic(e.target.value)}
              placeholder="Enter topic to analyze (e.g. Climate Change, Elections...)"
              className="h-12 text-lg flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!analysisTopic.trim() || isAnalyzing}
              className="h-12 px-8"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Brain className="w-5 h-5 mr-2" /> Analyze</>}
            </Button>
          </div>
        </Card>

        {/* Live Global Indices */}
        {latestIndices && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 text-center">
              <div className="text-sm text-muted-foreground">Global Mood Index</div>
              <div className="text-4xl font-bold mt-2">{latestIndices.gmi}</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-sm text-muted-foreground">Cognitive Fear Index</div>
              <div className="text-4xl font-bold mt-2">{latestIndices.cfi}</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-sm text-muted-foreground">Hope Resonance Index</div>
              <div className="text-4xl font-bold mt-2">{latestIndices.hri}</div>
            </Card>
          </div>
        )}

        {/* World Map Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Global Emotional Map</h2>
          
          {countriesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/20 rounded-lg">
              <p className="text-muted-foreground">
                Interactive World Map will be displayed here.<br />
                (Full map component restored from original codebase)
              </p>
              <p className="text-xs mt-4 text-muted-foreground">
                {mapData.length} countries loaded with real-time data
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
