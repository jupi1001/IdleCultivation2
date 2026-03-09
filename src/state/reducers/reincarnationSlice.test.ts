import { describe, it, expect } from "vitest";
import reincarnationReducer, { reincarnate, purchaseKarmaBonus, type ReincarnationState } from "./reincarnationSlice";

describe("reincarnationSlice", () => {
  const initial: ReincarnationState = {
    reincarnationCount: 0,
    karmaPoints: 0,
    totalKarmaEarned: 0,
    karmaBonusLevels: {},
  };

  it("returns initial state when called with undefined", () => {
    const state = reincarnationReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initial);
  });

  it("reincarnate increments count and karma totals", () => {
    const state = reincarnationReducer(initial, reincarnate({ karmaEarned: 10 }));
    expect(state.reincarnationCount).toBe(1);
    expect(state.karmaPoints).toBe(10);
    expect(state.totalKarmaEarned).toBe(10);
  });

  it("purchaseKarmaBonus spends karma and increments level when affordable and under max", () => {
    const withKarma: ReincarnationState = {
      ...initial,
      karmaPoints: 10,
      karmaBonusLevels: {},
    };
    const state = reincarnationReducer(withKarma, purchaseKarmaBonus("qiGainPercent"));
    expect(state.karmaPoints).toBeLessThan(withKarma.karmaPoints);
    expect(state.karmaBonusLevels.qiGainPercent).toBe(1);
  });
});

