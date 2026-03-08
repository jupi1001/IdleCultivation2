import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentGatheringArea } from "../../state/reducers/characterSlice";
import "./GatheringContainer.css";
import GatheringArea from "../../components/GatheringArea/GatheringArea";
import { gatheringAreaData, ITEMS_BY_ID } from "../../constants/data";
import { getTierForGatheringAreaIndex } from "../../constants/skillingSets";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { GATHERING_MAX_LEVEL, getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { isSkillAreaUnlocked } from "../../utils/contentRules";
import { getGatheringAreaLootEntries } from "../../utils/skillingLoot";
import { getOwnedRingAmuletIds, getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import {
  selectCurrentActivity,
  selectCurrentGatheringArea,
  selectGatheringCastStartTime,
  selectGatheringCastDuration,
  selectGatheringXP,
  selectReincarnationCount,
} from "../../state/selectors/characterSelectors";
import { SkillXPBar } from "../../components/SkillXPBar/SkillXPBar";
import { useCastProgress } from "../../hooks/useCastProgress";

const GatheringContainer = () => {
  const dispatch = useDispatch();
  const currentActivity = useSelector(selectCurrentActivity);
  const currentGatheringArea = useSelector(selectCurrentGatheringArea);
  const gatheringCastStartTime = useSelector(selectGatheringCastStartTime);
  const gatheringCastDuration = useSelector(selectGatheringCastDuration);
  const gatheringXP = useSelector(selectGatheringXP);
  const reincarnationCount = useSelector(selectReincarnationCount) ?? 0;
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "gather";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getGatheringLevelInfo(gatheringXP);
  const ownedRingAmuletIds = useSelector(getOwnedRingAmuletIds);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedLootIds = useMemo(
    () => new Set([...ownedRingAmuletIds, ...ownedSkillingSetPieceIds]),
    [ownedRingAmuletIds, ownedSkillingSetPieceIds]
  );
  const isGathering = currentActivity === "gather" && currentGatheringArea != null;
  const progress = useCastProgress(gatheringCastStartTime, gatheringCastDuration);
  const areasVisible = useMemo(
    () =>
      gatheringAreaData.filter(
        (area) => !area.requiresReincarnation || reincarnationCount >= 1
      ),
    [reincarnationCount]
  );

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

  return (
    <div className="gatheringContainer__main">
      <SkillXPBar
        skillName="Gathering"
        level={levelInfo.level}
        maxLevel={GATHERING_MAX_LEVEL}
        xpInLevel={levelInfo.xpInLevel}
        xpRequiredForNext={levelInfo.xpRequiredForNext}
      />
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
      {areasVisible.map((area, areaIndex) => {
        const unlocked = isSkillAreaUnlocked(area, gatheringXP, reincarnationCount, "gatheringXPUnlock");
        const tier = getTierForGatheringAreaIndex(gatheringAreaData.indexOf(area));
        const lootEntries = getGatheringAreaLootEntries(area, tier);
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
              .map((id) => ITEMS_BY_ID[id])
              .filter((l): l is NonNullable<typeof l> => l != null)}
            lootEntries={lootEntries.length > 0 ? lootEntries : undefined}
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
