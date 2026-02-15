/** Max fishing level (display and cap). */
export const FISHING_MAX_LEVEL = 99;

/** XP required to go from level L to L+1 = BASE * L (so 1→2 = 25, 2→3 = 50, 3→4 = 75, ...). */
const XP_PER_LEVEL_BASE = 25;

/** Total XP needed to reach level L (sum of XP for levels 1..L-1). */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return (XP_PER_LEVEL_BASE * (level - 1) * level) / 2;
}

/** XP required to go from current level to next (e.g. level 1 → 25, level 2 → 50). At max level returns 0. */
export function xpRequiredForNextLevel(level: number): number {
  if (level >= FISHING_MAX_LEVEL) return 0;
  return XP_PER_LEVEL_BASE * level;
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
