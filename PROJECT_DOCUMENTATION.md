# AmalSense - التوثيق الشامل للمشروع

## نظرة عامة

**AmalSense** هو محرك ذكاء عاطفي جماعي رقمي مبني على نظرية **DCFT (Digital Consciousness Field Theory)** التي طورتها **آمال رضوان**. المنصة تحلل المشاعر الجماعية من مصادر رقمية متعددة حول العالم وتحولها إلى مؤشرات قابلة للقياس.

---

## البنية العامة للمشروع

```
amalsense/
├── client/                    # Frontend (React 19 + Tailwind 4)
│   ├── src/
│   │   ├── pages/            # صفحات التطبيق
│   │   ├── components/       # مكونات قابلة لإعادة الاستخدام
│   │   └── lib/              # مكتبات مساعدة
├── server/                    # Backend (Express + tRPC)
│   ├── _core/                # البنية التحتية الأساسية
│   ├── dcft/                 # محرك DCFT (النواة)
│   └── *.ts                  # خدمات وموجهات
├── drizzle/                   # قاعدة البيانات (MySQL/TiDB)
│   └── schema.ts             # تعريف الجداول
└── shared/                    # أكواد مشتركة
```

---

## الـ Backend - الطبقات والمكونات

### 1. طبقة قاعدة البيانات (Database Layer)

قاعدة البيانات تستخدم **Drizzle ORM** مع **MySQL/TiDB** وتحتوي على **18 جدول** رئيسي:

| الجدول | الوصف | الحقول الرئيسية |
|--------|-------|-----------------|
| `users` | المستخدمين والاشتراكات | openId, role, subscriptionTier |
| `emotionIndices` | المؤشرات العاطفية الرئيسية | gmi, cfi, hri, confidence |
| `emotionAnalyses` | تحليلات المشاعر الفردية | headline, joy, fear, anger, sadness, hope, curiosity |
| `countryEmotionIndices` | مؤشرات الدول | countryCode, gmi, cfi, hri |
| `analysisSessions` | جلسات التحليل | query, sourcesCount, dominantEmotion |
| `sourceAnalyses` | تحليلات المصادر | platform, content, sentimentScore |
| `dailyAggregates` | التجميعات اليومية | avgGmi, avgCfi, avgHri, topEmotion |
| `trendAlerts` | تنبيهات التغيرات | alertType, metric, changePercent, severity |
| `customAlerts` | تنبيهات مخصصة | metric, condition, threshold, notifyMethod |
| `classifiedAnalyses` | تحليلات مصنفة | domain, sensitivity, emotionalRiskScore |

### 2. طبقة الخدمات (Services Layer)

المشروع يحتوي على **83 ملف TypeScript** في مجلد `server/`، أهمها:

| الملف | الوظيفة |
|-------|---------|
| `routers.ts` | الموجهات الرئيسية (tRPC) - 2287 سطر |
| `hybridAnalyzer.ts` | المحلل الهجين DCFT+AI - 690 سطر |
| `unifiedDataService.ts` | خدمة البيانات الموحدة |
| `aiSentimentAnalyzer.ts` | محلل المشاعر بالذكاء الاصطناعي |
| `countryEmotionAnalyzer.ts` | محلل مشاعر الدول |
| `socialMediaService.ts` | خدمة السوشيال ميديا |
| `gnewsService.ts` | خدمة أخبار GNews |
| `majorNewsRssService.ts` | خدمة الأخبار الكبرى (BBC, Reuters, CNN) |

---

## المحرك الأساسي - DCFT Engine

### البنية الثلاثية للمحرك

المحرك مبني على **3 طبقات** متتالية:

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer 3: Awareness                        │
│     (إخراج المؤشرات العالمية والتنبيهات)                     │
├─────────────────────────────────────────────────────────────┤
│                    Layer 2: Cognitive                        │
│     (حساب D(t) و RI(e,t) - المعادلات الأساسية)              │
├─────────────────────────────────────────────────────────────┤
│                    Layer 1: Perception                       │
│     (استقبال ومعالجة البيانات الخام)                         │
└─────────────────────────────────────────────────────────────┘
```

### المعادلات الأساسية

**معادلة حقل الوعي الرقمي:**
```
D(t) = Σ [Ei × Wi × ΔTi]
```
- **Ei**: متجه المشاعر (Affective Vector)
- **Wi**: وزن التأثير (Influence Weight)
- **ΔTi**: الفارق الزمني

**معادلة مؤشر الرنين:**
```
RI(e,t) = Σ (AVi × Wi × e^(-λΔt))
```
- **AVi**: قيمة المشاعر
- **λ**: معدل الاضمحلال الزمني

### ملفات المحرك (مجلد `dcft/`)

| الملف | الوظيفة |
|-------|---------|
| `dcftEngine.ts` | المحرك الرئيسي - ينسق بين الطبقات الثلاث |
| `perceptionLayer.ts` | طبقة الإدراك - معالجة المدخلات الخام |
| `cognitiveLayer.ts` | طبقة المعرفة - حساب D(t) و RI(e,t) |
| `awarenessLayer.ts` | طبقة الوعي - إخراج المؤشرات والتنبيهات |
| `affectiveVector.ts` | متجه المشاعر (6 مشاعر أساسية) |
| `temporalDecay.ts` | الاضمحلال الزمني للمشاعر |
| `influenceWeight.ts` | حساب أوزان التأثير |
| `metaLearning.ts` | التعلم الذاتي للمحرك |
| `vocabularyAdapter.ts` | محول المفردات اللغوية |
| `feedbackLoop.ts` | حلقة التغذية الراجعة |

---

## تدفق البيانات - من الإدخال إلى الإخراج

### المرحلة 1: جمع البيانات (Data Collection)

```
┌─────────────────────────────────────────────────────────────┐
│                    مصادر البيانات الحقيقية                   │
├─────────────────┬─────────────────┬─────────────────────────┤
│   الأخبار       │  السوشيال ميديا │     RSS Feeds          │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • News API      │ • Reddit        │ • BBC Arabic/English   │
│ • GNews API     │ • Bluesky       │ • Reuters              │
│ • Google News   │ • Mastodon      │ • Al Jazeera           │
│                 │ • YouTube       │ • CNN                  │
│                 │ • Telegram      │                        │
└─────────────────┴─────────────────┴─────────────────────────┘
```

**أوزان المصادر:**
```typescript
const SOURCE_WEIGHTS = {
  major_news: 0.95,  // BBC, Reuters, Al Jazeera, CNN
  google_rss: 0.90,  // Google News RSS
  gnews: 0.88,       // GNews API
  news: 0.85,        // News API
  reddit: 0.65,      // Reddit
  telegram: 0.60,    // Telegram
  bluesky: 0.60,     // Bluesky
  mastodon: 0.55,    // Mastodon
  youtube: 0.50,     // YouTube
};
```

### المرحلة 2: تنظيف البيانات (Data Cleaning)

```
البيانات الخام → dataCleaningLayer.ts → بيانات نظيفة
```

- إزالة الـ Spam والمحتوى المكرر
- تصفية النصوص القصيرة جداً
- تطبيع النصوص (Unicode normalization)
- حساب جودة كل نص (Quality Score)

### المرحلة 3: التحليل الهجين (Hybrid Analysis)

```
┌─────────────────────────────────────────────────────────────┐
│                    Hybrid DCFT-AI Analyzer                   │
│                                                              │
│   D_hybrid(t) = α × D_DCFT(t) + β × D_AI(t)                │
│                                                              │
│   حيث: α = 0.7 (DCFT) و β = 0.3 (AI)                       │
└─────────────────────────────────────────────────────────────┘
```

**خطوات التحليل:**

1. **Meta-Learning** - تصنيف السياق قبل التحليل
2. **DCFT Analysis** (70%) - التحليل الأساسي
3. **AI Enhancement** (30%) - تحسين بالذكاء الاصطناعي
4. **Fusion** - دمج النتائج

### المرحلة 4: حساب المؤشرات (Index Calculation)

**المؤشرات الثلاثة الرئيسية:**

| المؤشر | الاسم | النطاق | الوصف |
|--------|-------|--------|-------|
| **GMI** | Global Mood Index | -100 إلى +100 | المزاج العام الجماعي |
| **CFI** | Collective Fear Index | 0 إلى 100 | مستوى الخوف الجماعي |
| **HRI** | Hope & Resilience Index | 0 إلى 100 | مستوى الأمل والصمود |

**متجه المشاعر (Affective Vector):**
```typescript
interface AffectiveVector {
  joy: number;       // الفرح (0-100)
  fear: number;      // الخوف (0-100)
  anger: number;     // الغضب (0-100)
  sadness: number;   // الحزن (0-100)
  hope: number;      // الأمل (0-100)
  curiosity: number; // الفضول (0-100)
}
```

### المرحلة 5: الإخراج (Output)

```
┌─────────────────────────────────────────────────────────────┐
│                       المخرجات النهائية                      │
├─────────────────────────────────────────────────────────────┤
│ • المؤشرات العالمية (GMI, CFI, HRI)                        │
│ • متجه المشاعر (6 مشاعر)                                   │
│ • المشاعر السائدة (Dominant Emotion)                        │
│ • مستوى التنبيه (Alert Level)                              │
│ • المرحلة العاطفية (Emotional Phase)                        │
│ • تقرير الشفافية (Transparency Report)                      │
│ • رؤى وتحليلات (Insights)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## الموجهات (Routers) - نقاط الوصول API

### emotion Router
```typescript
emotion.analyzeHeadline    // تحليل عنوان واحد
emotion.getLatestIndices   // أحدث المؤشرات
emotion.getHistoricalIndices // المؤشرات التاريخية
emotion.getRecentAnalyses  // التحليلات الأخيرة
```

### map Router
```typescript
map.getAllCountriesEmotions      // مشاعر جميع الدول
map.getCountryEmotions           // مشاعر دولة محددة
map.getCountryHistoricalData     // بيانات تاريخية لدولة
map.getMultipleCountriesHistoricalData // بيانات عدة دول
```

### realtime Router
```typescript
realtime.analyzeWithAI           // تحليل بالذكاء الاصطناعي
realtime.analyzeCountryNews      // تحليل أخبار دولة
realtime.analyzeTopicGlobally    // تحليل موضوع عالمياً
realtime.getGlobalMood           // المزاج العالمي
```

### admin Router
```typescript
admin.getStats                   // إحصائيات المنصة
admin.getUsers                   // قائمة المستخدمين
admin.updateUserRole             // تحديث صلاحيات
admin.confirmPayment             // تأكيد الدفع
```

---

## الميزات المتقدمة

### 1. التعلم الذاتي (Meta-Learning)
```typescript
// يتعلم من الأنماط السابقة
metaLearningEngine.learnFromFeedback(feedback);
metaLearningEngine.discoverPatterns(analyses);
```

### 2. محول المفردات (Vocabulary Adapter)
```typescript
// يتكيف مع اللهجات والثقافات المختلفة
vocabularyAdapter.adaptToRegion('arab');
vocabularyAdapter.detectDialect(text);
```

### 3. التحليل متعدد اللغات (Multilingual)
```typescript
// يدعم العربية والإنجليزية وغيرها
detectLanguage(text);
analyzeMultilingual(texts);
```

### 4. نظام التنبيهات (Alert System)
```typescript
// تنبيهات عند تغيرات حادة
trendAlerts: spike, drop, anomaly, trend_change
severity: low, medium, high, critical
```

---

## المنتجات التجارية

### 1. Journalist Dashboard
- اكتشاف القصص الساخنة
- فلتر الدول (19 دولة عربية)
- تحليل المشاعر لكل قصة
- مقارنة ردود الفعل بين الدول

### 2. Researcher Dashboard
- 6 متغيرات بحثية جاهزة
- مقارنة 15 دولة
- تصدير CSV/JSON/Excel
- Citation Generator (APA/MLA/Chicago)
- API Documentation

### 3. AmalSense Markets
- Fear Spike Index
- Sentiment Momentum
- Hype Index
- مقارنة 6 أصول مالية
- Signal Cards للتنبيهات

---

## الخلاصة

**AmalSense** هو نظام متكامل يجمع بين:
- **نظرية علمية** (DCFT) كأساس
- **ذكاء اصطناعي** للتحسين
- **مصادر بيانات حقيقية** متعددة
- **واجهات متخصصة** لكل فئة مستخدمين

المحرك يعالج البيانات عبر **5 مراحل** متتالية:
1. جمع البيانات → 2. التنظيف → 3. التحليل الهجين → 4. حساب المؤشرات → 5. الإخراج

---

*تم إعداد هذا التوثيق بواسطة Manus AI - فبراير 2026*
