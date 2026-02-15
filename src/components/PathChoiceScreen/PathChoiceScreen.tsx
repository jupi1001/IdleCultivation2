import React from "react";
import { useDispatch } from "react-redux";
import { pathDescriptions } from "../../constants/data";
import type { CultivationPath } from "../../constants/cultivationPath";
import { setPath } from "../../state/reducers/characterSlice";
import "./PathChoiceScreen.css";

export const PathChoiceScreen = () => {
  const dispatch = useDispatch();

  const handleChoose = (path: CultivationPath) => {
    dispatch(setPath(path));
  };

  return (
    <div className="pathChoiceScreen">
      <h1 className="pathChoiceScreen__title">Choose your path</h1>
      <p className="pathChoiceScreen__subtitle">
        This choice will shape which sects and cultivation talents you can pursue. It cannot be changed.
      </p>
      <div className="pathChoiceScreen__options">
        <button
          type="button"
          className="pathChoiceScreen__card pathChoiceScreen__card--righteous"
          onClick={() => handleChoose("Righteous")}
        >
          <h2>{pathDescriptions.Righteous.title}</h2>
          <p>{pathDescriptions.Righteous.description}</p>
        </button>
        <button
          type="button"
          className="pathChoiceScreen__card pathChoiceScreen__card--demonic"
          onClick={() => handleChoose("Demonic")}
        >
          <h2>{pathDescriptions.Demonic.title}</h2>
          <p>{pathDescriptions.Demonic.description}</p>
        </button>
      </div>
    </div>
  );
};
