/**
 * Phase 67 Tests: Streaming Responses
 * 
 * Tests to verify that:
 * 1. API returns chunks in correct order
 * 2. Chunks contain expected data
 * 3. Streaming helper works correctly
 */

import { describe, it, expect } from 'vitest';
import { StreamingResponse, type StreamChunk } from './_core/streamingHelper';

describe('Phase 67: Streaming Responses', () => {
  
  describe('1. StreamingResponse Class', () => {
    
    it('should create empty response', () => {
      const stream = new StreamingResponse();
      expect(stream.getChunks()).toEqual([]);
      expect(stream.isCompleted()).toBe(false);
    });

    it('should add thinking chunk', () => {
      const stream = new StreamingResponse();
      stream.addThinking('جاري التفكير...');
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(1);
      expect(chunks[0].type).toBe('thinking');
      expect(chunks[0].content).toBe('جاري التفكير...');
    });

    it('should add analysis chunk', () => {
      const stream = new StreamingResponse();
      stream.addAnalysis('النتيجة...');
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(1);
      expect(chunks[0].type).toBe('analysis');
      expect(chunks[0].content).toBe('النتيجة...');
    });

    it('should add emotion chunk', () => {
      const stream = new StreamingResponse();
      const emotion = { fear: 30, hope: 50 };
      stream.addEmotion(emotion);
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(1);
      expect(chunks[0].type).toBe('emotion');
      expect(chunks[0].data).toEqual(emotion);
    });

    it('should add metadata chunk', () => {
      const stream = new StreamingResponse();
      const metadata = { pathway: 'analytical' };
      stream.addMetadata(metadata);
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(1);
      expect(chunks[0].type).toBe('metadata');
      expect(chunks[0].data).toEqual(metadata);
    });

    it('should complete response', () => {
      const stream = new StreamingResponse();
      const result = { success: true };
      stream.complete(result);
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(1);
      expect(chunks[0].type).toBe('complete');
      expect(chunks[0].data).toEqual(result);
      expect(stream.isCompleted()).toBe(true);
    });

    it('should add error chunk', () => {
      const stream = new StreamingResponse();
      stream.addError('خطأ في التحليل');
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(1);
      expect(chunks[0].type).toBe('error');
      expect(chunks[0].message).toBe('خطأ في التحليل');
    });
  });

  describe('2. Chunk Order', () => {
    
    it('should maintain chunk order', () => {
      const stream = new StreamingResponse();
      stream.addThinking('thinking');
      stream.addAnalysis('analysis');
      stream.addEmotion({ fear: 30 });
      stream.addMetadata({ pathway: 'test' });
      stream.complete({ success: true });
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(5);
      expect(chunks[0].type).toBe('thinking');
      expect(chunks[1].type).toBe('analysis');
      expect(chunks[2].type).toBe('emotion');
      expect(chunks[3].type).toBe('metadata');
      expect(chunks[4].type).toBe('complete');
    });
  });

  describe('3. JSON Serialization', () => {
    
    it('should convert chunks to JSON lines', () => {
      const stream = new StreamingResponse();
      stream.addThinking('test');
      stream.addAnalysis('result');
      
      const jsonLines = stream.toJSONLines();
      const lines = jsonLines.split('\n');
      
      expect(lines).toHaveLength(2);
      expect(JSON.parse(lines[0]).type).toBe('thinking');
      expect(JSON.parse(lines[1]).type).toBe('analysis');
    });
  });

  describe('4. Multiple Chunks', () => {
    
    it('should handle multiple chunks of same type', () => {
      const stream = new StreamingResponse();
      stream.addThinking('first');
      stream.addThinking('second');
      stream.addThinking('third');
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(3);
      expect(chunks.every(c => c.type === 'thinking')).toBe(true);
    });

    it('should handle mixed chunk types', () => {
      const stream = new StreamingResponse();
      stream.addThinking('thinking');
      stream.addError('error1');
      stream.addAnalysis('analysis');
      stream.addError('error2');
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(4);
      expect(chunks.filter(c => c.type === 'error')).toHaveLength(2);
    });
  });

  describe('5. Empty Chunks', () => {
    
    it('should handle empty content', () => {
      const stream = new StreamingResponse();
      stream.addThinking('');
      stream.addAnalysis('');
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(2);
      expect(chunks[0].content).toBe('');
      expect(chunks[1].content).toBe('');
    });

    it('should handle null data', () => {
      const stream = new StreamingResponse();
      stream.addEmotion(null);
      stream.addMetadata(null);
      
      const chunks = stream.getChunks();
      expect(chunks).toHaveLength(2);
      expect(chunks[0].data).toBe(null);
      expect(chunks[1].data).toBe(null);
    });
  });
});
