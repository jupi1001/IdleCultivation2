/**
 * Unique weapons, armor, rings, and amulets that drop only from combat (Martial Training).
 * One unique rare per main area (Village Outskirts through Jade Immortal Court).
 */
import { CombatArea } from "../enum/CombatArea";
import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";

const COMBAT_DROPS_ASSETS = "/assets/combat-drops";

export const COMBAT_DROP_IDS = {
  villageRing: 970,
  spiritBeastClaw: 971,
  crystalShardBlade: 972,
  blackwaterGuard: 973,
  sectRemnantRing: 974,
  miasmaCharm: 975,
  voidEdgeFragment: 976,
  hermitsCrown: 977,
  cloudseaPendant: 978,
  thunderbrand: 979,
  jadeCourtSigil: 980,
} as const;

type CombatDropItem = Item & { kind: "equipment"; equipmentSlot: EquipmentSlot };

export const COMBAT_DROP_ITEMS: CombatDropItem[] = [
  // FARM - Village Outskirts
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.villageRing,
    name: "Village Defender Ring",
    description: "Rare drop from Village Outskirts. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/village-defender-ring.webp`,
    equipmentSlot: "ring",
    attackBonus: 1,
    attackSpeedReduction: 20,
  },
  // CAVE - Spirit Beast Cave
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.spiritBeastClaw,
    name: "Spirit Beast Claw",
    description: "Rare drop from Spirit Beast Cave. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/spirit-beast-claw.webp`,
    equipmentSlot: "sword",
    attackBonus: 2,
  },
  // CRYSTALCAVE - Crystal Mine
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.crystalShardBlade,
    name: "Crystal Shard Blade",
    description: "Rare drop from Crystal Mine. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/crystal-shard-blade.webp`,
    equipmentSlot: "sword",
    attackBonus: 3,
  },
  // RIVER - Blackwater River Gorge
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.blackwaterGuard,
    name: "Blackwater Scale Guard",
    description: "Rare drop from Blackwater River Gorge. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/blackwater-scale-guard.webp`,
    equipmentSlot: "body",
    defenseBonus: 3,
    vitalityBonus: 4,
  },
  // RUINS - Ancient Sect Ruins
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.sectRemnantRing,
    name: "Sect Remnant Ring",
    description: "Rare drop from Ancient Sect Ruins. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/sect-remnant-ring.webp`,
    equipmentSlot: "ring",
    attackBonus: 2,
    defenseBonus: 1,
    attackSpeedReduction: 25,
  },
  // SWAMP - Thousand Miasma Marsh
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.miasmaCharm,
    name: "Miasma Ward Amulet",
    description: "Rare drop from Thousand Miasma Marsh. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/miasma-ward-amulet.webp`,
    equipmentSlot: "amulet",
    defenseBonus: 4,
    vitalityBonus: 3,
    qiGainBonus: 5,
  },
  // RIFT - Void Rift Expanse
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.voidEdgeFragment,
    name: "Void Edge Fragment",
    description: "Rare drop from Void Rift Expanse. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/void-edge-fragment.webp`,
    equipmentSlot: "sword",
    attackBonus: 4,
  },
  // PEAK - Heavenpiercer Peak
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.hermitsCrown,
    name: "Hermit's Crown",
    description: "Rare drop from Heavenpiercer Peak. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/hermits-crown.webp`,
    equipmentSlot: "helmet",
    defenseBonus: 5,
    vitalityBonus: 5,
  },
  // SEA - Endless Cloudsea Sanctuary
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.cloudseaPendant,
    name: "Cloudsea Lotus Pendant",
    description: "Rare drop from Endless Cloudsea Sanctuary. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/cloudsea-lotus-pendant.webp`,
    equipmentSlot: "amulet",
    defenseBonus: 5,
    vitalityBonus: 5,
    qiGainBonus: 10,
  },
  // STORM - Nine Heavens Thunder Plateau
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.thunderbrand,
    name: "Thunderbrand",
    description: "Rare drop from Nine Heavens Thunder Plateau. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/thunderbrand.webp`,
    equipmentSlot: "sword",
    attackBonus: 5,
  },
  // PALACE - Jade Immortal Court
  {
    kind: "equipment",
    id: COMBAT_DROP_IDS.jadeCourtSigil,
    name: "Jade Court Sigil",
    description: "Rare drop from Jade Immortal Court. Combat-only.",
    price: 0,
    quantity: 1,
    picture: `${COMBAT_DROPS_ASSETS}/jade-court-sigil.webp`,
    equipmentSlot: "amulet",
    defenseBonus: 6,
    vitalityBonus: 6,
    qiGainBonus: 12,
  },
];

const AREA_TO_DROP: Record<CombatArea, CombatDropItem | undefined> = {
  [CombatArea.FARM]: COMBAT_DROP_ITEMS[0],
  [CombatArea.CAVE]: COMBAT_DROP_ITEMS[1],
  [CombatArea.CRYSTALCAVE]: COMBAT_DROP_ITEMS[2],
  [CombatArea.RIVER]: COMBAT_DROP_ITEMS[3],
  [CombatArea.RUINS]: COMBAT_DROP_ITEMS[4],
  [CombatArea.SWAMP]: COMBAT_DROP_ITEMS[5],
  [CombatArea.RIFT]: COMBAT_DROP_ITEMS[6],
  [CombatArea.PEAK]: COMBAT_DROP_ITEMS[7],
  [CombatArea.SEA]: COMBAT_DROP_ITEMS[8],
  [CombatArea.STORM]: COMBAT_DROP_ITEMS[9],
  [CombatArea.PALACE]: COMBAT_DROP_ITEMS[10],
  [CombatArea.JADE_MOUNTAIN_RAID]: undefined,
  [CombatArea.VERDANT_VALLEY_RAID]: undefined,
  [CombatArea.AZURE_SKY_RAID]: undefined,
  [CombatArea.CRIMSON_DEMON_RAID]: undefined,
  [CombatArea.SHADOW_SERPENT_RAID]: undefined,
  [CombatArea.BONE_ABYSS_RAID]: undefined,
};

export function getCombatDropForArea(area: CombatArea): CombatDropItem | undefined {
  return AREA_TO_DROP[area];
}

export const COMBAT_DROP_ITEMS_BY_ID: Record<number, CombatDropItem> = Object.fromEntries(
  COMBAT_DROP_ITEMS.map((i) => [i.id, i])
) as Record<number, CombatDropItem>;

export function getCombatDropItemById(id: number): CombatDropItem | undefined {
  return COMBAT_DROP_ITEMS_BY_ID[id];
}
