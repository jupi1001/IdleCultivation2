import React from "react";
import ContentBlockInterface from "../../interfaces/ContentBlockI";

import "./ContentBlock.css";

interface ContentBlockProps {
  element: ContentBlockInterface;
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  return (
    <div className="app__contentBlock">
      <div className="app__contentBlock-title">
        <h1>{props.element.title}</h1>
      </div>
      <div className="app__contentBlock-child">{props.element.content}</div>
    </div>
  );
};
