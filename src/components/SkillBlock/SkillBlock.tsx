import React from "react";
import { existingSkills } from "../../constants/data";
import SkillBlockItem from "../SkillBlockItem/SkillBlockItem";
import "./SkillBlock.css";

const SkillBlock = () => {
  return (
    <div className="skill-block">
      {existingSkills.map((skill, index) => (
        <SkillBlockItem key={index} skill={skill} />
      ))}
    </div>
  );
};

export default SkillBlock;
