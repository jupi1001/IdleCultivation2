/**
 * Pure combat math helpers for testing and reuse.
 * Used by CombatContainer and can be extended for Task 9 (combat engine extraction).
 */

/** Block chance when attacker has attack and defender has defense.
 * Hit when roll >= (defense - attack) / (defense + attack). So block chance = (defense - attack) / (defense + attack) when sum > 0.
 */
export function computeBlockChance(attackerAttack: number, defenderDefense: number): number {
  const sum = defenderDefense + attackerAttack;
  if (sum <= 0) return 0;
  const blockChance = (defenderDefense - attackerAttack) / sum;
  return Math.max(0, Math.min(1, blockChance));
}

/** Whether an attack hits given a random value in [0, 1). */
export function doesHit(attackerAttack: number, defenderDefense: number, roll: number): boolean {
  const blockChance = computeBlockChance(attackerAttack, defenderDefense);
  return roll >= blockChance;
}

/** Damage range [min, max] for an attacker with given attack (before crit). Formula: floor(random * attack) + 1 => [1, attack]. */
export function getDamageRange(attack: number): { min: number; max: number } {
  if (attack <= 0) return { min: 0, max: 0 };
  return { min: 1, max: attack };
}

/** Compute base damage for a hit (single roll). In game this uses Math.random(); for tests pass a deterministic value in [0, 1). */
export function computeBaseDamage(attack: number, randomValue: number): number {
  if (attack <= 0) return 0;
  return Math.floor(randomValue * attack) + 1;
}
