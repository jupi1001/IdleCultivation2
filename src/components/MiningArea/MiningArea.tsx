import React from "react";
import Item from "../../interfaces/ItemI";
import LootTablePopover from "../LootTablePopover/LootTablePopover";
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
        <LootTablePopover items={possibleLoot} label="Possible find" />
      </div>
    </div>
  );
};

export default MiningArea;
