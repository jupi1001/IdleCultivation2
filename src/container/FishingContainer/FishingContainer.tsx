import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentFishingArea } from "../../state/reducers/characterSlice";
import "./FishingContainer.css";
import FishingArea from "../../components/FishingArea/FishingArea";
import { fishingAreaData, ITEMS_BY_ID } from "../../constants/data";
import { getTierForFishingAreaIndex } from "../../constants/skillingSets";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { FISHING_MAX_LEVEL, getFishingLevelInfo } from "../../constants/fishingLevel";
import { isSkillAreaUnlocked } from "../../utils/contentRules";
import { getFishingAreaLootEntries } from "../../utils/skillingLoot";
import { getOwnedRingAmuletIds, getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import {
  selectCurrentActivity,
  selectCurrentFishingArea,
  selectFishingCastStartTime,
  selectFishingCastDuration,
  selectFishingXP,
  selectReincarnationCount,
} from "../../state/selectors/characterSelectors";
import { SkillXPBar } from "../../components/SkillXPBar/SkillXPBar";
import { useCastProgress } from "../../hooks/useCastProgress";

const FishingContainer = () => {
  const dispatch = useDispatch();
  const currentActivity = useSelector(selectCurrentActivity);
  const currentFishingArea = useSelector(selectCurrentFishingArea);
  const fishingCastStartTime = useSelector(selectFishingCastStartTime);
  const fishingCastDuration = useSelector(selectFishingCastDuration);
  const fishingXP = useSelector(selectFishingXP);
  const reincarnationCount = useSelector(selectReincarnationCount) ?? 0;
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "fish";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getFishingLevelInfo(fishingXP);
  const ownedRingAmuletIds = useSelector(getOwnedRingAmuletIds);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedLootIds = useMemo(
    () => new Set([...ownedRingAmuletIds, ...ownedSkillingSetPieceIds]),
    [ownedRingAmuletIds, ownedSkillingSetPieceIds]
  );
  const isFishing = currentActivity === "fish" && currentFishingArea != null;
  const progress = useCastProgress(fishingCastStartTime, fishingCastDuration);
  const areasVisible = useMemo(
    () =>
      fishingAreaData.filter(
        (area) => !area.requiresReincarnation || reincarnationCount >= 1
      ),
    [reincarnationCount]
  );

  const startFishing = (areaId: number, fishingXP: number, fishingDelay: number, fishingLootIds: number[], rareDropChancePercent?: number, rareDropItemIds?: number[]) => {
    dispatch(
      setCurrentFishingArea({ areaId, fishingXP, fishingDelay, fishingLootIds, rareDropChancePercent, rareDropItemIds })
    );
    dispatch(setCurrentActivity("fish"));
  };

  const stopFishing = () => {
    dispatch(setCurrentFishingArea(null));
    dispatch(setCurrentActivity("none"));
  };

  return (
    <div className="fishingContainer__main">
      <SkillXPBar
        skillName="Fishing"
        level={levelInfo.level}
        maxLevel={FISHING_MAX_LEVEL}
        xpInLevel={levelInfo.xpInLevel}
        xpRequiredForNext={levelInfo.xpRequiredForNext}
      />
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
      <div className="fishingContainer__areas">
      {areasVisible.map((area, areaIndex) => {
        const unlocked = isSkillAreaUnlocked(area, fishingXP, reincarnationCount, "fishingXPUnlock");
        const tier = getTierForFishingAreaIndex(fishingAreaData.indexOf(area));
        const lootEntries = getFishingAreaLootEntries(area, tier);
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
              .map((id) => ITEMS_BY_ID[id])
              .filter((f): f is NonNullable<typeof f> => f != null)}
            lootEntries={lootEntries.length > 0 ? lootEntries : undefined}
            ownedRingAmuletIds={ownedLootIds}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentFishingArea?.areaId === area.id) return;
              stopFishing();
              startFishing(area.id, area.fishingXP, area.fishingDelay, area.fishingLootIds, area.rareDropChancePercent, area.rareDropItemIds);
            }}
          />
        );
      })}
      </div>
    </div>
  );
};

export default FishingContainer;
