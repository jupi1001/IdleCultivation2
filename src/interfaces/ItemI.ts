import type { EquipmentSlot } from "../types/EquipmentSlot";

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  picture?: string;
  value?: number;
  effect?: string;
  /** Equipment slot this item can be equipped in */
  equipmentSlot?: EquipmentSlot;
  /** Qi gain per second when equipped in qiTechnique slot */
  qiGainBonus?: number;
  /** Attack bonus when equipped (e.g. sword) */
  attackBonus?: number;
  /** Defense bonus when equipped (e.g. helmet, body) */
  defenseBonus?: number;
  /** Vitality (max health) bonus when equipped (e.g. helmet, body) */
  vitalityBonus?: number;
  /** Combat technique: multiplicative attack modifier (e.g. 1.1 = +10% damage) */
  attackMultiplier?: number;
  /** Combat technique: flat attack speed bonus in ms (reduces time between attacks) */
  attackSpeedReduction?: number;
  /** Skilling set: which skill this piece boosts (fishing / mining / gathering) */
  skillSet?: "fishing" | "mining" | "gathering";
  /** Skilling set tier: lesser / greater / perfected (better tier = better per-piece and set bonus) */
  skillSetTier?: "lesser" | "greater" | "perfected";
  /** Skilling set: percent faster for that skill per piece (e.g. 2 = +2% speed) */
  skillSpeedBonus?: number;
}

export default Item;
