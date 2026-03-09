import { describe, it, expect } from "vitest";
import {
  isConsumableItem,
  isEquipmentItem,
  isTechniqueItem,
  isSetPieceItem,
  hasEquipmentSlot,
  getEquipmentSlot,
} from "./itemGuards";
import type { ConsumableItem, EquipmentItem, TechniqueItem, SetPieceItem, MaterialItem } from "./items";

const baseFields = {
  id: 1,
  name: "Test",
  description: "Desc",
  price: 0,
};

describe("itemGuards", () => {
  describe("isConsumableItem", () => {
    it("returns true for consumable item", () => {
      const item: ConsumableItem = { ...baseFields, kind: "consumable", effect: { type: "healVitality", amount: 10 } };
      expect(isConsumableItem(item)).toBe(true);
    });
    it("returns false for equipment item", () => {
      const item: EquipmentItem = { ...baseFields, kind: "equipment", equipmentSlot: "sword" };
      expect(isConsumableItem(item)).toBe(false);
    });
    it("returns false for material item", () => {
      const item: MaterialItem = { ...baseFields, kind: "material" };
      expect(isConsumableItem(item)).toBe(false);
    });
  });

  describe("isEquipmentItem", () => {
    it("returns true for equipment item", () => {
      const item: EquipmentItem = { ...baseFields, kind: "equipment", equipmentSlot: "helmet" };
      expect(isEquipmentItem(item)).toBe(true);
    });
    it("returns true for setPiece item", () => {
      const item: SetPieceItem = {
        ...baseFields,
        kind: "setPiece",
        equipmentSlot: "ring",
        skillSet: "fishing",
        skillSetTier: "lesser",
      };
      expect(isEquipmentItem(item)).toBe(true);
    });
    it("returns false for consumable item", () => {
      const item: ConsumableItem = { ...baseFields, kind: "consumable", effect: { type: "grantQi", amount: 5 } };
      expect(isEquipmentItem(item)).toBe(false);
    });
  });

  describe("isTechniqueItem", () => {
    it("returns true for technique item", () => {
      const item: TechniqueItem = { ...baseFields, kind: "technique", equipmentSlot: "qiTechnique" };
      expect(isTechniqueItem(item)).toBe(true);
    });
    it("returns false for equipment item", () => {
      const item: EquipmentItem = { ...baseFields, kind: "equipment", equipmentSlot: "sword" };
      expect(isTechniqueItem(item)).toBe(false);
    });
  });

  describe("isSetPieceItem", () => {
    it("returns true for setPiece item", () => {
      const item: SetPieceItem = {
        ...baseFields,
        kind: "setPiece",
        equipmentSlot: "body",
        skillSet: "mining",
        skillSetTier: "greater",
      };
      expect(isSetPieceItem(item)).toBe(true);
    });
    it("returns false for equipment item", () => {
      const item: EquipmentItem = { ...baseFields, kind: "equipment", equipmentSlot: "body" };
      expect(isSetPieceItem(item)).toBe(false);
    });
  });

  describe("hasEquipmentSlot", () => {
    it("returns true for equipment item", () => {
      const item: EquipmentItem = { ...baseFields, kind: "equipment", equipmentSlot: "ring" };
      expect(hasEquipmentSlot(item)).toBe(true);
    });
    it("returns true for technique item", () => {
      const item: TechniqueItem = { ...baseFields, kind: "technique", equipmentSlot: "combatTechnique" };
      expect(hasEquipmentSlot(item)).toBe(true);
    });
    it("returns false for consumable item", () => {
      const item: ConsumableItem = { ...baseFields, kind: "consumable", effect: { type: "grantAttack", amount: 1 } };
      expect(hasEquipmentSlot(item)).toBe(false);
    });
  });

  describe("getEquipmentSlot", () => {
    it("returns slot for equipment item", () => {
      const item: EquipmentItem = { ...baseFields, kind: "equipment", equipmentSlot: "amulet" };
      expect(getEquipmentSlot(item)).toBe("amulet");
    });
    it("returns undefined for consumable item", () => {
      const item: ConsumableItem = { ...baseFields, kind: "consumable", effect: { type: "grantDefense", amount: 1 } };
      expect(getEquipmentSlot(item)).toBeUndefined();
    });
  });
});
