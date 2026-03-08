import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentMiningArea } from "../../state/reducers/characterSlice";
import "./MiningContainer.css";
import MiningArea from "../../components/MiningArea/MiningArea";
import { miningAreaData, oreTypes } from "../../constants/data";
import { getSkillingSetItemById, getSetPieceIds, getTierForMiningAreaIndex } from "../../constants/skillingSets";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { MINING_MAX_LEVEL, getMiningLevelInfo } from "../../constants/miningLevel";
import { getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import {
  selectCurrentActivity,
  selectCurrentMiningArea,
  selectMiningCastStartTime,
  selectMiningCastDuration,
  selectMiningXP,
  selectReincarnationCount,
} from "../../state/selectors/characterSelectors";
import { SkillXPBar } from "../../components/SkillXPBar/SkillXPBar";
import { useCastProgress } from "../../hooks/useCastProgress";
import type { LootTableEntry } from "../../components/LootTablePopover/LootTablePopover";

const MiningContainer = () => {
  const dispatch = useDispatch();
  const currentActivity = useSelector(selectCurrentActivity);
  const currentMiningArea = useSelector(selectCurrentMiningArea);
  const miningCastStartTime = useSelector(selectMiningCastStartTime);
  const miningCastDuration = useSelector(selectMiningCastDuration);
  const miningXP = useSelector(selectMiningXP);
  const reincarnationCount = useSelector(selectReincarnationCount) ?? 0;
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "mine";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getMiningLevelInfo(miningXP);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const isMining = currentActivity === "mine" && currentMiningArea != null;
  const progress = useCastProgress(miningCastStartTime, miningCastDuration);
  const areasVisible = useMemo(
    () =>
      miningAreaData.filter(
        (area) => !area.requiresReincarnation || reincarnationCount >= 1
      ),
    [reincarnationCount]
  );

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

  return (
    <div className="miningContainer__main">
      <SkillXPBar
        skillName="Mining"
        level={levelInfo.level}
        maxLevel={MINING_MAX_LEVEL}
        xpInLevel={levelInfo.xpInLevel}
        xpRequiredForNext={levelInfo.xpRequiredForNext}
      />
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
      <div className="miningContainer__areas">
      {areasVisible.map((area, areaIndex) => {
        const reincarnationOk = !area.requiresReincarnation || reincarnationCount >= 1;
        const unlocked = miningXP >= area.miningXPUnlock && reincarnationOk;
        const tier = getTierForMiningAreaIndex(miningAreaData.indexOf(area));
        const setPieceIds = getSetPieceIds("mining", tier);
        const ore = oreTypes.find((o) => o.id === area.miningLootId);
        const lootEntries: LootTableEntry[] = ore
          ? [{ item: ore, chancePercent: 100 }]
          : [];
        const setChancePercent = 1 / 4;
        for (const pieceId of setPieceIds) {
          const piece = getSkillingSetItemById(pieceId);
          if (piece) lootEntries.push({ item: piece, chancePercent: setChancePercent });
        }
        return (
          <MiningArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            miningXP={area.miningXP}
            miningDelay={area.miningDelay}
            requiredLevel={getMiningLevelInfo(area.miningXPUnlock).level}
            possibleLoot={ore ? [ore] : []}
            lootEntries={lootEntries.length > 0 ? lootEntries : undefined}
            ownedItemIds={ownedSkillingSetPieceIds}
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
    </div>
  );
};

export default MiningContainer;
