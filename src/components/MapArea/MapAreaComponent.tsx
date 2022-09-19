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
    //TODO go to combat with area
    //Maybe redux slice => currentArea? and fetch it in the combat container
    dispatch(changeContent("Combat"));
  };

  return (
    <div>
      <img src={image} alt={text} onClick={() => handleOnClick(text)} />
    </div>
  );
};

export default MapAreaComponent;
