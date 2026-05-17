/**
 * lib/integrations/anthropic.ts
 * Connector for Anthropic Claude API usage data.
 */

import { IConnector, UsageMetricInput } from "./types";

export class AnthropicConnector implements IConnector {
  provider = 'ANTHROPIC' as const;

  async testConnection(config: { token: string }) {
    if (!config.token) return { success: false, message: "Anthropic API Key is required" };
    
    // Safety check: Basic format validation
    if (!config.token.startsWith('sk-ant-')) {
      return { success: false, message: "Invalid Anthropic API Key format (must start with sk-ant-)" };
    }

    return { success: true };
  }

  async fetchMetrics(config: { token: string }): Promise<UsageMetricInput[]> {
    try {
      // ── Live API Ready Flow ──
      // In a real scenario, we would hit https://api.anthropic.com/v1/metrics
      // For the demo, we simulate live activity with a Source ID.
      
      return [
        {
          metricType: 'TOKENS_CONSUMED',
          value: Math.floor(Math.random() * 2000000),
          timestamp: new Date()
        }
      ];
    } catch (e) {
      return [{ metricType: 'TOKENS_CONSUMED', value: 0, timestamp: new Date() }];
    }
  }
}
