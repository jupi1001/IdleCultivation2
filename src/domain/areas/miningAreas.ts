/**
 * Mining area definitions and MINING_AREAS_BY_ID registry.
 */
import type MiningAreaI from "../../interfaces/MiningAreaI";
import { totalXpForLevel } from "../../constants/miningLevel";

const MINING_ASSETS = "/assets/mining";

export const miningAreaData: MiningAreaI[] = [
  { id: 1, name: "Copper Ore", miningXP: 1, miningXPUnlock: totalXpForLevel(1), miningDelay: 4000, miningLootId: 501, picture: `${MINING_ASSETS}/copper-mine.webp`, altText: "Copper ore vein" },
  { id: 2, name: "Iron Ore", miningXP: 2, miningXPUnlock: totalXpForLevel(5), miningDelay: 5000, miningLootId: 502, picture: `${MINING_ASSETS}/iron-mine.webp`, altText: "Iron ore vein" },
  { id: 3, name: "Spirit Vein", miningXP: 4, miningXPUnlock: totalXpForLevel(10), miningDelay: 6000, miningLootId: 503, picture: `${MINING_ASSETS}/spirit-vein.webp`, altText: "Spirit stone vein" },
  { id: 4, name: "Tin Seam", miningXP: 5, miningXPUnlock: totalXpForLevel(15), miningDelay: 6200, miningLootId: 504, picture: `${MINING_ASSETS}/tin-seam.webp`, altText: "Tin ore seam" },
  { id: 5, name: "Jade Deposit", miningXP: 7, miningXPUnlock: totalXpForLevel(20), miningDelay: 6500, miningLootId: 505, picture: `${MINING_ASSETS}/jade-deposit.webp`, altText: "Jade ore deposit" },
  { id: 6, name: "Silver Lode", miningXP: 9, miningXPUnlock: totalXpForLevel(30), miningDelay: 7000, miningLootId: 506, picture: `${MINING_ASSETS}/silver-lode.webp`, altText: "Silver ore lode" },
  { id: 7, name: "Gold Vein", miningXP: 12, miningXPUnlock: totalXpForLevel(40), miningDelay: 7600, miningLootId: 507, picture: `${MINING_ASSETS}/gold-vein.webp`, altText: "Gold ore vein" },
  { id: 8, name: "Obsidian Ridge", miningXP: 16, miningXPUnlock: totalXpForLevel(50), miningDelay: 8200, miningLootId: 509, picture: `${MINING_ASSETS}/obsidian-ridge.webp`, altText: "Obsidian outcrop" },
  { id: 9, name: "Thunder Crystal Cavern", miningXP: 18, miningXPUnlock: totalXpForLevel(50), miningDelay: 8500, miningLootId: 508, picture: `${MINING_ASSETS}/thunder-cavern.webp`, altText: "Cavern with lightning-charged crystals" },
  { id: 10, name: "Fallen Star Crater", miningXP: 24, miningXPUnlock: totalXpForLevel(60), miningDelay: 9000, miningLootId: 510, picture: `${MINING_ASSETS}/star-crater.webp`, altText: "Meteor crater rich with star iron" },
  { id: 11, name: "Voidstone Quarry", miningXP: 32, miningXPUnlock: totalXpForLevel(70), miningDelay: 9800, miningLootId: 511, picture: `${MINING_ASSETS}/voidstone-quarry.webp`, altText: "Quarry of light-bending voidstone" },
  { id: 12, name: "Dragonbone Strata", miningXP: 42, miningXPUnlock: totalXpForLevel(80), miningDelay: 10500, miningLootId: 512, picture: `${MINING_ASSETS}/dragonbone-strata.webp`, altText: "Ancient strata resembling dragon bones" },
  { id: 13, name: "Celestial Crystal Spire", miningXP: 58, miningXPUnlock: totalXpForLevel(90), miningDelay: 11500, miningLootId: 513, picture: `${MINING_ASSETS}/celestial-spire.webp`, altText: "Spire of radiant celestial crystals" },
  { id: 14, name: "Primordial Spirit Geode", miningXP: 70, miningXPUnlock: totalXpForLevel(95), miningDelay: 12500, miningLootId: 513, picture: `${MINING_ASSETS}/primordial-geode.webp`, altText: "A geode overflowing with condensed heavenly Qi" },
  { id: 15, name: "Ascendant Vein", miningXP: 82, miningXPUnlock: totalXpForLevel(105), miningDelay: 13000, miningLootId: 514, picture: `${MINING_ASSETS}/ascendant-vein.webp`, altText: "Ore that transcends the celestial. Requires reincarnation.", requiresReincarnation: true },
  { id: 16, name: "Karmic Crystal Deposit", miningXP: 92, miningXPUnlock: totalXpForLevel(110), miningDelay: 13500, miningLootId: 515, picture: `${MINING_ASSETS}/karmic-crystal-deposit.webp`, altText: "Crystals that reflect karma. Requires reincarnation.", requiresReincarnation: true },
  { id: 17, name: "Immortal Stone Quarry", miningXP: 102, miningXPUnlock: totalXpForLevel(115), miningDelay: 14000, miningLootId: 516, picture: `${MINING_ASSETS}/immortal-stone-quarry.webp`, altText: "Stone that never erodes. Requires reincarnation.", requiresReincarnation: true },
  { id: 18, name: "Dao Fragment Mine", miningXP: 112, miningXPUnlock: totalXpForLevel(120), miningDelay: 14500, miningLootId: 517, picture: `${MINING_ASSETS}/dao-fragment-mine.webp`, altText: "Fragments of the Dao made solid. Requires reincarnation.", requiresReincarnation: true },
];

export const MINING_AREAS_BY_ID: Record<number, MiningAreaI> = Object.fromEntries(miningAreaData.map((a) => [a.id, a])) as Record<number, MiningAreaI>;
export const MINING_AREA_INDEX_BY_ID: Record<number, number> = Object.fromEntries(miningAreaData.map((a, i) => [a.id, i])) as Record<number, number>;
