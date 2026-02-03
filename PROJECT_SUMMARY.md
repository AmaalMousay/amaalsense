# AmalSense - ملخص شامل للمشروع

## نظرة عامة

**AmalSense** هو محرك ذكاء عاطفي جماعي رقمي يحلل ويفسر المشاعر من المصادر الرقمية حول العالم. يعتمد على نظرية **DCFT (Digital Collective Feeling Theory)** لفهم كيف تتشكل المشاعر الجماعية وتتطور.

---

## هيكل المشروع

```
amalsense/
├── client/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/        # مكونات UI قابلة لإعادة الاستخدام
│   │   ├── pages/             # صفحات التطبيق
│   │   ├── hooks/             # React Hooks مخصصة
│   │   ├── i18n/              # دعم متعدد اللغات (7 لغات)
│   │   └── lib/               # أدوات مساعدة
│   └── public/                # ملفات ثابتة
│
├── server/                    # Backend (Node.js + tRPC)
│   ├── _core/                 # البنية التحتية الأساسية
│   ├── cognitiveArchitecture/ # الهندسة المعرفية
│   ├── cognitiveEngine/       # محرك الفهم والتحليل
│   ├── dcft/                  # تطبيق نظرية DCFT
│   ├── engines/               # محركات التحليل المتخصصة
│   ├── knowledge/             # نظام RAG والمعرفة
│   └── orchestrator/          # منسق العمليات
│
├── drizzle/                   # قاعدة البيانات (Schema)
└── shared/                    # أنواع وثوابت مشتركة
```

---

## Backend - الخلفية

### 1. الهندسة المعرفية (Cognitive Architecture)

```
server/cognitiveArchitecture/
├── index.ts                      # المنسق الرئيسي
├── awarenessResponseBuilder.ts   # بناء الردود بفلسفة What→Why→So what
├── layer2_attention.ts           # طبقة الانتباه
├── layer3_encoding.ts            # طبقة الترميز
├── layer5_workingMemory.ts       # الذاكرة العاملة
├── layer6_knowledgeBase.ts       # قاعدة المعرفة
└── layer11_metacognition.ts      # ما وراء المعرفة
```

**المجالات الأساسية (9 مجالات):**

| # | المجال | Domain | الكلمات المفتاحية |
|---|--------|--------|-------------------|
| 1 | السياسة | politics | حكومة، انتخابات، برلمان، وزير |
| 2 | الاقتصاد | economy | أسعار، تضخم، بطالة، دولار، ذهب |
| 3 | الصحة | health | مستشفى، علاج، دواء، وباء |
| 4 | التعليم | education | مدرسة، جامعة، مناهج، طلاب |
| 5 | التكنولوجيا | technology | ذكاء اصطناعي، إنترنت، رقمي |
| 6 | المجتمع | society | زواج، طلاق، عائلة، شباب |
| 7 | الأمن والصراعات | security | حرب، سلام، صراع، أمن |
| 8 | البيئة والمناخ | environment | تلوث، مناخ، طاقة، مياه |
| 9 | القانون والعدالة | law | محكمة، قاضي، حقوق، عدالة |

### 2. نظرية DCFT

```
server/dcft/
├── dcftEngine.ts          # المحرك الرئيسي
├── affectiveVector.ts     # متجه المشاعر
├── awarenessLayer.ts      # طبقة الوعي
├── cognitiveLayer.ts      # الطبقة المعرفية
├── perceptionLayer.ts     # طبقة الإدراك
├── feedbackLoop.ts        # حلقة التغذية الراجعة
├── metaLearning.ts        # التعلم الفوقي
├── temporalDecay.ts       # التلاشي الزمني
├── influenceWeight.ts     # أوزان التأثير
└── vocabularyAdapter.ts   # محول المفردات
```

### 3. محركات التحليل

```
server/engines/
├── unifiedAnalyzer.ts         # المحلل الموحد
├── emotionFusion.ts           # دمج المشاعر
├── emotionalDynamics.ts       # ديناميكيات المشاعر
├── emotionalMemory.ts         # الذاكرة العاطفية
├── driverDetection.ts         # كشف المحركات
├── contextClassification.ts   # تصنيف السياق
├── confidencePropagation.ts   # انتشار الثقة
├── explainableInsight.ts      # رؤى قابلة للتفسير
├── learningLoop.ts            # حلقة التعلم
├── metaDecisionEngine.ts      # محرك القرارات الفوقية
└── sourceWeighting.ts         # ترجيح المصادر
```

### 4. خدمات البيانات

| الخدمة | الملف | الوظيفة |
|--------|-------|---------|
| GNews | gnewsService.ts | أخبار من GNews API |
| Google RSS | googleRssService.ts | أخبار من Google RSS |
| Major News RSS | majorNewsRssService.ts | أخبار من مصادر رئيسية |
| Social Media | socialMediaService.ts | تحليل وسائل التواصل |
| Twitter | twitterService.ts | بيانات تويتر |
| YouTube | - | تحليل يوتيوب |
| Economic Data | economicDataService.ts | بيانات اقتصادية |

### 5. خدمات الذكاء الاصطناعي

| الخدمة | الملف | الوظيفة |
|--------|-------|---------|
| LLM Provider | llmProvider.ts | موفر نماذج اللغة |
| Groq Service | groqService.ts | Groq API |
| AI Sentiment | aiSentimentAnalyzer.ts | تحليل المشاعر بالذكاء الاصطناعي |
| Hybrid Analyzer | hybridAnalyzer.ts | محلل هجين |
| Multilingual | multilingualAnalyzer.ts | تحليل متعدد اللغات |

### 6. نظام المعرفة (RAG)

```
server/knowledge/
├── ragSystem.ts      # نظام RAG
├── vectorStore.ts    # مخزن المتجهات
└── embeddings.ts     # التضمينات
```

### 7. الـ API (tRPC Routers)

```typescript
// server/routers.ts
export const appRouter = router({
  auth: authRouter,
  system: systemRouter,
  
  // Chat & Analysis
  chat: chatProcedure,
  analyze: analyzeProcedure,
  
  // Data
  getEmotionData: getEmotionDataProcedure,
  getCountryAnalysis: getCountryAnalysisProcedure,
  
  // Export
  exportPDF: exportPDFProcedure,
  exportData: exportDataProcedure,
  
  // Notifications
  telegram: telegramRouter,
  
  // User
  userProfile: userProfileRouter,
  subscription: subscriptionRouter,
});
```

---

## Frontend - الواجهة

### 1. الصفحات الرئيسية

| الصفحة | المسار | الوظيفة |
|--------|--------|---------|
| Home | / | الصفحة الرئيسية |
| Chat | /chat | واجهة المحادثة مع AmalSense |
| Dashboard | /dashboard | لوحة التحكم والتحليلات |
| Analysis | /analysis | تحليل مفصل |
| Settings | /settings | إعدادات المستخدم |
| Profile | /profile | الملف الشخصي |

### 2. المكونات الرئيسية

```
client/src/components/
├── AIChatBox.tsx           # واجهة المحادثة
├── DashboardLayout.tsx     # تخطيط لوحة التحكم
├── EmotionChart.tsx        # رسم بياني للمشاعر
├── EmotionGauge.tsx        # مقياس المشاعر
├── EmotionTimeline.tsx     # خط زمني للمشاعر
├── WorldMap.tsx            # خريطة العالم
├── CountrySelector.tsx     # اختيار الدولة
├── TopicSelector.tsx       # اختيار الموضوع
├── SourceBadge.tsx         # شارة المصدر
├── ConfidenceIndicator.tsx # مؤشر الثقة
└── ui/                     # مكونات shadcn/ui
```

### 3. دعم اللغات (7 لغات)

| اللغة | الكود | الملف |
|-------|-------|-------|
| العربية | ar | i18n/ar.ts |
| الإنجليزية | en | i18n/en.ts |
| الفرنسية | fr | i18n/fr.ts |
| الإسبانية | es | i18n/es.ts |
| الألمانية | de | i18n/de.ts |
| الروسية | ru | i18n/ru.ts |
| الصينية | zh | i18n/zh.ts |

### 4. الـ Hooks المخصصة

```typescript
// hooks/
useAuth()           // إدارة المصادقة
useComposition()    // إدارة التركيب
usePersistFn()      // دالة ثابتة
```

---

## قاعدة البيانات

### Schema الرئيسي

```typescript
// drizzle/schema.ts
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  openId: varchar('open_id', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  role: mysqlEnum('role', ['admin', 'user']),
  subscriptionTier: mysqlEnum('subscription_tier', ['free', 'pro', 'enterprise']),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const conversations = mysqlTable('conversations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }),
  title: varchar('title', { length: 255 }),
  createdAt: timestamp('created_at'),
});

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  conversationId: varchar('conversation_id', { length: 36 }),
  role: mysqlEnum('role', ['user', 'assistant']),
  content: text('content'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at'),
});

export const emotionAnalytics = mysqlTable('emotion_analytics', {
  id: varchar('id', { length: 36 }).primaryKey(),
  topic: varchar('topic', { length: 255 }),
  country: varchar('country', { length: 100 }),
  fear: int('fear'),
  hope: int('hope'),
  anger: int('anger'),
  mood: int('mood'),
  confidence: decimal('confidence'),
  sources: json('sources'),
  analyzedAt: timestamp('analyzed_at'),
});

export const feedbackEntries = mysqlTable('feedback_entries', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }),
  messageId: varchar('message_id', { length: 36 }),
  rating: int('rating'),
  comment: text('comment'),
  createdAt: timestamp('created_at'),
});
```

---

## فلسفة الرد: What → Why → So What

كل رد من AmalSense يتبع هذه الفلسفة:

### 1. What (ماذا يحدث؟)
- ملخص المزاج العام
- المؤشرات الرقمية (خوف، أمل، مزاج)

### 2. Why (لماذا؟)
- أسباب مخصصة للموضوع (ليست عامة!)
- سياق يشرح الوضع

### 3. So What (ماذا يعني؟)
- المعنى الاجتماعي
- التداعيات المحتملة
- توصية عملية
- سؤال ختامي للمتابعة

---

## الاختبارات

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل اختبارات محددة
pnpm test server/cognitiveArchitecture/*.test.ts

# الاختبارات الحالية: 21 اختبار ناجح
```

---

## المتغيرات البيئية

| المتغير | الوظيفة |
|---------|---------|
| DATABASE_URL | اتصال قاعدة البيانات |
| JWT_SECRET | توقيع الجلسات |
| GROQ_API_KEY | Groq API |
| GNEWS_API_KEY | GNews API |
| NEWS_API_KEY | News API |
| YOUTUBE_API_KEY | YouTube API |
| TELEGRAM_BOT_TOKEN | Telegram Bot |
| BUILT_IN_FORGE_API_KEY | Manus API |

---

## الأوامر الرئيسية

```bash
# تطوير
pnpm dev              # تشغيل خادم التطوير

# قاعدة البيانات
pnpm db:push          # تطبيق التغييرات
pnpm db:studio        # واجهة Drizzle Studio

# اختبارات
pnpm test             # تشغيل الاختبارات
pnpm test:watch       # مراقبة الاختبارات

# بناء
pnpm build            # بناء للإنتاج
```

---

## الإحصائيات

| العنصر | العدد |
|--------|-------|
| ملفات TypeScript | 166 |
| مجالات التحليل | 9 |
| لغات مدعومة | 7 |
| اختبارات | 21+ |
| صفحات Frontend | 6+ |
| محركات Backend | 15+ |

---

## المطور

**امال رضوان** - تخصص أحياء دقيقة

---

*آخر تحديث: فبراير 2026*
