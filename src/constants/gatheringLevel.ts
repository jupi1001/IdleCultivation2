/** Max gathering level (display and cap). */
export const GATHERING_MAX_LEVEL = 99;

/** Backloaded curve (same shape as fishing): XP for L→L+1 = floor(BASE × L^EXP). */
const XP_CURVE_BASE = 10;
const XP_CURVE_EXPONENT = 1.25;

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
  return Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
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
