import React from "react";
import Item from "../../interfaces/ItemI";
import LootTablePopover, { type LootTableEntry } from "../LootTablePopover/LootTablePopover";
import { Tooltip } from "../Tooltip/Tooltip";
import "./FishingArea.css";

interface FishingAreaProps {
  title: string;
  imageSrc: string;
  altText: string;
  fishingXP: number;
  fishingDelay: number;
  /** Minimum fishing level required to unlock (display only; unlock still uses XP in container). */
  requiredLevel: number;
  /** Possible fish from this area (from data; dynamic). */
  possibleLoot: Item[];
  /** Optional: entries with chance % and rare drops. When set, used for LootTablePopover instead of possibleLoot. */
  lootEntries?: LootTableEntry[];
  /** Optional: ring/amulet ids already owned (show checkmark in popover). */
  ownedRingAmuletIds?: Set<number>;
  unlocked: boolean;
  onClick: () => void;
}

function formatFishingDuration(ms: number): string {
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

const FishingArea: React.FC<FishingAreaProps> = ({
  title,
  imageSrc,
  altText,
  fishingXP,
  fishingDelay,
  requiredLevel,
  possibleLoot,
  lootEntries,
  ownedRingAmuletIds,
  unlocked,
  onClick,
}) => {
  return (
    <div
      className={`fishingAreaContainer__main-item ${unlocked ? "" : "fishingAreaContainer__main-item--locked"}`}
      style={{ backgroundImage: `url(${imageSrc})` }}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => unlocked && (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      role={unlocked ? "button" : undefined}
      aria-disabled={!unlocked}
      title={altText}
    >
      <div className="fishingAreaContainer__overlay" aria-hidden="true" />
      <div className="fishingAreaContainer__content">
        <Tooltip
          content={getSkillAreaTooltipContent(
            "Fishing XP",
            fishingXP,
            formatFishingDuration(fishingDelay),
            requiredLevel,
            unlocked,
            "Possible finds"
          )}
          placement="top"
          maxWidth={260}
        >
          <span className="fishingAreaContainer__tooltip-trigger">
            <h2 className="fishingAreaContainer__title">{title}</h2>
            <p className="fishingAreaContainer__meta">
              Fishing XP: {fishingXP} · Duration: {formatFishingDuration(fishingDelay)}
            </p>
            {!unlocked && (
              <p className="fishingAreaContainer__lock">
                Requires Fishing Level {requiredLevel} to unlock
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

export default FishingArea;
