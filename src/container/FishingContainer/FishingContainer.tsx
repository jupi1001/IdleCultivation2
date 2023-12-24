import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFishingXP, addItem } from "../../state/reducers/characterSlice";
import "./FishingContainer.css";
import { RootState } from "../../state/store";
import FishingArea from "../../components/FishingArea/FishingArea";
import { fishTypes, fishingAreaData } from "../../constants/data";

const FishingContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const [progress, setProgress] = useState(0);

  const startFishing = (fishingXP: number, fishingDelay: number, fishingLootIds: number[]) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
    }, 30);
    setTimeout(() => {
      clearInterval(interval);
      dispatch(addFishingXP(fishingXP));

      // Randomly select a fish from the fishingLootIds array
      const randomIndex = Math.floor(Math.random() * fishingLootIds.length);
      const randomFishId = fishingLootIds[randomIndex];
      // Find the corresponding fish in the fishTypes array
      const fish = fishTypes.find((fish) => fish.id === randomFishId);
      // Add the fish to the inventory
      if (fish) {
        dispatch(addItem(fish));
      }
    }, fishingDelay);
  };

  return (
    <div className="fishingContainer__main">
      <h2>Fishing</h2>
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          height: 30,
          backgroundColor: "lightblue",
          borderRadius: "15px",
          transition: "width 0.075s ease-in-out",
        }}
      />
      {fishingAreaData.map(
        (area) =>
          character.fishingXP >= area.fishingXPUnlock && (
            <FishingArea
              key={area.id}
              title={area.name}
              imageSrc={area.picture}
              altText={area.name}
              fishingXP={area.fishingXP}
              fishingDelay={area.fishingDelay}
              onClick={() => startFishing(area.fishingXP, area.fishingDelay, area.fishingLootIds)}
            />
          )
      )}
    </div>
  );
};

export default FishingContainer;
