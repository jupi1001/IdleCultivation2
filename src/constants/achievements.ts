/**
 * Achievement definitions for the game.
 *
 * Each achievement has a unique id, category, and a `check` function that receives
 * the character state and returns true when the achievement is earned.
 * The middleware runs checks after every relevant action.
 */
import { getAlchemyLevel } from "./alchemy";
import { getCookingLevel } from "./cooking";
import { getFishingLevelInfo } from "./fishingLevel";
import { getForgingLevel } from "./forging";
import { getGatheringLevelInfo } from "./gatheringLevel";
import { getMiningLevelInfo } from "./miningLevel";
import type { RealmId } from "./realmProgression";
import { getStepIndex, REALM_ORDER } from "./realmProgression";

export type AchievementCategory =
  | "cultivation"
  | "skills"
  | "economy"
  | "combat"
  | "collection"
  | "sect"
  | "prestige";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  /** Reward spirit stones on unlock (0 = no reward). */
  reward: number;
  hidden?: boolean;
  check: (char: CharSnapshot) => boolean;
}

/**
 * Minimal snapshot of character state used by achievement checks.
 * Avoids importing the full CharacterState type (circular dep).
 */
export interface CharSnapshot {
  realm: RealmId;
  realmLevel: number;
  money: number;
  miner: number;
  fishingXP: number;
  miningXP: number;
  gatheringXP: number;
  alchemyXP: number;
  forgingXP: number;
  cookingXP: number;
  items: { id: number; quantity?: number; equipmentSlot?: string; skillSet?: string }[];
  equipment: Record<string, { id: number } | null>;
  currentSectId: number | null;
  sectRankIndex: number;
  reincarnationCount: number;
  totalKarmaEarned: number;
  talentLevels: Record<number, number>;
  avatars: { id: number }[];
  path: string | null;
}

function skillLevel(skill: "fishing" | "mining" | "gathering" | "alchemy" | "forging" | "cooking", char: CharSnapshot): number {
  switch (skill) {
    case "fishing": return getFishingLevelInfo(char.fishingXP).level;
    case "mining": return getMiningLevelInfo(char.miningXP).level;
    case "gathering": return getGatheringLevelInfo(char.gatheringXP).level;
    case "alchemy": return getAlchemyLevel(char.alchemyXP);
    case "forging": return getForgingLevel(char.forgingXP);
    case "cooking": return getCookingLevel(char.cookingXP);
  }
}

function realmAtLeast(char: CharSnapshot, targetRealm: RealmId, targetLevel: number = 1): boolean {
  return getStepIndex(char.realm, char.realmLevel) >= getStepIndex(targetRealm, targetLevel);
}

function totalSkillLevels(char: CharSnapshot): number {
  return (
    skillLevel("fishing", char) +
    skillLevel("mining", char) +
    skillLevel("gathering", char) +
    skillLevel("alchemy", char) +
    skillLevel("forging", char) +
    skillLevel("cooking", char)
  );
}

function talentPointsSpent(char: CharSnapshot): number {
  return Object.values(char.talentLevels).reduce((sum, lvl) => sum + (lvl ?? 0), 0);
}

// ─── Cultivation Achievements ───
const cultivationAchievements: AchievementDef[] = REALM_ORDER.slice(1).map((realmId, i) => ({
  id: `realm_${realmId.toLowerCase().replace(/\s+/g, "_")}`,
  name: realmId === "Qi Condensation" ? "First Steps" : `${realmId}`,
  description: `Reach ${realmId}.`,
  category: "cultivation" as const,
  reward: 50 * (i + 1),
  check: (char: CharSnapshot) => realmAtLeast(char, realmId, 1),
}));

cultivationAchievements.push({
  id: "realm_immortal_10",
  name: "Peak of Immortality",
  description: "Reach Immortal 10.",
  category: "cultivation",
  reward: 2000,
  check: (char) => realmAtLeast(char, "Immortal", 10),
});

cultivationAchievements.push({
  id: "talent_first",
  name: "Budding Talent",
  description: "Purchase your first talent.",
  category: "cultivation",
  reward: 50,
  check: (char) => talentPointsSpent(char) >= 1,
});

cultivationAchievements.push({
  id: "talent_10",
  name: "Accomplished Cultivator",
  description: "Spend 10 talent points.",
  category: "cultivation",
  reward: 200,
  check: (char) => talentPointsSpent(char) >= 10,
});

// ─── Skills Achievements ───
const SKILL_NAMES: { key: "fishing" | "mining" | "gathering" | "alchemy" | "forging" | "cooking"; label: string }[] = [
  { key: "fishing", label: "Fishing" },
  { key: "mining", label: "Mining" },
  { key: "gathering", label: "Gathering" },
  { key: "alchemy", label: "Alchemy" },
  { key: "forging", label: "Forging" },
  { key: "cooking", label: "Cooking" },
];

const SKILL_MILESTONES = [
  { level: 10, suffix: "Apprentice", reward: 25 },
  { level: 25, suffix: "Journeyman", reward: 75 },
  { level: 50, suffix: "Expert", reward: 200 },
  { level: 75, suffix: "Master", reward: 500 },
  { level: 99, suffix: "Grandmaster", reward: 1000 },
];

const skillAchievements: AchievementDef[] = [];
for (const { key, label } of SKILL_NAMES) {
  for (const { level, suffix, reward } of SKILL_MILESTONES) {
    skillAchievements.push({
      id: `skill_${key}_${level}`,
      name: `${label} ${suffix}`,
      description: `Reach ${label} level ${level}.`,
      category: "skills",
      reward,
      check: (char) => skillLevel(key, char) >= level,
    });
  }
}

skillAchievements.push({
  id: "skill_total_100",
  name: "Well-Rounded",
  description: "Have a combined total of 100 skill levels.",
  category: "skills",
  reward: 300,
  check: (char) => totalSkillLevels(char) >= 100,
});

skillAchievements.push({
  id: "skill_total_300",
  name: "Jack of All Trades",
  description: "Have a combined total of 300 skill levels.",
  category: "skills",
  reward: 1000,
  check: (char) => totalSkillLevels(char) >= 300,
});

skillAchievements.push({
  id: "skill_all_99",
  name: "Omni-Master",
  description: "Reach level 99 in all six skills.",
  category: "skills",
  reward: 5000,
  check: (char) => SKILL_NAMES.every(({ key }) => skillLevel(key, char) >= 99),
});

// ─── Economy Achievements ───
const economyAchievements: AchievementDef[] = [
  { id: "eco_first_stone", name: "Humble Beginnings", description: "Earn your first Spirit Stone.", category: "economy", reward: 0, check: (char) => char.money >= 1 },
  { id: "eco_1k", name: "Modest Fortune", description: "Hold 1,000 Spirit Stones.", category: "economy", reward: 50, check: (char) => char.money >= 1_000 },
  { id: "eco_10k", name: "Prosperous", description: "Hold 10,000 Spirit Stones.", category: "economy", reward: 200, check: (char) => char.money >= 10_000 },
  { id: "eco_100k", name: "Wealthy Cultivator", description: "Hold 100,000 Spirit Stones.", category: "economy", reward: 500, check: (char) => char.money >= 100_000 },
  { id: "eco_1m", name: "Spirit Stone Magnate", description: "Hold 1,000,000 Spirit Stones.", category: "economy", reward: 2000, check: (char) => char.money >= 1_000_000 },
  { id: "eco_miner_1", name: "First Labourer", description: "Hire your first labourer.", category: "economy", reward: 25, check: (char) => char.miner >= 1 },
  { id: "eco_miner_10", name: "Small Business", description: "Hire 10 labourers.", category: "economy", reward: 100, check: (char) => char.miner >= 10 },
  { id: "eco_miner_50", name: "Mining Mogul", description: "Hire 50 labourers.", category: "economy", reward: 500, check: (char) => char.miner >= 50 },
  { id: "eco_miner_100", name: "Labour Empire", description: "Hire 100 labourers.", category: "economy", reward: 1000, check: (char) => char.miner >= 100 },
];

// ─── Collection Achievements ───
const collectionAchievements: AchievementDef[] = [
  { id: "col_10_items", name: "Collector", description: "Own 10 unique item types.", category: "collection", reward: 50, check: (char) => char.items.length >= 10 },
  { id: "col_25_items", name: "Hoarder", description: "Own 25 unique item types.", category: "collection", reward: 150, check: (char) => char.items.length >= 25 },
  { id: "col_50_items", name: "Treasure Vault", description: "Own 50 unique item types.", category: "collection", reward: 500, check: (char) => char.items.length >= 50 },
  {
    id: "col_technique",
    name: "Technique Collector",
    description: "Own at least one Qi or Combat technique.",
    category: "collection",
    reward: 100,
    check: (char) => {
      const hasTechItem = char.items.some((i) => i.equipmentSlot === "qiTechnique" || i.equipmentSlot === "combatTechnique");
      const hasTechEquipped = char.equipment.qiTechnique != null || char.equipment.combatTechnique != null;
      return hasTechItem || hasTechEquipped;
    },
  },
  {
    id: "col_skilling_set",
    name: "Dressed for the Job",
    description: "Own a skilling set piece.",
    category: "collection",
    reward: 100,
    check: (char) => {
      const hasSetItem = char.items.some((i) => i.skillSet != null);
      const hasSetEquip = (["helmet", "body", "legs", "shoes"] as const).some(
        (s) => (char.equipment as Record<string, { id: number; skillSet?: string } | null>)[s]?.skillSet != null
      );
      return hasSetItem || hasSetEquip;
    },
  },
  {
    id: "col_avatar",
    name: "Avatar Created",
    description: "Create your first Avatar.",
    category: "collection",
    reward: 200,
    check: (char) => (char.avatars?.length ?? 0) >= 1,
  },
];

// ─── Sect Achievements ───
const sectAchievements: AchievementDef[] = [
  { id: "sect_join", name: "Joining the Fold", description: "Join a sect.", category: "sect", reward: 50, check: (char) => char.currentSectId != null },
  { id: "sect_outer", name: "Outer Disciple", description: "Reach Outer Disciple rank in a sect.", category: "sect", reward: 100, check: (char) => char.sectRankIndex >= 1 },
  { id: "sect_inner", name: "Inner Disciple", description: "Reach Inner Disciple rank in a sect.", category: "sect", reward: 250, check: (char) => char.sectRankIndex >= 2 },
  { id: "sect_core", name: "Core Disciple", description: "Reach Core Disciple rank in a sect.", category: "sect", reward: 500, check: (char) => char.sectRankIndex >= 3 },
];

// ─── Prestige Achievements ───
const prestigeAchievements: AchievementDef[] = [
  { id: "prestige_first", name: "New Beginning", description: "Reincarnate for the first time.", category: "prestige", reward: 0, check: (char) => (char.reincarnationCount ?? 0) >= 1 },
  { id: "prestige_5", name: "Cycle of Rebirth", description: "Reincarnate 5 times.", category: "prestige", reward: 0, check: (char) => (char.reincarnationCount ?? 0) >= 5 },
  { id: "prestige_10", name: "Eternal Wanderer", description: "Reincarnate 10 times.", category: "prestige", reward: 0, check: (char) => (char.reincarnationCount ?? 0) >= 10 },
  { id: "prestige_karma_100", name: "Karmic Accumulation", description: "Earn a total of 100 Karma Points.", category: "prestige", reward: 0, check: (char) => (char.totalKarmaEarned ?? 0) >= 100 },
  { id: "prestige_karma_500", name: "Karmic Enlightenment", description: "Earn a total of 500 Karma Points.", category: "prestige", reward: 0, check: (char) => (char.totalKarmaEarned ?? 0) >= 500 },
];

// ─── All achievements ───
export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  ...cultivationAchievements,
  ...skillAchievements,
  ...economyAchievements,
  ...collectionAchievements,
  ...sectAchievements,
  ...prestigeAchievements,
];

export const ACHIEVEMENTS_BY_ID: Record<string, AchievementDef> = {};
for (const a of ALL_ACHIEVEMENTS) {
  ACHIEVEMENTS_BY_ID[a.id] = a;
}

export const ACHIEVEMENT_CATEGORIES: { id: AchievementCategory; label: string }[] = [
  { id: "cultivation", label: "Cultivation" },
  { id: "skills", label: "Skills" },
  { id: "economy", label: "Economy" },
  { id: "collection", label: "Collection" },
  { id: "sect", label: "Sect" },
  { id: "prestige", label: "Prestige" },
];

export const TOTAL_ACHIEVEMENT_COUNT = ALL_ACHIEVEMENTS.length;
