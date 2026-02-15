import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFishingXP, addItem, setCurrentActivity } from "../../state/reducers/characterSlice";
import "./FishingContainer.css";
import { RootState } from "../../state/store";
import FishingArea from "../../components/FishingArea/FishingArea";
import { fishTypes, fishingAreaData } from "../../constants/data";
import { ACTIVITY_LABELS } from "../../constants/activities";

const FishingContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const [progress, setProgress] = useState(0);
  const [isFishing, setIsFishing] = useState(false);
  const busyWithOther =
    character.currentActivity !== "none" && character.currentActivity !== "fish";
  const activityLabel = ACTIVITY_LABELS[character.currentActivity] ?? character.currentActivity;

  const startFishing = (fishingXP: number, fishingDelay: number, fishingLootIds: number[]) => {
    dispatch(setCurrentActivity("fish"));
    setIsFishing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
    }, 30);
    setTimeout(() => {
      clearInterval(interval);
      dispatch(addFishingXP(fishingXP));

      const randomIndex = Math.floor(Math.random() * fishingLootIds.length);
      const randomFishId = fishingLootIds[randomIndex];
      const fish = fishTypes.find((fish) => fish.id === randomFishId);
      if (fish) {
        dispatch(addItem(fish));
      }
      setIsFishing(false);
      dispatch(setCurrentActivity("none"));
    }, fishingDelay);
  };

  return (
    <div className="fishingContainer__main">
      <h2>Fishing</h2>
      {busyWithOther && (
        <p className="fishingContainer__busy">
          You're busy ({activityLabel}). One activity at a time.
        </p>
      )}
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
              onClick={() =>
                !isFishing &&
                !busyWithOther &&
                startFishing(area.fishingXP, area.fishingDelay, area.fishingLootIds)
              }
            />
          )
      )}
    </div>
  );
};

export default FishingContainer;
