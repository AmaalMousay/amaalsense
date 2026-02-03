/**
 * AmalSense Test Suite Runner
 * يختبر 70 سؤال ويوثق جودة الردود
 */

import { think, analyzeQuestionIntent, type ResponseData } from './server/thinkingEngine';

// الأسئلة الـ 70
const questions = [
  // Category 1: Decision Questions
  "هل الوقت مناسب للاستثمار في العقارات في ليبيا؟",
  "هل أشتري ذهب الآن أم أنتظر؟",
  "هل الوضع الاقتصادي في ليبيا فقاعة أم نمو صحي؟",
  "هل الوقت مناسب لفتح مشروع تجاري في طرابلس؟",
  "هل أبيع الدولار الآن أم أحتفظ به؟",
  "هل الاستثمار في الأسهم الليبية آمن حالياً؟",
  "هل أنقل أموالي للخارج أم أبقيها في ليبيا؟",
  
  // Category 2: Scenario Questions
  "ماذا لو ارتفع سعر الدولار إلى 7 دينار؟",
  "ماذا سيحدث للمزاج العام لو أُعلنت انتخابات؟",
  "لو استمر الوضع الحالي شهراً، كيف سيتغير المزاج؟",
  "ماذا لو انخفض سعر النفط إلى 50 دولار؟",
  "لو حدث اتفاق سياسي، كيف سيتأثر الاقتصاد؟",
  "ماذا لو رفعت الحكومة الدعم عن الوقود؟",
  "لو أُغلقت الحدود مع تونس، ما التأثير النفسي؟",
  
  // Category 3: Temporal Questions
  "كيف سيتغير المزاج العام خلال الأسبوع القادم؟",
  "ما توقعاتك للوضع الاقتصادي خلال شهر؟",
  "هل الوضع سيتحسن أم يسوء في 2026؟",
  "متى يتوقع أن يستقر سعر الصرف؟",
  "كم سيستمر التوتر الحالي؟",
  "ما التوقع للربع القادم؟",
  "هل الصيف سيكون أفضل اقتصادياً؟",
  
  // Category 4: Comparison Questions
  "أيهما أكثر قلقاً: ليبيا أم مصر؟",
  "الفرق بين مزاج طرابلس وبنغازي؟",
  "مقارنة الوضع الحالي بالعام الماضي؟",
  "أيهما أفضل للاستثمار: الذهب أم العقار؟",
  "الفرق بين الخوف الاقتصادي والخوف السياسي؟",
  "مقارنة مؤشر الأمل بين الشباب وكبار السن؟",
  "أيهما أكثر تأثيراً: الأخبار المحلية أم العالمية؟",
  
  // Category 5: Deep Explanation Questions
  "لماذا يرتفع الخوف رغم استقرار الدولار؟",
  "ما سبب التناقض بين الأمل والخوف؟",
  "لماذا المزاج العام سلبي رغم الأخبار الإيجابية؟",
  "ما العلاقة بين سعر النفط والمزاج الجماعي؟",
  "لماذا يختلف المزاج بين المدن الليبية؟",
  "ما سبب ارتفاع مؤشر الترقب؟",
  "لماذا لا يثق الناس في الاستقرار الحالي؟",
  
  // Category 6: Psychological Questions
  "ما الحالة النفسية السائدة في ليبيا الآن؟",
  "هل المجتمع في حالة إنكار أم قبول؟",
  "ما نوع الخوف السائد: وجودي أم مالي؟",
  "هل هناك أمل حقيقي أم مجرد تكيف؟",
  "ما مستوى الثقة في المستقبل؟",
  "هل المجتمع مستعد للتغيير؟",
  "ما درجة المرونة النفسية للمجتمع الليبي؟",
  
  // Category 7: Economic Questions
  "كيف يؤثر سعر النفط على المزاج العام؟",
  "ما العلاقة بين التضخم والخوف الجماعي؟",
  "هل السوق الليبي في حالة ركود أم نشاط؟",
  "ما تأثير سعر الصرف على الثقة الاقتصادية؟",
  "كيف يرى الناس مستقبل الاقتصاد الليبي؟",
  "ما مستوى القلق من البطالة؟",
  "هل الناس يدخرون أم ينفقون؟",
  
  // Category 8: Political Questions
  "كيف تؤثر الانقسامات السياسية على المزاج؟",
  "ما مستوى الثقة في الحكومة الحالية؟",
  "هل الناس متفائلون بالانتخابات؟",
  "كيف يرى الليبيون التدخل الدولي؟",
  "ما تأثير الأخبار السياسية على الحالة النفسية؟",
  "هل هناك رغبة في التغيير السياسي؟",
  "ما مستوى الاهتمام بالشأن السياسي؟",
  
  // Category 9: Academic Questions
  "ما هي نظرية DCFT التي يعتمد عليها AmalSense؟",
  "كيف يتم حساب مؤشر المزاج العام GMI؟",
  "ما الفرق بين CFI و HRI؟",
  "ما مصادر البيانات التي يستخدمها AmalSense؟",
  "كيف يتم تحليل المشاعر من النصوص؟",
  "ما دقة التنبؤات العاطفية؟",
  "كيف يختلف AmalSense عن أدوات التحليل الأخرى؟",
  
  // Category 10: Journalistic Questions
  "أعطني ملخص للوضع العاطفي في ليبيا اليوم",
  "ما أهم 3 مؤشرات يجب متابعتها؟",
  "ما القصة وراء ارتفاع الخوف هذا الأسبوع؟",
  "كيف أكتب تقرير عن المزاج العام؟",
  "ما الزاوية الصحفية الأهم حالياً؟",
  "ما الأرقام التي يجب ذكرها في التقرير؟",
  "ما التوقعات التي يمكن نشرها؟"
];

// فئات الأسئلة
const categories = [
  { name: "Decision", start: 0, end: 7 },
  { name: "Scenario", start: 7, end: 14 },
  { name: "Temporal", start: 14, end: 21 },
  { name: "Comparison", start: 21, end: 28 },
  { name: "Explanation", start: 28, end: 35 },
  { name: "Psychological", start: 35, end: 42 },
  { name: "Economic", start: 42, end: 49 },
  { name: "Political", start: 49, end: 56 },
  { name: "Academic", start: 56, end: 63 },
  { name: "Journalistic", start: 63, end: 70 }
];

// بيانات وهمية للاختبار
function getTestData(intent: string): ResponseData {
  // تغيير البيانات حسب نوع السؤال
  const baseData: ResponseData = {
    topic: '',
    country: 'LY',
    gmi: 40 + Math.floor(Math.random() * 20),
    cfi: 50 + Math.floor(Math.random() * 25),
    hri: 45 + Math.floor(Math.random() * 20),
    dominantEmotion: ['الخوف', 'الترقب', 'الأمل', 'القلق'][Math.floor(Math.random() * 4)],
    trend: 'stable'
  };
  
  // إضافة بيانات اقتصادية للأسئلة الاقتصادية
  if (intent === 'economic' || intent === 'decision') {
    baseData.economicData = {
      currencies: {
        'USD': { rate: 4.85, change: 0.02 },
        'EUR': { rate: 5.25, change: -0.01 }
      },
      gold: { price: 2650, change: 15 },
      oil: { brent: 78, wti: 74 }
    };
  }
  
  return baseData;
}

// تقييم جودة الرد
function evaluateResponse(question: string, response: string, intent: string): {
  hasExecutiveSummary: boolean;
  hasDecisionSignal: boolean;
  hasCauses: boolean;
  hasClosingQuestion: boolean;
  hasEconomicData: boolean;
  wordCount: number;
  score: number;
} {
  const hasExecutiveSummary = response.includes('**الخلاصة:**') || response.includes('**الخلاصة:');
  const hasDecisionSignal = response.includes('**إشارة القرار:**') || response.includes('**الحكم:**');
  const hasCauses = response.includes('**لماذا') || response.includes('• ');
  const hasClosingQuestion = response.includes('هل ') && response.includes('؟');
  const hasEconomicData = response.includes('المؤشرات الاقتصادية') || response.includes('USD') || response.includes('الذهب');
  const wordCount = response.split(/\s+/).length;
  
  // حساب النقاط
  let score = 0;
  if (hasExecutiveSummary) score += 25;
  if (hasDecisionSignal) score += 20;
  if (hasCauses) score += 20;
  if (hasClosingQuestion) score += 15;
  if (wordCount >= 50 && wordCount <= 350) score += 10;
  
  // نقاط إضافية للأسئلة الاقتصادية
  if ((intent === 'economic' || intent === 'decision') && hasEconomicData) {
    score += 10;
  }
  // خصم للأسئلة غير الاقتصادية إذا ظهرت بيانات اقتصادية
  if (intent !== 'economic' && intent !== 'decision' && hasEconomicData) {
    score -= 10;
  }
  
  return {
    hasExecutiveSummary,
    hasDecisionSignal,
    hasCauses,
    hasClosingQuestion,
    hasEconomicData,
    wordCount,
    score: Math.max(0, Math.min(100, score))
  };
}

// تشغيل الاختبارات
async function runTests() {
  console.log('='.repeat(80));
  console.log('AmalSense Test Suite - 70 Questions');
  console.log('='.repeat(80));
  console.log('');
  
  const results: Array<{
    category: string;
    question: string;
    intent: string;
    score: number;
    details: ReturnType<typeof evaluateResponse>;
  }> = [];
  
  let totalScore = 0;
  
  for (const category of categories) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Category: ${category.name}`);
    console.log('='.repeat(60));
    
    let categoryScore = 0;
    
    for (let i = category.start; i < category.end; i++) {
      const question = questions[i];
      const analysis = analyzeQuestionIntent(question);
      const data = getTestData(analysis.intent);
      const response = think(question, data);
      const evaluation = evaluateResponse(question, response, analysis.intent);
      
      results.push({
        category: category.name,
        question,
        intent: analysis.intent,
        score: evaluation.score,
        details: evaluation
      });
      
      categoryScore += evaluation.score;
      totalScore += evaluation.score;
      
      console.log(`\n--- Question ${i + 1}: ${question.substring(0, 50)}...`);
      console.log(`Intent: ${analysis.intent}`);
      console.log(`Score: ${evaluation.score}/100`);
      console.log(`Word Count: ${evaluation.wordCount}`);
      console.log(`✓ Summary: ${evaluation.hasExecutiveSummary ? 'Yes' : 'No'}`);
      console.log(`✓ Signal: ${evaluation.hasDecisionSignal ? 'Yes' : 'No'}`);
      console.log(`✓ Causes: ${evaluation.hasCauses ? 'Yes' : 'No'}`);
      console.log(`✓ Closing Q: ${evaluation.hasClosingQuestion ? 'Yes' : 'No'}`);
      console.log(`✓ Economic: ${evaluation.hasEconomicData ? 'Yes' : 'No'}`);
      
      // طباعة الرد
      console.log(`\nResponse:`);
      console.log('-'.repeat(40));
      console.log(response);
      console.log('-'.repeat(40));
    }
    
    const categoryAvg = categoryScore / (category.end - category.start);
    console.log(`\n>>> Category Average: ${categoryAvg.toFixed(1)}/100`);
  }
  
  // ملخص النتائج
  console.log('\n' + '='.repeat(80));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(80));
  
  const avgScore = totalScore / questions.length;
  console.log(`\nTotal Questions: ${questions.length}`);
  console.log(`Average Score: ${avgScore.toFixed(1)}/100`);
  
  // إحصائيات حسب الفئة
  console.log('\nCategory Breakdown:');
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category.name);
    const categoryAvg = categoryResults.reduce((sum, r) => sum + r.score, 0) / categoryResults.length;
    console.log(`  ${category.name}: ${categoryAvg.toFixed(1)}/100`);
  }
  
  // إحصائيات حسب العنصر
  const summaryCount = results.filter(r => r.details.hasExecutiveSummary).length;
  const signalCount = results.filter(r => r.details.hasDecisionSignal).length;
  const causesCount = results.filter(r => r.details.hasCauses).length;
  const closingCount = results.filter(r => r.details.hasClosingQuestion).length;
  
  console.log('\nElement Coverage:');
  console.log(`  Executive Summary: ${summaryCount}/${questions.length} (${(summaryCount/questions.length*100).toFixed(0)}%)`);
  console.log(`  Decision Signal: ${signalCount}/${questions.length} (${(signalCount/questions.length*100).toFixed(0)}%)`);
  console.log(`  Causes Section: ${causesCount}/${questions.length} (${(causesCount/questions.length*100).toFixed(0)}%)`);
  console.log(`  Closing Question: ${closingCount}/${questions.length} (${(closingCount/questions.length*100).toFixed(0)}%)`);
  
  // أسوأ 5 نتائج
  const worstResults = [...results].sort((a, b) => a.score - b.score).slice(0, 5);
  console.log('\nLowest Scoring Questions:');
  for (const r of worstResults) {
    console.log(`  ${r.score}/100: ${r.question.substring(0, 50)}...`);
  }
  
  // أفضل 5 نتائج
  const bestResults = [...results].sort((a, b) => b.score - a.score).slice(0, 5);
  console.log('\nHighest Scoring Questions:');
  for (const r of bestResults) {
    console.log(`  ${r.score}/100: ${r.question.substring(0, 50)}...`);
  }
  
  // التقييم النهائي
  console.log('\n' + '='.repeat(80));
  if (avgScore >= 80) {
    console.log('✅ EXCELLENT: System is performing very well!');
  } else if (avgScore >= 60) {
    console.log('⚠️ GOOD: System needs some improvements');
  } else {
    console.log('❌ NEEDS WORK: System requires significant improvements');
  }
  console.log('='.repeat(80));
}

runTests().catch(console.error);
