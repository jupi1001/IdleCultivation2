import { describe, it, expect, vi } from "vitest";
import { rollOneTimeDrop, rollOneTimeDropFromTable, type OneTimeDropEntry } from "./oneTimeDrops";

const makeItemById = (ids: number[]) => {
  return (id: number) => (ids.includes(id) ? { id, name: `Item ${id}`, description: "", price: 0, kind: "material" } as any : undefined);
};

describe("oneTimeDrops", () => {
  describe("rollOneTimeDrop", () => {
    it("returns null when chancePercent fails", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9);
      const result = rollOneTimeDrop(new Set(), [1, 2], 10, makeItemById([1, 2]));
      expect(result).toBeNull();
      vi.mocked(Math.random).mockRestore();
    });

    it("skips owned items and returns an unowned item", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.0);
      const owned = new Set<number>([1]);
      const result = rollOneTimeDrop(owned, [1, 2], 100, makeItemById([1, 2]));
      expect(result).not.toBeNull();
      expect(result!.id).toBe(2);
      vi.mocked(Math.random).mockRestore();
    });
  });

  describe("rollOneTimeDropFromTable", () => {
    it("returns null when all items are owned or rolls fail", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9);
      const drops: OneTimeDropEntry[] = [
        { itemId: 1, chance: 0.5 },
        { itemId: 2, chance: 0.5 },
      ];
      const result = rollOneTimeDropFromTable(new Set([1, 2]), drops, makeItemById([1, 2]));
      expect(result).toBeNull();
      vi.mocked(Math.random).mockRestore();
    });

    it("returns the first successful drop for an unowned item", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.1);
      const drops: OneTimeDropEntry[] = [
        { itemId: 1, chance: 0.5 },
        { itemId: 2, chance: 0.5 },
      ];
      const result = rollOneTimeDropFromTable(new Set(), drops, makeItemById([1, 2]));
      expect(result).not.toBeNull();
      expect(result!.id).toBe(1);
      vi.mocked(Math.random).mockRestore();
    });
  });
});

