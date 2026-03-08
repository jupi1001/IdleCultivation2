import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAlchemyLevel } from "../../constants/alchemy";
import { getCookingLevel } from "../../constants/cooking";
import { getFishingLevelInfo } from "../../constants/fishingLevel";
import { getForgingLevel } from "../../constants/forging";
import { getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getMiningLevelInfo } from "../../constants/miningLevel";
import { getStepIndex, formatRealm } from "../../constants/realmProgression";
import {
  REINCARNATION_MIN_STEP,
  REINCARNATION_MIN_REALM_LABEL,
  calculateKarmaEarned,
  KARMA_BONUSES,
  KARMA_BONUSES_BY_ID,
  type KarmaBonusId,
} from "../../constants/reincarnation";
import { ContentArea } from "../../enum/ContentArea";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import { reincarnate, purchaseKarmaBonus } from "../../state/reducers/reincarnationSlice";
import {
  selectRealm,
  selectRealmLevel,
  selectKarmaPoints,
  selectTotalKarmaEarned,
  selectReincarnationCount,
  selectKarmaBonusLevels,
  selectFishingXP,
  selectMiningXP,
  selectGatheringXP,
  selectAlchemyXP,
  selectForgingXP,
  selectCookingXP,
} from "../../state/selectors/characterSelectors";
import "./ReincarnationContainer.css";

function getTotalSkillLevels(xp: {
  fishingXP: number;
  miningXP: number;
  gatheringXP: number;
  alchemyXP: number;
  forgingXP: number;
  cookingXP: number;
}): number {
  return (
    getFishingLevelInfo(xp.fishingXP).level +
    getMiningLevelInfo(xp.miningXP).level +
    getGatheringLevelInfo(xp.gatheringXP).level +
    getAlchemyLevel(xp.alchemyXP) +
    getForgingLevel(xp.forgingXP) +
    getCookingLevel(xp.cookingXP)
  );
}

export const ReincarnationContainer = () => {
  const dispatch = useDispatch();
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const karmaPoints = useSelector(selectKarmaPoints);
  const totalKarmaEarned = useSelector(selectTotalKarmaEarned);
  const reincarnationCount = useSelector(selectReincarnationCount);
  const karmaBonusLevels = useSelector(selectKarmaBonusLevels);
  const fishingXP = useSelector(selectFishingXP);
  const miningXP = useSelector(selectMiningXP);
  const gatheringXP = useSelector(selectGatheringXP);
  const alchemyXP = useSelector(selectAlchemyXP);
  const forgingXP = useSelector(selectForgingXP);
  const cookingXP = useSelector(selectCookingXP);

  const [confirming, setConfirming] = useState(false);

  const step = getStepIndex(realm, realmLevel);
  const canReincarnate = step >= REINCARNATION_MIN_STEP;
  const totalSkillLevels = getTotalSkillLevels({
    fishingXP,
    miningXP,
    gatheringXP,
    alchemyXP,
    forgingXP,
    cookingXP,
  });
  const karmaPreview = canReincarnate
    ? calculateKarmaEarned(realm, realmLevel, totalSkillLevels)
    : 0;

  const handleReincarnate = () => {
    if (!canReincarnate) return;
    const earned = calculateKarmaEarned(realm, realmLevel, totalSkillLevels);
    const startingMoneyLevel = karmaBonusLevels?.startingMoney ?? 0;
    const startingMoneyBonus = startingMoneyLevel * (KARMA_BONUSES_BY_ID.startingMoney?.valuePerLevel ?? 0);
    dispatch(reincarnate({ karmaEarned: earned, startingMoneyBonus }));
    setConfirming(false);
    dispatch(changeContent(routeFromArea(ContentArea.MEDITATION)));
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
