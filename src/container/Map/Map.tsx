import React from "react";
import { useDispatch } from "react-redux";
import "./Map.css";
import images from "../../constants/images";
import MapAreaComponent from "../../components/MapArea/MapAreaComponent";
import { CombatArea } from "../../enum/CombatArea";
import { ContentArea } from "../../enum/ContentArea";
import { changeContent } from "../../state/reducers/contentSlice";

export const Map = () => {
  const dispatch = useDispatch();

  return (
    <div className="map__main">
      <MapAreaComponent image={images.farm} text={CombatArea.FARM} information="Level 1" />
      <MapAreaComponent image={images.cave} text={CombatArea.CAVE} information="Level 5" />
      <MapAreaComponent image={images.cyrstalCave} text={CombatArea.CRYSTALCAVE} information="Level 10" />
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
