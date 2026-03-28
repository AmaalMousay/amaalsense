import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, Newspaper, Globe, Brain, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: Date;
}

interface AnalysisResult {
  text: string;
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  dominantEmotion: string;
  sentiment: string;
  confidence: number;
  gmi: number;
  cfi: number;
  hri: number;
}

export default function LiveAnalysis() {
  const [, navigate] = useLocation();
  const [customText, setCustomText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('SA');

  // Fetch sources status
  const { data: sourcesStatus } = trpc.engine.getSourceHealth.useQuery();

  // Fetch country news analysis
  const { data: countryAnalysis, isLoading: isLoadingCountry, refetch: refetchCountry } = 
    trpc.engine.getCountryDetail.useQuery(
      { countryCode: selectedCountry, countryName: selectedCountry, language: 'en' },
      { enabled: true }
    );

  // AI analysis mutation for custom text
  const analyzeWithAI = trpc.engine.analyzeDCFT.useMutation();

  const handleAnalyzeCustomText = async () => {
    if (!customText.trim()) return;
    await analyzeWithAI.mutateAsync({ text: customText, language: 'en' });
  };

  const countries = [
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AE', name: 'UAE' },
    { code: 'EG', name: 'Egypt' },
    { code: 'JP', name: 'Japan' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">Live News Analysis</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container space-y-8">
          {/* Data Sources Status */}
          <Card className="cosmic-card p-6">
            <h2 className="text-xl font-bold cosmic-text mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              Data Sources Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sourcesStatus && Object.entries(sourcesStatus).map(([key, source]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    source.available ? 'bg-green-900/20' : 'bg-yellow-900/20'
                  }`}
                >
                  {source.available ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-sm">{source.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Custom Text Analysis */}
          <Card className="cosmic-card p-6">
            <h2 className="text-xl font-bold cosmic-text mb-4 flex items-center gap-2">
              <LogoIcon size="sm" />
              AI-Powered Text Analysis
            </h2>
            <p className="text-muted-foreground mb-4">
              Enter any text, headline, or news article to analyze its emotional content using AI.
            </p>
            <div className="flex gap-4">
              <Input
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text to analyze..."
                className="flex-1 bg-background/50"
              />
              <Button
                onClick={handleAnalyzeCustomText}
                disabled={!customText.trim() || analyzeWithAI.isPending}
                className="glow-button"
              >
                {analyzeWithAI.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Analyze with AI
              </Button>
            </div>

            {/* AI Analysis Result */}
            {analyzeWithAI.data && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold cosmic-text">Analysis Result</h3>
                
                {/* Indices */}
                <div className="grid grid-cols-3 gap-4">
                  <IndexCard
                    title="GMI"
                    value={analyzeWithAI.data.gmi}
                    min={-100}
                    max={100}
                    unit=""
                    description="Mood"
                    color="purple"
                  />
                  <IndexCard
                    title="CFI"
                    value={analyzeWithAI.data.cfi}
                    min={0}
                    max={100}
                    unit=""
                    description="Fear"
                    color="cyan"
                  />
                  <IndexCard
                    title="HRI"
                    value={analyzeWithAI.data.hri}
                    min={0}
                    max={100}
                    unit=""
                    description="Hope"
                    color="green"
                  />
                </div>

                {/* Emotion Vector */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(analyzeWithAI.data.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="p-3 bg-background/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground capitalize">{emotion}</p>
                      <p className="text-lg font-bold cosmic-text">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Dominant: <span className="text-accent font-semibold">{analyzeWithAI.data.dominantEmotion}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Sentiment: <span className="text-accent font-semibold">{analyzeWithAI.data.sentiment}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Confidence: <span className="text-accent font-semibold">{analyzeWithAI.data.confidence}%</span>
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Country News Analysis */}
          <Card className="cosmic-card p-6">
            <h2 className="text-xl font-bold cosmic-text mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-accent" />
              Country News Analysis
            </h2>

            {/* Country Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {countries.map((country) => (
                <Button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  variant={selectedCountry === country.code ? 'default' : 'outline'}
                  size="sm"
                  className={selectedCountry === country.code ? 'glow-button' : ''}
                >
                  {country.name}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {isLoadingCountry && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <span className="ml-3 text-muted-foreground">Fetching and analyzing news...</span>
              </div>
            )}

            {/* Analysis Results */}
            {countryAnalysis && !isLoadingCountry && (
              <div className="space-y-6">
                {/* Status Badges */}
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    countryAnalysis.isRealNews ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {countryAnalysis.isRealNews ? 'Real News Data' : 'Simulated Data'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    countryAnalysis.isAIAnalyzed ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-900/30 text-gray-400'
                  }`}>
                    {countryAnalysis.isAIAnalyzed ? 'AI Analyzed' : 'Keyword Analysis'}
                  </span>
                  <Button
                    onClick={() => refetchCountry()}
                    variant="outline"
                    size="sm"
                  >
                    Refresh
                  </Button>
                </div>

                {/* Aggregated Indices */}
                <div className="grid grid-cols-3 gap-4">
                  <IndexCard
                    title="GMI"
                    value={countryAnalysis.analysis.gmi}
                    min={-100}
                    max={100}
                    unit=""
                    description="Overall Mood"
                    color="purple"
                  />
                  <IndexCard
                    title="CFI"
                    value={countryAnalysis.analysis.cfi}
                    min={0}
                    max={100}
                    unit=""
                    description="Fear Level"
                    color="cyan"
                  />
                  <IndexCard
                    title="HRI"
                    value={countryAnalysis.analysis.hri}
                    min={0}
                    max={100}
                    unit=""
                    description="Hope Level"
                    color="green"
                  />
                </div>

                {/* News Articles */}
                <div>
                  <h3 className="text-lg font-semibold cosmic-text mb-4">Analyzed Headlines</h3>
                  <div className="space-y-3">
                    {countryAnalysis.articles.map((article: NewsArticle, index: number) => {
                      const result = countryAnalysis.detailedResults[index] as AnalysisResult | undefined;
                      return (
                        <div
                          key={index}
                          className="p-4 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium cosmic-text">{article.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {result && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className={`px-2 py-1 rounded ${
                                  result.sentiment === 'positive' ? 'bg-green-900/30 text-green-400' :
                                  result.sentiment === 'negative' ? 'bg-red-900/30 text-red-400' :
                                  'bg-gray-900/30 text-gray-400'
                                }`}>
                                  {result.sentiment}
                                </span>
                                <span className="text-muted-foreground">
                                  {result.dominantEmotion}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
