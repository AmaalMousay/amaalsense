import { cognitiveProcess } from './server/cognitiveEngine';

async function test() {
  const questions = [
    'لماذا انخفض سعر الذهب والفضة؟',
    'هل الإعلام عامل تضخيم نفسي؟',
    'هل أشتري الذهب الآن؟'
  ];
  
  const indicators = {
    gmi: 45,
    cfi: 62,
    hri: 55,
    dominantEmotion: 'الترقب',
    emotionBreakdown: { 'الخوف': 25, 'الأمل': 20 },
    trend: 'stable' as const,
    confidence: 0.75
  };
  
  for (const q of questions) {
    console.log('\n' + '='.repeat(60));
    console.log('السؤال:', q);
    console.log('='.repeat(60));
    
    const response = await cognitiveProcess(q, indicators);
    console.log('\nالرد:');
    console.log(response.text);
    console.log('\nMetadata:', response.metadata);
  }
}

test().catch(console.error);
