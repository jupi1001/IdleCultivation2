import React from "react";
import { useSelector } from "react-redux";
import MapAreaComponent from "../../components/MapArea/MapAreaComponent";
import {
  AREA_REALM_REQUIREMENTS,
  formatRealmRequirement,
} from "../../constants/areaRealmRequirements";
import { TRAINING_ASSETS, TRAINING_AREA_IMAGE_SLUG, TRAINING_AREA_ORDER } from "../../constants/training";
import { RootState } from "../../state/store";
import "./TrainingContainer.css";

export const TrainingContainer = () => {
  const character = useSelector((state: RootState) => state.character);

  return (
    <div className="trainingContainer__main">
      <h2>Martial Training</h2>
      <p className="trainingContainer__intro">Choose a training area to face trials and earn rewards.</p>
      <div className="trainingContainer__areas">
        {TRAINING_AREA_ORDER.map((area) => (
          <MapAreaComponent
            key={area}
            image={`${TRAINING_ASSETS}/${TRAINING_AREA_IMAGE_SLUG[area]}.webp`}
            text={area}
            requiredRealm={AREA_REALM_REQUIREMENTS[area]}
            requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[area])}
            characterRealm={character.realm}
            characterRealmLevel={character.realmLevel}
          />
        ))}
      </div>
    </div>
  );
};
