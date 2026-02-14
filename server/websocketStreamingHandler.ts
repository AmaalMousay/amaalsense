import { EventVector } from './graphPipeline';
import { invokeLLM } from './_core/llm';
import { eventVectorToNumericalVector, createVectorPromptInLanguage } from './dataToVectorConverter';

/**
 * WebSocket Streaming Handler
 * Streams Groq responses character-by-character to frontend
 */

/**
 * Stream EventVector analysis to WebSocket
 * Sends response chunks as they arrive from Groq
 */
export async function* streamEventVectorAnalysis(
  vector: EventVector,
  language: string = 'en'
): AsyncGenerator<string> {
  try {
    // 1. Convert EventVector to numerical vector
    const numericalVector = eventVectorToNumericalVector(vector);

    // 2. Create vector-based prompt
    const vectorPrompt = createVectorPromptInLanguage(vector, language);

    // 3. Create system message with language awareness
    const systemMessages: Record<string, string> = {
      en: 'You are an expert emotional climate analyst. Analyze the vector and provide insights.',
      ar: 'أنت خبير في تحليل المناخ العاطفي. حلل المتجه وقدم رؤى.',
      fr: 'Vous êtes un expert en analyse du climat émotionnel. Analysez le vecteur et fournissez des perspectives.',
      es: 'Eres un experto en análisis del clima emocional. Analiza el vector y proporciona perspectivas.',
      de: 'Sie sind ein Experte für die Analyse des emotionalen Klimas. Analysieren Sie den Vektor und geben Sie Einblicke.',
      zh: '你是情感气候分析专家。分析向量并提供见解。',
      ja: 'あなたは感情気候分析の専門家です。ベクトルを分析し、洞察を提供してください。',
    };

    // 4. Call Groq LLM (note: standard invokeLLM doesn't support streaming)
    // For now, we'll simulate streaming by chunking the response
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: systemMessages[language] || systemMessages.en,
        },
        {
          role: 'user',
          content: vectorPrompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    const responseText = typeof content === 'string' ? content : '';

    // 5. Simulate streaming by yielding chunks (in production, use actual streaming API)
    const chunkSize = 50; // Characters per chunk
    for (let i = 0; i < responseText.length; i += chunkSize) {
      const chunk = responseText.substring(i, i + chunkSize);
      yield chunk;
      // Simulate delay for realistic streaming effect
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  } catch (error) {
    console.error('Error streaming analysis:', error);
    throw error;
  }
}

/**
 * Format streaming response with metadata
 */
export interface StreamingResponse {
  type: 'chunk' | 'metadata' | 'complete' | 'error';
  data: string;
  timestamp: number;
  chunkIndex?: number;
}

/**
 * Stream with metadata
 */
export async function* streamWithMetadata(
  vector: EventVector,
  language: string = 'en'
): AsyncGenerator<StreamingResponse> {
  try {
    // Send metadata first
    yield {
      type: 'metadata',
      data: JSON.stringify({
        language,
        topic: vector.topic,
        dominantEmotion: vector.dominantEmotion,
        region: vector.region,
      }),
      timestamp: Date.now(),
    };

    // Stream analysis chunks
    let chunkIndex = 0;
    for await (const chunk of streamEventVectorAnalysis(vector, language)) {
      yield {
        type: 'chunk',
        data: chunk,
        timestamp: Date.now(),
        chunkIndex: chunkIndex++,
      };
    }

    // Send completion signal
    yield {
      type: 'complete',
      data: 'Analysis complete',
      timestamp: Date.now(),
    };
  } catch (error) {
    yield {
      type: 'error',
      data: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    };
  }
}

/**
 * Collect full response from stream
 */
export async function collectStreamResponse(
  vector: EventVector,
  language: string = 'en'
): Promise<string> {
  let fullResponse = '';

  for await (const chunk of streamEventVectorAnalysis(vector, language)) {
    fullResponse += chunk;
  }

  return fullResponse;
}

/**
 * Stream with progress tracking
 */
export async function* streamWithProgress(
  vector: EventVector,
  language: string = 'en'
): AsyncGenerator<{
  progress: number;
  chunk: string;
  timestamp: number;
}> {
  const chunks: string[] = [];

  for await (const chunk of streamEventVectorAnalysis(vector, language)) {
    chunks.push(chunk);
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    // Estimate progress (0-100%)
    const progress = Math.min(100, Math.round((chunks.length / 20) * 100));

    yield {
      progress,
      chunk,
      timestamp: Date.now(),
    };
  }
}

/**
 * Convert streaming response to SSE (Server-Sent Events) format
 */
export function formatAsSSE(response: StreamingResponse): string {
  if (response.type === 'chunk') {
    return `data: ${JSON.stringify(response)}\n\n`;
  }
  if (response.type === 'metadata') {
    return `event: metadata\ndata: ${response.data}\n\n`;
  }
  if (response.type === 'complete') {
    return `event: complete\ndata: ${response.data}\n\n`;
  }
  if (response.type === 'error') {
    return `event: error\ndata: ${response.data}\n\n`;
  }
  return '';
}

/**
 * Buffer streaming responses for batch sending
 */
export async function* bufferStream(
  vector: EventVector,
  language: string = 'en',
  bufferSize: number = 5
): AsyncGenerator<StreamingResponse[]> {
  const buffer: StreamingResponse[] = [];
  let chunkIndex = 0;

  for await (const response of streamWithMetadata(vector, language)) {
    buffer.push(response);

    if (buffer.length >= bufferSize || response.type === 'complete') {
      yield [...buffer];
      buffer.length = 0;
    }
  }

  if (buffer.length > 0) {
    yield buffer;
  }
}
