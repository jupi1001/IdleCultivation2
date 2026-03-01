import React from "react";
import "./SkillXPBar.css";

interface SkillXPBarProps {
  skillName: string;
  level: number;
  maxLevel: number;
  xpInLevel: number;
  xpRequiredForNext: number;
}

export const SkillXPBar: React.FC<SkillXPBarProps> = ({
  skillName,
  level,
  maxLevel,
  xpInLevel,
  xpRequiredForNext,
}) => {
  const pct = xpRequiredForNext > 0 ? (xpInLevel / xpRequiredForNext) * 100 : 100;

  return (
    <>
      <h2>
        {skillName} Level {level}/{maxLevel}
      </h2>
      <div className="skillXPBar__level">
        <span className="skillXPBar__xp-text">
          XP {xpRequiredForNext > 0 ? `${xpInLevel} / ${xpRequiredForNext}` : "Max"}
        </span>
        <div className="skillXPBar__bar-track">
          <div className="skillXPBar__bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </>
  );
};
