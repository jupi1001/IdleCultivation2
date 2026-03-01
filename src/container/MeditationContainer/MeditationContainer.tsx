import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { breakthrough, setCurrentActivity } from "../../state/reducers/characterSlice";
import { formatRealm, getBreakthroughQiRequired, getNextRealm } from "../../constants/realmProgression";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { BASE_QI_PER_SECOND } from "../../constants/meditation";
import { getCharacterImage } from "../../constants/ui";
import "./MeditationContainer.css";

export const MeditationContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { realm, realmLevel, qi, currentActivity, equipment } = character;
  const qiTechnique = equipment.qiTechnique;
  const qiPerSecond = Math.round((BASE_QI_PER_SECOND + (qiTechnique?.qiGainBonus ?? 0) + (equipment.amulet?.qiGainBonus ?? 0)) * 10) / 10;
  const requiredQi = getBreakthroughQiRequired(realm, realmLevel);
  const nextRealm = getNextRealm(realm, realmLevel);
  const canBreakthrough = nextRealm !== null && qi >= requiredQi;
  const displayQi = Math.round(qi * 100) / 100;
  const displayRate = qiPerSecond % 1 === 0 ? qiPerSecond : qiPerSecond.toFixed(1);
  const isMeditating = currentActivity === "meditate";
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "meditate";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const hasNextRealm = nextRealm !== null && Number.isFinite(requiredQi);
  const breakthroughProgress = hasNextRealm ? Math.min(1, qi / requiredQi) : 0;
  const [celebrating, setCelebrating] = useState(false);

  const handleStartMeditation = () => {
    dispatch(setCurrentActivity("meditate"));
  };

  const handleStopMeditation = () => {
    dispatch(setCurrentActivity("none"));
  };

  const handleBreakthrough = () => {
    if (!canBreakthrough) return;
    setCelebrating(true);
    dispatch(breakthrough());
    setTimeout(() => setCelebrating(false), 2600);
  };

  return (
    <div
      className={`meditation-container ${isMeditating ? "meditation-container--meditating" : ""} ${celebrating ? "meditation-container--breakthrough" : ""}`}
    >
      {celebrating && (
        <div className="meditation-container__celebration" aria-live="polite">
          Breakthrough!
        </div>
      )}
      <p className="meditation-container__realm">{formatRealm(realm, realmLevel)}</p>
      <div className="meditation-container__character">
        <img
          src={getCharacterImage(character.gender ?? "Male", "lotus")}
          alt="Meditating"
          className="meditation-container__character-img"
        />
        {canBreakthrough && (
          <button
            type="button"
            className="meditation-container__breakthrough"
            onClick={handleBreakthrough}
          >
            Breakthrough
          </button>
        )}
      </div>
      <div className="meditation-container__progress-wrap">
        {hasNextRealm ? (
          <>
            <div
              className="meditation-container__progress-track"
              role="progressbar"
              aria-valuenow={qi}
              aria-valuemin={0}
              aria-valuemax={requiredQi}
              aria-label="Qi to next realm"
            >
              <div
                className={`meditation-container__progress-fill ${isMeditating ? "meditation-container__progress-fill--active" : ""}`}
                style={{ width: `${breakthroughProgress * 100}%` }}
              />
            </div>
            <p className="meditation-container__progress-label">
              {displayQi} / {requiredQi} Qi to next realm
            </p>
          </>
        ) : (
          <p className="meditation-container__progress-label">Max realm</p>
        )}
        <p className={`meditation-container__qi-rate ${isMeditating ? "meditation-container__qi-rate--active" : ""}`}>
          {isMeditating ? `+${displayRate} Qi/s` : `${displayRate} Qi/s (when meditating)`}
        </p>
      </div>
      {!isMeditating ? (
        <>
          <button
            type="button"
            className="meditation-container__start"
            onClick={handleStartMeditation}
            disabled={busyWithOther}
          >
            Begin meditation
          </button>
          {busyWithOther && (
            <p className="meditation-container__hint">
              You're busy ({activityLabel}). Stop that first.
            </p>
          )}
        </>
      ) : (
        <button type="button" className="meditation-container__stop" onClick={handleStopMeditation}>
          Stop meditation
        </button>
      )}
    </div>
  );
};
