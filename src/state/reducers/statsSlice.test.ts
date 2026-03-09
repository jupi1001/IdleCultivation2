import { describe, it, expect } from "vitest";
import statsReducer, { recordEnemyKill, recordDeath, recordItemCrafted } from "./statsSlice";
import { addMoney, addQi, breakthrough, setLastActiveTimestamp } from "./characterCoreSlice";
import type { CharacterStats } from "../types/characterStats";

describe("statsSlice", () => {
  const initial: CharacterStats = statsReducer(undefined, { type: "unknown" });

  it("returns initial stats when called with undefined", () => {
    expect(initial.totalSpiritStonesEarned).toBe(0);
    expect(initial.deaths).toBe(0);
  });

  it("recordEnemyKill increments enemiesKilledByArea", () => {
    const state = statsReducer(initial, recordEnemyKill("Area1"));
    expect(state.enemiesKilledByArea.Area1).toBe(1);
  });

  it("recordDeath increments deaths", () => {
    const state = statsReducer(initial, recordDeath());
    expect(state.deaths).toBe(1);
  });

  it("recordItemCrafted increments appropriate crafted counters", () => {
    let state = statsReducer(initial, recordItemCrafted("alchemy"));
    state = statsReducer(state, recordItemCrafted("forging"));
    state = statsReducer(state, recordItemCrafted("cooking"));
    expect(state.itemsCraftedAlchemy).toBe(1);
    expect(state.itemsCraftedForging).toBe(1);
    expect(state.itemsCraftedCooking).toBe(1);
  });

  it("addMoney extraReducer increases totalSpiritStonesEarned", () => {
    const state = statsReducer(initial, addMoney(50));
    expect(state.totalSpiritStonesEarned).toBe(50);
  });

  it("addQi extraReducer increases totalQiGenerated", () => {
    const state = statsReducer(initial, addQi(12));
    expect(state.totalQiGenerated).toBe(12);
  });

  it("setLastActiveTimestamp extraReducer accumulates timePlayedMs when previousTimestamp is provided", () => {
    const state = statsReducer(
      initial,
      setLastActiveTimestamp({ newTimestamp: 2000, previousTimestamp: 1000 })
    );
    expect(state.timePlayedMs).toBe(1000);
  });

  it("breakthrough extraReducer increments totalBreakthroughs and highestRealmStep", () => {
    const state = statsReducer(
      initial,
      breakthrough({ nextRealmId: "Qi Condensation", nextRealmLevel: 1 })
    );
    expect(state.totalBreakthroughs).toBe(1);
    expect(state.highestRealmStep).toBeGreaterThan(0);
  });
});

