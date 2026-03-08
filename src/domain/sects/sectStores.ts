/**
 * Sect store inventory and raid loot. requiredRankIndex: 0=Sect Aspirant, 1=Outer, 2=Inner, 3=Core.
 */
import type Item from "../../interfaces/ItemI";
import { ALCHEMY_ASSETS } from "../../constants/alchemy";
import { QI_TECHNIQUES, COMBAT_TECHNIQUES } from "../items/techniques";

/** One entry in a sect's store: item and minimum rank (0=Outer, 1=Inner, 2=Core) required to see/buy. */
export interface SectStoreEntryI {
  item: Item;
  requiredRankIndex: number;
}

/** Sect store by sect id. */
export const sectStoreData: Record<number, SectStoreEntryI[]> = {
  1: [
    { item: { id: 600, name: "Jade Mountain Sword Manual", description: "Basic sword form. Unlocks sect combat technique.", price: 150, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.15 }, requiredRankIndex: 1 },
    { item: { id: 601, name: "Mountain Heart Pill", description: "Sect pill for qi refinement.", price: 80, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, value: 5, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 602, name: "Inner Gate Qi Circulation", description: "Inner disciple technique. +0.35 Qi/s when meditating.", price: 400, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.35 }, requiredRankIndex: 2 },
    { item: { id: 603, name: "Jade Severance Recipe", description: "Alchemy recipe: Jade Severance Pill. Unlocks in Alchemy when learned.", price: 600, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 3 },
    { item: QI_TECHNIQUES[1], requiredRankIndex: 1 },
    { item: QI_TECHNIQUES[2], requiredRankIndex: 2 },
    { item: COMBAT_TECHNIQUES[1], requiredRankIndex: 1 },
    { item: COMBAT_TECHNIQUES[2], requiredRankIndex: 2 },
  ],
  2: [
    { item: { id: 610, name: "Valley Healing Herbs", description: "Herbs used in healing and pill recipes.", price: 60, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 1 },
    { item: { id: 611, name: "Verdant Qi Method", description: "Valley qi technique. +0.25 Qi/s when meditating.", price: 300, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.25 }, requiredRankIndex: 1 },
    { item: { id: 612, name: "Valley Restoration Recipe", description: "Alchemy recipe: restoration pill. Requires Inner Disciple.", price: 500, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 2 },
    { item: { id: 613, name: "Elder's Meditation Scroll", description: "Core disciple only. +0.5 Qi/s when meditating.", price: 800, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.5 }, requiredRankIndex: 3 },
    { item: QI_TECHNIQUES[3], requiredRankIndex: 1 },
    { item: QI_TECHNIQUES[4], requiredRankIndex: 2 },
    { item: COMBAT_TECHNIQUES[3], requiredRankIndex: 1 },
    { item: COMBAT_TECHNIQUES[4], requiredRankIndex: 2 },
  ],
  3: [
    { item: { id: 620, name: "Sky Pavilion Qi Primer", description: "Basic qi refinement manual.", price: 200, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.2 }, requiredRankIndex: 1 },
    { item: { id: 621, name: "Azure Condensation Pill", description: "Pill that aids qi condensation.", price: 120, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, value: 8, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 622, name: "High Peak Technique", description: "Inner disciple technique. +0.4 Qi/s when meditating.", price: 550, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.4 }, requiredRankIndex: 2 },
    { item: { id: 623, name: "Pavilion Core Manual", description: "Core disciple combat and qi manual. Requires Core Disciple.", price: 1000, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 3 },
    { item: QI_TECHNIQUES[5], requiredRankIndex: 1 },
    { item: QI_TECHNIQUES[6], requiredRankIndex: 2 },
    { item: COMBAT_TECHNIQUES[5], requiredRankIndex: 1 },
    { item: COMBAT_TECHNIQUES[6], requiredRankIndex: 2 },
  ],
  4: [
    { item: { id: 630, name: "Crimson Demon Strike", description: "Basic demonic combat technique.", price: 180, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 1 },
    { item: { id: 631, name: "Blood Qi Pill", description: "Demonic qi pill.", price: 90, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, value: 6, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 632, name: "Inner Demon Circulation", description: "Inner disciple. +0.35 Qi/s when meditating.", price: 450, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.35 }, requiredRankIndex: 2 },
    { item: { id: 633, name: "Core Demon Art", description: "Forbidden technique. Core Disciple only.", price: 900, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.55 }, requiredRankIndex: 3 },
    { item: QI_TECHNIQUES[7], requiredRankIndex: 1 },
    { item: QI_TECHNIQUES[8], requiredRankIndex: 2 },
    { item: COMBAT_TECHNIQUES[7], requiredRankIndex: 1 },
    { item: COMBAT_TECHNIQUES[8], requiredRankIndex: 2 },
  ],
  5: [
    { item: { id: 640, name: "Serpent Venom Recipe", description: "Basic poison recipe.", price: 100, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 1 },
    { item: { id: 641, name: "Shadow Step", description: "Assassin qi technique. +0.3 Qi/s when meditating.", price: 350, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.3 }, requiredRankIndex: 1 },
    { item: { id: 642, name: "Inner Serpent Formula", description: "Poison formula. Requires Inner Disciple.", price: 480, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 2 },
    { item: { id: 643, name: "Shadow Serpent Core Manual", description: "Core disciple manual. Requires Core Disciple.", price: 850, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 3 },
    { item: QI_TECHNIQUES[9], requiredRankIndex: 1 },
    { item: QI_TECHNIQUES[10], requiredRankIndex: 2 },
    { item: COMBAT_TECHNIQUES[9], requiredRankIndex: 1 },
    { item: COMBAT_TECHNIQUES[10], requiredRankIndex: 2 },
  ],
  6: [
    { item: { id: 650, name: "Bone Refinement Pill", description: "Sect pill for bone tempering.", price: 110, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, value: 7, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 651, name: "Abyss Qi Draw", description: "Basic abyss technique. +0.28 Qi/s when meditating.", price: 320, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.28 }, requiredRankIndex: 1 },
    { item: { id: 652, name: "Undead Cultivation Fragment", description: "Inner disciple fragment. Requires Inner Disciple.", price: 520, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp` }, requiredRankIndex: 2 },
    { item: { id: 653, name: "Bone Abyss Core Scripture", description: "Core disciple forbidden scripture. Requires Core Disciple.", price: 950, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.52 }, requiredRankIndex: 3 },
    { item: QI_TECHNIQUES[11], requiredRankIndex: 1 },
    { item: QI_TECHNIQUES[12], requiredRankIndex: 2 },
    { item: COMBAT_TECHNIQUES[11], requiredRankIndex: 1 },
    { item: COMBAT_TECHNIQUES[12], requiredRankIndex: 2 },
  ],
};

/** Rank-aware sect raid loot. For a given sect id and raider sect rank, return items and weights. */
export function getSectRaidLootForRank(sectId: number, sectRankIndex: number): { items: Item[]; weight: number[] } | null {
  const entries = sectStoreData[sectId];
  if (!entries || sectRankIndex <= 0) return null;
  const eligible = entries.filter((e) => e.requiredRankIndex <= sectRankIndex);
  if (eligible.length === 0) return null;
  const items = eligible.map((e) => e.item);
  const weight = eligible.map(() => 1);
  return { items, weight };
}

/** Flatten all unique items from sect stores for ITEMS_BY_ID registry. */
export function getSectStoreItemsFlat(): Item[] {
  const seen = new Set<number>();
  const out: Item[] = [];
  for (const entries of Object.values(sectStoreData)) {
    for (const e of entries) {
      if (!seen.has(e.item.id)) {
        seen.add(e.item.id);
        out.push(e.item);
      }
    }
  }
  return out;
}
