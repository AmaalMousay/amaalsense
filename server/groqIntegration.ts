/**
 * Groq LLM Integration
 * 
 * Provides fast, efficient LLM inference using Groq API
 * Optimized for real-time reasoning and analysis
 */

import { z } from 'zod';

// Message schema for Groq API
const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

// Response schema from Groq
const GroqResponseSchema = z.object({
  content: z.string().optional(),
  text: z.string().optional(),
  finish_reason: z.string().optional(),
});

export type GroqResponse = z.infer<typeof GroqResponseSchema>;

/**
 * Invoke Groq LLM for reasoning
 * Uses the GROQ_API_KEY environment variable
 */
export async function invokeGroqLLM(input: {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}): Promise<GroqResponse> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable not set');
    }

    const model = input.model || 'llama-3.1-70b-versatile';
    const temperature = input.temperature ?? 0.7;
    const maxTokens = input.maxTokens ?? 1024;

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: input.messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Extract content from response
    const content = data.choices?.[0]?.message?.content || '';

    return {
      content,
      text: content,
      finish_reason: data.choices?.[0]?.finish_reason,
    };
  } catch (error) {
    console.error('Groq LLM Error:', error);
    throw error;
  }
}

/**
 * Streaming version of Groq LLM
 * For real-time response generation
 */
export async function invokeGroqLLMStreaming(
  input: {
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
    model?: string;
  },
  onChunk: (chunk: string) => void
): Promise<string> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable not set');
    }

    const model = input.model || 'llama-3.1-70b-versatile';
    const temperature = input.temperature ?? 0.7;
    const maxTokens = input.maxTokens ?? 1024;

    // Call Groq API with streaming
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: input.messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API Error: ${JSON.stringify(errorData)}`);
    }

    let fullContent = '';

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              onChunk(content);
            }
          } catch (e) {
            // Skip parsing errors
          }
        }
      }
    }

    return fullContent;
  } catch (error) {
    console.error('Groq LLM Streaming Error:', error);
    throw error;
  }
}

/**
 * Batch processing with Groq
 * Process multiple messages efficiently
 */
export async function invokeGroqLLMBatch(
  inputs: Array<{
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }>
): Promise<GroqResponse[]> {
  try {
    const results = await Promise.all(
      inputs.map(input =>
        invokeGroqLLM({
          ...input,
          model: 'llama-3.1-70b-versatile',
        })
      )
    );
    return results;
  } catch (error) {
    console.error('Groq LLM Batch Error:', error);
    throw error;
  }
}

/**
 * Structured output from Groq
 * For JSON-formatted responses
 */
export async function invokeGroqLLMStructured<T>(
  input: {
    messages: Message[];
    schema: z.ZodSchema<T>;
    temperature?: number;
  }
): Promise<T> {
  try {
    const response = await invokeGroqLLM({
      messages: [
        ...input.messages,
        {
          role: 'system',
          content: 'You must respond with valid JSON that matches the schema provided.',
        },
      ],
      temperature: input.temperature ?? 0.3,
    });

    const content = response.content || response.text || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return input.schema.parse(parsed);
  } catch (error) {
    console.error('Groq LLM Structured Error:', error);
    throw error;
  }
}
