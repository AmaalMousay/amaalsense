# AmalSense - New Features Requirements

## 1. Daily Emotional Weather (الطقس العاطفي للعالم)

**Purpose:** Show global emotional state like weather forecast

**Components:**
- Global mood (Mood Index)
- Regional fear levels (Fear Index)
- Security/Stability (Stability Index)
- Most affected region (Hotspot)
- Root cause (Reason)

**Display Format:** Like weather forecast with icons and colors

---

## 2. One Question, One Answer for Everyone (الإجابة عن سؤال واحد يهم كل إنسان)

**Purpose:** Answer universal human questions

**Questions to Answer:**
- "Is the world becoming more dangerous?" (هل العالم يصبح أكثر خطورة؟)
- "Are we becoming more divided?" (هل نصبح أكثر انقسامًا؟)
- "Is there hope for the future?" (هل هناك أمل للمستقبل؟)

**Answer Format:** 3 levels
- Stable / Rising Tension / High Fear

---

## 3. Quick Explanation: Why? (التفسير السريع: لماذا؟)

**Purpose:** Explain what's happening in 3 sentences

**AmalSense Response:**
- "What the world is experiencing" - 3 recent events
- Explanation of connections
- Forecast of what comes next

---

## 4. EventVector - Complete Data Model (نسخة AmalSense الكاملة)

### EventVector Structure:

```typescript
type EmotionVector = {
  joy: number;           // 0-1
  fear: number;          // 0-1
  anger: number;         // 0-1
  sadness: number;       // 0-1
  hope: number;          // 0-1
  curiosity: number;     // 0-1
}

type EventVector = {
  // Identification
  id: string;            // evt_001
  timestamp: number;     // Unix timestamp
  
  // Classification
  topic: string;         // economy, politics, conflict, society...
  subTopic?: string;     // inflation, migration, elections...
  region: string;        // global, europe, mena...
  country?: string;
  
  // Emotional Data
  emotions: EmotionVector;
  
  // Characteristics
  intensity: number;     // 0-1 (how strong)
  polarity: number;      // -1 to +1 (negative to positive)
  uncertainty: number;   // 0-1 (how uncertain)
  
  // Weighting Factors
  sourceWeight: number;  // 0-1 (credibility of source)
  timeWeight: number;    // 0-1 (how recent)
  relevanceWeight: number; // 0-1 (how relevant to topic)
  
  // Source Information
  sourceType: "news" | "social" | "analysis";
  sourceName: string;
  summary: string;       // Brief description
}
```

### How EventVector is Generated:

1. **Fetch raw news** - Get latest news from sources
2. **Analyze sources** - Classify and weight by credibility
3. **Classify topics** - Categorize by topic/subtopic
4. **Calculate emotions** - Using AI to extract emotional content
5. **Build EventVector** - Combine all data

---

## How AmalSense Uses EventVector Data:

**Metrics Calculated:**

1. **GMI (Global Mood Index)**
   - Average polarity weighted by intensity
   - Formula: `avg(polarity * intensity)`

2. **CFI (Collective Fear Index)**
   - Average fear weighted by intensity and relevance
   - Formula: `avg(fear * intensity * relevanceWeight)`

3. **HRI (Hope Resilience Index)**
   - Average hope weighted by time and relevance
   - Formula: `avg(hope * timeWeight * relevanceWeight)`

---

## Implementation Priority

1. **First:** Switch to Groq AI model
2. **Second:** Implement EventVector complete data model
3. **Third:** Build Daily Emotional Weather feature
4. **Fourth:** Implement universal question answering
5. **Fifth:** Add quick explanation system
