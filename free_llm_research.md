# Free LLM API Research - March 2026

## Key Findings

### 1. Groq (Currently Used - GROQ_API_KEY exists)
- **Llama 3.1 8B**: 14,400 requests/day, 6,000 tokens/min - BEST for simple tasks
- **Llama 3.3 70B**: 1,000 requests/day, 12,000 tokens/min - Good for complex analysis
- **Llama 4 Scout**: 1,000 requests/day, 30,000 tokens/min - Latest model
- **Qwen 3 32B**: 1,000 requests/day, 6,000 tokens/min
- **Status**: Already configured and working!
- **Verdict**: Very generous free tier, fast inference

### 2. Cerebras
- **Llama 3.3 70B**: 14,400 requests/day, 64,000 tokens/min, 1M tokens/hour
- **Qwen 3 32B**: 14,400 requests/day, 64,000 tokens/min
- **Llama 3.1 8B**: 14,400 requests/day, 60,000 tokens/min
- **Status**: Requires signup, OpenAI-compatible API
- **Verdict**: HIGHEST free limits, ultra-fast inference

### 3. Google AI Studio (Gemma models)
- **Gemma 3 27B**: 14,400 requests/day, 30 requests/min
- **Gemma 3 12B**: 14,400 requests/day, 30 requests/min
- **Status**: Free, but data used for training outside EU
- **Verdict**: Good limits but privacy concern

### 4. Mistral
- **All models**: 1 req/sec, 500K tokens/min, 1B tokens/month
- **Status**: Requires phone verification + data training opt-in
- **Verdict**: Very generous but requires data sharing

### 5. OpenRouter
- **50 requests/day free** (very limited)
- Multiple free models available
- **Verdict**: Too limited for production

## Recommendation for AmalSense
1. **Primary**: Groq (already configured!) - Use Llama 3.1 8B for Layer 1 + translations (14,400/day)
2. **Secondary**: Groq Llama 3.3 70B for main response generation (1,000/day)
3. **Fallback**: Cerebras (if Groq exhausted) - 14,400 requests/day additional
4. **Last resort**: Forge API (current, but has usage limits)

Total potential: ~30,000+ requests/day completely free
