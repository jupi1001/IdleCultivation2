import { describe, it, expect } from "vitest";
import { getEffectiveDuration, rollMiningLootQuantity } from "./activityTiming";

describe("activityTiming", () => {
  describe("getEffectiveDuration", () => {
    it("never goes below 100ms", () => {
      expect(getEffectiveDuration(50, 0)).toBe(100);
      expect(getEffectiveDuration(50, 50)).toBe(100);
    });

    it("applies speed bonus as percentage reduction", () => {
      const base = 1000;
      const speed = 20; // 20% faster → 80% of delay
      expect(getEffectiveDuration(base, speed)).toBeCloseTo(800);
    });
  });

  describe("rollMiningLootQuantity", () => {
    it("returns 1 when miningYieldPercent is <= 0", () => {
      expect(rollMiningLootQuantity(0, 0)).toBe(1);
      expect(rollMiningLootQuantity(-10, 0)).toBe(1);
    });

    it("returns 2 when random roll is below yield percent", () => {
      // 50% yield → random < 0.5 yields 2
      expect(rollMiningLootQuantity(50, 0.25)).toBe(2);
    });

    it("returns 1 when random roll is above yield percent", () => {
      expect(rollMiningLootQuantity(50, 0.75)).toBe(1);
    });
  });
});

