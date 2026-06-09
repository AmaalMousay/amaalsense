import { useState } from 'react';
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

const COUNTRY_POSITIONS: Record<string, { x: number; y: number; nameEn: string }> = {
  'LY': { x: 52, y: 38, nameEn: 'Libya' },
  'EG': { x: 54, y: 40, nameEn: 'Egypt' },
  'SA': { x: 58, y: 44, nameEn: 'Saudi Arabia' },
  'AE': { x: 62, y: 44, nameEn: 'UAE' },
  'US': { x: 20, y: 35, nameEn: 'USA' },
  'GB': { x: 46, y: 26, nameEn: 'UK' },
  'FR': { x: 48, y: 30, nameEn: 'France' },
  'DE': { x: 50, y: 28, nameEn: 'Germany' },
  'CN': { x: 72, y: 38, nameEn: 'China' },
  'JP': { x: 82, y: 35, nameEn: 'Japan' },
  'IN': { x: 66, y: 45, nameEn: 'India' },
  'BR': { x: 30, y: 55, nameEn: 'Brazil' },
  'RU': { x: 70, y: 20, nameEn: 'Russia' },
};

const getMoodColor = (gmi: number, cfi: number, hri: number): string => {
  if (cfi > 60) return '#F4A261';
  if (hri > 60) return '#2A9D8F';
  if (gmi > 20) return '#2A9D8F';
  if (gmi > 0) return '#457B9D';
  if (gmi > -20) return '#E9C46A';
  return '#E63946';
};

export default function Analysis() {
  const [, navigate] = useLocation();
  const [analysisTopic, setAnalysisTopic] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!analysisTopic.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate(`/chat?topic=${encodeURIComponent(analysisTopic)}`);
    }, 600);
  };

  const { data: countriesData, isLoading } = trpc.engine.getMapData.useQuery(undefined, { refetchInterval: 30000 });
  const { data: latestIndices } = trpc.engine.getGlobalMood.useQuery(undefined, { refetchInterval: 15000 });

  const mapData: CountryData[] = countriesData || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
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
              placeholder="Enter topic to analyze..."
              className="h-12 text-lg flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button onClick={handleAnalyze} disabled={!analysisTopic.trim() || isAnalyzing} className="h-12 px-8">
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Brain className="w-5 h-5 mr-2" /> Analyze</>}
            </Button>
          </div>
        </Card>

        {/* Live Indices */}
        {latestIndices && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 text-center"><div className="text-sm text-muted-foreground">Global Mood Index</div><div className="text-4xl font-bold mt-2">{latestIndices.gmi}</div></Card>
            <Card className="p-6 text-center"><div className="text-sm text-muted-foreground">Cognitive Fear Index</div><div className="text-4xl font-bold mt-2">{latestIndices.cfi}</div></Card>
            <Card className="p-6 text-center"><div className="text-sm text-muted-foreground">Hope Resonance Index</div><div className="text-4xl font-bold mt-2">{latestIndices.hri}</div></Card>
          </div>
        )}

        {/* Interactive World Map */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Interactive World Map</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : (
            <div className="relative bg-slate-900/50 rounded-xl p-8" style={{ height: '520px' }}>
              <svg viewBox="0 0 100 60" className="w-full h-full">
                {Object.entries(COUNTRY_POSITIONS).map(([code, pos]) => {
                  const data = mapData.find(d => d.countryCode === code);
                  const color = data ? getMoodColor(data.gmi, data.cfi, data.hri) : '#475569';
                  return (
                    <g key={code}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="1.8"
                        fill={color}
                        stroke="#fff"
                        strokeWidth="0.3"
                        className="cursor-pointer transition-all hover:r-[2.5]"
                        onMouseEnter={() => setHoveredCountry(code)}
                        onMouseLeave={() => setHoveredCountry(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {hoveredCountry && (
                <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg text-sm">
                  {COUNTRY_POSITIONS[hoveredCountry]?.nameEn}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
