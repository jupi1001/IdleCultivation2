/**
 * Wood item definitions for gathering skill loot tables.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for gathering loot item icons (wood, herbs in inventory). Add under public/assets/gathering/items/ */
const GATHERING_ITEMS = "/assets/gathering/items";

export const woodTypes: Item[] = [
  { id: 601, name: "Oak Wood", description: "Common oak. Used for weapons and to light the alchemy forge.", price: 2, quantity: 1, picture: `${GATHERING_ITEMS}/item-oak-wood.webp`, value: 0 },
  { id: 602, name: "Iron Bamboo", description: "Hard bamboo favoured by cultivators. Used in forging and cooking fires.", price: 5, quantity: 1, picture: `${GATHERING_ITEMS}/item-iron-bamboo.webp`, value: 0 },
  { id: 603, name: "Spirit Cypress Wood", description: "Wood touched by Qi. Used for spirit weapons and high-grade alchemy.", price: 12, quantity: 1, picture: `${GATHERING_ITEMS}/item-spirit-cypress.webp`, value: 0 },
  { id: 604, name: "Pine Wood", description: "Resinous pine. Burns long; used in alchemy and campfires.", price: 4, quantity: 1, picture: `${GATHERING_ITEMS}/item-pine-wood.webp`, value: 0 },
  { id: 605, name: "Ebony Wood", description: "Dense dark wood. Used for high-grade crafting and arrays.", price: 14, quantity: 1, picture: `${GATHERING_ITEMS}/item-ebony-wood.webp`, value: 0 },
  { id: 606, name: "Void Willow", description: "Willow that grows near rifts. Used in spatial and void arrays.", price: 20, quantity: 1, picture: `${GATHERING_ITEMS}/item-void-willow.webp`, value: 0 },
  { id: 607, name: "Dragon Ash Wood", description: "Ashen wood from dragon territories. Used in top-tier forging.", price: 26, quantity: 1, picture: `${GATHERING_ITEMS}/item-dragon-ash-wood.webp`, value: 0 },
  { id: 608, name: "Celestial Bamboo", description: "Bamboo infused with heavenly Qi. Used in transcendent alchemy.", price: 35, quantity: 1, picture: `${GATHERING_ITEMS}/item-celestial-bamboo.webp`, value: 0 },
  { id: 609, name: "Ascendant Wood", description: "Wood that transcends the celestial. Used in high alchemy. Requires reincarnation.", price: 48, quantity: 1, picture: `${GATHERING_ITEMS}/item-ascendant-wood.webp`, value: 0 },
  { id: 610, name: "Karmic Willow", description: "Willow that reflects karma. Used in alchemy. Requires reincarnation.", price: 54, quantity: 1, picture: `${GATHERING_ITEMS}/item-karmic-willow.webp`, value: 0 },
];
