import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import MiningArea from "../../components/MiningArea/MiningArea";
import { SkillXPBar } from "../../components/SkillXPBar/SkillXPBar";
import { miningAreaData, ITEMS_BY_ID } from "../../constants/data";
import { MINING_MAX_LEVEL, getMiningLevelInfo } from "../../constants/miningLevel";
import { getSkillingSetItemById, getSetPieceIds, getTierForMiningAreaIndex } from "../../constants/skillingSets";
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
    <div className="miningContainer__main">
      <SkillXPBar
        skillName="Mining"
        level={levelInfo.level}
        maxLevel={maxLevel}
        xpInLevel={levelInfo.xpInLevel}
        xpRequiredForNext={levelInfo.xpRequiredForNext}
      />
      {busyWithOther && (
        <p className="miningContainer__busy">
          You're busy ({activityLabel}). One activity at a time.
        </p>
      )}
      {isActive && (
        <button
          type="button"
          className="miningContainer__stop"
          onClick={stop}
        >
          Stop mining
        </button>
      )}
      <div
        className="miningContainer__cast-bar progress-bar"
        style={{ width: `${progress}%` }}
      />
      <div className="miningContainer__areas">
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
      </div>
    </div>
  );
};

export default MiningContainer;
