import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  BookOpen,
  ChevronRight
} from "lucide-react";

// Blog post content database
const blogPostsContent: Record<number, {
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  content: string;
}> = {
  1: {
    title: "Understanding the Global Mood Index: A Deep Dive",
    author: "Dr. Amaal Radwan",
    date: "January 25, 2026",
    readTime: "8 min read",
    category: "Research",
    tags: ["GMI", "Methodology", "DCFT"],
    image: "📊",
    content: `
## Introduction

The Global Mood Index (GMI) is the cornerstone metric of the AmalSense platform, designed to capture the collective emotional state of populations across the globe. Unlike traditional sentiment analysis that simply classifies text as positive, negative, or neutral, GMI provides a nuanced, multi-dimensional view of human emotions.

## How GMI is Calculated

GMI operates on a scale from -100 to +100, where:
- **+100** represents extreme collective optimism
- **0** represents emotional neutrality
- **-100** represents extreme collective pessimism

The calculation involves several sophisticated steps:

### 1. Data Collection
We aggregate data from multiple sources including:
- News headlines from 180+ countries
- Social media posts and trends
- Economic indicators and market sentiment
- Public discourse and forum discussions

### 2. Emotion Extraction
Using our proprietary AI models, we extract six primary emotions:
- **Joy** - Happiness, celebration, satisfaction
- **Fear** - Anxiety, worry, concern
- **Anger** - Frustration, outrage, resentment
- **Sadness** - Grief, disappointment, melancholy
- **Hope** - Optimism, anticipation, aspiration
- **Curiosity** - Interest, engagement, exploration

### 3. Weighted Aggregation
Each emotion is weighted based on:
- Source credibility
- Geographic relevance
- Temporal recency
- Engagement metrics

## Interpreting GMI Values

| GMI Range | Interpretation |
|-----------|---------------|
| +70 to +100 | Euphoric - Strong collective optimism |
| +30 to +70 | Positive - General optimism |
| -30 to +30 | Neutral - Balanced emotional state |
| -70 to -30 | Negative - General pessimism |
| -100 to -70 | Crisis - Severe collective distress |

## Real-World Applications

GMI has proven valuable in several domains:

1. **Financial Markets**: Traders use GMI to gauge market sentiment before major decisions
2. **Policy Making**: Governments monitor GMI to understand public response to policies
3. **Crisis Management**: Early warning systems use GMI spikes to detect emerging crises
4. **Research**: Academics study GMI patterns to understand collective psychology

## Conclusion

The Global Mood Index represents a paradigm shift in how we understand collective human emotions. By providing real-time, data-driven insights into the emotional state of populations, GMI enables better decision-making across multiple domains.

---

*For more information about our methodology, visit the DCFT Theory page or contact our research team.*
    `
  },
  2: {
    title: "How AI is Revolutionizing Emotion Analysis",
    author: "Tech Team",
    date: "January 20, 2026",
    readTime: "6 min read",
    category: "Technology",
    tags: ["AI", "NLP", "Transformers"],
    image: "🤖",
    content: `
## The AI Revolution in Emotion Analysis

Traditional sentiment analysis relied on simple keyword matching and rule-based systems. Today, AmalSense leverages cutting-edge AI to understand the nuanced emotional content of text with unprecedented accuracy.

## Our Technology Stack

### Transformer Architecture
At the heart of our system lies a custom-trained transformer model, inspired by architectures like BERT and GPT, but specifically optimized for emotion detection.

Key features:
- **Multi-lingual support**: Trained on 50+ languages
- **Context awareness**: Understands sarcasm, irony, and cultural nuances
- **Real-time processing**: Analyzes thousands of texts per second

### The Five-Layer Intelligence System

AmalSense AI operates through five interconnected layers:

1. **Analytical Intelligence** (Layer 1)
   - Calculates GMI, CFI, HRI
   - Extracts raw emotions
   - Mathematical processing

2. **Emotional Reasoning** (Layer 2)
   - Connects indicators
   - Understands relationships
   - Infers psychological states

3. **Conversational Intelligence** (Layer 3)
   - Natural language understanding
   - Human-like responses
   - Follow-up questions

4. **Meta-Decision AI** (Layer 4)
   - Converts analysis to recommendations
   - Risk assessment
   - Scenario planning

5. **Knowledge Layer** (Layer 5)
   - Vector database for context
   - RAG (Retrieval Augmented Generation)
   - Historical pattern matching

## Training Process

Our models are trained on:
- 10 million+ labeled emotional texts
- Cross-cultural emotion datasets
- Real-time news and social media feeds
- Expert-annotated edge cases

## Accuracy Metrics

| Metric | Score |
|--------|-------|
| Emotion Classification | 94.2% |
| Sentiment Accuracy | 96.8% |
| Cross-lingual Performance | 91.5% |
| Sarcasm Detection | 87.3% |

## Future Directions

We're actively researching:
- Multimodal emotion analysis (text + images + audio)
- Predictive emotion forecasting
- Personalized emotional insights

---

*Interested in our API? Check out our Developer's Guide for integration tutorials.*
    `
  },
  3: {
    title: "Case Study: Predicting Social Unrest Through CFI",
    author: "Research Team",
    date: "January 15, 2026",
    readTime: "10 min read",
    category: "Case Study",
    tags: ["CFI", "Early Warning", "Crisis"],
    image: "⚠️",
    content: `
## Executive Summary

This case study examines how the Collective Fear Index (CFI) successfully predicted social unrest events across three different regions, demonstrating the practical value of emotion-based early warning systems.

## What is CFI?

The Collective Fear Index measures the aggregate level of fear, anxiety, and concern within a population. It operates on a scale of 0-100:

- **0-30**: Low fear - Normal baseline
- **30-50**: Moderate fear - Elevated concern
- **50-70**: High fear - Significant anxiety
- **70-100**: Critical fear - Crisis imminent

## Case Study 1: Economic Crisis Prediction

### Background
In Q3 2025, CFI for Country X began rising steadily from 25 to 45 over three weeks.

### What CFI Detected
- Increasing mentions of "unemployment" and "inflation"
- Growing anxiety about economic policies
- Rising distrust in financial institutions

### Outcome
Two weeks after CFI reached 45, major protests erupted over economic conditions.

### Lead Time
**14 days** advance warning

## Case Study 2: Political Tension Detection

### Background
CFI in Region Y spiked from 30 to 65 within 5 days following a controversial announcement.

### What CFI Detected
- Surge in fear-related keywords
- Rapid spread of anxiety across social networks
- Cross-demographic fear patterns

### Outcome
Civil demonstrations began within 72 hours of the CFI peak.

### Lead Time
**3 days** advance warning

## Case Study 3: Health Crisis Early Warning

### Background
CFI in Area Z showed unusual patterns - rising fear without clear trigger.

### What CFI Detected
- Localized health-related anxiety
- Unusual search patterns
- Community-level fear clustering

### Outcome
Local health emergency was declared one week later.

### Lead Time
**7 days** advance warning

## Key Findings

1. **CFI above 50 is a reliable warning signal** - In 87% of cases, CFI above 50 preceded significant events
2. **Rate of change matters** - Rapid CFI increases (>10 points in 48 hours) indicate imminent events
3. **Geographic clustering is significant** - Localized CFI spikes often precede localized events

## Recommendations

For organizations monitoring social stability:
- Set alerts for CFI > 45
- Monitor rate of change, not just absolute values
- Combine CFI with GMI and HRI for comprehensive analysis

---

*Contact our research team for custom analysis and consulting services.*
    `
  },
  4: {
    title: "The Science Behind Hope & Resilience Index",
    author: "Dr. Amaal Radwan",
    date: "January 10, 2026",
    readTime: "7 min read",
    category: "Research",
    tags: ["HRI", "Hope", "Resilience"],
    image: "🌟",
    content: `
## Introduction

While most emotion analysis platforms focus on negative emotions, AmalSense uniquely measures Hope & Resilience through our proprietary HRI metric. This index captures the collective psychological strength and forward-looking optimism of populations.

## Why HRI Matters

Hope and resilience are predictive indicators of:
- Economic recovery potential
- Social cohesion
- Crisis recovery speed
- Innovation and entrepreneurship

## The Psychology of Collective Hope

Based on research in positive psychology, collective hope consists of:

### 1. Agency Thinking
The belief that people can achieve their goals
- "We can do this"
- "There's a way forward"

### 2. Pathway Thinking
The ability to envision routes to success
- "Here's how we'll succeed"
- "Multiple options exist"

### 3. Resilience Markers
Signs of psychological strength
- "We've overcome before"
- "This won't break us"

## HRI Calculation

HRI is calculated from:

| Component | Weight |
|-----------|--------|
| Hope keywords | 30% |
| Future-oriented language | 25% |
| Recovery narratives | 20% |
| Community solidarity | 15% |
| Problem-solving discourse | 10% |

## Interpreting HRI

| HRI Range | Interpretation |
|-----------|---------------|
| 70-100 | High resilience - Strong recovery potential |
| 50-70 | Moderate resilience - Stable psychological state |
| 30-50 | Low resilience - Vulnerable to shocks |
| 0-30 | Critical - Psychological support needed |

## HRI vs CFI: The Balance

The relationship between HRI and CFI tells a powerful story:

- **High HRI + Low CFI**: Optimal state - confident and calm
- **High HRI + High CFI**: Determined - scared but fighting
- **Low HRI + Low CFI**: Apathetic - disengaged
- **Low HRI + High CFI**: Crisis - scared and hopeless

## Real-World Applications

### Post-Crisis Recovery
HRI helps predict how quickly communities will recover from disasters.

### Investment Decisions
High HRI regions show stronger economic growth potential.

### Mental Health Policy
Low HRI areas may need psychological support programs.

## Conclusion

HRI represents a paradigm shift in emotion analysis - moving beyond negative emotion detection to measure the positive psychological resources that enable human flourishing.

---

*Learn more about our complete methodology in the DCFT Theory section.*
    `
  },
  5: {
    title: "Emotional Weather Forecasting: The Next Frontier",
    author: "Data Science Team",
    date: "January 5, 2026",
    readTime: "5 min read",
    category: "Technology",
    tags: ["Forecasting", "AI", "Predictions"],
    image: "🌤️",
    content: `
## The Future of Emotion Analysis

Just as meteorologists predict weather patterns, AmalSense is pioneering the field of emotional weather forecasting - predicting how collective emotions will evolve over time.

## How Emotional Forecasting Works

### Historical Pattern Analysis
Our AI analyzes years of emotional data to identify recurring patterns:
- Seasonal emotional cycles
- Event-triggered emotional responses
- Recovery patterns after crises

### Predictive Modeling
Using machine learning, we build models that forecast:
- GMI trends for the next 7 days
- CFI spike probability
- HRI recovery trajectories

## Current Capabilities

| Forecast Type | Accuracy | Time Horizon |
|--------------|----------|--------------|
| GMI Trend | 78% | 3 days |
| CFI Spike Alert | 82% | 48 hours |
| HRI Recovery | 71% | 7 days |

## Use Cases

### Financial Planning
Traders can anticipate market sentiment shifts before they happen.

### Crisis Preparedness
Organizations can prepare for emotional volatility.

### Campaign Timing
Marketers can time campaigns for optimal emotional receptivity.

## The Technology Behind It

Our forecasting engine uses:
- LSTM neural networks for time series
- Attention mechanisms for event impact
- Ensemble methods for robust predictions

## Limitations and Ethics

We're transparent about limitations:
- Forecasts are probabilistic, not certain
- Unexpected events can invalidate predictions
- Ethical use guidelines apply

## Coming Soon

We're developing:
- 14-day emotional forecasts
- Regional micro-forecasting
- Event impact simulation

---

*Stay tuned for our upcoming Forecast Dashboard feature!*
    `
  },
  6: {
    title: "Integrating Amaalsense API: A Developer's Guide",
    author: "Developer Relations",
    date: "December 28, 2025",
    readTime: "12 min read",
    category: "Tutorial",
    tags: ["API", "Integration", "Development"],
    image: "💻",
    content: `
## Getting Started with AmalSense API

This comprehensive guide will walk you through integrating AmalSense's emotion analysis capabilities into your applications.

## Prerequisites

- API key (available in your dashboard)
- Basic knowledge of REST APIs
- Your preferred programming language

## Authentication

All API requests require authentication via Bearer token:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.amalsense.com/v1/analyze
\`\`\`

## Core Endpoints

### 1. Analyze Text
\`\`\`
POST /v1/analyze
\`\`\`

Request body:
\`\`\`json
{
  "text": "Your text to analyze",
  "language": "en",
  "include_emotions": true
}
\`\`\`

Response:
\`\`\`json
{
  "gmi": 45.2,
  "cfi": 23.1,
  "hri": 67.8,
  "emotions": {
    "joy": 0.3,
    "fear": 0.1,
    "anger": 0.05,
    "sadness": 0.1,
    "hope": 0.35,
    "curiosity": 0.1
  }
}
\`\`\`

### 2. Get Country Data
\`\`\`
GET /v1/countries/{country_code}
\`\`\`

### 3. Historical Data
\`\`\`
GET /v1/history?country={code}&days={n}
\`\`\`

## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|----------------|--------------|
| Free | 10 | 1,000 |
| Pro | 100 | 50,000 |
| Enterprise | Unlimited | Unlimited |

## Code Examples

### Python
\`\`\`python
import requests

response = requests.post(
    "https://api.amalsense.com/v1/analyze",
    headers={"Authorization": "Bearer YOUR_KEY"},
    json={"text": "Great news today!"}
)
print(response.json())
\`\`\`

### JavaScript
\`\`\`javascript
const response = await fetch(
  "https://api.amalsense.com/v1/analyze",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: "Great news today!" })
  }
);
const data = await response.json();
\`\`\`

## Best Practices

1. **Cache responses** - Emotion data doesn't change rapidly
2. **Batch requests** - Use bulk endpoints for multiple texts
3. **Handle errors gracefully** - Implement retry logic
4. **Respect rate limits** - Use exponential backoff

## Support

- Documentation: docs.amalsense.com
- Support: support@amalsense.com
- Discord: discord.gg/amalsense

---

*Happy coding! We can't wait to see what you build.*
    `
  }
};

export default function BlogPost() {
  const params = useParams();
  const postId = parseInt(params.id || "1");
  const post = blogPostsContent[postId];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Card className="bg-black/40 border-white/10 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-slate-400 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Get related posts (same category, different id)
  const relatedPosts = Object.entries(blogPostsContent)
    .filter(([id, p]) => p.category === post.category && parseInt(id) !== postId)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        {[...Array(50)].map((_, i) => (
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
          <Link href="/blog" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-slate-400 hover:text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
              {post.category}
            </Badge>
            <span className="text-4xl">{post.image}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-slate-400 border-white/20">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <Card className="max-w-4xl mx-auto bg-black/40 border-white/10 backdrop-blur-xl mb-12">
          <CardContent className="p-8 md:p-12">
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-orange-400
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-cyan-400
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-strong:text-white
                prose-ul:text-slate-300 prose-li:text-slate-300
                prose-table:border-white/10
                prose-th:bg-white/5 prose-th:text-white prose-th:p-3
                prose-td:border-white/10 prose-td:p-3 prose-td:text-slate-300
                prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-cyan-400
                prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10
                prose-blockquote:border-orange-500 prose-blockquote:text-slate-400
                prose-hr:border-white/10"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/^## /gm, '<h2>')
                  .replace(/^### /gm, '<h3>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\|([^|]+)\|/g, '<td>$1</td>')
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>')
                  .replace(/- ([^\n]+)/g, '<li>$1</li>')
                  .replace(/---/g, '<hr>')
              }}
            />
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-orange-400" />
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map(([id, relatedPost]) => (
                <Link key={id} href={`/blog/${id}`}>
                  <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:border-orange-500/30 transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          {relatedPost.category}
                        </Badge>
                        <span className="text-2xl">{relatedPost.image}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 hover:text-orange-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{relatedPost.author}</span>
                        <span className="flex items-center gap-1">
                          <ChevronRight className="w-4 h-4" />
                          Read more
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
