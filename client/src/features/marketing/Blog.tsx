import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState } from "react";
import { 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Mail,
  Brain,
  TrendingUp,
  Globe,
  AlertTriangle
} from "lucide-react";



const blogPosts = [
  {
    id: 1,
    title: "Understanding the Global Mood Index: A Deep Dive",
    excerpt: "Learn how GMI is calculated and what it tells us about collective emotional states across different regions and time periods.",
    author: "Dr. Amaal Radwan",
    date: "January 25, 2026",
    readTime: "8 min read",
    category: "Research",
    tags: ["GMI", "Methodology", "DCFT"],
    image: "📊",
    featured: true,
  },
  {
    id: 2,
    title: "How AI is Revolutionizing Emotion Analysis",
    excerpt: "Explore the cutting-edge AI models behind Amaalsense and how they extract nuanced emotional signals from text.",
    author: "Tech Team",
    date: "January 20, 2026",
    readTime: "6 min read",
    category: "Technology",
    tags: ["AI", "NLP", "Transformers"],
    image: "🤖",
    featured: true,
  },
  {
    id: 3,
    title: "Case Study: Predicting Social Unrest Through CFI",
    excerpt: "A retrospective analysis of how the Collective Fear Index signaled emerging crises before they made headlines.",
    author: "Research Team",
    date: "January 15, 2026",
    readTime: "10 min read",
    category: "Case Study",
    tags: ["CFI", "Early Warning", "Crisis"],
    image: "⚠️",
    featured: false,
  },
  {
    id: 4,
    title: "The Science Behind Hope & Resilience Index",
    excerpt: "Why HRI is the most unique metric in emotion analysis and how it measures collective psychological strength.",
    author: "Dr. Amaal Radwan",
    date: "January 10, 2026",
    readTime: "7 min read",
    category: "Research",
    tags: ["HRI", "Hope", "Resilience"],
    image: "🌟",
    featured: false,
  },
  {
    id: 5,
    title: "Emotional Weather Forecasting: The Next Frontier",
    excerpt: "How Amaalsense uses historical patterns and AI to predict emotional trends before they happen.",
    author: "Data Science Team",
    date: "January 5, 2026",
    readTime: "5 min read",
    category: "Technology",
    tags: ["Forecasting", "AI", "Predictions"],
    image: "🌤️",
    featured: false,
  },
  {
    id: 6,
    title: "Integrating Amaalsense API: A Developer's Guide",
    excerpt: "Step-by-step tutorial on integrating emotion analysis into your applications using our RESTful API.",
    author: "Developer Relations",
    date: "December 28, 2025",
    readTime: "12 min read",
    category: "Tutorial",
    tags: ["API", "Integration", "Development"],
    image: "💻",
    featured: false,
  },
];

const categories = ["All", "Research", "Technology", "Case Study", "Tutorial"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    
    // In a real app, this would call an API
    alert("Thank you for subscribing to our newsletter! 🎉");
    setEmail("");
  };

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
            <BookOpen className="w-6 h-6 text-orange-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Blog
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            Insights & Research
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Amaalsense Blog
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore the latest research, tutorials, and insights on collective emotion analysis and digital consciousness.
          </p>
        </div>

        {/* Newsletter Signup */}
        <Card className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/30 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-sm text-slate-400">Get weekly insights on emotion analysis and AI research.</p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 border-white/10 text-white placeholder:text-slate-500"
                />
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Subscribe
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Featured Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-yellow-400" />
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:border-orange-500/30 transition-all group cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      {post.category}
                    </Badge>
                    <span className="text-4xl">{post.image}</span>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-orange-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all group cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-2xl">{post.image}</span>
                </div>
                <CardTitle className="text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-white/5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No articles found matching your criteria.</p>
          </div>
        )}

        {/* Topics Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6 text-purple-400" />
            Popular Topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {["DCFT", "GMI", "CFI", "HRI", "AI", "NLP", "Sentiment Analysis", "Early Warning", "Crisis Detection", "Hope", "Resilience", "API", "Research", "Methodology"].map((topic, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="px-4 py-2 text-sm cursor-pointer hover:bg-white/5 transition-colors"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
