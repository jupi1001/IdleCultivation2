import type { TalentNode, TalentTreeTier } from "../interfaces/TalentI";
import { parseTalentTiers } from "../schemas/talents";
import type { CultivationPath } from "./cultivationPath";

/**
* Talent effect types — where they are applied:
 * - Speed (cast/completion time): fishingSpeedPercent → getSkillSpeedBonusFishing; gatheringSpeedPercent → getSkillSpeedBonusGathering;
 *   forgingSpeedPercent, cookingSpeedPercent → not yet wired to forging/cooking UI (future).
 * - Yield (quantity per action): miningYieldPercent → getMiningYieldBonusPercent only (never in getSkillSpeedBonusMining).
 * - Combat: attack, defense, vitality, critChancePercent, lifestealPercent, damageReflectPercent, aoeChancePercent → combat/character stats.
 * - Economy: spiritStoneIncomePercent, shopDiscountPercent → rewards/shop.
 * - Alchemy: alchemySuccessPercent → pill/elixir success.
 * - Cultivation: qiGain → meditation.
 */

/** All talent nodes by id (for lookup) */
export const TALENT_NODES_BY_ID: Record<number, TalentNode> = {};

/** Tree structure: tiers with optional realm gate, then nodes. Order is top-to-bottom (first tier = roots at bottom). */
export const TALENT_TREE_TIERS: TalentTreeTier[] = [
  // ─── Tier 1: Mortal (roots) ───
  {
    nodes: [
      { id: 1, name: "Qi Sense", description: "Sharpen your awareness of Qi.", costQi: 50, maxLevel: 1, effect: { type: "qiGain", value: 0.1 } },
      { id: 2, name: "Sturdy Body", description: "Reinforce your physique with Qi.", costQi: 80, maxLevel: 3, effect: { type: "vitality", value: 2 } },
      { id: 3, name: "Spirit Strike", description: "Channel Qi into your attacks.", costQi: 100, maxLevel: 3, effect: { type: "attack", value: 3 } },
    ],
  },
  // ─── Tier 2: Qi Condensation 1 ───
  {
    realmGate: { realmId: "Qi Condensation", realmLevel: 1 },
    nodes: [
      { id: 4, name: "Inner Calm", description: "Deeper meditation yields more Qi.", costQi: 150, maxLevel: 2, requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 }, requiredTalentIds: [1], effect: { type: "qiGain", value: 0.15 } },
      { id: 5, name: "Guardian Qi", description: "Harden your defenses with circulating Qi.", costQi: 120, maxLevel: 3, requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 }, requiredTalentIds: [2], effect: { type: "defense", value: 2 } },
      { id: 6, name: "Merciful Palm", description: "Righteous healing reinforces your vitality.", costQi: 140, maxLevel: 2, requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 }, requiredTalentIds: [2], path: "Righteous" as CultivationPath, effect: { type: "vitality", value: 4 } },
      { id: 7, name: "Blood Strike", description: "Demonic ferocity and life drain.", costQi: 130, maxLevel: 2, requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 }, requiredTalentIds: [3], path: "Demonic" as CultivationPath, effect: { type: "attack", value: 4 } },
      { id: 8, name: "Blood Strike II", description: "Steal life with each blow.", costQi: 200, maxLevel: 2, requiredRealm: { realmId: "Qi Condensation", realmLevel: 3 }, requiredTalentIds: [7], path: "Demonic" as CultivationPath, effect: { type: "lifestealPercent", value: 5 } },
    ],
  },
  // ─── Tier 3: Foundation Establishment 1 ───
  {
    realmGate: { realmId: "Foundation Establishment", realmLevel: 1 },
    nodes: [
      { id: 9, name: "Foundation Vigor", description: "Your foundation strengthens body and spirit.", costQi: 400, maxLevel: 5, requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 }, requiredTalentIds: [4, 5], effect: { type: "vitality", value: 5 } },
      { id: 10, name: "Spirit Flow", description: "Qi circulates more freely when meditating.", costQi: 350, maxLevel: 6, requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 }, effect: { type: "qiGain", value: 0.2 } },
      { id: 11, name: "Serene Mind", description: "Righteous clarity amplifies Qi gain.", costQi: 380, maxLevel: 3, requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 }, requiredTalentIds: [4], path: "Righteous" as CultivationPath, effect: { type: "qiGain", value: 0.25 } },
      { id: 12, name: "Cruel Edge", description: "Critical strikes land more often.", costQi: 360, maxLevel: 3, requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 }, requiredTalentIds: [3], path: "Demonic" as CultivationPath, effect: { type: "critChancePercent", value: 3 } },
      { id: 13, name: "Guardian's Ward", description: "Reflect a portion of damage back at attackers.", costQi: 420, maxLevel: 2, requiredRealm: { realmId: "Foundation Establishment", realmLevel: 3 }, requiredTalentIds: [5, 6], path: "Righteous" as CultivationPath, effect: { type: "damageReflectPercent", value: 8 } },
    ],
  },
  // ─── Tier 4: Golden Core 1 ───
  {
    realmGate: { realmId: "Golden Core", realmLevel: 1 },
    nodes: [
      { id: 14, name: "Iron Body", description: "Golden Core hardens your defenses.", costQi: 600, maxLevel: 4, requiredRealm: { realmId: "Golden Core", realmLevel: 1 }, requiredTalentIds: [9], effect: { type: "defense", value: 4 } },
      { id: 15, name: "Spirit Blade", description: "Qi sharpens your attacks.", costQi: 580, maxLevel: 4, requiredRealm: { realmId: "Golden Core", realmLevel: 1 }, requiredTalentIds: [9], effect: { type: "attack", value: 5 } },
      { id: 16, name: "River Qi", description: "Righteous flow increases Qi gain.", costQi: 550, maxLevel: 3, requiredRealm: { realmId: "Golden Core", realmLevel: 1 }, requiredTalentIds: [10, 11], path: "Righteous" as CultivationPath, effect: { type: "qiGain", value: 0.3 } },
      { id: 17, name: "Soul Drain", description: "Drain vitality from foes.", costQi: 560, maxLevel: 3, requiredRealm: { realmId: "Golden Core", realmLevel: 1 }, requiredTalentIds: [7, 8], path: "Demonic" as CultivationPath, effect: { type: "lifestealPercent", value: 4 } },
      { id: 18, name: "Merchant's Eye", description: "Spirit stones flow more readily.", costQi: 500, maxLevel: 3, requiredRealm: { realmId: "Golden Core", realmLevel: 1 }, requiredTalentIds: [9], effect: { type: "spiritStoneIncomePercent", value: 10 } },
    ],
  },
  // ─── Tier 5: Nascent Soul 1 – skill talents ───
  {
    realmGate: { realmId: "Nascent Soul", realmLevel: 1 },
    nodes: [
      { id: 19, name: "Fisher's Patience", description: "Fishing actions complete slightly faster.", costQi: 700, maxLevel: 3, requiredRealm: { realmId: "Nascent Soul", realmLevel: 1 }, requiredTalentIds: [14], effect: { type: "fishingSpeedPercent", value: 5 } },
      { id: 20, name: "Miner's Strength", description: "Mining yields more ore per swing.", costQi: 700, maxLevel: 3, requiredRealm: { realmId: "Nascent Soul", realmLevel: 1 }, requiredTalentIds: [14], effect: { type: "miningYieldPercent", value: 5 } },
      { id: 21, name: "Gatherer's Bounty", description: "Gathering finds more herbs and wood.", costQi: 700, maxLevel: 3, requiredRealm: { realmId: "Nascent Soul", realmLevel: 1 }, requiredTalentIds: [14], effect: { type: "gatheringSpeedPercent", value: 5 } },
      { id: 22, name: "Alchemist's Focus", description: "Pills and elixirs succeed more often.", costQi: 750, maxLevel: 3, requiredRealm: { realmId: "Nascent Soul", realmLevel: 1 }, requiredTalentIds: [10], effect: { type: "alchemySuccessPercent", value: 4 } },
      { id: 23, name: "Smith's Flame", description: "Forging completes slightly faster.", costQi: 720, maxLevel: 2, requiredRealm: { realmId: "Nascent Soul", realmLevel: 1 }, requiredTalentIds: [15], effect: { type: "forgingSpeedPercent", value: 6 } },
      { id: 24, name: "Chef's Touch", description: "Cooking completes slightly faster.", costQi: 720, maxLevel: 2, requiredRealm: { realmId: "Nascent Soul", realmLevel: 1 }, requiredTalentIds: [15], effect: { type: "cookingSpeedPercent", value: 6 } },
    ],
  },
  // ─── Tier 6: Soul Formation 1 – economy & combat capstones ───
  {
    realmGate: { realmId: "Soul Formation", realmLevel: 1 },
    nodes: [
      { id: 25, name: "Spirit Stone Affinity", description: "Combat and labour grant more spirit stones.", costQi: 1000, maxLevel: 3, requiredRealm: { realmId: "Soul Formation", realmLevel: 1 }, requiredTalentIds: [18], effect: { type: "spiritStoneIncomePercent", value: 8 } },
      { id: 26, name: "Shop Savvy", description: "Vendors offer better prices.", costQi: 950, maxLevel: 3, requiredRealm: { realmId: "Soul Formation", realmLevel: 1 }, requiredTalentIds: [18], effect: { type: "shopDiscountPercent", value: 5 } },
      { id: 27, name: "Critical Surge", description: "Demonic precision: higher crit chance.", costQi: 1100, maxLevel: 2, requiredRealm: { realmId: "Soul Formation", realmLevel: 1 }, requiredTalentIds: [12], path: "Demonic" as CultivationPath, effect: { type: "critChancePercent", value: 5 } },
      { id: 28, name: "Reflecting Qi", description: "Righteous ward reflects more damage.", costQi: 1050, maxLevel: 2, requiredRealm: { realmId: "Soul Formation", realmLevel: 1 }, requiredTalentIds: [13], path: "Righteous" as CultivationPath, effect: { type: "damageReflectPercent", value: 6 } },
      { id: 29, name: "Cleaving Strike", description: "Chance to strike twice in one blow.", costQi: 1000, maxLevel: 2, requiredRealm: { realmId: "Soul Formation", realmLevel: 1 }, requiredTalentIds: [15, 12], path: "Demonic" as CultivationPath, effect: { type: "aoeChancePercent", value: 15 } },
      { id: 30, name: "Heaven's Blessing", description: "Righteous Qi sustains you further.", costQi: 1020, maxLevel: 3, requiredRealm: { realmId: "Soul Formation", realmLevel: 1 }, requiredTalentIds: [16], path: "Righteous" as CultivationPath, effect: { type: "vitality", value: 8 } },
    ],
  },
  // ─── Tier 7: Void Refinement 1 ───
  {
    realmGate: { realmId: "Void Refinement", realmLevel: 1 },
    nodes: [
      { id: 31, name: "Void Hardening", description: "Void refines your body; defenses deepen.", costQi: 1500, maxLevel: 4, requiredRealm: { realmId: "Void Refinement", realmLevel: 1 }, requiredTalentIds: [14, 25], effect: { type: "defense", value: 6 } },
      { id: 32, name: "Void Edge", description: "Strikes carry the weight of the void.", costQi: 1480, maxLevel: 4, requiredRealm: { realmId: "Void Refinement", realmLevel: 1 }, requiredTalentIds: [15, 25], effect: { type: "attack", value: 8 } },
      { id: 33, name: "Void Meditation", description: "Qi drawn from the void flows faster.", costQi: 1400, maxLevel: 3, requiredRealm: { realmId: "Void Refinement", realmLevel: 1 }, requiredTalentIds: [10, 25], effect: { type: "qiGain", value: 0.4 } },
      { id: 34, name: "Sacred Ward", description: "Righteous void reflects more harm.", costQi: 1600, maxLevel: 2, requiredRealm: { realmId: "Void Refinement", realmLevel: 1 }, requiredTalentIds: [28], path: "Righteous" as CultivationPath, effect: { type: "damageReflectPercent", value: 10 } },
      { id: 35, name: "Void Hunger", description: "Demonic void drains more life.", costQi: 1550, maxLevel: 3, requiredRealm: { realmId: "Void Refinement", realmLevel: 1 }, requiredTalentIds: [17, 29], path: "Demonic" as CultivationPath, effect: { type: "lifestealPercent", value: 6 } },
      { id: 36, name: "Void Coins", description: "Spirit stones resonate with the void.", costQi: 1450, maxLevel: 3, requiredRealm: { realmId: "Void Refinement", realmLevel: 1 }, requiredTalentIds: [25], effect: { type: "spiritStoneIncomePercent", value: 10 } },
    ],
  },
  // ─── Tier 8: Body Integration 1 ───
  {
    realmGate: { realmId: "Body Integration", realmLevel: 1 },
    nodes: [
      { id: 37, name: "Integrated Form", description: "Body and spirit unified; vitality soars.", costQi: 2500, maxLevel: 5, requiredRealm: { realmId: "Body Integration", realmLevel: 1 }, requiredTalentIds: [31, 32], effect: { type: "vitality", value: 12 } },
      { id: 38, name: "Integrated Strike", description: "Every blow carries integrated might.", costQi: 2400, maxLevel: 4, requiredRealm: { realmId: "Body Integration", realmLevel: 1 }, requiredTalentIds: [32], effect: { type: "attack", value: 10 } },
      { id: 39, name: "Integrated Guard", description: "Defense becomes second nature.", costQi: 2380, maxLevel: 4, requiredRealm: { realmId: "Body Integration", realmLevel: 1 }, requiredTalentIds: [31], effect: { type: "defense", value: 8 } },
      { id: 40, name: "Dao Heart", description: "Righteous integration amplifies Qi.", costQi: 2300, maxLevel: 3, requiredRealm: { realmId: "Body Integration", realmLevel: 1 }, requiredTalentIds: [33, 30], path: "Righteous" as CultivationPath, effect: { type: "qiGain", value: 0.5 } },
      { id: 41, name: "Ruthless Integration", description: "Critical strikes devastate.", costQi: 2350, maxLevel: 3, requiredRealm: { realmId: "Body Integration", realmLevel: 1 }, requiredTalentIds: [27, 29], path: "Demonic" as CultivationPath, effect: { type: "critChancePercent", value: 6 } },
      { id: 42, name: "Merchant's Fortune", description: "Wealth flows to the integrated.", costQi: 2200, maxLevel: 3, requiredRealm: { realmId: "Body Integration", realmLevel: 1 }, requiredTalentIds: [36, 26], effect: { type: "shopDiscountPercent", value: 6 } },
    ],
  },
  // ─── Tier 9: Mahayana 1 ───
  {
    realmGate: { realmId: "Mahayana", realmLevel: 1 },
    nodes: [
      { id: 43, name: "Mahayana Vigor", description: "The great vehicle strengthens all.", costQi: 4000, maxLevel: 4, requiredRealm: { realmId: "Mahayana", realmLevel: 1 }, requiredTalentIds: [37], effect: { type: "vitality", value: 15 } },
      { id: 44, name: "Mahayana Blade", description: "Combat transcends the mundane.", costQi: 3900, maxLevel: 4, requiredRealm: { realmId: "Mahayana", realmLevel: 1 }, requiredTalentIds: [38], effect: { type: "attack", value: 12 } },
      { id: 45, name: "Mahayana Breath", description: "Qi rises like the great vehicle.", costQi: 3800, maxLevel: 4, requiredRealm: { realmId: "Mahayana", realmLevel: 1 }, requiredTalentIds: [33], effect: { type: "qiGain", value: 0.6 } },
      { id: 46, name: "Bodhisattva's Shield", description: "Righteous compassion reflects evil.", costQi: 4100, maxLevel: 2, requiredRealm: { realmId: "Mahayana", realmLevel: 1 }, requiredTalentIds: [34, 40], path: "Righteous" as CultivationPath, effect: { type: "damageReflectPercent", value: 12 } },
      { id: 47, name: "Asura's Fury", description: "Demonic double strikes tear through.", costQi: 3950, maxLevel: 3, requiredRealm: { realmId: "Mahayana", realmLevel: 1 }, requiredTalentIds: [29, 41], path: "Demonic" as CultivationPath, effect: { type: "aoeChancePercent", value: 20 } },
      { id: 48, name: "Mahayana Bounty", description: "Spirit stones multiply on the path.", costQi: 3700, maxLevel: 3, requiredRealm: { realmId: "Mahayana", realmLevel: 1 }, requiredTalentIds: [36], effect: { type: "spiritStoneIncomePercent", value: 12 } },
    ],
  },
  // ─── Tier 10: Tribulation Transcendent 1 ───
  {
    realmGate: { realmId: "Tribulation Transcendent", realmLevel: 1 },
    nodes: [
      { id: 49, name: "Transcendent Body", description: "Beyond tribulation, the body is reborn.", costQi: 6000, maxLevel: 5, requiredRealm: { realmId: "Tribulation Transcendent", realmLevel: 1 }, requiredTalentIds: [43, 39], effect: { type: "vitality", value: 18 } },
      { id: 50, name: "Transcendent Strike", description: "Strikes carry transcendent power.", costQi: 5900, maxLevel: 4, requiredRealm: { realmId: "Tribulation Transcendent", realmLevel: 1 }, requiredTalentIds: [44], effect: { type: "attack", value: 15 } },
      { id: 51, name: "Transcendent Qi", description: "Qi approaches the immortal threshold.", costQi: 5700, maxLevel: 4, requiredRealm: { realmId: "Tribulation Transcendent", realmLevel: 1 }, requiredTalentIds: [45], effect: { type: "qiGain", value: 0.8 } },
      { id: 52, name: "Heaven's Retribution", description: "Righteous wrath reflects all harm.", costQi: 6200, maxLevel: 2, requiredRealm: { realmId: "Tribulation Transcendent", realmLevel: 1 }, requiredTalentIds: [46], path: "Righteous" as CultivationPath, effect: { type: "damageReflectPercent", value: 15 } },
      { id: 53, name: "Demon Sovereign's Edge", description: "Crit and lifesteal reign.", costQi: 6050, maxLevel: 3, requiredRealm: { realmId: "Tribulation Transcendent", realmLevel: 1 }, requiredTalentIds: [41, 35], path: "Demonic" as CultivationPath, effect: { type: "lifestealPercent", value: 8 } },
      { id: 54, name: "Transcendent Trade", description: "Vendors bow to transcendent presence.", costQi: 5600, maxLevel: 3, requiredRealm: { realmId: "Tribulation Transcendent", realmLevel: 1 }, requiredTalentIds: [42, 48], effect: { type: "shopDiscountPercent", value: 8 } },
    ],
  },
  // ─── Tier 11: Immortal 1 (capstone) ───
  {
    realmGate: { realmId: "Immortal", realmLevel: 1 },
    nodes: [
      { id: 55, name: "Immortal Frame", description: "The immortal body knows no limit.", costQi: 10000, maxLevel: 5, requiredRealm: { realmId: "Immortal", realmLevel: 1 }, requiredTalentIds: [49], effect: { type: "vitality", value: 25 } },
      { id: 56, name: "Immortal Blade", description: "Immortal will shapes the strike.", costQi: 9800, maxLevel: 5, requiredRealm: { realmId: "Immortal", realmLevel: 1 }, requiredTalentIds: [50], effect: { type: "attack", value: 20 } },
      { id: 57, name: "Immortal Aegis", description: "Defense transcends mortality.", costQi: 9600, maxLevel: 5, requiredRealm: { realmId: "Immortal", realmLevel: 1 }, requiredTalentIds: [49], effect: { type: "defense", value: 15 } },
      { id: 58, name: "Immortal Breath", description: "Qi flows without end.", costQi: 9500, maxLevel: 5, requiredRealm: { realmId: "Immortal", realmLevel: 1 }, requiredTalentIds: [51], effect: { type: "qiGain", value: 1 } },
      { id: 59, name: "Eternal Righteousness", description: "Righteous path culminates.", costQi: 10200, maxLevel: 3, requiredRealm: { realmId: "Immortal", realmLevel: 1 }, requiredTalentIds: [52, 40], path: "Righteous" as CultivationPath, effect: { type: "vitality", value: 20 } },
      { id: 60, name: "Eternal Demonic", description: "Demonic path culminates.", costQi: 10100, maxLevel: 3, requiredRealm: { realmId: "Immortal", realmLevel: 1 }, requiredTalentIds: [53, 47], path: "Demonic" as CultivationPath, effect: { type: "attack", value: 18 } },
    ],
  },
];

// Dev/test-only: validate talent tree tiers against Zod schema.
if (import.meta.env.MODE !== "production") {
  parseTalentTiers(TALENT_TREE_TIERS);
}

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
  fishingSpeedPercent: "% fishing speed",
  miningYieldPercent: "% mining yield",
  gatheringSpeedPercent: "% gathering speed",
  alchemySuccessPercent: "% alchemy success",
  forgingSpeedPercent: "% forging speed",
  cookingSpeedPercent: "% cooking speed",
  critChancePercent: "% crit chance",
  lifestealPercent: "% lifesteal",
  damageReflectPercent: "% damage reflect",
  aoeChancePercent: "% double strike",
  spiritStoneIncomePercent: "% spirit stone income",
  shopDiscountPercent: "% shop discount",
};

export function formatTalentEffectType(effectType: string): string {
  return EFFECT_TYPE_LABELS[effectType] ?? effectType;
}

/** Sum all talent bonuses from current levels. Percent effects are returned as percentages (e.g. 5 = 5%). */
export function getTalentBonuses(talentLevels: Record<number, number>): {
  attack: number;
  defense: number;
  vitality: number;
  qiGain: number;
  fishingSpeedPercent: number;
  miningYieldPercent: number;
  gatheringSpeedPercent: number;
  alchemySuccessPercent: number;
  forgingSpeedPercent: number;
  cookingSpeedPercent: number;
  critChancePercent: number;
  lifestealPercent: number;
  damageReflectPercent: number;
  aoeChancePercent: number;
  spiritStoneIncomePercent: number;
  shopDiscountPercent: number;
} {
  const out = {
    attack: 0,
    defense: 0,
    vitality: 0,
    qiGain: 0,
    fishingSpeedPercent: 0,
    miningYieldPercent: 0,
    gatheringSpeedPercent: 0,
    alchemySuccessPercent: 0,
    forgingSpeedPercent: 0,
    cookingSpeedPercent: 0,
    critChancePercent: 0,
    lifestealPercent: 0,
    damageReflectPercent: 0,
    aoeChancePercent: 0,
    spiritStoneIncomePercent: 0,
    shopDiscountPercent: 0,
  };
  for (const node of Object.values(TALENT_NODES_BY_ID)) {
    const level = talentLevels[node.id] ?? 0;
    if (level <= 0) continue;
    const eff = node.effect;
    const v = eff.value * level;
    switch (eff.type) {
      case "attack": out.attack += v; break;
      case "defense": out.defense += v; break;
      case "vitality": out.vitality += v; break;
      case "qiGain": out.qiGain += v; break;
      case "fishingSpeedPercent": out.fishingSpeedPercent += v; break;
      case "miningYieldPercent": out.miningYieldPercent += v; break;
      case "gatheringSpeedPercent": out.gatheringSpeedPercent += v; break;
      case "alchemySuccessPercent": out.alchemySuccessPercent += v; break;
      case "forgingSpeedPercent": out.forgingSpeedPercent += v; break;
      case "cookingSpeedPercent": out.cookingSpeedPercent += v; break;
      case "critChancePercent": out.critChancePercent += v; break;
      case "lifestealPercent": out.lifestealPercent += v; break;
      case "damageReflectPercent": out.damageReflectPercent += v; break;
      case "aoeChancePercent": out.aoeChancePercent += v; break;
      case "spiritStoneIncomePercent": out.spiritStoneIncomePercent += v; break;
      case "shopDiscountPercent": out.shopDiscountPercent += v; break;
      default: break;
    }
  }
  return out;
}
