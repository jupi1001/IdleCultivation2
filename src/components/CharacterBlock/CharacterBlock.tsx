import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { formatRealm } from "../../constants/realmProgression";
import { getEffectiveCombatStats } from "../../state/selectors/characterSelectors";
import {
  getAttackBreakdown,
  getDefenseBreakdown,
  getHealthBreakdown,
  getQiBreakdown,
  formatStatBreakdown,
} from "./characterBlockUtils";
import "./CharacterBlock.css";

export const CharacterBlock = () => {
  const character = useSelector((state: RootState) => state.character);
  const combat = useSelector(getEffectiveCombatStats);
  const attackBreakdown = useSelector(getAttackBreakdown);
  const defenseBreakdown = useSelector(getDefenseBreakdown);
  const healthBreakdown = useSelector(getHealthBreakdown);
  const qiBreakdown = useSelector(getQiBreakdown);

  return (
    <div className="app__characterBlock">
      <h2>Realm: {formatRealm(character.realm, character.realmLevel)}</h2>
      {character.path != null && (
        <p className="app__characterBlock-path">Path: {character.path}</p>
      )}
      <div className="app__characterBlock-items">
        <ul className="app__characterBlock-ul">
          <li className="app__characterBlock-stat">
            <span>Qi: {Math.round(character.qi * 100) / 100}</span>
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
            <span>Vitality: {character.currentHealth}/{combat.health}</span>
            <div className="app__characterBlock-tooltip" role="tooltip">
              {formatStatBreakdown(healthBreakdown, "Vitality")}
            </div>
          </li>
          <li>Spirit Stones: {character.money}</li>
        </ul>
      </div>
    </div>
  );
};
