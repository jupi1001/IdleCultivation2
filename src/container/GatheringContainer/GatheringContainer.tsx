import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentGatheringArea } from "../../state/reducers/characterSlice";
import "./GatheringContainer.css";
import { RootState } from "../../state/store";
import GatheringArea from "../../components/GatheringArea/GatheringArea";
import { gatheringAreaData, gatheringLootTypes } from "../../constants/data";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { GATHERING_MAX_LEVEL, getGatheringLevelInfo } from "../../constants/gatheringLevel";

const TICK_MS = 80;

const GatheringContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { currentActivity, currentGatheringArea, gatheringCastStartTime, gatheringCastDuration } =
    character;
  const [, setTick] = useState(0);
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "gather";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getGatheringLevelInfo(character.gatheringXP);
  const isGathering = currentActivity === "gather" && currentGatheringArea != null;

  const progress =
    gatheringCastStartTime != null && gatheringCastDuration > 0
      ? Math.min(
          100,
          ((Date.now() - gatheringCastStartTime) / gatheringCastDuration) * 100
        )
      : 0;

  useEffect(() => {
    if (gatheringCastStartTime == null) return;
    const id = setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [gatheringCastStartTime]);

  const startGathering = (
    areaId: number,
    gatheringXP: number,
    gatheringDelay: number,
    gatheringLootIds: number[]
  ) => {
    dispatch(
      setCurrentGatheringArea({ areaId, gatheringXP, gatheringDelay, gatheringLootIds })
    );
    dispatch(setCurrentActivity("gather"));
  };

  const stopGathering = () => {
    dispatch(setCurrentGatheringArea(null));
    dispatch(setCurrentActivity("none"));
  };

  const xpBarPct =
    levelInfo.xpRequiredForNext > 0
      ? (levelInfo.xpInLevel / levelInfo.xpRequiredForNext) * 100
      : 100;

  return (
    <div className="gatheringContainer__main">
      <h2>
        Gathering Level {levelInfo.level}/{GATHERING_MAX_LEVEL}
      </h2>
      <div className="gatheringContainer__level">
        <span className="gatheringContainer__xp-text">
          XP{" "}
          {levelInfo.xpRequiredForNext > 0
            ? `${levelInfo.xpInLevel} / ${levelInfo.xpRequiredForNext}`
            : "Max"}
        </span>
        <div className="gatheringContainer__xp-bar-track">
          <div
            className="gatheringContainer__xp-bar-fill"
            style={{ width: `${xpBarPct}%` }}
          />
        </div>
      </div>
      {busyWithOther && (
        <p className="gatheringContainer__busy">
          You're busy ({activityLabel}). One activity at a time.
        </p>
      )}
      {isGathering && (
        <button
          type="button"
          className="gatheringContainer__stop"
          onClick={stopGathering}
        >
          Stop gathering
        </button>
      )}
      <div
        className="gatheringContainer__cast-bar progress-bar"
        style={{ width: `${progress}%` }}
      />
      {gatheringAreaData.map((area) => {
        const unlocked = character.gatheringXP >= area.gatheringXPUnlock;
        return (
          <GatheringArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            gatheringXP={area.gatheringXP}
            gatheringDelay={area.gatheringDelay}
            requiredLevel={getGatheringLevelInfo(area.gatheringXPUnlock).level}
            possibleLoot={area.gatheringLootIds
              .map((id) => gatheringLootTypes.find((l) => l.id === id))
              .filter((l): l is NonNullable<typeof l> => l != null)}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentGatheringArea?.areaId === area.id) return;
              stopGathering();
              startGathering(
                area.id,
                area.gatheringXP,
                area.gatheringDelay,
                area.gatheringLootIds
              );
            }}
          />
        );
      })}
    </div>
  );
};

export default GatheringContainer;
