/**
 * Ore/mining loot item definitions.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for mining loot item icons (ore in inventory). Add under public/assets/mining/items/ */
const MINING_LOOT_ASSETS = "/assets/mining/items";

export const oreTypes: Item[] = [
  { id: 501, name: "Copper Ore", description: "Common copper ore. Used for basic tools and fittings.", price: 1, quantity: 1, picture: `${MINING_LOOT_ASSETS}/copper-ore.webp`, value: 1, effect: "none" },
  { id: 502, name: "Iron Ore", description: "Reliable iron ore for weapons and armor.", price: 2, quantity: 1, picture: `${MINING_LOOT_ASSETS}/iron-ore.webp`, value: 2, effect: "none" },
  { id: 503, name: "Spirit Stone", description: "A crystalline stone infused with Qi. Used in formations and cultivation.", price: 5, quantity: 1, picture: `${MINING_LOOT_ASSETS}/spirit-stone.webp`, value: 4, effect: "qi" },
  { id: 504, name: "Tin Ore", description: "Soft metal ore used to alloy bronze and reinforce gear.", price: 2, quantity: 1, picture: `${MINING_LOOT_ASSETS}/tin-ore.webp`, value: 2, effect: "none" },
  { id: 505, name: "Jade Ore", description: "Dense jade-like mineral prized for talismans and seals.", price: 6, quantity: 1, picture: `${MINING_LOOT_ASSETS}/jade-ore.webp`, value: 5, effect: "qi" },
  { id: 506, name: "Silver Ore", description: "Conductive metal used in spirit circuits and charms.", price: 8, quantity: 1, picture: `${MINING_LOOT_ASSETS}/silver-ore.webp`, value: 6, effect: "none" },
  { id: 507, name: "Gold Ore", description: "Rare noble metal used for high-grade crafting and tribute.", price: 10, quantity: 1, picture: `${MINING_LOOT_ASSETS}/gold-ore.webp`, value: 7, effect: "none" },
  { id: 508, name: "Thunder Crystal", description: "A crackling crystal that stores lightning Qi.", price: 14, quantity: 1, picture: `${MINING_LOOT_ASSETS}/thunder-crystal.webp`, value: 10, effect: "qi" },
  { id: 509, name: "Obsidian Shard", description: "Volcanic glass used for sharp blades and dark arrays.", price: 12, quantity: 1, picture: `${MINING_LOOT_ASSETS}/obsidian.webp`, value: 9, effect: "none" },
  { id: 510, name: "Star Iron", description: "Meteor-forged iron that holds enchantments unusually well.", price: 18, quantity: 1, picture: `${MINING_LOOT_ASSETS}/star-iron.webp`, value: 12, effect: "vitality" },
  { id: 511, name: "Voidstone", description: "A heavy stone that bends light. Used in spatial storage and rifts.", price: 22, quantity: 1, picture: `${MINING_LOOT_ASSETS}/voidstone.webp`, value: 14, effect: "qi" },
  { id: 512, name: "Dragonbone Ore", description: "A bone-white mineral said to form near dragon veins.", price: 28, quantity: 1, picture: `${MINING_LOOT_ASSETS}/dragonbone-ore.webp`, value: 18, effect: "vitality" },
  { id: 513, name: "Celestial Essence Crystal", description: "Radiant crystal condensed from heavenly Qi. Extremely valuable.", price: 40, quantity: 1, picture: `${MINING_LOOT_ASSETS}/celestial-crystal.webp`, value: 25, effect: "qi" },
  { id: 514, name: "Ascendant Ore", description: "Ore that transcends the celestial. Used to enhance Celestial gear. Requires reincarnation.", price: 55, quantity: 1, picture: `${MINING_LOOT_ASSETS}/ascendant-ore.webp`, value: 30, effect: "none" },
  { id: 515, name: "Karmic Crystal", description: "Crystal that reflects karma. Used to enhance Celestial gear. Requires reincarnation.", price: 62, quantity: 1, picture: `${MINING_LOOT_ASSETS}/karmic-crystal-ore.webp`, value: 34, effect: "qi" },
  { id: 516, name: "Immortal Stone", description: "Stone that never erodes. Used to enhance Celestial gear. Requires reincarnation.", price: 70, quantity: 1, picture: `${MINING_LOOT_ASSETS}/immortal-stone.webp`, value: 38, effect: "none" },
  { id: 517, name: "Dao Fragment", description: "A solid fragment of the Dao. Used to enhance Celestial gear. Requires reincarnation.", price: 80, quantity: 1, picture: `${MINING_LOOT_ASSETS}/dao-fragment.webp`, value: 42, effect: "qi" },
];
