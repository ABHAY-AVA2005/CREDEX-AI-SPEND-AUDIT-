import { expect, test, describe } from 'vitest';
import { calculateRealCohortPercentile } from './benchmarks';

describe('Fluxora DB-Telemetry Benchmarking Tests', () => {

  test('Fallback to log-normal distribution when DB is unconfigured or empty', async () => {
    // With DB unconfigured / empty (< 5 peers), it falls back to the statistical baseline.
    // For a highly efficient spend ($30/employee vs stageBenchmark $150):
    const res = await calculateRealCohortPercentile(50, 30);
    
    expect(res.percentile).toBe(90); // 1 - 30/300 = 0.90 -> 90th percentile
    expect(res.status).toBe('EXCELLENT');
    expect(res.averageForStage).toBe(150);
  });

  test('Critical overspending classification in fallback cohort', async () => {
    const res = await calculateRealCohortPercentile(10, 300);
    expect(res.percentile).toBe(1); // capped at minimum 1%
    expect(res.status).toBe('CRITICAL');
  });
});
