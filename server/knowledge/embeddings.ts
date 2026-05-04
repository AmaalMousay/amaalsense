/**
 * AMALSENSE EMBEDDINGS SERVICE - Universal Knowledge Version
 * يحول النصوص إلى متجهات دلالية تغطي الفيزياء، الكيمياء، الطب، القانون، والهندسة.
 */

// الفئات الدلالية الموسوعية (تم توسيعها لتشمل كافة العلوم)
const SEMANTIC_CATEGORIES = {
  // --- العلوم الدقيقة (Exact Sciences) ---
  physics: ['physics', 'quantum', 'atom', 'wave', 'energy', 'resonance', 'field', 'فيزياء', 'كم', 'ذرة', 'موجة', 'طاقة', 'رنين', 'حقل'],
  chemistry: ['chemistry', 'molecule', 'reaction', 'acid', 'element', 'bond', 'كيمياء', 'جزيء', 'تفاعل', 'حمض', 'عنصر', 'رابطة'],
  math: ['math', 'calculus', 'statistics', 'equation', 'algorithm', 'logic', 'رياضيات', 'حساب', 'إحصاء', 'معادلة', 'خوارزمية', 'منطق'],
  engineering: ['engineering', 'structural', 'circuit', 'software', 'design', 'هندسة', 'إنشائي', 'دائرة', 'تصميم', 'معمار'],

  // --- العلوم الحيوية والطبية ---
  medicine: ['medicine', 'health', 'surgery', 'virus', 'therapy', 'clinical', 'طب', 'صحة', 'جراحة', 'فيروس', 'علاج', 'سريري'],

  // --- العلوم الإنسانية والقانونية ---
  law: ['law', 'legal', 'justice', 'court', 'legislation', 'treaty', 'rights', 'قانون', 'عدالة', 'محكمة', 'تشريع', 'معاهدة', 'حقوق'],
  politics: ['politics', 'government', 'election', 'sovereignty', 'سياسة', 'حكومة', 'انتخابات', 'سيادة'],

  // --- الاقتصاد والطاقة ---
  economy: ['economy', 'market', 'trade', 'inflation', 'currency', 'oil', 'اقتصاد', 'سوق', 'تجارة', 'تضخم', 'عملة', 'نفط'],

  // --- المشاعر الكمية (Quantum Emotions) ---
  joy: ['joy', 'happy', 'success', 'win', 'سعادة', 'فرح', 'نجاح', 'فوز'],
  fear: ['fear', 'panic', 'terror', 'anxiety', 'خوف', 'ذعر', 'إرهاب', 'قلق'],
  anger: ['anger', 'rage', 'conflict', 'violence', 'غضب', 'صراع', 'عنف'],
  hope: ['hope', 'optimism', 'resilience', 'أمل', 'تفاؤل', 'صمود'],

  // --- مستويات المخاطر والزمن ---
  risk: ['danger', 'critical', 'emergency', 'safe', 'stable', 'خطر', 'حرج', 'طوارئ', 'أمان', 'مستقر'],
  time: ['history', 'past', 'now', 'future', 'forecast', 'تاريخ', 'ماضي', 'الآن', 'مستقبل', 'توقع'],
};

const EMBEDDING_DIM = Object.keys(SEMANTIC_CATEGORIES).length;

/**
 * توليد المتجه الدلالي للنص (Universal Embedding)
 * يقوم بحساب "بصمة الوعي" للنص بناءً على تداخله مع العلوم المختلفة.
 */
export function generateEmbedding(text: string): number[] {
  const normalizedText = text.toLowerCase();
  // تنظيف النص لضمان دقة البحث الكلمي
  const words = normalizedText.replace(/[^\w\s\u0600-\u06FF]/g, '').split(/\s+/);

  const embedding: number[] = new Array(EMBEDDING_DIM).fill(0);

  Object.entries(SEMANTIC_CATEGORIES).forEach(([category, keywords], index) => {
    let score = 0;
    for (const word of words) {
      if (word.length < 2) continue; // تجاهل الحروف القصيرة
      for (const keyword of keywords) {
        if (word === keyword || word.startsWith(keyword) || keyword.startsWith(word)) {
          score += 1.5; // وزن أعلى للتطابق الدقيق
        }
      }
    }
    // موازنة النتيجة بناءً على طول النص
    embedding[index] = score / Math.max(words.length, 1);
  });

  // التطبيع المتجهي (Vector Normalization) لضمان جودة البحث بالتشابه
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}

/**
 * حساب تشابه جيب التمام (Cosine Similarity)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * البحث عن المتجهات الأكثر تشابهاً
 * (تم إضافة export هنا لإصلاح خطأ التيرمينال)
 */
export function findSimilar(
  queryEmbedding: number[],
  embeddings: Array<{ id: string; embedding: number[]; metadata?: Record<string, unknown> }>,
  topK: number = 5
): Array<{ id: string; similarity: number; metadata?: Record<string, unknown> }> {
  const similarities = embeddings.map(item => ({
    id: item.id,
    similarity: cosineSimilarity(queryEmbedding, item.embedding),
    metadata: item.metadata,
  }));

  // ترتيب حسب درجة التشابه تنازلياً
  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, topK);
}

export function getEmbeddingDimension(): number { return EMBEDDING_DIM; }

export function getSemanticCategories(): string[] {
  return Object.keys(SEMANTIC_CATEGORIES);
}