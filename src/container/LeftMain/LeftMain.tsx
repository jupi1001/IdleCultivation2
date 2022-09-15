import React from "react";
import { ContentBlock } from "../../components/ContentBlock/ContentBlock";
import SkillBlock from "../../components/SkillBlock/SkillBlock";
import "./LeftMain.css";

export const LeftMain = () => {
  return (
    <div>
      {" "}
      <ContentBlock element={{ title: "", content: <SkillBlock /> }} />
    </div>
  );
};
