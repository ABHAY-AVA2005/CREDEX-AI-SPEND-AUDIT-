import { expect, test, describe } from 'vitest';
import { scanForActiveLeaks, sendCfoSmartAlert } from './monitor';

describe('Fluxora Continuous Auditing Scan Tests', () => {

  test('Daily scan spots duplicate developer licenses', async () => {
    const rawTx = [
      { merchantName: "Github Copilot Business", amount: 38.00 }, // 2 seats
      { merchantName: "Cursor Pro", amount: 40.00 } // 2 seats
    ];

    const rawDirectory = [
      { userEmail: "coder1@company.com", appName: "Cursor", lastActiveDaysAgo: 2 },
      { userEmail: "coder1@company.com", appName: "Github Copilot", lastActiveDaysAgo: 1 }, // DUPLICATE!
      { userEmail: "coder2@company.com", appName: "Cursor", lastActiveDaysAgo: 4 },
      { userEmail: "coder2@company.com", appName: "Github Copilot", lastActiveDaysAgo: 2 } // DUPLICATE!
    ];

    const leaks = await scanForActiveLeaks(rawTx, rawDirectory);
    
    const duplicateAlert = leaks.find(l => l.type === 'DUPLICATE');
    expect(duplicateAlert).toBeDefined();
    expect(duplicateAlert?.potentialSavings).toBe(38.00); // 2 seats * $19
    expect(duplicateAlert?.message).toContain('allocated both Cursor and GitHub Copilot');
  });

  test('Daily scan spots abandoned seats', async () => {
    const rawTx = [
      { merchantName: "ChatGPT Plus", amount: 40.00 }
    ];

    const rawDirectory = [
      { userEmail: "user1@company.com", appName: "ChatGPT", lastActiveDaysAgo: 45 } // ABANDONED!
    ];

    const leaks = await scanForActiveLeaks(rawTx, rawDirectory);
    
    const abandonedAlert = leaks.find(l => l.type === 'ABANDONED');
    expect(abandonedAlert).toBeDefined();
    expect(abandonedAlert?.potentialSavings).toBe(20.00);
  });

  test('Generate fully grounded smart alert emails', async () => {
    const mockLeaks = [
      {
        type: "DUPLICATE" as const,
        toolName: "GitHub Copilot",
        message: "Duplicate Cursor seat discovered.",
        potentialSavings: 38.00
      }
    ];

    const emailResponse = await sendCfoSmartAlert('cfo@startup.com', 'Lean Systems', mockLeaks);
    expect(emailResponse.success).toBe(true);
    expect(emailResponse.dispatchedAlertsCount).toBe(1);
    expect(emailResponse.bodySummary).toContain('DUPLICATE');
    expect(emailResponse.bodySummary).toContain('Lean Systems');
  });
});
