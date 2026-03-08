import { createSelector } from "@reduxjs/toolkit";
import { BASE_QI_PER_SECOND } from "../../constants/meditation";
import { getTalentBonuses } from "../../constants/talents";
import type { RootState } from "../../state/store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";

const EQUIPMENT_SLOT_LABELS: Partial<Record<EquipmentSlot, string>> = {
  sword: "Sword",
  helmet: "Helmet",
  body: "Body",
  ring: "Ring",
  amulet: "Amulet",
  combatTechnique: "Combat technique",
};

export interface StatBreakdown {
  base: number;
  sources: { label: string; value: number }[];
  multiplier?: number;
  total: number;
}

function getEquipmentBreakdown(equipment: RootState["character"]["equipment"]) {
  const attackSources: { label: string; value: number }[] = [];
  const defenseSources: { label: string; value: number }[] = [];
  const vitalitySources: { label: string; value: number }[] = [];

  const slots: EquipmentSlot[] = ["sword", "helmet", "body", "ring", "amulet"];
  for (const slot of slots) {
    const item = equipment[slot];
    if (item) {
      const label = EQUIPMENT_SLOT_LABELS[slot] ?? slot;
      if (item.attackBonus != null && item.attackBonus !== 0) {
        attackSources.push({ label: item.name, value: item.attackBonus });
      }
      if (item.defenseBonus != null && item.defenseBonus !== 0) {
        defenseSources.push({ label: item.name, value: item.defenseBonus });
      }
      if (item.vitalityBonus != null && item.vitalityBonus !== 0) {
        vitalitySources.push({ label: item.name, value: item.vitalityBonus });
      }
    }
  }

  const combatTech = equipment.combatTechnique;
  const attackMultiplier = combatTech?.attackMultiplier ?? 1;

  return { attackSources, defenseSources, vitalitySources, attackMultiplier };
}

const getEquipmentBreakdownMemo = createSelector(
  [(state: RootState) => state.character.equipment],
  (equipment) => getEquipmentBreakdown(equipment)
);

export const getAttackBreakdown = createSelector(
  [
    (state: RootState) => state.character.attack,
    (state: RootState) => state.character.bonusAttack,
    getEquipmentBreakdownMemo,
    (state: RootState) => getTalentBonuses(state.character.talentLevels ?? {}),
  ],
  (attack, bonusAttack, { attackSources, attackMultiplier }, talentBonuses): StatBreakdown => {
    const base = attack + (bonusAttack ?? 0);
    const equipmentTotal = attackSources.reduce((s, x) => s + x.value, 0);
    const talentTotal = talentBonuses.attack ?? 0;
    const flatAttack = base + equipmentTotal + talentTotal;
    const total = Math.floor(flatAttack * attackMultiplier);
    const sources = [...attackSources];
    if (talentTotal !== 0) sources.push({ label: "Talents", value: talentTotal });
    return {
      base,
      sources,
      multiplier: attackMultiplier !== 1 ? attackMultiplier : undefined,
      total,
    };
  }
);

export const getDefenseBreakdown = createSelector(
  [
    (state: RootState) => state.character.defense,
    (state: RootState) => state.character.bonusDefense,
    getEquipmentBreakdownMemo,
    (state: RootState) => getTalentBonuses(state.character.talentLevels ?? {}),
  ],
  (defense, bonusDefense, { defenseSources }, talentBonuses): StatBreakdown => {
    const base = defense + (bonusDefense ?? 0);
    const equipmentTotal = defenseSources.reduce((s, x) => s + x.value, 0);
    const talentTotal = talentBonuses.defense ?? 0;
    const total = base + equipmentTotal + talentTotal;
    const sources = [...defenseSources];
    if (talentTotal !== 0) sources.push({ label: "Talents", value: talentTotal });
    return {
      base,
      sources,
      total,
    };
  }
);

export const getHealthBreakdown = createSelector(
  [
    (state: RootState) => state.character.health,
    (state: RootState) => state.character.bonusHealth,
    getEquipmentBreakdownMemo,
    (state: RootState) => getTalentBonuses(state.character.talentLevels ?? {}),
  ],
  (health, bonusHealth, { vitalitySources }, talentBonuses): StatBreakdown => {
    const base = health + (bonusHealth ?? 0);
    const equipmentTotal = vitalitySources.reduce((s, x) => s + x.value, 0);
    const talentTotal = talentBonuses.vitality ?? 0;
    const total = base + equipmentTotal + talentTotal;
    const sources = [...vitalitySources];
    if (talentTotal !== 0) sources.push({ label: "Talents", value: talentTotal });
    return {
      base,
      sources,
      total,
    };
  }
);

export function formatStatBreakdown(b: StatBreakdown, statName: string): string {
  const lines: string[] = [];
  lines.push(`${statName}: ${b.total}`);
  lines.push(`  Base: ${b.base}`);
  for (const s of b.sources) {
    lines.push(`  ${s.label}: +${s.value}`);
  }
  if (b.multiplier != null && b.multiplier !== 1) {
    lines.push(`  Multiplier: ×${b.multiplier}`);
  }
  return lines.join("\n");
}

/** Qi tooltip: current Qi and Qi/s when meditating (base + technique + amulet + talents). */
export function getQiBreakdown(state: RootState): string {
  const { character } = state;
  const eq = character.equipment;
  const talentBonuses = getTalentBonuses(character.talentLevels ?? {});
  const currentQi = Math.round(character.qi * 100) / 100;
  const lines: string[] = [];
  lines.push(`Current Qi: ${currentQi}`);
  let qiPerSec = BASE_QI_PER_SECOND;
  const parts: string[] = [`Base: ${BASE_QI_PER_SECOND}`];
  if (eq.qiTechnique?.qiGainBonus != null && eq.qiTechnique.qiGainBonus !== 0) {
    qiPerSec += eq.qiTechnique.qiGainBonus;
    parts.push(`${eq.qiTechnique.name}: +${eq.qiTechnique.qiGainBonus}`);
  }
  if (eq.amulet?.qiGainBonus != null && eq.amulet.qiGainBonus !== 0) {
    qiPerSec += eq.amulet.qiGainBonus;
    parts.push(`${eq.amulet.name}: +${eq.amulet.qiGainBonus}`);
  }
  const talentQi = talentBonuses.qiGain ?? 0;
  if (talentQi !== 0) {
    qiPerSec += talentQi;
    parts.push(`Talents: +${talentQi}`);
  }
  const qiPerSecRounded = Math.round(qiPerSec * 10) / 10;
  lines.push(`Qi/s when meditating: ${qiPerSecRounded}`);
  for (const p of parts) {
    lines.push(`  ${p}`);
  }
  return lines.join("\n");
}
