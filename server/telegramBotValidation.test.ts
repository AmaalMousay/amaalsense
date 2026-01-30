/**
 * Telegram Bot Token Validation Test
 * Validates that the TELEGRAM_BOT_TOKEN is correctly configured
 */

import { describe, it, expect } from 'vitest';

describe('Telegram Bot Token Validation', () => {
  it('should successfully connect to Telegram Bot API', async () => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    // Check if token is configured
    expect(botToken).toBeDefined();
    expect(botToken).not.toBe('');
    expect(botToken!.length).toBeGreaterThan(30);
    
    // Test the token by calling getMe endpoint
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();
    
    console.log('Telegram Bot API response:', data);
    
    // Verify successful response
    expect(data.ok).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.is_bot).toBe(true);
    
    console.log(`✅ Bot connected successfully!`);
    console.log(`   Bot Name: ${data.result.first_name}`);
    console.log(`   Bot Username: @${data.result.username}`);
  }, 15000);

  it('should be able to get bot updates', async () => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.log('Skipping: No TELEGRAM_BOT_TOKEN configured');
      return;
    }
    
    // Test getUpdates endpoint (lightweight check)
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=1`);
    const data = await response.json();
    
    console.log('Bot updates check:', data.ok ? 'Success' : 'Failed');
    
    expect(data.ok).toBe(true);
  }, 10000);
});
