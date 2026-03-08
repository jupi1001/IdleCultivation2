/** Max gathering level (display and cap). */
export const GATHERING_MAX_LEVEL = 120;

/** Backloaded curve. BASE tuned so 1→99 ~50h with current areas. */
const XP_CURVE_BASE = 25;
const XP_CURVE_EXPONENT = 1.25;
/** So 99→120 ~3× as long as 1→99 (~150h). */
const POST_99_XP_MULTIPLIER = 13.15;

export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevel(L);
  }
  return sum;
}

export function xpRequiredForNextLevel(level: number): number {
  if (level >= GATHERING_MAX_LEVEL) return 0;
  const base = Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
  return level >= 99 ? Math.floor(base * POST_99_XP_MULTIPLIER) : base;
}

export interface GatheringLevelInfo {
  level: number;
  xpInLevel: number;
  xpRequiredForNext: number;
  totalXp: number;
}

export function getGatheringLevelInfo(totalXp: number): GatheringLevelInfo {
  const total = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < GATHERING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  const xpInLevel = total - totalXpForLevel(level);
  const xpRequiredForNext = xpRequiredForNextLevel(level);
  return { level, xpInLevel, xpRequiredForNext, totalXp: total };
}
