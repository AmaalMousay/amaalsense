/**
 * Groq API Service Tests
 * Tests the Groq Cloud API connection with Qwen model
 */

import { describe, it, expect } from 'vitest';
import { isGroqConfigured, testGroqConnection } from './groqService';

describe('Groq Service', () => {
  it('should have GROQ_API_KEY configured', () => {
    // Check if the API key is set
    const configured = isGroqConfigured();
    expect(configured).toBe(true);
  });

  it('should connect to Groq API successfully', async () => {
    // Skip if not configured
    if (!isGroqConfigured()) {
      console.log('Skipping Groq API test - not configured');
      return;
    }

    const result = await testGroqConnection();
    
    console.log('Groq API Test Result:', result);
    
    expect(result.success).toBe(true);
    expect(result.message).toBeTruthy();
    expect(result.model).toBeTruthy();
  }, 30000); // 30 second timeout for API call
});
