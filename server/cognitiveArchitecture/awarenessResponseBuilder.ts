/**
 * Awareness Response Builder
 * 
 * يبني الرد بفلسفة: What → Why → So what
 * 
 * - What: شن يحسّوا (المؤشرات)
 * - Why: ليش يحسّوا هكذا (الأسباب الحقيقية المخصصة للموضوع)
 * - So what: ماذا يعني للمجتمع (التفسير والتوقعات)
 * 
 * المجالات الأساسية (9 مجالات):
 * 1. politics - السياسة
 * 2. economy - الاقتصاد
 * 3. health - الصحة
 * 4. education - التعليم
 * 5. technology - التكنولوجيا
 * 6. society - المجتمع
 * 7. security - الأمن والصراعات
 * 8. environment - البيئة والمناخ
 * 9. law - القانون والعدالة
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
  // ==================== 1. السياسة (politics) ====================
  {
    domain: 'politics',
    keywords: ['سياسة', 'حكومة', 'انتخابات', 'برلمان', 'قرار', 'وزير', 'رئيس', 'politics', 'government', 'elections', 'parliament', 'minister', 'president', 'حزب', 'معارضة', 'سلطة'],
    causes: {
      fear: [
        'عدم استقرار سياسي يهدد الأمن والاقتصاد',
        'قرارات حكومية مفاجئة تثير القلق',
        'صراعات سياسية تعطل مصالح المواطنين',
        'غياب رؤية واضحة للمستقبل',
        'تأخر الانتخابات يزيد حالة عدم اليقين'
      ],
      hope: [
        'وعود بإصلاحات سياسية واقتصادية',
        'حوار وطني يجمع الأطراف المختلفة',
        'انتخابات قادمة قد تجلب التغيير',
        'تحسن العلاقات الدولية يفتح آفاقاً جديدة'
      ],
      anger: [
        'غضب من الفساد والمحسوبية',
        'استياء من بطء الإصلاحات',
        'انتقادات لأداء المسؤولين',
        'رفض للتدخلات الخارجية'
      ],
      neutral: [
        'ترقب للتطورات السياسية',
        'متابعة للمفاوضات والحوارات',
        'انتظار نتائج الانتخابات'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف السياسي يعني قلقاً على الاستقرار. المواطنون يخشون المجهول ويريدون وضوحاً.',
      highHope: 'الأمل السياسي يعني إيماناً بإمكانية التغيير. هذا محرك للمشاركة الشعبية.',
      mixed: 'المجتمع منقسم سياسياً. هذا طبيعي لكنه يحتاج حواراً بناءً.',
      tense: 'التوتر السياسي قد يتحول لاحتجاجات إذا لم يُعالج بحكمة.'
    }
  },

  // ==================== 2. الاقتصاد (economy) ====================
  {
    domain: 'economy',
    keywords: ['اقتصاد', 'أسعار', 'غلاء', 'معيشة', 'رواتب', 'تضخم', 'بطالة', 'economy', 'prices', 'inflation', 'salary', 'unemployment', 'دولار', 'عملة', 'صرف', 'ذهب', 'فضة', 'استثمار', 'بنك', 'قرض'],
    causes: {
      fear: [
        'ارتفاع الأسعار يفوق زيادة الدخل',
        'تراجع القدرة الشرائية للمواطنين',
        'بطالة متزايدة خاصة بين الشباب',
        'عدم يقين اقتصادي يؤجل قرارات الاستثمار',
        'تراجع قيمة العملة المحلية',
        'شح السيولة في الأسواق'
      ],
      hope: [
        'مشاريع تنموية جديدة توفر فرص عمل',
        'توقعات بتحسن الأوضاع الاقتصادية',
        'دعم حكومي للفئات الأكثر تضرراً',
        'استثمارات أجنبية جديدة',
        'تحسن أسعار النفط والموارد'
      ],
      anger: [
        'غضب من الفجوة بين الأغنياء والفقراء',
        'استياء من ارتفاع الضرائب والرسوم',
        'انتقادات للسياسات الاقتصادية',
        'غضب من الفساد المالي'
      ],
      neutral: [
        'ترقب لمؤشرات اقتصادية جديدة',
        'نقاشات حول الحلول الاقتصادية',
        'متابعة لأسعار العملات والذهب'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف الاقتصادي يعني ضغطاً يومياً على الأسر. هذا يؤثر على الصحة النفسية والعلاقات.',
      highHope: 'الأمل الاقتصادي يعني استعداداً للعمل والبناء. هذا طاقة إيجابية يجب استثمارها.',
      mixed: 'المجتمع يتأرجح بين التفاؤل والتشاؤم حسب الأخبار اليومية.',
      tense: 'التوتر الاقتصادي المستمر قد يؤدي لاحتجاجات أو هجرة الكفاءات.'
    }
  },

  // ==================== 3. الصحة (health) ====================
  {
    domain: 'health',
    keywords: ['صحة', 'مرض', 'وباء', 'مستشفى', 'طب', 'علاج', 'دواء', 'health', 'disease', 'hospital', 'medicine', 'covid', 'كورونا', 'لقاح', 'طبيب', 'تأمين صحي', 'رعاية صحية'],
    causes: {
      fear: [
        'انتشار أمراض جديدة يثير القلق الجماعي',
        'ضعف البنية الصحية يزيد المخاوف',
        'ارتفاع تكاليف العلاج يضغط على الأسر',
        'نقص الأدوية والمستلزمات الطبية',
        'نقص الكوادر الطبية المؤهلة'
      ],
      hope: [
        'تطور العلاجات واللقاحات يبعث على التفاؤل',
        'وعي صحي متزايد في المجتمع',
        'مبادرات حكومية لتحسين الرعاية الصحية',
        'انتشار التأمين الصحي',
        'بناء مستشفيات ومراكز صحية جديدة'
      ],
      anger: [
        'غضب من إهمال القطاع الصحي',
        'استياء من الفساد في المستشفيات',
        'انتقادات لسوء الخدمات الصحية'
      ],
      neutral: [
        'متابعة للتطورات الصحية',
        'نقاشات حول إصلاح النظام الصحي',
        'مقارنة بين الخدمات الصحية'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف الصحي يعكس قلقاً وجودياً. الصحة أولوية قصوى للجميع وتؤثر على كل جوانب الحياة.',
      highHope: 'التفاؤل الصحي يعني ثقة في العلم والطب. هذا إيجابي ويشجع على الوقاية.',
      mixed: 'المجتمع يوازن بين الحذر الصحي والحياة الطبيعية.',
      tense: 'التوتر الصحي يحتاج تطمينات وإجراءات واضحة من السلطات.'
    }
  },

  // ==================== 4. التعليم (education) ====================
  {
    domain: 'education',
    keywords: ['تعليم', 'مدرسة', 'جامعة', 'طلاب', 'مناهج', 'education', 'school', 'university', 'students', 'معلم', 'أستاذ', 'امتحان', 'شهادة', 'تخرج', 'منحة'],
    causes: {
      fear: [
        'قلق من جودة المخرجات التعليمية وعدم مواكبتها لسوق العمل',
        'ارتفاع تكاليف التعليم الخاص مع تراجع جودة التعليم العام',
        'نقص الكوادر التدريسية المؤهلة',
        'المناهج القديمة لا تواكب متطلبات العصر الرقمي',
        'تسرب الطلاب من المدارس'
      ],
      hope: [
        'مبادرات إصلاح تعليمي جديدة تبعث على التفاؤل',
        'انتشار التعليم الإلكتروني يفتح فرصاً جديدة',
        'اهتمام حكومي متزايد بقطاع التعليم',
        'نجاحات طلابية في مسابقات دولية ترفع المعنويات',
        'شراكات مع جامعات عالمية'
      ],
      anger: [
        'غضب من الفجوة بين التعليم الخاص والعام',
        'استياء من البيروقراطية في المؤسسات التعليمية',
        'انتقادات لسياسات القبول الجامعي'
      ],
      neutral: [
        'نقاشات مستمرة حول إصلاح المناهج',
        'ترقب لنتائج الامتحانات والقبول',
        'مقارنة بين أنظمة التعليم'
      ]
    },
    socialMeaning: {
      highFear: 'هذا القلق يعكس خوفاً حقيقياً على مستقبل الأبناء. الأسر تشعر بضغط كبير لتوفير تعليم جيد.',
      highHope: 'التفاؤل بالتعليم يعني إيماناً بالمستقبل. هذا مؤشر إيجابي للمجتمع.',
      mixed: 'المجتمع يريد التغيير لكنه غير متأكد من الاتجاه الصحيح.',
      tense: 'التوتر حول التعليم قد يتحول لمطالبات شعبية بالإصلاح الجذري.'
    }
  },

  // ==================== 5. التكنولوجيا (technology) ====================
  {
    domain: 'technology',
    keywords: ['تكنولوجيا', 'ذكاء اصطناعي', 'إنترنت', 'تطبيق', 'رقمي', 'technology', 'AI', 'internet', 'digital', 'app', 'هاتف', 'حاسوب', 'برمجة', 'روبوت', 'سوشيال ميديا'],
    causes: {
      fear: [
        'قلق من استبدال الوظائف بالذكاء الاصطناعي',
        'مخاوف من انتهاك الخصوصية الرقمية',
        'الفجوة الرقمية تهدد بتهميش فئات',
        'الإدمان الرقمي يؤثر على الصحة النفسية',
        'انتشار المعلومات المضللة'
      ],
      hope: [
        'التكنولوجيا تفتح فرصاً جديدة للعمل والتعلم',
        'الرقمنة تسهل الحياة اليومية',
        'الابتكار التقني يحل مشاكل قديمة',
        'الشباب يتأقلم بسرعة مع التطور الرقمي',
        'فرص ريادة الأعمال التقنية'
      ],
      anger: [
        'غضب من احتكار شركات التكنولوجيا الكبرى',
        'استياء من المعلومات المضللة عبر الإنترنت',
        'انتقادات لسياسات الخصوصية'
      ],
      neutral: [
        'نقاشات حول مستقبل التكنولوجيا',
        'تقييم إيجابيات وسلبيات الرقمنة',
        'متابعة للتطورات التقنية'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف من التكنولوجيا يعكس قلقاً من التغيير السريع. التكيف والتعلم المستمر مطلوبان.',
      highHope: 'التفاؤل التقني يعني إيماناً بالتقدم. هذا محرك للابتكار والتطوير.',
      mixed: 'المجتمع يتعلم التوازن بين الاستفادة من التكنولوجيا وحماية نفسه من سلبياتها.',
      tense: 'التوتر التقني يحتاج توعية وتنظيماً أفضل لحماية المستخدمين.'
    }
  },

  // ==================== 6. المجتمع (society) ====================
  {
    domain: 'society',
    keywords: ['مجتمع', 'اجتماعي', 'زواج', 'طلاق', 'عائلة', 'شباب', 'مرأة', 'society', 'social', 'marriage', 'family', 'youth', 'عنوسة', 'عادات', 'تقاليد', 'ثقافة', 'هوية'],
    causes: {
      fear: [
        'ارتفاع معدلات الطلاق يقلق المجتمع',
        'صعوبة الزواج بسبب التكاليف المرتفعة',
        'الفجوة بين الأجيال تتسع',
        'تراجع القيم والتماسك الأسري',
        'مشاكل الإدمان والانحراف'
      ],
      hope: [
        'وعي متزايد بأهمية التواصل الأسري',
        'مبادرات لدعم الشباب وتمكينهم',
        'تغير إيجابي في النظرة لدور المرأة',
        'تضامن اجتماعي في الأزمات',
        'عودة الاهتمام بالهوية والتراث'
      ],
      anger: [
        'غضب من التمييز والظلم الاجتماعي',
        'استياء من العادات السلبية',
        'انتقادات للتفكك الأسري'
      ],
      neutral: [
        'نقاشات حول التغير الاجتماعي',
        'متابعة للقضايا المجتمعية',
        'مقارنة بين الأجيال'
      ]
    },
    socialMeaning: {
      highFear: 'القلق الاجتماعي يعكس تحولات عميقة في البنية المجتمعية. الحوار والتفاهم ضروريان.',
      highHope: 'التفاؤل الاجتماعي يعني إيماناً بقدرة المجتمع على التكيف والتطور.',
      mixed: 'المجتمع في مرحلة تحول. الحوار بين الأجيال ضروري.',
      tense: 'التوتر الاجتماعي يحتاج حلولاً جذرية وليس مسكنات مؤقتة.'
    }
  },

  // ==================== 7. الأمن والصراعات (security) ====================
  {
    domain: 'security',
    keywords: ['أمن', 'حرب', 'صراع', 'عنف', 'إرهاب', 'جيش', 'security', 'war', 'conflict', 'violence', 'منفذ', 'حدود', 'سلاح', 'ميليشيا', 'سلام', 'مصالحة'],
    causes: {
      fear: [
        'الصراعات المسلحة تهدد الاستقرار',
        'انتشار الأسلحة يزيد القلق',
        'التوترات الإقليمية تؤثر على الأمن المحلي',
        'ضعف المؤسسات الأمنية',
        'تهديدات إرهابية محتملة'
      ],
      hope: [
        'مفاوضات السلام تتقدم',
        'تحسن الوضع الأمني في بعض المناطق',
        'دعم دولي للاستقرار',
        'وعي مجتمعي بأهمية السلام',
        'جهود المصالحة الوطنية'
      ],
      anger: [
        'غضب من العنف والظلم',
        'استياء من التدخلات الخارجية',
        'انتقادات لفشل الحلول السياسية'
      ],
      neutral: [
        'متابعة للتطورات الأمنية',
        'ترقب لنتائج المفاوضات',
        'تحليل للوضع الإقليمي'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف الأمني يشل الحياة الطبيعية. الناس تريد الأمان أولاً قبل أي شيء آخر.',
      highHope: 'الأمل في السلام يعني استعداداً للمصالحة والبناء. هذا أساس للتنمية.',
      mixed: 'المجتمع يعيش بين الحذر والأمل. الصبر والحكمة مطلوبان.',
      tense: 'التوتر الأمني يحتاج حلولاً سياسية حقيقية وليس مجرد تهدئة مؤقتة.'
    }
  },

  // ==================== 8. البيئة والمناخ (environment) ====================
  {
    domain: 'environment',
    keywords: ['بيئة', 'مناخ', 'تلوث', 'طقس', 'فيضان', 'جفاف', 'environment', 'climate', 'pollution', 'weather', 'احتباس حراري', 'طاقة متجددة', 'نفايات', 'مياه', 'تصحر'],
    causes: {
      fear: [
        'التغيرات المناخية تهدد الزراعة والموارد المائية',
        'الكوارث الطبيعية أصبحت أكثر تكراراً',
        'التلوث يؤثر على الصحة العامة',
        'شح المياه يهدد المستقبل',
        'التصحر يزحف على الأراضي الزراعية'
      ],
      hope: [
        'وعي بيئي متزايد خاصة بين الشباب',
        'مبادرات الطاقة النظيفة تتوسع',
        'اتفاقيات دولية لحماية البيئة',
        'تكنولوجيا خضراء جديدة',
        'مشاريع إعادة التدوير'
      ],
      anger: [
        'غضب من تقاعس الحكومات في حماية البيئة',
        'استياء من الشركات الملوثة',
        'انتقادات لسياسات الطاقة'
      ],
      neutral: [
        'نقاشات حول التوازن بين التنمية والبيئة',
        'متابعة للتطورات المناخية',
        'مقارنة بين سياسات الدول'
      ]
    },
    socialMeaning: {
      highFear: 'القلق البيئي يعكس وعياً بالمسؤولية تجاه الأجيال القادمة. هذا قلق مشروع.',
      highHope: 'التفاؤل البيئي يعني إيماناً بإمكانية التغيير. هذا محرك للعمل الجماعي.',
      mixed: 'المجتمع يتعلم التوازن بين التنمية والاستدامة.',
      tense: 'التوتر البيئي يحتاج إجراءات عاجلة وحلولاً جذرية.'
    }
  },

  // ==================== 9. القانون والعدالة (law) ====================
  {
    domain: 'law',
    keywords: ['قانون', 'عدالة', 'محكمة', 'قاضي', 'محامي', 'حقوق', 'law', 'justice', 'court', 'rights', 'دستور', 'تشريع', 'جريمة', 'عقوبة', 'سجن', 'حرية'],
    causes: {
      fear: [
        'بطء إجراءات التقاضي يضيع الحقوق',
        'ضعف تطبيق القانون يشجع الفساد',
        'غياب العدالة يزيد الإحباط',
        'قوانين قديمة لا تواكب العصر',
        'تدخلات في القضاء تهدد استقلاليته'
      ],
      hope: [
        'إصلاحات قانونية جديدة تبعث على التفاؤل',
        'رقمنة الخدمات القضائية تسرع الإجراءات',
        'وعي متزايد بالحقوق القانونية',
        'قضاة نزيهون يعيدون الثقة',
        'قوانين جديدة لحماية الفئات الضعيفة'
      ],
      anger: [
        'غضب من الظلم وغياب المساءلة',
        'استياء من الفساد في الجهاز القضائي',
        'انتقادات لازدواجية المعايير'
      ],
      neutral: [
        'نقاشات حول إصلاح المنظومة القانونية',
        'متابعة للقضايا الكبرى',
        'مقارنة بين الأنظمة القانونية'
      ]
    },
    socialMeaning: {
      highFear: 'الخوف من غياب العدالة يهدد التماسك الاجتماعي. الناس تريد قانوناً يحميها.',
      highHope: 'الأمل في العدالة يعني إيماناً بالمؤسسات. هذا أساس للاستقرار.',
      mixed: 'المجتمع يراقب أداء القضاء بحذر. الثقة تُبنى بالأفعال لا بالأقوال.',
      tense: 'التوتر حول العدالة قد يؤدي لفقدان الثقة في الدولة.'
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
  const closingQuestion = generateClosingQuestion(topicData.domain, intent, emotionalState);
  
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
  
  // Default to society if no match (most general)
  return TOPIC_CAUSES_DATABASE.find(d => d.domain === 'society') || TOPIC_CAUSES_DATABASE[0];
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
    politics: {
      highFear: 'المشهد السياسي يمر بفترة عدم يقين. المواطنون قلقون على الاستقرار.',
      highHope: 'هناك تفاؤل بتحسن الوضع السياسي. المشاركة الشعبية تتزايد.',
      mixed: 'المشهد السياسي معقد. المواطنون منقسمون في تقييمهم.',
      tense: 'التوتر السياسي يحتاج حواراً حقيقياً. الاستقطاب يضر بالجميع.'
    },
    economy: {
      highFear: 'الضغط الاقتصادي يؤثر على الحياة اليومية. الأسر تعيد ترتيب أولوياتها.',
      highHope: 'هناك تفاؤل بتحسن الأوضاع الاقتصادية. مؤشرات إيجابية تظهر.',
      mixed: 'الوضع الاقتصادي غير مستقر. الناس يتأرجحون بين التفاؤل والتشاؤم.',
      tense: 'الضغط الاقتصادي المستمر يؤثر على المزاج العام والصحة النفسية.'
    },
    health: {
      highFear: 'القطاع الصحي يواجه تحديات. الناس قلقون على صحتهم وصحة أحبائهم.',
      highHope: 'هناك تفاؤل بتحسن الوضع الصحي. الوعي الصحي يتزايد.',
      mixed: 'المجتمع يوازن بين الحذر الصحي والحياة الطبيعية.',
      tense: 'التوتر الصحي يحتاج تطمينات وإجراءات واضحة.'
    },
    education: {
      highFear: 'قطاع التعليم يواجه تحديات حقيقية. الأسر قلقة على مستقبل أبنائها.',
      highHope: 'هناك حراك إيجابي في قطاع التعليم. مبادرات جديدة تبعث على التفاؤل.',
      mixed: 'المجتمع يناقش مستقبل التعليم بجدية. هناك رغبة في التغيير.',
      tense: 'الضغط على قطاع التعليم يتزايد. المطالبات بالإصلاح تتصاعد.'
    },
    technology: {
      highFear: 'التغيير التقني السريع يثير القلق. البعض يخشى التخلف عن الركب.',
      highHope: 'التكنولوجيا تفتح آفاقاً جديدة. الشباب متفائل بالمستقبل الرقمي.',
      mixed: 'المجتمع يتعلم التوازن بين الاستفادة من التكنولوجيا وحماية نفسه.',
      tense: 'التوتر التقني يحتاج توعية وتنظيماً أفضل.'
    },
    society: {
      highFear: 'القلق الاجتماعي يعكس تحولات عميقة في البنية المجتمعية.',
      highHope: 'التفاؤل الاجتماعي يعني إيماناً بالتغيير الإيجابي.',
      mixed: 'المجتمع في مرحلة تحول. الحوار بين الأجيال ضروري.',
      tense: 'التوتر الاجتماعي يحتاج حلولاً جذرية وليس مسكنات.'
    },
    security: {
      highFear: 'الخوف الأمني يشل الحياة الطبيعية. الناس تريد الأمان أولاً.',
      highHope: 'الأمل في السلام يعني استعداداً للمصالحة والبناء.',
      mixed: 'المجتمع يعيش بين الحذر والأمل. الصبر مطلوب.',
      tense: 'التوتر الأمني يحتاج حلولاً سياسية حقيقية.'
    },
    environment: {
      highFear: 'القلق البيئي يتزايد. الناس يشعرون بالمسؤولية تجاه الأجيال القادمة.',
      highHope: 'الوعي البيئي ينتشر. مبادرات الطاقة النظيفة تبعث على التفاؤل.',
      mixed: 'المجتمع يتعلم التوازن بين التنمية والاستدامة.',
      tense: 'التوتر البيئي يحتاج إجراءات عاجلة وحلولاً جذرية.'
    },
    law: {
      highFear: 'القلق من غياب العدالة يؤثر على الثقة في المؤسسات.',
      highHope: 'الأمل في إصلاح المنظومة القانونية يتزايد.',
      mixed: 'المجتمع يراقب أداء القضاء بحذر.',
      tense: 'التوتر حول العدالة يحتاج إصلاحات حقيقية.'
    }
  };
  
  return contexts[domain]?.[emotionalState] || contexts.society[emotionalState];
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

function generateClosingQuestion(domain: string, intent: string, emotionalState: string): string {
  const questions: Record<string, string[]> = {
    politics: [
      'هل تريد تحليل موقف سياسي محدد؟',
      'هل نستكشف سيناريوهات التطور السياسي؟',
      'هل تريد فهم تأثير السياسة على الاقتصاد؟'
    ],
    economy: [
      'هل تريد تحليل قطاع اقتصادي محدد؟',
      'هل نستكشف تأثير هذا الوضع على فئة معينة؟',
      'هل تريد توقعات للفترة القادمة؟'
    ],
    health: [
      'هل تريد تحليل المشاعر تجاه قضية صحية محددة؟',
      'هل نستكشف تأثير الصحة على الإنتاجية والاقتصاد؟',
      'هل تريد مقارنة بين الأنظمة الصحية؟'
    ],
    education: [
      'هل تريد تحليل قطاع التعليم في منطقة محددة؟',
      'هل نستكشف تأثير التعليم على سوق العمل؟',
      'هل تريد مقارنة بين التعليم الحكومي والخاص؟'
    ],
    technology: [
      'هل تريد تحليل المشاعر تجاه الذكاء الاصطناعي؟',
      'هل نستكشف تأثير التكنولوجيا على سوق العمل؟',
      'هل تريد فهم الفجوة الرقمية وتأثيرها؟'
    ],
    society: [
      'هل تريد تحليل قضية اجتماعية محددة؟',
      'هل نستكشف تأثير التغيرات الاجتماعية على الأسرة؟',
      'هل تريد مقارنة بين الأجيال في النظرة للقضايا؟'
    ],
    security: [
      'هل تريد تحليل المشاعر تجاه صراع محدد؟',
      'هل نستكشف تأثير الأمن على الاقتصاد؟',
      'هل تريد مقارنة المشاعر الأمنية بين المناطق؟'
    ],
    environment: [
      'هل تريد تحليل المشاعر تجاه قضية بيئية محددة؟',
      'هل نستكشف العلاقة بين البيئة والاقتصاد؟',
      'هل تريد معرفة ردود الفعل تجاه الطاقة المتجددة؟'
    ],
    law: [
      'هل تريد تحليل المشاعر تجاه قضية قانونية محددة؟',
      'هل نستكشف تأثير العدالة على الثقة في المؤسسات؟',
      'هل تريد مقارنة بين الأنظمة القانونية؟'
    ]
  };
  
  const domainQuestions = questions[domain] || questions.society;
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
