import React from "react";
import { useDispatch } from "react-redux";
import SkillI from "../../interfaces/SkillI";
import "./SkillBlockItem.css";
import { changeContent } from "../../state/reducers/contentSlice";

interface SkillItemProps {
  skill: SkillI;
}

const SkillBlockItem: React.FC<SkillItemProps> = ({ skill }) => {
  const dispatch = useDispatch();

  const openSkill = (input: string) => {
    //Special routing for combat, since you need to enter via the map
    if (input === "Combat") {
      dispatch(changeContent("Map"));
      return;
    }
    //Normal routing
    dispatch(changeContent(input));
  };

  return (
    <div className="skillBlockItem__main" onClick={() => openSkill(skill.name)}>
      <h3>{skill.name}</h3>
      <p className="skillBlockItem__main-p">{skill.description}</p>
    </div>
  );
};

export default SkillBlockItem;
