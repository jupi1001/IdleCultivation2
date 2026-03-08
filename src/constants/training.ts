import { CombatArea } from "../enum/CombatArea";

/** Base path for martial training location images. Place under public/assets/training/ */
export const TRAINING_ASSETS = "/assets/training";
/** Base path for combat enemy images (martial training). Place under public/assets/training/enemies/ */
export const TRAINING_ENEMIES = "/assets/training/enemies";

/** Order of areas shown on the Martial Training screen */
export const TRAINING_AREA_ORDER: CombatArea[] = [
  CombatArea.FARM,
  CombatArea.CAVE,
  CombatArea.CRYSTALCAVE,
  CombatArea.RIVER,
  CombatArea.RUINS,
  CombatArea.SWAMP,
  CombatArea.RIFT,
  CombatArea.PEAK,
  CombatArea.SEA,
  CombatArea.STORM,
  CombatArea.PALACE,
];

/** Image filename (no extension) per area. Must match files in public/assets/training/ (all .webp). */
export const TRAINING_AREA_IMAGE_SLUG: Record<CombatArea, string> = {
  [CombatArea.FARM]: "village",
  [CombatArea.CAVE]: "spirit-beast-cave",
  [CombatArea.CRYSTALCAVE]: "crystal-mine",
  [CombatArea.RIVER]: "blackwater-river-gorge",
  [CombatArea.RUINS]: "ancient-sect-ruins",
  [CombatArea.SWAMP]: "thousand-miasma-marsh",
  [CombatArea.RIFT]: "void-rift-expanse",
  [CombatArea.PEAK]: "heavenpiercer-peak",
  [CombatArea.SEA]: "endless-cloudsea-sanctuary",
  [CombatArea.STORM]: "nine-heavens-thunder-plateau",
  [CombatArea.PALACE]: "jade-immortal-court",
  [CombatArea.JADE_MOUNTAIN_RAID]: "jade-mountain-raid",
  [CombatArea.VERDANT_VALLEY_RAID]: "verdant-valley-raid",
  [CombatArea.AZURE_SKY_RAID]: "azure-sky-raid",
  [CombatArea.CRIMSON_DEMON_RAID]: "crimson-demon-raid",
  [CombatArea.SHADOW_SERPENT_RAID]: "shadow-serpent-raid",
  [CombatArea.BONE_ABYSS_RAID]: "bone-abyss-raid",
};
