import { describe, it, expect } from "vitest";
import {
  getConsumableEffect,
  hasConsumableEffect,
  type ConsumableItem,
  type EquipmentItem,
  type MaterialItem,
  type Item,
} from "./items";

describe("items domain helpers", () => {
  const base = {
    id: 1,
    name: "Test",
    description: "Item",
    price: 0,
  };

  it("getConsumableEffect returns effect for consumable and null for non-consumables", () => {
    const pill: ConsumableItem = {
      ...base,
      kind: "consumable",
      effect: { type: "grantQi", amount: 10 },
    };
    const sword: EquipmentItem = { ...base, kind: "equipment", equipmentSlot: "sword" };
    const herb: MaterialItem = { ...base, kind: "material" };

    const pillEffect = getConsumableEffect(pill as Item);
    expect(pillEffect).not.toBeNull();
    expect(pillEffect!.type).toBe("grantQi");

    expect(getConsumableEffect(sword as Item)).toBeNull();
    expect(getConsumableEffect(herb as Item)).toBeNull();
  });

  it("hasConsumableEffect is true only for consumables", () => {
    const pill: ConsumableItem = {
      ...base,
      kind: "consumable",
      effect: { type: "healVitality", amount: 5 },
    };
    const sword: EquipmentItem = { ...base, kind: "equipment", equipmentSlot: "sword" };

    expect(hasConsumableEffect(pill as Item)).toBe(true);
    expect(hasConsumableEffect(sword as Item)).toBe(false);
  });
});

