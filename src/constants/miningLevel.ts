/** Max mining level (display and cap). */
export const MINING_MAX_LEVEL = 120;

/** Backloaded curve. BASE tuned so 1→99 ~50h with current areas. */
const XP_CURVE_BASE = 32;
const XP_CURVE_EXPONENT = 1.25;
/** So 99→120 ~3× as long as 1→99 (~150h). */
const POST_99_XP_MULTIPLIER = 14.75;

/** Total XP needed to reach level L. */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevel(L);
  }
  return sum;
}

/** XP required to go from current level to next. At max level returns 0. */
export function xpRequiredForNextLevel(level: number): number {
  if (level >= MINING_MAX_LEVEL) return 0;
  const base = Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
  return level >= 99 ? Math.floor(base * POST_99_XP_MULTIPLIER) : base;
}

export interface MiningLevelInfo {
  level: number;
  xpInLevel: number;
  xpRequiredForNext: number;
  totalXp: number;
}

/** Derive level and in-level XP from total mining XP. */
export function getMiningLevelInfo(totalXp: number): MiningLevelInfo {
  const total = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < MINING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  const xpInLevel = total - totalXpForLevel(level);
  const xpRequiredForNext = xpRequiredForNextLevel(level);
  return { level, xpInLevel, xpRequiredForNext, totalXp: total };
}
