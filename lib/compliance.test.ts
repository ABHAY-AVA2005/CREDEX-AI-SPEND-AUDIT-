import { expect, test, describe } from 'vitest';
import { getTransitionSecurityImpact } from './compliance';

describe('Fluxora Compliance Transition Engine Tests', () => {

  test('Recommending migration to BYOK Gateway flags high compliance risks', () => {
    // Migrating from ChatGPT Team/Enterprise (fully managed, SOC 2, SAML SSO) to a home-spun BYOK API Gateway
    const res = getTransitionSecurityImpact('ChatGPT', 'API Gateway (TypingMind)');
    
    expect(res.lost).toContain('SOC 2 Type II Compliance');
    expect(res.lost).toContain('SAML SSO');
    expect(res.riskRating).toBe('HIGH');
  });

  test('Favorable transition maps low risk profile', () => {
    // Migrating between standard tools with aligned compliance vectors
    const res = getTransitionSecurityImpact('GitHub Copilot', 'Cursor');
    expect(res.lost.length).toBe(0);
    expect(res.riskRating).toBe('LOW');
  });
});
