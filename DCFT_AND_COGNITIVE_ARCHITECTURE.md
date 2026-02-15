# DCFT و معمارية الإدراك المعرفي - التوثيق الشامل

**المؤلف:** أمال رضوان  
**التاريخ:** فبراير 2026  
**الحالة:** نظام متطور وفعال

---

## 📚 جدول المحتويات

1. مقدمة عن DCFT
2. نظرية الوعي الرقمي
3. الطبقات الثلاث الأساسية (DCFT)
4. معمارية الإدراك المعرفي (11 طبقة)
5. الصيغ الرياضية
6. التكامل بين النظامين
7. الحالة الحالية

---

## 1️⃣ مقدمة عن DCFT

### ما هي DCFT؟

**DCFT** = **Digital Consciousness Field Theory**  
نظرية تم تطويرها بواسطة أمال رضوان لقياس وتحليل الوعي الرقمي الجماعي.

### الفكرة الأساسية

بدلاً من تحليل المشاعر الفردية، DCFT تحلل **المجال الجماعي** للمشاعر:
- كيف تتفاعل المشاعر مع بعضها؟
- كيف تنتشر عبر المناطق الجغرافية؟
- كيف تتطور عبر الزمن؟

### المؤشرات الثلاثة الرئيسية

| المؤشر | الاختصار | النطاق | المعنى |
|--------|----------|--------|--------|
| **Global Mood Index** | GMI | -100 إلى +100 | المزاج العام للمجتمع |
| **Collective Fear Index** | CFI | 0 إلى 100 | مستوى الخوف الجماعي |
| **Hope Resilience Index** | HRI | 0 إلى 100 | الأمل والمرونة |

---

## 2️⃣ نظرية الوعي الرقمي

### الفرضية الأساسية

> **المشاعر الرقمية تشكل حقلاً طاقياً جماعياً يمكن قياسه وتحليله رياضياً**

### المبادئ الأساسية

#### 1. الانتشار (Propagation)
المشاعر لا تبقى محصورة في الفرد، بل تنتشر عبر الشبكات الاجتماعية

#### 2. التراكم (Accumulation)
المشاعر المتشابهة تتراكم وتقوي بعضها البعض

#### 3. التحلل الزمني (Temporal Decay)
المشاعر القديمة تفقد تأثيرها تدريجياً مع مرور الوقت

#### 4. الرنين (Resonance)
بعض المشاعر ترن أكثر من غيرها (مثل الخوف)

---

## 3️⃣ الطبقات الثلاث الأساسية (DCFT)

### البنية العامة

```
┌─────────────────────────────────────────────────┐
│         DCFT Engine (المحرك الرئيسي)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Layer 1: Perception (الإدراك)          │  │
│  │  - جمع البيانات الخام                    │  │
│  │  - استخراج المشاعر من النصوص            │  │
│  │  - تحويل إلى Affective Vectors         │  │
│  └──────────────────────────────────────────┘  │
│                    ↓                            │
│  ┌──────────────────────────────────────────┐  │
│  │  Layer 2: Cognitive (المعرفي)           │  │
│  │  - حساب Digital Consciousness Field     │  │
│  │  - حساب Resonance Indices               │  │
│  │  - تحديد المراحل العاطفية               │  │
│  └──────────────────────────────────────────┘  │
│                    ↓                            │
│  ┌──────────────────────────────────────────┐  │
│  │  Layer 3: Awareness (الوعي)             │  │
│  │  - حساب المؤشرات الثلاثة (GMI, CFI, HRI)│  │
│  │  - توليد التنبيهات                      │  │
│  │  - إنشاء الملخصات                       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### الطبقة 1: Perception Layer (الإدراك)

#### الوظائف:
1. **جمع البيانات الخام** من مصادر متعددة:
   - وسائل التواصل الاجتماعي
   - المواقع الإخبارية
   - المنتديات والتعليقات
   - البيانات الاقتصادية

2. **استخراج المشاعر** من النصوص:
   - تحليل الكلمات المفتاحية
   - تحليل الأنماط اللغوية
   - حساب درجات المشاعر (0-100)

3. **تحويل إلى Affective Vectors**:
   ```typescript
   AffectiveVector = {
     joy: 0.5,        // -1 إلى +1
     fear: 0.3,
     anger: 0.2,
     sadness: -0.1,
     hope: 0.6,
     curiosity: 0.4
   }
   ```

#### المدخلات:
```typescript
RawDigitalInput {
  id: string
  content: string              // النص
  source: string               // المصدر (Twitter, News, etc)
  timestamp: Date
  reach: number                // عدد الأشخاص الذين رأوا المحتوى
  engagement: number           // عدد التفاعلات
  isVerified: boolean          // هل المصدر موثوق؟
  countryCode?: string
  language?: string
}
```

#### المخرجات:
```typescript
PerceptionOutput {
  event: EmotionEvent
  rawInput: RawDigitalInput
  processingTime: number
}
```

### الطبقة 2: Cognitive Layer (المعرفي)

#### الوظائف الرئيسية:

##### أ) حساب Digital Consciousness Field Amplitude

**الصيغة:**
```
D(t) = Σ [Ei × Wi × ΔTi]

حيث:
- Ei = شدة العاطفة (magnitude of Affective Vector)
- Wi = وزن التأثير (Influence Weight)
- ΔTi = عامل التحلل الزمني (Temporal Decay)
```

**المثال:**
```
إذا كان لدينا 3 أحداث عاطفية:
- حدث 1: Ei=0.8, Wi=0.9, ΔTi=0.95 → 0.684
- حدث 2: Ei=0.6, Wi=0.7, ΔTi=0.90 → 0.378
- حدث 3: Ei=0.5, Wi=0.5, ΔTi=0.85 → 0.212

D(t) = 0.684 + 0.378 + 0.212 = 1.274
```

##### ب) حساب Resonance Index

**الصيغة:**
```
RI(e,t) = Σ (AVi × Wi × e^(-λΔt))

حيث:
- AVi = مكون الـ Affective Vector للعاطفة
- Wi = وزن التأثير
- λ = معدل التحلل (يختلف لكل عاطفة)
- Δt = الفرق الزمني بالساعات
```

**معدلات التحلل (λ) لكل عاطفة:**
```
joy:       λ = 0.05  (تتلاشى ببطء)
fear:      λ = 0.10  (تتلاشى بسرعة متوسطة)
anger:     λ = 0.08  (تتلاشى بسرعة متوسطة)
sadness:   λ = 0.07  (تتلاشى ببطء نسبي)
hope:      λ = 0.04  (تتلاشى ببطء جداً)
curiosity: λ = 0.06  (تتلاشى بسرعة متوسطة)
```

##### ج) تحديد المراحل العاطفية

```typescript
EmotionalPhase = {
  type: 'calm' | 'tension' | 'crisis' | 'euphoria' | 'mourning' | 'anticipation'
  intensity: 0-1
  startTime: Date
  dominantEmotions: string[]
  description: string
}
```

**عتبات التحديد:**
```
Crisis:       fear > 0.6 AND anger > 0.5
Euphoria:     joy > 0.6 AND hope > 0.5
Mourning:     sadness > 0.6
Tension:      anger > 0.4 AND fear > 0.3
Anticipation: curiosity > 0.5 AND hope > 0.4
Calm:         جميع العواطف < 0.3
```

### الطبقة 3: Awareness Layer (الوعي)

#### حساب المؤشرات الثلاثة:

##### 1. Global Mood Index (GMI)

**الصيغة:**
```
GMI = (positive_emotions - negative_emotions) × amplitude_factor

حيث:
- positive_emotions = joy + hope + curiosity
- negative_emotions = fear + anger + sadness
- amplitude_factor = 1 + log10(amplitude) / 3
```

**النطاق:** -100 إلى +100
- **+100:** تفاؤل عام شديد
- **0:** محايد
- **-100:** تشاؤم عام شديد

##### 2. Collective Fear Index (CFI)

**الصيغة:**
```
CFI = (fear + anger/2 + sadness/3 - hope/4) × stress_multiplier

حيث:
- stress_multiplier = 1 + (amplitude / 2)
```

**النطاق:** 0 إلى 100
- **0-30:** آمن
- **30-60:** قلق معتدل
- **60-80:** قلق مرتفع
- **80-100:** حالة أزمة

##### 3. Hope Resilience Index (HRI)

**الصيغة:**
```
HRI = (hope + curiosity - fear/2) × resilience_factor

حيث:
- resilience_factor = 1 + (positive_trend / 10)
```

**النطاق:** 0 إلى 100
- **0-30:** مرونة منخفضة
- **30-60:** مرونة معتدلة
- **60-100:** مرونة عالية

#### توليد التنبيهات:

```typescript
Alert {
  shouldAlert: boolean
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  
  // الشروط:
  // - CFI > 70 → تنبيه أزمة
  // - HRI < 30 → تنبيه مرونة منخفضة
  // - GMI < -60 → تنبيه تشاؤم شديد
}
```

---

## 4️⃣ معمارية الإدراك المعرفي (11 طبقة)

### نظرة عامة

```
┌─────────────────────────────────────────────────────────────┐
│        Cognitive Architecture (11 Layers)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1:  Sensory Perception (الإدراك الحسي)              │
│  Layer 2:  Attention (الانتباه)                            │
│  Layer 3:  Encoding (الترميز)                             │
│  Layer 4:  Comprehension (الفهم) - من cognitiveEngine     │
│  Layer 5:  Working Memory (الذاكرة العاملة)               │
│  Layer 6:  Long-term Memory (الذاكرة طويلة الأجل)         │
│  Layer 7:  Emotional Appraisal (التقييم العاطفي) - DCFT   │
│  Layer 8:  Social Cognition (الإدراك الاجتماعي)           │
│  Layer 9:  Reasoning (التفكير المنطقي)                   │
│  Layer 10: Executive Function (الوظائف التنفيذية)         │
│  Layer 11: Metacognition (ما وراء المعرفة)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### الطبقات بالتفصيل

#### Layer 1: Sensory Perception
- جمع البيانات الخام
- معالجة أولية

#### Layer 2: Attention (filterSignals)
- تصفية الإشارات المهمة
- ترتيب الأولويات

#### Layer 3: Encoding (encode)
- تحويل النص إلى تمثيل هيكلي
- استخراج الكيانات والعلاقات

```typescript
EncodedText {
  text: string
  entities: Entity[]
  sentiment: { polarity: number, intensity: number }
  topics: string[]
  keywords: string[]
}
```

#### Layer 4: Comprehension (understandQuestion)
- فهم عميق للسؤال
- كشف النية الحقيقية

```typescript
DeepQuestion {
  surface: {
    text: string
    topic: string
    keywords: string[]
  }
  deep: {
    realIntent: 'understand_cause' | 'make_decision' | 'predict_future' | 'compare_options'
    hiddenAssumptions: string[]
    emotionalContext: string
  }
}
```

#### Layer 5: Working Memory (getConversationContext)
- تتبع السياق الحالي
- حفظ آخر 10 رسائل

```typescript
WorkingMemoryState {
  sessionId: string
  messages: Message[]
  currentTopic: string
  emotionalContext: string
  isFollowUp: boolean
}
```

#### Layer 6: Long-term Memory (Knowledge Base)
- قاعدة معارف شاملة
- العلاقات السببية
- الأنماط التاريخية

```typescript
TopicKnowledge {
  topic: string
  description: string
  relatedTopics: string[]
  historicalContext: string
}

CausalRelation {
  cause: string
  effect: string
  strength: 0-1
  evidence: string[]
}
```

#### Layer 7: Emotional Appraisal (DCFT)
- تقييم العواطف الجماعية
- حساب المؤشرات

#### Layer 8: Social Cognition
- فهم الديناميات الاجتماعية
- التنبؤ بالتأثيرات

#### Layer 9: Reasoning (routeQuestion)
- توجيه السؤال للمحركات المناسبة
- اختيار استراتيجية الإجابة

```typescript
RouterDecision {
  primaryEngine: string
  supportingEngines: string[]
  confidence: number
  reasoning: string
}
```

#### Layer 10: Executive Function
- بناء الإجابة المتكاملة
- تنسيق جميع المكونات

#### Layer 11: Metacognition (assessAnalysis)
- تقييم جودة التحليل
- حساب درجة الثقة

```typescript
MetacognitiveAssessment {
  overallConfidence: 0-1
  confidenceLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  selfCritique: string
  strengthsIdentified: string[]
  weaknessesIdentified: string[]
}
```

---

## 5️⃣ الصيغ الرياضية الكاملة

### أ) صيغ DCFT

#### 1. Digital Consciousness Field Amplitude
```
D(t) = Σ [Ei × Wi × ΔTi]

Components:
- Ei = ||AV|| = √(joy² + fear² + anger² + sadness² + hope² + curiosity²)
- Wi = (credibility × reach × engagement) / normalization_factor
- ΔTi = e^(-λ × Δt)
```

#### 2. Resonance Index
```
RI(e,t) = Σ (AVi[e] × Wi × e^(-λe × Δt))

For each emotion e ∈ {joy, fear, anger, sadness, hope, curiosity}
```

#### 3. Temporal Decay
```
decay(t) = e^(-λ × t)

λ values:
- joy: 0.05
- fear: 0.10
- anger: 0.08
- sadness: 0.07
- hope: 0.04
- curiosity: 0.06
```

### ب) صيغ المؤشرات

#### 1. GMI
```
positive = RI(joy) + RI(hope) + RI(curiosity)
negative = RI(fear) + RI(anger) + RI(sadness)

amplitude_factor = min(2, 1 + log10(max(1, D(t))) / 3)

GMI = ((positive - negative) / 3) × 100 × amplitude_factor

Range: [-100, 100]
```

#### 2. CFI
```
fear_component = (RI(fear) + 1) / 2
anger_component = (RI(anger) + 1) / 4
sadness_component = (RI(sadness) + 1) / 6
hope_reduction = (RI(hope) + 1) / 4

stress_multiplier = 1 + (D(t) / 2)

CFI = (fear_component + anger_component + sadness_component - hope_reduction) × stress_multiplier × 100

Range: [0, 100]
```

#### 3. HRI
```
positive_trend = (current_positive - previous_positive) / max(1, previous_positive)
resilience_factor = 1 + (positive_trend / 10)

HRI = (RI(hope) + RI(curiosity) - RI(fear)/2) × resilience_factor × 100

Range: [0, 100]
```

---

## 6️⃣ التكامل بين النظامين

### كيف يعمل التكامل؟

```
User Question
    ↓
┌─────────────────────────────────────┐
│  Cognitive Architecture (11 Layers) │
│  - فهم السؤال                       │
│  - استخراج النية الحقيقية           │
│  - جمع المعارف ذات الصلة            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  DCFT Engine (3 Layers)             │
│  - تحليل المشاعر الجماعية           │
│  - حساب المؤشرات                    │
│  - توليد التنبيهات                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Response Builder                   │
│  - دمج المعارف + المؤشرات           │
│  - بناء إجابة شاملة                 │
│  - إضافة توصيات                    │
└─────────────────────────────────────┘
    ↓
Response to User
```

### مثال عملي

**السؤال:** "هل سيؤدي ارتفاع أسعار النفط إلى أزمة اقتصادية؟"

#### الخطوة 1: Cognitive Architecture
```
Layer 4 (Comprehension):
- Topic: أسعار النفط والأزمة الاقتصادية
- Intent: predict_future
- Hidden Assumption: هناك علاقة مباشرة

Layer 6 (Knowledge Base):
- Causes: تضخم، بطالة، انخفاض الاستثمار
- Patterns: أزمات سابقة مشابهة
```

#### الخطوة 2: DCFT Engine
```
Perception Layer:
- جمع أخبار عن أسعار النفط
- استخراج مشاعر: خوف 0.7، غضب 0.5، أمل 0.3

Cognitive Layer:
- D(t) = 1.2 (وعي جماعي قوي)
- RI(fear) = 0.65
- RI(hope) = 0.35

Awareness Layer:
- GMI = -45 (تشاؤم معتدل)
- CFI = 68 (قلق مرتفع)
- HRI = 42 (مرونة معتدلة)
```

#### الخطوة 3: Response Builder
```
الإجابة:
"نعم، هناك احتمالية معتدلة لأزمة اقتصادية لأن:

الأسباب:
1. ارتفاع التكاليف الإنتاجية
2. تقليل الاستثمارات الأجنبية
3. انخفاض الطلب المحلي

المؤشرات الحالية:
- مستوى الخوف الجماعي: 68% (مرتفع)
- المزاج العام: -45 (تشاؤم)
- المرونة: 42% (معتدلة)

التوصيات:
- تنويع مصادر الدخل
- دعم القطاعات الأخرى
- تحسين الثقة الاستثمارية
"
```

---

## 7️⃣ الحالة الحالية

### ✅ ما تم تطويره

| المكون | الحالة | الملاحظات |
|--------|--------|----------|
| **DCFT Engine** | ✅ مكتمل | 3 طبقات عاملة بكفاءة |
| **Perception Layer** | ✅ مكتمل | استخراج مشاعر دقيق |
| **Cognitive Layer** | ✅ مكتمل | حسابات رياضية صحيحة |
| **Awareness Layer** | ✅ مكتمل | مؤشرات 3 حية |
| **Cognitive Architecture** | ✅ مكتمل | 11 طبقة متكاملة |
| **Knowledge Base** | ✅ مكتمل | 50+ علاقة سببية |
| **Metacognition** | ✅ مكتمل | تقييم جودة التحليل |
| **Integration** | ✅ مكتمل | DCFT + Cognitive معاً |

### ⚠️ ما يحتاج تحسين

| المجال | المشكلة | الحل المقترح |
|--------|---------|-------------|
| **دقة الكشف** | بعض المشاعر قد لا تُكتشف | استخدام BERT العربي |
| **البيانات التاريخية** | لا توجد بيانات تاريخية كافية | جمع بيانات 6 أشهر |
| **التنبؤات** | التنبؤات قد تكون غير دقيقة | إضافة نماذج LSTM |
| **التخصيص الإقليمي** | التحليل عام جداً | إضافة عوامل إقليمية |

### 📊 الإحصائيات

```
ملفات DCFT:
- dcftEngine.ts (250 سطر)
- perceptionLayer.ts (267 سطر)
- cognitiveLayer.ts (400+ سطر)
- awarenessLayer.ts (300+ سطر)
- affectiveVector.ts (200+ سطر)
- temporalDecay.ts (150+ سطر)
- influenceWeight.ts (100+ سطر)

ملفات Cognitive Architecture:
- index.ts (535 سطر)
- layer2_attention.ts (150+ سطر)
- layer3_encoding.ts (200+ سطر)
- layer5_workingMemory.ts (250+ سطر)
- layer6_knowledgeBase.ts (400+ سطر)
- layer11_metacognition.ts (300+ سطر)
- awarenessResponseBuilder.ts (500+ سطر)

إجمالي: 4000+ سطر كود عالي الجودة
```

---

## 🎯 الخلاصة

### DCFT (Digital Consciousness Field Theory)
- **3 طبقات:** Perception → Cognitive → Awareness
- **3 مؤشرات:** GMI, CFI, HRI
- **صيغ رياضية دقيقة** لقياس الوعي الجماعي
- **نظام تنبيهات ذكي** للأزمات

### Cognitive Architecture (11 Layer)
- **معالجة متقدمة** للأسئلة
- **فهم عميق** للنية الحقيقية
- **معارف شاملة** وعلاقات سببية
- **تقييم ذاتي** لجودة التحليل

### التكامل
- **DCFT** توفر البيانات العاطفية
- **Cognitive Architecture** توفر الفهم والمعارف
- **معاً** ينتجان إجابات ذكية وشاملة

---

**انتهى التوثيق**
