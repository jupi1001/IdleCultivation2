import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import SkillI from "../../interfaces/SkillI";
import "./SkillBlockItem.css";
import { changeContent } from "../../state/reducers/contentSlice";

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
  const accentColor = PATH_ACCENT_COLORS[skill.name] ?? "var(--accent)";
  const isBlockedByExpedition =
    currentActivity === "expedition" && skill.name !== "Immortals Island";

  const openSkill = (input: string) => {
    if (isBlockedByExpedition) return;
    if (input === "Martial Training") {
      dispatch(changeContent("Map"));
      return;
    }
    dispatch(changeContent(input));
  };

  return (
    <div
      className={`skillBlockItem__main ${isBlockedByExpedition ? "skillBlockItem__main--disabled" : ""}`}
      onClick={() => openSkill(skill.name)}
      style={{ "--path-accent": accentColor } as React.CSSProperties}
    >
      <h3>{skill.name}</h3>
      <p className="skillBlockItem__main-p">{skill.description}</p>
    </div>
  );
};

export default SkillBlockItem;
