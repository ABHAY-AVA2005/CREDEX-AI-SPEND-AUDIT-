/**
 * lib/monitor.ts
 * Background Continuous Auditing & Leak Detection Engine.
 * Runs simulated daily cron hooks to spot newly introduced SaaS seat leaks,
 * duplicate accounts, or abandoned software licenses.
 */

import { buildDiscoveredStack, DiscoveredTool } from "./integrations";

export interface SaaSLeak {
  type: "DUPLICATE" | "ABANDONED" | "PRICE_SPIKE";
  toolName: string;
  message: string;
  potentialSavings: number;
}

/**
 * Daily Active Monitoring Scan:
 * Processes transactions and identity provisions, compares them against standard baselines,
 * and yields specific, high-fidelity capital leakage alerts.
 */
export async function scanForActiveLeaks(
  transactions: Array<{ merchantName: string; amount: number }>,
  directory: Array<{ userEmail: string; appName: string; lastActiveDaysAgo: number }>
): Promise<SaaSLeak[]> {
  const leaks: SaaSLeak[] = [];
  const discoveredTools = buildDiscoveredStack(transactions, directory);

  // Heuristic 1: Spot Duplicate Licenses (Devs with both Cursor & GitHub Copilot)
  const cursorUserEmails = directory
    .filter(u => u.appName === "Cursor" && u.lastActiveDaysAgo <= 15)
    .map(u => u.userEmail);

  const redundantCopilots = directory.filter(
    u => u.appName === "Github Copilot" && cursorUserEmails.includes(u.userEmail)
  );

  if (redundantCopilots.length > 0) {
    leaks.push({
      type: "DUPLICATE",
      toolName: "GitHub Copilot",
      message: `Detected ${redundantCopilots.length} engineers (e.g. ${redundantCopilots[0].userEmail}) allocated both Cursor and GitHub Copilot licenses. Cursor natively provides full Claude/GPT coding capabilities, making Copilot redundant.`,
      potentialSavings: redundantCopilots.length * 19.00, // $19/seat for Copilot Business
    });
  }

  // Heuristic 2: Inactive / Abandoned Licenses (Seats with 0 activity in 30+ days)
  const inactiveSeats = directory.filter(u => u.lastActiveDaysAgo >= 30);
  if (inactiveSeats.length > 0) {
    const toolsRegistryMap = new Map<string, number>();
    inactiveSeats.forEach(s => {
      toolsRegistryMap.set(s.appName, (toolsRegistryMap.get(s.appName) || 0) + 1);
    });

    toolsRegistryMap.forEach((count, toolName) => {
      leaks.push({
        type: "ABANDONED",
        toolName,
        message: `Found ${count} fully inactive/abandoned ${toolName} seats with zero sign-in or usage metrics in the last 30 days.`,
        potentialSavings: count * 20.00, // Estimate standard $20/mo seat
      });
    });
  }

  return leaks;
}

/**
 * Dispatches CFO Smart Alerts via email (Resend API interface) or Slack Webhooks.
 */
export async function sendCfoSmartAlert(
  cfoEmail: string,
  companyName: string,
  leaks: SaaSLeak[]
): Promise<{ success: boolean; dispatchedAlertsCount: number; bodySummary: string }> {
  if (leaks.length === 0) {
    return { success: true, dispatchedAlertsCount: 0, bodySummary: "AI stack is 100% efficient. No action required." };
  }

  const alertLines = leaks.map(
    l => `[${l.type}] ${l.toolName}: ${l.message} (Unlocks $${l.potentialSavings.toFixed(2)}/mo)`
  );
  
  const totalLeaked = leaks.reduce((sum, l) => sum + l.potentialSavings, 0);
  const emailBody = `
    FLUXORA ALERT: Active Capital Leakage Spotted at ${companyName}
    ----------------------------------------------------------------
    Our daily continuous audit engine has detected $${totalLeaked.toFixed(2)}/mo in newly active SaaS leakage.
    
    Alert Details:
    ${alertLines.join("\n\n    ")}
    
    Path Forward:
    Please log in to your Fluxora Dashboard or click below to auto-prune these redundant license allocations:
    https://fluxora.ai/dashboard/prune
  `;

  // In production: await resend.emails.send({ from: 'alerts@fluxora.ai', to: cfoEmail, subject: '...', body: emailBody })
  console.log(`[SmartAlert] Dispatched alert email to ${cfoEmail}:\n${emailBody}`);

  return {
    success: true,
    dispatchedAlertsCount: leaks.length,
    bodySummary: emailBody.trim(),
  };
}
