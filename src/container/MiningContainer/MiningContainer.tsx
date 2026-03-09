import React from "react";
import { useSelector } from "react-redux";
import MiningArea from "../../components/MiningArea/MiningArea";
import { SkillActivityLayout } from "../../components/SkillActivityLayout/SkillActivityLayout";
import { miningAreaData, ITEMS_BY_ID } from "../../constants/data";
import { MINING_MAX_LEVEL, getMiningLevelInfo } from "../../constants/miningLevel";
import { getTierForMiningAreaIndex } from "../../constants/skillingSets";
import { useSkillActivity } from "../../hooks/useSkillActivity";
import type MiningAreaI from "../../interfaces/MiningAreaI";
import { getOwnedSkillingSetPieceIds } from "../../state/selectors/characterSelectors";
import { isSkillAreaUnlocked } from "../../utils/contentRules";
import { getMiningAreaLootEntries } from "../../utils/skillingLoot";
import "./MiningContainer.css";

const MiningContainer = () => {
  const {
    currentAreaState,
    xp: miningXP,
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
  } = useSkillActivity<MiningAreaI>({
    kind: "mining",
    areaData: miningAreaData,
    getLevelInfo: getMiningLevelInfo,
    maxLevel: MINING_MAX_LEVEL,
  });

  const currentMiningArea = currentAreaState as { areaId?: number } | null;
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);

  return (
    <SkillActivityLayout
      skillName="Mining"
      levelInfo={levelInfo}
      maxLevel={maxLevel}
      busyWithOther={busyWithOther}
      activityLabel={activityLabel}
      isActive={isActive}
      stopLabel="Stop mining"
      progress={progress}
      onStop={stop}
      blockClass="miningContainer"
    >
      {areasVisible.map((area) => {
        const unlocked = isSkillAreaUnlocked(area, miningXP, reincarnationCount);
        const tier = getTierForMiningAreaIndex(miningAreaData.indexOf(area));
        const lootEntries = getMiningAreaLootEntries(area, tier);
        const ore = ITEMS_BY_ID[area.miningLootId];
        return (
          <MiningArea
            key={area.id}
            title={area.name}
            imageSrc={area.picture}
            altText={area.altText}
            xp={area.xp}
            delay={area.delay}
            requiredLevel={getMiningLevelInfo(area.xpUnlock).level}
            possibleLoot={ore ? [ore] : []}
            lootEntries={lootEntries.length > 0 ? lootEntries : undefined}
            ownedItemIds={ownedSkillingSetPieceIds}
            unlocked={unlocked}
            onClick={() => {
              if (busyWithOther || !unlocked) return;
              if (currentMiningArea?.areaId === area.id) return;
              stop();
              start(area);
            }}
          />
        );
      })}
    </SkillActivityLayout>
  );
};

export default MiningContainer;
