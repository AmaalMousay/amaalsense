/**
 * Dynamic Response Engine
 * محرك الرد الديناميكي - شكل الرد يتغير حسب نوع السؤال
 * 
 * المشكلة التي يحلها:
 * - كل رد يتبع نفس الهيكل الثابت (الخلاصة → لماذا → الأسباب → ...)
 * - حتى لو السؤال بسيط أو سؤال متابعة!
 * 
 * الحل:
 * - شكل الرد يتغير حسب: نوع السؤال، موقعه في الجلسة، دور المستخدم
 */

import { QuestionIntent } from './sessionContext';

export interface ResponseStructure {
  format: ResponseFormat;
  sections: ResponseSection[];
  style: ResponseStyle;
  maxLength: 'short' | 'medium' | 'long';
}

export type ResponseFormat = 
  | 'full_analysis'      // تحليل كامل (للأسئلة الأولى)
  | 'direct_answer'      // إجابة مباشرة (هل؟)
  | 'list'               // قائمة (ما المخاطر؟)
  | 'comparison'         // جدول مقارنة
  | 'scenario'           // سيناريو (ماذا لو؟)
  | 'brief_followup'     // متابعة مختصرة
  | 'deep_explanation'   // تفسير عميق (لماذا؟)
  | 'recommendation'     // توصية مركزة
  | 'clarification';     // توضيح نقطة محددة

export interface ResponseSection {
  name: string;
  required: boolean;
  order: number;
}

export interface ResponseStyle {
  useHeadings: boolean;
  useNumbering: boolean;
  useBullets: boolean;
  startWith: 'judgment' | 'question' | 'warning' | 'story' | 'data';
  tone: 'consultant' | 'reporter' | 'academic' | 'conversational';
}

export interface DynamicResponseConfig {
  questionIntent: QuestionIntent;
  questionNumber: number;
  userRole: string;
  isFollowUp: boolean;
  hasContext: boolean;
}

/**
 * تحديد هيكل الرد بناءً على السياق
 */
export function determineResponseStructure(config: DynamicResponseConfig): ResponseStructure {
  const { questionIntent, questionNumber, userRole, isFollowUp } = config;
  
  // سؤال متابعة قصير
  if (isFollowUp && questionNumber > 1) {
    return getFollowUpStructure(questionIntent, questionNumber);
  }
  
  // سؤال أول أو سؤال جديد
  return getNewQuestionStructure(questionIntent, userRole);
}

/**
 * هيكل الرد لأسئلة المتابعة
 */
function getFollowUpStructure(intent: QuestionIntent, questionNumber: number): ResponseStructure {
  // السؤال الثاني - رد متوسط
  if (questionNumber === 2) {
    return {
      format: getFormatForIntent(intent.type),
      sections: getSectionsForFollowUp(intent.type, 'medium'),
      style: {
        useHeadings: false,
        useNumbering: intent.type === 'risks',
        useBullets: true,
        startWith: 'judgment',
        tone: 'consultant',
      },
      maxLength: 'medium',
    };
  }
  
  // السؤال الثالث فأكثر - رد مختصر جداً
  return {
    format: getFormatForIntent(intent.type),
    sections: getSectionsForFollowUp(intent.type, 'short'),
    style: {
      useHeadings: false,
      useNumbering: false,
      useBullets: intent.type === 'risks',
      startWith: 'judgment',
      tone: 'conversational',
    },
    maxLength: 'short',
  };
}

/**
 * هيكل الرد للأسئلة الجديدة
 */
function getNewQuestionStructure(intent: QuestionIntent, userRole: string): ResponseStructure {
  const baseStructure = getBaseStructureForIntent(intent.type);
  
  // تعديل حسب دور المستخدم
  return adjustForUserRole(baseStructure, userRole);
}

/**
 * تحديد الصيغة حسب نوع السؤال
 */
function getFormatForIntent(type: QuestionIntent['type']): ResponseFormat {
  const formatMap: Record<QuestionIntent['type'], ResponseFormat> = {
    'why': 'deep_explanation',
    'what': 'full_analysis',
    'how': 'deep_explanation',
    'risks': 'list',
    'recommendation': 'recommendation',
    'whatif': 'scenario',
    'comparison': 'comparison',
    'followup': 'brief_followup',
    'clarification': 'clarification',
  };
  
  return formatMap[type] || 'full_analysis';
}

/**
 * تحديد الأقسام لأسئلة المتابعة
 */
function getSectionsForFollowUp(type: QuestionIntent['type'], length: 'short' | 'medium'): ResponseSection[] {
  if (length === 'short') {
    // رد مختصر جداً - قسم واحد فقط
    return [
      { name: 'direct_answer', required: true, order: 1 },
    ];
  }
  
  // رد متوسط - قسمين
  const sectionsByType: Record<string, ResponseSection[]> = {
    'risks': [
      { name: 'risks_list', required: true, order: 1 },
      { name: 'brief_implication', required: false, order: 2 },
    ],
    'recommendation': [
      { name: 'recommendation', required: true, order: 1 },
      { name: 'brief_reasoning', required: false, order: 2 },
    ],
    'whatif': [
      { name: 'scenario', required: true, order: 1 },
      { name: 'probability', required: false, order: 2 },
    ],
    'why': [
      { name: 'main_reason', required: true, order: 1 },
      { name: 'supporting_evidence', required: false, order: 2 },
    ],
  };
  
  return sectionsByType[type] || [
    { name: 'direct_answer', required: true, order: 1 },
    { name: 'brief_context', required: false, order: 2 },
  ];
}

/**
 * الهيكل الأساسي حسب نوع السؤال
 */
function getBaseStructureForIntent(type: QuestionIntent['type']): ResponseStructure {
  const structures: Record<QuestionIntent['type'], ResponseStructure> = {
    'why': {
      format: 'deep_explanation',
      sections: [
        { name: 'core_reason', required: true, order: 1 },
        { name: 'contributing_factors', required: true, order: 2 },
        { name: 'evidence', required: false, order: 3 },
        { name: 'implication', required: false, order: 4 },
      ],
      style: {
        useHeadings: true,
        useNumbering: true,
        useBullets: false,
        startWith: 'judgment',
        tone: 'consultant',
      },
      maxLength: 'long',
    },
    
    'what': {
      format: 'full_analysis',
      sections: [
        { name: 'summary', required: true, order: 1 },
        { name: 'analysis', required: true, order: 2 },
        { name: 'causes', required: true, order: 3 },
        { name: 'implications', required: false, order: 4 },
        { name: 'recommendation', required: false, order: 5 },
      ],
      style: {
        useHeadings: true,
        useNumbering: false,
        useBullets: true,
        startWith: 'judgment',
        tone: 'consultant',
      },
      maxLength: 'long',
    },
    
    'how': {
      format: 'deep_explanation',
      sections: [
        { name: 'mechanism', required: true, order: 1 },
        { name: 'steps', required: false, order: 2 },
        { name: 'factors', required: false, order: 3 },
      ],
      style: {
        useHeadings: true,
        useNumbering: true,
        useBullets: false,
        startWith: 'data',
        tone: 'consultant',
      },
      maxLength: 'medium',
    },
    
    'risks': {
      format: 'list',
      sections: [
        { name: 'risks_list', required: true, order: 1 },
        { name: 'severity_assessment', required: false, order: 2 },
        { name: 'mitigation', required: false, order: 3 },
      ],
      style: {
        useHeadings: false,
        useNumbering: true,
        useBullets: false,
        startWith: 'warning',
        tone: 'consultant',
      },
      maxLength: 'medium',
    },
    
    'recommendation': {
      format: 'recommendation',
      sections: [
        { name: 'main_recommendation', required: true, order: 1 },
        { name: 'reasoning', required: false, order: 2 },
        { name: 'alternatives', required: false, order: 3 },
      ],
      style: {
        useHeadings: false,
        useNumbering: false,
        useBullets: false,
        startWith: 'judgment',
        tone: 'consultant',
      },
      maxLength: 'short',
    },
    
    'whatif': {
      format: 'scenario',
      sections: [
        { name: 'scenario_description', required: true, order: 1 },
        { name: 'probability', required: false, order: 2 },
        { name: 'consequences', required: true, order: 3 },
        { name: 'preparation', required: false, order: 4 },
      ],
      style: {
        useHeadings: true,
        useNumbering: false,
        useBullets: true,
        startWith: 'story',
        tone: 'consultant',
      },
      maxLength: 'medium',
    },
    
    'comparison': {
      format: 'comparison',
      sections: [
        { name: 'comparison_table', required: true, order: 1 },
        { name: 'key_differences', required: true, order: 2 },
        { name: 'verdict', required: false, order: 3 },
      ],
      style: {
        useHeadings: true,
        useNumbering: false,
        useBullets: false,
        startWith: 'data',
        tone: 'consultant',
      },
      maxLength: 'medium',
    },
    
    'followup': {
      format: 'brief_followup',
      sections: [
        { name: 'direct_answer', required: true, order: 1 },
      ],
      style: {
        useHeadings: false,
        useNumbering: false,
        useBullets: false,
        startWith: 'judgment',
        tone: 'conversational',
      },
      maxLength: 'short',
    },
    
    'clarification': {
      format: 'clarification',
      sections: [
        { name: 'clarification', required: true, order: 1 },
        { name: 'example', required: false, order: 2 },
      ],
      style: {
        useHeadings: false,
        useNumbering: false,
        useBullets: false,
        startWith: 'judgment',
        tone: 'conversational',
      },
      maxLength: 'short',
    },
  };
  
  return structures[type] || structures['what'];
}

/**
 * تعديل الهيكل حسب دور المستخدم
 */
function adjustForUserRole(structure: ResponseStructure, role: string): ResponseStructure {
  const adjustments: Record<string, Partial<ResponseStyle>> = {
    'journalist': {
      startWith: 'story',
      tone: 'reporter',
      useHeadings: true,
    },
    'researcher': {
      startWith: 'data',
      tone: 'academic',
      useNumbering: true,
    },
    'politician': {
      startWith: 'warning',
      tone: 'consultant',
      useBullets: true,
    },
    'economist': {
      startWith: 'data',
      tone: 'consultant',
      useNumbering: true,
    },
  };
  
  const roleAdjustment = adjustments[role];
  if (roleAdjustment) {
    return {
      ...structure,
      style: {
        ...structure.style,
        ...roleAdjustment,
      },
    };
  }
  
  return structure;
}

/**
 * توليد تعليمات الصياغة للـ LLM
 */
export function generateFormattingInstructions(structure: ResponseStructure): string {
  const instructions: string[] = [];
  
  // تعليمات الطول
  const lengthGuide = {
    'short': 'اجعل الرد مختصراً جداً (2-3 جمل فقط)',
    'medium': 'اجعل الرد متوسط الطول (فقرة أو فقرتين)',
    'long': 'يمكنك التفصيل لكن بدون إطالة غير ضرورية',
  };
  instructions.push(lengthGuide[structure.maxLength]);
  
  // تعليمات البداية
  const startGuide = {
    'judgment': 'ابدأ بالحكم أو الاستنتاج الرئيسي مباشرة',
    'question': 'ابدأ بسؤال يثير التفكير',
    'warning': 'ابدأ بتحذير أو تنبيه إذا كان مناسباً',
    'story': 'ابدأ بسياق قصصي مختصر',
    'data': 'ابدأ بالأرقام أو الحقائق الرئيسية',
  };
  instructions.push(startGuide[structure.style.startWith]);
  
  // تعليمات التنسيق
  if (!structure.style.useHeadings) {
    instructions.push('لا تستخدم عناوين، اكتب بشكل متصل');
  }
  if (structure.style.useNumbering) {
    instructions.push('استخدم الترقيم للنقاط الرئيسية');
  }
  if (structure.style.useBullets) {
    instructions.push('استخدم النقاط للقوائم');
  }
  
  // تعليمات النبرة
  const toneGuide = {
    'consultant': 'تكلم كمستشار خبير: مباشر، حاسم، واثق',
    'reporter': 'تكلم كصحفي: موضوعي، يقدم الحقائق',
    'academic': 'تكلم كباحث: دقيق، يستشهد بالأدلة',
    'conversational': 'تكلم بشكل طبيعي كأنك تتحدث مع صديق',
  };
  instructions.push(toneGuide[structure.style.tone]);
  
  // تعليمات الأقسام
  const requiredSections = structure.sections
    .filter(s => s.required)
    .map(s => s.name);
  
  if (requiredSections.length > 0) {
    instructions.push(`تأكد من تغطية: ${requiredSections.join('، ')}`);
  }
  
  return instructions.join('\n');
}

/**
 * تصدير الدوال
 */
export const DynamicResponseEngine = {
  determineResponseStructure,
  generateFormattingInstructions,
  getFormatForIntent,
};
