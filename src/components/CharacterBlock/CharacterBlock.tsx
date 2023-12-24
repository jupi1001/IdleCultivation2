import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import "./CharacterBlock.css";

export const CharacterBlock = () => {
  const character = useSelector((state: RootState) => state.character);

  return (
    <div className="app__characterBlock">
      <h2>Name : {character.name}</h2>
      <div className="app__characterBlock-items">
        <ul className="app__characterBlock-ul">
          <li>Attack: {character.attack}</li>
          <li>Defense: {character.defense}</li>
          <li>Health: {character.health}</li>
          <li>Money: {character.money}</li>
        </ul>
      </div>
    </div>
  );
};
