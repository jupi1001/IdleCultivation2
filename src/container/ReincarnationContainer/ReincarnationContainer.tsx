import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { reincarnate, purchaseKarmaBonus } from "../../state/reducers/characterSlice";
import { changeContent } from "../../state/reducers/contentSlice";
import { ContentArea } from "../../enum/ContentArea";
import { getStepIndex, formatRealm } from "../../constants/realmProgression";
import {
  REINCARNATION_MIN_STEP,
  REINCARNATION_MIN_REALM_LABEL,
  calculateKarmaEarned,
  KARMA_BONUSES,
  type KarmaBonusId,
} from "../../constants/reincarnation";
import { getFishingLevelInfo } from "../../constants/fishingLevel";
import { getMiningLevelInfo } from "../../constants/miningLevel";
import { getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getAlchemyLevel } from "../../constants/alchemy";
import { getForgingLevel } from "../../constants/forging";
import { getCookingLevel } from "../../constants/cooking";
import "./ReincarnationContainer.css";

function getTotalSkillLevels(char: RootState["character"]): number {
  return (
    getFishingLevelInfo(char.fishingXP).level +
    getMiningLevelInfo(char.miningXP).level +
    getGatheringLevelInfo(char.gatheringXP).level +
    getAlchemyLevel(char.alchemyXP) +
    getForgingLevel(char.forgingXP) +
    getCookingLevel(char.cookingXP)
  );
}

export const ReincarnationContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const {
    realm,
    realmLevel,
    karmaPoints,
    totalKarmaEarned,
    reincarnationCount,
    karmaBonusLevels,
  } = character;

  const [confirming, setConfirming] = useState(false);

  const step = getStepIndex(realm, realmLevel);
  const canReincarnate = step >= REINCARNATION_MIN_STEP;
  const totalSkillLevels = getTotalSkillLevels(character);
  const karmaPreview = canReincarnate
    ? calculateKarmaEarned(realm, realmLevel, totalSkillLevels)
    : 0;

  const handleReincarnate = () => {
    if (!canReincarnate) return;
    const earned = calculateKarmaEarned(realm, realmLevel, totalSkillLevels);
    dispatch(reincarnate({ karmaEarned: earned }));
    setConfirming(false);
    dispatch(changeContent(ContentArea.MEDITATION));
  };

  const handleBuyBonus = (id: KarmaBonusId) => {
    dispatch(purchaseKarmaBonus(id));
  };

  return (
    <div className="reincarnation">
      <h2 className="reincarnation__title">Reincarnation</h2>
      <p className="reincarnation__subtitle">
        Sacrifice your current life to be reborn with permanent Karma bonuses.
        All progress resets except your path, gender, and Karma upgrades.
      </p>

      {/* Stats */}
      <div className="reincarnation__stats">
        <div className="reincarnation__stat">
          <span className="reincarnation__stat-label">Lives Lived</span>
          <span className="reincarnation__stat-value">{reincarnationCount ?? 0}</span>
        </div>
        <div className="reincarnation__stat">
          <span className="reincarnation__stat-label">Karma Points</span>
          <span className="reincarnation__stat-value reincarnation__stat-value--gold">
            {karmaPoints ?? 0}
          </span>
        </div>
        <div className="reincarnation__stat">
          <span className="reincarnation__stat-label">Total Karma Earned</span>
          <span className="reincarnation__stat-value">{totalKarmaEarned ?? 0}</span>
        </div>
        <div className="reincarnation__stat">
          <span className="reincarnation__stat-label">Current Realm</span>
          <span className="reincarnation__stat-value">{formatRealm(realm, realmLevel)}</span>
        </div>
      </div>

      {/* Reincarnate action */}
      <div className="reincarnation__action">
        {canReincarnate ? (
          <>
            <span className="reincarnation__action-preview">
              Reincarnating now will earn {karmaPreview} Karma
            </span>
            <p className="reincarnation__action-hint">
              Realm contribution: {Math.max(0, step - 80) * 10} &middot; Skill
              contribution: {Math.floor(totalSkillLevels / 50)}
            </p>
            {!confirming ? (
              <button
                className="reincarnation__btn"
                onClick={() => setConfirming(true)}
              >
                Reincarnate
              </button>
            ) : (
              <div className="reincarnation__confirm-row">
                <button
                  className="reincarnation__btn reincarnation__btn--confirm"
                  onClick={handleReincarnate}
                >
                  Confirm — End This Life
                </button>
                <button
                  className="reincarnation__btn reincarnation__btn--cancel"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="reincarnation__locked">
            Reach {REINCARNATION_MIN_REALM_LABEL} to unlock reincarnation.
          </p>
        )}
      </div>

      {/* Karma shop */}
      <h3 className="reincarnation__shop-title">Karma Upgrades</h3>
      <div className="reincarnation__shop-grid">
        {KARMA_BONUSES.map((bonus) => {
          const level = (karmaBonusLevels ?? {})[bonus.id] ?? 0;
          const maxed = level >= bonus.maxLevel;
          const canAfford = (karmaPoints ?? 0) >= bonus.costPerLevel;
          const currentValue = level * bonus.valuePerLevel;
          const valueLabel =
            bonus.unit === "percent"
              ? `+${currentValue}%`
              : `+${currentValue.toLocaleString()}`;
          return (
            <div
              key={bonus.id}
              className={`reincarnation__bonus-card ${maxed ? "reincarnation__bonus-card--maxed" : ""}`}
            >
              <div className="reincarnation__bonus-header">
                <span className="reincarnation__bonus-name">{bonus.name}</span>
                <span className="reincarnation__bonus-level">
                  {level}/{bonus.maxLevel}
                </span>
              </div>
              <p className="reincarnation__bonus-desc">{bonus.description}</p>
              <div className="reincarnation__bonus-footer">
                <span className="reincarnation__bonus-value">{valueLabel}</span>
                {!maxed ? (
                  <button
                    className="reincarnation__bonus-buy"
                    disabled={!canAfford}
                    onClick={() => handleBuyBonus(bonus.id)}
                  >
                    {bonus.costPerLevel} Karma
                  </button>
                ) : (
                  <span className="reincarnation__bonus-level">MAX</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
