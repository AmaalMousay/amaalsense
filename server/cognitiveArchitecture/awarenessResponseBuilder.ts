/**
 * Awareness Response Builder
 * 
 * يبني الرد بفلسفة: What → Why → So what
 * 
 * - What: شن يحسّوا (المؤشرات)
 * - Why: ليش يحسّوا هكذا (الأسباب الحقيقية المخصصة للموضوع)
 * - So what: ماذا يعني للمجتمع (التفسير والتوقعات)
 */

// ==================== TOPIC CAUSES DATABASE ====================
// أسباب مخصصة لكل موضوع - ليست عامة!

interface TopicCauses {
  domain: string;
  keywords: string[];
  causes: {
    fear: string[];
    hope: string[];
    anger: string[];
    neutral: string[];
  };
  socialMeaning: {
    highFear: string;
    highHope: string;
    mixed: string;
    tense: string;
  };
}

const TOPIC_CAUSES_DATABASE: TopicCauses[] = [
  // ==================== الذهب والمعادن ====================
  {
    domain: 'gold_metals',
    keywords: ['ذهب', 'فضة', 'معادن', 'gold', 'silver', 'metals', 'المعادن الثمينة'],
    causes: {
      fear: [
        'قرارات الفيدرالي الأمريكي برفع أسعار الفائدة تضغط على أسعار الذهب',
        'قوة الدولار الأمريكي تجعل الذهب أقل جاذبية للمستثمرين الأجانب',
        'توقعات بمزيد من التشديد النقدي تدفع المستثمرين للابتعاد عن الملاذات الآمنة',
        'تراجع الطلب الصناعي على الفضة مع تباطؤ قطاع التكنولوجيا'
      ],
      hope: [
        'توقعات بتخفيف السياسة النقدية قد تدعم أسعار الذهب',
        'الطلب الآسيوي على الذهب يبقى قوياً خاصة من الصين والهند',
        'البنوك المركزية تواصل شراء الذهب كاحتياطي استراتيجي',
        'التوترات الجيوسياسية قد تعيد الذهب كملاذ آمن'
      ],
      anger: [
        'تقلبات حادة في الأسعار تثير غضب المستثمرين الصغار',
        'فجوة بين توقعات المحللين والواقع تسبب إحباطاً'
      ],
      neutral: [
        'الأسواق في حالة ترقب لقرارات البنوك المركزية',
        'المستثمرون يفضلون الانتظار قبل اتخاذ قرارات كبيرة'
      ]
    },
    socialMeaning: {
      highFear: 'هذا الخوف يعكس قلقاً حقيقياً من تآكل قيمة المدخرات. المستثمرون الصغار قد يتسرعون في البيع، بينما الكبار ينتظرون فرص الشراء.',
      highHope: 'هذا التفاؤل قد يكون مبالغاً فيه. السوق يميل للتصحيح بعد موجات الأمل الكبيرة.',
      mixed: 'السوق في حالة حيرة حقيقية - خوف من الخسارة مع أمل في الارتداد. هذا عادة يسبق تحركات كبيرة.',
      tense: 'التوتر الحالي يشير لاحتمال تقلبات حادة قريباً. الحذر مطلوب.'
    }
  },
  
  // ==================== العملات والدولار ====================
  {
    domain: 'currency',
    keywords: ['دولار', 'عملة', 'صرف', 'دينار', 'يورو', 'currency', 'dollar', 'exchange'],
    causes: {
      fear: [
        'تراجع قيمة العملة المحلية يزيد تكلفة الاستيراد والمعيشة',
        'شح السيولة الدولارية في السوق المحلي يخلق سوقاً موازية',
        'عدم استقرار السياسات النقدية يضعف الثقة في العملة',
        'الفجوة بين السعر الرسمي والسوق السوداء تتسع'
      ],
      hope: [
        'توقعات بتدخل البنك المركزي لدعم العملة',
        'تحسن أسعار النفط قد يدعم العملات المرتبطة به',
        'مفاوضات مع صندوق النقد قد تجلب استقراراً'
      ],
      anger: [
        'غضب شعبي من تدهور القدرة الشرائية',
        'انتقادات للسياسات الاقتصادية الحكومية'
      ],
      neutral: [
        'ترقب لقرارات السياسة النقدية',
        'الأسواق تنتظر بيانات اقتصادية جديدة'
      ]
    },
    socialMeaning: {
      highFear: 'هذا الخوف يعكس قلقاً معيشياً حقيقياً. المواطنون يشعرون بتآكل رواتبهم يومياً.',
      highHope: 'الأمل موجود لكنه هش. أي خبر سلبي قد يقلب المزاج بسرعة.',
      mixed: 'المجتمع منقسم بين من يتوقع تحسناً ومن يستعد للأسوأ.',
      tense: 'التوتر الاقتصادي قد يتحول لتوتر اجتماعي إذا استمر.'
    }
  },
  
  // ==================== التعليم ====================
  {
    domain: 'education',
    keywords: ['تعليم', 'مدرسة', 'جامعة', 'طلاب', 'مناهج', 'education', 'school', 'university', 'students'],
    causes: {
      fear: [
        'قلق من جودة المخرجات التعليمية وعدم مواكبتها لسوق العمل',
        'ارتفاع تكاليف التعليم الخاص مع تراجع جودة التعليم العام',
        'نقص الكوادر التدريسية المؤهلة في المدارس الحكومية',
        'المناهج القديمة لا تواكب متطلبات العصر الرقمي'
      ],
      hope: [
        'مبادرات إصلاح تعليمي جديدة تبعث على التفاؤل',
        'انتشار التعليم الإلكتروني يفتح فرصاً جديدة',
        'اهتمام حكومي متزايد بقطاع التعليم',
        'نجاحات طلابية في مسابقات دولية ترفع المعنويات'
      ],
      anger: [
        'غضب من الفجوة بين التعليم الخاص والعام',
        'استياء من البيروقراطية في المؤسسات التعليمية',
        'انتقادات لسياسات القبول الجامعي'
      ],
      neutral: [
        'نقاشات مستمرة حول إصلاح المناهج',
        'ترقب لنتائج الامتحانات والقبول'
      ]
    },
    socialMeaning: {
      highFear: 'هذا القلق يعكس خوفاً حقيقياً على مستقبل الأبناء. الأسر تشعر بضغط كبير لتوفير تعليم جيد.',
      highHope: 'التفاؤل بالتعليم يعني إيماناً بالمستقبل. هذا مؤشر إيجابي للمجتمع.',
      mixed: 'المجتمع يريد التغيير لكنه غير متأكد من الاتجاه الصحيح.',
      tense: 'التوتر حول التعليم قد يتحول لمطالبات شعبية بالإصلاح.'
    }
  },
  
  // ==================== الإعلام ====================
  {
    domain: 'media',
    keywords: ['إعلام', 'أخبار', 'صحافة', 'تلفزيون', 'سوشيال', 'media', 'news', 'journalism'],
    causes: {
      fear: [
        'انتشار الأخبار الكاذبة والمضللة يخلق حالة من عدم الثقة',
        'التغطية الإعلامية السلبية المستمرة تؤثر على المزاج العام',
        'صعوبة التمييز بين الخبر الحقيقي والمفبرك',
        'الإعلام يضخم الأزمات أحياناً أكثر من حجمها الفعلي'
      ],
      hope: [
        'ظهور منصات إعلامية مستقلة وموضوعية',
        'وعي متزايد بأهمية التحقق من المصادر',
        'صحافة استقصائية تكشف الحقائق'
      ],
      anger: [
        'غضب من التحيز الإعلامي الواضح',
        'استياء من تسييس الأخبار',
        'انتقادات للإعلام الرسمي'
      ],
      neutral: [
        'نقاشات حول دور الإعلام في المجتمع',
        'مقارنات بين الإعلام التقليدي والجديد'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف من الإعلام يعني فقدان الثقة في مصادر المعلومات. هذا خطير على تماسك المجتمع.',
      highHope: 'الأمل في إعلام أفضل يعني رغبة في الشفافية والحقيقة.',
      mixed: 'المجتمع يستهلك الإعلام بحذر وشك. هذا صحي لكنه مرهق.',
      tense: 'التوتر مع الإعلام قد يؤدي لمقاطعة أو بحث عن بدائل.'
    }
  },
  
  // ==================== السياسة ====================
  {
    domain: 'politics',
    keywords: ['سياسة', 'حكومة', 'انتخابات', 'برلمان', 'قرار', 'politics', 'government', 'elections'],
    causes: {
      fear: [
        'عدم استقرار سياسي يهدد الأمن والاقتصاد',
        'قرارات حكومية مفاجئة تثير القلق',
        'صراعات سياسية تعطل مصالح المواطنين',
        'غياب رؤية واضحة للمستقبل'
      ],
      hope: [
        'وعود بإصلاحات سياسية واقتصادية',
        'حوار وطني يجمع الأطراف المختلفة',
        'انتخابات قادمة قد تجلب التغيير'
      ],
      anger: [
        'غضب من الفساد والمحسوبية',
        'استياء من بطء الإصلاحات',
        'انتقادات لأداء المسؤولين'
      ],
      neutral: [
        'ترقب للتطورات السياسية',
        'متابعة للمفاوضات والحوارات'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف السياسي يعني قلقاً على الاستقرار. المواطنون يخشون المجهول.',
      highHope: 'الأمل السياسي يعني إيماناً بإمكانية التغيير. هذا محرك للمشاركة.',
      mixed: 'المجتمع منقسم سياسياً. هذا طبيعي لكنه يحتاج حواراً.',
      tense: 'التوتر السياسي قد يتحول لاحتجاجات إذا لم يُعالج.'
    }
  },
  
  // ==================== الاقتصاد العام ====================
  {
    domain: 'economy',
    keywords: ['اقتصاد', 'أسعار', 'غلاء', 'معيشة', 'رواتب', 'economy', 'prices', 'inflation', 'salary'],
    causes: {
      fear: [
        'ارتفاع الأسعار يفوق زيادة الدخل',
        'تراجع القدرة الشرائية للمواطنين',
        'بطالة متزايدة خاصة بين الشباب',
        'عدم يقين اقتصادي يؤجل قرارات الاستثمار والزواج'
      ],
      hope: [
        'مشاريع تنموية جديدة توفر فرص عمل',
        'توقعات بتحسن الأوضاع الاقتصادية',
        'دعم حكومي للفئات الأكثر تضرراً'
      ],
      anger: [
        'غضب من الفجوة بين الأغنياء والفقراء',
        'استياء من ارتفاع الضرائب والرسوم',
        'انتقادات للسياسات الاقتصادية'
      ],
      neutral: [
        'ترقب لمؤشرات اقتصادية جديدة',
        'نقاشات حول الحلول الاقتصادية'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف الاقتصادي يعني ضغطاً يومياً على الأسر. هذا يؤثر على الصحة النفسية والعلاقات.',
      highHope: 'الأمل الاقتصادي يعني استعداداً للعمل والبناء. هذا طاقة إيجابية.',
      mixed: 'المجتمع يتأرجح بين التفاؤل والتشاؤم حسب الأخبار اليومية.',
      tense: 'التوتر الاقتصادي المستمر قد يؤدي لاحتجاجات أو هجرة.'
    }
  },
  
  // ==================== ليبيا (سياق محلي) ====================
  {
    domain: 'libya',
    keywords: ['ليبيا', 'طرابلس', 'بنغازي', 'libya', 'tripoli', 'benghazi', 'ليبي'],
    causes: {
      fear: [
        'استمرار الانقسام السياسي يعيق التنمية',
        'تأخر صرف المرتبات يضغط على المواطنين',
        'أزمة السيولة تؤثر على الحياة اليومية',
        'عدم استقرار أمني في بعض المناطق'
      ],
      hope: [
        'جهود المصالحة الوطنية تتقدم',
        'عائدات النفط قد تحسن الوضع الاقتصادي',
        'مبادرات دولية لدعم الاستقرار',
        'شباب ليبي طموح يسعى للتغيير'
      ],
      anger: [
        'غضب من الفساد وسوء الإدارة',
        'استياء من تدخلات خارجية',
        'انتقادات للطبقة السياسية'
      ],
      neutral: [
        'ترقب للتطورات السياسية',
        'متابعة للحوار الوطني'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف في ليبيا يعكس تجارب صعبة مرت بها البلاد. المواطنون يريدون استقراراً حقيقياً.',
      highHope: 'الأمل الليبي صامد رغم كل شيء. هذا يدل على قوة المجتمع.',
      mixed: 'الليبيون يعيشون بين الأمل والخوف يومياً. هذا مرهق لكنه يبني صلابة.',
      tense: 'التوتر في ليبيا يحتاج حلولاً سياسية حقيقية، ليس مجرد تهدئة.'
    }
  }
];

// ==================== AWARENESS RESPONSE BUILDER ====================

export interface AwarenessResponse {
  what: {
    summary: string;
    indicators: {
      fear: number;
      hope: number;
      mood: number;
    };
  };
  why: {
    causes: string[];
    context: string;
  };
  soWhat: {
    meaning: string;
    implications: string[];
    recommendation: string;
  };
  closingQuestion: string;
}

export function buildAwarenessResponse(
  question: string,
  topic: string,
  indicators: { fear: number; hope: number; mood: number },
  intent: string
): AwarenessResponse {
  // 1. Find the matching topic domain
  const topicData = findTopicDomain(question, topic);
  
  // 2. Determine emotional state
  const emotionalState = determineEmotionalState(indicators);
  
  // 3. Build WHAT section
  const what = buildWhat(topic, indicators, emotionalState);
  
  // 4. Build WHY section - SPECIFIC to the topic!
  const why = buildWhy(topicData, emotionalState, question);
  
  // 5. Build SO WHAT section
  const soWhat = buildSoWhat(topicData, emotionalState, intent);
  
  // 6. Generate closing question
  const closingQuestion = generateClosingQuestion(topic, intent, emotionalState);
  
  return { what, why, soWhat, closingQuestion };
}

function findTopicDomain(question: string, topic: string): TopicCauses {
  const searchText = `${question} ${topic}`.toLowerCase();
  
  for (const domain of TOPIC_CAUSES_DATABASE) {
    for (const keyword of domain.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return domain;
      }
    }
  }
  
  // Default to economy if no match
  return TOPIC_CAUSES_DATABASE.find(d => d.domain === 'economy') || TOPIC_CAUSES_DATABASE[0];
}

function determineEmotionalState(indicators: { fear: number; hope: number; mood: number }): string {
  const { fear, hope, mood } = indicators;
  
  if (fear > 70 && hope < 40) return 'highFear';
  if (hope > 70 && fear < 40) return 'highHope';
  if (fear > 50 && hope > 50) return 'mixed';
  if (mood < 30 || (fear > 60 && hope < 60)) return 'tense';
  return 'mixed';
}

function buildWhat(
  topic: string,
  indicators: { fear: number; hope: number; mood: number },
  emotionalState: string
): AwarenessResponse['what'] {
  const stateDescriptions: Record<string, string> = {
    highFear: `المزاج العام تجاه ${topic} يميل للقلق والحذر الشديد`,
    highHope: `المزاج العام تجاه ${topic} يميل للتفاؤل والأمل`,
    mixed: `المزاج العام تجاه ${topic} متذبذب بين الخوف والأمل`,
    tense: `المزاج العام تجاه ${topic} متوتر ويحتاج متابعة`
  };
  
  return {
    summary: stateDescriptions[emotionalState] || stateDescriptions.mixed,
    indicators: {
      fear: indicators.fear,
      hope: indicators.hope,
      mood: indicators.mood
    }
  };
}

function buildWhy(
  topicData: TopicCauses,
  emotionalState: string,
  question: string
): AwarenessResponse['why'] {
  const causes: string[] = [];
  
  // Select causes based on emotional state
  if (emotionalState === 'highFear' || emotionalState === 'tense') {
    causes.push(...topicData.causes.fear.slice(0, 3));
    if (topicData.causes.anger.length > 0) {
      causes.push(topicData.causes.anger[0]);
    }
  } else if (emotionalState === 'highHope') {
    causes.push(...topicData.causes.hope.slice(0, 3));
  } else {
    // Mixed - show both sides
    causes.push(...topicData.causes.fear.slice(0, 2));
    causes.push(...topicData.causes.hope.slice(0, 2));
  }
  
  // Build context paragraph
  const context = buildContextParagraph(topicData.domain, emotionalState);
  
  return { causes, context };
}

function buildContextParagraph(domain: string, emotionalState: string): string {
  const contexts: Record<string, Record<string, string>> = {
    gold_metals: {
      highFear: 'سوق المعادن الثمينة يمر بفترة ضغط واضح. المستثمرون يتجهون للسيولة والأصول الأكثر أماناً.',
      highHope: 'هناك تفاؤل حذر في سوق المعادن. البعض يرى فرصة للشراء عند هذه المستويات.',
      mixed: 'السوق في حالة ترقب. المستثمرون منقسمون بين من يرى فرصة ومن يرى مخاطر.',
      tense: 'التقلبات الحالية تجعل اتخاذ القرار صعباً. الحذر هو السمة السائدة.'
    },
    education: {
      highFear: 'قطاع التعليم يواجه تحديات حقيقية. الأسر قلقة على مستقبل أبنائها.',
      highHope: 'هناك حراك إيجابي في قطاع التعليم. مبادرات جديدة تبعث على التفاؤل.',
      mixed: 'المجتمع يناقش مستقبل التعليم بجدية. هناك رغبة في التغيير مع خوف من المجهول.',
      tense: 'الضغط على قطاع التعليم يتزايد. المطالبات بالإصلاح تتصاعد.'
    },
    media: {
      highFear: 'الثقة في الإعلام تتراجع. المواطنون يبحثون عن مصادر بديلة للمعلومات.',
      highHope: 'هناك أمل في إعلام أكثر مصداقية. منصات جديدة تحاول سد الفجوة.',
      mixed: 'العلاقة مع الإعلام معقدة. الناس يستهلكونه بحذر وتشكيك.',
      tense: 'التوتر مع الإعلام يعكس أزمة ثقة أعمق في المؤسسات.'
    },
    libya: {
      highFear: 'الوضع في ليبيا يثير قلقاً مشروعاً. المواطنون يريدون استقراراً حقيقياً.',
      highHope: 'رغم التحديات، الأمل الليبي صامد. هناك إيمان بإمكانية التغيير.',
      mixed: 'الليبيون يعيشون بين الأمل والخوف. التجارب الصعبة علمتهم الصبر والصمود.',
      tense: 'التوتر في ليبيا يحتاج حلولاً جذرية. الحلول المؤقتة لم تعد تكفي.'
    },
    economy: {
      highFear: 'الضغط الاقتصادي يؤثر على الحياة اليومية. الأسر تعيد ترتيب أولوياتها.',
      highHope: 'هناك تفاؤل بتحسن الأوضاع الاقتصادية. مؤشرات إيجابية تظهر.',
      mixed: 'الوضع الاقتصادي غير مستقر. الناس يتأرجحون بين التفاؤل والتشاؤم.',
      tense: 'الضغط الاقتصادي المستمر يؤثر على المزاج العام والصحة النفسية.'
    },
    currency: {
      highFear: 'تراجع العملة يضرب القدرة الشرائية. المواطنون يشعرون بالضغط يومياً.',
      highHope: 'توقعات بتحسن سعر الصرف. البعض يرى فرصة في الأزمة.',
      mixed: 'سوق العملات متقلب. الناس حائرون بين الادخار والإنفاق.',
      tense: 'أزمة العملة تؤثر على كل جوانب الحياة. الحلول مطلوبة بشكل عاجل.'
    },
    politics: {
      highFear: 'عدم الاستقرار السياسي يقلق المواطنين. الناس تريد وضوحاً في الرؤية.',
      highHope: 'هناك أمل في تغيير سياسي إيجابي. المشاركة الشعبية تتزايد.',
      mixed: 'المشهد السياسي معقد. المواطنون منقسمون في تقييمهم.',
      tense: 'التوتر السياسي يحتاج حواراً حقيقياً. الاستقطاب يضر بالجميع.'
    }
  };
  
  return contexts[domain]?.[emotionalState] || contexts.economy[emotionalState];
}

function buildSoWhat(
  topicData: TopicCauses,
  emotionalState: string,
  intent: string
): AwarenessResponse['soWhat'] {
  // Get social meaning
  const meaning = topicData.socialMeaning[emotionalState as keyof typeof topicData.socialMeaning] 
    || topicData.socialMeaning.mixed;
  
  // Build implications based on emotional state
  const implications = buildImplications(emotionalState, intent);
  
  // Build recommendation
  const recommendation = buildRecommendation(emotionalState, intent);
  
  return { meaning, implications, recommendation };
}

function buildImplications(emotionalState: string, intent: string): string[] {
  const implications: Record<string, string[]> = {
    highFear: [
      'قرارات متسرعة قد تُتخذ تحت الضغط',
      'البحث عن بدائل وحلول فردية يتزايد',
      'الثقة في المؤسسات قد تتراجع'
    ],
    highHope: [
      'استعداد أكبر للمخاطرة والاستثمار',
      'توقعات مرتفعة قد تصطدم بالواقع',
      'طاقة إيجابية يمكن توجيهها للبناء'
    ],
    mixed: [
      'حالة ترقب وانتظار قبل اتخاذ قرارات',
      'انقسام في الآراء والتوجهات',
      'حاجة لمعلومات أوضح لاتخاذ موقف'
    ],
    tense: [
      'احتمال تصاعد التوتر إذا لم تُعالج الأسباب',
      'ضغط نفسي متزايد على الأفراد والأسر',
      'مطالبات بحلول قد تتصاعد'
    ]
  };
  
  return implications[emotionalState] || implications.mixed;
}

function buildRecommendation(emotionalState: string, intent: string): string {
  const recommendations: Record<string, Record<string, string>> = {
    make_decision: {
      highFear: 'في ظل هذا القلق، يُنصح بتأجيل القرارات الكبيرة حتى تتضح الصورة أكثر.',
      highHope: 'التفاؤل جيد، لكن تأكد من أن قرارك مبني على معطيات وليس فقط على الأمل.',
      mixed: 'الوضع يحتاج مزيداً من المتابعة قبل اتخاذ قرار. اجمع معلومات أكثر.',
      tense: 'الحذر مطلوب الآن. راقب التطورات قبل أي خطوة كبيرة.'
    },
    understand_cause: {
      highFear: 'فهم الأسباب يساعد على التعامل مع الخوف بعقلانية.',
      highHope: 'الأسباب الإيجابية موجودة، لكن ابقَ واقعياً في توقعاتك.',
      mixed: 'الصورة معقدة. حاول فهم كل الجوانب قبل تكوين رأي.',
      tense: 'معرفة الأسباب الحقيقية تساعد على توقع ما سيحدث.'
    },
    predict_future: {
      highFear: 'التوقعات صعبة في ظل هذا القلق. استعد لسيناريوهات متعددة.',
      highHope: 'التفاؤل قد يكون مبرراً، لكن ضع خطة بديلة دائماً.',
      mixed: 'المستقبل غير واضح. المرونة والتكيف هما الأهم.',
      tense: 'توقع تقلبات قريبة. الاستعداد أفضل من المفاجأة.'
    },
    general: {
      highFear: 'الخوف طبيعي في هذه الظروف. المهم ألا يشل قدرتك على التفكير.',
      highHope: 'حافظ على هذا التفاؤل مع جرعة من الواقعية.',
      mixed: 'الحيرة طبيعية. خذ وقتك في فهم الموقف.',
      tense: 'التوتر مؤقت. ركز على ما يمكنك التحكم فيه.'
    }
  };
  
  const intentCategory = recommendations[intent] ? intent : 'general';
  return recommendations[intentCategory][emotionalState] || recommendations.general.mixed;
}

function generateClosingQuestion(topic: string, intent: string, emotionalState: string): string {
  const questions: Record<string, string[]> = {
    gold_metals: [
      'هل تريد تحليل العلاقة بين الذهب والدولار بشكل أعمق؟',
      'هل نستكشف ماذا يحدث لو خفّض الفيدرالي أسعار الفائدة؟',
      'هل تريد مقارنة بين الذهب والفضة كاستثمار؟'
    ],
    education: [
      'هل تريد تحليل قطاع التعليم في منطقة محددة؟',
      'هل نستكشف تأثير التعليم على سوق العمل؟',
      'هل تريد مقارنة بين التعليم الحكومي والخاص؟'
    ],
    media: [
      'هل تريد تحليل تأثير الإعلام على قضية محددة؟',
      'هل نستكشف كيف يؤثر الإعلام على القرارات الجماعية؟',
      'هل تريد مقارنة بين الإعلام التقليدي والرقمي؟'
    ],
    libya: [
      'هل تريد تحليل قطاع محدد في ليبيا؟',
      'هل نستكشف سيناريوهات المستقبل القريب؟',
      'هل تريد مقارنة بين المناطق المختلفة؟'
    ],
    economy: [
      'هل تريد تحليل قطاع اقتصادي محدد؟',
      'هل نستكشف تأثير هذا الوضع على فئة معينة؟',
      'هل تريد توقعات للفترة القادمة؟'
    ],
    currency: [
      'هل تريد تحليل العلاقة بين العملة والتضخم؟',
      'هل نستكشف سيناريوهات سعر الصرف؟',
      'هل تريد نصائح للتعامل مع تقلبات العملة؟'
    ],
    politics: [
      'هل تريد تحليل موقف سياسي محدد؟',
      'هل نستكشف سيناريوهات التطور السياسي؟',
      'هل تريد فهم تأثير السياسة على الاقتصاد؟'
    ]
  };
  
  const domainQuestions = questions[topic] || questions.economy;
  const randomIndex = Math.floor(Math.random() * domainQuestions.length);
  return domainQuestions[randomIndex];
}

// ==================== FORMAT RESPONSE ====================

export function formatAwarenessResponse(response: AwarenessResponse): string {
  const parts: string[] = [];
  
  // WHAT section
  parts.push(`**الخلاصة:**`);
  parts.push(response.what.summary);
  parts.push('');
  
  // WHY section
  parts.push(`**لماذا هذا المزاج؟**`);
  parts.push(response.why.context);
  parts.push('');
  parts.push('**الأسباب الرئيسية:**');
  response.why.causes.forEach((cause, i) => {
    parts.push(`${i + 1}. ${cause}`);
  });
  parts.push('');
  
  // SO WHAT section
  parts.push(`**ماذا يعني هذا للمجتمع؟**`);
  parts.push(response.soWhat.meaning);
  parts.push('');
  parts.push('**التداعيات المحتملة:**');
  response.soWhat.implications.forEach(imp => {
    parts.push(`• ${imp}`);
  });
  parts.push('');
  parts.push(`**التوصية:**`);
  parts.push(response.soWhat.recommendation);
  parts.push('');
  
  // Closing question
  parts.push(`---`);
  parts.push(response.closingQuestion);
  
  return parts.join('\n');
}

export { TOPIC_CAUSES_DATABASE };
