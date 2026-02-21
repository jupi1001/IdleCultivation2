export type EquipmentSlot =
  | "sword"
  | "helmet"
  | "body"
  | "shoes"
  | "legs"
  | "ring"
  | "amulet"
  | "qiTechnique"
  | "combatTechnique";

export const EQUIPMENT_SLOT_LABELS: Record<EquipmentSlot, string> = {
  sword: "Sword",
  helmet: "Helmet",
  body: "Body",
  shoes: "Shoes",
  legs: "Legs",
  ring: "Ring",
  amulet: "Amulet",
  qiTechnique: "Qi Technique",
  combatTechnique: "Combat Technique",
};

export const ALL_EQUIPMENT_SLOTS: EquipmentSlot[] = [
  "sword",
  "helmet",
  "body",
  "shoes",
  "legs",
  "ring",
  "amulet",
  "qiTechnique",
  "combatTechnique",
];
