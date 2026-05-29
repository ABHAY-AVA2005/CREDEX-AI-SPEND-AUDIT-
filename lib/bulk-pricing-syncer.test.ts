import { expect, test, describe } from 'vitest';
import { syncAllRegistryPricing } from './bulk-pricing-syncer';

describe('Fluxora Bulk Pricing Syncer Tests', () => {

  test('Graceful fail on missing API key', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const res = await syncAllRegistryPricing();
    expect(res.success).toBe(false);
    expect(res.logs[0]).toContain('GEMINI_API_KEY is not configured');

    process.env.GEMINI_API_KEY = originalKey;
  });
});
