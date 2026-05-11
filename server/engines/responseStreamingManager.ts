/**
 * Response Streaming Manager - Fix Bug #3: Broken/Incomplete Responses
 * 
 * Ensures that long responses are properly streamed without being cut off
 * Handles:
 * - Message buffering and chunking
 * - Streaming pipeline management
 * - Response validation and completion checking
 * - Error recovery and retry logic
 */

export interface StreamChunk {
  id: string;
  sequence: number;
  content: string;
  isComplete: boolean;
  timestamp: number;
  size: number;
}

export interface StreamedResponse {
  id: string;
  totalChunks: number;
  chunks: StreamChunk[];
  fullContent: string;
  isComplete: boolean;
  startTime: number;
  endTime?: number;
  duration?: number;
  errors: string[];
}

/**
 * Manages active streaming responses
 */
const activeStreams = new Map<string, StreamedResponse>();

/**
 * Configuration for streaming
 */
const STREAM_CONFIG = {
  MAX_CHUNK_SIZE: 2048, // Max size per chunk (2KB)
  MAX_RESPONSE_SIZE: 65536, // Max total response size (64KB)
  CHUNK_TIMEOUT: 30000, // 30 seconds timeout per chunk
  STREAM_TIMEOUT: 120000, // 2 minutes total timeout
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second between retries
};

/**
 * Generate unique stream ID
 */
function generateStreamId(): string {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new streaming response
 */
export function createStream(initialContent?: string): string {
  const streamId = generateStreamId();
  
  const stream: StreamedResponse = {
    id: streamId,
    totalChunks: 0,
    chunks: [],
    fullContent: initialContent || '',
    isComplete: false,
    startTime: Date.now(),
    errors: [],
  };
  
  activeStreams.set(streamId, stream);
  
  // Auto-cleanup after timeout
  setTimeout(() => {
    if (activeStreams.has(streamId)) {
      const stream = activeStreams.get(streamId)!;
      if (!stream.isComplete) {
        stream.errors.push('Stream timeout - response incomplete');
        stream.isComplete = true;
        stream.endTime = Date.now();
        stream.duration = stream.endTime - stream.startTime;
      }
    }
  }, STREAM_CONFIG.STREAM_TIMEOUT);
  
  return streamId;
}

/**
 * Add a chunk to the stream
 */
export function addChunk(streamId: string, content: string, isLastChunk: boolean = false): boolean {
  const stream = activeStreams.get(streamId);
  if (!stream) {
    console.error(`[StreamingManager] Stream not found: ${streamId}`);
    return false;
  }
  
  // Check size limits
  const newSize = stream.fullContent.length + content.length;
  if (newSize > STREAM_CONFIG.MAX_RESPONSE_SIZE) {
    stream.errors.push(`Response exceeds maximum size: ${newSize} > ${STREAM_CONFIG.MAX_RESPONSE_SIZE}`);
    stream.isComplete = true;
    stream.endTime = Date.now();
    stream.duration = stream.endTime - stream.startTime;
    return false;
  }
  
  // Create chunk
  const chunk: StreamChunk = {
    id: `${streamId}_chunk_${stream.chunks.length}`,
    sequence: stream.chunks.length,
    content,
    isComplete: isLastChunk,
    timestamp: Date.now(),
    size: content.length,
  };
  
  stream.chunks.push(chunk);
  stream.fullContent += content;
  stream.totalChunks = stream.chunks.length;
  
  // Mark as complete if this is the last chunk
  if (isLastChunk) {
    stream.isComplete = true;
    stream.endTime = Date.now();
    stream.duration = stream.endTime - stream.startTime;
  }
  
  return true;
}

/**
 * Get the current stream status
 */
export function getStreamStatus(streamId: string): StreamedResponse | null {
  return activeStreams.get(streamId) || null;
}

/**
 * Get the full content of a stream
 */
export function getStreamContent(streamId: string): string | null {
  const stream = activeStreams.get(streamId);
  if (!stream) return null;
  
  return stream.fullContent;
}

/**
 * Mark a stream as complete
 */
export function completeStream(streamId: string): boolean {
  const stream = activeStreams.get(streamId);
  if (!stream) return false;
  
  stream.isComplete = true;
  stream.endTime = Date.now();
  stream.duration = stream.endTime - stream.startTime;
  
  return true;
}

/**
 * Split a long response into chunks
 */
export function splitIntoChunks(content: string, chunkSize: number = STREAM_CONFIG.MAX_CHUNK_SIZE): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split by sentences to avoid breaking in the middle of a word
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Stream a response with automatic chunking
 */
export function streamResponse(content: string): string {
  const streamId = createStream();
  const chunks = splitIntoChunks(content);
  
  chunks.forEach((chunk, index) => {
    const isLastChunk = index === chunks.length - 1;
    addChunk(streamId, chunk, isLastChunk);
  });
  
  return streamId;
}

/**
 * Validate that a response is complete
 */
export function validateResponseCompletion(streamId: string): { isComplete: boolean; issues: string[] } {
  const stream = activeStreams.get(streamId);
  if (!stream) {
    return {
      isComplete: false,
      issues: ['Stream not found'],
    };
  }
  
  const issues: string[] = [];
  
  // Check if marked as complete
  if (!stream.isComplete) {
    issues.push('Stream not marked as complete');
  }
  
  // Check if has content
  if (stream.fullContent.length === 0) {
    issues.push('Stream has no content');
  }
  
  // Check for errors
  if (stream.errors.length > 0) {
    issues.push(`Stream has ${stream.errors.length} error(s): ${stream.errors.join(', ')}`);
  }
  
  // Check if chunks are in order
  for (let i = 0; i < stream.chunks.length; i++) {
    if (stream.chunks[i].sequence !== i) {
      issues.push(`Chunk sequence mismatch at index ${i}`);
    }
  }
  
  return {
    isComplete: issues.length === 0,
    issues,
  };
}

/**
 * Retry streaming a response
 */
export async function retryStream(
  streamId: string,
  retryFn: () => Promise<string>,
  attempt: number = 0
): Promise<string> {
  try {
    const content = await retryFn();
    
    // Clear old stream and create new one
    activeStreams.delete(streamId);
    return streamResponse(content);
  } catch (error) {
    if (attempt < STREAM_CONFIG.RETRY_ATTEMPTS) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, STREAM_CONFIG.RETRY_DELAY * (attempt + 1)));
      return retryStream(streamId, retryFn, attempt + 1);
    } else {
      // Max retries exceeded
      const stream = activeStreams.get(streamId);
      if (stream) {
        stream.errors.push(`Retry failed after ${STREAM_CONFIG.RETRY_ATTEMPTS} attempts: ${error}`);
        stream.isComplete = true;
        stream.endTime = Date.now();
        stream.duration = stream.endTime - stream.startTime;
      }
      throw error;
    }
  }
}

/**
 * Clean up completed streams
 */
export function cleanupStreams(maxAge: number = 3600000): number {
  let cleaned = 0;
  const now = Date.now();
  const entriesToDelete: string[] = [];
  
  activeStreams.forEach((stream, streamId) => {
    const age = now - stream.startTime;
    
    // Remove completed streams older than maxAge
    if (stream.isComplete && age > maxAge) {
      entriesToDelete.push(streamId);
    }
  });
  
  entriesToDelete.forEach(streamId => {
    activeStreams.delete(streamId);
    cleaned++;
  });
  
  return cleaned;
}

/**
 * Get stream statistics
 */
export function getStreamStats(): {
  activeStreams: number;
  totalChunks: number;
  totalContent: number;
  averageChunkSize: number;
  averageStreamDuration: number;
} {
  let totalChunks = 0;
  let totalContent = 0;
  let totalDuration = 0;
  let completedStreams = 0;
  
  activeStreams.forEach((stream) => {
    totalChunks += stream.chunks.length;
    totalContent += stream.fullContent.length;
    
    if (stream.isComplete && stream.duration) {
      totalDuration += stream.duration;
      completedStreams++;
    }
  });
  
  return {
    activeStreams: activeStreams.size,
    totalChunks,
    totalContent,
    averageChunkSize: totalChunks > 0 ? totalContent / totalChunks : 0,
    averageStreamDuration: completedStreams > 0 ? totalDuration / completedStreams : 0,
  };
}

/**
 * Format a streamed response for display
 */
export function formatStreamedResponse(streamId: string): string {
  const stream = activeStreams.get(streamId);
  if (!stream) return '';
  
  let formatted = stream.fullContent;
  
  // Add metadata if incomplete
  if (!stream.isComplete) {
    formatted += '\n\n⏳ *Response still streaming...*';
  }
  
  // Add error info if present
  if (stream.errors.length > 0) {
    formatted += '\n\n⚠️ **Issues encountered:**\n';
    stream.errors.forEach(error => {
      formatted += `- ${error}\n`;
    });
  }
  
  return formatted;
}

/**
 * Export stream data for debugging
 */
export function exportStreamDebugInfo(streamId: string): any {
  const stream = activeStreams.get(streamId);
  if (!stream) return null;
  
  return {
    id: stream.id,
    totalChunks: stream.totalChunks,
    totalSize: stream.fullContent.length,
    isComplete: stream.isComplete,
    duration: stream.duration,
    errors: stream.errors,
    chunks: stream.chunks.map(c => ({
      sequence: c.sequence,
      size: c.size,
      timestamp: c.timestamp,
    })),
  };
}
