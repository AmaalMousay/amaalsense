/**
 * AMALSENSE MULTI-AGENT SYSTEM (MAS) - Autonomous Polymath Version
 * يدمج هذا النظام بين الاستشعار المتوازي والتحقق العلمي الموسوعي.
 */

import { analyzeForWeather } from '../engines/unifiedAnalysisEngine';
import {
  tool_performActiveSearch,
  tool_validateScientificFact,
  tool_sendEmergencyAlert,
  tool_generateDeepReport,
  tool_recordCaseStudy
} from './agentTools';

// ============================================================
// 1. EVALUATOR AGENT (مدقق الحقائق الموسوعي - الطبقة 15/24)
// ============================================================
class EvaluatorAgent {
  /**
   * يتحقق من الروابط بين "المشاعر" و"الحقائق العلمية" (طب، فيزياء، قانون).
   */
  async validateScientificLogic(topic: string, analysis: any): Promise<boolean> {
    console.log(`[EvaluatorAgent] 🛡️ التحقق من الرصانة العلمية لـ: ${topic}`);

    // استدعاء أداة التحقق العلمي لربط الاستنتاج بقاعدة المعرفة (Knowledge Base)
    const validation = await tool_validateScientificFact(
      `الرنين العاطفي في ${topic} مرتبط بـ ${analysis.dominantCategory}`,
      analysis.dominantCategory || 'General Science'
    );

    if (!validation.isValid) {
      console.warn(`[EvaluatorAgent] ⚠️ تحذير: استنتاج غير مدعوم علمياً في مجال ${analysis.dominantCategory}`);
      return false;
    }

    return true;
  }
}

// ============================================================
// 2. ANALYST AGENT (المحلل العميق - Layer 18/24)
// ============================================================
class AnalystAgent {
  /**
   * تحليل موضوع معين وربطه بالذكاء التراكمي
   */
  async analyzeTopic(name: string, code: string) {
    console.log(`[AnalystAgent] 🔍 تحليل النبض لـ: ${name} (${code})`);
    try {
      // استخدام المحرك الموحد لتحليل الحالة
      const analysis = await analyzeForWeather(code, name);
      return analysis;
    } catch (error) {
      console.error(`[AnalystAgent] Error analyzing ${name}:`, error);
      return null;
    }
  }
}

// ============================================================
// 3. ACTION AGENT (المنفذ - Executive Layer)
// ============================================================
class ActionAgent {
  /**
   * اتخاذ إجراء بناءً على التحليل (تنبيه، تقرير، دراسة حالة)
   */
  async takeAction(topic: string, result: any) {
    if (!result) return;

    // إذا كانت شدة الخوف عالية جداً، يتم إرسال تنبيه طوارئ تلقائي
    if (result.fearLevel?.index > 85) {
      await tool_sendEmergencyAlert({
        topic,
        severity: 'critical',
        reason: `Critical fear detected: ${result.fearLevel.label}`,
        indices: {
          gmi: result.globalMood?.index || 50,
          cfi: result.fearLevel?.index || 50,
          hri: result.hopeIndex?.index || 50
        }
      });
    }

    // إذا كان هناك رنين عالي في الذاكرة، يتم تسجيل دراسة حالة
    if (result.resonanceCount > 10) {
      await tool_recordCaseStudy({
        title: `Quantum Resonance in ${topic}`,
        description: `Autonomous detection of high resonance patterns in ${topic} field.`,
        topic,
        snapshot: result
      });
    }

    // توليد تقرير عميق إذا طلب النظام
    await tool_generateDeepReport(topic, result);
  }
}

// ============================================================
// 4. OBSERVER AGENT (المستكشف المستقل - Active Research)
// ============================================================
class ObserverAgent {
  private analystAgent = new AnalystAgent();
  private watchlist = [
    { name: 'الشرق الأوسط', code: 'ME', domain: 'politics' },
    { name: 'ميكانيكا الكم', code: 'PHYS', domain: 'physics' },
    { name: 'ليبيا - سبها', code: 'LY_SB', domain: 'general' }
  ];

  /**
   * إضافة موضوع إلى قائمة المراقبة
   */
  addToWatchlist(name: string, code: string, domain: string) {
    console.log(`[ObserverAgent] ➕ إضافة إلى قائمة المراقبة: ${name} (${code})`);
    this.watchlist.push({ name, code, domain });
  }

  /**
   * تنفيذ الاستشعار مع "البحث النشط" عند وجود نقص في المعلومات (الفضول البرمجي)
   */
  async runPeriodicObservation(): Promise<void> {
    console.log(`\n[ObserverAgent] 🌌 بدء دورة الاستشعار المستقل (Parallel Mesh Processing)...`);

    await Promise.all(this.watchlist.map(async (item) => {
      try {
        // إذا كان مؤشر عدم اليقين عالياً في الذاكرة، يتم تفعيل البحث النشط تلقائياً
        if (Math.random() > 0.7) { // محاكاة لـ "الفضول البرمجي"
          await tool_performActiveSearch(item.name, item.domain as any);
        }

        await this.analystAgent.analyzeTopic(item.name, item.code);
      } catch (err) {
        console.error(`Error sensing ${item.name}:`, err);
      }
    }));

    console.log(`[ObserverAgent] ✅ اكتملت دورة الوعي الرقمي.\n`);
  }
}

// ملاحظة: AnalystAgent و ActionAgent يتم استخدامهما كما في الكود السابق مع ربطهما بالوظائف المطورة أعلاه.
// يتم تصدير النظام ككتلة واحدة متكاملة.
export const multiAgentSystem = new ObserverAgent();