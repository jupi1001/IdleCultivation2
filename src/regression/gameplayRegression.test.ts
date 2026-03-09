import { describe, it, expect } from "vitest";
import combatReducer, { setWeakened, tickWeakenedRecovery } from "../state/reducers/combatSlice";
import { setDeathPenaltyMode } from "../state/reducers/settingsSlice";
import { getSkillSpeedBonusMining, getMiningYieldBonusPercent } from "../state/selectors/characterSelectors";
import { createMockState } from "../test-utils";
import { rollMiningLootQuantity } from "../utils/activityTiming";

describe("regression: gameplay semantics", () => {
  it("mining yield talent affects quantity, not cast speed", () => {
    // Miner’s Strength (id 20) should increase yield, not mining speed.
    const state = createMockState({ talentLevels: { 20: 3 } }); // 15% yield

    const speedBonus = getSkillSpeedBonusMining(state);
    const yieldBonus = getMiningYieldBonusPercent(state);

    expect(speedBonus).toBe(0);
    expect(yieldBonus).toBe(15);

    // Quantity helper uses yieldBonus; with a roll below 15% we get 2, otherwise 1.
    expect(rollMiningLootQuantity(yieldBonus, 0.05)).toBe(2);
    expect(rollMiningLootQuantity(yieldBonus, 0.5)).toBe(1);
  });

  it("switching to casual death penalty clears weakened state and recovery progress", () => {
    // Start weakened with some recovery progress.
    let combatState = combatReducer(undefined, { type: "unknown" });
    combatState = combatReducer(combatState, setWeakened(true));
    combatState = combatReducer(
      combatState,
      tickWeakenedRecovery({ seconds: 10, deathPenaltyMode: "normal" })
    );
    expect(combatState.isWeakened).toBe(true);
    expect(combatState.weakenedMeditationSecondsDone).toBe(10);

    // When settings switch to casual, combat slice should clear weakened state and progress.
    combatState = combatReducer(combatState, setDeathPenaltyMode("casual"));
    expect(combatState.isWeakened).toBe(false);
    expect(combatState.weakenedMeditationSecondsDone).toBe(0);
  });
});

