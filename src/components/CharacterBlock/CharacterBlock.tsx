import React from "react";
import { useSelector } from "react-redux";
import { formatRealm } from "../../constants/realmProgression";
import { getBreakthroughStatGainText } from "../../constants/realmProgression";
import { WEAKENED_MEDITATION_SECONDS } from "../../state/reducers/characterSlice";
import {
  getEffectiveCombatStats,
  selectRealm,
  selectRealmLevel,
  selectPath,
  selectQi,
  selectCurrentHealth,
  selectMoney,
  selectIsWeakened,
  selectDeathPenaltyMode,
  selectWeakenedMeditationSecondsDone,
} from "../../state/selectors/characterSelectors";
import { Tooltip } from "../Tooltip/Tooltip";
import {
  getAttackBreakdown,
  getDefenseBreakdown,
  getHealthBreakdown,
  getQiBreakdown,
  formatStatBreakdown,
} from "./characterBlockUtils";
import "./CharacterBlock.css";

export const CharacterBlock = () => {
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const path = useSelector(selectPath);
  const qi = useSelector(selectQi);
  const currentHealth = useSelector(selectCurrentHealth);
  const money = useSelector(selectMoney);
  const isWeakened = useSelector(selectIsWeakened);
  const deathPenaltyMode = useSelector(selectDeathPenaltyMode);
  const weakenedMeditationSecondsDone = useSelector(selectWeakenedMeditationSecondsDone);
  const combat = useSelector(getEffectiveCombatStats);
  const attackBreakdown = useSelector(getAttackBreakdown);
  const defenseBreakdown = useSelector(getDefenseBreakdown);
  const healthBreakdown = useSelector(getHealthBreakdown);
  const qiBreakdown = useSelector(getQiBreakdown);

  return (
    <div className="app__characterBlock">
      <h2>
        <Tooltip content={getBreakthroughStatGainText(realm, realmLevel)} placement="bottom">
          <span>Realm: {formatRealm(realm, realmLevel)}</span>
        </Tooltip>
      </h2>
      {path != null && (
        <p className="app__characterBlock-path">Path: {path}</p>
      )}
      {isWeakened && deathPenaltyMode === "normal" && (
        <p className="app__characterBlock-weakened" role="status">
          Weakened: Meditate {Math.max(0, WEAKENED_MEDITATION_SECONDS - (weakenedMeditationSecondsDone ?? 0))}s to recover
        </p>
      )}
      <div className="app__characterBlock-items">
        <ul className="app__characterBlock-ul">
          <li className="app__characterBlock-stat">
            <span>Qi: {Math.round(qi * 100) / 100}</span>
            <div className="app__characterBlock-tooltip" role="tooltip">
              {qiBreakdown}
            </div>
          </li>
          <li className="app__characterBlock-stat">
            <span>Attack: {combat.attack}</span>
            <div className="app__characterBlock-tooltip" role="tooltip">
              {formatStatBreakdown(attackBreakdown, "Attack")}
            </div>
          </li>
          <li className="app__characterBlock-stat">
            <span>Defense: {combat.defense}</span>
            <div className="app__characterBlock-tooltip" role="tooltip">
              {formatStatBreakdown(defenseBreakdown, "Defense")}
            </div>
          </li>
          <li className="app__characterBlock-stat">
            <span>Vitality: {currentHealth}/{combat.health}</span>
            <div className="app__characterBlock-tooltip" role="tooltip">
              {formatStatBreakdown(healthBreakdown, "Vitality")}
            </div>
          </li>
          <li>Spirit Stones: {money}</li>
        </ul>
      </div>
    </div>
  );
};
