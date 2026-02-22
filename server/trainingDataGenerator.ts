/**
 * TRAINING DATA GENERATOR
 * 
 * توليد بيانات تدريب متنوعة للمشاعر الجماعية والاتجاهات الاجتماعية
 */

export interface TrainingExample {
  question: string;
  answer: string;
  language: "ar" | "en";
  emotion: string[];
  confidence: number;
}

/**
 * توليد بيانات تدريب عربية
 */
export function generateArabicTrainingData(): TrainingExample[] {
  return [
    {
      question: "ما رأيك في التطورات التكنولوجية الحديثة؟",
      answer: "التطورات التكنولوجية الحديثة تثير مشاعر متنوعة في المجتمع. يجمع الناس بين الحماس والقلق من التطبيقات المستقبلية. يعكس هذا التوازن الطبيعي بين الفضول والحذر.",
      language: "ar",
      emotion: ["excitement", "curiosity", "concern"],
      confidence: 85
    },
    {
      question: "كيف تؤثر تغيرات المناخ على مشاعر الناس؟",
      answer: "تغيرات المناخ تثير قلقاً متزايداً في المجتمع العالمي. هناك شعور بالمسؤولية والقلق من المستقبل، لكن أيضاً أمل في الحلول المستدامة.",
      language: "ar",
      emotion: ["concern", "hope", "responsibility"],
      confidence: 82
    },
    {
      question: "ما تأثير الأخبار الاقتصادية على الجمهور؟",
      answer: "الأخبار الاقتصادية تؤثر بشكل مباشر على مشاعر الناس. التقارير الإيجابية تثير الأمل والتفاؤل، بينما الأخبار السلبية تثير القلق والخوف.",
      language: "ar",
      emotion: ["hope", "fear", "uncertainty"],
      confidence: 80
    },
    {
      question: "كيف يشعر الناس تجاه التغييرات الاجتماعية؟",
      answer: "التغييرات الاجتماعية تثير مشاعر معقدة ومتناقضة. البعض يشعر بالحماس والأمل، والبعض الآخر يشعر بالقلق والمقاومة. هذا التنوع يعكس تعقيد المجتمع.",
      language: "ar",
      emotion: ["excitement", "concern", "ambivalence"],
      confidence: 78
    },
    {
      question: "ما تأثير الأحداث السياسية على المشاعر الجماعية؟",
      answer: "الأحداث السياسية لها تأثير عميق على المشاعر الجماعية. تثير مشاعر الانقسام والتضامن والأمل والخوف حسب وجهات النظر المختلفة.",
      language: "ar",
      emotion: ["division", "solidarity", "hope", "fear"],
      confidence: 81
    }
  ];
}

/**
 * توليد بيانات تدريب إنجليزية
 */
export function generateEnglishTrainingData(): TrainingExample[] {
  return [
    {
      question: "What is your perspective on recent technological advancements?",
      answer: "Recent technological advancements evoke diverse emotions in society. People balance excitement with concerns about future applications. This reflects a natural equilibrium between curiosity and caution.",
      language: "en",
      emotion: ["excitement", "curiosity", "concern"],
      confidence: 85
    },
    {
      question: "How do climate changes affect people's emotions?",
      answer: "Climate changes trigger growing concerns in the global community. There is a sense of responsibility and worry about the future, but also hope for sustainable solutions.",
      language: "en",
      emotion: ["concern", "hope", "responsibility"],
      confidence: 82
    },
    {
      question: "What is the impact of economic news on the public?",
      answer: "Economic news directly influences people's emotions. Positive reports trigger hope and optimism, while negative news evokes fear and anxiety.",
      language: "en",
      emotion: ["hope", "fear", "uncertainty"],
      confidence: 80
    },
    {
      question: "How do people feel about social changes?",
      answer: "Social changes evoke complex and contradictory emotions. Some feel excitement and hope, while others experience concern and resistance. This diversity reflects society's complexity.",
      language: "en",
      emotion: ["excitement", "concern", "ambivalence"],
      confidence: 78
    },
    {
      question: "What is the impact of political events on collective emotions?",
      answer: "Political events have a profound impact on collective emotions. They trigger feelings of division and solidarity, hope and fear, depending on different perspectives.",
      language: "en",
      emotion: ["division", "solidarity", "hope", "fear"],
      confidence: 81
    }
  ];
}

/**
 * توليد بيانات تدريب متقدمة للمشاعر المعقدة
 */
export function generateAdvancedTrainingData(): TrainingExample[] {
  return [
    {
      question: "كيف يتفاعل المجتمع مع الأزمات الصحية؟",
      answer: "الأزمات الصحية تثير مشاعر معقدة: الخوف من المرض، الأمل في الشفاء، التضامن مع المتضررين، والقلق على الأحبة. هذا المزيج يعكس الطبيعة الإنسانية.",
      language: "ar",
      emotion: ["fear", "hope", "solidarity", "concern"],
      confidence: 83
    },
    {
      question: "ما تأثير الإنجازات العلمية على الروح المعنوية؟",
      answer: "الإنجازات العلمية تثير فخراً وأملاً في المستقبل. تعزز الثقة بالقدرات الإنسانية وتوحد المجتمع حول أهداف مشتركة.",
      language: "ar",
      emotion: ["pride", "hope", "unity"],
      confidence: 79
    },
    {
      question: "How do communities respond to humanitarian crises?",
      answer: "Humanitarian crises evoke profound compassion and solidarity. Communities unite to help, showing both the best of human nature and the urgency of collective action.",
      language: "en",
      emotion: ["compassion", "solidarity", "urgency"],
      confidence: 84
    },
    {
      question: "What emotions arise from cultural celebrations?",
      answer: "Cultural celebrations unite communities in joy and pride. They strengthen social bonds and create shared memories that reinforce collective identity.",
      language: "en",
      emotion: ["joy", "pride", "unity"],
      confidence: 86
    }
  ];
}

/**
 * دمج جميع بيانات التدريب
 */
export function getAllTrainingData(): TrainingExample[] {
  return [
    ...generateArabicTrainingData(),
    ...generateEnglishTrainingData(),
    ...generateAdvancedTrainingData()
  ];
}

/**
 * توليد بيانات تدريب عشوائية للاختبار
 */
export function generateRandomTrainingData(count: number = 100): TrainingExample[] {
  const topics = [
    "التكنولوجيا", "المناخ", "الاقتصاد", "السياسة", "الصحة", "التعليم", "الثقافة", "الرياضة"
  ];
  
  const emotions = [
    ["excitement", "hope"], 
    ["concern", "fear"], 
    ["pride", "joy"], 
    ["sadness", "grief"],
    ["anger", "frustration"],
    ["curiosity", "wonder"],
    ["solidarity", "unity"],
    ["ambivalence", "uncertainty"]
  ];
  
  const data: TrainingExample[] = [];
  
  for (let i = 0; i < count; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const emotionSet = emotions[Math.floor(Math.random() * emotions.length)];
    const language = Math.random() > 0.5 ? "ar" : "en";
    
    data.push({
      question: `ما رأيك في ${topic}؟`,
      answer: `${topic} يثير مشاعر متنوعة في المجتمع. يجمع الناس بين ${emotionSet.join(" و ")}. هذا يعكس تعقيد المجتمع المعاصر.`,
      language: language,
      emotion: emotionSet,
      confidence: Math.floor(Math.random() * 20) + 75
    });
  }
  
  return data;
}

/**
 * تحويل بيانات التدريب إلى صيغة JSONL للتدريب
 */
export function convertToJSONL(trainingData: TrainingExample[]): string {
  return trainingData
    .map(example => JSON.stringify({
      prompt: `Q: ${example.question}\nA: `,
      completion: example.answer,
      metadata: {
        language: example.language,
        emotions: example.emotion,
        confidence: example.confidence
      }
    }))
    .join("\n");
}

/**
 * حفظ بيانات التدريب إلى ملف
 */
export async function saveTrainingData(
  trainingData: TrainingExample[],
  filepath: string
): Promise<void> {
  const fs = await import("fs/promises");
  const jsonl = convertToJSONL(trainingData);
  await fs.writeFile(filepath, jsonl, "utf-8");
  console.log(`[Training Data] Saved ${trainingData.length} examples to ${filepath}`);
}

/**
 * تحميل بيانات التدريب من ملف
 */
export async function loadTrainingData(filepath: string): Promise<TrainingExample[]> {
  const fs = await import("fs/promises");
  const content = await fs.readFile(filepath, "utf-8");
  const lines = content.split("\n").filter(line => line.trim());
  
  return lines.map(line => {
    const parsed = JSON.parse(line);
    return {
      question: parsed.prompt.replace("Q: ", "").replace("\nA: ", ""),
      answer: parsed.completion,
      language: parsed.metadata.language,
      emotion: parsed.metadata.emotions,
      confidence: parsed.metadata.confidence
    };
  });
}
