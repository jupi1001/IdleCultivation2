/** Max gathering level (display and cap). */
export const GATHERING_MAX_LEVEL = 99;

const XP_PER_LEVEL_BASE = 25;

export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return (XP_PER_LEVEL_BASE * (level - 1) * level) / 2;
}

export function xpRequiredForNextLevel(level: number): number {
  if (level >= GATHERING_MAX_LEVEL) return 0;
  return XP_PER_LEVEL_BASE * level;
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
