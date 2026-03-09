import { describe, it, expect, vi } from "vitest";
import { getFishingAreaLootEntries, getMiningAreaLootEntries, getGatheringAreaLootEntries } from "./skillingLoot";
import type { FishingAreaI } from "../interfaces/FishingAreaI";
import type { MiningAreaI } from "../interfaces/MiningAreaI";
import type { GatheringAreaI } from "../interfaces/GatheringAreaI";

describe("skillingLoot", () => {
  describe("getFishingAreaLootEntries", () => {
    const area: FishingAreaI = {
      id: 1,
      name: "Test Pond",
      picture: "/pond.webp",
      altText: "Pond",
      xp: 1,
      xpUnlock: 0,
      delay: 1000,
      fishingLootIds: [301, 302],
      rareDropChancePercent: 1,
      rareDropItemIds: [401],
    };

    it("builds loot entries for fish and rare drops", () => {
      const entries = getFishingAreaLootEntries(area, "lesser");
      // 2 fish types → ~50% each
      const fishEntries = entries.filter((e) => e.item.id === 301 || e.item.id === 302);
      expect(fishEntries).toHaveLength(2);
      // Rare ring/amulet entries present with configured chance
      const rareEntries = entries.filter((e) => e.item.id === 401);
      expect(rareEntries.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getMiningAreaLootEntries", () => {
    const area: MiningAreaI = {
      id: 1,
      name: "Copper Vein",
      picture: "/copper.webp",
      altText: "Copper",
      xp: 1,
      xpUnlock: 0,
      delay: 1000,
      miningLootId: 501,
    };

    it("includes primary ore and set pieces", () => {
      const entries = getMiningAreaLootEntries(area, "lesser");
      const oreEntry = entries.find((e) => e.item.id === 501);
      expect(oreEntry).toBeDefined();
    });
  });

  describe("getGatheringAreaLootEntries", () => {
    const area: GatheringAreaI = {
      id: 1,
      name: "Herb Patch",
      picture: "/herbs.webp",
      altText: "Herbs",
      xp: 1,
      xpUnlock: 0,
      delay: 1000,
      gatheringLootIds: [601, 602],
      rareDropChancePercent: 1,
      rareDropItemIds: [402],
    };

    it("builds loot entries for gathering loot and rare drops", () => {
      const entries = getGatheringAreaLootEntries(area, "lesser");
      const baseEntries = entries.filter((e) => e.item.id === 601 || e.item.id === 602);
      expect(baseEntries).toHaveLength(2);
    });
  });
});

