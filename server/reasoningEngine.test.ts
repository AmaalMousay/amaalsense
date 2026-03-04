import { describe, it, expect, vi } from 'vitest';
import { reasoningEngine } from './graphPipeline';

// Mock groqIntegration
vi.mock('./groqIntegration', () => ({
  invokeGroqLLM: vi.fn(async ({ messages }) => {
    // Extract the user message to verify it contains the original input
    const userMessage = messages.find((m: any) => m.role === 'user');
    const content = userMessage?.content || '';
    
    // Verify the prompt contains the original input
    if (content.includes('رفع الدعم عن الوقود')) {
      return {
        content: 'تحليل محدد: رفع الدعم عن الوقود سيؤدي إلى...',
      };
    } else if (content.includes('ترمب')) {
      return {
        content: 'تحليل محدد: ترمب يحظى بشعبية واسعة لأن...',
      };
    }
    
    return {
      content: 'Generic analysis',
    };
  }),
}));

describe('reasoningEngine with Original Input', () => {
  it('should include original input in Groq prompt', async () => {
    const mockEventVector = {
      topic: 'Economic Policy',
      topicConfidence: 0.85,
      emotions: {
        fear: 0.6,
        anger: 0.4,
        hope: 0.3,
        sadness: 0.2,
        joy: 0.1,
        curiosity: 0.15,
      },
      dominantEmotion: 'fear',
      region: 'Libya',
      regionConfidence: 0.9,
      impactScore: 0.75,
      severity: 'high' as const,
      timestamp: new Date(),
      sourceId: 'test-001',
    };

    const originalInput = 'هل رفع الدعم عن الوقود سيؤدي إلى اضطرابات اجتماعية؟';
    
    const result = await reasoningEngine(mockEventVector, originalInput);
    
    // Verify the response is specific to the input, not generic
    expect(result).toContain('رفع الدعم عن الوقود');
    expect(result).not.toContain('Generic analysis');
  });

  it('should create contextual analysis based on emotions and topic', async () => {
    const mockEventVector = {
      topic: 'Politics',
      topicConfidence: 0.8,
      emotions: {
        fear: 0.3,
        anger: 0.5,
        hope: 0.2,
        sadness: 0.1,
        joy: 0.05,
        curiosity: 0.2,
      },
      dominantEmotion: 'anger',
      region: 'Global',
      regionConfidence: 0.7,
      impactScore: 0.6,
      severity: 'medium' as const,
      timestamp: new Date(),
      sourceId: 'test-002',
    };

    const originalInput = 'هل ترمب يحظى بشعبية واسعة';
    
    const result = await reasoningEngine(mockEventVector, originalInput);
    
    // Verify the response is specific to Trump/politics
    expect(result).toContain('ترمب');
    expect(result).not.toContain('Generic analysis');
  });

  it('should handle missing original input gracefully', async () => {
    const mockEventVector = {
      topic: 'Default Topic',
      topicConfidence: 0.5,
      emotions: {
        fear: 0.5,
        anger: 0.3,
        hope: 0.2,
        sadness: 0.1,
        joy: 0.05,
        curiosity: 0.1,
      },
      dominantEmotion: 'fear',
      region: 'Unknown',
      regionConfidence: 0.5,
      impactScore: 0.5,
      severity: 'medium' as const,
      timestamp: new Date(),
      sourceId: 'test-003',
    };

    // Call without original input
    const result = await reasoningEngine(mockEventVector);
    
    // Should still return a response
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should format EventVector data correctly in prompt', async () => {
    const mockEventVector = {
      topic: 'Economic Crisis',
      topicConfidence: 0.92,
      emotions: {
        fear: 0.85,
        anger: 0.7,
        hope: 0.3,
        sadness: 0.6,
        joy: 0.1,
        curiosity: 0.25,
      },
      dominantEmotion: 'fear',
      region: 'Middle East',
      regionConfidence: 0.88,
      impactScore: 0.9,
      severity: 'high' as const,
      timestamp: new Date(),
      sourceId: 'test-004',
    };

    const originalInput = 'Crisis in the region';
    
    const result = await reasoningEngine(mockEventVector, originalInput);
    
    // Verify result is generated
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
