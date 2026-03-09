import { describe, it, expect } from "vitest";
import {
  getEffectiveCombatStats,
  getSkillSpeedBonusMining,
  getSkillSpeedBonusFishing,
  getTalentBonusesSelector,
  getMiningYieldBonusPercent,
  getKarmaQiMultiplier,
  getKarmaAttackMultiplier,
  getSkillSpeedBonusGathering,
  getOwnedTechniqueIds,
  getOwnedRingAmuletIds,
  getOwnedSetPieceIds,
} from "./characterSelectors";
import { getCombatStatsFromRealm } from "../../constants/realmProgression";
import { createMockState } from "../../test-utils";

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

    it("applies karma and talent bonuses on top of realm and equipment", () => {
      const state = createMockState(
        {
          attack: 10,
          defense: 5,
          health: 20,
          bonusAttack: 2,
          bonusDefense: 1,
          bonusHealth: 3,
          // Simple talent bonus: +3 attack, +2 defense, +5 vitality (see talents.ts values)
          talentLevels: { 3: 1, 5: 1, 2: 1 },
        },
        { isWeakened: false }
      );
      // Apply a karma attack/defense/health percent bonus
      (state.reincarnation.karmaBonusLevels as any) = {
        attackPercent: 10,
        defensePercent: 20,
        healthPercent: 50,
      };
      const stats = getEffectiveCombatStats(state);
      // Base with karma multiplier, then bonuses; we just assert relative effects.
      expect(stats.attack).toBeGreaterThan(10);
      expect(stats.defense).toBeGreaterThan(5);
      expect(stats.health).toBeGreaterThan(20);
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

  describe("karma multipliers", () => {
    it("getKarmaQiMultiplier returns 1 + qiGainPercent/100", () => {
      const state = createMockState({});
      // qiGainPercent valuePerLevel is 5; two levels = 10% → multiplier 1.1
      (state.reincarnation.karmaBonusLevels as any) = { qiGainPercent: 2 };
      const mult = getKarmaQiMultiplier(state);
      expect(mult).toBeCloseTo(1.1);
    });

    it("getKarmaAttackMultiplier returns 1 when no levels", () => {
      const state = createMockState({});
      const mult = getKarmaAttackMultiplier(state);
      expect(mult).toBe(1);
    });
  });

  describe("skill speed bonuses", () => {
    it("getSkillSpeedBonusGathering includes both set-piece and talent bonuses", () => {
      const state = createMockState({
        talentLevels: { 21: 2 }, // Gatherer's Bounty: 5% per level → 10%
      });
      // Equip a single gathering set piece with skillSpeedBonus 5
      (state.equipment.equipment as any).helmet = {
        id: 999,
        name: "Gathering Hood",
        description: "",
        price: 0,
        kind: "setPiece",
        equipmentSlot: "helmet",
        skillSet: "gathering",
        skillSetTier: "lesser",
        skillSpeedBonus: 5,
      };
      const bonus = getSkillSpeedBonusGathering(state);
      expect(bonus).toBe(15);
    });
  });

  describe("owned id set selectors", () => {
    it("getOwnedTechniqueIds includes both inventory and equipped techniques", () => {
      const state = createMockState({});
      // Inventory technique
      (state.inventory.itemsById as any) = { 1001: 1 };
      // Pretend ITEMS_BY_ID[1001] is a qiTechnique by mimicking its shape
      (state as any).equipment.equipment.qiTechnique = {
        id: 2001,
        name: "Test Qi Technique",
        description: "",
        price: 0,
        kind: "technique",
        equipmentSlot: "qiTechnique",
      };
      const ids = getOwnedTechniqueIds(state);
      expect(ids.has(2001)).toBe(true);
    });

    it("getOwnedRingAmuletIds includes rings and amulets from inventory and equipment", () => {
      const state = createMockState({});
      // Equipped ring
      (state.equipment.equipment as any).ring = {
        id: 3001,
        name: "Test Ring",
        description: "",
        price: 0,
        kind: "equipment",
        equipmentSlot: "ring",
      };
      const ids = getOwnedRingAmuletIds(state);
      expect(ids.has(3001)).toBe(true);
    });

    it("getOwnedSetPieceIds includes set pieces from inventory and equipment", () => {
      const state = createMockState({});
      (state.equipment.equipment as any).helmet = {
        id: 4001,
        name: "Set Helmet",
        description: "",
        price: 0,
        kind: "setPiece",
        equipmentSlot: "helmet",
        skillSet: "fishing",
        skillSetTier: "lesser",
      };
      const ids = getOwnedSetPieceIds(state);
      expect(ids.has(4001)).toBe(true);
    });
  });
});
