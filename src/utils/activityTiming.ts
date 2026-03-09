/**
 * Shared activity timing helpers.
 * Pure functions so hooks can use them and tests can assert behavior.
 */

/**
 * Compute effective cast duration given a base delay and a speed bonus percent.
 * Formula matches useActivityTicks: max(100, delay * (1 - speedBonus/100)).
 */
export function getEffectiveDuration(delayMs: number, speedBonusPercent: number): number {
  const factor = 1 - speedBonusPercent / 100;
  return Math.max(100, delayMs * factor);
}

/**
 * Roll mining loot quantity given a yield bonus percent and a random value in [0, 1).
 * When miningYieldPercent > 0, a roll below that percent yields 2 instead of 1.
 */
export function rollMiningLootQuantity(miningYieldPercent: number, random: number): number {
  if (miningYieldPercent <= 0) return 1;
  return random * 100 < miningYieldPercent ? 2 : 1;
}

