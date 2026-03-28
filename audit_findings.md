# Audit: Components NOT Connected to Unified Engine

## CRITICAL: Pages using OLD engines (need migration)

### 1. Dashboard.tsx - Uses OLD emotion router
- `trpc.emotion.getLatestIndices.useQuery()` → OLD: reads from DB, falls back to `unifiedDataService.getGlobalMood()`
- `trpc.emotion.getHistoricalIndices.useQuery()` → OLD: reads from DB `countryTimeSeriesGenerator`
- `trpc.dashboard.getSourceHealth.useQuery()` → OLD: `dashboardRouter`
- `useAnalysisData()` hook → OLD: uses `trpc.unified.analyzeQuestion` + `trpc.dashboard.getMetrics`

### 2. Home.tsx - Partially OLD
- `trpc.emotion.getHistoricalIndices.useQuery()` → OLD: same as Dashboard

### 3. EnterpriseDashboard.tsx - Uses OLD emotion router
- `trpc.emotion.getLatestIndices.useQuery()` → OLD

### 4. LiveAnalysis.tsx - Uses OLD realtime router
- `trpc.realtime.getSourcesStatus.useQuery()` → OLD: `realtimeDataRouter`
- `trpc.realtime.getCountryNewsAnalysis.useQuery()` → OLD
- `trpc.realtime.analyzeWithAI.useMutation()` → OLD

### 5. NewFeaturesDashboard.tsx - Uses OLD newFeatures router
- `trpc.newFeatures.getDailyWeather.useQuery()` → OLD: `newFeaturesRouter`
- `trpc.newFeatures.getAvailableQuestions.useQuery()` → OLD
- `trpc.newFeatures.answerQuestion.useQuery()` → OLD
- `trpc.newFeatures.getQuickExplanation.useQuery()` → OLD
- `trpc.newFeatures.getAggregatedMetrics.useQuery()` → OLD

### 6. ComparisonBound.tsx - Uses OLD comparison router
- `trpc.comparison.compareCountries.useQuery()` → OLD: not using engine.compareDCFT
- `trpc.comparison.temporalComparison.useQuery()` → OLD
- `trpc.comparison.whatIfScenario.useQuery()` → OLD

### 7. MapsBound.tsx - Uses OLD maps router
- `trpc.maps.getGeographicData.useQuery()` → OLD: `mapDataRouter`
- `trpc.maps.getRegionalTrends.useQuery()` → OLD
- `trpc.maps.getHotspots.useQuery()` → OLD

### 8. TopicAnalysisResults.tsx - Uses OLD topic router
- `trpc.topic.analyzeTopicInCountry.useMutation()` → OLD

### 9. Reports.tsx - Uses OLD classification router
- `trpc.classification.getDomainStats.useQuery()` → OLD
- `trpc.classification.getSensitivityStats.useQuery()` → OLD
- `trpc.classification.getAllAnalyses.useQuery()` → OLD

### 10. MetacognitionDashboard.tsx - Uses OLD metacognition router
- `trpc.metacognition.getSystemHealth.useQuery()` → OLD
- `trpc.metacognition.getRecentErrors.useQuery()` → OLD
- `trpc.metacognition.getRecommendations.useQuery()` → OLD

### 11. scheduledAnalysis.ts - Uses OLD aiSentimentAnalyzer
- `analyzeTextsWithAI` from `./aiSentimentAnalyzer` → OLD: not using networkEngine

### 12. analysisDataRouter.ts - Generates FAKE data with Math.random()
- `getDCFTVisualization` → returns random data
- `getEventVectors` → returns random data
- `getTopicAnalysis` → returns random data

### 13. Connected Components using OLD routers
- `DCFTVisualizationConnected.tsx` → `trpc.analysisData.getDCFTVisualization` (FAKE data)
- `EventVectorDisplayConnected.tsx` → `trpc.analysisData.getEventVectors` (FAKE data)
- `TopicAnalysisDisplayConnected.tsx` → `trpc.analysisData.getTopicAnalysis` (FAKE data)
- `RegionalHeatMapConnected.tsx` → `trpc.mapData.getRegionalHeatMapData` (OLD)
- `WorldMapConnected.tsx` → `trpc.mapData.getWorldMapData` (OLD)
- `ResponseExplainabilityConnected.tsx` → `trpc.explainability` (OLD)
- `ResponseFeedbackConnected.tsx` → `trpc.explainability` (OLD)

## ALREADY CONNECTED to Unified Engine (engine.*)
- SmartAnalysis.tsx ✅
- Chat.tsx ✅
- EngineDashboard.tsx ✅
- Theory.tsx ✅
- CompareCountries.tsx ✅
- CountryResults.tsx ✅
- Weather.tsx ✅
- EmotionalWeather.tsx ✅
- PredictionsDashboard.tsx ✅
- Home.tsx (partially - getGlobalMood + getMapData ✅, but historicalIndices ❌)

## STANDALONE (don't need engine - utility pages)
- FAQ, Terms, Privacy, Pricing, Contact, About, HowItWorks, UseCases, Login, Register, Profile, Settings, NotFound
