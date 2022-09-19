import React from "react";
import "./Map.css";
import images from "../../constants/images";
import MapAreaComponent from "../../components/MapArea/MapAreaComponent";

export const Map = () => {
  return (
    <div className="map__main">
      <MapAreaComponent image={images.farm} text="Farm" information="Level 1" />
      <MapAreaComponent image={images.cave} text="Cave" information="Level 5" />
      <MapAreaComponent image={images.cyrstalCave} text="CrystalCave" information="Level 10" />
    </div>
  );
};
