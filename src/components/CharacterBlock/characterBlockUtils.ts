import type { RootState } from "../../state/store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { BASE_QI_PER_SECOND } from "../../constants/meditation";

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

export function getAttackBreakdown(state: RootState): StatBreakdown {
  const { character } = state;
  const base = character.attack + (character.bonusAttack ?? 0);
  const { attackSources, attackMultiplier } = getEquipmentBreakdown(character.equipment);
  const flatAttack = base + attackSources.reduce((s, x) => s + x.value, 0);
  const total = Math.floor(flatAttack * attackMultiplier);

  return {
    base,
    sources: attackSources,
    multiplier: attackMultiplier !== 1 ? attackMultiplier : undefined,
    total,
  };
}

export function getDefenseBreakdown(state: RootState): StatBreakdown {
  const { character } = state;
  const base = character.defense + (character.bonusDefense ?? 0);
  const { defenseSources } = getEquipmentBreakdown(character.equipment);
  const total = base + defenseSources.reduce((s, x) => s + x.value, 0);

  return {
    base,
    sources: defenseSources,
    total,
  };
}

export function getHealthBreakdown(state: RootState): StatBreakdown {
  const { character } = state;
  const base = character.health + (character.bonusHealth ?? 0);
  const { vitalitySources } = getEquipmentBreakdown(character.equipment);
  const total = base + vitalitySources.reduce((s, x) => s + x.value, 0);

  return {
    base,
    sources: vitalitySources,
    total,
  };
}

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

/** Qi tooltip: current Qi and Qi/s when meditating (base + technique + amulet). */
export function getQiBreakdown(state: RootState): string {
  const { character } = state;
  const eq = character.equipment;
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
  const qiPerSecRounded = Math.round(qiPerSec * 10) / 10;
  lines.push(`Qi/s when meditating: ${qiPerSecRounded}`);
  for (const p of parts) {
    lines.push(`  ${p}`);
  }
  return lines.join("\n");
}
