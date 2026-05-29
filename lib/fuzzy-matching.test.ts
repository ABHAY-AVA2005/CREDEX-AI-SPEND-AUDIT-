import { expect, test, describe } from 'vitest';
import { resolveFuzzyToolName, stringSimilarity } from './fuzzy-matching';

describe('Fluxora Fuzzy Matching Engine Tests', () => {

  const verifiedTools = [
    "Cursor",
    "GitHub Copilot",
    "Claude",
    "ChatGPT",
    "Jasper",
    "v0",
    "Windsurf"
  ];

  test('Similarity scoring math is accurate', () => {
    expect(stringSimilarity('Claude', 'Claude')).toBe(1.0);
    expect(stringSimilarity('Claude', 'Clode')).toBe(4/6);
    expect(stringSimilarity('OpenAI', 'Google')).toBe(0.0);
  });

  test('Substrings map to verified tool identities', () => {
    expect(resolveFuzzyToolName('GitHub Copilot Pro+', verifiedTools)).toBe('GitHub Copilot');
    expect(resolveFuzzyToolName('Cursor.sh', verifiedTools)).toBe('Cursor');
    expect(resolveFuzzyToolName('ChatGPT Enterprise Client', verifiedTools)).toBe('ChatGPT');
  });

  test('Common typos match to verified tools', () => {
    expect(resolveFuzzyToolName('Jesper.ai', verifiedTools)).toBe('Jasper');
    expect(resolveFuzzyToolName('Copilet', verifiedTools)).toBe('GitHub Copilot');
    expect(resolveFuzzyToolName('Windserf Pro', verifiedTools)).toBe('Windsurf');
  });

  test('Unknown tools return verbatim input', () => {
    expect(resolveFuzzyToolName('Midjourney Plus', verifiedTools)).toBe('Midjourney Plus');
  });
});
