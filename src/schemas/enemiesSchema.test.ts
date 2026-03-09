import { describe, it, expect } from "vitest";
import { CombatArea } from "../enum/CombatArea";
import { parseEnemy } from "./enemies";

describe("enemies schema", () => {
  const baseItem = {
    id: 1,
    name: "Test Item",
    description: "Loot",
    price: 0,
    kind: "material" as const,
  };

  it("accepts a valid enemy with loot", () => {
    const enemy = parseEnemy({
      id: 1,
      name: "Starving Wolf",
      location: CombatArea.FARM,
      attack: 1,
      defense: 1,
      health: 10,
      loot: {
        items: [baseItem],
        weight: [10],
      },
    });
    expect(enemy.name).toBe("Starving Wolf");
    expect(enemy.loot?.items[0].name).toBe("Test Item");
  });

  it("rejects enemies with mismatched loot items/weight arrays", () => {
    expect(() =>
      parseEnemy({
        id: 2,
        name: "Bad Loot Enemy",
        location: CombatArea.CAVE,
        attack: 1,
        defense: 1,
        health: 10,
        loot: {
          items: [baseItem],
          weight: [10, 5],
        },
      }),
    ).toThrow();
  });

  it("rejects enemies with invalid combat area", () => {
    expect(() =>
      parseEnemy({
        id: 3,
        name: "Nowhere Beast",
        // @ts-ignore runtime schema should reject this
        location: "Unknown Area",
        attack: 1,
        defense: 1,
        health: 10,
      }),
    ).toThrow();
  });
});

