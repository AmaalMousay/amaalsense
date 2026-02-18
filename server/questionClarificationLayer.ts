import { invokeLLM } from "./_core/llm";

/**
 * Question Clarification Layer (Phase 90)
 * 
 * Detects ambiguous or unclear questions and generates clarification requests
 * to ensure the user's intent is properly understood before analysis
 */

export interface ClarificationRequest {
  isAmbiguous: boolean;
  ambiguityType: "vague" | "incomplete" | "multiple_meanings" | "context_missing" | "clear";
  clarificationQuestions: string[];
  suggestedInterpretations: string[];
  confidence: number; // 0-100
}

/**
 * Detect if a question is ambiguous and needs clarification
 */
export async function detectAmbiguity(question: string, language: string = "ar"): Promise<ClarificationRequest> {
  try {
    // Quick heuristic checks first
    const heuristicResult = performHeuristicCheck(question, language);
    if (heuristicResult.confidence > 85) {
      return heuristicResult;
    }

    // Use LLM for deeper analysis
    const llmPrompt = buildClarificationPrompt(question, language);
    
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert at identifying ambiguous questions. Analyze the following question and determine if it needs clarification. 
          
          Respond with a JSON object containing:
          - isAmbiguous: boolean
          - ambiguityType: one of "vague", "incomplete", "multiple_meanings", "context_missing", "clear"
          - clarificationQuestions: array of 2-3 questions to clarify
          - suggestedInterpretations: array of 2-3 possible interpretations
          - confidence: number between 0-100`
        },
        {
          role: "user",
          content: llmPrompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ambiguity_detection",
          strict: true,
          schema: {
            type: "object",
            properties: {
              isAmbiguous: { type: "boolean" },
              ambiguityType: { 
                type: "string",
                enum: ["vague", "incomplete", "multiple_meanings", "context_missing", "clear"]
              },
              clarificationQuestions: { 
                type: "array",
                items: { type: "string" },
                minItems: 1,
                maxItems: 3
              },
              suggestedInterpretations: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
                maxItems: 3
              },
              confidence: { type: "number", minimum: 0, maximum: 100 }
            },
            required: ["isAmbiguous", "ambiguityType", "clarificationQuestions", "suggestedInterpretations", "confidence"],
            additionalProperties: false
          }
        }
      }
    });

    // Parse response
    const content = response.choices[0].message.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      return {
        isAmbiguous: parsed.isAmbiguous,
        ambiguityType: parsed.ambiguityType,
        clarificationQuestions: parsed.clarificationQuestions,
        suggestedInterpretations: parsed.suggestedInterpretations,
        confidence: parsed.confidence
      };
    }

    return heuristicResult;
  } catch (error) {
    console.error("Error in detectAmbiguity:", error);
    // Fallback to heuristic
    return performHeuristicCheck(question, language);
  }
}

/**
 * Perform quick heuristic checks for ambiguity
 */
function performHeuristicCheck(question: string, language: string): ClarificationRequest {
  const lowerQuestion = question.toLowerCase();
  
  // Check for vague questions
  const vaguePatterns = [
    /ما رأي.*الناس\?$/,  // "What do people think?" (Arabic)
    /what.*people.*think/i,  // English
    /ما الأفضل\?$/,  // "What's best?" (Arabic)
    /what.*best/i,  // English
    /كيف.*الناس\?$/,  // "How are people?" (Arabic)
    /how.*people/i  // English
  ];

  const isVague = vaguePatterns.some(pattern => pattern.test(lowerQuestion));
  
  if (isVague) {
    return {
      isAmbiguous: true,
      ambiguityType: "vague",
      clarificationQuestions: language === "ar" 
        ? [
            "هل تقصد رأي الناس حول موضوع معين؟",
            "ما هو الموضوع الذي تريد معرفة رأي الناس فيه؟",
            "هل تريد تحليل عام أم تحليل لمنطقة جغرافية محددة؟"
          ]
        : [
            "Do you mean people's opinion about a specific topic?",
            "What is the topic you want to know people's opinion about?",
            "Do you want a general analysis or for a specific geographic region?"
          ],
      suggestedInterpretations: language === "ar"
        ? [
            "رأي الناس حول موضوع سياسي",
            "رأي الناس حول موضوع اقتصادي",
            "رأي الناس حول موضوع اجتماعي"
          ]
        : [
            "People's opinion about a political topic",
            "People's opinion about an economic topic",
            "People's opinion about a social topic"
          ],
      confidence: 90
    };
  }

  // Check for incomplete questions
  const incompletePatterns = [
    /\?$/,  // Ends with question mark but very short
    /^(من|ما|كيف|أين|متى|لماذا)\s*\?$/i,  // Single word question (Arabic)
    /^(who|what|how|where|when|why)\s*\?$/i  // Single word question (English)
  ];

  const isIncomplete = question.length < 10 && incompletePatterns.some(pattern => pattern.test(lowerQuestion));
  
  if (isIncomplete) {
    return {
      isAmbiguous: true,
      ambiguityType: "incomplete",
      clarificationQuestions: language === "ar"
        ? [
            "يرجى توضيح سؤالك بشكل أكثر تفصيلاً",
            "ما هو الموضوع الذي تريد تحليله؟",
            "هل تريد معرفة المشاعر أم الآراء أم الاتجاهات؟"
          ]
        : [
            "Please clarify your question in more detail",
            "What is the topic you want to analyze?",
            "Do you want to know emotions, opinions, or trends?"
          ],
      suggestedInterpretations: language === "ar"
        ? ["سؤال غير واضح - يحتاج توضيح"]
        : ["Unclear question - needs clarification"],
      confidence: 85
    };
  }

  // No ambiguity detected
  return {
    isAmbiguous: false,
    ambiguityType: "clear",
    clarificationQuestions: [],
    suggestedInterpretations: [],
    confidence: 95
  };
}

/**
 * Build clarification prompt for LLM
 */
function buildClarificationPrompt(question: string, language: string): string {
  if (language === "ar") {
    return `السؤال: "${question}"
    
    هل هذا السؤال غامض أو يحتاج توضيح؟ إذا كان غامضاً، اقترح أسئلة توضيحية وتفسيرات محتملة.`;
  }
  
  return `Question: "${question}"
  
  Is this question ambiguous or needs clarification? If it is, suggest clarification questions and possible interpretations.`;
}

/**
 * Generate a clarification dialog response
 */
export async function generateClarificationDialog(
  question: string,
  clarification: ClarificationRequest,
  language: string = "ar"
): Promise<string> {
  if (!clarification.isAmbiguous) {
    return "";
  }

  const typeMessages = {
    ar: {
      vague: "السؤال الذي طرحته عام جداً ويحتاج توضيح",
      incomplete: "السؤال ناقص ويحتاج معلومات إضافية",
      multiple_meanings: "السؤال قد يعني عدة أشياء مختلفة",
      context_missing: "السؤال يفتقد السياق اللازم للإجابة الدقيقة",
      clear: "السؤال واضح"
    },
    en: {
      vague: "Your question is too general and needs clarification",
      incomplete: "Your question is incomplete and needs more information",
      multiple_meanings: "Your question could mean several different things",
      context_missing: "Your question is missing the context needed for an accurate answer",
      clear: "Your question is clear"
    }
  };

  const messages = language === "ar" ? typeMessages.ar : typeMessages.en;
  const typeMessage = messages[clarification.ambiguityType as keyof typeof messages];

  let dialog = `${typeMessage}.\n\n`;
  
  if (clarification.clarificationQuestions.length > 0) {
    dialog += language === "ar" ? "هل تقصد:\n" : "Did you mean:\n";
    clarification.clarificationQuestions.forEach((q, i) => {
      dialog += `${i + 1}. ${q}\n`;
    });
  }

  return dialog;
}
