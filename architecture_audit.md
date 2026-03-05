# Architecture Audit - Current State

## Current Data Flow (3 Separate Engines)

### Engine 1: Unified Pipeline (SmartAnalysis)
- **Entry**: `unified.analyzeQuestion` → `executePipelineWithStorage` → `unifiedNetworkPipeline`
- **Data**: Fetches from GNews, NewsAPI, Reddit, Mastodon, Bluesky (Layer 2)
- **LLM**: Groq via smartLLM (Layer 1, 16, 18, suggestions)
- **Output**: Full response with confidence, emotions, suggestions
- **Used by**: SmartAnalysis.tsx

### Engine 2: Country News Analyzer (Map/Weather)
- **Entry**: `map.getAllCountriesEmotions` / `map.getCountryEmotions` → `countryNewsAnalyzer`
- **Data**: Fetches from Google RSS, NewsAPI
- **LLM**: Groq via smartLLM (sentiment analysis)
- **Output**: GMI/CFI/HRI indices, categorized news, trending topics
- **Used by**: Home.tsx (map), EmotionalWeather.tsx, Weather.tsx, CountryResults.tsx

### Engine 3: Topic Analyzer (TopicAnalysis)
- **Entry**: `topic.analyzeTopicInCountry` → `topicAnalyzer`
- **Data**: Fetches from newsDataFetcher, socialMediaService
- **LLM**: None (uses realTextAnalyzer for sentiment)
- **Output**: Topic analysis with demographics, regions, temporal data
- **Used by**: TopicAnalysisResults.tsx

## Problems
1. **3 separate data fetching paths** - each engine fetches news independently
2. **No Event Vector** - raw news sent to LLM (token waste)
3. **No shared cache** - each engine has its own cache
4. **Inconsistent analysis** - different engines produce different quality results
5. **EventVector model exists but is NOT connected** to any active pipeline

## Target Architecture: Unified Engine + Event Vector

### Single Flow:
1. **Data Collection Layer** (shared) → Fetch from all sources once
2. **Event Vector Compression** → Convert raw data to EventVector format (~500 tokens)
3. **Unified Analysis Engine** → Single LLM call with EventVector
4. **Result Router** → Same data, different views per page:
   - Map → colors (GMI/CFI/HRI)
   - Weather → emotional forecast
   - SmartAnalysis → full response
   - CountryResults → categorized news + indices
   - TopicAnalysis → topic-specific analysis
