import { describe, it, expect } from "vitest";
import characterReducer, {
  addAttack,
  addQi,
  breakthrough,
  setRealm,
  type ApplyOfflineProgressPayload,
  applyOfflineProgress,
} from "./characterCoreSlice";
import { reincarnate } from "./reincarnationSlice";
import type { CharacterStats } from "../types/characterStats";

describe("characterCoreSlice", () => {
  it("returns initial state when called with undefined", () => {
    const state = characterReducer(undefined, { type: "unknown" });
    expect(state.name).toBe("Mortal");
    expect(state.money).toBe(500);
  });

  it("addAttack increases bonusAttack", () => {
    const base = characterReducer(undefined, { type: "unknown" });
    const state = characterReducer(base, addAttack(5));
    expect(state.bonusAttack).toBe(5);
  });

  it("addQi rounds to 2 decimal places", () => {
    const base = characterReducer(undefined, { type: "unknown" });
    const state = characterReducer(base, addQi(0.3333));
    expect(state.qi).toBeCloseTo(0.33);
  });

  it("setRealm updates realm and base stats", () => {
    const base = characterReducer(undefined, { type: "unknown" });
    const state = characterReducer(base, setRealm({ realm: "Qi Condensation", realmLevel: 1 }));
    expect(state.realm).toBe("Qi Condensation");
    expect(state.realmLevel).toBe(1);
    // Attack/defense/health should change from Mortal values
    expect(state.attack).not.toBe(base.attack);
  });

  it("breakthrough spends Qi and advances realm when possible", () => {
    // Start at Mortal with enough Qi to breakthrough to Qi Condensation 1
    let state = characterReducer(undefined, { type: "unknown" });
    state = { ...state, qi: 1000 };
    const next = characterReducer(state, breakthrough(undefined));
    expect(next.realm).not.toBe(state.realm);
    expect(next.qi).toBeLessThan(state.qi);
  });

  it("handles reincarnate extraReducer when realm step is high enough", () => {
    // Simulate a high realm to satisfy REINCARNATION_MIN_STEP
    let state = characterReducer(undefined, { type: "unknown" });
    state = characterReducer(state, setRealm({ realm: "Tribulation Transcendent", realmLevel: 1 }));
    const reincarnated = characterReducer(
      state,
      reincarnate({ karmaEarned: 10, startingMoneyBonus: 100 })
    );
    expect(reincarnated.realm).toBe("Mortal");
    expect(reincarnated.money).toBe(500 + 100);
    expect(reincarnated.qi).toBe(0);
  });

  it("applyOfflineProgress adds Qi, money, and sets lastOfflineSummary", () => {
    let state = characterReducer(undefined, { type: "unknown" });
    const payload: ApplyOfflineProgressPayload = {
      offlineMs: 1000,
      offlineQi: 10,
      offlineSpiritStones: 5,
      fishing: { xp: 5, casts: 2, items: [] },
    };
    state = characterReducer(state, applyOfflineProgress(payload));
    expect(state.qi).toBeGreaterThan(0);
    expect(state.money).toBeGreaterThan(500);
    expect(state.lastOfflineSummary).not.toBeNull();
  });
});

