import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import FishingArea from "../../components/FishingArea/FishingArea";
import { SkillActivityLayout } from "../../components/SkillActivityLayout/SkillActivityLayout";
import { fishingAreaData, ITEMS_BY_ID } from "../../constants/data";
import { FISHING_MAX_LEVEL, getFishingLevelInfo } from "../../constants/fishingLevel";
import { getTierForFishingAreaIndex } from "../../constants/skillingSets";
import { useSkillActivity } from "../../hooks/useSkillActivity";
import type FishingAreaI from "../../interfaces/FishingAreaI";
import { getOwnedRingAmuletIds, getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import { isSkillAreaUnlocked } from "../../utils/contentRules";
import { getFishingAreaLootEntries } from "../../utils/skillingLoot";
import "./FishingContainer.css";

const FishingContainer = () => {
  const {
    currentAreaState: currentFishingArea,
    xp: fishingXP,
    reincarnationCount,
    levelInfo,
    maxLevel,
    progress,
    areasVisible,
    isActive,
    busyWithOther,
    activityLabel,
    start,
    stop,
  } = useSkillActivity<"fishing", FishingAreaI>({
    kind: "fishing",
    areaData: fishingAreaData,
    getLevelInfo: getFishingLevelInfo,
    maxLevel: FISHING_MAX_LEVEL,
  });
  const ownedRingAmuletIds = useSelector(getOwnedRingAmuletIds);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedLootIds = useMemo(
    () => new Set([...ownedRingAmuletIds, ...ownedSkillingSetPieceIds]),
    [ownedRingAmuletIds, ownedSkillingSetPieceIds]
  );

  return (
    <SkillActivityLayout
      skillName="Fishing"
      levelInfo={levelInfo}
      maxLevel={maxLevel}
      busyWithOther={busyWithOther}
      activityLabel={activityLabel}
      isActive={isActive}
      stopLabel="Stop fishing"
      progress={progress}
      onStop={stop}
      blockClass="fishingContainer"
    >
      {areasVisible.map((area) => {
        const unlocked = isSkillAreaUnlocked(area, fishingXP, reincarnationCount);
        const tier = getTierForFishingAreaIndex(fishingAreaData.indexOf(area));
        const lootEntries = getFishingAreaLootEntries(area, tier);
        return (
          <FishingArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            xp={area.xp}
            delay={area.delay}
            requiredLevel={getFishingLevelInfo(area.xpUnlock).level}
            possibleLoot={area.fishingLootIds
              .map((id) => ITEMS_BY_ID[id])
              .filter((f): f is NonNullable<typeof f> => f != null)}
            lootEntries={lootEntries.length > 0 ? lootEntries : undefined}
            ownedRingAmuletIds={ownedLootIds}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentFishingArea?.areaId === area.id) return;
              stop();
              start(area);
            }}
          />
        );
      })}
    </SkillActivityLayout>
  );
};

export default FishingContainer;
