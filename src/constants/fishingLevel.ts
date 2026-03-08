/** Max fishing level (display and cap). */
export const FISHING_MAX_LEVEL = 120;

/** Backloaded curve: XP for L→L+1 = floor(BASE × L^EXP). Target: ~50h to 99, ~150h for 99→120. */
const XP_CURVE_BASE = 50;
const XP_CURVE_EXPONENT = 1.25;
/** Levels 99+ need this much more XP per level so 99→120 takes ~3× as long as 1→99. */
const POST_99_XP_MULTIPLIER = 16.5;

/** Total XP needed to reach level L (sum of XP for levels 1..L-1). */
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
  if (level >= FISHING_MAX_LEVEL) return 0;
  const base = Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
  return level >= 99 ? Math.floor(base * POST_99_XP_MULTIPLIER) : base;
}

export interface FishingLevelInfo {
  level: number;
  xpInLevel: number;
  xpRequiredForNext: number;
  totalXp: number;
}

/** Derive level and in-level XP from total fishing XP. */
export function getFishingLevelInfo(totalXp: number): FishingLevelInfo {
  const total = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < FISHING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  const xpInLevel = total - totalXpForLevel(level);
  const xpRequiredForNext = xpRequiredForNextLevel(level);
  return { level, xpInLevel, xpRequiredForNext, totalXp: total };
}
