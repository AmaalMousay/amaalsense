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
