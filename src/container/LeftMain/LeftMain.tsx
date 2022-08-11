import React from "react";
import { ContentBlock } from "../../components/ContentBlock/ContentBlock";
import "./LeftMain.css";

export const LeftMain = () => {
  return (
    <div>
      {" "}
      <ContentBlock element={{ title: "a", content: <h1>a</h1> }} />
    </div>
  );
};
