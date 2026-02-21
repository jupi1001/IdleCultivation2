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
  /** Optional; if omitted, only "Requires …" is shown when locked */
  information?: string;
  requiredRealm?: RealmRequirement;
  requiredRealmLabel?: string;
  characterRealm?: RealmId;
  characterRealmLevel?: number;
}

const MapAreaComponent: React.FC<MapAreaProps> = ({
  image,
  text,
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
      <h4 className="mapAreaComponent__title">{text}</h4>
      <div className="mapAreaComponent__image-wrap" onClick={() => canEnter && handleOnClick(text)}>
        <img
          className="mapAreaComponent__main-image"
          src={image}
          alt={text}
        />
      </div>
      <div className="mapAreaComponent__divider" />
      <div className="mapAreaComponent__footer">
        {requiredRealmLabel && (
          <p className="mapAreaComponent__main-requirement">Requires {requiredRealmLabel}</p>
        )}
      </div>
    </div>
  );
};

export default MapAreaComponent;
