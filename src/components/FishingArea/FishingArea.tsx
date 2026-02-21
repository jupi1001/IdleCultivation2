import React from "react";
import Item from "../../interfaces/ItemI";
import LootTablePopover from "../LootTablePopover/LootTablePopover";
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
  unlocked: boolean;
  onClick: () => void;
}

function formatFishingDuration(ms: number): string {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

const FishingArea: React.FC<FishingAreaProps> = ({
  title,
  imageSrc,
  altText,
  fishingXP,
  fishingDelay,
  requiredLevel,
  possibleLoot,
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
        <h2 className="fishingAreaContainer__title">{title}</h2>
        <p className="fishingAreaContainer__meta">
          Fishing XP: {fishingXP} · Duration: {formatFishingDuration(fishingDelay)}
        </p>
        {!unlocked && (
          <p className="fishingAreaContainer__lock">
            Requires Fishing Level {requiredLevel} to unlock
          </p>
        )}
        <LootTablePopover items={possibleLoot} label="Possible finds" />
      </div>
    </div>
  );
};

export default FishingArea;
