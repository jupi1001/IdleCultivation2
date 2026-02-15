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
}

export default Item;
