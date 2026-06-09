import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Brain } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Global Analysis Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore real-time emotional intelligence across the world
          </p>
        </div>

        {/* Analysis Input */}
        <Card className="p-8 mb-12 max-w-2xl mx-auto">
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">Analyze any topic</label>
            <div className="flex gap-4">
              <Input
                value={analysisTopic}
                onChange={(e) => setAnalysisTopic(e.target.value)}
                placeholder="e.g., US Elections, Oil Prices, AI Technology..."
                className="h-14 text-lg flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={!analysisTopic.trim() || isAnalyzing}
                className="h-14 px-8"
              >
                {isAnalyzing ? 'Analyzing...' : <><Brain className="w-5 h-5 mr-2" /> Analyze</>}
              </Button>
            </div>
          </div>
        </Card>

        {/* Placeholder for Map and Features */}
        <div className="text-center py-20 border border-dashed border-white/20 rounded-xl">
          <p className="text-muted-foreground text-lg">
            Interactive World Map + Live Indices + Advanced Analysis tools will be restored here.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (Full functionality coming in the next update)
          </p>
        </div>
      </div>
    </div>
  );
}
