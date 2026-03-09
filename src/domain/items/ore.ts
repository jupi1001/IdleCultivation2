/**
 * Ore/mining loot item definitions.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for mining loot item icons (ore in inventory). Add under public/assets/mining/items/ */
const MINING_LOOT_ASSETS = "/assets/mining/items";

function material(id: number, name: string, desc: string, price: number, picture: string): Item {
  return { kind: "material", id, name, description: desc, price, quantity: 1, picture: `${MINING_LOOT_ASSETS}/${picture}` };
}
function consumable(id: number, name: string, desc: string, price: number, picture: string, effect: { type: "grantQi" | "healVitality"; amount: number }): Item {
  return { kind: "consumable", id, name, description: desc, price, quantity: 1, picture: `${MINING_LOOT_ASSETS}/${picture}`, effect };
}

export const oreTypes: Item[] = [
  material(501, "Copper Ore", "Common copper ore. Used for basic tools and fittings.", 1, "copper-ore.webp"),
  material(502, "Iron Ore", "Reliable iron ore for weapons and armor.", 2, "iron-ore.webp"),
  consumable(503, "Spirit Stone", "A crystalline stone infused with Qi. Used in formations and cultivation.", 5, "spirit-stone.webp", { type: "grantQi", amount: 4 }),
  material(504, "Tin Ore", "Soft metal ore used to alloy bronze and reinforce gear.", 2, "tin-ore.webp"),
  consumable(505, "Jade Ore", "Dense jade-like mineral prized for talismans and seals.", 6, "jade-ore.webp", { type: "grantQi", amount: 5 }),
  material(506, "Silver Ore", "Conductive metal used in spirit circuits and charms.", 8, "silver-ore.webp"),
  material(507, "Gold Ore", "Rare noble metal used for high-grade crafting and tribute.", 10, "gold-ore.webp"),
  consumable(508, "Thunder Crystal", "A crackling crystal that stores lightning Qi.", 14, "thunder-crystal.webp", { type: "grantQi", amount: 10 }),
  material(509, "Obsidian Shard", "Volcanic glass used for sharp blades and dark arrays.", 12, "obsidian.webp"),
  consumable(510, "Star Iron", "Meteor-forged iron that holds enchantments unusually well.", 18, "star-iron.webp", { type: "healVitality", amount: 12 }),
  consumable(511, "Voidstone", "A heavy stone that bends light. Used in spatial storage and rifts.", 22, "voidstone.webp", { type: "grantQi", amount: 14 }),
  consumable(512, "Dragonbone Ore", "A bone-white mineral said to form near dragon veins.", 28, "dragonbone-ore.webp", { type: "healVitality", amount: 18 }),
  consumable(513, "Celestial Essence Crystal", "Radiant crystal condensed from heavenly Qi. Extremely valuable.", 40, "celestial-crystal.webp", { type: "grantQi", amount: 25 }),
  material(514, "Ascendant Ore", "Ore that transcends the celestial. Used to enhance Celestial gear. Requires reincarnation.", 55, "ascendant-ore.webp"),
  consumable(515, "Karmic Crystal", "Crystal that reflects karma. Used to enhance Celestial gear. Requires reincarnation.", 62, "karmic-crystal-ore.webp", { type: "grantQi", amount: 34 }),
  material(516, "Immortal Stone", "Stone that never erodes. Used to enhance Celestial gear. Requires reincarnation.", 70, "immortal-stone.webp"),
  consumable(517, "Dao Fragment", "A solid fragment of the Dao. Used to enhance Celestial gear. Requires reincarnation.", 80, "dao-fragment.webp", { type: "grantQi", amount: 42 }),
];
