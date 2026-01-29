import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IndexCard } from '@/components/IndexCard';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Search, 
  Globe, 
  Brain, 
  CheckCircle, 
  Loader2,
  MessageCircle,
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';

// Platform icons (using emojis for simplicity)
const PLATFORM_ICONS: Record<string, string> = {
  reddit: '🔴',
  mastodon: '🐘',
  bluesky: '🦋',
  youtube: '📺',
  telegram: '✈️',
};

const PLATFORM_COLORS: Record<string, string> = {
  reddit: 'bg-orange-900/30 border-orange-500/30',
  mastodon: 'bg-purple-900/30 border-purple-500/30',
  bluesky: 'bg-blue-900/30 border-blue-500/30',
  youtube: 'bg-red-900/30 border-red-500/30',
  telegram: 'bg-cyan-900/30 border-cyan-500/30',
};

interface SocialPost {
  id: string;
  text: string;
  author: string;
  platform: 'reddit' | 'mastodon' | 'bluesky' | 'youtube' | 'telegram';
  url: string;
  publishedAt: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function SocialAnalysis() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'reddit', 'mastodon', 'bluesky', 'youtube', 'telegram'
  ]);

  // Fetch sources status
  const { data: sourcesStatus } = trpc.realtime.getSourcesStatus.useQuery();

  // Fetch and analyze social media posts
  const { data: socialAnalysis, isLoading, refetch } = trpc.social.analyzePostsWithAI.useQuery(
    { query: activeQuery, limit: 30 },
    { enabled: activeQuery.length > 0 }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim());
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const platforms = ['reddit', 'mastodon', 'bluesky', 'youtube', 'telegram'];

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
            <Globe className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">Social Media Analysis</h1>
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
              Connected Platforms
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {platforms.map((platform) => {
                const status = sourcesStatus?.[platform as keyof typeof sourcesStatus];
                const isActive = selectedPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? PLATFORM_COLORS[platform] + ' border-opacity-100' 
                        : 'bg-background/30 border-transparent opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-2xl">{PLATFORM_ICONS[platform]}</span>
                      <span className="capitalize font-medium">{platform}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                      <CheckCircle className={`w-3 h-3 ${status?.available ? 'text-green-400' : 'text-yellow-400'}`} />
                      <span className="text-muted-foreground">
                        {status?.available ? 'Connected' : 'Simulated'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Search Section */}
          <Card className="cosmic-card p-6">
            <h2 className="text-xl font-bold cosmic-text mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-accent" />
              Search Social Media
            </h2>
            <p className="text-muted-foreground mb-4">
              Search across Reddit, Mastodon, Bluesky, YouTube, and Telegram to analyze collective emotions.
            </p>
            <div className="flex gap-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter topic to search (e.g., 'climate change', 'AI technology')..."
                className="flex-1 bg-background/50"
              />
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isLoading}
                className="glow-button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search & Analyze
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {['Saudi Arabia', 'Technology', 'Climate', 'Economy', 'Sports'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setActiveQuery(term);
                  }}
                  className="px-3 py-1 text-sm bg-background/30 rounded-full hover:bg-accent/20 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="cosmic-card p-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                <p className="text-lg cosmic-text">Searching across 5 platforms...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Fetching from Reddit, Mastodon, Bluesky, YouTube, and Telegram
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {socialAnalysis && !isLoading && (
            <div className="space-y-6">
              {/* Source Statistics */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4">Source Statistics</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(socialAnalysis.sources).map(([platform, data]) => (
                    <div
                      key={platform}
                      className={`p-4 rounded-lg text-center ${PLATFORM_COLORS[platform]}`}
                    >
                      <span className="text-2xl">{PLATFORM_ICONS[platform]}</span>
                      <p className="text-2xl font-bold cosmic-text mt-2">{data.count}</p>
                      <p className="text-xs text-muted-foreground capitalize">{platform}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Posts: <span className="text-accent font-bold">{socialAnalysis.totalPosts}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    socialAnalysis.isAIAnalyzed 
                      ? 'bg-purple-900/30 text-purple-400' 
                      : 'bg-gray-900/30 text-gray-400'
                  }`}>
                    {socialAnalysis.isAIAnalyzed ? 'AI Analyzed' : 'Keyword Analysis'}
                  </span>
                </div>
              </Card>

              {/* Emotion Analysis */}
              <Card className="cosmic-card p-6">
                <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                  <LogoIcon size="sm" />
                  Collective Emotion Analysis
                </h3>
                
                {/* Indices */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <IndexCard
                    title="GMI"
                    value={socialAnalysis.analysis.gmi}
                    min={-100}
                    max={100}
                    unit=""
                    description="Overall Mood"
                    color="purple"
                  />
                  <IndexCard
                    title="CFI"
                    value={socialAnalysis.analysis.cfi}
                    min={0}
                    max={100}
                    unit=""
                    description="Fear Level"
                    color="cyan"
                  />
                  <IndexCard
                    title="HRI"
                    value={socialAnalysis.analysis.hri}
                    min={0}
                    max={100}
                    unit=""
                    description="Hope Level"
                    color="green"
                  />
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Dominant Emotion: <span className="text-accent font-semibold">{socialAnalysis.analysis.dominantEmotion}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Confidence: <span className="text-accent font-semibold">{socialAnalysis.analysis.confidence}%</span>
                  </span>
                </div>
              </Card>

              {/* Posts List */}
              <Card className="cosmic-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold cosmic-text">Analyzed Posts</h3>
                  <Button onClick={() => refetch()} variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {socialAnalysis.posts
                    .filter((post: SocialPost) => selectedPlatforms.includes(post.platform))
                    .map((post: SocialPost, index: number) => (
                    <div
                      key={post.id || index}
                      className={`p-4 rounded-lg border ${PLATFORM_COLORS[post.platform]} hover:bg-background/50 transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{PLATFORM_ICONS[post.platform]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="cosmic-text line-clamp-2">{post.text}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>@{post.author}</span>
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" /> {post.engagement.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> {post.engagement.comments}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="w-3 h-3" /> {post.engagement.shares}
                              </span>
                            </div>
                            {post.url !== '#' && (
                              <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-accent"
                              >
                                <ExternalLink className="w-3 h-3" /> View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!socialAnalysis && !isLoading && activeQuery === '' && (
            <Card className="cosmic-card p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Globe className="w-16 h-16 text-accent/50 mb-4" />
                <h3 className="text-xl font-bold cosmic-text mb-2">Search Social Media</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter a topic above to search across Reddit, Mastodon, Bluesky, YouTube, and Telegram.
                  The AI will analyze the collective emotions from all posts.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
