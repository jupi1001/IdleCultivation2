import React, { useState } from "react";
import "./MiningArea.css";

interface MiningAreaProps {
  title: string;
  imageSrc: string;
  altText: string;
  miningXP: number;
  miningDelay: number;
  requiredLevel: number;
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
  unlocked,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`miningAreaContainer__main-item ${unlocked ? "" : "miningAreaContainer__main-item--locked"}`}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => unlocked && (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      role={unlocked ? "button" : undefined}
      aria-disabled={!unlocked}
    >
      <h2>{title}</h2>
      <p>
        Mining XP: {miningXP} · Duration: {formatMiningDuration(miningDelay)}
      </p>
      {!unlocked && (
        <p className="miningAreaContainer__lock">
          Requires Mining Level {requiredLevel} to unlock
        </p>
      )}
      <div className="miningAreaContainer__img-wrap">
        {imgError ? (
          <div className="miningAreaContainer__placeholder" title={altText}>
            Ore
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

export default MiningArea;
