/**
 * Mining area definitions and MINING_AREAS_BY_ID registry.
 */
import type MiningAreaI from "../../interfaces/MiningAreaI";
import { totalXpForLevel } from "../../constants/miningLevel";
import { parseMiningAreas } from "../../schemas/areas";

const MINING_ASSETS = "/assets/mining";

export const miningAreaData: MiningAreaI[] = [
  { id: 1, name: "Copper Ore", xp: 1, xpUnlock: totalXpForLevel(1), delay: 4000, miningLootId: 501, picture: `${MINING_ASSETS}/copper-mine.webp`, altText: "Copper ore vein" },
  { id: 2, name: "Iron Ore", xp: 2, xpUnlock: totalXpForLevel(5), delay: 5000, miningLootId: 502, picture: `${MINING_ASSETS}/iron-mine.webp`, altText: "Iron ore vein" },
  { id: 3, name: "Spirit Vein", xp: 4, xpUnlock: totalXpForLevel(10), delay: 6000, miningLootId: 503, picture: `${MINING_ASSETS}/spirit-vein.webp`, altText: "Spirit stone vein" },
  { id: 4, name: "Tin Seam", xp: 5, xpUnlock: totalXpForLevel(15), delay: 6200, miningLootId: 504, picture: `${MINING_ASSETS}/tin-seam.webp`, altText: "Tin ore seam" },
  { id: 5, name: "Jade Deposit", xp: 7, xpUnlock: totalXpForLevel(20), delay: 6500, miningLootId: 505, picture: `${MINING_ASSETS}/jade-deposit.webp`, altText: "Jade ore deposit" },
  { id: 6, name: "Silver Lode", xp: 9, xpUnlock: totalXpForLevel(30), delay: 7000, miningLootId: 506, picture: `${MINING_ASSETS}/silver-lode.webp`, altText: "Silver ore lode" },
  { id: 7, name: "Gold Vein", xp: 12, xpUnlock: totalXpForLevel(40), delay: 7600, miningLootId: 507, picture: `${MINING_ASSETS}/gold-vein.webp`, altText: "Gold ore vein" },
  { id: 8, name: "Obsidian Ridge", xp: 16, xpUnlock: totalXpForLevel(50), delay: 8200, miningLootId: 509, picture: `${MINING_ASSETS}/obsidian-ridge.webp`, altText: "Obsidian outcrop" },
  { id: 9, name: "Thunder Crystal Cavern", xp: 18, xpUnlock: totalXpForLevel(50), delay: 8500, miningLootId: 508, picture: `${MINING_ASSETS}/thunder-cavern.webp`, altText: "Cavern with lightning-charged crystals" },
  { id: 10, name: "Fallen Star Crater", xp: 24, xpUnlock: totalXpForLevel(60), delay: 9000, miningLootId: 510, picture: `${MINING_ASSETS}/star-crater.webp`, altText: "Meteor crater rich with star iron" },
  { id: 11, name: "Voidstone Quarry", xp: 32, xpUnlock: totalXpForLevel(70), delay: 9800, miningLootId: 511, picture: `${MINING_ASSETS}/voidstone-quarry.webp`, altText: "Quarry of light-bending voidstone" },
  { id: 12, name: "Dragonbone Strata", xp: 42, xpUnlock: totalXpForLevel(80), delay: 10500, miningLootId: 512, picture: `${MINING_ASSETS}/dragonbone-strata.webp`, altText: "Ancient strata resembling dragon bones" },
  { id: 13, name: "Celestial Crystal Spire", xp: 58, xpUnlock: totalXpForLevel(90), delay: 11500, miningLootId: 513, picture: `${MINING_ASSETS}/celestial-spire.webp`, altText: "Spire of radiant celestial crystals" },
  { id: 14, name: "Primordial Spirit Geode", xp: 70, xpUnlock: totalXpForLevel(95), delay: 12500, miningLootId: 513, picture: `${MINING_ASSETS}/primordial-geode.webp`, altText: "A geode overflowing with condensed heavenly Qi" },
  { id: 15, name: "Ascendant Vein", xp: 82, xpUnlock: totalXpForLevel(105), delay: 13000, miningLootId: 514, picture: `${MINING_ASSETS}/ascendant-vein.webp`, altText: "Ore that transcends the celestial. Requires reincarnation.", requiresReincarnation: true },
  { id: 16, name: "Karmic Crystal Deposit", xp: 92, xpUnlock: totalXpForLevel(110), delay: 13500, miningLootId: 515, picture: `${MINING_ASSETS}/karmic-crystal-deposit.webp`, altText: "Crystals that reflect karma. Requires reincarnation.", requiresReincarnation: true },
  { id: 17, name: "Immortal Stone Quarry", xp: 102, xpUnlock: totalXpForLevel(115), delay: 14000, miningLootId: 516, picture: `${MINING_ASSETS}/immortal-stone-quarry.webp`, altText: "Stone that never erodes. Requires reincarnation.", requiresReincarnation: true },
  { id: 18, name: "Dao Fragment Mine", xp: 112, xpUnlock: totalXpForLevel(120), delay: 14500, miningLootId: 517, picture: `${MINING_ASSETS}/dao-fragment-mine.webp`, altText: "Fragments of the Dao made solid. Requires reincarnation.", requiresReincarnation: true },
];

// Dev/test-only: validate mining area definitions.
if (process.env.NODE_ENV !== "production") {
  parseMiningAreas(miningAreaData);
}

export const MINING_AREAS_BY_ID: Record<number, MiningAreaI> = Object.fromEntries(miningAreaData.map((a) => [a.id, a])) as Record<number, MiningAreaI>;
export const MINING_AREA_INDEX_BY_ID: Record<number, number> = Object.fromEntries(miningAreaData.map((a, i) => [a.id, i])) as Record<number, number>;
