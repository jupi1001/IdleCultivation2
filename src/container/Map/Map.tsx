import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Map.css";
import images from "../../constants/images";
import MapAreaComponent from "../../components/MapArea/MapAreaComponent";
import {
  AREA_REALM_REQUIREMENTS,
  formatRealmRequirement,
} from "../../constants/areaRealmRequirements";
import { CombatArea } from "../../enum/CombatArea";
import { ContentArea } from "../../enum/ContentArea";
import { changeContent } from "../../state/reducers/contentSlice";
import { RootState } from "../../state/store";

export const Map = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);

  return (
    <div className="map__main">
      <MapAreaComponent
        image={images.farm}
        text={CombatArea.FARM}
        information="Level 1"
        requiredRealm={AREA_REALM_REQUIREMENTS[CombatArea.FARM]}
        requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[CombatArea.FARM])}
        characterRealm={character.realm}
        characterRealmLevel={character.realmLevel}
      />
      <MapAreaComponent
        image={images.cave}
        text={CombatArea.CAVE}
        information="Level 5"
        requiredRealm={AREA_REALM_REQUIREMENTS[CombatArea.CAVE]}
        requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[CombatArea.CAVE])}
        characterRealm={character.realm}
        characterRealmLevel={character.realmLevel}
      />
      <MapAreaComponent
        image={images.cyrstalCave}
        text={CombatArea.CRYSTALCAVE}
        information="Level 10"
        requiredRealm={AREA_REALM_REQUIREMENTS[CombatArea.CRYSTALCAVE]}
        requiredRealmLabel={formatRealmRequirement(AREA_REALM_REQUIREMENTS[CombatArea.CRYSTALCAVE])}
        characterRealm={character.realm}
        characterRealmLevel={character.realmLevel}
      />
      <div
        className="map__immortals-island"
        onClick={() => dispatch(changeContent(ContentArea.IMMORTALS_ISLAND))}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && dispatch(changeContent(ContentArea.IMMORTALS_ISLAND))}
      >
        <h4>Immortals Island</h4>
        <p className="map__immortals-island-hint">Coming soon</p>
      </div>
    </div>
  );
};
