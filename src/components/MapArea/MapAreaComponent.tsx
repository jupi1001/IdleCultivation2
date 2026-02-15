import React from "react";
import { useDispatch } from "react-redux";
import { canEnterArea } from "../../constants/areaRealmRequirements";
import type { RealmRequirement } from "../../constants/areaRealmRequirements";
import type { RealmId } from "../../constants/realmProgression";
import { changeContent } from "../../state/reducers/contentSlice";
import "./MapAreaComponent.css";
import { ContentArea } from "../../enum/ContentArea";

interface MapAreaProps {
  image: string;
  text: string;
  information: string;
  requiredRealm?: RealmRequirement;
  requiredRealmLabel?: string;
  characterRealm?: RealmId;
  characterRealmLevel?: number;
}

const MapAreaComponent: React.FC<MapAreaProps> = ({
  image,
  text,
  information,
  requiredRealm,
  requiredRealmLabel,
  characterRealm = "Mortal",
  characterRealmLevel = 0,
}) => {
  const dispatch = useDispatch();
  const canEnter =
    !requiredRealm || canEnterArea(characterRealm, characterRealmLevel, requiredRealm);

  const handleOnClick = (areaName: string) => {
    if (!canEnter) return;
    dispatch(changeContent(ContentArea.COMBAT + ":" + areaName));
  };

  return (
    <div
      className={`mapAreaComponent__main ${!canEnter ? "mapAreaComponent__main--locked" : ""}`}
    >
      <h4>{text}</h4>
      <img
        className="mapAreaComponent__main-image"
        src={image}
        alt={text}
        onClick={() => handleOnClick(text)}
      />
      <p>{information}</p>
      {!canEnter && requiredRealmLabel && (
        <p className="mapAreaComponent__main-requirement">Requires {requiredRealmLabel}</p>
      )}
    </div>
  );
};

export default MapAreaComponent;
