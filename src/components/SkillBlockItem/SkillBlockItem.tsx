import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import SkillI from "../../interfaces/SkillI";
import "./SkillBlockItem.css";
import { changeContent } from "../../state/reducers/contentSlice";
import { FISHING_MAX_LEVEL, getFishingLevelInfo } from "../../constants/fishingLevel";
import { MINING_MAX_LEVEL, getMiningLevelInfo } from "../../constants/miningLevel";
import { isLockingActivity } from "../../constants/activities";

const PATH_ACCENT_COLORS: Record<string, string> = {
  "Martial Training": "#a04040",
  "Labour": "#b8860b",
  "Meditation": "#6b4e71",
  "Immortals Island": "#6b8e6b",
  "Fishing": "#4a6fa5",
  "Mining": "#5c6b73",
  "Gathering": "#4a7c59",
  "Cultivation Tree": "#9a7b4a",
  "Alchemy": "#4a9b8e",
  "Forging": "#b85c38",
};

interface SkillItemProps {
  skill: SkillI;
}

const SkillBlockItem: React.FC<SkillItemProps> = ({ skill }) => {
  const dispatch = useDispatch();
  const currentActivity = useSelector((state: RootState) => state.character.currentActivity);
  const fishingXP = useSelector((state: RootState) => state.character.fishingXP);
  const miningXP = useSelector((state: RootState) => state.character.miningXP);
  const accentColor = PATH_ACCENT_COLORS[skill.name] ?? "var(--accent)";
  const isNavigationLocked = isLockingActivity(currentActivity);
  const isBlocked = isNavigationLocked && skill.name !== "Immortals Island";
  const fishingLevel = skill.name === "Fishing" ? getFishingLevelInfo(fishingXP).level : null;
  const miningLevel = skill.name === "Mining" ? getMiningLevelInfo(miningXP).level : null;

  const openSkill = (input: string) => {
    if (isBlocked) return;
    if (input === "Martial Training") {
      dispatch(changeContent("Map"));
      return;
    }
    dispatch(changeContent(input));
  };

  return (
    <div
      className={`skillBlockItem__main ${isBlocked ? "skillBlockItem__main--disabled" : ""}`}
      onClick={() => openSkill(skill.name)}
      style={{ "--path-accent": accentColor } as React.CSSProperties}
    >
      <h3>
        {skill.name}
        {fishingLevel !== null && (
          <span className="skillBlockItem__level"> Level {fishingLevel}/{FISHING_MAX_LEVEL}</span>
        )}
        {miningLevel !== null && (
          <span className="skillBlockItem__level"> Level {miningLevel}/{MINING_MAX_LEVEL}</span>
        )}
      </h3>
      <p className="skillBlockItem__main-p">{skill.description}</p>
    </div>
  );
};

export default SkillBlockItem;
