import React, { useState } from "react";
import Item from "../../interfaces/ItemI";
import LootTablePopover from "../LootTablePopover/LootTablePopover";
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
  unlocked: boolean;
  onClick: () => void;
}

function formatGatheringDuration(ms: number): string {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

const GatheringArea: React.FC<GatheringAreaProps> = ({
  title,
  imageSrc,
  altText,
  gatheringXP,
  gatheringDelay,
  requiredLevel,
  possibleLoot,
  unlocked,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`gatheringAreaContainer__main-item ${unlocked ? "" : "gatheringAreaContainer__main-item--locked"}`}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => unlocked && (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      role={unlocked ? "button" : undefined}
      aria-disabled={!unlocked}
    >
      <h2>{title}</h2>
      <p>
        Gathering XP: {gatheringXP} · Duration: {formatGatheringDuration(gatheringDelay)}
      </p>
      {!unlocked && (
        <p className="gatheringAreaContainer__lock">
          Requires Gathering Level {requiredLevel} to unlock
        </p>
      )}
      <LootTablePopover items={possibleLoot} label="Possible finds" />
      <div className="gatheringAreaContainer__img-wrap">
        {imgError ? (
          <div className="gatheringAreaContainer__placeholder" title={altText}>
            Gather
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={altText}
            height={50}
            draggable={false}
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </div>
  );
};

export default GatheringArea;
