import type Item from "../interfaces/ItemI";

/** Format item stats for tooltips (equipment, sect store). Returns multiline string. */
export function formatItemStats(item: Item): string {
  const lines: string[] = [];
  if (item.description) {
    lines.push(item.description);
    lines.push("");
  }
  if ("attackBonus" in item && item.attackBonus != null && item.attackBonus !== 0) {
    lines.push(`Attack: ${item.attackBonus > 0 ? "+" : ""}${item.attackBonus}`);
  }
  if ("defenseBonus" in item && item.defenseBonus != null && item.defenseBonus !== 0) {
    lines.push(`Defense: ${item.defenseBonus > 0 ? "+" : ""}${item.defenseBonus}`);
  }
  if ("vitalityBonus" in item && item.vitalityBonus != null && item.vitalityBonus !== 0) {
    lines.push(`Vitality: ${item.vitalityBonus > 0 ? "+" : ""}${item.vitalityBonus}`);
  }
  if ("qiGainBonus" in item && item.qiGainBonus != null && item.qiGainBonus !== 0) {
    lines.push(`Qi/s: ${item.qiGainBonus > 0 ? "+" : ""}${item.qiGainBonus}`);
  }
  if ("attackMultiplier" in item && item.attackMultiplier != null && item.attackMultiplier !== 1) {
    const pct = ((item.attackMultiplier - 1) * 100).toFixed(0);
    lines.push(`Attack: ×${item.attackMultiplier} (${pct.startsWith("-") ? pct : `+${pct}`}%)`);
  }
  if ("attackSpeedReduction" in item && item.attackSpeedReduction != null && item.attackSpeedReduction !== 0) {
    lines.push(`Attack speed: ${item.attackSpeedReduction > 0 ? "-" : "+"}${Math.abs(item.attackSpeedReduction)} ms`);
  }
  if ("skillSet" in item && item.skillSet != null && "skillSpeedBonus" in item && item.skillSpeedBonus != null && item.skillSpeedBonus !== 0) {
    const skill = item.skillSet.charAt(0).toUpperCase() + item.skillSet.slice(1);
    lines.push(`${skill} speed: ${item.skillSpeedBonus > 0 ? "+" : ""}${item.skillSpeedBonus}%`);
  }
  if ("skillSet" in item && item.skillSet != null && "skillXpBonus" in item && item.skillXpBonus != null && item.skillXpBonus !== 0) {
    const skill = item.skillSet.charAt(0).toUpperCase() + item.skillSet.slice(1);
    lines.push(`${skill} XP: ${item.skillXpBonus > 0 ? "+" : ""}${item.skillXpBonus}%`);
  }
  return lines.length > 0 ? lines.join("\n") : (item.description || item.name);
}
