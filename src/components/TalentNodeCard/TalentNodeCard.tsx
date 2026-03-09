import React, { useState } from "react";
import type { CultivationPath } from "../../constants/cultivationPath";
import type { TalentNodeState } from "../../constants/talentHelpers";
import { formatTalentEffectType } from "../../constants/talents";
import type { TalentNode } from "../../interfaces/TalentI";
import "./TalentNodeCard.css";

interface TalentNodeCardProps {
  node: TalentNode;
  currentLevel: number;
  state: TalentNodeState;
  onPurchase: () => void;
  path?: CultivationPath | null;
}

function formatEffectValue(effect: TalentNode["effect"]): string {
  const { type, value } = effect;
  const percentTypes = [
    "fishingSpeedPercent", "miningYieldPercent", "gatheringSpeedPercent",
    "alchemySuccessPercent", "forgingSpeedPercent", "cookingSpeedPercent",
    "critChancePercent", "lifestealPercent", "damageReflectPercent", "aoeChancePercent",
    "spiritStoneIncomePercent", "shopDiscountPercent",
  ];
  if (percentTypes.includes(type)) return `+${value}%`;
  return `+${value}`;
}

export const TalentNodeCard = ({ node, currentLevel, state, onPurchase, path }: TalentNodeCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathLocked = node.path != null && path !== node.path;
  const canPurchase = !pathLocked && (state === "available" || state === "partial") && currentLevel < node.maxLevel;
  const levelLabel = `${currentLevel}/${node.maxLevel}`;

  return (
    <div
      className={`talentNodeCard talentNodeCard--${state} ${pathLocked ? "talentNodeCard--pathLocked" : ""}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        className="talentNodeCard__button"
        onClick={canPurchase ? onPurchase : undefined}
        disabled={!canPurchase}
        title={node.name}
      >
        {node.path != null && (
          <span className={`talentNodeCard__path talentNodeCard__path--${node.path.toLowerCase()}`}>
            {node.path}
          </span>
        )}
        <span className="talentNodeCard__name">{node.name}</span>
        <span className="talentNodeCard__level">{levelLabel}</span>
      </button>
      {showTooltip && (
        <div className="talentNodeCard__tooltip">
          <strong>{node.name}</strong>
          {node.path != null && (
            <p className="talentNodeCard__tooltip-path">
              {pathLocked ? `Requires ${node.path} path` : `${node.path} path`}
            </p>
          )}
          <p>{node.description}</p>
          <p className="talentNodeCard__tooltip-meta">
            Level {currentLevel}/{node.maxLevel} · {node.costQi} Qi per level
          </p>
          {node.effect && (
            <p className="talentNodeCard__tooltip-effect">
              Effect: {formatEffectValue(node.effect)} {formatTalentEffectType(node.effect.type)} per level
            </p>
          )}
        </div>
      )}
    </div>
  );
};
