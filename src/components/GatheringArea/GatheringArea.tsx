import React from "react";
import Item from "../../interfaces/ItemI";
import LootTablePopover, { type LootTableEntry } from "../LootTablePopover/LootTablePopover";
import { Tooltip } from "../Tooltip/Tooltip";
import "./GatheringArea.css";

interface GatheringAreaProps {
  title: string;
  imageSrc: string;
  altText: string;
  gatheringXP: number;
  gatheringDelay: number;
  requiredLevel: number;
  /** Possible wood/herbs from this area (from data; dynamic). */
  possibleLoot: Item[];
  /** Optional: entries with chance % and rare drops. */
  lootEntries?: LootTableEntry[];
  /** Optional: ring/amulet ids already owned (show checkmark in popover). */
  ownedRingAmuletIds?: Set<number>;
  unlocked: boolean;
  onClick: () => void;
}

function formatGatheringDuration(ms: number): string {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

function getSkillAreaTooltipContent(
  xpLabel: string,
  xp: number,
  duration: string,
  requiredLevel: number,
  unlocked: boolean,
  lootLabel: string
): string {
  const lines: string[] = [];
  lines.push(`${xpLabel}: ${xp} per cast`);
  lines.push(`Duration: ${duration}`);
  lines.push(unlocked ? "Unlocked" : `Requires Level ${requiredLevel} to unlock`);
  lines.push(`Loot: See "${lootLabel}" below`);
  return lines.join("\n");
}

const GatheringArea: React.FC<GatheringAreaProps> = ({
  title,
  imageSrc,
  altText,
  gatheringXP,
  gatheringDelay,
  requiredLevel,
  possibleLoot,
  lootEntries,
  ownedRingAmuletIds,
  unlocked,
  onClick,
}) => {
  return (
    <div
      className={`gatheringAreaContainer__main-item ${unlocked ? "" : "gatheringAreaContainer__main-item--locked"}`}
      style={{ backgroundImage: `url(${imageSrc})` }}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => unlocked && (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      role={unlocked ? "button" : undefined}
      aria-disabled={!unlocked}
      title={altText}
    >
      <div className="gatheringAreaContainer__overlay" aria-hidden="true" />
      <div className="gatheringAreaContainer__content">
        <Tooltip
          content={getSkillAreaTooltipContent(
            "Gathering XP",
            gatheringXP,
            formatGatheringDuration(gatheringDelay),
            requiredLevel,
            unlocked,
            "Possible finds"
          )}
          placement="top"
          maxWidth={260}
        >
          <span className="gatheringAreaContainer__tooltip-trigger">
            <h2 className="gatheringAreaContainer__title">{title}</h2>
            <p className="gatheringAreaContainer__meta">
              Gathering XP: {gatheringXP} · Duration: {formatGatheringDuration(gatheringDelay)}
            </p>
            {!unlocked && (
              <p className="gatheringAreaContainer__lock">
                Requires Gathering Level {requiredLevel} to unlock
              </p>
            )}
          </span>
        </Tooltip>
        <LootTablePopover
          entries={lootEntries}
          items={lootEntries == null ? possibleLoot : undefined}
          ownedItemIds={ownedRingAmuletIds}
          label="Possible finds"
        />
      </div>
    </div>
  );
};

export default GatheringArea;
