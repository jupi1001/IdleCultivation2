import { describe, it, expect, vi } from "vitest";
import { getResolvedLootTable, rollOneDrop } from "./combatLoot";
import type EnemyI from "../interfaces/EnemyI";
import type { SectLootContext } from "../types/combatTypes";
import { CombatArea } from "../enum/CombatArea";

import type Item from "../interfaces/ItemI";
import type { ResolvedLootTable } from "../types/combatTypes";

describe("combatLoot", () => {
  describe("getResolvedLootTable", () => {
    const enemyWithLoot: EnemyI = {
      id: 1,
      name: "Test Enemy",
      location: CombatArea.FARM,
      attack: 5,
      defense: 2,
      health: 20,
      picture: "",
      loot: {
        items: [
          { id: 101, name: "Drop A", description: "", quantity: 1, price: 0, equipmentSlot: undefined },
          { id: 102, name: "Drop B", description: "", quantity: 1, price: 0, equipmentSlot: undefined },
        ] as Item[],
        weight: [1, 2],
      },
    };

    it("returns null when enemy has no loot", () => {
      const enemyNoLoot = { ...enemyWithLoot, loot: undefined };
      expect(getResolvedLootTable(enemyNoLoot, { area: undefined, currentSectId: null, path: null, sectRankIndex: 0 })).toBeNull();
    });

    it("returns enemy loot when area is not a sect raid", () => {
      const ctx: SectLootContext = { area: "Farm", currentSectId: 1, path: "Righteous", sectRankIndex: 1 };
      const table = getResolvedLootTable(enemyWithLoot, ctx);
      expect(table).not.toBeNull();
      expect(table!.items).toHaveLength(2);
      expect(table!.weight).toEqual([1, 2]);
    });

    it("returns null when items and weight length mismatch", () => {
      const badLoot = {
        items: [{ id: 1, name: "X", description: "", quantity: 1, price: 0 }] as Item[],
        weight: [1, 2],
      };
      const enemy = { ...enemyWithLoot, loot: badLoot };
      expect(getResolvedLootTable(enemy, { area: undefined, currentSectId: null, path: null, sectRankIndex: 0 })).toBeNull();
    });

    it("returns null when items array is empty", () => {
      const enemy = { ...enemyWithLoot, loot: { items: [], weight: [] } };
      expect(getResolvedLootTable(enemy, { area: undefined, currentSectId: null, path: null, sectRankIndex: 0 })).toBeNull();
    });
  });

  describe("rollOneDrop", () => {
    const table: ResolvedLootTable = {
      items: [
        { id: 201, name: "A", description: "", quantity: 1, price: 0, equipmentSlot: undefined },
        { id: 202, name: "B", description: "", quantity: 1, price: 0, equipmentSlot: "qiTechnique" },
      ],
      weight: [1, 1],
    };

    it("returns null for null table", () => {
      expect(rollOneDrop(null, new Set())).toBeNull();
    });

    it("returns null for empty table", () => {
      expect(rollOneDrop({ items: [], weight: [] }, new Set())).toBeNull();
    });

    it("returns an item from the table when roll falls in range", () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const result = rollOneDrop(table, new Set());
      expect(result).not.toBeNull();
      expect(table.items).toContainEqual(result);
      vi.mocked(Math.random).mockRestore();
    });

    it("returns null when rolled item is a technique already owned", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.6);
      const result = rollOneDrop(table, new Set([202]));
      expect(result).toBeNull();
      vi.mocked(Math.random).mockRestore();
    });

    it("returns technique when not owned", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.6);
      const result = rollOneDrop(table, new Set());
      expect(result).not.toBeNull();
      expect(result!.id).toBe(202);
      vi.mocked(Math.random).mockRestore();
    });
  });
});
