import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActivity, setCurrentFishingArea } from "../../state/reducers/characterSlice";
import "./FishingContainer.css";
import { RootState } from "../../state/store";
import FishingArea from "../../components/FishingArea/FishingArea";
import { fishTypes, fishingAreaData } from "../../constants/data";
import { getRingAmuletItemById } from "../../constants/ringsAmulets";
import { getSkillingSetItemById, getSetPieceIds, getTierForFishingAreaIndex } from "../../constants/skillingSets";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { FISHING_MAX_LEVEL, getFishingLevelInfo } from "../../constants/fishingLevel";
import { getOwnedRingAmuletIds, getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import { SkillXPBar } from "../../components/SkillXPBar/SkillXPBar";
import { useCastProgress } from "../../hooks/useCastProgress";
import type { LootTableEntry } from "../../components/LootTablePopover/LootTablePopover";

const FishingContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { currentActivity, currentFishingArea, fishingCastStartTime, fishingCastDuration } =
    character;
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "fish";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const levelInfo = getFishingLevelInfo(character.fishingXP);
  const ownedRingAmuletIds = useSelector(getOwnedRingAmuletIds);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedLootIds = useMemo(
    () => new Set([...ownedRingAmuletIds, ...ownedSkillingSetPieceIds]),
    [ownedRingAmuletIds, ownedSkillingSetPieceIds]
  );
  const isFishing = currentActivity === "fish" && currentFishingArea != null;
  const progress = useCastProgress(fishingCastStartTime, fishingCastDuration);
  const reincarnationCount = character.reincarnationCount ?? 0;
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
        const reincarnationOk = !area.requiresReincarnation || reincarnationCount >= 1;
        const unlocked = character.fishingXP >= area.fishingXPUnlock && reincarnationOk;
        const tier = getTierForFishingAreaIndex(fishingAreaData.indexOf(area));
        const setPieceIds = getSetPieceIds("fishing", tier);
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
            lootEntries={(() => {
              const n = area.fishingLootIds.length;
              const fishChancePercent = n > 0 ? Math.round(100 / n) : 0;
              const fishEntries: LootTableEntry[] = area.fishingLootIds
                .map((id) => fishTypes.find((f) => f.id === id))
                .filter((f): f is NonNullable<typeof f> => f != null)
                .map((item) => ({ item, chancePercent: fishChancePercent }));
              if (area.rareDropChancePercent != null && area.rareDropItemIds?.length) {
                for (const id of area.rareDropItemIds) {
                  const rare = getRingAmuletItemById(id);
                  if (rare) fishEntries.push({ item: rare, chancePercent: area.rareDropChancePercent });
                }
              }
              const setChancePercent = 1 / 4; // 1% total for one random piece → 0.25% per piece
              for (const pieceId of setPieceIds) {
                const piece = getSkillingSetItemById(pieceId);
                if (piece) fishEntries.push({ item: piece, chancePercent: setChancePercent });
              }
              return fishEntries.length > 0 ? fishEntries : undefined;
            })()}
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
