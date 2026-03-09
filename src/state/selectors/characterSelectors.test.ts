import { describe, it, expect } from "vitest";
import {
  getEffectiveCombatStats,
  getSkillSpeedBonusMining,
  getSkillSpeedBonusFishing,
  getTalentBonusesSelector,
  getMiningYieldBonusPercent,
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
