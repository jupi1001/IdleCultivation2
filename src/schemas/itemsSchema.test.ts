import { describe, it, expect } from "vitest";
import { parseItem, parseItems } from "./items";

describe("items schema", () => {
  const base = {
    id: 1,
    name: "Test",
    description: "Test item",
    price: 0,
  };

  it("accepts a valid consumable item", () => {
    const item = parseItem({
      ...base,
      kind: "consumable",
      effect: { type: "healVitality", amount: 10 },
    });
    expect(item.kind).toBe("consumable");
  });

  it("accepts a valid equipment item with non-technique slot", () => {
    const item = parseItem({
      ...base,
      kind: "equipment",
      equipmentSlot: "sword",
      attackBonus: 5,
    });
    expect(item.kind).toBe("equipment");
  });

  it("rejects equipment items that use technique slots", () => {
    expect(() =>
      parseItem({
        ...base,
        kind: "equipment",
        equipmentSlot: "qiTechnique",
      }),
    ).toThrow();
  });

  it("accepts a valid technique item", () => {
    const item = parseItem({
      ...base,
      kind: "technique",
      equipmentSlot: "qiTechnique",
      qiGainBonus: 1,
    });
    expect(item.kind).toBe("technique");
  });

  it("rejects consumable items with invalid effect type", () => {
    expect(() =>
      parseItem({
        ...base,
        kind: "consumable",
        // @ts-expect-error runtime schema should reject this
        effect: { type: "unknownEffect", amount: 1 },
      }),
    ).toThrow();
  });

  it("accepts arrays of mixed valid items via parseItems", () => {
    const items = parseItems([
      {
        ...base,
        id: 1,
        kind: "consumable",
        effect: { type: "grantQi", amount: 5 },
      },
      {
        ...base,
        id: 2,
        kind: "material",
      },
    ]);
    expect(items).toHaveLength(2);
    expect(items[0].kind).toBe("consumable");
    expect(items[1].kind).toBe("material");
  });
});

