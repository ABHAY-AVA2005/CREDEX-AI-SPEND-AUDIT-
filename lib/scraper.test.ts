import { expect, test, describe } from 'vitest';
import { scrapeAndSyncToolPricing } from './scraper';

describe('Fluxora AI-Powered Pricing Scraper Tests', () => {

  test('Fails gracefully when API key is missing or down', async () => {
    // Temporarily backup API key to simulate unconfigured environment
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const res = await scrapeAndSyncToolPricing('Cursor', 'https://www.cursor.com/pricing');
    expect(res.success).toBe(false);
    expect(res.log).toContain('GEMINI_API_KEY not configured');

    // Restore key
    process.env.GEMINI_API_KEY = originalKey;
  });

  test('Rejects invalid URLs during ingestion', async () => {
    const res = await scrapeAndSyncToolPricing('InvalidTool', 'https://invalid-non-existent-url.local/pricing');
    expect(res.success).toBe(false);
    expect(res.log).toContain('Failed to scrape');
  });
});
