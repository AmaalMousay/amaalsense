# Amaalsense Engine - Project TODO

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
- [x] Change Amaalsense to Amaalsense in all files
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


## Phase 47: Analyzer UI Fixes (User Report)
- [x] إزالة السهم المكرر في قوائم Select Country و Time Range (تم - appearance-auto)
- [x] إصلاح حقل إدخال الموضوع (Topic) ليكون قابل للكتابة (تم - native input)


## Phase 48: Revert Select Arrow Fix (User Report)
- [x] إرجاع السهم السابق الذي يعمل (تم - appearance-none + ChevronDown icon)
- [x] إصلاح حقل كتابة الموضوع ليكون مفعل (تم - Input component)


## Phase 49: New Features (User Request)
- [ ] إضافة تصدير التقارير كـ PDF
- [ ] تفعيل الإشعارات التلقائية عبر Telegram Bot


## Phase 49: PDF Export & Telegram Notifications (User Request)
- [x] إضافة تصدير التقارير كـ PDF (تم - زر تصدير في صفحة نتائج التحليل)
- [x] تفعيل الإشعارات التلقائية عبر Telegram Bot (تم - صفحة إعدادات الإشعارات)
- [x] إضافة خدمة pdfExportService.ts
- [x] إضافة خدمة telegramNotificationService.ts
- [x] تحديث صفحة NotificationSettings مع قسم Telegram


## Phase 50: Fix Topic Input Fields (User Report)
- [ ] إصلاح حقل كتابة الموضوع في التحليل البسيط
- [ ] إصلاح حقل كتابة الموضوع في التحليل المتقدم


## Phase 51: Fix Input Fields Not Working (User Report - No cursor, cannot type)
- [x] إصلاح حقل الكتابة في التحليل البسيط (تم - native HTML input)
- [x] إصلاح حقل الكتابة في التحليل المتقدم (تم - native HTML input)


## Phase 52: Deep Fix Input Fields (User Report - Still Not Working)
- [x] فحص CSS و z-index و pointer-events (تم - وجدت cosmic-card::before يغطي الحقول)
- [x] إزالة أي عناصر تغطي الحقول (تم - pointer-events: none + z-index: -1)
- [x] إضافة z-index: 50 للحقول (تم)


## Phase 53: Add Google RSS News Feed (User Request)
- [x] إنشاء خدمة Google RSS للأخبار (عربي + إنجليزي) - googleRssService.ts
- [x] دمج Google RSS في خدمة البيانات الموحدة - unifiedDataService.ts
- [x] اختبار جلب الأخبار من Google RSS - يعمل بنجاح


## Phase 54: Add GNews API (User Request)
- [x] إضافة مفتاح GNews API للمشروع (تم - GNEWS_API_KEY)
- [x] إنشاء خدمة GNews API (تم - gnewsService.ts)
- [x] دمج GNews في خدمة البيانات الموحدة (تم - وزن 0.88)


## Phase 55: Update How It Works Page (User Request)
- [x] إخفاء تفاصيل المعادلات لحماية الملكية الفكرية
- [x] إظهار المحرك الهجين (70% معادلة + 30% AI)
- [x] تحديث المحتوى ليعكس التغييرات الجديدة
- [x] تحديث صفحة Theory لإزالة تبويب Formulas وإضافة قسم Proprietary Methodology


## Phase 56: Add Major News RSS Feeds (User Request)
- [x] إضافة BBC RSS Feed (عربي + إنجليزي + الشرق الأوسط)
- [x] إضافة Reuters RSS Feed (عبر Google News)
- [x] إضافة Al Jazeera RSS Feed (عربي + إنجليزي)
- [x] إضافة CNN RSS Feed (عالمي + الشرق الأوسط + أهم الأخبار)
- [x] اختبار جلب الأخبار من المصادر الجديدة (12 اختبار ناجح)
- [x] دمج المصادر في خدمة البيانات الموحدة (وزن 0.95 - الأعلى)


## Phase 57: Add More Countries to Advanced Analyzer (User Request)
- [x] إضافة 180 دولة إلى قائمة التحليل المتقدم
- [x] تنظيم الدول حسب القارات (MENA, Europe, North America, Latin America, Asia, Africa, Oceania)
- [x] اختبار القائمة الجديدة - تعمل بنجاح


## Phase 58: Fix Number Display Format (User Request)
- [x] مراجعة طريقة عرض النسب المئوية (مثل 2892% خطأ)
- [x] تصحيح الأرقام لتكون بين 0-100% للنسب (تم إضافة Math.min/max)
- [x] تصحيح confidence في topicAnalyzer.ts و hybridAnalyzer.ts
- [x] التحقق من أن مستوى الثقة يظهر الآن 100% بدلاً من 2742%


## Phase 59: Fix Heat Map for All Countries (User Request)
- [x] التحقق من عمل الخريطة الحرارية مع جميع الدول (France, Japan, Nigeria, Brazil - تم الاختبار)
- [x] تحديد الدول التي لا تظهر فيها الخريطة - تم إصلاحها
- [x] إضافة إحداثيات مراكز 120+ دولة في TopicAnalysisResults.tsx و RegionalHeatMap.tsx
- [x] إضافة دالة getDefaultRegionCoordinates لحساب إحداثيات المناطق الافتراضية
- [x] اختبار الخريطة مع عدة دول مختلفة - تعمل بنجاح


## Phase 60: Add Missing Platform Features (User Request)

### صفحة حالات الاستخدام (Use Cases)
- [ ] إنشاء صفحة Use Cases جديدة
- [ ] إضافة قسم للحكومات والدول
- [ ] إضافة قسم للشركات والمؤسسات
- [ ] إضافة قسم لوسائل الإعلام
- [ ] إضافة قسم للمنظمات الإنسانية
- [ ] تصميم بطاقات جذابة لكل حالة استخدام

### تقارير PDF احترافية
- [ ] إنشاء قالب تقرير PDF احترافي
- [ ] إضافة زر "تحميل تقرير شامل" في صفحة التحليل
- [ ] تضمين الرسوم البيانية في التقرير
- [ ] إضافة ملخص تنفيذي في بداية التقرير

### مقارنة الدول
- [ ] إنشاء صفحة مقارنة الدول
- [ ] إضافة اختيار دولتين للمقارنة
- [ ] عرض المؤشرات جنباً إلى جنب
- [ ] إضافة رسوم بيانية مقارنة

### تنبيهات مخصصة
- [ ] إنشاء نظام التنبيهات المخصصة
- [ ] إضافة واجهة "أنشئ تنبيهك"
- [ ] حفظ التنبيهات في قاعدة البيانات
- [ ] إرسال إشعارات عند تحقق الشروط

### API Documentation
- [ ] إنشاء صفحة API Documentation
- [ ] توثيق جميع نقاط النهاية (endpoints)
- [ ] إضافة أمثلة كود (JavaScript, Python, cURL)
- [ ] إضافة قسم المصادقة والحدود

### لوحة تحكم مخصصة للمؤسسات
- [ ] إنشاء صفحة Dashboard مخصصة
- [ ] إضافة قائمة الدول المتابعة
- [ ] إضافة قائمة المواضيع المتابعة
- [ ] عرض ملخص سريع للمؤشرات المهمة

### تحليل موضوع عبر الزمن
- [ ] إضافة رسم بياني تاريخي في صفحة نتائج التحليل
- [ ] حفظ التحليلات السابقة للموضوع
- [ ] عرض تطور المشاعر خلال أسبوع/شهر


## Phase 60: Add Missing Platform Features (User Request)
- [x] صفحة حالات الاستخدام (Use Cases) - /use-cases
- [x] تقارير PDF احترافية - موجودة في TopicAnalysisResults
- [x] صفحة مقارنة الدول - /compare
- [x] نظام التنبيهات المخصصة - /alerts
- [x] صفحة API Documentation - /api-docs
- [x] لوحة تحكم مخصصة للمؤسسات - /enterprise
- [x] تحليل موضوع عبر الزمن - /topic-timeline


## Phase 61: Redesign Home Page (User Request)
- [x] إضافة خريطة العالم التفاعلية تحت المؤشرات الثلاثة (60+ دولة)
- [x] عرض المزاج السائد فوق كل دولة بالألوان (أمل، هدوء، محايد، خوف، غضب)
- [x] الضغط على دولة ينقل لصفحة الخريطة مع تفاصيل الدولة
- [x] تبسيط المحتوى السفلي (4 بطاقات: محلل عناوين، خريطة مشاعر، بيانات تاريخية، تنبيهات)
- [x] تبسيط الفوتر وإزالة الأقسام الزائدة


## Phase 62: Connect World Map to Real Data (User Request)
- [x] إنشاء API لجلب مزاج جميع الدول (trpc.map.getAllCountriesEmotions)
- [x] ربط الخريطة بالبيانات الحقيقية من الخادم (60+ دولة)
- [x] تحديث الخريطة تلقائياً كل 30 ثانية (refetchInterval: 30000)
- [x] عرض GMI, CFI, HRI عند التمرير فوق الدولة
- [x] الضغط على دولة ينقل لصفحة الخريطة مع التفاصيل


## Phase 63: Rebrand to Amaalsense & Add Emails (User Request)
- [x] تغيير AmalSense إلى Amaalsense في جميع الملفات (30+ ملف)
- [x] إضافة contact@amaalsense.com في صفحة Contact
- [x] إضافة info@amaalsense.com في صفحة About
- [x] إضافة privacy@amaalsense.com في صفحة Privacy


## Phase 64: Replace Home Map with Google Maps (User Request)
- [x] إنشاء مكون EmotionGoogleMap مع دوائر المشاعر (60+ دولة)
- [x] عرض دائرة ملونة فوق كل دولة حسب المزاج السائد (أخضر/أزرق/أصفر/برتقالي/أحمر)
- [x] إضافة التفاعلية (الضغط على دولة ينقل للتفاصيل + tooltip عند التمرير)
- [x] دمج الخريطة في الصفحة الرئيسية مع بيانات حية
- [x] إضافة مفتاح الألوان (Legend) ومؤشر "بيانات حية"


## Phase 65: Pulse Effect & Country Details Page (User Request)
- [ ] إضافة تأثير نبض على دوائر المشاعر في الخريطة الرئيسية
- [ ] تحويل صفحة Map لعرض بيانات الدولة المختارة فقط
- [ ] عرض المؤشرات الثلاثة (GMI, CFI, HRI) للدولة
- [ ] عرض نسبة المشاعر (أمل، خوف، غضب، إلخ)
- [ ] إبقاء Time Range والملف العاطفي و Historical Trend وتحليل العاطفة
- [ ] إزالة الخريطة وقائمة الدول من صفحة Map


## Phase 65: Pulse Effect & Country Details Page (User Request)
- [x] إضافة تأثير نبض على دوائر المشاعر في الخريطة (EmotionGoogleMap)
- [x] تحويل صفحة Map لعرض بيانات الدولة فقط (بدون خريطة وقائمة دول)
- [x] عرض المؤشرات الثلاثة (GMI, CFI, HRI) ونسبة المشاعر (6 مشاعر)
- [x] عرض الملف العاطفي والاتجاهات التاريخية والتفسير
- [x] إضافة ليبيا لقائمة COUNTRIES
- [x] تصحيح confidence لتكون 0-1 بدلاً من 70-95


## Phase 66: Add Social Share Buttons (User Request)
- [x] إضافة أزرار مشاركة تقرير الدولة على Twitter/X
- [x] إضافة مشاركة على Facebook
- [x] إضافة مشاركة على LinkedIn
- [x] إضافة مشاركة على WhatsApp
- [x] إضافة نسخ الرابط مع تأكيد بصري


## Phase 67: Fix Map Circle Colors (User Request)
- [ ] إصلاح ألوان دوائر المشاعر لتعكس المزاج الفعلي
- [ ] أحمر للغضب، أخضر للهدوء/أمل، أصفر للمحايد، برتقالي للخوف
- [ ] التأكد من أن كل دولة تظهر بلون مختلف حسب مزاجها


## Phase 67: Fix Map Circle Colors (User Request)
- [x] إصلاح ألوان الدوائر لتعكس المزاج الفعلي (LY=calm/blue, EG=fear/orange, JP=hope/green)
- [x] أحمر للغضب، أخضر للهدوء، أصفر للمحايد، برتقالي للخوف
- [x] تحديث دالة getMoodFromIndices لتوزيع أفضل للألوان
- [x] زيادة fillOpacity من 0.35 إلى 0.6 و strokeWeight من 2 إلى 3


## Phase 68: Fix Social Share Image (User Request)
- [x] تحديث صورة og:image لتعكس الاسم الصحيح Amaalsense
- [x] إنشاء صورة جديدة للمشاركة الاجتماعية
- [x] تحديث meta tags في index.html


## Phase 69: Complete Multi-Language Translation (User Request)
- [ ] مراجعة ملفات الترجمة الحالية
- [ ] ترجمة صفحة Dashboard
- [ ] ترجمة صفحة Analyzer
- [ ] ترجمة صفحة Map
- [ ] ترجمة صفحة Live
- [ ] ترجمة صفحة Weather
- [ ] ترجمة صفحة About
- [ ] ترجمة صفحة Pricing
- [ ] ترجمة صفحة Contact
- [ ] تطبيق الترجمات على جميع الصفحات

## Phase 69: Complete Multi-Language Translations (User Request)
- [x] تحديث ملف الترجمة الإنجليزية (en.ts) بجميع النصوص الجديدة
- [x] تحديث ملف الترجمة العربية (ar.ts) بجميع النصوص الجديدة
- [x] تحديث ملف الترجمة الفرنسية (fr.ts) بجميع النصوص الجديدة
- [x] تحديث ملف الترجمة الألمانية (de.ts) بجميع النصوص الجديدة
- [x] تحديث ملف الترجمة الإسبانية (es.ts) بجميع النصوص الجديدة
- [x] تحديث ملف الترجمة الروسية (ru.ts) بجميع النصوص الجديدة
- [x] تحديث ملف الترجمة الصينية (zh.ts) بجميع النصوص الجديدة


## Phase 70: Fix Light Mode Text Colors (User Request)
- [x] إصلاح ألوان النصوص في الوضع الفاتح لتكون مرئية
- [x] تحديث متغيرات CSS للوضع الفاتح
- [x] اختبار جميع الصفحات في الوضع الفاتح


## Phase 71: User Registration Page with Account Type (User Request)
- [x] إنشاء صفحة تسجيل المستخدم مع خيارات نوع الحساب (فرد/مؤسسة)
- [x] إضافة نموذج التسجيل مع الحقول المطلوبة
- [x] إضافة أزرار الدخول والتسجيل في أعلى يسار شريط التنقل
- [x] ربط الصفحة مع نظام المصادقة الحالي


## Phase 72: Fix Dark Mode Text Colors (User Request)
- [x] إصلاح ألوان النصوص في الوضع الداكن لتكون مرئية
- [x] تحديث cosmic-text و gradient-text للوضع الداكن
- [x] اختبار جميع الصفحات في الوضع الداكن


## Phase 73: User Registration System with Database Integration (User Request)
- [x] ربط نموذج التسجيل بقاعدة البيانات لحفظ بيانات المستخدمين الجدد
- [x] إضافة جداول قاعدة البيانات (user_registrations, password_reset_tokens)
- [x] إضافة التحقق من صحة البريد الإلكتروني
- [x] إضافة مؤشر قوة كلمة المرور (ضعيفة/متوسطة/قوية)
- [x] إنشاء صفحة نسيت كلمة المرور (/forgot-password)
- [x] إنشاء صفحة إعادة تعيين كلمة المرور (/reset-password)
- [x] إضافة API endpoints للتسجيل وتسجيل الدخول وإعادة التعيين
- [x] تشفير كلمات المرور باستخدام bcryptjs


## Phase 74: Fix Dark Mode Text Visibility Issue (User Request)
- [x] إصلاح العنوان الرئيسي "محلل المشاعر" ليظهر بالكامل في الوضع الداكن
- [x] تحديث ألوان cosmic-text و gradient-text للوضع الداكن
- [x] اختبار جميع النصوص في الوضع الداكن


## Phase 75: Fix Database Error in Registration (User Report)
- [x] إصلاح خطأ جدول user_registrations
- [x] التحقق من وجود الجدول في قاعدة البيانات
- [x] إضافة عمود verifiedAt المفقود إلى الجدول


## Phase 76: User Menu & Dark Mode Fix (User Request)
- [x] إضافة قائمة المستخدم بعد تسجيل الدخول (اسم المستخدم + خيارات)
- [x] إضافة خيارات: لوحة التحكم، البيانات الشخصية، تسجيل الخروج
- [x] إنشاء صفحة لوحة تحكم المستخدم الشخصية (/user-dashboard)
- [x] إنشاء صفحة البيانات الشخصية (/profile)
- [x] مراجعة وإصلاح ألوان الوضع الداكن في جميع الصفحات


## Phase 77: Content Classification & Sensitivity System (User Request)

### نظام تصنيف المحتوى (Content Domain)
- [x] إضافة قائمة منسدلة لاختيار نوع الموضوع في صفحة المحلل
- [x] تصنيفات: سياسة، اقتصاد، صحة نفسية، طب، تعليم، مجتمع، ترفيه، أخبار عامة
- [x] ربط التصنيف بالتحليل

### مستوى الحساسية (Sensitivity Level)
- [x] إضافة مستويات الحساسية: Low, Medium, High, Critical
- [x] تحديد الحساسية تلقائياً بناءً على التصنيف
- [x] عرض مستوى الحساسية في نتائج التحليل

### مقياس المخاطر العاطفية (Emotional Risk Meter)
- [x] إنشاء مكون مقياس المخاطر العاطفية
- [x] عرض المقياس بألوان: أحمر (عالي)، أصفر (متوسط)، أخضر (منخفض)
- [x] ربط المقياس بنتائج التحليل

### إخلاء المسؤولية القانوني (Disclaimer)
- [x] إضافة إخلاء مسؤولية واضح في صفحة المحلل
- [x] تحديث صفحة شروط الاستخدام مع نظام التصنيف والحساسية
- [x] إضافة تنبيه للمواضيع الحساسة

### تحديث قاعدة البيانات
- [x] إضافة حقول domain و sensitivity إلى جدول التحليلات
- [x] تحديث API لتخزين التصنيف والحساسية



## Phase 78: Database Storage, Reports & Notifications (User Request)

### تخزين التصنيف في قاعدة البيانات
- [x] إضافة حقول domain و sensitivity إلى جدول التحليلات (classified_analyses)
- [x] إضافة حقل emotional_risk_score لمقياس المخاطر
- [x] تحديث API لحفظ التصنيف مع كل تحليل
- [x] إنشاء API لاسترجاع التحليلات مع التصنيف

### تقارير حسب التصنيف
- [x] إنشاء صفحة التقارير (/reports)
- [x] إضافة رسم بياني شريطي لتوزيع التحليلات حسب التصنيف
- [x] إضافة رسم بياني شريطي لمستويات الحساسية
- [x] عرض التحليلات الأخيرة مع تفاصيلها
- [x] إضافة إحصائيات عامة (إجمالي التحليلات، متوسط المخاطر، إلخ)

### نظام التنبيهات المخصصة
- [x] إنشاء جدول للمواضيع المتابعة (followed_topics)
- [x] إنشاء جدول للتنبيهات (topic_alerts)
- [x] إنشاء صفحة المواضيع المتابعة (/followed-topics)
- [x] إضافة API لمتابعة وإلغاء متابعة المواضيع
- [x] إضافة API للتنبيهات (عرض، تعليم كمقروء)


## Phase 79: Fix User Dashboard & Profile Real Data (User Request)

### إصلاح صفحة لوحة تحكم المستخدم
- [x] إنشاء API لجلب إحصائيات المستخدم الحقيقية (userStats.getStats)
- [x] تحديث صفحة UserDashboard لعرض بيانات حقيقية من قاعدة البيانات
- [x] جعل الإحصائيات فارغة (0) للمستخدمين الجدد
- [x] ربط الإحصائيات بالتحليلات الفعلية للمستخدم

### إصلاح صفحة الملف الشخصي
- [x] تحديث صفحة Profile لعرض بيانات المستخدم الحقيقية فقط
- [x] إزالة البيانات الوهمية واستبدالها ببيانات فعلية
- [x] عرض تاريخ التسجيل والنشاط الفعلي
- [x] إضافة تبويب Activity لعرض إحصائيات النشاط


## Phase 80: Refactor Advanced Analysis - Remove Pro/Against (User Request)

### إلغاء مؤيد/معارض/محايد
- [x] إزالة قسم Support vs Opposition من صفحة نتائج التحليل (TopicAnalysisResults.tsx)
- [x] استبداله بتوزيع المشاعر (Joy, Sadness, Anger, Fear, Hope, Curiosity)
- [x] تحديث صفحة Analyzer.tsx لإزالة مؤيد/معارض من المناطق

### تقريب الأرقام
- [x] تقريب GMI, CFI, HRI لرقم عشري واحد فقط
- [x] تقريب جميع النسب المئوية
- [x] إزالة الأرقام الطويلة مثل 2.999999999

### تحسين عرض المؤشرات
- [x] عرض المؤشرات بشكل احترافي مع ألوان مناسبة
- [x] إضافة حالة المزاج بالألوان
- [x] تحسين تجربة المستخدم الاحترافية



## Phase 81: Fix Dark Mode Text Visibility (User Request)

### فحص وإصلاح الصفحات
- [x] فحص جميع الصفحات في الوضع الداكن (Home, Theory, Terms, Analyzer, Reports, Profile, UserDashboard)
- [x] إصلاح ألوان بطاقات التصنيف في ContentClassification.tsx
- [x] إصلاح لون Disclaimer في Terms.tsx (text-orange-800 dark:text-orange-300)
- [x] اختبار جميع الصفحات في الوضعين (فاتح/داكن) - جميعها تعمل بشكل صحيح


## Phase 82: Twitter Integration with Manus Data API (Zero Cost)

### إنشاء خدمة Twitter
- [x] إنشاء خدمة twitterService.ts باستخدام Manus Data API
- [x] إضافة وظائف جلب التغريدات حسب الكلمة المفتاحية (searchTwitterPosts)
- [x] إضافة وظيفة جلب تغريدات مستخدم معين (getUserTweets)
- [x] إضافة وظيفة جلب ملف المستخدم (getTwitterUserProfile)

### دمج Twitter مع النظام
- [x] إضافة Twitter كمصدر في socialMediaService.ts
- [x] تحديث fetchAllSocialMedia ليشمل Twitter
- [x] تحديث getAPIStatus لعرض حالة Twitter
- [x] Twitter متاح كمصدر سادس (6 مصادر اجتماعية)

### تحديث الواجهة
- [x] Twitter يظهر تلقائياً في مصادر البيانات
- [x] عرض عدد التغريدات المحللة في النتائج
- [x] Twitter مدمج مع المحرك الهجين DCFT


## Phase 83: Fix Dark Mode Text in Analysis Results (User Request)
- [x] إصلاح ألوان النصوص العربية في بطاقات نتائج التحليل
- [x] جعل النصوص واضحة في الوضع الداكن (الفضول، الأمل، الخوف، الغضب، الحزن)
- [x] التأكد من تباين النصوص مع الخلفيات البيضاء


## Phase 84: تحسين فهم السياق العربي في تحليل المشاعر (User Request)

### المشكلة
- [x] النظام يعطي نتيجة "فرح" لأخبار الوفاة (مثل "موت أبومرداع ودخيل")
- [x] عدم فهم السياق العربي والليبي للكلمات

### الحل المطلوب
- [x] إضافة قاموس كلمات عربية للوفاة والحزن (موت، وفاة، توفي، رحيل، فقدان)
- [x] تحسين prompt الـ LLM ليفهم السياق العربي بشكل أفضل
- [x] إضافة تحليل مسبق للكلمات المفتاحية قبل إرسالها للـ LLM
- [x] اختبار التحسينات على أخبار الوفاة


## Phase 85: إضافة طبقة Meta-Learning للسياق العالمي (User Request - Major Feature)

### الهدف
إنشاء نظام ذكي يفهم السياق الثقافي والجغرافي قبل التحليل العاطفي

### المكونات الرئيسية

#### 1. Context Classifier (مصنف السياق)
- [x] تصنيف نوع الحدث (وفاة، كارثة، احتفال، سياسة، اقتصاد، رياضة، ترفيه)
- [x] تحديد المنطقة الجغرافية والثقافة (عربية، غربية، آسيوية، أفريقية، لاتينية)
- [x] تحديد اللغة واللهجة (فصحى، ليبية، خليجية، مصرية، شامية)
- [x] تحديد درجة الحساسية (عالية، متوسطة، منخفضة)

#### 2. Cultural Context Database (قاعدة بيانات السياق الثقافي)
- [x] قاموس الكلمات المفتاحية لكل ثقافة
- [x] قواعد التعبير العاطفي حسب الثقافة
- [x] أحداث ومناسبات خاصة بكل منطقة

#### 3. Meta-Learning Engine (محرك التعلم الفوقي)
- [x] تحليل السياق قبل التحليل العاطفي
- [x] تعديل أوزان المشاعر حسب السياق
- [ ] تعلم من الأنماط السابقة (مرحلة مستقبلية)

#### 4. Integration with DCFT
- [x] دمج Meta-Learning مع نظرية DCFT
- [x] تحديث Hybrid Analyzer لاستخدام السياق
- [x] تحسين دقة التحليل العاطفي

### الاختبارات
- [x] اختبار على أخبار عربية (وفاة، احتفالات، سياسة)
- [ ] اختبار على أخبار غربية (مرحلة مستقبلية)
- [ ] اختبار على أخبار آسيوية (مرحلة مستقبلية)
- [x] مقارنة النتائج قبل وبعد


## Phase 86: إضافة ثلاث ميزات متقدمة (User Request)

### 1. التعلم التلقائي (Active Learning)
- [x] إنشاء جدول لحفظ التحليلات الناجحة في قاعدة البيانات
- [x] إنشاء نظام تقييم التحليلات (feedback system)
- [x] إنشاء محرك التعلم من الأنماط السابقة
- [x] دمج التعلم التلقائي مع Hybrid Analyzer

### 2. تحليل المشاعر متعدد اللغات (Multilingual Analysis)
- [x] إضافة دعم للغات: الفرنسية، الإسبانية، الألمانية، الصينية، اليابانية
- [x] إنشاء قواميس كلمات مفتاحية لكل لغة
- [x] تحسين Context Classifier لاكتشاف اللغة تلقائياً
- [x] إضافة قواعد ثقافية لكل منطقة لغوية

### 3. تحليل السياق الزمني (Temporal Context Analysis)
- [x] إنشاء نظام تتبع تغير المشاعر عبر الزمن
- [x] حفظ تاريخ التحليلات لكل موضوع
- [ ] إنشاء رسوم بيانية لتطور المشاعر (مرحلة مستقبلية - واجهة)
- [ ] إضافة مقارنة زمنية في الواجهة (مرحلة مستقبلية - واجهة)


## Phase 87: تحويل AmalSense من مشروع بحثي إلى منتج تجاري (User Request)

### 1. طبقة تنظيف البيانات (Data Cleaning Layer)
- [x] حذف النصوص القصيرة جداً (أقل من 10 كلمات)
- [x] حذف الإعلانات والسبام
- [x] حذف التكرار والنصوص المنسوخة
- [x] تجاهل النصوص السطحية

### 2. نظام وزن المصادر (Source Weighting)
- [x] إضافة أوزان للمصادر:
  - Reuters/BBC: 1.0
  - Reddit: 0.8
  - Twitter: 0.7
  - Telegram: 0.6
  - Blogs: 0.4
- [x] تطبيق الأوزان في حساب المؤشرات

### 3. معايرة المؤشرات (Benchmark)
- [x] إنشاء قاعدة بيانات 20 حدث عالمي معروف (Ground Truth)
- [x] مقارنة نتائج النظام مع التوقعات
- [ ] تعديل المعادلات حسب النتائج (مرحلة مستقبلية)

### 4. نظام التقييم العلمي (Evaluation System)
- [x] إنشاء Ground Truth يدوي (20 حدث عالمي مصنف)
- [x] حساب Accuracy و Precision و F1 Score
- [x] عرض نسبة التوافق مع التصنيف البشري

### 5. تحويل الأرقام إلى رؤى (Insights & Alerts)
- [x] تحويل النسب إلى تنبيهات ذكية (Critical/Warning/Info/Positive)
- [x] إضافة توصيات بناءً على التحليل
- [x] إضافة تنبؤات (مثل: احتمالية أزمة خلال 72 ساعة)
- [x] تحسين عرض النتائج للمستثمرين (Key Message)


## Phase 88: رفع نضج AmalSense - 7 تحسينات إضافية (User Request)

### 6. التحيز الجغرافي (Geographical Bias)
- [x] وسم النتائج: Global (Limited) / MENA-biased / Western-biased
- [x] عرض توزيع المصادر الجغرافي
- [x] إضافة تحذير عند التحيز الشديد

### 7. تمثيل البشر الحقيقيين (Digital vs Human)
- [x] تغيير التوصيف إلى "Digital Collective Emotion"
- [x] إضافة تنويه واضح في الواجهة
- [x] توضيح أن البيانات من المتصلين فقط

### 8. كشف التلاعب (Manipulation Detection)
- [x] كشف الحسابات الجديدة
- [x] كشف تكرار النصوص
- [x] كشف كثافة النشر غير الطبيعية
- [x] تصفية البوتات والسبام

### 9. هيمنة الحدث (Event Dominance)
- [x] حساب نسبة هيمنة الحدث الأكبر
- [x] عرض GMI مع وبدون الحدث المهيمن
- [x] تحذير عند هيمنة حدث واحد > 50%

### 10. الزمن الحقيقي (Real-time Transparency)
- [x] عرض "Last updated: X minutes ago"
- [x] عرض "Data window: last X hours"
- [x] توضيح أن البيانات ليست لحظية

### 11. الشفافية والتفسير (Explainability)
- [x] زر "Why this?" لكل مؤشر (في الـ backend)
- [x] عرض أهم 5 مصادر مؤثرة (في الـ backend)
- [x] عرض أهم 10 جمل مؤثرة (في الـ backend)
- [x] عرض الكلمات الأكثر تأثيراً (في الـ backend)

### 12. الهوية السوقية (Use Cases)
- [ ] تحديد 3 حالات استخدام: إعلام، حكومات، شركات (مرحلة مستقبلية)
- [ ] إعداد محتوى مخصص لكل فئة (مرحلة مستقبلية)


## Phase 89: إصلاح ألوان البطاقات والنصوص (User Request)
- [x] توحيد ألوان البطاقات في صفحة Analyzer
- [x] بطاقة "المشاعر السائدة" - خلفية داكنة مع نص أبيض
- [x] بطاقة "تفاصيل المحرك الهجين" - خلفية داكنة مع نص أبيض
- [x] جميع البطاقات الأخرى - التأكد من التباين الصحيح


## Phase 90: إصلاح ألوان الوضع الفاتح (User Request)
- [x] الوضع الفاتح: خلفية بيضاء + نص أسود
- [x] الوضع الداكن: خلفية سوداء + نص أبيض
- [x] التأكد من التباين الصحيح في كلا الوضعين


## Phase 91: تحويل AmalSense إلى منتج تجاري (Commercial Transformation)

### الملخص الاستراتيجي
**الناقص الأكبر**: Use Case واضح ومحدد لشخص واحد فقط
**الحل**: تضييق الرؤية من "العالم" إلى "شخص واحد يدفع"

### 1. تحديد العميل المستهدف (Persona)
- [ ] العميل الأساسي: صحفي / مؤسسة إعلامية
  - مشكلته: ما يعرف اتجاه الرأي العام بسرعة
  - الحل: "شن القصة اللي الناس متأثرة بها الآن؟ ولماذا؟"
- [ ] العميل الثانوي: باحث اجتماعي / جامعة
  - مشكلته: يحتاج بيانات مشاعر حقيقية
  - الحل: بيانات جاهزة + API

### 2. Dashboard مخصص للعملاء
- [ ] إنشاء صفحة Journalist Dashboard
- [ ] إنشاء صفحة Researcher Dashboard
- [ ] إضافة 3 أمثلة حقيقية (Case Studies)

### 3. هيكل الاشتراكات (Pricing)
- [ ] Free: عرض المؤشرات العامة + خريطة العالم
- [ ] Pro ($10-30): تحليل موضوع مخصص + تقارير PDF + مقارنة زمنية
- [ ] Research/Media: API Access + Download Data + Alerts
- [ ] إنشاء صفحة Pricing

### 4. القصة التسويقية
- [ ] تغيير الرسالة من "منصة ذكاء عاطفي جماعي عالمي" إلى:
      "AmalSense يساعدك تفهم كيف يشعر الناس تجاه أي قضية خلال دقائق"

### 5. Landing Page قوية
- [ ] الإجابة على 3 أسئلة فقط:
  - لمن هذا؟
  - ماذا يفعل؟
  - لماذا يهمني؟
- [ ] إزالة التعقيد وتبسيط الرسالة



## Phase 92: تحسين Landing Page والتحول التجاري (Completed)

### Landing Page Improvements
- [x] تحديث Hero Section برسالة تسويقية واضحة
- [x] إضافة قسم "لمن هذا؟" مع بطاقتين للصحفيين والباحثين
- [x] إضافة Trust Badges (15+ مصدر، 50+ دولة، تحليل فوري)
- [x] تحسين CTAs (جرب التحليل مجاناً، كيف يعمل؟)

### Persona-Specific Dashboards
- [x] إنشاء صفحة Journalist Dashboard موجودة مسبقاً
- [x] إنشاء صفحة Researcher Dashboard موجودة مسبقاً
- [x] إضافة روابط من الصفحة الرئيسية للـ Dashboards

### Pricing Structure
- [x] صفحة Pricing موجودة مسبقاً مع 4 مستويات (Free, Pro, Enterprise, Government)



## Phase 93: AmalSense Markets - Emotional Market Intelligence (NEW)

### المنتج الجديد: إشارات عاطفية للأسواق المالية
- [x] إنشاء صفحة Markets الرئيسية مع رسالة تسويقية واضحة
- [x] إضافة مؤشر Sentiment Momentum (اتجاه المشاعر)
- [x] إضافة مؤشر Fear Spike Index (مؤشر الذعر)
- [x] إضافة مؤشر Hype Index (مؤشر التضخيم الإعلامي)
- [x] إنشاء بطاقات للأصول المالية (Gold, Bitcoin, Tech Stocks, Oil)
- [x] إضافة هيكل الاشتراكات (Free, Pro Trader $29, Fund $199, API)
- [x] إضافة إخلاء المسؤولية القانوني
- [x] إضافة الرابط في Navigation

### الرسالة التسويقية الصحيحة
"نحن لا نقول لك ماذا تفعل، نحن نريك كيف يشعر السوق قبل أن يتحرك."

### إخلاء المسؤولية
"AmalSense provides emotional indicators, not financial advice."



## Phase 95: تطوير Journalist Dashboard - السيناريو الكامل للصحفي
- [x] Story Discovery Panel - أهم 10 مواضيع اليوم
- [x] فلتر الدول (أخبار عامة + أخبار خاصة بكل دولة)
- [x] Emotion Breakdown لكل موضوع (غضب/خوف/أمل/حياد)
- [x] Trend Indicators (صاعد/هابط) لكل قصة
- [x] Country Comparison - مقارنة ردود الفعل بين الدول
- [x] تحديث الرسالة التسويقية: "اكتشف القصص قبل أن تصبح ترند"


## Phase 96: تطوير Markets - السيناريو الكامل للمتداول
- [x] Fear Spike Index تفاعلي مع تحذير عند المستويات الخطرة
- [x] Sentiment Momentum مع اتجاه (صاعد/هابط/ينقلب)
- [x] Hype Index مع تحذير "فقاعة نفسية محتملة"
- [x] Asset Comparison - مقارنة المشاعر بين الأصول
- [x] Signal Cards - إشارات واضحة للسوق
- [x] تحديث الرسالة: "نقيس مزاج السوق قبل أن يتحرك"


## Phase 97: تطوير Researcher Dashboard - السيناريو الكامل للأكاديمي
- [x] Data Explorer - استعراض البيانات الضخمة مع فلاتر متقدمة
- [x] Research Variables - متغيرات جاهزة (Fear, Hope, Anger, Polarization)
- [x] Cross-Cultural Comparison - جدول مقارنة بين الدول
- [x] Data Export - تحميل بصيغ CSV, JSON, Excel
- [x] Citation Generator - توليد الاستشهاد الأكاديمي
- [x] API Documentation - توثيق للـ Research API
- [x] تحديث الرسالة: "Large-scale dataset of quantified collective emotions"


## Phase 98: تبسيط الواجهة - حذف صفحات غير ضرورية
- [x] حذف صفحة Map من App.tsx
- [x] حذف صفحة Live من App.tsx
- [x] إزالة الروابط من قائمة التنقل


## Phase 99: تحسين صفحة Analyzer
- [x] إضافة فلتر اختيار الدولة (دولة محددة أو كل الدول)
- [x] إضافة خانة إدخال العنوان/الموضوع
- [x] تحسين واجهة الإدخال


## Phase 100: إعادة هيكلة Backend - Emotional Intelligence OS

### 5 Core Engines
- [x] Engine 1: Context Classification (domain, eventType, region, sensitivity)
- [x] Engine 2: Emotion Fusion Model (AI + DCFT + rules → Affective Vector)
- [x] Engine 3: Emotional Dynamics (momentum, volatility, trend, spikes)
- [x] Engine 4: Driver Detection (keywords, causes, narratives, events)
- [x] Engine 5: Explainable Insight (human-readable interpretation per userType)

### Unified API
- [x] إنشاء POST /analyze endpoint واحد (unifiedEngine.analyze)
- [x] Input: topic + countryCode + countryName + userType
- [ ] Output: context + emotionalState + dynamics + drivers + insights

### واجهة مبسطة
- [ ] تبسيط صفحة الإدخال: مربع عنوان + مربع دولة فقط
- [ ] إزالة Basic/Advanced tabs
- [ ] لوحة نتائج موحدة تتكيف حسب userType


## Phase 101: تعديل الصفحة الرئيسية - تبسيط الواجهة
- [ ] Hero Section بارز مع "جرب التحليل الآن"
- [ ] خانة موضوع واحدة فقط
- [ ] خانة دولة (قائمة منسدلة)
- [ ] إلغاء تبويب محلل العناوين
- [ ] إلغاء تبويب خريطة المشاعر
- [ ] إلغاء تبويب بيانات تاريخية
- [ ] إلغاء تنبيهات الجرس (تنتقل للصفحة الشخصية)
- [ ] إبقاء المؤشرات الثلاثة GMI, CFI, HRI
- [ ] إبقاء الخريطة
- [ ] قسم "كيف يعمل" في الأسفل


## Phase 102: تحسينات Backend المتقدمة

### Engine 0: Emotional Memory Layer
- [x] إنشاء emotionalMemory.ts لتخزين التحليلات
- [x] إنشاء in-memory store للذاكرة العاطفية (جاهز للترقية لقاعدة بيانات)
- [x] ربط Memory Layer مع Engine 3 (Dynamics)
- [x] إضافة getHistoricalData و calculateHistoricalTrend

### Source Weighting
- [x] إنشاء sourceWeighting.ts مع قاعدة بيانات المصادر المعروفة
- [x] إضافة sourceWeight للمصادر (news: 1.0, social: 0.7, forums: 0.5)
- [x] تحديث Unified Analyzer لاستخدام أوزان المصادر
- [x] إضافة calculateAggregateWeight و applySourceWeighting

### Confidence Propagation
- [x] إنشاء confidencePropagation.ts
- [x] إضافة engineConfidence لكل Engine
- [x] حساب overallConfidence كمتوسط مرجح
- [x] إضافة confidence grade (A+ to F)

### Feedback Loop Structure
- [x] إنشاء feedbackStore.ts لتخزين تصحيحات المستخدم
- [x] إضافة submitEmotionCorrection, submitAccuracyRating
- [x] إضافة analyzeFeedbackPatterns للتعلم المستقبلي
- [x] جاهز للترقية لقاعدة بيانات

### تحديث Unified Analyzer
- [x] دمج جميع التحسينات في unifiedAnalyzer.ts
- [x] تحديث الإصدار إلى 3.0.0
- [x] إضافة historicalTrend للنتائج
- [x] إضافة confidence breakdown للنتائج
- [x] إضافة sourceWeighting info للنتائج


## Phase 103: إعادة هيكلة صفحات النتائج

### حذف الصفحات الزائدة
- [x] حذف صفحة Trends
- [x] حذف صفحة Weather (الطقس العاطفي)
- [x] إزالة الروابط من Navigation

### صفحة نتائج التحليل (Topic Analysis Results)
- [x] إنشاء صفحة /analysis-results (موجودة مسبقاً)
- [x] عرض نتائج الـ 5 Engines
- [x] عرض Confidence Grade
- [x] عرض Historical Trend إن وجد
- [x] تصميم متوافق مع userType

### صفحة نتائج الدولة (Country Results)
- [x] إنشاء صفحة /country/:code
- [x] عرض بيانات الدولة العاطفية (GMI, CFI, HRI)
- [x] عرض 5 مواضيع ترند ساخنة للدولة
- [x] تحليل كل موضوع بنفس سياق الـ Unified Engine
- [x] ربط الخريطة بالصفحة الجديدة


## Phase 104: AI Learning System (التحول لعقل حي)

### Smart Storage
- [x] إنشاء learningStore.ts
- [x] تخزين: السؤال + السياق + النتيجة
- [x] جاهز للربط مع قاعدة البيانات (in-memory حالياً)

### Feedback System
- [x] إضافة feedback من المستخدم (submitAccuracyFeedback)
- [x] إضافة feedback من الواقع (submitOutcomeFeedback - هل تحقق التوقع؟)
- [x] تخزين الـ feedback مع الـ analysis
- [x] إضافة submitCorrectionFeedback لتصحيح الأخطاء

### Learning Loop
- [x] إنشاء learningLoop.ts
- [x] مقارنة التوقعات بالواقع (evaluatePrediction)
- [x] تعديل الأوزان بناءً على الأخطاء (applyLearningAdjustment)
- [x] تسجيل "كنت غلط هنا" للتعلم (triggerLearningFromError)
- [x] تنبؤ باتجاه المشاعر (predictEmotionTrend)
- [x] جميع الاختبارات نجحت (15 tests passed)



## Phase 105: ربط الخريطة بصفحة نتائج الدولة

- [x] تحديث handleCountryClick للانتقال إلى /country/:code عند الضغط على دولة
- [x] الخريطة تستخدم EmotionGoogleMap مع click listener
- [x] زر "العودة للخريطة" يعمل بشكل صحيح


## Phase 106: إصلاح القائمة وصفحة النتائج

- [x] إزالة رابط Trends من القائمة العلوية
- [x] إزالة رابط Weather من القائمة العلوية
- [x] صفحة Analyzer تعمل وتعرض النتائج في نفس الصفحة (Emotion Vector, Confidence Level, Hybrid Engine Details)


## Phase 107: إلغاء صفحة Analyzer

- [x] إزالة صفحة /analyzer من التطبيق
- [x] إزالة رابط Analyzer من القائمة العلوية
- [x] تحديث زر "حلل الآن" في الصفحة الرئيسية للانتقال مباشرة لصفحة النتائج /analysis-results
- [x] التأكد من عمل التحليل من الصفحة الرئيسية - يعمل بشكل صحيح
- [x] تحديث زر "العودة للمحلل" ليصبح "العودة للرئيسية"


## Phase 108: إعادة بناء صفحة النتائج (9 أقسام)

### 0. Input Summary Bar
- [x] العنوان المُدخل (Headline)
- [x] الدولة / الموقع
- [x] وقت التحليل
- [x] مستوى الثقة العام (Global Confidence) - 100% ثقة

### 1. Global Emotional Snapshot (Hero Section)
- [x] GMI مؤشر رقمي كبير (-100 → +100) - يعرض +19.4
- [x] التوصيف النصي (محايد)
- [x] Emotional Weather (متقلب - Mixed)
- [x] وصف قصير ذكي بالـ AI

### 2. Emotion Distribution (Core Psychology Layer)
- [x] أشرطة تقدم لكل شعور
- [x] Joy, Fear, Anger, Sadness, Hope, Curiosity, Calm
- [x] لكل شعور: النسبة % + emoji
- [x] الشعور السائد مع نسبته

### 3. Smart Indices Panel (DCFT Layer)
- [x] GMI – Global Mood Index (19.4)
- [x] CFI – Collective Fear Index (54.2)
- [x] HRI – Hope Resilience Index (50.3)
- [x] مؤشرات إضافية للمتداول/الباحث (Sentiment Momentum, Fear Spike, Volatility, Polarization)

### 4. Explainability Engine (سبب النتيجة)
- [x] "لماذا هذا المزاج؟" نص مولد بالذكاء الاصطناعي
- [x] الكلمات المفتاحية المؤثرة (للصحفي/الباحث)
- [x] لماذا الخوف مرتفع/منخفض؟
- [x] لماذا الأمل مرتفع/منخفض؟

### 5. Temporal Emotion Trend (Time Layer)
- [x] Tabs لـ 24 ساعة / 7 أيام / 30 يوم
- [x] يظهر للصحفي/المتداول/الباحث فقط
- [ ] ربط ببيانات تاريخية حقيقية (لاحقاً)

### 6. Global Emotion Map
- [x] خريطة حرارية بألوان حسب GMI
- [x] عرض المناطق مع نسبها
- [x] Legend للألوان
- [x] Tab لعرض المناطق كبطاقات

### 7. Domain Classification (Context Layer)
- [x] تصنيف الحدث: اقتصاد (Economy)
- [x] مستوى الحساسية: متوسط (Medium)
- [x] نطاق التأثير: محلي (Local)

### 8. AI Meta Insights (العقل التحليلي)
- [x] هل هو حدث محفز؟ (لا - حدث عادي)
- [x] توقع 48 ساعة (استمرار التحسن)
- [x] مستوى الخطورة: تنبيه (Alert)

### 9. User Mode Adaptation
- [x] 👤 مستخدم عادي: وصف بسيط + طقس عاطفي + مؤشرات مختصرة
- [x] 📰 صحفي: تفسير سببي + ترند + خريطة + كلمات مفتاحية
- [x] 📈 متداول: CFI + تقلب المشاعر + إنذارات
- [x] 🔬 باحث: Raw data + Scores + Confidence + تصدير JSON


## Phase 109: إضافة Feedback وإصلاح الدول

### زر Feedback
- [x] إضافة زر "هل هذا التحليل دقيق؟" في صفحة النتائج
- [x] خيارات: 👍 دقيق / 👎 غير دقيق / ✏️ تصحيح
- [x] إضافة نافذة التصحيح مع 8 مشاعر للاختيار
- [ ] ربط مع feedbackStore.ts في Backend (لاحقاً)

### إصلاح قائمة الدول
- [x] إنشاء ملف countries.ts مع 180+ دولة
- [x] إضافة خيار "كل الدول" للتحليل العام
- [x] ترتيب الدول حسب المنطقة
- [x] تحديث Home.tsx لاستخدام القائمة الكاملة

### إصلاح خطأ التحليل
- [x] إصلاح "حدث خطأ أثناء التحليل" - الآن يعمل مع أي دولة
- [x] إضافة getCountryByCode للحصول على اسم الدولة تلقائياً


## Phase 110: تنظيف الصفحة الرئيسية

- [x] إلغاء الجمل الثلاث تحت المحلل (15+ مصدر، 50+ دولة، تحليل فوري)
- [x] إلغاء قسم "لمن هذا" مع صفحات الأكاديميين والصحفيين


## Phase 111: تحديث Footer وتبسيط كيف يعمل

- [x] إزالة روابط Analyzer, Map, Trends من Footer - تم استبدالها بـ Dashboard, Markets, Theory
- [x] قسم "كيف يعمل" موجود بالفعل بشكل بسيط (3 خطوات فقط)


## Phase 112: إصلاح أيقونة كل الدول

- [x] حذف الأيقونة الملونة 🌍 من "كل الدول" وإبقاء أيقونة Globe الرمادية فقط


## Phase 113: Meta Decision Engine + Storytelling Interface

### Backend - Meta Decision Engine
- [x] إنشاء metaDecisionEngine.ts
- [x] إرجاع final_state (إيجابي حذر، سلبي حذر، محايد، إلخ)
- [x] إرجاع human_summary (جملة واضحة للمستخدم)
- [x] إرجاع action_signal (فرصة / مراقبة / حذر / تحذير / خطر)
- [x] إرجاع risk_level (منخفض / متوسط / مرتفع / حرج)
- [x] إرجاع confidence (نسبة الثقة)
- [x] إرجاع forecast48h (توقع 48 ساعة)
- [x] إرجاع mainReasons (أسباب التحليل)
- [x] دمج مع unifiedAnalyzer.ts

### Frontend - Storytelling Interface
- [x] بطاقة ضخمة في الأعلى: النتيجة النهائية + التوقع + الثقة
- [x] 3 مؤشرات فقط (GMI, HRI, CFI) مع تفسير لكل واحد
- [x] قسم "ممّ يتكوّن هذا المزاج؟" (توزيع المشاعر)
- [x] قسم "لماذا هذا المزاج؟" (Explainability) كنقاط سببية
- [x] الخريطة في الآخر كميزة استكشافية (للصحفي/المتداول/الباحث)
- [x] زر Feedback مع خيارات التصحيح


## Phase 114: تغيير اللغة الأساسية إلى الإنجليزية

- [x] تغيير defaultLanguage من 'ar' إلى 'en' في main.tsx
- [x] التأكد من عمل الترجمات بشكل صحيح


## Phase 115: تغيير أسماء الدول إلى الإنجليزية

- [x] تغيير عرض أسماء الدول في Home.tsx لتكون بالإنجليزية دائماً
- [x] التأكد من عمل الخريطة وقائمة الدول بشكل صحيح


## Phase 116: إصلاح مشكلة الدولة المختارة

- [x] إصلاح مشكلة ظهور "ليبيا" دائماً في التحليل - الآن يعرض الدولة المختارة فعلياً
- [x] إزالة جميع الـ fallbacks إلى LY واستبدالها بـ ALL (Global)
- [x] تحديث عرض اسم الدولة في الـ header


## Phase 117: تغيير نصوص الخريطة إلى الإنجليزية

- [ ] تغيير عنوان "خريطة المشاعر العالمية" إلى "Global Emotion Map"
- [ ] تغيير الوصف إلى "Click on any country to view mood details"
- [ ] تغيير "بيانات حية" إلى "Live Data"
- [ ] تغيير Legend من العربية إلى الإنجليزية (Hope, Calm, Neutral, Fear, Anger)


## Phase 108: Fix Arabic Text in Global Emotion Map (NEW)
- [x] Translate map title "خريطة المشاعر العالمية" → "Global Emotion Map"
- [x] Translate map instruction "اضغط على أي دولة لعرض تفاصيل المزاج العام" → "Click on any country to view mood details"
- [x] Translate live data badge "بيانات حية" → "Live Data"
- [x] Translate legend labels (أمل، هدوء، محايد، خوف، غضب) → (Hope, Calm, Neutral, Fear, Anger)
- [x] Translate loading text "جاري تحميل البيانات" → "Loading data..."
- [x] Translate tooltip text "اضغط لعرض التفاصيل" → "Click to view details"
- [x] Update EmotionGoogleMap.tsx legend and live data badge

## Phase 109: Fix Arabic "حالات الاستخدام" Button (NEW)
- [x] Change "حالات الاستخدام" → "Use Cases" in Home.tsx


## Phase 110: Conversational Intelligence Agent (NEW - MAJOR FEATURE)

### Core Concept: Collective Emotional Intelligence Agent
Transform AmalSense from a dashboard display to a conversational analytical mind.

### UI Changes
- [ ] Redesign analyzer input (topic only, no country selector)
- [ ] Create split-screen results page (left: metrics | right: AI chat)
- [ ] AI automatically explains results without user asking
- [ ] Add follow-up question input field

### Backend - Four Intelligence Layers
- [ ] Layer 1: Analytical Intelligence (existing - GMI/CFI/HRI calculation)
- [ ] Layer 2: Emotional Reasoning AI (connects indicators, infers collective psychological states)
- [ ] Layer 3: Conversational Intelligence (understands questions, responds in human language)
- [ ] Layer 4: Meta-Decision AI (converts analysis to recommendations/warnings/scenarios)

### AI Features
- [ ] Auto-detect country from topic context
- [ ] Interpreter: explains current results (GMI, HRI, CFI, Trends)
- [ ] Reasoner: connects indicators (high fear + low hope = tension)
- [ ] Forecaster: simulates "what if" scenarios
- [ ] Provides recommendations, warnings, and strategic advice

### Example Conversation Flow
```
🤖 AmalSense AI: Based on current data, the overall mood is cautiously positive.
   Main reason: rise in words like "improvement" and "opportunity" with absence of strong negative indicators.

👤 User: Should I buy silver?

🤖 AmalSense AI: Emotionally: yes, there's psychological readiness for buying.
   But no strong rush, so recommendation is to monitor or buy gradually.

👤 User: What if negative news appears?

🤖 AmalSense AI: In that case, CFI is expected to rise above 60
   and mood will shift to tense within hours.
```


## Phase 111: Groq + Qwen Integration (Open Source LLM)
- [x] Create Groq API service with Qwen model support
- [x] Create LLM provider abstraction layer (switch between Manus/Groq)
- [x] Update conversationalAI to use configurable LLM provider
- [x] Request GROQ_API_KEY from user
- [x] Test Smart Analysis page with Groq
- [x] Verify Arabic language support with Qwen


## Phase 112: Complete AI Architecture (5-Layer Intelligence System)

### Architecture Overview:
```
Frontend (Web/App)
        ↓
API Gateway (tRPC/Express)
        ↓
AI Orchestration Layer (Agent Controller)
        ↓
LLM Layer (Groq/Qwen/Manus)
        ↓
AmalSense Core Engines (DCFT, Emotion, Meta, Forecast)
        ↓
Knowledge Layer (SQL + Vector Store + RAG)
```

### Tasks:
- [x] Create AI Orchestrator (server/orchestrator/index.ts)
  - [x] Intent classifier (what type of question?)
  - [x] Engine selector (which engines to call?)
  - [x] Response composer (combine results)
  
- [x] Add Vector Store for memory/context
  - [x] Create embeddings service
  - [x] Store analysis history as vectors
  - [x] Enable semantic search
  
- [x] Build RAG System
  - [x] Retrieve relevant past analyses
  - [x] Inject context into LLM prompts
  - [x] Ground responses in real data
  
- [x] Connect all layers
  - [x] Update conversationalAI to use orchestrator
  - [x] Flow: User → Orchestrator → Engines → LLM → Response
  
- [x] Test complete system


## Phase 113: Conversation History Sidebar (ChatGPT-style)

### UI Design
- [x] Add hamburger menu button (☰) in Smart Analysis header
- [x] Create sliding sidebar panel (from left)
- [x] Display list of previous analysis topics
- [x] Show topic title + date for each conversation
- [x] Click on topic to load that conversation
- [x] Add "New Analysis" button at top

### Backend
- [x] Create conversations table in database
- [x] Save each analysis as a conversation
- [x] Create tRPC procedures for CRUD operations
- [x] Link conversations to user (if logged in)

### Features
- [x] Auto-save conversations after analysis
- [x] Load conversation history on sidebar open
- [x] Delete conversation option
- [ ] Search conversations (optional)


## Phase 114: Final Polish & Integration (COMPLETED)

### Bug Fixes
- [x] Fix indicators not showing numbers in Smart Analysis
- [x] Debug emotion vector calculations (fixed Emotion Distribution showing 0%)

### Remove Market Page
- [x] Remove Market page component
- [x] Remove Market route from App.tsx
- [x] Remove Market link from navigation (replaced with Smart Analysis)

### Connect Map to Conversational AI
- [x] Add "Analyze with AI" button on country click
- [x] Navigate to Smart Analysis with country context
- [x] Pass country data to AI for analysis

### Translation Completion
- [x] All 7 languages already available (EN, AR, FR, DE, RU, ES, ZH)

### Full Site Review
- [x] Check all navigation links
- [x] Verify all features work correctly
- [x] Identify disconnected or broken features
- [x] Update "How AmalSense Works" step 2 to reflect new AI flow


## Phase 115: Onboarding, Auto-Language & Blog Review (COMPLETED)

### Onboarding Tour Update
- [x] Update tour steps to reflect new Smart Analysis flow
- [x] Remove references to country selection
- [x] Add step for AI conversational features
- [x] Update tour translations for all 7 languages

### Browser Language Detection
- [x] Automatic browser language detection already exists in I18nProvider
- [x] Default language based on navigator.language (implemented)
- [x] Fallback to English if language not supported (implemented)
- [x] Save user preference to localStorage (implemented)

### Blog Review
- [x] Check Blog page functionality
- [x] Created BlogPost.tsx for full article view
- [x] Added 6 complete articles with full content
- [x] Fixed blog navigation and links


## Phase 116: Comprehensive Project Report (COMPLETED)
- [x] Gather all project information and analyze structure
- [x] Write comprehensive report covering:
  - [x] Project overview and vision
  - [x] Technical architecture (5 layers)
  - [x] Scientific methodology (DCFT, indicators)
  - [x] Features and functionality
  - [x] Technologies used
  - [x] Future roadmap
- [x] Deliver report to user

## Phase 48: Context Menu Feature (NEW)
- [x] Add custom context menu (right-click) in Smart Analysis page with Select All, Copy, Paste options

## Phase 49: Conversational Intelligence Enhancement (NEW)

### Conversational Framing Layer
- [x] Create ConversationFramer engine with intro/outro templates
- [x] Add tone selector (calm advisor / analytical / news-style)
- [x] Implement Decision Compression Layer
- [x] Update AI prompts to start with summary, end with human question

### Chat Interface Improvements
- [x] Add expand/collapse button for chat area
- [x] Improve visual formatting of AI responses (sections with icons)
- [x] Add quick question buttons (predictions, risks, recommendations)
- [x] Add What-If scenario buttons

### Time-based Features
- [x] Add time predictions (24h, 48h, 1 week)
- [x] Add comparison with yesterday/last week
- [x] Show trend indicators in responses

## UI Fixes - Smart Analysis Page
- [x] Make divider between metrics and chat more visible (clear separation)
- [x] Fix chat expand/collapse functionality to work properly

## Semantic Understanding Layer (Completed)
- [x] Create Intent Classifier - keyword-based classification
- [x] Create Semantic Parser - extract entity, domain, direction
- [x] Create Context Builder - add indicators, trend, reasoning rules
- [x] Integrate Semantic Understanding with ConversationalAI
- [x] Write and pass unit tests (19 tests passing)


## Phase 48: Decision Compression + Conversational Framing Layer
- [x] Update AI prompts to start with verdict/summary (no "بصفتي AmalSense AI")
- [x] Add Executive Summary in first 3 lines
- [x] Transform from Analyst to Advisor style
- [x] Add human-style intro templates (calm advisor, analytical, informative)
- [x] End responses with thoughtful questions (not "Ask about predictions")
- [x] Improve chat interface - expand/collapse functionality
- [x] Add visual formatting for response sections


## Phase 50: Remove Public Dashboard
- [x] Remove Dashboard link from main navigation for non-logged users
- [x] Keep Dashboard only for logged-in users


## Phase 51: Real-time Updates Feature
- [x] Create CurrentDateTime component with live clock
- [x] Add "Last Updated" timestamp to indicators
- [x] Add Real-time Updates section to Home page
- [x] Support Libya timezone display


## Phase 52: Decision Compression Layer - Transform from Analyst to Advisor
- [ ] Remove "بصفتي AmalSense AI..." from system prompt
- [ ] Add Executive Summary requirement (first 3 lines = conclusion)
- [ ] Update response structure: Summary → Why → Prediction → Decision Signal → Human Question
- [ ] Implement real Decision Compression in conversationFramer
- [ ] Add human-style closing questions instead of "Ask about predictions..."

## Phase 52: Decision Compression Layer - COMPLETED
- [x] Remove "بصفتي AmalSense AI..." from system prompt
- [x] Add Executive Summary requirement (first 3 lines = conclusion)
- [x] Update response structure: Summary → Why → Prediction → Decision Signal → Human Question
- [x] Implement real Decision Compression in conversationFramer
- [x] Add human-style closing questions instead of "Ask about predictions..."


## Phase 53: Fix Mobile Layout for Smart Analysis Page
- [x] Fix Header overlap on mobile (Conversational Intelligence Agent + AmalSense AI)
- [x] Stack the two panels vertically on mobile instead of side by side
- [x] Fix/hide resize controls on mobile
- [x] Fix Arabic text overlap with "Analyzing:" label
- [x] Improve spacing and borders for mobile view


## Phase 54: Context Menu Improvement
- [x] Show secondary popup with Copy option after Select All is clicked


## Phase 55: Transform AmalSense to Predictive Intelligence
- [ ] Fix Intent Classifier to properly classify "what-if" questions
- [ ] Enable Scenario Engine for future simulation instead of rejection
- [ ] Fix System Prompt to remove "بصفتي AmalSense AI"
- [ ] Enable Decision Compression to start with summary
- [ ] Add what-if keywords detection (لو، ماذا لو، خلال الأسبوع، سيتغير)


## Phase 56: Transform AmalSense to Predictive Intelligence (Scenario Engine)
- [x] Fix Intent Classifier to properly classify "what-if" questions (لو استمر، ماذا لو، كيف سيتغير)
- [x] Create Scenario Engine (scenarioEngine.ts) for future simulation
- [x] Add event impact calculations (dollar_rise, positive_news, political_crisis, etc.)
- [x] Add timeframe multipliers (24h, 48h, 1week, 1month)
- [x] Update System Prompt to encourage scenario simulation instead of rejection
- [x] Add refusal pattern removal in enhanceAIResponse (لا أستطيع التنبؤ)
- [x] Integrate Scenario Engine with ConversationalAI for automatic scenario detection
- [x] Remove robotic introductions (بصفتي AmalSense AI)
- [x] Enable Decision Compression Layer to start with summary


## Phase 57: Fix AI Response Quality Issues (User Report)
- [x] Remove robotic intro "بناءً على تحليلات محركات AmalSense" 
- [x] Enforce Decision Compression - start with summary/judgment directly
- [x] Reduce repetition in response (same info repeated 3+ times)
- [x] Add human closing question instead of "اسأل عن التوقعات..."
- [x] Enforce correct structure: خلاصة → لماذا → توقع زمني → إشارة قرار → سؤال


## Phase 58: Transform AmalSense from Analyzer to Advisory Mind (ChatGPT Feedback)
- [x] Create Decision Compression Layer - compress responses and extract judgments
- [x] Create Response Restructurer - enforce correct structure
- [x] Create Judgment Extractor - extract and place judgment at start
- [x] Remove robotic intro via post-processing (not just regex)
- [x] Enforce structure: خلاصة → إشارة القرار → لماذا → التوقع → سؤال ختامي
- [x] Add "الجرأة المعرفية" - bold judgments instead of descriptions


## Phase 59: Response Builder with Guaranteed Structure + Causal Explainability
- [x] Create ResponseBuilder class - builds response structure 100% by code
- [x] Add Causal Explainability Layer - links emotions to real causes
- [x] Extract causes from news/keywords (غلاء، دولار، سيولة، أزمة)
- [x] Use LLM only for content generation, not structure
- [x] Integrate with ConversationalAI
- [x] Ensure every response has: خلاصة + إشارة قرار + لماذا (مع أسباب) + توقع + سؤال


## Phase 60: Dynamic Template Builder - Context-Aware Responses
- [x] Create Dynamic Template Builder with 3 context variables
- [x] Add userLevel detection (beginner/advanced)
- [x] Add conversationDepth tracking (first_turn/multi_turn)
- [x] Add emotionalState awareness (calm/anxious/urgent)
- [x] Integrate with Response Builder for dynamic output
- [x] Ensure responses adapt to context without being robotic


## Phase 61: User Profile Storage - Persistent User Context
- [ ] Add user_profiles table to database schema
- [ ] Create UserProfileService for profile management
- [ ] Store userLevel, preferredTopics, conversationCount
- [ ] Integrate with Dynamic Template for personalized responses
- [ ] Auto-update profile based on user interactions


## Phase 61: User Profile Storage - Persistent User Context
- [x] Add user_profiles table to database
- [x] Create UserProfileService for profile management
- [x] Store user level (beginner/intermediate/advanced)
- [x] Store preferred topics and countries of interest
- [x] Track technical terms usage for level detection
- [x] Integrate with Dynamic Template for personalized responses
- [x] Auto-update profile on each interaction


## Phase 62: Fix Response Builder Integration (User Report)
- [x] Diagnose why Response Builder is not working - Found: Orchestrator was using LLM directly
- [x] Fix integration with Orchestrator (not ConversationalAI)
- [x] Ensure structured response is used instead of raw LLM output
- [x] Remove robotic intro "بناءً على البيانات المتاحة من محركات AmalSense" - Now using Response Builder
- [x] Remove robotic ending "اسأل عن التوقعات، التوصيات..." - Now using dynamic closing
- [x] Enforce Response Protocol: خلاصة → إشارة قرار → لماذا → توقع → سؤال
- [x] Limit response to 200-300 words maximum - Controlled by Response Builder


## Phase 63: Improve Response Quality - Clean Summary & Contextual Causes
- [x] Fix summary to be linguistically clean (remove question from summary)
- [x] Extract topic/event from question instead of using raw question
- [x] Link "Why" section to specific events from question context
- [x] Add context-aware cause extraction based on question keywords


## Phase 64: Economic Data Layer for Traders
- [x] Add Currency Exchange Rates API (USD, EUR, GBP, LYD, EGP, TND, SAR, AED)
- [x] Add Gold & Silver Prices API (XAU, XAG)
- [x] Add Oil Prices API (Brent, WTI)
- [x] Create Economic Data Service to fetch all data
- [x] Link economic data with emotional analysis
- [x] Add economic context to Response Builder
- [x] Add trader-specific insights and signals (bullish/bearish/neutral)


## Phase 65: Transform from Template Engine to Thinking Engine
- [x] Create Intent Analyzer - classify question type accurately (decision/scenario/comparison/explanation/economic/psychological)
- [x] Create Response Composer - choose response format based on intent
- [x] Economic indicators only appear for economic/trading questions
- [x] Response shape follows question type, not fixed template
- [x] Fix topic extraction - clean topic from question words (هل، ما، كيف، لو)
- [x] Make responses feel like ChatGPT - intelligent and contextual, not robotic
- [x] Integrate Thinking Engine with Orchestrator
- [x] Add dynamic cause generation based on indicators when no specific causes found


## Phase 66: 70 Questions Test Suite & Quality Improvements
- [x] Create test_suite.txt with 70 questions in 10 categories
- [x] Create automated test runner (run_test_suite.ts)
- [x] Test all 70 questions and document results
- [x] Improve patterns for psychological, academic, journalistic questions
- [x] Add specialized content for each question type in buildSummary
- [x] Add specialized causes for psychological/academic/journalistic in buildCauses
- [x] Improve comparison function with actual comparison tables
- [x] Add signal to more question types (not just decision/economic)

### Test Results Summary:
- **Final Score: 78.9/100** (improved from 56.6%)
- Decision: 87.1% | Scenario: 82.9% | Comparison: 88.6%
- Psychological: 90.0% | Journalistic: 88.6%
- Element Coverage: Summary 100%, Signal 79%, Causes 83%, Closing 100%


## Phase 67: Fix "Analyze the collective emotional state for:" Bug (CRITICAL)
- [x] Remove English prompt text from appearing in responses
- [x] Fix Orchestrator to pass clean Arabic question to Thinking Engine
- [x] Test with real questions on platform


## Phase 68: Transform from Poet to Consultant (CRITICAL REBUILD)

### Problem Statement:
Current responses are "beautiful descriptions" not "intelligent analysis"
- User asks "why?" but gets no actual reasons
- Responses describe feelings but don't explain causes
- No actionable decisions or recommendations
- Closing questions are generic ChatGPT-style

### Required Changes:

#### 1. Response Structure - Must Include:
- [x] **Data-driven explanation**: "بناءً على البيانات، نلاحظ أن X وهذا بسبب Y"
- [x] **Actual causes**: For economic questions, include real factors (interest rates, dollar strength, industrial demand)
- [x] **Clear decision signal**: Not just "حذر" but "الموقف: مراقبة أو دخول تدريجي"
- [x] **Actionable recommendation**: What should user DO, not just FEEL

#### 2. For "Why?" Questions:
- [x] Must provide 2-3 actual causes from economic/political context
- [x] Connect causes to the emotional state
- [x] Example: "هذا القلق ناتج عن: ارتفاع الفائدة + قوة الدولار + تباطؤ الطلب"

#### 3. Decision Signal Improvement:
- [x] Change from vague "حذر" to specific "الموقف: مراقبة/شراء تدريجي/انتظار"
- [x] Include reasoning: "لأن المؤشرات تشير إلى..."

#### 4. Smart Closing Questions:
- [x] Replace generic "هل تريد التعمق؟" with specific questions
- [x] Examples: "هل نحلل تأثير استمرار هذا الاتجاه أسبوعًا؟" or "هل نركز على الذهب أم الفضة؟"

### Success Criteria:
After reading the response, user should say:
"فهمت الوضع + عرفت شن أعمل"
NOT just:
"كلام حلو"


## Phase 69: Transform to Long-Form Narrative Responses (ChatGPT Style)

### Current Score: 70% - Need to reach 100%

### What's Working (Keep):
- [x] Real causes (interest rates, dollar strength)
- [x] Clear decision signal with reasoning
- [x] Practical recommendations
- [x] Smart closing questions

### What Needs to Change:

#### 1. Response Style - From Bullet Points to Narrative:
- [x] Remove "التحليل:" header - start with الخلاصة directly
- [x] Write in flowing paragraphs, not bullet points
- [x] Each section should explain WHY, not just WHAT
- [x] Make it feel like a consultant explaining, not a report

#### 2. Clean Language:
- [x] Remove "من الناحية النفسية الجماعية" - too technical
- [x] Remove "تداول حديث حول..." - replace with actual news context
- [x] Fix topic extraction - "ماسباب" should be "أسباب انخفاض"
- [x] Format numbers properly - $2673.10 not $2673.103350503565

#### 3. Hide Economic Data in General Responses:
- [x] Economic indicators (USD, EUR, Gold prices) only in Trading View
- [x] General responses should focus on psychology + causes + decision
- [x] 90% of users don't understand raw price data

#### 4. Stronger Causes:
- [x] Replace "تداول حديث حول..." with specific news headlines
- [x] Example: "تصاعد عناوين إعلامية حول تباطؤ الطلب الصناعي وتحركات الفيدرالي"

### Target Response Format:
```
الخلاصة:
نفسيًا، انخفاض أسعار الذهب والفضة يعكس حالة توتر وقلق واضح في السوق، أكثر من كونه فرصة شراء مريحة.

إشارة القرار: 📈 مراقبة مع استعداد
السوق في وضع دفاعي: الأمل موجود، لكن الحذر هو السلوك الغالب.

لماذا هذا المزاج؟
هذا القلق ناتج عن:
- ارتفاع أسعار الفائدة عالميًا مما يضغط على المعادن الثمينة
- قوة الدولار الأمريكي التي تقلل جاذبية الذهب
- تصاعد عناوين إعلامية حول تباطؤ الطلب الصناعي

التوصية النفسية:
- تأجيل القرارات الكبيرة حاليًا
- الحفاظ على السيولة وانتظار إشارات أوضح

القراءة النفسية:
السوق في حالة مقاومة: خوف من استمرار الهبوط، مع أمل في ارتداد قادم.

هل نحلل ماذا يحدث نفسيًا لو خفّض الفيدرالي أسعار الفائدة؟
```


## Phase 70: Fix ConversationalAI to Use Thinking Engine (CRITICAL)

### Problem:
- Orchestrator uses Thinking Engine v3 ✅
- ConversationalAI uses old responseBuilder ❌
- Smart Analysis page uses ConversationalAI → Old responses appear!

### Solution:
- [x] Replace buildStructuredResponse with think() in ConversationalAI
- [x] Ensure all chat responses use Thinking Engine v3
- [ ] Test on Smart Analysis page


## Phase 71: Build Intelligent Question Understanding System (Cognitive Architecture)

### Philosophy:
AmalSense is NOT a Machine Learning problem - it's a Cognitive System Design problem.
We don't need to "train a model" - we need to "build a mind that thinks".

### Architecture:
```
User Question
     ↓
Question Understanding Engine (فهم السؤال بعمق)
     ↓
Source Selector (أين يبحث عن المعلومات)
     ↓
Context Builder (جمع المعلومات المناسبة)
     ↓
Reasoning Layer (ربط المعلومات بالمنطق)
     ↓
Intelligent Narrator (شرح كعقل يتكلم)
     ↓
Response (رد ذكي مخصص للسؤال)
```

### Components to Build:

#### 1. Question Understanding Engine
- [ ] Extract the REAL question (not just keywords)
- [ ] Identify what the user WANTS to know
- [ ] Detect implicit questions (what they didn't ask but need)
- [ ] Understand the context (why are they asking this?)

#### 2. Source Selector
- [ ] Map question types to data sources
- [ ] Economic questions → Economic data + News
- [ ] Psychological questions → Emotion indicators + Context
- [ ] Decision questions → All sources + Risk analysis
- [ ] Comparison questions → Multiple data points

#### 3. Context Builder
- [ ] Gather relevant information from selected sources
- [ ] Filter noise - only what's relevant to THIS question
- [ ] Build a "knowledge packet" for the question

#### 4. Reasoning Layer
- [ ] Connect indicators to causes
- [ ] Connect causes to implications
- [ ] Connect implications to recommendations
- [ ] Build logical chains: "Because X, therefore Y"

#### 5. Intelligent Narrator
- [ ] Transform reasoning into human language
- [ ] Explain like a consultant, not a robot
- [ ] Use the user's language level
- [ ] Make complex things simple

### Success Criteria:
- Response feels like "a mind is talking"
- Each response is unique to the question
- User understands WHY, not just WHAT
- Response includes: Understanding + Analysis + Insight + Recommendation


## Phase 72: Transform Source Selector to Cognitive Router (CRITICAL FIX)

### Problem:
- Source Selector was designed to "search external sources" (news, APIs)
- This turns AmalSense into "smart Google" or "Arabic Perplexity"
- Loses the unique identity of emotional intelligence system

### Key Insight (from ChatGPT review):
> AmalSense doesn't "search the world" - it "interprets the world"
> This is the difference between an Information System and a Consciousness System

### Solution - Cognitive Router:
Instead of "where to search" → "which mind to activate"

### Internal Engines to Route To:
- [x] Emotion Engine - for emotional state analysis
- [x] Trend Engine - for direction and momentum
- [x] Economic Layer - for financial/trading questions
- [x] Media Bias Engine - for media influence questions
- [x] Social Pattern Engine - for collective behavior
- [x] Decision Engine - for should/shouldn't questions

### Key Difference:
| Source Selector (wrong) | Cognitive Router (correct) |
|------------------------|---------------------------|
| Searches news | Activates Emotion Engine |
| Collects articles | Activates Trend Engine |
| Summarizes texts | Activates Media Bias Engine |
| Information Retrieval | Cognitive Reasoning |

### Golden Rule:
> "يختار أين يبحث" (wrong)
> "يختار كيف يفكر" (correct)

### Implementation:
- [x] Rename sourceSelector.ts to cognitiveRouter.ts
- [x] Replace external source fetching with internal engine activation
- [x] Create routing logic based on question intent
- [x] Update Context Builder to work with engine outputs
- [x] Test with various question types

### Test Results:
- Question "لماذا انخفض سعر الذهب؟" → explanation_engine → emotion_engine → economic_engine → trend_engine
- Question "هل الإعلام عامل تضخيم نفسي؟" → decision_engine → emotion_engine → media_bias_engine → scenario_engine
- Question "هل أشتري الذهب الآن أم أنتظر؟" → decision_engine → emotion_engine → economic_engine → trend_engine → scenario_engine



## Phase 73: Build Complete 11-Layer Cognitive Architecture

### The Vision:
AmalSense is NOT a chatbot or sentiment tool.
AmalSense is a **digital simulation of a mind** that feels, understands, thinks, decides, and reviews itself.

### The 11 Layers (Human Brain ↔ AmalSense):

| # | Layer | Human Brain | AmalSense Component | Status |
|---|-------|-------------|---------------------|--------|
| 1 | Sensory Perception | Receive info from world | Data Ingestion Layer | ✅ Done |
| 2 | Attention | Select what's important | Signal Filtering Engine | ✅ Done |
| 3 | Encoding | Convert signals to symbols | NLP Preprocessing | ✅ Done |
| 4 | Comprehension | Understand meaning & intent | Intent Detection Engine | ✅ Done |
| 5 | Working Memory | Keep current context | Conversation State | ✅ Done |
| 6 | Long-term Memory | Knowledge & experience | Knowledge Base | ✅ Done |
| 7 | Emotional Appraisal | Emotional evaluation | Emotion Engine (DCFT) | ✅ Done |
| 8 | Social Cognition | How society sees it | Collective Intelligence | ⚠️ Partial |
| 9 | Reasoning | Analysis & connection | Thinking Engine | ✅ Done |
| 10 | Executive Function | Decision making | Meta-Decision Layer | ✅ Done |
| 11 | Metacognition | Thinking about thinking | Self-Evaluation Loop | ✅ Done |

### Layer 2: Signal Filtering Engine (Attention)
- [x] Remove noise from input
- [x] Identify trending topics
- [x] Filter duplicates
- [x] Prioritize by relevance

### Layer 3: NLP Preprocessing (Encoding)
- [x] Tokenization
- [x] Text cleaning & normalization
- [x] Language detection
- [x] Entity extraction
- [x] Keyword extraction

### Layer 5: Working Memory (Conversation State)
- [x] Track last N questions
- [x] Track current topic
- [x] Track conversation context
- [x] Enable follow-up questions
- [x] Remember user preferences

### Layer 6: Knowledge Base (Long-term Memory)
- [x] Causal relationships (interest rates ↔ gold ↔ dollar)
- [x] Historical patterns (what happened last time?)
- [x] Expert knowledge (rules and facts)
- [x] Accumulated experience

### Layer 11: Metacognition (Self-Evaluation)
- [x] Confidence scoring
- [x] Bias detection
- [x] Quality assessment
- [x] "Do I need more data?"
- [x] Self-correction capability

### Test Results (All 11 Layers Working):
| Question | Intent | Engines Activated | Knowledge | Confidence |
|----------|--------|-------------------|-----------|------------|
| لماذا انخفض الذهب؟ | understand_cause | explanation→emotion→economic→trend | 7 items | 78% |
| هل الإعلام عامل تضخيم؟ | make_decision | decision→emotion→media_bias→scenario | 2 items | 68% |
| هل أشتري الذهب؟ | make_decision | decision→emotion→economic→trend→scenario | 7 items | 72% |
| المزاج تجاه التعليم؟ | learn_concept | emotion | 1 item | 55% |

### Golden Quote:
> "AmalSense is a digital simulation of a mind that feels, understands, thinks, decides, and reviews itself."



## Phase 74: Apply "What → Why → So what" Philosophy - Transform to Collective Awareness Engine

### The Core Problem:
- Current responses are generic and template-based
- Same response structure for all questions
- "السوق في حالة حيرة" appears even for education questions!
- Causes are too general, not specific to the topic

### The Solution - Every Response Must Have 3 Parts:

#### 1. What (شن يحسّوا) - The Indicators
- Show the emotional state clearly
- GMI, CFI, HRI values
- But this is just the SENSOR, not the answer

#### 2. Why (ليش يحسّوا هكذا) - The Real Causes
- MUST be specific to the TOPIC of the question
- Gold question → Gold-specific causes (Fed, dollar, interest rates)
- Education question → Education-specific causes (curriculum, jobs, quality)
- Libya question → Libya-specific context

#### 3. So What (ماذا يعني للمجتمع) - The Social Meaning
- What does this emotional state mean for society?
- Is it temporary or lasting?
- Will it escalate or calm down?
- What should people/decision-makers do?

### Implementation Tasks:
- [ ] Create AwarenessResponseBuilder - new response structure with What/Why/So what
- [ ] Create TopicCausesDatabase - causes specific to each topic domain
- [ ] Create SocialMeaningGenerator - interprets what emotions mean for society
- [ ] Connect to Cognitive Architecture
- [ ] Ensure each response is UNIQUE to the question, not template-based

### Golden Rule:
> AmalSense لا تقول "شن يحسّوا الناس"
> AmalSense تقول "ليش يحسّوا هكذا، وماذا يعني ذلك للمجتمع"

### Success Criteria:
- Question about gold → Gold-specific causes and meaning
- Question about education → Education-specific causes and meaning
- Question about Libya → Libya-specific context and implications
- NO generic responses that fit any question



## Phase 47: What → Why → So what Philosophy Implementation (NEW)

### Core Philosophy
- [x] Transform AmalSense from emotion counter to collective awareness analyzer
- [x] Implement three-part response structure: What → Why → So what
- [x] Create topic-specific causes (not generic responses)
- [x] Add social meaning interpretation

### Implementation Tasks
- [x] Create AwarenessResponseBuilder - new response structure with What/Why/So what
- [x] Create TopicCausesDatabase - causes specific to each topic domain (7 domains)
  - gold_metals: Gold, silver, precious metals
  - currency: Dollar, exchange rates, currencies
  - education: Schools, universities, curriculum
  - media: News, journalism, social media
  - politics: Elections, government, policies
  - economy: Inflation, prices, employment
  - libya: Libya-specific issues
- [x] Create SocialMeaningGenerator - interprets what emotions mean for society
- [x] Connect to Cognitive Architecture
- [x] Ensure each response is UNIQUE to the question, not template-based
- [x] Integrate with Orchestrator for live responses
- [x] Write unit tests (16 tests passing)

### Response Structure
- **What**: Summary of current emotional state with indicators
- **Why**: Topic-specific causes (not generic "market confusion")
- **So What**: Social meaning, implications, and actionable recommendations
- **Closing Question**: Context-aware follow-up question



## Phase 48: إضافة مجالات جديدة لقاعدة بيانات الأسباب (NEW)

### المجالات الجديدة المطلوبة
- [x] psychology: علم النفس والمشاعر والأنماط الدورية
- [x] health: الصحة والأوبئة والرعاية الصحية
- [x] technology: التكنولوجيا والذكاء الاصطناعي
- [x] sports: الرياضة والمنافسات
- [x] environment: البيئة والمناخ
- [x] social: القضايا الاجتماعية والعلاقات
- [x] security: الأمن والصراعات
- [x] real_estate: العقارات والإسكان
- [x] energy: الطاقة والوقود
- [x] employment: التوظيف وسوق العمل

### الإنجازات
- [x] إضافة 10 مجالات جديدة لقاعدة بيانات الأسباب
- [x] تحديث buildContextParagraph للمجالات الجديدة
- [x] إضافة أسئلة إغلاق للمجالات الجديدة
- [x] 16 اختبار ناجح

