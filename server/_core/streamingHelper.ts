/**
 * Streaming Response Helper
 * Phase 67: Support streaming responses for real-time data display
 * 
 * Enables tRPC procedures to send data incrementally to the client
 * without waiting for the complete response.
 */

import { TRPCError } from '@trpc/server';

/**
 * Streaming chunk types
 */
export type StreamChunk = 
  | { type: 'thinking'; content: string }
  | { type: 'analysis'; content: string }
  | { type: 'emotion'; data: any }
  | { type: 'metadata'; data: any }
  | { type: 'complete'; data: any }
  | { type: 'error'; message: string };

/**
 * Streaming response handler
 * Sends chunks to client as they become available
 */
export class StreamingResponse {
  private chunks: StreamChunk[] = [];
  private isComplete = false;

  /**
   * Add a thinking chunk (intermediate analysis)
   */
  addThinking(content: string): void {
    this.chunks.push({ type: 'thinking', content });
  }

  /**
   * Add an analysis chunk (main response)
   */
  addAnalysis(content: string): void {
    this.chunks.push({ type: 'analysis', content });
  }

  /**
   * Add emotion data chunk
   */
  addEmotion(data: any): void {
    this.chunks.push({ type: 'emotion', data });
  }

  /**
   * Add metadata chunk
   */
  addMetadata(data: any): void {
    this.chunks.push({ type: 'metadata', data });
  }

  /**
   * Mark response as complete
   */
  complete(data: any): void {
    this.chunks.push({ type: 'complete', data });
    this.isComplete = true;
  }

  /**
   * Add error chunk
   */
  addError(message: string): void {
    this.chunks.push({ type: 'error', message });
  }

  /**
   * Get all chunks
   */
  getChunks(): StreamChunk[] {
    return this.chunks;
  }

  /**
   * Get chunks as JSON lines (for streaming)
   */
  toJSONLines(): string {
    return this.chunks.map(chunk => JSON.stringify(chunk)).join('\n');
  }

  /**
   * Check if response is complete
   */
  isCompleted(): boolean {
    return this.isComplete;
  }
}

/**
 * Create a streaming procedure that sends chunks to client
 * Usage in tRPC:
 * 
 * analyzeTopicStream: publicProcedure
 *   .input(z.object({ topic: z.string() }))
 *   .mutation(async ({ input, ctx }) => {
 *     const stream = new StreamingResponse();
 *     
 *     // Send thinking chunk
 *     stream.addThinking('جاري تحليل الموضوع...');
 *     
 *     // Do analysis...
 *     stream.addAnalysis('النتيجة...');
 *     
 *     // Complete
 *     stream.complete({ success: true });
 *     
 *     return stream.getChunks();
 *   })
 */

/**
 * Helper to stream analysis results
 */
export async function* streamAnalysis(
  topic: string,
  analyzerFn: (topic: string) => Promise<any>
): AsyncGenerator<StreamChunk> {
  try {
    // Thinking phase
    yield { type: 'thinking', content: `جاري تحليل "${topic}"...` };

    // Run analysis
    const result = await analyzerFn(topic);

    // Analysis phase
    if (result.intelligentResponse) {
      yield { type: 'analysis', content: result.intelligentResponse };
    }

    // Emotion phase
    if (result.emotionData) {
      yield { type: 'emotion', data: result.emotionData };
    }

    // Metadata phase
    if (result.pipelineMetadata) {
      yield { type: 'metadata', data: result.pipelineMetadata };
    }

    // Complete
    yield { type: 'complete', data: result };
  } catch (error) {
    yield {
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Convert streaming response to SSE format for HTTP streaming
 */
export function toSSEFormat(chunks: StreamChunk[]): string {
  return chunks
    .map(chunk => {
      const data = JSON.stringify(chunk);
      return `data: ${data}\n\n`;
    })
    .join('');
}
