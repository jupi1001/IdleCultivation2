import React from "react";
import { useDispatch } from "react-redux";
import { changeContent } from "../../state/reducers/contentSlice";
import "./MapAreaComponent.css";

interface MapAreaProps {
  image: string;
  text: string;
  information: string;
}

const MapAreaComponent: React.FC<MapAreaProps> = ({ image, text, information }) => {
  const dispatch = useDispatch();

  const handleOnClick = (areaName: string) => {
    dispatch(changeContent("Combat," + areaName));
  };

  return (
    <div className="mapAreaComponent__main">
      <h4>{text}</h4>
      <img className="mapAreaComponent__main-image" src={image} alt={text} onClick={() => handleOnClick(text)} />
      <p>{information}</p>
    </div>
  );
};

export default MapAreaComponent;
