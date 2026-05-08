import { addEntry } from './vectorStore';

// الحالة الحالية للباحث المستقل
export const researcherState = {
  isReading: false,
  isContinuous: false,
  currentTopic: '',
  source: '',
  articlesRead: 0,
  lastRun: null as Date | null,
  error: null as string | null
};

let continuousInterval: NodeJS.Timeout | null = null;

// قائمة بالمجالات المعرفية للبحث العشوائي الشامل
const DOMAINS = [
  { ar: 'طب', en: 'Medicine' }, { ar: 'اقتصاد', en: 'Economics' }, 
  { ar: 'علم النفس', en: 'Psychology' }, { ar: 'فيزياء', en: 'Physics' }, 
  { ar: 'قانون', en: 'Law' }, { ar: 'تاريخ', en: 'History' }, 
  { ar: 'ذكاء اصطناعي', en: 'Artificial Intelligence' }, { ar: 'سياسة', en: 'Politics' }, 
  { ar: 'علم الاجتماع', en: 'Sociology' }, { ar: 'فلسفة', en: 'Philosophy' },
  { ar: 'كيمياء', en: 'Chemistry' }, { ar: 'أحياء', en: 'Biology' }, 
  { ar: 'دين', en: 'Religion' }, { ar: 'رياضيات', en: 'Mathematics' }, 
  { ar: 'فن', en: 'Art' }, { ar: 'تداول', en: 'Trading' },
  { ar: 'أدب', en: 'Literature' }, { ar: 'جغرافيا', en: 'Geography' }, 
  { ar: 'علوم الفضاء', en: 'Space Science' }, { ar: 'هندسة', en: 'Engineering' }, 
  { ar: 'تكنولوجيا', en: 'Technology' }, { ar: 'علوم الأرض', en: 'Earth Science' }
];

/**
 * تقسيم النص الطويل إلى فقرات صغيرة يسهل استيعابها
 */
function chunkText(text: string, maxChunkLength: number = 1000): string[] {
  const sentences = text.split(/(?<=[.!?؟])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk.length + sentence.length) > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += sentence + ' ';
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * جلب مقال من ويكيبيديا (عربي أو إنجليزي) بناءً على مجال محدد
 */
async function fetchTargetedWikipediaArticle(): Promise<{ title: string, extract: string, url: string, domain: string } | null> {
  try {
    // 1. اختيار مجال عشوائي من المجالات المحددة
    const domainObj = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    
    // 2. تحديد لغة ويكيبيديا عشوائياً (50% عربي، 50% إنجليزي)
    const isEnglish = Math.random() > 0.5;
    const lang = isEnglish ? 'en' : 'ar';
    const searchQuery = isEnglish ? domainObj.en : domainObj.ar;
    
    // 3. البحث عن مقالات في هذا المجال
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (!searchData.query?.search?.length) return null;
    
    // 4. اختيار إحدى النتائج
    const topResults = searchData.query.search.slice(0, 5);
    const selectedResult = topResults[Math.floor(Math.random() * topResults.length)];
    const pageId = selectedResult.pageid;
    
    // 5. جلب محتوى المقال المختار
    const contentUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=false&explaintext=true&pageids=${pageId}&origin=*`;
    const contentRes = await fetch(contentUrl);
    const contentData = await contentRes.json();
    
    const page = contentData.query?.pages[pageId];
    if (!page || !page.extract || page.extract.length < 300) return null; // تجاهل المقالات القصيرة جداً
    
    return {
      title: page.title,
      extract: page.extract,
      url: `https://${lang}.wikipedia.org/?curid=${pageId}`,
      domain: domainObj.ar // دائماً نخزن اسم المجال بالعربية ليظهر في الواجهة
    };
  } catch (error) {
    console.error('[AutoResearcher] Wikipedia Error:', error);
    return null;
  }
}

/**
 * جلب مقال من ArXiv (مكتبة علمية للأبحاث)
 */
async function fetchArxivArticle(): Promise<{ title: string, extract: string, url: string, domain: string } | null> {
  try {
    // تحديد مجالات مناسبة للأبحاث العلمية
    const arxivDomains = ['physics', 'math', 'cs', 'q-bio', 'q-fin', 'stat'];
    const searchDomain = arxivDomains[Math.floor(Math.random() * arxivDomains.length)];
    
    // جلب أحدث الأبحاث في المجال المختار
    const url = `http://export.arxiv.org/api/query?search_query=cat:${searchDomain}&start=0&max_results=5&sortBy=lastUpdatedDate&sortOrder=desc`;
    const res = await fetch(url);
    const xmlText = await res.text();
    
    // بما أن الرد XML ولا يوجد مكتبة مدمجة، سنستخدم تعبيرات نمطية بسيطة لاستخراج البيانات
    const entries = xmlText.split('<entry>').slice(1);
    if (!entries.length) return null;
    
    const randomEntry = entries[Math.floor(Math.random() * entries.length)];
    
    const titleMatch = randomEntry.match(/<title>([\s\S]*?)<\/title>/);
    const summaryMatch = randomEntry.match(/<summary>([\s\S]*?)<\/summary>/);
    const idMatch = randomEntry.match(/<id>([\s\S]*?)<\/id>/);
    
    if (!titleMatch || !summaryMatch || !idMatch) return null;
    
    const title = titleMatch[1].replace(/\n/g, ' ').trim();
    const extract = summaryMatch[1].replace(/\n/g, ' ').trim();
    const articleUrl = idMatch[1].trim();
    
    if (extract.length < 300) return null;
    
    // تعيين المجال بالعربي للواجهة
    const domainMap: Record<string, string> = {
      'physics': 'فيزياء (ArXiv)', 'math': 'رياضيات (ArXiv)', 'cs': 'ذكاء اصطناعي وحوسبة (ArXiv)',
      'q-bio': 'أحياء (ArXiv)', 'q-fin': 'اقتصاد وتداول (ArXiv)', 'stat': 'إحصاء (ArXiv)'
    };
    
    return {
      title: title,
      extract: extract,
      url: articleUrl,
      domain: domainMap[searchDomain] || 'بحث علمي'
    };
  } catch (error) {
    console.error('[AutoResearcher] ArXiv Error:', error);
    return null;
  }
}

/**
 * جلب مقال من مصدر عشوائي (ويكيبيديا أو ArXiv)
 */
async function fetchTargetedArticle(): Promise<{ title: string, extract: string, url: string, domain: string } | null> {
  const useArxiv = Math.random() > 0.6; // 40% فرصة لجلب بحث من ArXiv
  if (useArxiv) {
    const arxivArticle = await fetchArxivArticle();
    if (arxivArticle) {
      researcherState.source = 'ArXiv (أبحاث علمية)';
      return arxivArticle;
    }
  }
  
  researcherState.source = 'Wikipedia (موسوعة)';
  return await fetchTargetedWikipediaArticle();
}

/**
 * إطلاق دورة البحث والقراءة المستقلة
 */
export async function triggerAutonomousResearch(): Promise<string> {
  if (researcherState.isReading) {
    return 'الباحث مشغول حالياً بقراءة مقال آخر.';
  }

  try {
    researcherState.isReading = true;
    researcherState.error = null;
    researcherState.source = 'Wikipedia (موسوعة)';
    researcherState.currentTopic = 'جاري البحث عن موضوع جديد...';
    
    // محاكاة تأخير التفكير والبحث
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // محاولة جلب المقال 3 مرات لتجنب الفشل السريع
    let article: { title: string, extract: string, url: string, domain: string } | null = null;
    for (let attempts = 0; attempts < 3; attempts++) {
      article = await fetchTargetedArticle();
      if (article) break;
      await new Promise(resolve => setTimeout(resolve, 1000)); // انتظار ثانية بين المحاولات
    }
    
    if (!article) {
      throw new Error('لم يتم العثور على مقال مناسب للقراءة بعد عدة محاولات، سأحاول لاحقاً.');
    }

    researcherState.currentTopic = `${article.title} [${article.domain}]`;
    
    // محاكاة القراءة (1 ثانية لكل 1000 حرف تقريباً)
    const readTime = Math.max(3000, Math.min(10000, (article.extract.length / 1000) * 1000));
    await new Promise(resolve => setTimeout(resolve, readTime));

    // تقسيم النص وحفظه في الذاكرة
    const chunks = chunkText(article.extract, 1000);
    let chunksSaved = 0;

    for (let i = 0; i < Math.min(chunks.length, 5); i++) { // حفظ أول 5 فقرات كحد أقصى لتجنب الإرهاق
      const chunk = chunks[i];
      if (chunk.length < 50) continue;

      addEntry('scientific_rule', chunk, {
        topic: article.title,
        domain: article.domain,
        source: article.url,
        isAutonomous: true,
        timestamp: new Date()
      });
      chunksSaved++;
    }

    researcherState.articlesRead++;
    researcherState.lastRun = new Date();
    
    return `قرأت بمتعة مقالاً عن "${article.title}" وحفظت ${chunksSaved} فقرات معرفية في ذاكرتي التراكمية.`;

  } catch (error: any) {
    researcherState.error = error.message || 'حدث خطأ غير معروف';
    return `فشلت جولة القراءة: ${researcherState.error}`;
  } finally {
    researcherState.isReading = false;
  }
}

/**
 * تشغيل وإيقاف دورة البحث المستمرة
 */
export function toggleContinuousReading(enable: boolean) {
  if (enable) {
    researcherState.isContinuous = true;
    console.log('[AutoResearcher] Continuous mode ENABLED.');
    
    // تشغيل فوري ثم دوري كل دقيقة
    triggerAutonomousResearch();
    
    if (!continuousInterval) {
      continuousInterval = setInterval(async () => {
        if (!researcherState.isReading) {
          console.log('[AutoResearcher] Auto-triggering next reading cycle...');
          await triggerAutonomousResearch();
        }
      }, 60 * 1000); // كل دقيقة يحاول قراءة مقال جديد
    }
  } else {
    researcherState.isContinuous = false;
    console.log('[AutoResearcher] Continuous mode DISABLED.');
    if (continuousInterval) {
      clearInterval(continuousInterval);
      continuousInterval = null;
    }
  }
  return researcherState.isContinuous;
}
