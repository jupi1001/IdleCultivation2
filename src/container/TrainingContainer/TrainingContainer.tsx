import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MapAreaComponent from "../../components/MapArea/MapAreaComponent";
import {
  AREA_REALM_REQUIREMENTS,
  formatRealmRequirement,
} from "../../constants/areaRealmRequirements";
import { CombatArea } from "../../enum/CombatArea";
import { ContentArea } from "../../enum/ContentArea";
import { changeContent } from "../../state/reducers/contentSlice";
import { RootState } from "../../state/store";
import { EXPLORATION_ASSETS } from "../../constants/exploration";
import "./TrainingContainer.css";

export const TrainingContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);

  return (
    <div className="trainingContainer__main">
      <h2>Martial Training</h2>
      <p className="trainingContainer__intro">Choose a training area to face trials and earn rewards.</p>
      <div className="trainingContainer__areas">
        <MapAreaComponent
          image={`${EXPLORATION_ASSETS}/farm.jpg`}
          text={CombatArea.FARM}
          information="Level 1"
          requiredRealm={AREA_REALM_REQUIREMENTS[CombatArea.FARM]}
          requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[CombatArea.FARM])}
          characterRealm={character.realm}
          characterRealmLevel={character.realmLevel}
        />
        <MapAreaComponent
          image={`${EXPLORATION_ASSETS}/cave.png`}
          text={CombatArea.CAVE}
          information="Level 5"
          requiredRealm={AREA_REALM_REQUIREMENTS[CombatArea.CAVE]}
          requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[CombatArea.CAVE])}
          characterRealm={character.realm}
          characterRealmLevel={character.realmLevel}
        />
        <MapAreaComponent
          image={`${EXPLORATION_ASSETS}/crystalCave.jpg`}
          text={CombatArea.CRYSTALCAVE}
          information="Level 10"
          requiredRealm={AREA_REALM_REQUIREMENTS[CombatArea.CRYSTALCAVE]}
          requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[CombatArea.CRYSTALCAVE])}
          characterRealm={character.realm}
          characterRealmLevel={character.realmLevel}
        />
        <div
          className="trainingContainer__immortals"
          onClick={() => dispatch(changeContent(ContentArea.IMMORTALS_ISLAND))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && dispatch(changeContent(ContentArea.IMMORTALS_ISLAND))}
        >
          <h4>Immortals Island</h4>
          <p className="trainingContainer__immortals-hint">Send expeditions for rewards</p>
        </div>
      </div>
    </div>
  );
};
