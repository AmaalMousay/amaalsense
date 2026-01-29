import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { EMOTION_COLORS, getEmotionColor } from '@shared/emotionColors';
import { toast } from 'sonner';

export default function Analyzer() {
  const [, navigate] = useLocation();
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeHeadline = trpc.emotion.analyzeHeadline.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsLoading(false);
      toast.success('Emotion analysis complete!');
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error('Failed to analyze headline');
    },
  });

  const handleAnalyze = async () => {
    if (!headline.trim()) {
      toast.error('Please enter a headline');
      return;
    }

    setIsLoading(true);
    analyzeHeadline.mutate({ headline });
  };

  // Use unified emotion color system
  const getEmotionStyle = (emotion: string) => {
    const color = getEmotionColor(emotion);
    return { backgroundColor: color };
  };

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
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold cosmic-text mb-4">Emotion Analyzer</h2>
            <p className="text-muted-foreground">
              Enter a news headline to analyze its emotional content
            </p>
          </div>

          {/* Input Section */}
          <Card className="cosmic-card p-8 mb-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium cosmic-text mb-2 block">
                  News Headline
                </span>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Enter a headline to analyze..."
                  className="w-full text-base"
                  disabled={isLoading}
                />
              </label>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !headline.trim()}
                className="glow-button text-white w-full py-6 text-lg"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Emotions'}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          {result && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Analyzed Headline */}
              <Card className="cosmic-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Analyzed Headline
                </h3>
                <p className="text-lg font-semibold cosmic-text">{result.headline}</p>
              </Card>

              {/* Emotion Vectors */}
              <div>
                <h3 className="text-xl font-bold cosmic-text mb-6">Emotion Vectors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.emotions).map(([emotion, score]: [string, any]) => (
                    <Card key={emotion} className="cosmic-card p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold capitalize cosmic-text">
                            {emotion}
                          </span>
                          <span className="text-2xl font-bold gradient-text">
                            {score.toFixed(0)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 rounded-full"
                            style={{ 
                              width: `${score}%`,
                              backgroundColor: getEmotionColor(emotion)
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Analysis Summary */}
              <Card className="cosmic-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Dominant Emotion</p>
                    <p className="text-2xl font-bold gradient-text capitalize">
                      {result.dominantEmotion}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                    <p className="text-2xl font-bold cosmic-text">{result.confidence}%</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Analysis Model</p>
                    <p className="text-2xl font-bold cosmic-text capitalize">{result.model}</p>
                  </div>
                </div>
              </Card>

              {/* New Analysis Button */}
              <Button
                onClick={() => {
                  setHeadline('');
                  setResult(null);
                }}
                variant="outline"
                className="w-full py-6"
              >
                Analyze Another Headline
              </Button>
            </div>
          )}

          {/* Example Headlines */}
          {!result && (
            <div className="mt-12">
              <h3 className="text-lg font-bold cosmic-text mb-4">Try These Examples:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Scientists discover breakthrough in renewable energy technology',
                  'Global markets face unprecedented uncertainty amid economic concerns',
                  'Community celebrates historic victory in social justice movement',
                  'Researchers warn of potential climate crisis acceleration',
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeadline(example)}
                    className="cosmic-card p-4 text-left hover:border-accent transition-colors"
                  >
                    <p className="text-sm text-muted-foreground">{example}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
