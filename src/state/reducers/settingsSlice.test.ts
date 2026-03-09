import { describe, it, expect } from "vitest";
import settingsReducer, {
  setNotificationPrefs,
  setSoundVolume,
  setDeathPenaltyMode,
  purchaseAutoLootUnlock,
  setAutoLoot,
  setAutoEatHpPercent,
} from "./settingsSlice";

describe("settingsSlice", () => {
  it("returns initial state", () => {
    const state = settingsReducer(undefined, { type: "unknown" });
    expect(state.deathPenaltyMode).toBe("normal");
    expect(state.autoLootUnlocked).toBe(false);
    expect(state.autoEatUnlocked).toBe(false);
    expect(state.notificationPrefs.toastsEnabled).toBe(true);
    expect(state.soundVolume.music).toBe(100);
    expect(state.soundVolume.sfx).toBe(100);
  });

  it("setNotificationPrefs merges partial prefs", () => {
    const initial = settingsReducer(undefined, { type: "unknown" });
    const next = settingsReducer(initial, setNotificationPrefs({ levelUp: false }));
    expect(next.notificationPrefs.levelUp).toBe(false);
    expect(next.notificationPrefs.toastsEnabled).toBe(true);
  });

  it("setSoundVolume clamps music and sfx to 0–100", () => {
    const initial = settingsReducer(undefined, { type: "unknown" });
    const next = settingsReducer(initial, setSoundVolume({ music: 50, sfx: 150 }));
    expect(next.soundVolume.music).toBe(50);
    expect(next.soundVolume.sfx).toBe(100);
  });

  it("setDeathPenaltyMode updates mode", () => {
    const initial = settingsReducer(undefined, { type: "unknown" });
    const next = settingsReducer(initial, setDeathPenaltyMode("casual"));
    expect(next.deathPenaltyMode).toBe("casual");
  });

  it("purchaseAutoLootUnlock sets autoLootUnlocked and autoLoot", () => {
    const initial = settingsReducer(undefined, { type: "unknown" });
    const next = settingsReducer(initial, purchaseAutoLootUnlock());
    expect(next.autoLootUnlocked).toBe(true);
    expect(next.autoLoot).toBe(true);
  });

  it("setAutoLoot does nothing when autoLootUnlocked is false", () => {
    const initial = settingsReducer(undefined, { type: "unknown" });
    const next = settingsReducer(initial, setAutoLoot(false));
    expect(next.autoLoot).toBe(false);
  });

  it("setAutoLoot updates when autoLootUnlocked is true", () => {
    let state = settingsReducer(undefined, { type: "unknown" });
    state = settingsReducer(state, purchaseAutoLootUnlock());
    state = settingsReducer(state, setAutoLoot(false));
    expect(state.autoLoot).toBe(false);
  });

  it("setAutoEatHpPercent clamps to 1–99", () => {
    const initial = settingsReducer(undefined, { type: "unknown" });
    expect(settingsReducer(initial, setAutoEatHpPercent(0)).autoEatHpPercent).toBe(1);
    expect(settingsReducer(initial, setAutoEatHpPercent(100)).autoEatHpPercent).toBe(99);
    expect(settingsReducer(initial, setAutoEatHpPercent(50)).autoEatHpPercent).toBe(50);
  });
});
