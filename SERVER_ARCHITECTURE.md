# 🧠 AmalSense Server Architecture

> **Version:** 2.0 (Post-Refactor)  
> **Last Updated:** 2026-05-27  
> **Total Files:** 137 TypeScript  

---

## 📋 Table of Contents

1. [What is AmalSense?](#-what-is-amalsense)
2. [Server Structure Overview](#-server-structure-overview)
3. [Core Concepts](#-core-concepts)
4. [Data Flow: Request to Response](#-data-flow-request-to-response)
5. [Layer-by-Layer Pipeline (24 Cognitive Layers)](#-layer-by-layer-pipeline)
6. [Directory Map](#-directory-map)
7. [Data Sources (13 Parallel Sources)](#-data-sources)
8. [API Layer (17 Routers)](#-api-layer)
9. [Database Schema](#-database-schema)
10. [Key Design Decisions](#-key-design-decisions)

---

## 🎯 What is AmalSense?

AmalSense is a **collective emotion analysis platform** that measures and analyzes human sentiment from digital sources using **DCFT (Digital Consciousness Field Theory)**. It produces three core indices:

| Index | Meaning | Range |
|-------|---------|-------|
| **GMI** | Global Mood Index | -100 (very negative) ↔ +100 (very positive) |
| **CFI** | Collective Fear Index | 0 (no fear) ↔ 100 (extreme fear) |
| **HRI** | Hope & Resilience Index | 0 (no hope) ↔ 100 (strong hope) |

---

## 🏗️ Server Structure Overview

```
server/
├── _core/              (19 files) — Server entry, DB, LLM, env, security
├── cognitiveArchitecture/ (19 files) — 24 cognitive layers
├── cognitiveEngine/     (5 files)  — Question understanding, personal voice
├── dcft/               (11 files) — DCFT engine (perception → cognition → awareness)
├── engines/            (28 files) — Network engine, analysis pipelines
├── knowledge/          (5 files)  — RAG system, vector store, autonomous researcher
├── routers/            (17 files) — tRPC API endpoints
├── services/           (11 files) — Data collectors (news, social, research)
├── utils/              (10 files) — Shared utilities
├── agents/             (2 files)  — Multi-agent system
├── orchestator/        (1 file)   — Engine selector
└── drizzle/            (1 file)   — Database schema
```

---

## 🔑 Core Concepts

### DCFT (Digital Consciousness Field Theory)
The foundational theory behind AmalSense. It models collective digital emotion as a **field** with three layers:

1. **Perception Layer** — Raw digital signals → structured emotion events
2. **Cognitive Layer** — Emotion events → DCF state (affective vector + resonance)
3. **Awareness Layer** — DCF state → Global Indices (GMI, CFI, HRI)

### Event Vector
A compact representation of the emotional state derived from collected data. Compresses ~15,000 tokens of news/social data into ~300-500 tokens of structured emotion data.

### 24 Cognitive Layers
AmalSense implements a 24-layer cognitive architecture inspired by human cognition:
```
Layer 1:  Perception Engine     → Raw text → affective vector
Layer 2:  Attention Filter      → Prioritize important signals
Layer 3:  Language Encoding     → Tokenize, entities, keywords
Layer 4:  Question Understanding→ Intent classification
Layer 5:  Session Memory        → Working memory per conversation
Layer 6:  Knowledge Engine      → Causal rules + expert knowledge
Layer 7:  Contextual Binding    → Cultural/temporal/situational context
Layer 8:  Prediction            → Historical comparison + forecasting
Layer 9:  Causal Inference      → Cause-effect reasoning
Layer 10: Meta Decision Engine  → Risk evaluation
Layer 11: Cognitive Answer Gate → Anti-hallucination gate
Layer 12: Consistency Check     → Contradiction prevention
Layer 13: Dialogical Consciousness → Multi-turn dialogue awareness
Layer 14: Evidence Grounding    → Ground conclusions in sources
Layer 15: Language Enforcement  → Force response language match
Layer 16: Personal Voice        → Tone adaptation per user
Layer 17: Human Cognitive Layer → Crowd cognition patterns
Layer 18: Metacognition         → Self-evaluation + confidence calibration
Layer 19: Learning Store        → Accumulative analysis memory
Layer 20: Vector Store          → Embedding storage + similarity search
Layer 21: RAG System            → Retrieval-augmented generation
Layer 22: Autonomous Researcher → Active knowledge discovery
Layer 23: Multi-Agent Sync      → Agent coordination
Layer 24: Meta Learning         → Higher-order rule adaptation
```

---

## 🔄 Data Flow: Request to Response

```
USER QUESTION
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    NETWORK ENGINE                            │
│                    (networkEngine.ts)                        │
│                                                             │
│  1. questionUnderstanding (Layer 4)                          │
│     → Detect language, classify intent, extract entities     │
│                                                             │
│  2. cognitiveControlLayer                                        │
│     → Fast question classification (regex, no LLM)              │
│     → factual / scenario / opinion / comparison / analytical │
│                                                             │
│  3. contextLockLayer                                              │
│     → Prevent context drift in follow-up questions              │
│                                                             │
│  4. cognitiveAnswerGate (Layer 11)                               │
│     → answer_directly / search_more_data / admit_ignorance      │
│     → clarify_question / defer_to_expert                        │
│                                                             │
│  5. smartQueryBuilder                                             │
│     → Build optimized search queries                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                  DATA COLLECTION                              │
│                  (unifiedDataCollector.ts)                    │
│                                                             │
│  ┌─ GDELT (global news)                                      │
│  ├─ NewsAPI (structured headlines)                           │
│  ├─ Major RSS (BBC, Reuters, CNN, AlJazeera)                │
│  ├─ Google RSS (topic/country RSS)                          │
│  ├─ WebScraper (fallback)                                   │
│  ├─ Reddit (discussions)                                    │
│  ├─ Twitter/X (real-time posts)                            │
│  ├─ Mastodon (decentralized social)                        │
│  ├─ Bluesky (social network)                                │
│  ├─ YouTube (comments)                                      │
│  ├─ Telegram (channels — MENA focus)                       │
│  ├─ Google Trends (search interest)                         │
│  └─ Wikipedia (page views)                                  │
│                                                             │
│  → deduplicationEngine                                         │
│  → layer2_attention (filter by priority)                       │
│  → layer3_encoding (encode text structure)                     │
│  → layer5_workingMemory (update session)                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              PARALLEL ANALYSIS BRANCHES                      │
│              (analysisPipeline.ts)                           │
│                                                             │
│  ┌─ graphPipeline     → Signal patterns                     │
│  ├─ emotionEngine     → Rule-based + LLM sentiment          │
│  ├─ dcftEngine (L1-3) → GMI / CFI / HRI                   │
│  ├─ ragSystem (L21)   → Knowledge retrieval                │
│  └─ predictionEngine  → Trend + forecasting (L8)            │
│                                                             │
│  → causalInference (L9)    → Cause-effect chains               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              POST-ANALYSIS INTERPRETATION                    │
│              (responsePipeline.ts)                            │
│                                                             │
│  → humanCognitiveLayer (L17) → Detect crowd cognition         │
│    (existential_anxiety / moral_outrage / denial / hope)      │
│  → evidenceGrounding (L14) → Verify against sources            │
│  → dialogicalConsciousness (L13) → Dialogue awareness          │
│  → contextualBinding (L7) → Cultural + temporal binding      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                RESPONSE GENERATION                           │
│                                                             │
│  → composeNaturalAnswer (uses LLM)                          │
│  → languageEnforcementLayer (L15) → Match user language       │
│  → consistencyCheck (L12) → Detect contradictions             │
│  → metacognition (L18) → Self-assessment + quality score      │
│  → longTermMemory → Archive for future reference              │
│  → learningStore → Save analysis record                       │
│  → knowledge enrichment → Fetch relevant research              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      RESPONSE                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Map

### `server/_core/` — Server Foundation (19 files)

| File | Purpose |
|------|---------|
| `index.ts` | Express server entry + tRPC middleware + multi-agent background loop |
| `env.ts` | Environment variables (DB URL, API keys, etc.) |
| `db.ts` | SQLite + Drizzle ORM — all DB query functions (1,343 lines) |
| `llm.ts` | Barrel re-export for the LLM module |
| `llm/types.ts` | LLM type definitions (InvokeParams, InvokeResult, etc.) |
| `llm/invoke.ts` | Low-level Manus API invoke |
| `llm/provider.ts` | Multi-provider abstraction (OpenRouter, Pollinations, Ollama, Manus) |
| `llm/sanitization.ts` | Response sanitization + retry pipeline |
| `trpc.ts` | tRPC server setup |
| `security.ts` | Security middleware (CORS, helmet, rate limiting) |
| `vite.ts` | Vite dev/prod static serving |
| `systemRouter.ts` | System health endpoints |
| `cookies.ts` | Session cookie management |
| `context.ts` | tRPC context (user auth) |
| `oauth.ts` | OAuth routes |
| `i18n.ts` | Minimal i18n shim (no-op, all strings inlined) |
| `sdk.ts`, `dataApi.ts`, `map.ts`, `notification.ts`, `apiKeys.ts`, `healthDashboard.ts` | Support services |

### `server/engines/` — Analysis Engines (28 files)

| File | Purpose |
|------|---------|
| `networkEngine.ts` | **Central orchestrator** — coordinates entire pipeline (280 lines) |
| `analysisPipeline.ts` | Pre-processing + parallel branches + causal inference |
| `responsePipeline.ts` | Post-generation quality checks + knowledge enrichment |
| `questionUnderstanding.ts` | (cognitiveEngine) — LLM-based intent classification |
| `emotionEngine.ts` | Sentiment analysis (rule-based + LLM fallback) |
| `eventVectorEngine.ts` | Event vector creation from raw data |
| `dcftEngine.ts` | (dcft/) — 3-layer DCFT: Perception → Cognitive → Awareness |
| `predictionEngine.ts` | Trend detection + scenario forecasting |
| `responseBuilder.ts` | Natural language response via LLM |
| `learningStore.ts` | Accumulative analysis memory + feedback learning |
| `multiTurnContext.ts` | Reference resolution for follow-up questions |
| `deduplicationEngine.ts` | Remove duplicate analysis results |
| `languageEnforcementLayer.ts` | Force response language |
| `metaDecisionEngine.ts` | Compact decision-state from indices |
| `confidencePropagation.ts` | Confidence scoring across engines |
| `unifiedAnalyzer.ts` | Legacy unified analysis wrapper |
| `unifiedAnalysisEngine.ts` | View-formatter on top of networkEngine |
| `analysisLifecycleManager.ts` | (moved) — was dead, now cleaned |
| `cognitiveLoop.ts` | (deleted) — superseded by networkEngine |

### `server/cognitiveArchitecture/` — Cognitive Layers (19 files)

| File | Layer | Purpose |
|------|-------|---------|
| `cognitiveControlLayer.ts` | Layer 0 | Fast question classification (regex) |
| `layer2_attention.ts` | Layer 2 | Signal filtering by credibility/recency/reach |
| `layer3_encoding.ts` | Layer 3 | Text → encoded structure (tokens, entities, sentiment) |
| `layer5_workingMemory.ts` | Layer 5 | Per-session working memory |
| `cognitiveAnswerGate.ts` | Layer 11 | Answer/Clarify/Admit ignorance gate |
| `cognitiveConsistencyCheck.ts` | Layer 12 | Contradiction detection |
| `dialogicalConsciousness.ts` | Layer 13 | Multi-turn dialogue awareness |
| `evidenceGrounding.ts` | Layer 14 | Ground conclusions in evidence |
| `contextualBinding.ts` | Layer 7 | Cultural/temporal/situational binding |
| `causalInference.ts` | Layer 9 | Cause-effect reasoning |
| `metacognition.ts` | Layer 18 | Self-evaluation + confidence calibration |
| `humanCognitiveLayer.ts` | Layer 17 | Crowd cognition patterns |
| `contextLockLayer.ts` | — | Prevent context drift |
| `calibrationLayer.ts` | — | Interactive user surveys |
| `feedbackLoop.ts` | — | Feedback collection |
| `metaLearning.ts` | Layer 24 | Higher-order rule adaptation |
| `longTermMemory.ts` | — | Cross-session memory store |
| `smartQueryBuilder.ts` | — | Build optimized search queries |

### `server/routers/` — tRPC API (17 files)

| Router | Prefix | Endpoints |
|--------|--------|-----------|
| `systemRouter` | `system` | Health check |
| `alertsRouter` | `alerts` | CRUD alerts |
| `notificationRouter` | `notifications` | Notification settings |
| `searchRouter` | `search` | Unified search via data collector |
| `unifiedEngineRouter` | `engine` | Map, weather, country detail, analysis |
| `unifiedRouters` | `unified` | Question analysis, batch, pipeline info |
| `explainabilityRouter` | `explainability` | Response explainability |
| `predictionRouter` | `prediction` | Predictions |
| `historicalEventsRouter` | `historicalEvents` | Historical event analysis |
| `agentRouter` | `agent` | Multi-agent system |
| `chatAnalysisRouter` | `chatAnalysis` | Chat analysis |
| `graphPipelineRouter` | `graphPipeline` | Graph pipeline |
| `pipelineRouter` | `pipeline` | Pipeline control |
| `realtimeDataRouter` | `realtimeData` | Real-time data |
| `newFeaturesRouter` | `newFeatures` | Feature flags |
| `calibrationRouter` | `calibration` | Interactive surveys |
| `knowledgeRouter` | `knowledge` | Research/PubMed/arXiv search |

All routers are backed by real database queries or engine calls — **zero stubs**.

### `server/services/` — Data Collection (11 files)

| Service | Type | Source |
|---------|------|--------|
| `unifiedDataCollector.ts` | Orchestrator | Coordinates all 13 sources |
| `gdeltService.ts` | News | GDELT Project (strongest free news API) |
| `newsApiService.ts` | News | NewsAPI.org (structured headlines) |
| `majorNewsRssService.ts` | News | BBC, Reuters, CNN, Al Jazeera RSS |
| `googleRssService.ts` | News | Google News RSS by topic/country |
| `gnewsService.ts` | News | GNews API |
| `newsService.ts` | News | News data fetcher |
| `webScraperService.ts` | News | Google News scrape fallback |
| `socialMediaService.ts` | Social | Reddit, Mastodon, Bluesky, YouTube, Telegram |
| `twitterService.ts` | Social | Twitter/X API |
| `researchService.ts` | Knowledge | PubMed, arXiv, Open Library |
| `googleTrendsService.ts` | Attention | Google Trends RSS |
| `wikipediaService.ts` | Attention | Wikipedia page view stats |
| `economicDataService.ts` | Economic | Exchange rates, commodities |

### `server/dcft/` — DCFT Engine (11 files)

| File | Purpose |
|------|---------|
| `dcftEngine.ts` | Main DCFT engine — 3-layer analysis |
| `perceptionLayer.ts` | Raw signals → structured emotion events |
| `cognitiveLayer.ts` | Emotion events → DCF state |
| `awarenessLayer.ts` | DCF state → GMI / CFI / HRI |
| `affectiveVector.ts` | Affective vector calculations |
| `influenceWeight.ts` | Source influence weighting |
| `temporalDecay.ts` | Time-based decay functions |
| `feedbackLoop.ts` | DCFT feedback collection |
| `metaLearning.ts` | DCFT vocabulary learning |
| `vocabularyAdapter.ts` | Regional dialect adaptation |

### `server/knowledge/` — Knowledge Core (5 files)

| File | Purpose |
|------|---------|
| `ragSystem.ts` | Retrieval-augmented generation |
| `vectorStore.ts` | Vector storage + similarity search |
| `embeddings.ts` | Text embedding generation |
| `knowledgeBase.ts` | Layer 6 — Expert rules + causal relations |
| `autonomousResearcher.ts` | Background research via PubMed/arXiv |

---

## 📡 Data Sources

### 13 Parallel Sources

```
┌─────────────────────────────────────────────────────────────┐
│                  unifiedDataCollector.ts                      │
│                                                             │
│  Promise.allSettled([                                        │
│    collectFromGDELT(query),         ← GDELT Project         │
│    collectFromNewsAPI(query),       ← NewsAPI.org           │
│    collectFromMajorRSS(query),      ← BBC, Reuters, CNN...  │
│    collectFromGoogleRSS(query),     ← Google News RSS       │
│    collectFromScraper(query),       ← Web scrape fallback   │
│    collectFromReddit(query),        ← Reddit discussions    │
│    collectFromTwitter(query),       ← Twitter/X posts       │
│    collectFromMastodon(query),      ← Mastodon social       │
│    collectFromBluesky(query),       ← Bluesky social        │
│    collectFromYouTube(query),       ← YouTube comments      │
│    collectFromTelegram(query),      ← Telegram channels     │
│    collectFromTrends(query),        ← Google Trends         │
│    collectFromWikipedia(query),     ← Wikipedia page views  │
│  ])                                                         │
│                                                             │
│  → deduplication → cache (15 min TTL)                      │
│  → RawDataItem[] to networkEngine                           │
└─────────────────────────────────────────────────────────────┘
```

### Source Coverage

| Source | Type | Coverage | API Key? |
|--------|------|----------|---------|
| GDELT | News | Global, millions/day | No |
| NewsAPI | News | 50k+ sources | Yes (optional) |
| Major RSS | News | BBC, Reuters, CNN, AlJazeera | No |
| Reddit | Social | Subreddits by topic | No |
| Twitter/X | Social | Real-time posts | Yes (Manus API) |
| YouTube | Social | Video comments | No |
| Telegram | Social | MENA channels | No |
| Google Trends | Attention | Search interest | No |
| Wikipedia | Attention | Page view stats | No |
| PubMed | Research | Medical papers | No |
| arXiv | Research | Physics, CS, AI | No |
| Open Library | Knowledge | Books catalog | No |

---

## 🌐 API Layer (17 tRPC Routers)

### Main Router (`routers.ts`)
```typescript
export const appRouter = router({
  // Live routers
  system, alerts, notifications, newFeatures, search,
  engine, historicalEvents, agent, realtimeData,
  pipeline, chatAnalysis, graphPipeline, prediction,
  unified, explainability,
  
  // DB-backed routers (no longer stubs)
  conversations, export, payments, registration,
  subscription, support, telegram, topics,
  topicAlerts, metaLearning, ai,
  
  // Interactive
  auth, userStatistics, quickAnalysis, health,
  calibration, knowledge
});
```

### Unified Engine Router (`unifiedEngineRouter.ts`)
This is the primary data API used by the frontend:

| Endpoint | Input | Returns |
|----------|-------|---------|
| `getMapData` | — | All countries with GMI/CFI/HRI |
| `getWeather` | countryCode + countryName | Detailed emotion breakdown |
| `getCountryDetail` | countryCode + countryName | Full country analysis + news |
| `getSmartAnalysis` | query + language | AI-powered answer |
| `getGlobalMood` | — | Global mood summary |
| `getEngineStats` | — | System performance stats |
| `getLearningState` | — | Learning system stats |
| `getCountryAnalysis` | countryCode | Full country analysis (for map click) |
| `getQuickCountryAnalysis` | countryCode | Lightweight indices (for map coloring) |
| `getAllCountriesMeta` | — | Country metadata list |

---

## 🗄️ Database Schema

**Database:** SQLite (via `better-sqlite3` + Drizzle ORM)  
**Optimizations:** WAL mode, 20MB cache, memory temp tables, foreign keys ON

### Tables (20+)

| Table | Purpose |
|-------|---------|
| `users` | User accounts + roles |
| `emotionIndices` | Global emotion snapshots |
| `emotionAnalyses` | Individual text analyses |
| `countryEmotionIndices` | Per-country indices |
| `countryEmotionAnalyses` | Per-country analyses |
| `apiKeys` | API key management |
| `paymentRecords` | Payment tracking |
| `customAlerts` | User-defined alerts |
| `userRegistrations` | Email/password auth |
| `passwordResetTokens` | Password recovery |
| `classifiedAnalyses` | Classified content analysis |
| `followedTopics` | Topic subscriptions |
| `topicAlerts` | Topic-based notifications |
| `responseFeedback` | User response ratings |
| `predictions` | Prediction records |
| `predictionSnapshots` | Prediction snapshots |
| `userProfiles` | User preference profiles |
| `learningPatterns` | Learned emotion patterns |
| `keywordLearning` | Learned keyword weights |
| `selfEvaluations` | System self-assessment |
| `analysisSessions` | Analysis session logs |

---

## ⚡ Key Design Decisions

### 1. Single Orchestrator Pattern
`networkEngine.ts` is deliberately kept thin (~280 lines). It delegates to:
- `analysisPipeline.ts` — Pre-processing + parallel execution
- `responsePipeline.ts` — Post-generation quality checks

This avoids the "God Object" problem.

### 2. Unified Data Collection
All 13 data sources go through `unifiedDataCollector.ts`. There is no direct call to individual services from analysis code. This ensures:
- Consistent error handling
- Centralized caching (15 min TTL)
- Single deduplication point

### 3. GMI/CFI/HRI as Shared Module
`utils/emotionIndices.ts` is the single source of truth for index calculation. Previously duplicated across 3 engines, now unified.

### 4. No Arabic in Code
The entire server (137 files) has zero Arabic characters and zero `t('auto.xxx', 'ar')` calls. All strings are inline English.

### 5. Multi-Provider LLM
The LLM system tries providers in order:
1. OpenRouter (fastest)
2. Pollinations (free hosted)
3. Ollama (local)
4. Manus API (paid fallback)

### 6. tRPC for API
All communication is via tRPC, providing end-to-end type safety between frontend and backend.

### 7. 24 Cognitive Layers
Inspired by human cognition, each layer handles a specific aspect of understanding and response generation. Not all layers are directly wired into the pipeline — some serve as reference architecture.

---

## 🚀 Quick Start

```bash
# Install
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
npm run db:push

# Development
npm run dev

# Production
npm run build
npm start
```

### Required Environment Variables
```env
DATABASE_URL=sqlite.db
JWT_SECRET=your-secret-key
LLM_PROVIDER=free_hosted        # or openrouter, ollama, manus
NEWS_API_KEY=your-key           # Optional
OPENROUTER_API_KEY=your-key     # Optional
TELEGRAM_BOT_TOKEN=your-token   # Optional
```

---

## 🧪 Testing

```bash
npm test          # Run tests
npm run check    # TypeScript check
```

Current test coverage: ~20 tests (being expanded)

---

## 🤝 For AI Agents

If you are an AI agent reading this document, here is how to understand the codebase:

1. **Start with `networkEngine.ts`** — this is the brain. Every request flows through here.
2. **Trace to `analysisPipeline.ts`** — data processing + analysis branches
3. **Trace to `responsePipeline.ts`** — quality checks + knowledge enrichment
4. **Data comes from `unifiedDataCollector.ts`** — 13 sources in parallel
5. **Results computed by `dcftEngine.ts`** — GMI/CFI/HRI indices
6. **Exposed via `routers.ts`** — 17 tRPC routers

Pattern: **Orchestrator → Pipeline → Parallel Branches → Quality Checks → Response**

---

*Generated by AmalSense — 2026*