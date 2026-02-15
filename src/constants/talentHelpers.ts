import type { RealmId } from "./realmProgression";
import { getStepIndex } from "./realmProgression";
import { TALENT_NODES_BY_ID } from "./talents";
import type { TalentNode } from "../interfaces/TalentI";

export type TalentNodeState = "available" | "partial" | "completed" | "locked";

export function getTalentNodeState(
  node: TalentNode,
  qi: number,
  realm: RealmId,
  realmLevel: number,
  talentLevels: Record<number, number>
): TalentNodeState {
  const currentLevel = talentLevels[node.id] ?? 0;
  if (currentLevel >= node.maxLevel) return "completed";
  if (currentLevel > 0) {
    const canAfford = qi >= node.costQi;
    return canAfford ? "partial" : "locked";
  }
  if (node.requiredRealm) {
    const charStep = getStepIndex(realm, realmLevel);
    const reqStep = getStepIndex(node.requiredRealm.realmId, node.requiredRealm.realmLevel);
    if (charStep < reqStep) return "locked";
  }
  if (node.requiredTalentIds?.length) {
    const allMet = node.requiredTalentIds.every((id) => {
      const reqNode = TALENT_NODES_BY_ID[id];
      return reqNode && (talentLevels[id] ?? 0) >= reqNode.maxLevel;
    });
    if (!allMet) return "locked";
  }
  return qi >= node.costQi ? "available" : "locked";
}

export function canPurchaseTalentLevel(
  node: TalentNode,
  qi: number,
  realm: RealmId,
  realmLevel: number,
  talentLevels: Record<number, number>
): boolean {
  return getTalentNodeState(node, qi, realm, realmLevel, talentLevels) === "available" ||
    getTalentNodeState(node, qi, realm, realmLevel, talentLevels) === "partial";
}
