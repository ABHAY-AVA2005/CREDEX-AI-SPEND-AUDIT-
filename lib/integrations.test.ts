import { expect, test, describe } from 'vitest';
import {
  discoverPlaidTransactions,
  discoverIdentityProvisioning,
  buildDiscoveredStack
} from './integrations';

describe('Fluxora Ingestion Discovery Pipeline', () => {

  test('Sync Plaid ledger discoveries and map transactions', async () => {
    const transactions = await discoverPlaidTransactions('access-token-sandbox');
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].merchantName).toContain('Github');
    expect(transactions[0].amount).toBe(190.00);
  });

  test('Reject invalid tokens gracefully in Plaid & Okta sync', async () => {
    await expect(discoverPlaidTransactions('mock-error'))
      .rejects.toThrow('Plaid OAuth connection failed');

    await expect(discoverIdentityProvisioning('mock-error'))
      .rejects.toThrow('Google Workspace OAuth directory access revoked');
  });

  test('Assemble transactions and directory logs into clean, deduplicated input stack', () => {
    const rawTx = [
      { merchantName: "Github Inc", amount: 190.00 },
      { merchantName: "Anthropic Claude API", amount: 200.00 },
      { merchantName: "Cursor.sh Pro Plan", amount: 60.00 },
    ];

    const rawDirectory = [
      { userEmail: "dev1@company.com", appName: "Cursor", lastActiveDaysAgo: 1 },
      { userEmail: "dev2@company.com", appName: "Cursor", lastActiveDaysAgo: 4 },
      { userEmail: "dev3@company.com", appName: "Cursor", lastActiveDaysAgo: 2 },
      { userEmail: "dev1@company.com", appName: "Github Copilot", lastActiveDaysAgo: 2 },
    ];

    const discoveredStack = buildDiscoveredStack(rawTx, rawDirectory);

    // Assert tools are parsed and mapped correctly
    const cursor = discoveredStack.find(t => t.toolName === 'Cursor');
    const copilot = discoveredStack.find(t => t.toolName === 'GitHub Copilot');
    const claude = discoveredStack.find(t => t.toolName === 'Claude');

    expect(cursor).toBeDefined();
    expect(cursor?.seats).toBe(3); // 3 users synced in directory
    expect(cursor?.monthlySpend).toBe(60.00);

    expect(copilot).toBeDefined();
    expect(copilot?.seats).toBe(1); // dev1 synced in directory
    expect(copilot?.monthlySpend).toBe(190.00);

    expect(claude).toBeDefined();
    expect(claude?.type).toBe('API'); // API provider mapping
    expect(claude?.monthlySpend).toBe(200.00);
  });
});
