import { describe, it, expect } from "vitest";
import { parsePersistedRootState } from "./saveState";

describe("saveState schema", () => {
  it("accepts a minimal valid persisted root state", () => {
    const root = parsePersistedRootState({
      character: {},
      avatars: {},
      combat: {},
      settings: {},
      stats: {},
      reincarnation: {},
      sect: {},
      inventory: {},
      equipment: {},
      skills: {},
      content: {},
      toast: {},
      achievements: {},
      log: {},
    });
    expect(root).toHaveProperty("character");
    expect(root).toHaveProperty("inventory");
  });

  it("accepts extra keys due to passthrough but still requires known slices when present", () => {
    const input = {
      character: {},
      avatars: {},
      combat: {},
      settings: {},
      stats: {},
      reincarnation: {},
      sect: {},
      inventory: {},
      equipment: {},
      skills: {},
      content: {},
      toast: {},
      achievements: {},
      log: {},
      extra: { anything: true },
    };
    const root = parsePersistedRootState(input);
    expect(root.extra).toEqual({ anything: true });
  });
});

