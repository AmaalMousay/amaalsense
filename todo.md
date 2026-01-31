# AmalSense Engine - Project TODO

## Phase 1: Database & Backend Setup
- [x] Define database schema for emotion indices (GMI, CFI, HRI)
- [x] Create emotion analysis simulation engine
- [x] Implement tRPC procedures for emotion analysis
- [x] Setup historical data storage and retrieval

## Phase 2: Landing Page
- [x] Create cosmic aesthetic design with gradient background
- [x] Implement star field animation
- [x] Design three main index cards (GMI, CFI, HRI)
- [x] Add project vision section
- [x] Implement smooth scrolling and navigation

## Phase 3: Emotion Analysis Simulator
- [x] Build news headline input interface
- [x] Implement emotion vector calculation (joy, fear, anger, sadness, hope, curiosity)
- [x] Create real-time emotion analysis display
- [x] Add emotion vector visualization

## Phase 4: Interactive Dashboard
- [x] Create dashboard layout with sidebar navigation
- [x] Implement real-time index charts (Line Charts)
- [x] Add Gauge Charts for current index values
- [x] Build historical data filtering system
- [x] Implement time-based data visualization

## Phase 5: Documentation & Use Cases
- [ ] Create "How It Works" section explaining Transformers + VADER
- [ ] Build Use Cases page with B2G/NGOs, Media, Enterprise examples
- [ ] Create API Documentation section
- [ ] Add developer integration examples

## Phase 6: Advanced Features
- [ ] Implement owner notifications for significant changes
- [ ] Add historical data analysis and comparison
- [ ] Create automated alert system for index changes
- [ ] Build report generation system

## Phase 7: Deployment
- [ ] Test all features across browsers
- [ ] Optimize performance
- [ ] Create checkpoint and deploy
- [ ] Provide permanent public link

## Phase 8: World Map Feature (NEW)
- [x] Add database schema for country emotion data
- [x] Create country emotion simulation engine
- [x] Build interactive world map component
- [x] Create map visualization page with country details
- [x] Implement color coding based on emotion indices
- [x] Add country selection and detail view


## Phase 9: Time-Series System for World Map (NEW)
- [x] Add database functions for historical country emotion data
- [x] Create time-range data generation for countries
- [x] Build historical charts component for countries
- [x] Add time slider/selector on map page
- [x] Implement time-based map updates
- [x] Create comparison view for different time periods
- [x] Add animation for time progression


## Phase 10: Real Data Integration (NEW)
- [x] Create news API integration service (NewsAPI, GNews)
- [x] Build AI-powered sentiment analysis using LLM
- [x] Implement real-time news fetching by country/region
- [x] Create emotion extraction from real news headlines
- [x] Update analyzer page to use real data
- [x] Add data source indicators in UI
- [x] Implement caching for API responses
- [x] Add fallback to simulation when API unavailable


## Phase 11: Social Media Integration (NEW)
- [x] Create Reddit API integration service
- [x] Create Mastodon API integration service
- [x] Create Bluesky API integration service
- [x] Create YouTube Comments API integration service
- [x] Create Telegram public channels integration service
- [x] Add unified social media data fetcher
- [x] Update UI to display multiple data sources
- [x] Add source selection and filtering
- [x] Create tests for social media services


## Phase 12: Scientific Paper Features Implementation (NEW)

### Mathematical Formulas
- [x] Implement D(t) = Σ [Ei × Wi × ΔTi] formula
- [x] Implement ERE (Emotional Resonance Engine) with RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
- [x] Add influence weighting (Wi) based on reach/virality
- [x] Add temporal decay (λΔt) for emotion persistence

### Advanced Color System for Map
- [x] Blue = calm/reflection
- [x] Red = anger/activism
- [x] Yellow = optimism/creativity
- [x] Green = balance/collective harmony
- [x] Implement dynamic color transitions

### Early Warning System
- [x] Create alert thresholds for stability
- [x] Implement psychological stress zone detection
- [x] Add owner notifications for critical changes
- [x] Create alert dashboard

### Theory Page (DCFT)
- [x] Create comprehensive DCFT explanation page
- [x] Add mathematical formulas with visualizations
- [x] Explain three-layer architecture
- [x] Add philosophical foundation section

### Emotional Weather System
- [x] Create emotion forecasting algorithm
- [x] Build weather-style prediction interface
- [x] Add trend analysis and projections
- [x] Create "emotional climate" visualization

### About Page
- [x] Add author information (Amaal Radwan)
- [x] Include scientific paper reference
- [x] Add academic references section
- [x] Create contact information section


## Phase 13: Subscription & Pricing System (NEW)

### Database & Backend
- [x] Add subscription tier to user schema (free, pro, enterprise, government)
- [x] Create usage tracking table for API calls and analyses
- [x] Add subscription limits configuration
- [x] Create usage checking middleware

### Pricing Page
- [x] Create Pricing page with 4 tiers display
- [x] Add feature comparison table
- [x] Add CTA buttons for each tier
- [x] Style with cosmic theme

### Usage Limits System
- [x] Implement daily analysis limit checking
- [x] Add API rate limiting per tier
- [x] Create usage dashboard for users
- [x] Add upgrade prompts when limits reached

### Enterprise Contact
- [x] Create Contact/Enterprise page
- [x] Add contact form for enterprise inquiries
- [x] Implement owner notification for new leads
- [x] Add demo request functionality



## Phase 14: Zenodo Integration
- [x] Update About page with Zenodo publication link
- [x] Add DOI citation information
- [x] Update publication date to October 9, 2025


## Phase 15: Platform Improvements (NEW)

### User Experience (UX)
- [ ] Add onboarding tour for new users
- [ ] Display remaining usage quota in UI
- [ ] Simplify navigation with sidebar menu

### Credibility & Trust
- [x] Create "How It Works" page with animations
- [x] Add Case Studies section with real examples
- [x] Add Testimonials section

### Technical Features
- [x] Implement PDF export for reports
- [x] Add email notifications for alerts

### Marketing & Growth
- [x] Create Blog page
- [x] Add Newsletter signup
- [x] Create FAQ page

### Arabic Language Support
- [x] Add full Arabic translation
- [x] Implement RTL layout support
- [x] Add language switcher


## Phase 16: Multi-Language Support (NEW)
- [x] Add French translation (fr.ts)
- [x] Add German translation (de.ts)
- [x] Add Russian translation (ru.ts)
- [x] Add Spanish translation (es.ts)
- [x] Add Chinese translation (zh.ts)
- [x] Update language switcher component
- [x] Add appropriate fonts for each language
- [x] Update i18n index file


## Phase 17: Author Information Update (NEW)
- [x] Update About page with author full name: Amaal Radwan Bashir
- [x] Add location: Sabha, Libya


## Phase 18: Security Enhancements (NEW)
- [x] Add Rate Limiting middleware
- [x] Add Security Headers (CSP, X-Frame-Options, etc.)
- [x] Add Input Validation with Zod schemas
- [x] Add request logging for security audit
- [x] Add IP blocking for suspicious activity

## Phase 19: Real News Integration (NEW)
- [x] Configure NewsAPI key
- [x] Update newsService to use NewsAPI as primary source
- [x] Test real news fetching

## Phase 20: Social Media Integration (NEW)
- [x] Update socialMediaService for real data
- [x] Connect Reddit API (public endpoints)
- [x] Connect YouTube Data API (with Invidious fallback)
- [x] Enable Mastodon public API (no key needed)
- [x] Enable Bluesky public API (no key needed)
- [x] Connect Telegram public channels
- [x] Test all social media sources

## Phase 21: YouTube API Integration (NEW)
- [x] Configure YouTube Data API v3 key
- [x] Test YouTube API connection

## Phase 22: Analytics Storage System (NEW)
- [x] Create database tables for storing analyses
- [x] Create service for saving and retrieving analyses
- [x] Update routers to auto-save analyses
- [x] Create historical trends page
- [x] Add charts for trend visualization

## Phase 23: Navigation & UI Improvements (NEW)
- [x] Add Trends link to main navigation
- [x] Add abbreviations (GMI, CFI, HRI) to home page index cards
- [x] Add automatic analysis scheduling (cron job)
- [x] Add data export as CSV/JSON

## Phase 24: User Experience & Admin Features (NEW)

### Onboarding Tour
- [x] Create tour component with step-by-step guide
- [x] Add tour triggers for new users
- [x] Implement tour progress tracking
- [x] Add skip and restart tour options

### Admin Dashboard
- [x] Create admin-only route and page
- [x] Add user management section
- [x] Add usage statistics display
- [x] Add system health monitoring
- [x] Add scheduler control panel

### Email Notifications
- [x] Create email notification service
- [x] Add daily/weekly report templates
- [x] Add subscriber management
- [x] Create notification settings pages settings

## Phase 25: Fix Language Switching (BUG FIX)
- [x] Update Home page to use translations (useI18n hook)
- [x] Update other pages to use translations
- [x] Test language switching functionality

## Phase 26: Full Translation Implementation (NEW)
- [x] Add automatic browser language detection
- [ ] Apply translations to Dashboard page
- [ ] Apply translations to Analyzer page
- [ ] Apply translations to Map page
- [ ] Apply translations to Live page
- [ ] Apply translations to Social page
- [ ] Apply translations to Weather page
- [ ] Apply translations to About page
- [ ] Apply translations to Pricing page
- [ ] Apply translations to Contact page
- [ ] Test all pages with different languages

## Phase 27: PayPal Payment Integration (NEW)
- [x] Create PayPal payment button component
- [x] Update Pricing page with PayPal buttons
- [x] Add subscription options (Pro, Enterprise)
- [x] Test payment flow (PayPal.me integration working)

## Phase 28: Payment Confirmation & Alternative Payment Methods (NEW)

### Payment Confirmation System
- [x] Create payment records table in database
- [x] Create payment confirmation form for users
- [x] Add payment status tracking (pending, confirmed, rejected)
- [x] Send notification to owner when payment is submitted

### Owner Notifications
- [x] Create email notification for new payments
- [x] Add payment details in notification (amount, plan, user info)
- [x] Create admin panel section for payment management

### Alternative Payment Methods
- [x] Research available payment methods for Libya
- [x] Add PayPal payment option
- [x] Add Bank Transfer option with account details
- [x] Add Western Union option with receiver details
- [x] Add MoneyGram option with receiver details
- [x] Add Cryptocurrency (USDT) option
- [x] Create Checkout page with all payment methods
- [x] Update Pricing page with "More Payment Options" button

## Phase 29: Payment Management & Simplification (NEW)
- [x] Add payment management section to Admin page
- [x] Show pending payments list with confirm/reject buttons
- [x] Show payment history with status
- [x] Remove all payment methods except PayPal
- [x] Simplify Checkout page for PayPal only

## Phase 30: Unified Color System (NEW)

### Color Palette (Psychological Meaning)
- [x] Red (#E63946) = Anger / Tension / Crisis
- [x] Orange (#F4A261) = Fear / Anxiety
- [x] Yellow (#E9C46A) = Curiosity / Uncertainty
- [x] Green (#2A9D8F) = Hope / Balance / Resilience
- [x] Blue (#457B9D) = Calm / Stability
- [x] Purple (#8D5CF6) = Sadness / Grief
- [x] Gray (#6C757D) = Neutral

### Implementation Tasks
- [x] Update index.css with new color variables
- [x] Update Analyzer page emotion colors
- [x] Update Map page country colors (WorldMap component)
- [x] Update Weather page indicators
- [x] Update Dashboard charts
- [x] Update GMI indicator (red→yellow→green)
- [x] Update CFI indicator (blue→orange→red)
- [x] Update HRI indicator (gray→light green→dark green)
- [x] Create shared emotionColors.ts for consistency
- [x] Update IndexCard component with indexType
- [x] Update CountryHistoricalChart colors

## Phase 31: Dynamic Indicators & UI Improvements (NEW)

### Dynamic Stock-like Indicators
- [x] Create real-time updating indicators like stock market charts
- [x] Add mini sparkline charts showing trend (up/down)
- [x] Add percentage change indicator (+/-%)
- [x] Add animated value transitions
- [x] Show historical mini-chart in each indicator card

### Unified Color Legend
- [x] Create EmotionLegend component
- [x] Add legend to footer of main pages
- [x] Show color meanings (anger, fear, hope, etc.)

### Multi-language Support
- [x] Apply translations to Analyzer page
- [ ] Apply translations to Map page
- [ ] Apply translations to Weather page
- [ ] Apply translations to About page
- [ ] Apply translations to Pricing page

### Dark/Light Mode Toggle
- [x] Add theme toggle button to navbar
- [x] Create light mode color scheme
- [x] Persist theme preference in localStorage
- [x] Ensure emotion colors remain consistent in both modes

## Phase 32: Rebranding (NEW)

### Name Changes
- [x] Change AmalSense to AmalSense in all files
- [x] Change أمل رضوان to أمال رضوان in all files
- [x] Update footer copyright text

### New Logo
- [x] Design unique logo for the platform (brain-wave design)
- [x] Create Logo component with LogoIcon
- [x] Apply logo to all pages (navbar, footer, etc.)
- [x] Replace all Sparkles icons with Brain/LogoIcon

## Phase 33: Pre-Launch Completion (COMPLETED)

### Arabic Translation Completion
- [x] Complete Map page Arabic translation
- [x] Complete Weather page Arabic translation
- [ ] Complete About page Arabic translation
- [ ] Complete Pricing page Arabic translation
- [ ] Complete Checkout page Arabic translation

### Legal Pages
- [x] Create Terms of Service page
- [x] Create Privacy Policy page
- [x] Add routes to App.tsx

### Branding & SEO
- [x] Update favicon with new logo
- [x] Add SEO meta tags (title, description, og:image)
- [x] Add Open Graph and Twitter card tags
- [x] Create apple-touch-icon and PWA icons

## Phase 34: Footer Links & Final Polish (COMPLETED)
- [x] Add Terms of Service link to all footers
- [x] Add Privacy Policy link to all footers
- [x] Add Legal section to footer with translations in all languages
- [x] Test footer links on all pages


## Phase 35: Full DCFT Algorithm Implementation (NEW)

### Core Algorithm Files
- [x] Create dcftEngine.ts - Main DCFT orchestrator
- [x] Create perceptionLayer.ts - Layer 1: Input processing
- [x] Create cognitiveLayer.ts - Layer 2: DCF calculations
- [x] Create awarenessLayer.ts - Layer 3: Output generation

### Mathematical Formulas
- [x] Implement D(t) = Σ [Ei × Wi × ΔTi] formula
- [x] Implement RI(e,t) = Σ (AVi × Wi × e^(-λΔt)) formula
- [x] Create affectiveVector.ts for AV calculations
- [x] Create temporalDecay.ts for λΔt decay functions
- [x] Create influenceWeight.ts for Wi weighting

### Advanced Features
- [x] Implement collective emotional phase detection
- [x] Add threshold-based alerts for emotional phases
- [x] Create emotional resonance tracking
- [ ] Add meta-learning for vocabulary adaptation

### Integration
- [x] Replace current simple analysis with DCFT engine
- [x] Update analyzer page to use DCFT
- [x] Update map page to use DCFT calculations
- [x] Update weather predictions with DCFT

### Testing
- [x] Create unit tests for DCFT engine
- [x] Test temporal decay calculations
- [x] Test influence weighting accuracy
- [x] Validate output indices (GMI, CFI, HRI)


## Phase 36: Ensure All Data Flows Through DCFT Formulas

### Data Flow Updates
- [x] Update emotion.analyzeHeadline to use DCFT engine
- [x] Update realtime.analyzeWithAI to use DCFT engine
- [x] Update realtime.getCountryNewsAnalysis to use DCFT engine
- [x] Update realtime.getGlobalNewsAnalysis to use DCFT engine
- [x] Update map calculations to use DCFT engine
- [x] Verify all indices (GMI, CFI, HRI) are calculated from D(t) and RI(e,t)


## Phase 37: Meta-Learning System Implementation

### Core Components
- [x] Create metaLearning.ts - Main meta-learning engine
- [x] Create vocabularyAdapter.ts - Dynamic vocabulary adaptation
- [x] Create feedbackLoop.ts - User feedback integration
- [x] Create patternRecognition.ts - Emerging pattern detection (integrated in vocabularyAdapter)

### Features
- [x] Implement vocabulary weight adjustment based on accuracy
- [x] Add new emotion keywords discovery from context
- [x] Create regional/cultural vocabulary adaptation
- [x] Implement temporal trend learning
- [x] Add confidence calibration system

### Database
- [x] Create vocabulary_weights table for learned weights (in-memory for now)
- [x] Create feedback_history table for user corrections (in-memory for now)
- [x] Create learned_patterns table for discovered patterns (in-memory for now)

### Integration
- [x] Connect meta-learning to DCFT perception layer
- [x] Update emotion analysis to use learned weights
- [x] Add feedback API endpoints


## Phase 38: Hybrid DCFT-AI Analysis Engine (70/30)

### Core Implementation
- [x] Create hybridAnalyzer.ts - Main hybrid analysis engine
- [x] Implement weighted fusion: D_hybrid = 0.7×DCFT + 0.3×AI
- [x] Add confidence-based weight adjustment
- [x] Create fallback mechanism when AI unavailable

### Integration
- [x] Update emotion.analyzeHeadline to use hybrid engine
- [x] Update realtime analysis to use hybrid engine
- [x] Update news analysis to use hybrid engine
- [x] Ensure DCFT is always the primary analyzer

### Testing
- [x] Create unit tests for hybrid analyzer
- [x] Test fallback to DCFT-only mode
- [x] Verify 70/30 weighting is applied correctly


## Phase 39: Advanced Topic Analysis (Analyzer Page Enhancement)

### Backend Updates
- [x] Create topicAnalysis procedure for searching topics in specific countries
- [x] Add demographic analysis (age groups: youth, middle-age, seniors)
- [x] Add regional analysis within countries (cities/regions)
- [x] Add support vs opposition percentage calculation
- [x] Create heat map data for regional sentiment

### Frontend Updates (Analyzer Page)
- [x] Add country selector dropdown
- [x] Add topic/keyword search input
- [x] Add time period selector
- [x] Add demographic breakdown display (by age group)
- [x] Add regional breakdown display (by region/city)
- [x] Add support vs opposition visualization
- [ ] Add regional heat map component (future enhancement)

### Data Structure
- [x] Define age group categories (18-35, 35-55, 55+)
- [x] Define regional data structure per country
- [x] Create sentiment distribution by demographic


## Phase 40: Interactive Heat Map with Google Maps

### Heat Map Component
- [x] Create RegionalHeatMap.tsx component using Google Maps
- [x] Add heat map layer for sentiment visualization
- [x] Color regions based on support/opposition (green=support, red=opposition)
- [x] Add interactive markers for each region
- [x] Show region details on click/hover

### Analysis Results Page
- [x] Create TopicAnalysisResults.tsx page
- [x] Include interactive heat map at top
- [x] Display demographic analysis (age groups)
- [x] Display regional analysis table
- [x] Show support vs opposition percentages
- [x] Display DCFT indices (GMI, CFI, HRI)

### Navigation Flow
- [x] Update Analyzer page with "Start Analysis" button
- [x] Navigate to results page with analysis data
- [x] Add back button to return to Analyzer



## Phase 41: Unified System Integration (CRITICAL)

### Data Sources Integration
- [x] Create unified data fetcher service (unifiedDataService.ts)
- [x] Connect News API for real news data
- [x] Create social media data aggregator
- [x] Cache data to reduce API calls and improve speed

### Unified Analysis Pipeline
- [x] ALL analysis flows through Hybrid Engine (70% DCFT + 30% AI)
- [x] Global mood calculation from all sources → GMI, CFI, HRI
- [x] Country-specific mood calculation → per-country indices
- [x] Topic-specific mood calculation → topic analysis results

### Map Integration (Real Mood Display)
- [x] Display REAL mood on world map (not simulation)
- [x] Show country mood with dynamic color coding
- [x] Display mood label (e.g., "Libya today: Anxious")
- [x] Show indices (GMI, CFI, HRI) on map hover/click
- [x] Real-time updates when new data arrives

### Page Interconnection
- [x] Home page → shows global mood → links to Map
- [x] Map page → shows country moods → links to Topic Analysis
- [x] Topic Analysis → detailed analysis → links back to Map
- [x] Dashboard → aggregates all data → links to all pages
- [x] Unified navigation flow between all pages

### Fix Topic Analysis Issue
- [x] Debug why advanced analysis shows no results
- [x] Ensure topic analysis uses real data sources
- [x] Display results properly on results page



## Phase 42: Remove Social Media Page & Add Data Sources Footer

### Remove Social Media Page
- [x] Remove SocialMedia.tsx from pages
- [x] Remove social media route from App.tsx
- [x] Remove social media link from navigation

### Add Data Sources Component
- [x] Create DataSourcesFooter.tsx component
- [x] List all data sources (News API, Reddit, Mastodon, Bluesky, Telegram, YouTube)
- [x] Simple horizontal layout with icons

### Integration
- [x] Add DataSourcesFooter to Home page
- [x] Add DataSourcesFooter to Map page
- [x] Add DataSourcesFooter to Analyzer page
- [ ] Add DataSourcesFooter to Dashboard (optional)


## Phase 43: Real Social Media APIs Enhancement (NEW)

### Reddit API Enhancement
- [x] Implement topic-based subreddit targeting
- [x] Add country-specific subreddits
- [x] Search in multiple subreddits simultaneously
- [x] Add global search fallback

### Bluesky API (AT Protocol)
- [x] Implement Bluesky AT Protocol client
- [x] Add search posts by keyword
- [x] Handle API errors gracefully

### Mastodon API Enhancement
- [x] Connect to multiple Mastodon instances (6 instances)
- [x] Implement federated search
- [x] Remove duplicate posts across instances

### YouTube API Enhancement
- [x] Use official YouTube API when key available
- [x] Fetch video details and comments
- [x] Implement Invidious fallback for no-key scenarios

### Telegram Integration
- [x] Fetch from public news channels
- [x] Support multiple language channels (Arabic, English)
- [x] Web scraping fallback for public channels

### Unified Data Service
- [x] Integrate all social media sources
- [x] Add source weighting for DCFT calculations
- [x] Track real vs simulated data
- [x] Add API status reporting


## Phase 44: Bug Fixes (Reported by User)

### Issues Fixed
- [x] أرقام المزاج العام ثابتة ولا تتغير (تم الإصلاح - جلب بيانات حقيقية تلقائياً)
- [x] المحلل المتقدم لا يعمل (تم الإصلاح - قائمة الدول تعمل)
- [x] الخريطة الحرارية لا تعمل (تم الإصلاح - تعرض بيانات حقيقية)


## Phase 45: Mobile Select Fix (Reported by User)
- [x] إصلاح قائمة اختيار الدولة على الموبايل (تم - touch-manipulation + min-height 48px)
- [x] إصلاح قائمة اختيار الفترة الزمنية على الموبايل (تم - z-index 9999 + mobile CSS)


## Phase 46: Deep Mobile Fix (User Report - Select & Map Still Not Working)
- [x] استبدال Radix Select بـ Native HTML Select للموبايل (تم - قوائم واضحة بخلفية slate-800)
- [x] إصلاح الخريطة الحرارية للموبايل (تم - تحميل فوري بدون انتظار APIs)
