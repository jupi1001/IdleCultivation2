import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import GatheringArea from "../../components/GatheringArea/GatheringArea";
import { SkillActivityLayout } from "../../components/SkillActivityLayout/SkillActivityLayout";
import { gatheringAreaData, ITEMS_BY_ID } from "../../constants/data";
import { GATHERING_MAX_LEVEL, getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getTierForGatheringAreaIndex } from "../../constants/skillingSets";
import { useSkillActivity } from "../../hooks/useSkillActivity";
import type GatheringAreaI from "../../interfaces/GatheringAreaI";
import { getOwnedRingAmuletIds, getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import { isSkillAreaUnlocked } from "../../utils/contentRules";
import { getGatheringAreaLootEntries } from "../../utils/skillingLoot";
import "./GatheringContainer.css";

const GatheringContainer = () => {
  const {
    currentAreaState,
    xp: gatheringXP,
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
  } = useSkillActivity<GatheringAreaI>({
    kind: "gathering",
    areaData: gatheringAreaData,
    getLevelInfo: getGatheringLevelInfo,
    maxLevel: GATHERING_MAX_LEVEL,
  });

  const currentGatheringArea = currentAreaState as { areaId?: number } | null;
  const ownedRingAmuletIds = useSelector(getOwnedRingAmuletIds);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedLootIds = useMemo(
    () => new Set([...ownedRingAmuletIds, ...ownedSkillingSetPieceIds]),
    [ownedRingAmuletIds, ownedSkillingSetPieceIds]
  );

  return (
    <SkillActivityLayout
      skillName="Gathering"
      levelInfo={levelInfo}
      maxLevel={maxLevel}
      busyWithOther={busyWithOther}
      activityLabel={activityLabel}
      isActive={isActive}
      stopLabel="Stop gathering"
      progress={progress}
      onStop={stop}
      blockClass="gatheringContainer"
    >
      {areasVisible.map((area) => {
        const unlocked = isSkillAreaUnlocked(area, gatheringXP, reincarnationCount);
        const tier = getTierForGatheringAreaIndex(gatheringAreaData.indexOf(area));
        const lootEntries = getGatheringAreaLootEntries(area, tier);
        return (
          <GatheringArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            xp={area.xp}
            delay={area.delay}
            requiredLevel={getGatheringLevelInfo(area.xpUnlock).level}
            possibleLoot={area.gatheringLootIds
              .map((id) => ITEMS_BY_ID[id])
              .filter((l): l is NonNullable<typeof l> => l != null)}
            lootEntries={lootEntries.length > 0 ? lootEntries : undefined}
            ownedRingAmuletIds={ownedLootIds}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentGatheringArea?.areaId === area.id) return;
              stop();
              start(area);
            }}
          />
        );
      })}
    </SkillActivityLayout>
  );
};

export default GatheringContainer;
