import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentFishingArea } from "../../state/reducers/characterSlice";
import "./FishingContainer.css";
import { RootState } from "../../state/store";
import FishingArea from "../../components/FishingArea/FishingArea";
import { fishTypes, fishingAreaData } from "../../constants/data";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { FISHING_MAX_LEVEL, getFishingLevelInfo } from "../../constants/fishingLevel";

const TICK_MS = 80;

const FishingContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { currentActivity, currentFishingArea, fishingCastStartTime, fishingCastDuration } =
    character;
  const [, setTick] = useState(0);
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "fish";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getFishingLevelInfo(character.fishingXP);
  const isFishing = currentActivity === "fish" && currentFishingArea != null;

  const progress =
    fishingCastStartTime != null && fishingCastDuration > 0
      ? Math.min(
          100,
          ((Date.now() - fishingCastStartTime) / fishingCastDuration) * 100
        )
      : 0;

  useEffect(() => {
    if (fishingCastStartTime == null) return;
    const id = setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [fishingCastStartTime]);

  const startFishing = (areaId: number, fishingXP: number, fishingDelay: number, fishingLootIds: number[]) => {
    dispatch(
      setCurrentFishingArea({ areaId, fishingXP, fishingDelay, fishingLootIds })
    );
    dispatch(setCurrentActivity("fish"));
  };

  const stopFishing = () => {
    dispatch(setCurrentFishingArea(null));
    dispatch(setCurrentActivity("none"));
  };

  const xpBarPct =
    levelInfo.xpRequiredForNext > 0
      ? (levelInfo.xpInLevel / levelInfo.xpRequiredForNext) * 100
      : 100;

  return (
    <div className="fishingContainer__main">
      <h2>
        Fishing Level {levelInfo.level}/{FISHING_MAX_LEVEL}
      </h2>
      <div className="fishingContainer__level">
        <span className="fishingContainer__xp-text">
          XP{" "}
          {levelInfo.xpRequiredForNext > 0
            ? `${levelInfo.xpInLevel} / ${levelInfo.xpRequiredForNext}`
            : "Max"}
        </span>
        <div className="fishingContainer__xp-bar-track">
          <div
            className="fishingContainer__xp-bar-fill"
            style={{ width: `${xpBarPct}%` }}
          />
        </div>
      </div>
      {busyWithOther && (
        <p className="fishingContainer__busy">
          You're busy ({activityLabel}). One activity at a time.
        </p>
      )}
      {isFishing && (
        <button
          type="button"
          className="fishingContainer__stop"
          onClick={stopFishing}
        >
          Stop fishing
        </button>
      )}
      <div
        className="fishingContainer__cast-bar progress-bar"
        style={{ width: `${progress}%` }}
      />
      {fishingAreaData.map((area) => {
        const unlocked = character.fishingXP >= area.fishingXPUnlock;
        return (
          <FishingArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            fishingXP={area.fishingXP}
            fishingDelay={area.fishingDelay}
            requiredLevel={getFishingLevelInfo(area.fishingXPUnlock).level}
            possibleLoot={area.fishingLootIds
              .map((id) => fishTypes.find((f) => f.id === id))
              .filter((f): f is NonNullable<typeof f> => f != null)}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentFishingArea?.areaId === area.id) return;
              stopFishing();
              startFishing(area.id, area.fishingXP, area.fishingDelay, area.fishingLootIds);
            }}
          />
        );
      })}
    </div>
  );
};

export default FishingContainer;
