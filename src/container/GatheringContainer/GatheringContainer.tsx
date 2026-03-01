import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentGatheringArea } from "../../state/reducers/characterSlice";
import "./GatheringContainer.css";
import { RootState } from "../../state/store";
import GatheringArea from "../../components/GatheringArea/GatheringArea";
import { gatheringAreaData, gatheringLootTypes } from "../../constants/data";
import { getRingAmuletItemById } from "../../constants/ringsAmulets";
import { getSkillingSetItemById, getSetPieceIds, getTierForGatheringAreaIndex } from "../../constants/skillingSets";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { GATHERING_MAX_LEVEL, getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getOwnedRingAmuletIds, getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import type { LootTableEntry } from "../../components/LootTablePopover/LootTablePopover";

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
  const ownedRingAmuletIds = useSelector(getOwnedRingAmuletIds);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedLootIds = useMemo(
    () => new Set([...ownedRingAmuletIds, ...ownedSkillingSetPieceIds]),
    [ownedRingAmuletIds, ownedSkillingSetPieceIds]
  );
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
    gatheringLootIds: number[],
    rareDropChancePercent?: number,
    rareDropItemIds?: number[]
  ) => {
    dispatch(
      setCurrentGatheringArea({ areaId, gatheringXP, gatheringDelay, gatheringLootIds, rareDropChancePercent, rareDropItemIds })
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
      <div className="gatheringContainer__areas">
      {gatheringAreaData.map((area, areaIndex) => {
        const unlocked = character.gatheringXP >= area.gatheringXPUnlock;
        const tier = getTierForGatheringAreaIndex(areaIndex);
        const setPieceIds = getSetPieceIds("gathering", tier);
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
            lootEntries={(() => {
              const n = area.gatheringLootIds.length;
              const lootChancePercent = n > 0 ? Math.round(100 / n) : 0;
              const entries: LootTableEntry[] = area.gatheringLootIds
                .map((id) => gatheringLootTypes.find((l) => l.id === id))
                .filter((l): l is NonNullable<typeof l> => l != null)
                .map((item) => ({ item, chancePercent: lootChancePercent }));
              if (area.rareDropChancePercent != null && area.rareDropItemIds?.length) {
                for (const id of area.rareDropItemIds) {
                  const rare = getRingAmuletItemById(id);
                  if (rare) entries.push({ item: rare, chancePercent: area.rareDropChancePercent });
                }
              }
              const setChancePercent = 1 / 4;
              for (const pieceId of setPieceIds) {
                const piece = getSkillingSetItemById(pieceId);
                if (piece) entries.push({ item: piece, chancePercent: setChancePercent });
              }
              return entries.length > 0 ? entries : undefined;
            })()}
            ownedRingAmuletIds={ownedLootIds}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentGatheringArea?.areaId === area.id) return;
              stopGathering();
              startGathering(
                area.id,
                area.gatheringXP,
                area.gatheringDelay,
                area.gatheringLootIds,
                area.rareDropChancePercent,
                area.rareDropItemIds
              );
            }}
          />
        );
      })}
      </div>
    </div>
  );
};

export default GatheringContainer;
