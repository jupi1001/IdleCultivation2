import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentMiningArea } from "../../state/reducers/characterSlice";
import "./MiningContainer.css";
import { RootState } from "../../state/store";
import MiningArea from "../../components/MiningArea/MiningArea";
import { miningAreaData, oreTypes } from "../../constants/data";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { MINING_MAX_LEVEL, getMiningLevelInfo } from "../../constants/miningLevel";

const TICK_MS = 80;

const MiningContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { currentActivity, currentMiningArea, miningCastStartTime, miningCastDuration } =
    character;
  const [, setTick] = useState(0);
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "mine";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getMiningLevelInfo(character.miningXP);
  const isMining = currentActivity === "mine" && currentMiningArea != null;

  const progress =
    miningCastStartTime != null && miningCastDuration > 0
      ? Math.min(
          100,
          ((Date.now() - miningCastStartTime) / miningCastDuration) * 100
        )
      : 0;

  useEffect(() => {
    if (miningCastStartTime == null) return;
    const id = setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [miningCastStartTime]);

  const startMining = (areaId: number, miningXP: number, miningDelay: number, miningLootId: number) => {
    dispatch(
      setCurrentMiningArea({ areaId, miningXP, miningDelay, miningLootId })
    );
    dispatch(setCurrentActivity("mine"));
  };

  const stopMining = () => {
    dispatch(setCurrentMiningArea(null));
    dispatch(setCurrentActivity("none"));
  };

  const xpBarPct =
    levelInfo.xpRequiredForNext > 0
      ? (levelInfo.xpInLevel / levelInfo.xpRequiredForNext) * 100
      : 100;

  return (
    <div className="miningContainer__main">
      <h2>
        Mining Level {levelInfo.level}/{MINING_MAX_LEVEL}
      </h2>
      <div className="miningContainer__level">
        <span className="miningContainer__xp-text">
          XP{" "}
          {levelInfo.xpRequiredForNext > 0
            ? `${levelInfo.xpInLevel} / ${levelInfo.xpRequiredForNext}`
            : "Max"}
        </span>
        <div className="miningContainer__xp-bar-track">
          <div
            className="miningContainer__xp-bar-fill"
            style={{ width: `${xpBarPct}%` }}
          />
        </div>
      </div>
      {busyWithOther && (
        <p className="miningContainer__busy">
          You're busy ({activityLabel}). One activity at a time.
        </p>
      )}
      {isMining && (
        <button
          type="button"
          className="miningContainer__stop"
          onClick={stopMining}
        >
          Stop mining
        </button>
      )}
      <div
        className="miningContainer__cast-bar progress-bar"
        style={{ width: `${progress}%` }}
      />
      {miningAreaData.map((area) => {
        const unlocked = character.miningXP >= area.miningXPUnlock;
        return (
          <MiningArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            miningXP={area.miningXP}
            miningDelay={area.miningDelay}
            requiredLevel={getMiningLevelInfo(area.miningXPUnlock).level}
            possibleLoot={(() => {
              const ore = oreTypes.find((o) => o.id === area.miningLootId);
              return ore ? [ore] : [];
            })()}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentMiningArea?.areaId === area.id) return;
              stopMining();
              startMining(area.id, area.miningXP, area.miningDelay, area.miningLootId);
            }}
          />
        );
      })}
    </div>
  );
};

export default MiningContainer;
