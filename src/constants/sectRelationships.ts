/**
 * Sect Phase 3: NPCs, quests, and relationship data.
 * One quest chain per sect (bulletin board), romanceable NPCs (2 per gender per sect),
 * and sect treasure rewards (unique, not reset on reincarnation).
 */
import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";

const SECT_NPC_ASSETS = "/assets/sect-npcs";

/** Romanceable NPC: same sect only, gift spirit stones + realm dialogue for favor. 0–100 favor; at 50+ can dual cultivate. */
export interface SectNpcI {
  id: number;
  sectId: number;
  name: string;
  gender: "Male" | "Female";
  /** Flavor line for dialogue */
  description: string;
  /** Casual/dialogue portrait. Path under public: SECT_NPC_ASSETS/{sectId}/{id}-portrait.webp */
  portraitImage: string;
  /** Lotus pose when chosen as cultivation partner. SECT_NPC_ASSETS/{sectId}/{id}-lotus.webp */
  lotusImage: string;
}

/** Global NPC id base per sect: sect 1 = 101-104, sect 2 = 105-108, ... */
function npcId(sectId: number, index: number): number {
  return (sectId - 1) * 4 + 101 + index;
}

/** Build NPCs for all 6 sects: 2 Male, 2 Female per sect. */
export function getSectNpcs(): SectNpcI[] {
  const sects: { id: number; name: string }[] = [
    { id: 1, name: "Jade Mountain Sect" },
    { id: 2, name: "Verdant Valley Sect" },
    { id: 3, name: "Azure Sky Pavilion" },
    { id: 4, name: "Crimson Demon Sect" },
    { id: 5, name: "Shadow Serpent Hall" },
    { id: 6, name: "Bone Abyss Sect" },
  ];
  const out: SectNpcI[] = [];
  const maleNames = [
    ["Wei Lin", "Jiang Chen"],
    ["Ming Hao", "Yuan Feng"],
    ["Kai Wen", "Rui Ziang"],
    ["Xue Long", "Mo Kai"],
    ["Shan Zhu", "Ye Ming"],
    ["Bai Gu", "Hei Yan"],
  ];
  const femaleNames = [
    ["Mei Ling", "Xiu Yan"],
    ["Lan Yi", "Jing Wei"],
    ["Yun Xue", "Xin Yue"],
    ["Xue Mei", "Ling Po"],
    ["An Jing", "Yin Hua"],
    ["Gu Hun", "You Ling"],
  ];
  for (let s = 0; s < sects.length; s++) {
    const sect = sects[s];
    for (let i = 0; i < 4; i++) {
      const id = npcId(sect.id, i);
      const isMale = i < 2;
      const names = isMale ? maleNames[s] : femaleNames[s];
      const name = names[i % 2];
      out.push({
        id,
        sectId: sect.id,
        name,
        gender: isMale ? "Male" : "Female",
        description: `A disciple of ${sect.name}.`,
        portraitImage: `${SECT_NPC_ASSETS}/${sect.id}/${id}-portrait.webp`,
        lotusImage: `${SECT_NPC_ASSETS}/${sect.id}/${id}-lotus.webp`,
      });
    }
  }
  return out;
}

export const SECT_NPCS = getSectNpcs();

export const SECT_NPCS_BY_SECT: Record<number, SectNpcI[]> = SECT_NPCS.reduce(
  (acc, npc) => {
    if (!acc[npc.sectId]) acc[npc.sectId] = [];
    acc[npc.sectId].push(npc);
    return acc;
  },
  {} as Record<number, SectNpcI[]>
);

export function getSectNpcById(npcId: number): SectNpcI | undefined {
  return SECT_NPCS.find((n) => n.id === npcId);
}

/** Quest step: 0 = not started, 1 = in progress (kill 15 enemies), 2 = ready to claim, 3 = claimed */
export const SECT_QUEST_KILLS_REQUIRED = 15;

/** Sect treasure item ids (unique, one per sect, from quest reward). Not reset on reincarnation. */
export const SECT_TREASURE_IDS = {
  jadeMountain: 981,
  verdantValley: 982,
  azureSky: 983,
  crimsonDemon: 984,
  shadowSerpent: 985,
  boneAbyss: 986,
} as const;

const SECT_TREASURES_ASSETS = "/assets/sect-treasures";

/** Sect id to treasure item id */
export const SECT_TREASURE_ITEM_ID_BY_SECT: Record<number, number> = {
  1: SECT_TREASURE_IDS.jadeMountain,
  2: SECT_TREASURE_IDS.verdantValley,
  3: SECT_TREASURE_IDS.azureSky,
  4: SECT_TREASURE_IDS.crimsonDemon,
  5: SECT_TREASURE_IDS.shadowSerpent,
  6: SECT_TREASURE_IDS.boneAbyss,
};

/** Sect treasure items: names derived from sect. One-time obtainable from quest. */
export const SECT_TREASURE_ITEMS: (Item & { equipmentSlot: EquipmentSlot })[] = [
  {
    id: SECT_TREASURE_IDS.jadeMountain,
    name: "Jade Mountain Heartstone",
    description: "Sect-defining treasure of the Jade Mountain Sect. Earned by proving your worth.",
    price: 0,
    quantity: 1,
    picture: `${SECT_TREASURES_ASSETS}/jade-mountain-heartstone.webp`,
    equipmentSlot: "ring",
    attackBonus: 2,
    defenseBonus: 2,
  },
  {
    id: SECT_TREASURE_IDS.verdantValley,
    name: "Verdant Valley Heirloom",
    description: "Sect-defining treasure of the Verdant Valley Sect.",
    price: 0,
    quantity: 1,
    picture: `${SECT_TREASURES_ASSETS}/verdant-valley-heirloom.webp`,
    equipmentSlot: "amulet",
    vitalityBonus: 5,
    qiGainBonus: 3,
  },
  {
    id: SECT_TREASURE_IDS.azureSky,
    name: "Azure Sky Sigil",
    description: "Sect-defining treasure of the Azure Sky Pavilion.",
    price: 0,
    quantity: 1,
    picture: `${SECT_TREASURES_ASSETS}/azure-sky-sigil.webp`,
    equipmentSlot: "amulet",
    qiGainBonus: 8,
  },
  {
    id: SECT_TREASURE_IDS.crimsonDemon,
    name: "Crimson Demon Brand",
    description: "Sect-defining treasure of the Crimson Demon Sect.",
    price: 0,
    quantity: 1,
    picture: `${SECT_TREASURES_ASSETS}/crimson-demon-brand.webp`,
    equipmentSlot: "ring",
    attackBonus: 4,
  },
  {
    id: SECT_TREASURE_IDS.shadowSerpent,
    name: "Shadow Serpent Fang",
    description: "Sect-defining treasure of the Shadow Serpent Hall.",
    price: 0,
    quantity: 1,
    picture: `${SECT_TREASURES_ASSETS}/shadow-serpent-fang.webp`,
    equipmentSlot: "ring",
    attackBonus: 2,
    attackSpeedReduction: 30,
  },
  {
    id: SECT_TREASURE_IDS.boneAbyss,
    name: "Bone Abyss Relic",
    description: "Sect-defining treasure of the Bone Abyss Sect.",
    price: 0,
    quantity: 1,
    picture: `${SECT_TREASURES_ASSETS}/bone-abyss-relic.webp`,
    equipmentSlot: "amulet",
    defenseBonus: 4,
    vitalityBonus: 4,
  },
];

export function getSectTreasureItemById(id: number): Item | undefined {
  return SECT_TREASURE_ITEMS.find((i) => i.id === id);
}

/** Major realms that unlock one-time dialogue with NPCs (favor boost). */
export const REALM_DIALOGUE_REALMS: string[] = [
  "Qi Condensation",
  "Foundation Establishment",
  "Golden Core",
  "Nascent Soul",
  "Soul Formation",
  "Void Refinement",
  "Body Integration",
  "Mahayana",
  "Tribulation Transcendent",
  "Immortal",
];

/** Favor gain from using realm dialogue once per realm */
export const REALM_DIALOGUE_FAVOR = 5;

/** Minimum favor to select as dual cultivation partner */
export const DUAL_CULTIVATION_MIN_FAVOR = 50;

/** Spirit stones per gift; each gift gives 1 favor (capped at 100) */
export const GIFT_SPIRIT_STONE_COST = 100;

/** Dual cultivation: qi/s bonus at 50 favor = 0%, at 100 favor = 15% (linear scale) */
export function getDualCultivationBonusPercent(favor: number): number {
  if (favor < DUAL_CULTIVATION_MIN_FAVOR) return 0;
  const t = (favor - DUAL_CULTIVATION_MIN_FAVOR) / (100 - DUAL_CULTIVATION_MIN_FAVOR);
  return Math.min(15, t * 15);
}
