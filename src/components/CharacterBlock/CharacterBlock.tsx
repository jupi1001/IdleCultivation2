import React from "react";
import "./CharacterBlock.css";

export const CharacterBlock = () => {
  return (
    <div className="app__characterBlock">
      <h2>Name : Franz</h2>
      <div className="app__characterBlock-items">
        <ul>
          <li>Attack: 0</li>
          <li>Defense: 0</li>
          <li>Speed: 0</li>
        </ul>
      </div>
    </div>
  );
};
