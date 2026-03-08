import { describe, it, expect } from "vitest";
import type { RootState } from "../store";
import {
  getEffectiveCombatStats,
  getSkillSpeedBonusMining,
  getSkillSpeedBonusFishing,
  getTalentBonusesSelector,
  getMiningYieldBonusPercent,
} from "./characterSelectors";
import { ContentArea } from "../../enum/ContentArea";
import { getCombatStatsFromRealm } from "../../constants/realmProgression";
import { ALL_EQUIPMENT_SLOTS } from "../../types/EquipmentSlot";

/** Build minimal RootState for selector tests. Only character and combat are fully shaped; other slices are minimal. */
function createMockState(character: Partial<RootState["character"]>, combat?: Partial<RootState["combat"]>): RootState {
  const realmStats = getCombatStatsFromRealm("Mortal", 0);
  const equipment = ALL_EQUIPMENT_SLOTS.reduce(
    (acc, slot) => ({ ...acc, [slot]: null }),
    {} as RootState["character"]["equipment"]
  );
  const baseCharacter: RootState["character"] = {
    name: "Mortal",
    attack: realmStats.attack,
    defense: realmStats.defense,
    health: realmStats.health,
    money: 0,
    miner: 0,
    itemsById: {},
    fishingXP: 0,
    realm: "Mortal",
    realmLevel: 0,
    qi: 0,
    currentActivity: "none",
    equipment,
    path: null,
    gender: null,
    currentSectId: null,
    sectRankIndex: 0,
    promotionEndTime: null,
    promotionToRankIndex: null,
    talentLevels: {},
    expeditionEndTime: null,
    expeditionMissionId: null,
    avatars: [],
    nextAvatarId: 1,
    currentFishingArea: null,
    fishingCastStartTime: null,
    fishingCastDuration: 0,
    fishingCastId: 0,
    miningXP: 0,
    currentMiningArea: null,
    miningCastStartTime: null,
    miningCastDuration: 0,
    miningCastId: 0,
    gatheringXP: 0,
    currentGatheringArea: null,
    gatheringCastStartTime: null,
    gatheringCastDuration: 0,
    gatheringCastId: 0,
    alchemyXP: 0,
    forgingXP: 0,
    cookingXP: 0,
    bonusAttack: 0,
    bonusDefense: 0,
    bonusHealth: 0,
    lastActiveTimestamp: 0,
    lastOfflineSummary: null,
    sectQuestProgress: {},
    sectQuestKillCount: {},
    obtainedSectTreasureIds: [],
    npcFavor: {},
    realmDialogueUsed: {},
    cultivationPartner: null,
    stats: {
      enemiesKilledByArea: {},
      itemsGatheredFishing: 0,
      itemsGatheredMining: 0,
      itemsGatheredGathering: 0,
      totalSpiritStonesEarned: 0,
      totalQiGenerated: 0,
      totalBreakthroughs: 0,
      timePlayedMs: 0,
      highestRealmStep: 0,
      itemsCraftedAlchemy: 0,
      itemsCraftedForging: 0,
      itemsCraftedCooking: 0,
      deaths: 0,
    },
  };
  const defaultCombat: RootState["combat"] = {
    currentHealth: realmStats.health,
    isWeakened: false,
    weakenedMeditationSecondsDone: 0,
  };
  const defaultSettings = {
    notificationPrefs: {
      toastsEnabled: true,
      levelUp: true,
      rareDrop: true,
      achievement: true,
      expedition: true,
    },
    soundVolume: { music: 100, sfx: 100 },
    deathPenaltyMode: "normal" as const,
    autoLootUnlocked: false,
    autoLoot: false,
    autoEatUnlocked: false,
    autoEat: false,
    autoEatHpPercent: 30,
  };
  const defaultReincarnation = {
    reincarnationCount: 0,
    karmaPoints: 0,
    totalKarmaEarned: 0,
    karmaBonusLevels: {} as Partial<Record<string, number>>,
  };
  const state = {
    character: { ...baseCharacter, ...character },
    combat: { ...defaultCombat, ...combat },
    settings: defaultSettings,
    reincarnation: defaultReincarnation,
    content: { route: { type: "map" as const } },
    toast: { toasts: [], toastHistory: [] },
    achievements: { unlocked: {} },
    log: { entries: [], filter: "all" as const, panelCollapsed: true },
  } as unknown as RootState;
  return state;
}

describe("characterSelectors", () => {
  describe("getEffectiveCombatStats", () => {
    it("returns realm stats when no equipment or talents", () => {
      const state = createMockState({});
      const stats = getEffectiveCombatStats(state);
      const realmStats = getCombatStatsFromRealm("Mortal", 0);
      expect(stats.attack).toBe(realmStats.attack);
      expect(stats.defense).toBe(realmStats.defense);
      expect(stats.health).toBe(realmStats.health);
    });

    it("applies weakened multiplier when isWeakened and deathPenaltyMode normal", () => {
      const state = createMockState(
        { attack: 20, defense: 10, health: 30 },
        { isWeakened: true }
      );
      const stats = getEffectiveCombatStats(state);
      expect(stats.attack).toBe(10); // 0.5 * 20
      expect(stats.defense).toBe(5);
      expect(stats.health).toBe(15);
    });
  });

  describe("getSkillSpeedBonusMining", () => {
    it("returns only equipment mining speed bonus (talent yield not in speed)", () => {
      const state = createMockState({ talentLevels: { 20: 3 } });
      const bonus = getSkillSpeedBonusMining(state);
      expect(bonus).toBe(0);
    });
  });

  describe("getMiningYieldBonusPercent", () => {
    it("returns mining yield talent percent (Miner's Strength)", () => {
      const state = createMockState({ talentLevels: { 20: 3 } });
      expect(getMiningYieldBonusPercent(state)).toBe(15);
    });
  });

  describe("getSkillSpeedBonusFishing", () => {
    it("includes fishing speed talent percent", () => {
      // Fisher's Patience id 19: fishingSpeedPercent 5 per level
      const state = createMockState({ talentLevels: { 19: 2 } });
      const bonus = getSkillSpeedBonusFishing(state);
      expect(bonus).toBe(10);
    });
  });

  describe("getTalentBonusesSelector", () => {
    it("returns talent bonuses from talentLevels", () => {
      const state = createMockState({ talentLevels: { 20: 1 } });
      const bonuses = getTalentBonusesSelector(state);
      expect(bonuses.miningYieldPercent).toBe(5);
    });
  });
});
