import React from "react";
import { existingSkills } from "../../constants/data";
import SkillBlockItem from "../SkillBlockItem/SkillBlockItem";

const SkillBlock = () => {
  return (
    <div>
      Skills
      {existingSkills.map((skill, index) => (
        <SkillBlockItem key={index} skill={skill} />
      ))}
    </div>
  );
};

export default SkillBlock;
