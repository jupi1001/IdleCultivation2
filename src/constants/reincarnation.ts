/**
 * Reincarnation (prestige) system constants.
 *
 * Available from Tribulation Transcendent realm (step 81+).
 * Resets most progress but awards Karma Points that buy permanent multipliers.
 */
import { getStepIndex, type RealmId } from "./realmProgression";

/** Minimum realm step index to reincarnate (Tribulation Transcendent 1 = step 81). */
export const REINCARNATION_MIN_STEP = 81;

/** Realm label shown in the UI for the reincarnation requirement. */
export const REINCARNATION_MIN_REALM_LABEL = "Tribulation Transcendent";

/**
 * Karma Points earned on reincarnation.
 *
 * Formula:  base from realm step + bonus from total skill levels.
 * - Realm contribution: (step - 80) * 10   (1 point per sublevel above TT, x10)
 * - Skill contribution:  floor(totalSkillLevels / 50)
 *
 * This means a TT1 reincarnation with all skills at 99 yields:
 *   (81-80)*10 + floor((99*6)/50) = 10 + 11 = 21 Karma
 * An Immortal 10 with all 99 yields:
 *   (100-80)*10 + 11 = 211 Karma
 */
export function calculateKarmaEarned(
  realmId: RealmId,
  realmLevel: number,
  totalSkillLevels: number
): number {
  const step = getStepIndex(realmId, realmLevel);
  const realmKarma = Math.max(0, step - 80) * 10;
  const skillKarma = Math.floor(totalSkillLevels / 50);
  return realmKarma + skillKarma;
}

/** Bonus types purchasable with Karma Points. */
export type KarmaBonusId =
  | "qiGainPercent"
  | "skillXpPercent"
  | "attackPercent"
  | "defensePercent"
  | "healthPercent"
  | "spiritStonePercent"
  | "startingMoney";

export interface KarmaBonusTier {
  id: KarmaBonusId;
  name: string;
  description: string;
  /** Karma cost per level. */
  costPerLevel: number;
  /** Max purchasable levels. */
  maxLevel: number;
  /** Value added per level (percent for % bonuses, flat for flat bonuses). */
  valuePerLevel: number;
  /** "percent" or "flat" for display purposes. */
  unit: "percent" | "flat";
}

export const KARMA_BONUSES: KarmaBonusTier[] = [
  {
    id: "qiGainPercent",
    name: "Dao Memory",
    description: "Qi gained from meditation is increased.",
    costPerLevel: 5,
    maxLevel: 20,
    valuePerLevel: 5,
    unit: "percent",
  },
  {
    id: "skillXpPercent",
    name: "Muscle Memory",
    description: "XP gained from all skills is increased.",
    costPerLevel: 8,
    maxLevel: 15,
    valuePerLevel: 5,
    unit: "percent",
  },
  {
    id: "attackPercent",
    name: "Lingering Killing Intent",
    description: "Base attack from realm is increased.",
    costPerLevel: 6,
    maxLevel: 20,
    valuePerLevel: 3,
    unit: "percent",
  },
  {
    id: "defensePercent",
    name: "Tempered Spirit",
    description: "Base defense from realm is increased.",
    costPerLevel: 6,
    maxLevel: 20,
    valuePerLevel: 3,
    unit: "percent",
  },
  {
    id: "healthPercent",
    name: "Resilient Body",
    description: "Base vitality from realm is increased.",
    costPerLevel: 6,
    maxLevel: 20,
    valuePerLevel: 3,
    unit: "percent",
  },
  {
    id: "spiritStonePercent",
    name: "Fortune of Past Lives",
    description: "Spirit Stone income from labourers is increased.",
    costPerLevel: 5,
    maxLevel: 20,
    valuePerLevel: 5,
    unit: "percent",
  },
  {
    id: "startingMoney",
    name: "Inherited Wealth",
    description: "Start each life with additional Spirit Stones.",
    costPerLevel: 3,
    maxLevel: 10,
    valuePerLevel: 500,
    unit: "flat",
  },
];

export const KARMA_BONUSES_BY_ID: Record<KarmaBonusId, KarmaBonusTier> =
  KARMA_BONUSES.reduce(
    (acc, b) => ({ ...acc, [b.id]: b }),
    {} as Record<KarmaBonusId, KarmaBonusTier>
  );
