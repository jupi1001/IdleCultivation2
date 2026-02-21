import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { formatRealm } from "../../constants/realmProgression";
import { getEffectiveCombatStats } from "../../state/selectors/characterSelectors";
import "./CharacterBlock.css";

export const CharacterBlock = () => {
  const character = useSelector((state: RootState) => state.character);
  const combat = useSelector(getEffectiveCombatStats);

  return (
    <div className="app__characterBlock">
      <h2>Realm: {formatRealm(character.realm, character.realmLevel)}</h2>
      {character.path != null && (
        <p className="app__characterBlock-path">Path: {character.path}</p>
      )}
      <div className="app__characterBlock-items">
        <ul className="app__characterBlock-ul">
          <li>Qi: {Math.round(character.qi * 100) / 100}</li>
          <li>Attack: {combat.attack}</li>
          <li>Defense: {combat.defense}</li>
          <li>Vitality: {character.currentHealth}/{combat.health}</li>
          <li>Spirit Stones: {character.money}</li>
        </ul>
      </div>
    </div>
  );
};
