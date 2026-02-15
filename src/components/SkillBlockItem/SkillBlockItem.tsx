import React from "react";
import { useDispatch } from "react-redux";
import SkillI from "../../interfaces/SkillI";
import "./SkillBlockItem.css";
import { changeContent } from "../../state/reducers/contentSlice";

const PATH_ACCENT_COLORS: Record<string, string> = {
  "Martial Training": "#a04040",
  "Labour": "#b8860b",
  "Meditation": "#6b4e71",
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
  const accentColor = PATH_ACCENT_COLORS[skill.name] ?? "var(--accent)";

  const openSkill = (input: string) => {
    if (input === "Martial Training") {
      dispatch(changeContent("Map"));
      return;
    }
    dispatch(changeContent(input));
  };

  return (
    <div
      className="skillBlockItem__main"
      onClick={() => openSkill(skill.name)}
      style={{ "--path-accent": accentColor } as React.CSSProperties}
    >
      <h3>{skill.name}</h3>
      <p className="skillBlockItem__main-p">{skill.description}</p>
    </div>
  );
};

export default SkillBlockItem;
