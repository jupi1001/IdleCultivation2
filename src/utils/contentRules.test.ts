import { describe, it, expect } from "vitest";
import { canEnterCombatArea, getCombatAreaRealmRequirement, isSkillAreaUnlocked } from "./contentRules";
import { CombatArea } from "../enum/CombatArea";

describe("contentRules", () => {
  describe("canEnterCombatArea & getCombatAreaRealmRequirement", () => {
    it("uses AREA_REALM_REQUIREMENTS to gate combat areas by realm step", () => {
      const req = getCombatAreaRealmRequirement(CombatArea.CAVE)!;
      expect(req.realmId).toBe("Qi Condensation");

      // Mortal cannot enter CAVE
      expect(canEnterCombatArea("Mortal", 0, CombatArea.CAVE)).toBe(false);
      // Qi Condensation 1 can
      expect(canEnterCombatArea("Qi Condensation", 1, CombatArea.CAVE)).toBe(true);
    });
  });

  describe("isSkillAreaUnlocked", () => {
    const baseArea = {
      id: 1,
      name: "Test",
      picture: "/a.webp",
      altText: "A",
      xp: 1,
      xpUnlock: 10,
      delay: 1000,
    };

    it("requires both xp and reincarnation when gated", () => {
      const gatedArea = { ...baseArea, requiresReincarnation: true };

      // Not enough xp, no reincarnation
      expect(isSkillAreaUnlocked(gatedArea, 0, 0)).toBe(false);
      // Enough xp but no reincarnation
      expect(isSkillAreaUnlocked(gatedArea, 10, 0)).toBe(false);
      // Enough xp and reincarnation
      expect(isSkillAreaUnlocked(gatedArea, 10, 1)).toBe(true);
    });

    it("ignores reincarnation gating when requiresReincarnation is false", () => {
      const openArea = { ...baseArea, requiresReincarnation: false };
      expect(isSkillAreaUnlocked(openArea, 10, 0)).toBe(true);
    });
  });
});

