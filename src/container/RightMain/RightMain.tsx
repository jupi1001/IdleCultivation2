import React from "react";
import { CharacterBlock } from "../../components/CharacterBlock/CharacterBlock";
import { ContentBlock } from "../../components/ContentBlock/ContentBlock";
import "./RightMain.css";

export const RightMain = () => {
  return (
    <div className="app__rightMain">
      <>
        <ContentBlock element={{ title: "Character", content: <CharacterBlock /> }} />
      </>
      <>
        <ContentBlock element={{ title: "a", content: <h1>Right</h1> }} />
      </>
    </div>
  );
};
