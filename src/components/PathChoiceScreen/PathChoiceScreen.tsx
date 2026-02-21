import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { pathDescriptions } from "../../constants/data";
import type { CultivationPath } from "../../constants/cultivationPath";
import { setPath, setGender } from "../../state/reducers/characterSlice";
import "./PathChoiceScreen.css";

export const PathChoiceScreen = () => {
  const dispatch = useDispatch();
  const [selectedPath, setSelectedPath] = useState<CultivationPath | null>(null);
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | null>(null);

  const canConfirm = selectedPath !== null && selectedGender !== null;

  const handleConfirm = () => {
    if (!canConfirm) return;
    dispatch(setPath(selectedPath!));
    dispatch(setGender(selectedGender!));
  };

  return (
    <div className="pathChoiceScreen">
      <h1 className="pathChoiceScreen__title">Begin your journey</h1>
      <p className="pathChoiceScreen__subtitle">
        Choose your path and appearance. These choices cannot be changed.
      </p>

      <section className="pathChoiceScreen__section">
        <h2 className="pathChoiceScreen__section-title">Choose your path</h2>
        <div className="pathChoiceScreen__options">
          <button
            type="button"
            className={`pathChoiceScreen__card pathChoiceScreen__card--righteous ${selectedPath === "Righteous" ? "pathChoiceScreen__card--selected" : ""}`}
            onClick={() => setSelectedPath("Righteous")}
          >
            <h3>{pathDescriptions.Righteous.title}</h3>
            <p>{pathDescriptions.Righteous.description}</p>
          </button>
          <button
            type="button"
            className={`pathChoiceScreen__card pathChoiceScreen__card--demonic ${selectedPath === "Demonic" ? "pathChoiceScreen__card--selected" : ""}`}
            onClick={() => setSelectedPath("Demonic")}
          >
            <h3>{pathDescriptions.Demonic.title}</h3>
            <p>{pathDescriptions.Demonic.description}</p>
          </button>
        </div>
      </section>

      <section className="pathChoiceScreen__section">
        <h2 className="pathChoiceScreen__section-title">Choose your appearance</h2>
        <div className="pathChoiceScreen__options pathChoiceScreen__options--gender">
          <button
            type="button"
            className={`pathChoiceScreen__card pathChoiceScreen__card--gender ${selectedGender === "Male" ? "pathChoiceScreen__card--selected" : ""}`}
            onClick={() => setSelectedGender("Male")}
          >
            <h3>Male</h3>
          </button>
          <button
            type="button"
            className={`pathChoiceScreen__card pathChoiceScreen__card--gender ${selectedGender === "Female" ? "pathChoiceScreen__card--selected" : ""}`}
            onClick={() => setSelectedGender("Female")}
          >
            <h3>Female</h3>
          </button>
        </div>
      </section>

      <button
        type="button"
        className="pathChoiceScreen__confirm"
        disabled={!canConfirm}
        onClick={handleConfirm}
      >
        Start journey
      </button>
    </div>
  );
};
