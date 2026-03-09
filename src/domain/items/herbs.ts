/**
 * Herb item definitions for gathering skill loot tables.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for gathering loot item icons. Add under public/assets/gathering/items/ */
const GATHERING_ITEMS = "/assets/gathering/items";

export const herbTypes: Item[] = [
  { kind: "material", id: 611, name: "Common Herb", description: "A basic herb. Used in pills and alchemy.", price: 1, quantity: 1, picture: `${GATHERING_ITEMS}/item-common-herb.webp` },
  { kind: "material", id: 612, name: "Spirit Leaf", description: "Leaf imbued with faint Qi. Used in low-grade pills.", price: 2, quantity: 1, picture: `${GATHERING_ITEMS}/item-spirit-leaf.webp` },
  { kind: "material", id: 613, name: "Spirit Grass", description: "Grass from spirit-rich soil. Used in alchemy pills.", price: 4, quantity: 1, picture: `${GATHERING_ITEMS}/item-spirit-grass.webp` },
  { kind: "material", id: 614, name: "Silver Leaf", description: "Rare herb with a silvery sheen. Used in refinement pills.", price: 6, quantity: 1, picture: `${GATHERING_ITEMS}/item-silver-leaf.webp` },
  { kind: "material", id: 615, name: "Jade Spirit Herb", description: "Precious herb favoured in high-level alchemy.", price: 10, quantity: 1, picture: `${GATHERING_ITEMS}/item-jade-spirit-herb.webp` },
  { kind: "material", id: 616, name: "Heavenly Ginseng", description: "Rare ginseng said to touch the heavens. Used in breakthrough pills.", price: 15, quantity: 1, picture: `${GATHERING_ITEMS}/item-heavenly-ginseng.webp` },
  { kind: "material", id: 617, name: "Moon Petal", description: "Herb that blooms under the full moon. Used in awareness pills.", price: 12, quantity: 1, picture: `${GATHERING_ITEMS}/item-moon-petal.webp` },
  { kind: "material", id: 618, name: "Star Moss", description: "Moss that glows like starlight. Used in stellar alchemy.", price: 18, quantity: 1, picture: `${GATHERING_ITEMS}/item-star-moss.webp` },
  { kind: "material", id: 619, name: "Primordial Root", description: "Root from the dawn of Qi. Used in ancient formulae.", price: 22, quantity: 1, picture: `${GATHERING_ITEMS}/item-primordial-root.webp` },
  { kind: "material", id: 620, name: "Void Bloom", description: "Flower that grows near rifts. Used in void-attuned pills.", price: 28, quantity: 1, picture: `${GATHERING_ITEMS}/item-void-bloom.webp` },
  { kind: "material", id: 621, name: "Celestial Lotus", description: "Lotus touched by heaven. Used in transcendent pills.", price: 34, quantity: 1, picture: `${GATHERING_ITEMS}/item-celestial-lotus.webp` },
  { kind: "material", id: 622, name: "Transcendent Spirit Herb", description: "Herb that transcends mortal classification. Peak alchemy ingredient.", price: 45, quantity: 1, picture: `${GATHERING_ITEMS}/item-transcendent-herb.webp` },
  { kind: "material", id: 623, name: "Ascendant Spirit Herb", description: "Herb that transcends the celestial. Used in post-reincarnation pills.", price: 52, quantity: 1, picture: `${GATHERING_ITEMS}/item-ascendant-herb.webp` },
  { kind: "material", id: 624, name: "Karmic Lotus Petal", description: "Lotus petal that reflects karma. Used in high alchemy. Requires reincarnation.", price: 58, quantity: 1, picture: `${GATHERING_ITEMS}/item-karmic-lotus-petal.webp` },
  { kind: "material", id: 625, name: "Immortal Root", description: "Root that never withers. Used in immortal-grade pills. Requires reincarnation.", price: 65, quantity: 1, picture: `${GATHERING_ITEMS}/item-immortal-root.webp` },
  { kind: "material", id: 626, name: "Dao Essence Flower", description: "Flower in which the Dao takes form. Peak alchemy. Requires reincarnation.", price: 75, quantity: 1, picture: `${GATHERING_ITEMS}/item-dao-essence-flower.webp` },
];
