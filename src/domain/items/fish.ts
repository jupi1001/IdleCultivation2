/**
 * Fish item definitions for fishing skill loot tables.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for fish item images. Add images under public/assets/fish/ */
const FISH_ASSETS = "/assets/fish";

function fish(id: number, name: string, desc: string, price: number, picture: string, effect: { type: "grantQi" | "healVitality"; amount: number }): Item {
  return { kind: "consumable", id, name, description: desc, price, quantity: 1, picture: `${FISH_ASSETS}/${picture}`, effect };
}

export const fishTypes: Item[] = [
  fish(301, "Spirit Minnow", "A small fish touched by Qi. Can be used in pills. Restores 1 Qi.", 1, "spirit-minnow.webp", { type: "grantQi", amount: 1 }),
  fish(302, "River Carp", "Common in Spirit River. Good for cooking.", 3, "river-carp.webp", { type: "healVitality", amount: 2 }),
  fish(303, "Jade Tuna", "Large spirit fish from the Spirit Sea.", 5, "jade-tuna.webp", { type: "healVitality", amount: 3 }),
  fish(304, "Silver Mackerel", "Swift fish rich in spiritual energy.", 2, "silver-mackerel.webp", { type: "healVitality", amount: 2 }),
  fish(305, "Abyssal Puffer", "Rare fish from the deep. Handle with care when preparing.", 7, "abyssal-puffer.webp", { type: "healVitality", amount: 5 }),
  fish(306, "Lotus Koi", "A koi raised among spirit lotuses. Calms the mind.", 6, "lotus-koi.webp", { type: "grantQi", amount: 4 }),
  fish(307, "Azure Scale Eel", "An eel crackling with faint lightning Qi.", 8, "azure-eel.webp", { type: "grantQi", amount: 5 }),
  fish(308, "Golden Spine Bass", "A rare bass with golden bones prized by alchemists.", 10, "golden-bass.webp", { type: "healVitality", amount: 6 }),
  fish(309, "Frostfin Trout", "Lives in icy waters. Body cold as jade.", 12, "frostfin-trout.webp", { type: "healVitality", amount: 7 }),
  fish(310, "Shadow Catfish", "Feeds in darkness. Favored by demonic cultivators.", 14, "shadow-catfish.webp", { type: "grantQi", amount: 8 }),
  fish(311, "Celestial Salmon", "Swims against spiritual currents of heaven.", 18, "celestial-salmon.webp", { type: "healVitality", amount: 10 }),
  fish(312, "Dragon Vein Sturgeon", "Said to drink from dragon veins beneath the world.", 25, "dragon-sturgeon.webp", { type: "grantQi", amount: 14 }),
  fish(313, "Emberfin Snapper", "A fish with warm, glowing scales. Said to live near magma springs.", 16, "emberfin-snapper.webp", { type: "healVitality", amount: 9 }),
  fish(314, "Moonwhisker Carp", "Active only under moonlight. Enhances spiritual awareness.", 18, "moonwhisker-carp.webp", { type: "grantQi", amount: 10 }),
  fish(315, "Starfall Guppy", "Tiny fish that shimmer like falling stars.", 14, "starfall-guppy.webp", { type: "grantQi", amount: 8 }),
  fish(316, "Thunderjaw Pike", "Its bite releases a crack of thunder.", 22, "thunderjaw-pike.webp", { type: "healVitality", amount: 12 }),
  fish(317, "Verdant Scale Tilapia", "Feeds on spirit herbs. Favored in alchemy.", 17, "verdant-tilapia.webp", { type: "grantQi", amount: 9 }),
  fish(318, "Void Lantern Fish", "A deep-water fish that glows like a ghostly lantern.", 24, "void-lantern.webp", { type: "grantQi", amount: 13 }),
  fish(319, "Crimson Banner Koi", "Symbol of fortune among sect elders.", 26, "crimson-koi.webp", { type: "healVitality", amount: 14 }),
  fish(320, "Heaven's Mirror Ray", "Its body reflects the sky like a mirror.", 28, "mirror-ray.webp", { type: "grantQi", amount: 15 }),
  fish(321, "Nine-Whisker Catfish", "An ancient breed rumored to live for centuries.", 30, "ninewhisker-catfish.webp", { type: "healVitality", amount: 16 }),
  fish(322, "Mythic Pearl Eel", "Occasionally forms spirit pearls within its body.", 35, "pearl-eel.webp", { type: "grantQi", amount: 18 }),
  fish(323, "Sage Carp", "Fish from waters where sages meditated. Requires reincarnation to catch.", 42, "sage-carp.webp", { type: "healVitality", amount: 20 }),
  fish(324, "Karmic Koi", "Its scales reflect the flow of karma. Requires reincarnation to catch.", 48, "karmic-koi.webp", { type: "grantQi", amount: 22 }),
  fish(325, "Immortal Bass", "Rumored to never die of age. Requires reincarnation to catch.", 55, "immortal-bass.webp", { type: "healVitality", amount: 24 }),
  fish(326, "Dao Essence Salmon", "Touched by the essence of the Dao itself. Requires reincarnation to catch.", 65, "dao-essence-salmon.webp", { type: "grantQi", amount: 26 }),
];
