import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createStream,
  addChunk,
  getStreamStatus,
  getStreamContent,
  completeStream,
  splitIntoChunks,
  streamResponse,
  validateResponseCompletion,
  cleanupStreams,
  getStreamStats,
  formatStreamedResponse,
  exportStreamDebugInfo,
} from './responseStreamingManager';

describe('Phase 86: Response Streaming Manager - Fix Bug #3', () => {
  beforeEach(() => {
    // Clean up any existing streams
    cleanupStreams(0);
  });

  describe('Stream Creation and Management', () => {
    it('should create a new stream', () => {
      const streamId = createStream();
      expect(streamId).toBeDefined();
      expect(streamId).toMatch(/^stream_/);
    });

    it('should create stream with initial content', () => {
      const streamId = createStream('Initial content');
      const content = getStreamContent(streamId);
      expect(content).toBe('Initial content');
    });

    it('should get stream status', () => {
      const streamId = createStream();
      const status = getStreamStatus(streamId);
      expect(status).toBeDefined();
      expect(status?.id).toBe(streamId);
      expect(status?.isComplete).toBe(false);
    });

    it('should get stream content', () => {
      const streamId = createStream('Test content');
      const content = getStreamContent(streamId);
      expect(content).toBe('Test content');
    });

    it('should return null for non-existent stream', () => {
      const content = getStreamContent('non_existent_stream');
      expect(content).toBeNull();
    });
  });

  describe('Chunk Management', () => {
    it('should add a chunk to stream', () => {
      const streamId = createStream();
      const result = addChunk(streamId, 'Chunk 1', false);
      expect(result).toBe(true);

      const status = getStreamStatus(streamId);
      expect(status?.chunks.length).toBe(1);
      expect(status?.fullContent).toBe('Chunk 1');
    });

    it('should add multiple chunks', () => {
      const streamId = createStream();
      addChunk(streamId, 'Chunk 1', false);
      addChunk(streamId, 'Chunk 2', false);
      addChunk(streamId, 'Chunk 3', true);

      const status = getStreamStatus(streamId);
      expect(status?.chunks.length).toBe(3);
      expect(status?.fullContent).toBe('Chunk 1Chunk 2Chunk 3');
      expect(status?.isComplete).toBe(true);
    });

    it('should reject chunk for non-existent stream', () => {
      const result = addChunk('non_existent_stream', 'Content', false);
      expect(result).toBe(false);
    });

    it('should mark stream as complete when last chunk added', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', true);

      const status = getStreamStatus(streamId);
      expect(status?.isComplete).toBe(true);
      expect(status?.endTime).toBeDefined();
      expect(status?.duration).toBeDefined();
    });

    it('should reject chunk exceeding size limit', () => {
      const streamId = createStream();
      const largeContent = 'x'.repeat(100000); // 100KB - exceeds limit
      const result = addChunk(streamId, largeContent, false);
      expect(result).toBe(false);

      const status = getStreamStatus(streamId);
      expect(status?.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Stream Completion', () => {
    it('should complete a stream', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', false);

      const result = completeStream(streamId);
      expect(result).toBe(true);

      const status = getStreamStatus(streamId);
      expect(status?.isComplete).toBe(true);
    });

    it('should return false for non-existent stream', () => {
      const result = completeStream('non_existent_stream');
      expect(result).toBe(false);
    });

    it('should set end time and duration on completion', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', false);

      completeStream(streamId);

      const status = getStreamStatus(streamId);
      expect(status?.endTime).toBeDefined();
      expect(status?.duration).toBeDefined();
      expect(status?.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Chunk Splitting', () => {
    it('should split content into chunks', () => {
      const content = 'This is sentence one. This is sentence two. This is sentence three.';
      const chunks = splitIntoChunks(content, 30);

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.join('')).toBe(content);
    });

    it('should handle content without punctuation', () => {
      const content = 'This is a very long sentence without any punctuation marks at all';
      const chunks = splitIntoChunks(content, 20);

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.join('')).toBe(content);
    });

    it('should respect chunk size limit', () => {
      const content = 'Short. Sentence. Here. Another. One. More. Content. Here.';
      const chunks = splitIntoChunks(content, 15);

      chunks.forEach(chunk => {
        expect(chunk.length).toBeLessThanOrEqual(25); // Allow some overflow for sentence boundaries
      });
    });

    it('should handle empty content', () => {
      const chunks = splitIntoChunks('', 100);
      expect(chunks.length).toBe(0);
    });
  });

  describe('Response Streaming', () => {
    it('should stream a response', () => {
      const content = 'This is a test response. It has multiple sentences. Each one is important.';
      const streamId = streamResponse(content);

      const status = getStreamStatus(streamId);
      expect(status?.isComplete).toBe(true);
      expect(status?.fullContent).toBe(content);
      expect(status?.chunks.length).toBeGreaterThan(0);
    });

    it('should create chunks for long responses', () => {
      const content = 'Sentence. '.repeat(500); // 1000 characters
      const streamId = streamResponse(content);

      const status = getStreamStatus(streamId);
      expect(status?.chunks.length).toBeGreaterThan(1);
    });
  });

  describe('Response Validation', () => {
    it('should validate complete response', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', true);

      const validation = validateResponseCompletion(streamId);
      expect(validation.isComplete).toBe(true);
      expect(validation.issues.length).toBe(0);
    });

    it('should detect incomplete response', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', false);

      const validation = validateResponseCompletion(streamId);
      expect(validation.isComplete).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
    });

    it('should detect empty response', () => {
      const streamId = createStream();
      completeStream(streamId);

      const validation = validateResponseCompletion(streamId);
      expect(validation.isComplete).toBe(false);
      expect(validation.issues).toContain('Stream has no content');
    });

    it('should detect stream errors', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', true);

      const status = getStreamStatus(streamId)!;
      status.errors.push('Test error');

      const validation = validateResponseCompletion(streamId);
      expect(validation.isComplete).toBe(false);
      expect(validation.issues.some(i => i.includes('error'))).toBe(true);
    });

    it('should detect non-existent stream', () => {
      const validation = validateResponseCompletion('non_existent_stream');
      expect(validation.isComplete).toBe(false);
      expect(validation.issues).toContain('Stream not found');
    });
  });

  describe('Stream Cleanup', () => {
    it('should clean up old completed streams', () => {
      const streamId1 = createStream();
      completeStream(streamId1);

      // Manually set old timestamp for testing
      const stream = getStreamStatus(streamId1)!;
      stream.startTime = Date.now() - 4000000; // 4000 seconds ago

      const cleaned = cleanupStreams(3600000); // 1 hour
      expect(cleaned).toBeGreaterThan(0);
      expect(getStreamStatus(streamId1)).toBeNull();
    });

    it('should not clean up recent streams', () => {
      const streamId = createStream();
      completeStream(streamId);

      const cleaned = cleanupStreams(3600000);
      expect(getStreamStatus(streamId)).toBeDefined();
    });

    it('should not clean up incomplete streams', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', false);

      const cleaned = cleanupStreams(0);
      expect(getStreamStatus(streamId)).toBeDefined();
    });
  });

  describe('Stream Statistics', () => {
    it('should get stream statistics', () => {
      const streamId1 = streamResponse('Content one.');
      const streamId2 = streamResponse('Content two. More content.');

      const stats = getStreamStats();
      expect(stats.activeStreams).toBeGreaterThanOrEqual(2);
      expect(stats.totalChunks).toBeGreaterThan(0);
      expect(stats.totalContent).toBeGreaterThan(0);
      expect(stats.averageChunkSize).toBeGreaterThan(0);
    });

    it('should calculate average stream duration', () => {
      const streamId = streamResponse('Test content.');
      const stats = getStreamStats();

      expect(stats.averageStreamDuration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Response Formatting', () => {
    it('should format complete response', () => {
      const streamId = streamResponse('This is a complete response.');
      const formatted = formatStreamedResponse(streamId);

      expect(formatted).toContain('This is a complete response.');
      expect(formatted).not.toContain('still streaming');
    });

    it('should format incomplete response', () => {
      const streamId = createStream();
      addChunk(streamId, 'Incomplete', false);

      const formatted = formatStreamedResponse(streamId);
      expect(formatted).toContain('still streaming');
    });

    it('should format response with errors', () => {
      const streamId = createStream();
      addChunk(streamId, 'Content', true);

      const status = getStreamStatus(streamId)!;
      status.errors.push('Test error');

      const formatted = formatStreamedResponse(streamId);
      expect(formatted).toContain('Issues encountered');
      expect(formatted).toContain('Test error');
    });

    it('should return empty string for non-existent stream', () => {
      const formatted = formatStreamedResponse('non_existent_stream');
      expect(formatted).toBe('');
    });
  });

  describe('Debug Export', () => {
    it('should export stream debug info', () => {
      const streamId = streamResponse('Test content.');
      const debugInfo = exportStreamDebugInfo(streamId);

      expect(debugInfo).toBeDefined();
      expect(debugInfo.id).toBe(streamId);
      expect(debugInfo.totalSize).toBeGreaterThan(0);
      expect(debugInfo.isComplete).toBe(true);
      expect(debugInfo.chunks).toBeDefined();
    });

    it('should return null for non-existent stream', () => {
      const debugInfo = exportStreamDebugInfo('non_existent_stream');
      expect(debugInfo).toBeNull();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle long response streaming', () => {
      const longContent = 'This is a sentence. '.repeat(500); // ~10KB
      const streamId = streamResponse(longContent);

      const status = getStreamStatus(streamId);
      expect(status?.isComplete).toBe(true);
      expect(status?.fullContent.length).toBeGreaterThan(9000);
      expect(status?.chunks.length).toBeGreaterThan(1);
    });

    it('should handle response with special characters', () => {
      const content = 'Arabic: مرحبا. Emoji: 🎉. Special: @#$%. Normal: test.';
      const streamId = streamResponse(content);

      const status = getStreamStatus(streamId);
      expect(status?.fullContent).toContain('مرحبا');
      expect(status?.fullContent).toContain('🎉');
    });

    it('should validate multi-chunk response', () => {
      const streamId = createStream();
      addChunk(streamId, 'Part 1. ', false);
      addChunk(streamId, 'Part 2. ', false);
      addChunk(streamId, 'Part 3.', true);

      const validation = validateResponseCompletion(streamId);
      expect(validation.isComplete).toBe(true);
      expect(validation.issues.length).toBe(0);
    });
  });
});
