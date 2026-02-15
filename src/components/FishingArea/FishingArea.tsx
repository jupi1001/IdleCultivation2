import React from "react";
import "./FishingArea.css";

interface FishingAreaProps {
  title: string;
  imageSrc: string;
  altText: string;
  fishingXP: number;
  fishingDelay: number;
  /** Minimum fishing level required to unlock (display only; unlock still uses XP in container). */
  requiredLevel: number;
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
  unlocked,
  onClick,
}) => {
  return (
    <div
      className={`fishingAreaContainer__main-item ${unlocked ? "" : "fishingAreaContainer__main-item--locked"}`}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => unlocked && (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      role={unlocked ? "button" : undefined}
      aria-disabled={!unlocked}
    >
      <h2>{title}</h2>
      <p>
        Fishing XP: {fishingXP} · Duration: {formatFishingDuration(fishingDelay)}
      </p>
      {!unlocked && (
        <p className="fishingAreaContainer__lock">
          Requires Fishing Level {requiredLevel} to unlock
        </p>
      )}
      <img
        src={imageSrc}
        alt={altText}
        height={50}
        draggable={false}
      />
    </div>
  );
};

export default FishingArea;
