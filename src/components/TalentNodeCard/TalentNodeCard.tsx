import React, { useState } from "react";
import type { TalentNode } from "../../interfaces/TalentI";
import type { TalentNodeState } from "../../constants/talentHelpers";
import { formatTalentEffectType } from "../../constants/talents";
import "./TalentNodeCard.css";

interface TalentNodeCardProps {
  node: TalentNode;
  currentLevel: number;
  state: TalentNodeState;
  onPurchase: () => void;
}

export const TalentNodeCard = ({ node, currentLevel, state, onPurchase }: TalentNodeCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const canPurchase = (state === "available" || state === "partial") && currentLevel < node.maxLevel;
  const levelLabel = `${currentLevel}/${node.maxLevel}`;

  return (
    <div
      className={`talentNodeCard talentNodeCard--${state}`}
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
        <span className="talentNodeCard__name">{node.name}</span>
        <span className="talentNodeCard__level">{levelLabel}</span>
      </button>
      {showTooltip && (
        <div className="talentNodeCard__tooltip">
          <strong>{node.name}</strong>
          <p>{node.description}</p>
          <p className="talentNodeCard__tooltip-meta">
            Level {currentLevel}/{node.maxLevel} · {node.costQi} Qi per level
          </p>
          {node.effect && (
            <p className="talentNodeCard__tooltip-effect">
              Effect: +{node.effect.value} {formatTalentEffectType(node.effect.type)} per level
            </p>
          )}
        </div>
      )}
    </div>
  );
};
