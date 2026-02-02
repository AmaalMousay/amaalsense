# AmalSense - Comprehensive Project Report
## Collective Emotional Intelligence Platform

**Author:** Amal Radwan  
**Date:** February 2, 2026  
**Version:** 2.0

---

## Executive Summary

AmalSense represents a groundbreaking advancement in the field of collective emotional intelligence, transforming from a traditional sentiment analysis dashboard into a sophisticated **Collective Emotional Intelligence Agent**. The platform uniquely combines scientific methodology with conversational AI to analyze, interpret, and explain collective emotions from digital sources worldwide.

Unlike conventional sentiment analysis tools that merely display numbers and charts, AmalSense employs a five-layer intelligent architecture that enables it to **think with data first, then communicate in human language**. This fundamental distinction positions AmalSense as the first Arabic platform for collective emotional intelligence analysis.

---

## 1. Project Vision and Philosophy

### 1.1 Core Vision

AmalSense was conceived to bridge the gap between raw emotional data and actionable human understanding. The platform addresses a critical limitation in existing sentiment analysis tools: they present data without context, interpretation, or guidance.

> "AmalSense doesn't just show you what people feel—it explains why they feel it, what it means, and what you should do about it."

### 1.2 Theoretical Foundation: DCFT

The platform is built upon the **Digital Collective Field Theory (DCFT)**, an original scientific framework that treats collective emotions as a dynamic field influenced by multiple interacting factors. DCFT comprises several interconnected layers:

| Layer | Function | Description |
|-------|----------|-------------|
| **Perception Layer** | Data Intake | Collects and normalizes emotional signals from diverse digital sources |
| **Cognitive Layer** | Pattern Recognition | Identifies emotional patterns and contextual relationships |
| **Awareness Layer** | Index Calculation | Computes the three core indices (GMI, CFI, HRI) |
| **Affective Vector** | Emotion Mapping | Maps emotions to a six-dimensional vector space |
| **Temporal Decay** | Time Weighting | Applies recency weights to emotional signals |

---

## 2. Technical Architecture

### 2.1 Five-Layer Intelligent System

AmalSense employs a sophisticated five-layer architecture that distinguishes it from conventional chatbots and sentiment tools:

```
┌─────────────────────────────────────────┐
│         Layer 0: API Gateway            │
│    (Request Reception & Routing)        │
├─────────────────────────────────────────┤
│      Layer 1: AI Orchestrator           │
│  (Intent Classification & Routing)      │
├─────────────────────────────────────────┤
│         Layer 2: LLM Layer              │
│    (Natural Language Generation)        │
├─────────────────────────────────────────┤
│       Layer 3: Core Engines             │
│  (DCFT, Emotion Fusion, Indicators)     │
├─────────────────────────────────────────┤
│      Layer 4: Knowledge Layer           │
│    (Vector Store, RAG, Memory)          │
└─────────────────────────────────────────┘
```

### 2.2 Layer Descriptions

**Layer 0 - API Gateway:** Serves as the entry point for all requests, handling authentication, rate limiting, and request normalization through tRPC endpoints.

**Layer 1 - AI Orchestrator:** The executive brain of the system. This layer classifies user intent (analysis, explanation, prediction, comparison, recommendation) and determines which engines to invoke. The orchestrator ensures efficient resource utilization by only calling necessary components.

**Layer 2 - LLM Layer:** Provides natural language generation capabilities. The system supports multiple providers through an abstraction layer:

| Provider | Model | Use Case |
|----------|-------|----------|
| Manus API | Built-in | Development environment |
| Groq Cloud | Qwen 2.5 | Production (open-source, free) |

**Layer 3 - Core Engines:** The intellectual heart of AmalSense, containing:

| Engine | Purpose |
|--------|---------|
| DCFT Engine | Implements the Digital Collective Field Theory |
| Emotion Fusion | Combines multiple emotion signals into coherent output |
| Unified Analyzer | Orchestrates analysis across all data sources |
| Meta-Decision Engine | Generates strategic recommendations |
| Confidence Propagation | Calculates and propagates confidence scores |
| Explainable Insight | Generates human-readable explanations |

**Layer 4 - Knowledge Layer:** Provides memory and context through:

| Component | Function |
|-----------|----------|
| Vector Store | Stores analysis embeddings for semantic search |
| RAG System | Retrieves relevant past analyses to ground responses |
| Embeddings Service | Generates vector representations of text |

### 2.3 The Critical Distinction

The fundamental difference between AmalSense and conventional AI assistants lies in the processing flow:

**Conventional Chatbot:**
```
User → LLM → Answer (thinks with words)
```

**AmalSense:**
```
User → Orchestrator → Engines → LLM → Answer (thinks with data, then speaks)
```

This architecture ensures that every response is grounded in actual analysis rather than generated from the LLM's training data alone.

---

## 3. Core Indicators

### 3.1 Global Mood Index (GMI)

The **Global Mood Index** represents the overall collective emotional state on a scale from -100 to +100.

| Range | Interpretation | Color |
|-------|----------------|-------|
| +60 to +100 | Highly Positive | Green |
| +20 to +59 | Positive | Light Green |
| -19 to +19 | Neutral | Gray |
| -59 to -20 | Negative | Orange |
| -100 to -60 | Highly Negative | Red |

**Calculation Method:** GMI is computed by aggregating weighted sentiment scores from multiple sources, applying temporal decay, and normalizing to the standard scale.

### 3.2 Collective Fear Index (CFI)

The **Collective Fear Index** measures the level of collective anxiety and fear on a scale from 0 to 100.

| Range | Risk Level | Interpretation |
|-------|------------|----------------|
| 0-20 | Low | Calm collective state |
| 21-40 | Moderate | Normal caution |
| 41-60 | Elevated | Heightened concern |
| 61-80 | High | Significant fear present |
| 81-100 | Critical | Panic-level fear |

**Calculation Method:** CFI analyzes fear-related keywords, negative sentiment intensity, and crisis-related content across sources.

### 3.3 Hope-Risk Index (HRI)

The **Hope-Risk Index** balances optimism against perceived risks, providing a nuanced view of collective resilience.

| Range | Interpretation |
|-------|----------------|
| 0-30 | Risk-dominant mindset |
| 31-50 | Cautious outlook |
| 51-70 | Balanced hope and caution |
| 71-100 | Hope-dominant mindset |

---

## 4. Emotion Vector System

AmalSense maps emotions to a six-dimensional vector space, enabling nuanced emotional analysis:

| Dimension | Description | Range |
|-----------|-------------|-------|
| **Joy** | Happiness, satisfaction, celebration | 0-100 |
| **Fear** | Anxiety, worry, dread | 0-100 |
| **Anger** | Frustration, outrage, hostility | 0-100 |
| **Sadness** | Grief, disappointment, melancholy | 0-100 |
| **Hope** | Optimism, anticipation, aspiration | 0-100 |
| **Curiosity** | Interest, engagement, inquiry | 0-100 |

The emotion vector enables complex emotional state representation. For example, "cautious optimism" would show elevated hope alongside moderate fear, while "angry hope" might indicate revolutionary sentiment.

---

## 5. Data Sources and Integration

### 5.1 Supported Data Sources

AmalSense aggregates emotional signals from multiple digital sources:

| Source Type | Integration Method | Coverage |
|-------------|-------------------|----------|
| News APIs | GNews, NewsAPI | Global news headlines |
| RSS Feeds | Major news outlets | Real-time updates |
| Social Media | Twitter/X API | Public sentiment |
| Video Platforms | YouTube API | Video content analysis |
| Google RSS | Google News RSS | Aggregated news |

### 5.2 Source Weighting

Not all sources carry equal weight. AmalSense applies intelligent source weighting based on:

| Factor | Weight Impact |
|--------|---------------|
| Source credibility | Higher weight for established outlets |
| Recency | Recent content weighted more heavily |
| Engagement | High-engagement content receives attention |
| Geographic relevance | Local sources weighted for regional analysis |

---

## 6. Platform Features

### 6.1 Smart Analysis (Conversational AI)

The flagship feature of AmalSense 2.0, Smart Analysis provides:

**Split-Screen Interface:**
- **Left Panel:** Real-time indicators (GMI, CFI, HRI), emotion distribution charts
- **Right Panel:** AI-powered explanations, insights, and conversation

**Capabilities:**
- Automatic country detection from topic context
- Real-time indicator calculation and display
- Natural language explanations of complex data
- Follow-up question support for deeper exploration
- Conversation history with sidebar navigation

### 6.2 Global Emotion Map

An interactive world map displaying collective emotional states by country:

- Color-coded countries based on dominant emotion
- Click-to-analyze functionality (now linked to Smart Analysis)
- Real-time data updates
- Tooltip information on hover

### 6.3 Conversation History

ChatGPT-style conversation management:

- Sidebar with all previous analysis sessions
- One-click navigation to past conversations
- Delete and organize conversations
- "New Analysis" quick action

### 6.4 Multi-Language Support

Full internationalization with seven languages:

| Language | Code | Status |
|----------|------|--------|
| English | en | Complete |
| Arabic | ar | Complete |
| French | fr | Complete |
| German | de | Complete |
| Russian | ru | Complete |
| Spanish | es | Complete |
| Chinese | zh | Complete |

**Automatic Detection:** The platform automatically detects browser language and sets the appropriate interface language.

### 6.5 Blog and Knowledge Base

Educational content about emotional intelligence:

- Six comprehensive articles on DCFT methodology
- Full article view with rich formatting
- Category-based organization
- Share functionality

### 6.6 Onboarding Tour

Interactive guided tour for new users:

- Six-step introduction to platform features
- Updated to reflect conversational AI capabilities
- Skip option for returning users

---

## 7. Technology Stack

### 7.1 Frontend Technologies

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Component library |
| Wouter | Routing |
| TanStack Query | Data fetching |
| Recharts | Data visualization |

### 7.2 Backend Technologies

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express 4 | HTTP server |
| tRPC 11 | Type-safe API |
| Drizzle ORM | Database access |
| MySQL/TiDB | Database |
| Superjson | Serialization |

### 7.3 AI and ML Technologies

| Technology | Purpose |
|------------|---------|
| Manus LLM API | Primary language model |
| Groq Cloud | Alternative LLM provider |
| Qwen 2.5 | Open-source model support |
| Custom Embeddings | Vector generation |
| In-memory Vector Store | Semantic search |

---

## 8. Database Schema

### 8.1 Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| users | User accounts | id, openId, role, subscriptionTier |
| emotion_indices | Global indices | gmi, cfi, hri, confidence |
| emotion_analyses | Individual analyses | headline, emotion vector, dominantEmotion |
| country_emotion_indices | Country-level indices | countryCode, gmi, cfi, hri |
| analysis_sessions | Analysis history | query, results, duration |
| ai_conversations | Chat history | topic, country, messages |
| ai_conversation_messages | Chat messages | role, content, metadata |

### 8.2 Subscription System

| Tier | Features | Limits |
|------|----------|--------|
| Free | Basic analysis | 10 analyses/day |
| Pro | Advanced features | 100 analyses/day |
| Enterprise | Full access | Unlimited |
| Government | Custom deployment | Custom |

---

## 9. Security and Privacy

### 9.1 Authentication

- OAuth 2.0 integration with Manus platform
- JWT-based session management
- Role-based access control (user/admin)

### 9.2 Data Protection

- No storage of raw news content (only analysis results)
- User data encrypted at rest
- API rate limiting to prevent abuse
- Input sanitization against injection attacks

---

## 10. Future Roadmap

### 10.1 Short-term Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| Quick Questions | Pre-defined question buttons in Smart Analysis | High |
| Conversation Search | Search through past conversations | Medium |
| PDF Export | Download analysis reports as PDF | Medium |

### 10.2 Medium-term Goals

| Feature | Description | Timeline |
|---------|-------------|----------|
| Mobile Application | Native iOS/Android apps | Q2 2026 |
| Real-time Alerts | Push notifications for significant changes | Q2 2026 |
| API Access | Public API for enterprise integration | Q3 2026 |

### 10.3 Long-term Vision

| Feature | Description | Timeline |
|---------|-------------|----------|
| Predictive Analytics | Forecast emotional trends | Q4 2026 |
| Custom Models | User-trainable emotion models | 2027 |
| Multi-modal Analysis | Image and video emotion analysis | 2027 |

---

## 11. Conclusion

AmalSense has evolved from a sentiment analysis dashboard into a sophisticated **Collective Emotional Intelligence Agent**. The platform's unique five-layer architecture, grounded in the original DCFT methodology, enables it to provide not just data, but understanding, interpretation, and actionable guidance.

The key differentiators of AmalSense include:

1. **Scientific Foundation:** Built on the Digital Collective Field Theory, providing academic rigor to emotional analysis
2. **Conversational Intelligence:** Natural language interaction that explains complex emotional data
3. **Portable Architecture:** Open-source LLM support (Groq + Qwen) enables deployment anywhere
4. **Global Coverage:** Seven languages and worldwide data source integration
5. **Actionable Insights:** Moves beyond data display to provide recommendations and predictions

AmalSense represents a new paradigm in emotional intelligence platforms—one where AI doesn't just compute, but truly understands and communicates the collective emotional pulse of humanity.

---

## Appendix A: File Structure

```
amalsense/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── i18n/              # Internationalization
│   │   └── lib/               # Utilities
├── server/                    # Backend application
│   ├── _core/                 # Framework infrastructure
│   ├── dcft/                  # DCFT implementation
│   ├── engines/               # Analysis engines
│   ├── orchestrator/          # AI orchestration
│   ├── knowledge/             # RAG and vector store
│   └── routers.ts             # API endpoints
├── drizzle/                   # Database schema
└── shared/                    # Shared constants
```

---

## Appendix B: API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/trpc/analysis.analyze | POST | Run full analysis |
| /api/trpc/conversationalAI.analyzeWithAI | POST | Smart Analysis with AI |
| /api/trpc/conversationalAI.askFollowUp | POST | Follow-up questions |
| /api/trpc/conversations.* | CRUD | Conversation management |
| /api/trpc/country.* | GET | Country-specific data |

---

**End of Report**

*This report was prepared to document the current state of the AmalSense platform as of February 2026.*
