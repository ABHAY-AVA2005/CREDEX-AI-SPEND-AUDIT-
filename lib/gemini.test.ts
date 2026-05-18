import { expect, test, describe } from 'vitest';
import { generateAuditSummaryV2 } from './gemini-v2';
import { AuditResult } from '@/schemas/audit';
import { AuditResultV2 } from '@/schemas/audit-v2';

// Helper to count sentences in a string
function countSentences(text: string): number {
  if (!text) return 0;
  // Clean up decimals so that periods in numbers (like $10.5k or 3.5%) don't get miscounted as sentences
  const cleanedText = text
    .replace(/\b\d+\.\d+\b/g, '') // remove floats like 3.5
    .replace(/\b\d+\.\d+%/g, '')  // remove percentages like 4.5%
    .replace(/\b[A-Za-z]\.[A-Za-z]\b/g, '') // remove abbreviations like B.B.
    .replace(/\b[A-Z]\b\./g, ''); // remove single letter dots

  const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.length;
}

// Helper to extract numbers from a text string
function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+[\d,.]*/g) || [];
  return matches
    .map(num => parseFloat(num.replace(/,/g, '')))
    .filter(val => !isNaN(val));
}

describe('Fluxora CFO-Grade Gemini Memo Tests', () => {

  test('Simulate Empty Revenue Contexts', async () => {
    const mockResult: AuditResult = {
      totalCurrentSpend: 1500,
      totalOptimizedSpend: 900,
      monthlySavings: 600,
      annualSavings: 7200,
      redundancyWarnings: ['Copilot and Cursor overlap'],
      benchmarkComparison: {
        percentile: 45,
        averageForStage: 120,
        status: 'OVERSPENDING'
      },
      recommendations: [
        {
          originalTool: 'GitHub Copilot',
          originalPlan: 'Business',
          originalSeats: 10,
          originalMonthlyCost: 190,
          action: 'REPLACE',
          suggestedTool: 'Cursor',
          suggestedPlan: 'Pro',
          savings: 90,
          newCost: 100,
          reasoning: 'Cursor replaces Copilot.'
        }
      ]
    };

    const memo = await generateAuditSummaryV2('NoRev Startup', mockResult, undefined);
    
    // Assert exactly 3 sentences
    const sentenceCount = countSentences(memo);
    expect(sentenceCount).toBe(3);

    // Grounding Check: Ensure the spend numbers are present in the text
    const numbers = extractNumbers(memo);
    expect(numbers).toContain(1500);
    expect(numbers).toContain(900);
    expect(numbers).toContain(600);
    expect(numbers).toContain(7200);
  });

  test('Mock Edge-Case Financial Inputs: Extreme Overspending ($100k+)', async () => {
    const mockResult: AuditResult = {
      totalCurrentSpend: 120000,
      totalOptimizedSpend: 40000,
      monthlySavings: 80000,
      annualSavings: 960000,
      redundancyWarnings: ['Massive redundant seat allocation across multiple entities'],
      benchmarkComparison: {
        percentile: 98,
        averageForStage: 150,
        status: 'CRITICAL'
      },
      recommendations: [
        {
          originalTool: 'Claude Standalone',
          originalPlan: 'Enterprise Plus',
          originalSeats: 500,
          originalMonthlyCost: 50000,
          action: 'CONSOLIDATE',
          savings: 50000,
          newCost: 0,
          reasoning: 'Consolidate under corporate gateway.'
        }
      ]
    };

    const mockRevenue: AuditResultV2['revenueEnrichment'] = {
      aiSpendAsMrrPercent: 12,
      optimisedSpendAsMrrPercent: 4,
      savingsAsMrrPercent: 8,
      annualSavingsAsArrPercent: 8,
      burnEfficiencyScore: 2.8
    };

    const memo = await generateAuditSummaryV2('Apex Enterprise', mockResult, mockRevenue);

    // Assert exactly 3 sentences
    const sentenceCount = countSentences(memo);
    expect(sentenceCount).toBe(3);

    // Grounding Check: Ensure numbers from the audit engine are verified verbatim in the summary
    const numbers = extractNumbers(memo);
    expect(numbers).toContain(120000);
    expect(numbers).toContain(40000);
    expect(numbers).toContain(80000);
    expect(numbers).toContain(960000);
    expect(numbers).toContain(8);  // Savings %
  });

  test('Mock Edge-Case Financial Inputs: Zero Savings Scenario ($0)', async () => {
    const mockResult: AuditResult = {
      totalCurrentSpend: 450,
      totalOptimizedSpend: 450,
      monthlySavings: 0,
      annualSavings: 0,
      redundancyWarnings: [],
      benchmarkComparison: {
        percentile: 12,
        averageForStage: 150,
        status: 'EXCELLENT'
      },
      recommendations: [
        {
          originalTool: 'Cursor',
          originalPlan: 'Pro',
          originalSeats: 15,
          originalMonthlyCost: 300,
          action: 'KEEP',
          savings: 0,
          newCost: 300,
          reasoning: 'Clean, optimal allocation.'
        }
      ]
    };

    const mockRevenue: AuditResultV2['revenueEnrichment'] = {
      aiSpendAsMrrPercent: 0.5,
      optimisedSpendAsMrrPercent: 0.5,
      savingsAsMrrPercent: 0,
      annualSavingsAsArrPercent: 0,
      burnEfficiencyScore: 0.2
    };

    const memo = await generateAuditSummaryV2('Lean Stack Inc', mockResult, mockRevenue);

    // Assert exactly 3 sentences
    const sentenceCount = countSentences(memo);
    expect(sentenceCount).toBe(3);

    const numbers = extractNumbers(memo);
    expect(numbers).toContain(450);
    expect(numbers).toContain(0);
  });
});
