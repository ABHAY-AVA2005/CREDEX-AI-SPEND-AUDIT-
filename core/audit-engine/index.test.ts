import { expect, test, describe } from 'vitest';
import { runAuditEngine } from './index';

describe('Audit Engine', () => {
  test('Rule 1: Replaces Jasper/Copy.ai with Claude Pro', () => {
    const input = {
      companyName: 'Test',
      companySize: '1-10' as const,
      industry: 'Tech',
      tools: [{
        toolName: 'Jasper',
        currentPlan: 'Pro',
        seats: 2,
        monthlySpend: 100,
        useCases: ['writing']
      }]
    };
    const result = runAuditEngine(input);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].action).toBe('REPLACE');
    expect(result.recommendations[0].suggestedTool).toBe('Claude');
    expect(result.recommendations[0].savings).toBe(60); // 100 - (20 * 2)
  });

  test('Rule 2: Replaces Copilot with Cursor for coding', () => {
    const input = {
      companyName: 'Test',
      companySize: '1-10' as const,
      industry: 'Tech',
      tools: [{
        toolName: 'GitHub Copilot',
        currentPlan: 'Business',
        seats: 5,
        monthlySpend: 95,
        useCases: ['coding']
      }]
    };
    const result = runAuditEngine(input);
    expect(result.recommendations[0].action).toBe('REPLACE');
    expect(result.recommendations[0].suggestedTool).toBe('Cursor');
  });

  test('Rule 2: Consolidates secondary coding tools (ChatGPT coding) when Cursor is recommended', () => {
    const input = {
      companyName: 'Test',
      companySize: '1-10' as const,
      industry: 'Tech',
      tools: [
        {
          toolName: 'GitHub Copilot',
          currentPlan: 'Business',
          seats: 5,
          monthlySpend: 95,
          useCases: ['coding']
        },
        {
          toolName: 'ChatGPT',
          currentPlan: 'Plus',
          seats: 5,
          monthlySpend: 100,
          useCases: ['coding']
        }
      ]
    };
    const result = runAuditEngine(input);
    expect(result.recommendations[0].action).toBe('REPLACE');
    expect(result.recommendations[1].action).toBe('CONSOLIDATE');
    expect(result.recommendations[1].newCost).toBe(0);
  });

  test('Rule 3: Recommends API gateway for >=10 seats on consumer plans', () => {
    const input = {
      companyName: 'Test',
      companySize: '10-50' as const,
      industry: 'Tech',
      tools: [{
        toolName: 'ChatGPT',
        currentPlan: 'Plus',
        seats: 20,
        monthlySpend: 400,
        useCases: ['mixed']
      }]
    };
    const result = runAuditEngine(input);
    expect(result.recommendations[0].action).toBe('REPLACE');
    expect(result.recommendations[0].suggestedPlan).toContain('Team / API');
    expect(result.recommendations[0].newCost).toBeLessThan(400); // Should be ~60% savings
  });

  test('Keeps tools that do not match rules and calculates totals correctly', () => {
    const input = {
      companyName: 'Test',
      companySize: '1-10' as const,
      industry: 'Tech',
      tools: [{
        toolName: 'Midjourney',
        currentPlan: 'Standard',
        seats: 1,
        monthlySpend: 30,
        useCases: ['design']
      }]
    };
    const result = runAuditEngine(input);
    expect(result.recommendations[0].action).toBe('KEEP');
    expect(result.totalCurrentSpend).toBe(30);
    expect(result.totalOptimizedSpend).toBe(30);
    expect(result.monthlySavings).toBe(0);
  });
});
