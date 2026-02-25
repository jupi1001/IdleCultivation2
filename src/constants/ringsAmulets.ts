import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";
import { GEM_IDS } from "./gems";
import type { ForgingIngredient } from "./forging";

const FORGING_ASSETS = "/assets/forging";

/** Ring item IDs (950–959). Forged 950–957, rare 958–959. */
export const RING_IDS = {
  spiritGathering: 950,
  meridianFlow: 951,
  earthRoot: 952,
  jadePulse: 953,
  thunderSpark: 954,
  voidWhisper: 955,
  dragonVein: 956,
  celestialGlow: 957,
  moonlitReflection: 958,
  primordialSeal: 959,
} as const;

/** Amulet item IDs (960–969). Forged 960–965, 968; rare 966, 967, 969. */
export const AMULET_IDS = {
  clearMind: 960,
  guardianTalisman: 961,
  bloodQiPendant: 962,
  starAnchor: 963,
  demonWard: 964,
  heavensBreath: 965,
  eightMeridian: 966,
  spiritHerbCharm: 967,
  voidRefuge: 968,
  transcendentDao: 969,
} as const;

const BAR = {
  copper: 801,
  iron: 802,
  spirit: 803,
  tin: 804,
  jade: 805,
  silver: 806,
  gold: 807,
  thunder: 808,
  obsidian: 809,
  starIron: 810,
  voidstone: 811,
  dragonbone: 812,
  celestial: 813,
};

/** Ring stats by tier (1–8): attackBonus = tier, attackSpeedReduction = tier * 18. */
function ringStats(tier: number): { attackBonus: number; attackSpeedReduction: number } {
  return { attackBonus: tier, attackSpeedReduction: tier * 18 };
}

/** Amulet stats by tier (1–8): defense, vitality, qiGainBonus = tier * 3. */
function amuletStats(tier: number): { defenseBonus: number; vitalityBonus: number; qiGainBonus: number } {
  return { defenseBonus: tier, vitalityBonus: tier, qiGainBonus: tier * 3 };
}

/** Recipe for ring/amulet: bars + optional gems. */
export interface RingAmuletRecipeI {
  id: string;
  name: string;
  description: string;
  tier: string;
  bars: ForgingIngredient[];
  gems?: ForgingIngredient[];
  output: Item & { equipmentSlot: "ring" | "amulet" };
  outputAmount: number;
}

/** All ring and amulet items (for lookup and loot tables). */
export const RING_AMULET_ITEMS: (Item & { equipmentSlot: EquipmentSlot })[] = [
  // Forged rings (tier 1–8)
  { id: RING_IDS.spiritGathering, name: "Spirit Gathering Ring", description: "Copper and Spirit Crystal. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/spirit-gathering-ring.webp`, equipmentSlot: "ring", ...ringStats(1) },
  { id: RING_IDS.meridianFlow, name: "Meridian Flow Ring", description: "Iron and Ruby. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/meridian-flow-ring.webp`, equipmentSlot: "ring", ...ringStats(2) },
  { id: RING_IDS.earthRoot, name: "Earth Root Ring", description: "Spirit Bar and Sapphire. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/earth-root-ring.webp`, equipmentSlot: "ring", ...ringStats(3) },
  { id: RING_IDS.jadePulse, name: "Jade Pulse Ring", description: "Jade Bar and Jade Shard. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/jade-pulse-ring.webp`, equipmentSlot: "ring", ...ringStats(4) },
  { id: RING_IDS.thunderSpark, name: "Thunder Spark Ring", description: "Thunder Crystal Bar and Topaz. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/thunder-spark-ring.webp`, equipmentSlot: "ring", ...ringStats(5) },
  { id: RING_IDS.voidWhisper, name: "Void Whisper Ring", description: "Voidstone Bar and Amethyst. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/void-whisper-ring.webp`, equipmentSlot: "ring", ...ringStats(6) },
  { id: RING_IDS.dragonVein, name: "Dragon Vein Ring", description: "Dragonbone Bar and Onyx. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/dragon-vein-ring.webp`, equipmentSlot: "ring", ...ringStats(7) },
  { id: RING_IDS.celestialGlow, name: "Celestial Glow Ring", description: "Celestial Bar and Sunstone. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/celestial-glow-ring.webp`, equipmentSlot: "ring", ...ringStats(8) },
  // Rare rings (fixed stats)
  { id: RING_IDS.moonlitReflection, name: "Moonlit Reflection Ring", description: "Rare drop from Moonlit Reflection Pool. Attack speed + attack.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/moonlit-reflection-ring.webp`, equipmentSlot: "ring", attackBonus: 4, attackSpeedReduction: 72 },
  { id: RING_IDS.primordialSeal, name: "Primordial Seal Ring", description: "Rare drop from Transcendent Spirit Peak. All-round small bonuses.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/ring/primordial-seal-ring.webp`, equipmentSlot: "ring", attackBonus: 2, defenseBonus: 2, vitalityBonus: 2, attackSpeedReduction: 36 },
  // Forged amulets (tier 1–7 + Void Refuge)
  { id: AMULET_IDS.clearMind, name: "Clear Mind Amulet", description: "Tin Bar and Spirit Crystal. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/clear-mind-amulet.webp`, equipmentSlot: "amulet", ...amuletStats(1) },
  { id: AMULET_IDS.guardianTalisman, name: "Guardian Talisman", description: "Silver Bar and Emerald. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/guardian-talisman.webp`, equipmentSlot: "amulet", ...amuletStats(2) },
  { id: AMULET_IDS.bloodQiPendant, name: "Blood Qi Pendant", description: "Gold Bar and Ruby. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/blood-qi-pendant.webp`, equipmentSlot: "amulet", ...amuletStats(3) },
  { id: AMULET_IDS.starAnchor, name: "Star Anchor Amulet", description: "Star Iron Bar and Moonstone. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/star-anchor-amulet.webp`, equipmentSlot: "amulet", ...amuletStats(4) },
  { id: AMULET_IDS.demonWard, name: "Demon Ward Amulet", description: "Obsidian Bar and Onyx. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/demon-ward-amulet.webp`, equipmentSlot: "amulet", ...amuletStats(5) },
  { id: AMULET_IDS.heavensBreath, name: "Heaven's Breath Amulet", description: "Celestial Bar, Sapphire and Spirit Crystal. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/heavens-breath-amulet.webp`, equipmentSlot: "amulet", ...amuletStats(7) },
  // Rare amulets
  { id: AMULET_IDS.eightMeridian, name: "Eight Meridian Amulet", description: "Rare drop from Heavenly River. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/eight-meridian-amulet.webp`, equipmentSlot: "amulet", defenseBonus: 4, vitalityBonus: 4, qiGainBonus: 12 },
  { id: AMULET_IDS.spiritHerbCharm, name: "Spirit Herb Charm", description: "Rare drop from Primordial Herb Garden. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/spirit-herb-charm.webp`, equipmentSlot: "amulet", defenseBonus: 3, vitalityBonus: 3, qiGainBonus: 9 },
  { id: AMULET_IDS.voidRefuge, name: "Void Refuge Amulet", description: "Voidstone Bar and Amethyst. Qi/s, defense, vitality.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/void-refuge-amulet.webp`, equipmentSlot: "amulet", ...amuletStats(6) },
  { id: AMULET_IDS.transcendentDao, name: "Transcendent Dao Amulet", description: "Rare drop from Primordial Spirit Sea. All-round moderate bonuses.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/amulet/transcendent-dao-amulet.webp`, equipmentSlot: "amulet", defenseBonus: 5, vitalityBonus: 5, qiGainBonus: 15 },
];

export function getRingAmuletItemById(id: number): (Item & { equipmentSlot: EquipmentSlot }) | undefined {
  return RING_AMULET_ITEMS.find((i) => i.id === id);
}

/** Forged ring/amulet recipes (bars + gems). Rare items are drop-only. */
export const RING_AMULET_RECIPES: RingAmuletRecipeI[] = [
  { id: "ring-spirit-gathering", name: "Spirit Gathering Ring", description: "Copper Bar + Spirit Crystal.", tier: "Copper", bars: [{ itemId: BAR.copper, amount: 1 }], gems: [{ itemId: GEM_IDS.spiritCrystal, amount: 1 }], output: RING_AMULET_ITEMS[0] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-meridian-flow", name: "Meridian Flow Ring", description: "Iron Bar + Ruby.", tier: "Iron", bars: [{ itemId: BAR.iron, amount: 1 }], gems: [{ itemId: GEM_IDS.ruby, amount: 1 }], output: RING_AMULET_ITEMS[1] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-earth-root", name: "Earth Root Ring", description: "Spirit Bar + Sapphire.", tier: "Spirit", bars: [{ itemId: BAR.spirit, amount: 1 }], gems: [{ itemId: GEM_IDS.sapphire, amount: 1 }], output: RING_AMULET_ITEMS[2] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-jade-pulse", name: "Jade Pulse Ring", description: "Jade Bar + Jade Shard.", tier: "Jade", bars: [{ itemId: BAR.jade, amount: 1 }], gems: [{ itemId: GEM_IDS.jadeShard, amount: 1 }], output: RING_AMULET_ITEMS[3] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-thunder-spark", name: "Thunder Spark Ring", description: "Thunder Crystal Bar + Topaz.", tier: "Thunder Crystal", bars: [{ itemId: BAR.thunder, amount: 1 }], gems: [{ itemId: GEM_IDS.topaz, amount: 1 }], output: RING_AMULET_ITEMS[4] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-void-whisper", name: "Void Whisper Ring", description: "Voidstone Bar + Amethyst.", tier: "Voidstone", bars: [{ itemId: BAR.voidstone, amount: 1 }], gems: [{ itemId: GEM_IDS.amethyst, amount: 1 }], output: RING_AMULET_ITEMS[5] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-dragon-vein", name: "Dragon Vein Ring", description: "Dragonbone Bar + Onyx.", tier: "Dragonbone", bars: [{ itemId: BAR.dragonbone, amount: 1 }], gems: [{ itemId: GEM_IDS.onyx, amount: 1 }], output: RING_AMULET_ITEMS[6] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "ring-celestial-glow", name: "Celestial Glow Ring", description: "Celestial Bar + Sunstone.", tier: "Celestial", bars: [{ itemId: BAR.celestial, amount: 1 }], gems: [{ itemId: GEM_IDS.sunstone, amount: 1 }], output: RING_AMULET_ITEMS[7] as Item & { equipmentSlot: "ring" }, outputAmount: 1 },
  { id: "amulet-clear-mind", name: "Clear Mind Amulet", description: "Tin Bar + Spirit Crystal.", tier: "Tin", bars: [{ itemId: BAR.tin, amount: 1 }], gems: [{ itemId: GEM_IDS.spiritCrystal, amount: 1 }], output: RING_AMULET_ITEMS[10] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
  { id: "amulet-guardian", name: "Guardian Talisman", description: "Silver Bar + Emerald.", tier: "Silver", bars: [{ itemId: BAR.silver, amount: 1 }], gems: [{ itemId: GEM_IDS.emerald, amount: 1 }], output: RING_AMULET_ITEMS[11] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
  { id: "amulet-blood-qi", name: "Blood Qi Pendant", description: "Gold Bar + Ruby.", tier: "Gold", bars: [{ itemId: BAR.gold, amount: 1 }], gems: [{ itemId: GEM_IDS.ruby, amount: 1 }], output: RING_AMULET_ITEMS[12] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
  { id: "amulet-star-anchor", name: "Star Anchor Amulet", description: "Star Iron Bar + Moonstone.", tier: "Star Iron", bars: [{ itemId: BAR.starIron, amount: 1 }], gems: [{ itemId: GEM_IDS.moonstone, amount: 1 }], output: RING_AMULET_ITEMS[13] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
  { id: "amulet-demon-ward", name: "Demon Ward Amulet", description: "Obsidian Bar + Onyx.", tier: "Obsidian", bars: [{ itemId: BAR.obsidian, amount: 1 }], gems: [{ itemId: GEM_IDS.onyx, amount: 1 }], output: RING_AMULET_ITEMS[14] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
  { id: "amulet-heavens-breath", name: "Heaven's Breath Amulet", description: "Celestial Bar + Sapphire + Spirit Crystal.", tier: "Celestial", bars: [{ itemId: BAR.celestial, amount: 1 }], gems: [{ itemId: GEM_IDS.sapphire, amount: 1 }, { itemId: GEM_IDS.spiritCrystal, amount: 1 }], output: RING_AMULET_ITEMS[15] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
  { id: "amulet-void-refuge", name: "Void Refuge Amulet", description: "Voidstone Bar + Amethyst.", tier: "Voidstone", bars: [{ itemId: BAR.voidstone, amount: 1 }], gems: [{ itemId: GEM_IDS.amethyst, amount: 1 }], output: RING_AMULET_ITEMS[18] as Item & { equipmentSlot: "amulet" }, outputAmount: 1 },
];
