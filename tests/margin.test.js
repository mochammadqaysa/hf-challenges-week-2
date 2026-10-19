/**
 * RasaLore AI - Financial Math & Margin Calculator Unit Tests
 * Verifies TASK-301, TASK-304, AC-010, and zero-fee safety.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MarginCalculator } from '../src/components/margin-widget.js';

describe('MarginCalculator & Financial Math Unit Tests', () => {
  it('Scenario 1: Avoided cloud cost calculation yields ~$0.08 for 10 dishes benchmark', () => {
    // 10 dishes with standard benchmark tokens (800 in, 600 out)
    const result = MarginCalculator.calculateAvoidedCost({ dishCount: 10 });

    assert.equal(result.promptTokens, 8000, 'Prompt tokens should equal 10 * 800 = 8000');
    assert.equal(result.completionTokens, 6000, 'Completion tokens should equal 10 * 600 = 6000');
    assert.equal(result.totalTokens, 14000, 'Total tokens should equal 14000');

    // Cost: (8000 / 1M * 2.50) + (6000 / 1M * 10.00) = 0.020 + 0.060 = 0.0800
    assert.equal(result.avoidedCost, 0.08, 'Avoided cost should be exactly $0.08');
    assert.equal(result.avoidedCostFormatted, '$0.08', 'Avoided cost formatted should be "$0.08"');
  });

  it('Scenario 2: Gross profit margin yields 99.8%+ with local inference', () => {
    // Client fee $50, local electricity direct cost $0.01
    const result = MarginCalculator.calculateGrossMargin({ clientFee: 50, directCost: 0.01 });

    assert.ok(result.marginPercent >= 99.8, `Expected margin >= 99.8%, received ${result.marginPercent}%`);
    assert.equal(result.marginFormatted, '99.8%+', 'Margin format string should reflect 99.8%+');
  });

  it('Scenario 3: Monthly revenue projection calculation ($50 * 5 * 4.33 = $1,082.50)', () => {
    const result = MarginCalculator.calculateMonthlyRevenue({
      clientFee: 50,
      menusPerWeek: 5,
      weeksPerMonth: 4.33
    });

    assert.equal(result.monthlyRevenue, 1082.50, 'Monthly revenue should equal $1,082.50');
    assert.equal(result.auditsPerMonth, 21.65, 'Audits per month should equal 5 * 4.33 = 21.65');
    assert.equal(result.monthlyRevenueFormatted, '$1,083', 'Formatted revenue should round nicely');
  });

  it('Scenario 4: Zero-division safety: Setting fee to $0 yields 0% margin without NaN or exceptions', () => {
    const zeroFeeMargin = MarginCalculator.calculateGrossMargin({ clientFee: 0, directCost: 0.01 });
    assert.equal(zeroFeeMargin.marginPercent, 0, 'Zero fee must return 0%');
    assert.equal(zeroFeeMargin.marginFormatted, '0.0%', 'Zero fee formatted string');
    assert.ok(!Number.isNaN(zeroFeeMargin.marginPercent), 'Must not be NaN');

    const negativeFeeMargin = MarginCalculator.calculateGrossMargin({ clientFee: -10, directCost: 0.01 });
    assert.equal(negativeFeeMargin.marginPercent, 0, 'Negative fee must return 0%');

    const zeroRevenue = MarginCalculator.calculateMonthlyRevenue({ clientFee: 0, menusPerWeek: 5 });
    assert.equal(zeroRevenue.monthlyRevenue, 0, 'Zero fee must return $0 monthly revenue');
    assert.ok(!Number.isNaN(zeroRevenue.monthlyRevenue), 'Must not be NaN');
  });

  it('Scenario 5: Dynamic fee variations across slider range ($25, $50, $75, $100)', () => {
    const testFees = [25, 50, 75, 100];

    for (const fee of testFees) {
      const summary = MarginCalculator.calculate({
        dishCount: 10,
        clientFee: fee,
        menusPerWeek: 5
      });

      assert.equal(summary.clientFee, fee);
      assert.ok(summary.marginPercent >= 99.8, `Fee $${fee} must yield >= 99.8% margin`);
      assert.equal(summary.marginFormatted, '99.8%+');
      assert.equal(summary.avoidedCost, 0.08);

      const expectedRevenue = fee * 5 * 4.33;
      assert.equal(summary.monthlyRevenue, expectedRevenue);
    }
  });

  it('Scenario 6: Calculates avoided cost from actual DishCardModel.tokensConsumed array', () => {
    const sampleDishes = [
      {
        id: 'dish-1',
        tokensConsumed: { promptTokens: 500, completionTokens: 400, totalTokens: 900 }
      },
      {
        id: 'dish-2',
        tokensConsumed: { promptTokens: 600, completionTokens: 500, totalTokens: 1100 }
      }
    ];

    const result = MarginCalculator.calculateAvoidedCost({ dishes: sampleDishes });

    assert.equal(result.promptTokens, 1100);
    assert.equal(result.completionTokens, 900);
    assert.equal(result.totalTokens, 2000);

    // Cost: (1100 / 1M * 2.50) + (900 / 1M * 10.00) = 0.00275 + 0.00900 = 0.01175
    assert.equal(result.avoidedCost, 0.0118);
  });
});
