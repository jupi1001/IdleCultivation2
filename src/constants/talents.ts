import type { TalentNode, TalentTreeTier } from "../interfaces/TalentI";

/** All talent nodes by id (for lookup) */
export const TALENT_NODES_BY_ID: Record<number, TalentNode> = {};

/** Tree structure: tiers with optional realm gate, then nodes. Order is top-to-bottom (first tier = top of tree). */
export const TALENT_TREE_TIERS: TalentTreeTier[] = [
  {
    nodes: [
      {
        id: 1,
        name: "Qi Sense",
        description: "Sharpen your awareness of Qi.",
        costQi: 50,
        maxLevel: 1,
        effect: { type: "qiGain", value: 0.1 },
      },
      {
        id: 2,
        name: "Sturdy Body",
        description: "Reinforce your physique with Qi.",
        costQi: 80,
        maxLevel: 3,
        effect: { type: "vitality", value: 2 },
      },
      {
        id: 3,
        name: "Spirit Strike",
        description: "Channel Qi into your attacks.",
        costQi: 100,
        maxLevel: 3,
        effect: { type: "attack", value: 3 },
      },
    ],
  },
  {
    realmGate: { realmId: "Qi Condensation", realmLevel: 1 },
    nodes: [
      {
        id: 4,
        name: "Inner Calm",
        description: "Deeper meditation yields more Qi.",
        costQi: 150,
        maxLevel: 2,
        requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 },
        requiredTalentIds: [1],
        effect: { type: "qiGain", value: 0.15 },
      },
      {
        id: 5,
        name: "Guardian Qi",
        description: "Harden your defenses with circulating Qi.",
        costQi: 120,
        maxLevel: 3,
        requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 },
        requiredTalentIds: [2],
        effect: { type: "defense", value: 2 },
      },
    ],
  },
  {
    realmGate: { realmId: "Foundation Establishment", realmLevel: 1 },
    nodes: [
      {
        id: 6,
        name: "Foundation Vigor",
        description: "Your foundation strengthens body and spirit.",
        costQi: 400,
        maxLevel: 5,
        requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 },
        requiredTalentIds: [4, 5],
        effect: { type: "vitality", value: 5 },
      },
      {
        id: 7,
        name: "Spirit Flow",
        description: "Qi circulates more freely. Improves Qi gain when meditating.",
        costQi: 350,
        maxLevel: 6,
        requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 },
        effect: { type: "qiGain", value: 0.2 },
      },
    ],
  },
];

// Populate lookup
TALENT_TREE_TIERS.forEach((tier) => {
  tier.nodes.forEach((node) => {
    TALENT_NODES_BY_ID[node.id] = node;
  });
});

export function formatRealmGateLabel(realmId: string, realmLevel: number): string {
  if (realmId === "Mortal") return "Mortal";
  return `${realmId} ${realmLevel}`;
}

const EFFECT_TYPE_LABELS: Record<string, string> = {
  attack: "Attack",
  defense: "Defense",
  vitality: "Vitality",
  qiGain: "Qi/s",
  fishingXP: "Fishing XP",
};

export function formatTalentEffectType(effectType: string): string {
  return EFFECT_TYPE_LABELS[effectType] ?? effectType;
}
