import { describe, it, expect } from "vitest";
import {
  computeBlockChance,
  doesHit,
  getDamageRange,
  computeBaseDamage,
} from "./combatMath";

describe("combatMath", () => {
  describe("computeBlockChance", () => {
    it("returns 0 when sum is 0", () => {
      expect(computeBlockChance(0, 0)).toBe(0);
    });
    it("returns 0 when attacker has more attack than defender defense", () => {
      expect(computeBlockChance(10, 5)).toBe(0);
    });
    it("computes block chance when defense > attack", () => {
      // (defense - attack) / (defense + attack) = (10 - 5) / 15 = 1/3
      expect(computeBlockChance(5, 10)).toBeCloseTo(1 / 3);
    });
    it("returns 1 when defender blocks everything (attack 0)", () => {
      expect(computeBlockChance(0, 10)).toBe(1);
    });
  });

  describe("doesHit", () => {
    it("hits when roll >= block chance", () => {
      // block chance = (10-5)/15 = 1/3. Roll 0.5 >= 1/3 => hit
      expect(doesHit(5, 10, 0.5)).toBe(true);
    });
    it("misses when roll < block chance", () => {
      expect(doesHit(5, 10, 0.2)).toBe(false);
    });
  });

  describe("getDamageRange", () => {
    it("returns [1, attack] for positive attack", () => {
      expect(getDamageRange(10)).toEqual({ min: 1, max: 10 });
    });
    it("returns [0, 0] for zero attack", () => {
      expect(getDamageRange(0)).toEqual({ min: 0, max: 0 });
    });
  });

  describe("computeBaseDamage", () => {
    it("returns 1 when randomValue 0", () => {
      expect(computeBaseDamage(10, 0)).toBe(1);
    });
    it("returns attack when randomValue just below 1", () => {
      expect(computeBaseDamage(10, 0.99)).toBe(10);
    });
    it("returns 0 for zero attack", () => {
      expect(computeBaseDamage(0, 0.5)).toBe(0);
    });
  });
});
