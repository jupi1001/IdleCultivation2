/**
 * Fish item definitions for fishing skill loot tables.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for fish item images. Add images under public/assets/fish/ */
const FISH_ASSETS = "/assets/fish";

export const fishTypes: Item[] = [
  { id: 301, name: "Spirit Minnow", description: "A small fish touched by Qi. Can be used in pills. Restores 1 Qi.", price: 1, quantity: 1, picture: `${FISH_ASSETS}/spirit-minnow.webp`, value: 1, effect: "qi" },
  { id: 302, name: "River Carp", description: "Common in Spirit River. Good for cooking.", price: 3, quantity: 1, picture: `${FISH_ASSETS}/river-carp.webp`, value: 2, effect: "vitality" },
  { id: 303, name: "Jade Tuna", description: "Large spirit fish from the Spirit Sea.", price: 5, quantity: 1, picture: `${FISH_ASSETS}/jade-tuna.webp`, value: 3, effect: "vitality" },
  { id: 304, name: "Silver Mackerel", description: "Swift fish rich in spiritual energy.", price: 2, quantity: 1, picture: `${FISH_ASSETS}/silver-mackerel.webp`, value: 2, effect: "vitality" },
  { id: 305, name: "Abyssal Puffer", description: "Rare fish from the deep. Handle with care when preparing.", price: 7, quantity: 1, picture: `${FISH_ASSETS}/abyssal-puffer.webp`, value: 5, effect: "vitality" },
  { id: 306, name: "Lotus Koi", description: "A koi raised among spirit lotuses. Calms the mind.", price: 6, quantity: 1, picture: `${FISH_ASSETS}/lotus-koi.webp`, value: 4, effect: "qi" },
  { id: 307, name: "Azure Scale Eel", description: "An eel crackling with faint lightning Qi.", price: 8, quantity: 1, picture: `${FISH_ASSETS}/azure-eel.webp`, value: 5, effect: "qi" },
  { id: 308, name: "Golden Spine Bass", description: "A rare bass with golden bones prized by alchemists.", price: 10, quantity: 1, picture: `${FISH_ASSETS}/golden-bass.webp`, value: 6, effect: "vitality" },
  { id: 309, name: "Frostfin Trout", description: "Lives in icy waters. Body cold as jade.", price: 12, quantity: 1, picture: `${FISH_ASSETS}/frostfin-trout.webp`, value: 7, effect: "vitality" },
  { id: 310, name: "Shadow Catfish", description: "Feeds in darkness. Favored by demonic cultivators.", price: 14, quantity: 1, picture: `${FISH_ASSETS}/shadow-catfish.webp`, value: 8, effect: "qi" },
  { id: 311, name: "Celestial Salmon", description: "Swims against spiritual currents of heaven.", price: 18, quantity: 1, picture: `${FISH_ASSETS}/celestial-salmon.webp`, value: 10, effect: "vitality" },
  { id: 312, name: "Dragon Vein Sturgeon", description: "Said to drink from dragon veins beneath the world.", price: 25, quantity: 1, picture: `${FISH_ASSETS}/dragon-sturgeon.webp`, value: 14, effect: "qi" },
  { id: 313, name: "Emberfin Snapper", description: "A fish with warm, glowing scales. Said to live near magma springs.", price: 16, quantity: 1, picture: `${FISH_ASSETS}/emberfin-snapper.webp`, value: 9, effect: "vitality" },
  { id: 314, name: "Moonwhisker Carp", description: "Active only under moonlight. Enhances spiritual awareness.", price: 18, quantity: 1, picture: `${FISH_ASSETS}/moonwhisker-carp.webp`, value: 10, effect: "qi" },
  { id: 315, name: "Starfall Guppy", description: "Tiny fish that shimmer like falling stars.", price: 14, quantity: 1, picture: `${FISH_ASSETS}/starfall-guppy.webp`, value: 8, effect: "qi" },
  { id: 316, name: "Thunderjaw Pike", description: "Its bite releases a crack of thunder.", price: 22, quantity: 1, picture: `${FISH_ASSETS}/thunderjaw-pike.webp`, value: 12, effect: "vitality" },
  { id: 317, name: "Verdant Scale Tilapia", description: "Feeds on spirit herbs. Favored in alchemy.", price: 17, quantity: 1, picture: `${FISH_ASSETS}/verdant-tilapia.webp`, value: 9, effect: "qi" },
  { id: 318, name: "Void Lantern Fish", description: "A deep-water fish that glows like a ghostly lantern.", price: 24, quantity: 1, picture: `${FISH_ASSETS}/void-lantern.webp`, value: 13, effect: "qi" },
  { id: 319, name: "Crimson Banner Koi", description: "Symbol of fortune among sect elders.", price: 26, quantity: 1, picture: `${FISH_ASSETS}/crimson-koi.webp`, value: 14, effect: "vitality" },
  { id: 320, name: "Heaven's Mirror Ray", description: "Its body reflects the sky like a mirror.", price: 28, quantity: 1, picture: `${FISH_ASSETS}/mirror-ray.webp`, value: 15, effect: "qi" },
  { id: 321, name: "Nine-Whisker Catfish", description: "An ancient breed rumored to live for centuries.", price: 30, quantity: 1, picture: `${FISH_ASSETS}/ninewhisker-catfish.webp`, value: 16, effect: "vitality" },
  { id: 322, name: "Mythic Pearl Eel", description: "Occasionally forms spirit pearls within its body.", price: 35, quantity: 1, picture: `${FISH_ASSETS}/pearl-eel.webp`, value: 18, effect: "qi" },
  { id: 323, name: "Sage Carp", description: "Fish from waters where sages meditated. Requires reincarnation to catch.", price: 42, quantity: 1, picture: `${FISH_ASSETS}/sage-carp.webp`, value: 20, effect: "vitality" },
  { id: 324, name: "Karmic Koi", description: "Its scales reflect the flow of karma. Requires reincarnation to catch.", price: 48, quantity: 1, picture: `${FISH_ASSETS}/karmic-koi.webp`, value: 22, effect: "qi" },
  { id: 325, name: "Immortal Bass", description: "Rumored to never die of age. Requires reincarnation to catch.", price: 55, quantity: 1, picture: `${FISH_ASSETS}/immortal-bass.webp`, value: 24, effect: "vitality" },
  { id: 326, name: "Dao Essence Salmon", description: "Touched by the essence of the Dao itself. Requires reincarnation to catch.", price: 65, quantity: 1, picture: `${FISH_ASSETS}/dao-essence-salmon.webp`, value: 26, effect: "qi" },
];
