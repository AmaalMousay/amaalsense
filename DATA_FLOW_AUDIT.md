# Data Flow Architecture Audit

## Current Architecture Issues

### 1. EventVector Design Problem

**Current (WRONG):**
```
User Input → Graph Pipeline → 4 Engines → Multiple Results → Groq (receives large data)
```

**Correct (SHOULD BE):**
```
User Input → Graph Pipeline → 4 Engines → Fusion Engine → Single EventVector → Groq (receives compact vector)
```

### 2. Fusion Engine Problems

The Fusion Engine should:
- ✅ Receive results from all 4 engines
- ❌ Currently: Merges them into an array
- ✅ Should: Create ONE unified EventVector object
- ❌ Currently: Passes array to Groq
- ✅ Should: Pass single EventVector to Groq

### 3. EventVector Structure (CORRECT)

```typescript
interface EventVector {
  // Emotions (normalized 0-1)
  emotions: {
    fear: number;
    hope: number;
    anger: number;
    sadness: number;
    joy: number;
    curiosity: number;
  };
  
  // Topics (single primary topic)
  topic: string;
  topicConfidence: number;
  
  // Regions (array of affected regions with intensity)
  regions: Array<{
    name: string;
    intensity: number; // 0-1
  }>;
  
  // Impact assessment
  impact: {
    severity: number; // 0-1
    scope: 'local' | 'regional' | 'global';
    affectedGroups: string[];
  };
  
  // Metadata
  timestamp: number;
  confidence: number; // Overall confidence 0-1
  language: string;
}
```

### 4. Current Data Flow (AUDIT)

**Step 1: User Input (Chat.tsx)**
```
✅ User types question
✅ Language detected
❌ Question sent to Graph Pipeline directly
   Should: Compress first, then send
```

**Step 2: Graph Pipeline**
```
✅ Receives question
✅ Calls 4 engines in parallel:
   - Topic Engine
   - Emotion Engine
   - Region Engine
   - Impact Engine
❌ Returns array of PartialEventVectors
   Should: Pass to Fusion Engine first
```

**Step 3: Fusion Engine (BROKEN)**
```
❌ Current: Just merges arrays
❌ Returns: PartialEventVector[]
✅ Should: Merge into single EventVector
✅ Should: Return: EventVector (single object)
```

**Step 4: Groq LLM (WRONG INPUT)**
```
❌ Current: Receives large payload with all raw data
❌ Problem: Causes "Payload Too Large" errors
✅ Should: Receive only EventVector (compact)
✅ Size: ~500 tokens instead of 51406 tokens
```

**Step 5: Response (WRONG)**
```
❌ Current: Groq returns interpretation of raw data
❌ Problem: Can miss nuances, contradictions (Positive + High Fear)
✅ Should: Groq interprets EventVector
✅ Result: Coherent, nuanced analysis
```

---

## Missing Components

### 1. Proper Fusion Engine
**File:** `server/fusionEngine.ts` (needs rewrite)

Should do:
- Take 4 PartialEventVectors
- Merge emotions (average with weights)
- Select primary topic
- Combine regions
- Calculate impact
- Return single EventVector

### 2. EventVector Validator
**File:** Missing

Should validate:
- All emotion values 0-1
- Confidence 0-1
- Required fields present
- No contradictions

### 3. Compression Before Groq
**File:** `server/payloadValidator.ts` (created but not integrated)

Should:
- Take EventVector
- Compress to JSON
- Validate token count
- Add JSON instruction to prompt

### 4. Analyzer Page Input
**File:** `client/src/pages/Analyzer.tsx` (or Chat.tsx)

Problem:
- Input field not showing cursor
- Cannot type
- Likely: z-index issue or disabled state

---

## Correct Data Flow (SHOULD BE)

```
1. User Input (Chat.tsx)
   ↓
2. Language Detection
   ↓
3. News Compression (if news input)
   ↓
4. Graph Pipeline
   ├─ Topic Engine → PartialEventVector
   ├─ Emotion Engine → PartialEventVector
   ├─ Region Engine → PartialEventVector
   └─ Impact Engine → PartialEventVector
   ↓
5. Fusion Engine
   Input: 4 × PartialEventVector
   Output: 1 × EventVector (compact, ~500 tokens)
   ↓
6. Payload Validator
   - Check tokens < 6000
   - Add JSON instruction
   ↓
7. Groq LLM (70B model)
   Input: EventVector + prompt
   Output: Interpretation + recommendations
   ↓
8. Response Display
   - Show EventVector metrics
   - Show Groq interpretation
   - Show confidence scores
```

---

## Files That Need Fixing

| File | Issue | Priority |
|------|-------|----------|
| `server/fusionEngine.ts` | Doesn't create single EventVector | 🔴 CRITICAL |
| `server/graphPipelineRouter.ts` | Doesn't use Fusion Engine | 🔴 CRITICAL |
| `client/src/pages/Chat.tsx` | Doesn't pass EventVector to Groq | 🔴 CRITICAL |
| `server/groqIntegration.ts` | Receives wrong data type | 🔴 CRITICAL |
| `client/src/pages/Analyzer.tsx` | Input field broken | 🟡 HIGH |
| `server/eventVectorStorage.ts` | Needs EventVector validator | 🟡 HIGH |

---

## Action Items

1. **Rewrite Fusion Engine** to create single EventVector
2. **Update Graph Pipeline Router** to use Fusion Engine
3. **Update Chat.tsx** to pass EventVector to Groq
4. **Fix Analyzer Input Field** (z-index or disabled state)
5. **Add EventVector Validator**
6. **Test complete flow** with real input
