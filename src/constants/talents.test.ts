import { describe, it, expect } from "vitest";
import { getTalentBonuses } from "./talents";

describe("getTalentBonuses", () => {
  it("returns zeros when no talents", () => {
    const out = getTalentBonuses({});
    expect(out.attack).toBe(0);
    expect(out.miningYieldPercent).toBe(0);
    expect(out.fishingSpeedPercent).toBe(0);
  });

  it("sums single talent level", () => {
    // Talent 3: Spirit Strike, attack +3 per level
    const out = getTalentBonuses({ 3: 2 });
    expect(out.attack).toBe(6);
  });

  it("sums mining yield talent (Miner's Strength id 20, miningYieldPercent 5 per level)", () => {
    const out = getTalentBonuses({ 20: 3 });
    expect(out.miningYieldPercent).toBe(15);
  });

  it("sums fishing speed talent (Fisher's Patience id 19)", () => {
    const out = getTalentBonuses({ 19: 1 });
    expect(out.fishingSpeedPercent).toBe(5);
  });

  it("includes multiple effect types", () => {
    const out = getTalentBonuses({ 2: 1, 3: 1 }); // Sturdy Body vitality, Spirit Strike attack
    expect(out.vitality).toBe(2);
    expect(out.attack).toBe(3);
  });
});
