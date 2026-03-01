import React from "react";
import Item from "../../interfaces/ItemI";
import LootTablePopover, { type LootTableEntry } from "../LootTablePopover/LootTablePopover";
import "./MiningArea.css";

interface MiningAreaProps {
  title: string;
  imageSrc: string;
  altText: string;
  miningXP: number;
  miningDelay: number;
  requiredLevel: number;
  /** Possible ore from this area (single item; from data; dynamic). */
  possibleLoot: Item[];
  /** Optional: entries with chance % (ore + set pieces). When set, used for LootTablePopover instead of possibleLoot. */
  lootEntries?: LootTableEntry[];
  /** Optional: item ids already owned (show checkmark in popover). */
  ownedItemIds?: Set<number>;
  unlocked: boolean;
  onClick: () => void;
}

function formatMiningDuration(ms: number): string {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

const MiningArea: React.FC<MiningAreaProps> = ({
  title,
  imageSrc,
  altText,
  miningXP,
  miningDelay,
  requiredLevel,
  possibleLoot,
  lootEntries,
  ownedItemIds,
  unlocked,
  onClick,
}) => {
  return (
    <div
      className={`miningAreaContainer__main-item ${unlocked ? "" : "miningAreaContainer__main-item--locked"}`}
      style={{ backgroundImage: `url(${imageSrc})` }}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => unlocked && (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      role={unlocked ? "button" : undefined}
      aria-disabled={!unlocked}
      title={altText}
    >
      <div className="miningAreaContainer__overlay" aria-hidden="true" />
      <div className="miningAreaContainer__content">
        <h2 className="miningAreaContainer__title">{title}</h2>
        <p className="miningAreaContainer__meta">
          Mining XP: {miningXP} · Duration: {formatMiningDuration(miningDelay)}
        </p>
        {!unlocked && (
          <p className="miningAreaContainer__lock">
            Requires Mining Level {requiredLevel} to unlock
          </p>
        )}
        <LootTablePopover
          entries={lootEntries}
          items={lootEntries == null ? possibleLoot : undefined}
          ownedItemIds={ownedItemIds}
          label="Possible find"
        />
      </div>
    </div>
  );
};

export default MiningArea;
