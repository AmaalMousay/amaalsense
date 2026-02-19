import { invokeLLM } from './server/_core/llm';
import { storagePut, storageGet } from './storage';

/**
 * Multi-modal Analysis System
 * Analyzes images, videos, and other media for emotional content
 */

export interface MediaAnalysisResult {
  mediaType: 'image' | 'video' | 'audio';
  emotions: Array<{
    emotion: string;
    confidence: number;
    description: string;
  }>;
  sentiment: number;
  keyElements: string[];
  culturalContext: string;
  confidence: number;
}

/**
 * Analyze image for emotional content
 */
export async function analyzeImage(imageUrl: string): Promise<MediaAnalysisResult> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in analyzing emotions and sentiments in images. Analyze the image and identify emotions, sentiment, and cultural context.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image for emotional content, sentiment, and cultural context. Return a JSON response with emotions array, sentiment score (0-100), key elements, and cultural context.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'image_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              emotions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    emotion: { type: 'string' },
                    confidence: { type: 'number' },
                    description: { type: 'string' },
                  },
                  required: ['emotion', 'confidence', 'description'],
                },
              },
              sentiment: { type: 'number' },
              keyElements: { type: 'array', items: { type: 'string' } },
              culturalContext: { type: 'string' },
              confidence: { type: 'number' },
            },
            required: ['emotions', 'sentiment', 'keyElements', 'culturalContext', 'confidence'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;

    return {
      mediaType: 'image',
      emotions: parsed.emotions,
      sentiment: parsed.sentiment,
      keyElements: parsed.keyElements,
      culturalContext: parsed.culturalContext,
      confidence: parsed.confidence,
    };
  } catch (error) {
    console.error('Image analysis failed:', error);
    throw error;
  }
}

/**
 * Analyze video for emotional content
 */
export async function analyzeVideo(videoUrl: string, sampleFrames: number = 5): Promise<MediaAnalysisResult> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in analyzing emotions and sentiments in videos. Analyze the video frames and identify emotions, sentiment, and cultural context.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this video for emotional content, sentiment, and cultural context. Focus on ${sampleFrames} key frames. Return a JSON response with emotions array, sentiment score (0-100), key elements, and cultural context.`,
            },
            {
              type: 'file_url',
              file_url: {
                url: videoUrl,
                mime_type: 'video/mp4',
              },
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'video_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              emotions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    emotion: { type: 'string' },
                    confidence: { type: 'number' },
                    description: { type: 'string' },
                  },
                  required: ['emotion', 'confidence', 'description'],
                },
              },
              sentiment: { type: 'number' },
              keyElements: { type: 'array', items: { type: 'string' } },
              culturalContext: { type: 'string' },
              confidence: { type: 'number' },
            },
            required: ['emotions', 'sentiment', 'keyElements', 'culturalContext', 'confidence'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;

    return {
      mediaType: 'video',
      emotions: parsed.emotions,
      sentiment: parsed.sentiment,
      keyElements: parsed.keyElements,
      culturalContext: parsed.culturalContext,
      confidence: parsed.confidence,
    };
  } catch (error) {
    console.error('Video analysis failed:', error);
    throw error;
  }
}

/**
 * Analyze audio/speech for emotional content
 */
export async function analyzeAudio(audioUrl: string): Promise<MediaAnalysisResult> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in analyzing emotions and sentiments in audio/speech. Analyze the audio and identify emotions, sentiment, tone, and cultural context.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this audio for emotional content, sentiment, tone, and cultural context. Return a JSON response with emotions array, sentiment score (0-100), key elements, and cultural context.',
            },
            {
              type: 'file_url',
              file_url: {
                url: audioUrl,
                mime_type: 'audio/mpeg',
              },
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'audio_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              emotions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    emotion: { type: 'string' },
                    confidence: { type: 'number' },
                    description: { type: 'string' },
                  },
                  required: ['emotion', 'confidence', 'description'],
                },
              },
              sentiment: { type: 'number' },
              keyElements: { type: 'array', items: { type: 'string' } },
              culturalContext: { type: 'string' },
              confidence: { type: 'number' },
            },
            required: ['emotions', 'sentiment', 'keyElements', 'culturalContext', 'confidence'],
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;

    return {
      mediaType: 'audio',
      emotions: parsed.emotions,
      sentiment: parsed.sentiment,
      keyElements: parsed.keyElements,
      culturalContext: parsed.culturalContext,
      confidence: parsed.confidence,
    };
  } catch (error) {
    console.error('Audio analysis failed:', error);
    throw error;
  }
}

/**
 * Aggregate emotional analysis from multiple media sources
 */
export async function aggregateMediaAnalysis(
  mediaUrls: Array<{ url: string; type: 'image' | 'video' | 'audio' }>
): Promise<{
  overallSentiment: number;
  dominantEmotions: Array<{ emotion: string; frequency: number }>;
  culturalInsights: string[];
  confidence: number;
}> {
  try {
    const analyses = await Promise.all(
      mediaUrls.map(async (media) => {
        switch (media.type) {
          case 'image':
            return analyzeImage(media.url);
          case 'video':
            return analyzeVideo(media.url);
          case 'audio':
            return analyzeAudio(media.url);
        }
      })
    );

    // Aggregate results
    const sentiments = analyses.map(a => a.sentiment);
    const overallSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

    // Count emotions
    const emotionCounts: Record<string, number> = {};
    analyses.forEach(analysis => {
      analysis.emotions.forEach(e => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      });
    });

    const dominantEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, frequency]) => ({ emotion, frequency }));

    const culturalInsights = [...new Set(analyses.map(a => a.culturalContext))];

    const avgConfidence = analyses.reduce((a, b) => a + b.confidence, 0) / analyses.length;

    return {
      overallSentiment: Math.round(overallSentiment),
      dominantEmotions,
      culturalInsights,
      confidence: Math.round(avgConfidence * 100) / 100,
    };
  } catch (error) {
    console.error('Media aggregation failed:', error);
    throw error;
  }
}

/**
 * Initialize multi-modal analysis
 */
export function initializeMultiModalAnalysis() {
  console.log('✅ Multi-modal Analysis system initialized');
  console.log('- Image analysis enabled');
  console.log('- Video analysis enabled');
  console.log('- Audio analysis enabled');
  console.log('- Multi-source aggregation enabled');
}
