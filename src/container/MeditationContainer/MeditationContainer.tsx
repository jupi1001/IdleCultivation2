import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { addQi, breakthrough, setCurrentActivity } from "../../state/reducers/characterSlice";
import { getBreakthroughQiRequired, getNextRealm, formatRealm } from "../../constants/realmProgression";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { BASE_QI_PER_SECOND } from "../../constants/meditation";
import images from "../../constants/images";
import "./MeditationContainer.css";

export const MeditationContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const { realm, realmLevel, qi, currentActivity, equipment } = character;
  const qiTechnique = equipment.qiTechnique;
  const qiPerSecond = Math.round((BASE_QI_PER_SECOND + (qiTechnique?.qiGainBonus ?? 0)) * 10) / 10;
  const requiredQi = getBreakthroughQiRequired(realm, realmLevel);
  const canBreakthrough = getNextRealm(realm, realmLevel) !== null && qi >= requiredQi;
  const displayQi = Math.round(qi * 100) / 100;
  const displayRate = qiPerSecond % 1 === 0 ? qiPerSecond : qiPerSecond.toFixed(1);
  const isMeditating = currentActivity === "meditate";
  const busyWithOther =
    currentActivity !== "none" && currentActivity !== "meditate";
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isMeditating) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      dispatch(addQi(qiPerSecond));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMeditating, dispatch, qiPerSecond]);

  const handleStartMeditation = () => {
    dispatch(setCurrentActivity("meditate"));
  };

  const handleStopMeditation = () => {
    dispatch(setCurrentActivity("none"));
  };

  const handleBreakthrough = () => {
    if (canBreakthrough) dispatch(breakthrough());
  };

  return (
    <div className="meditation-container">
      <div className="meditation-container__character">
        <img
          src={images.character}
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
      <div className="meditation-container__qi">
        <span className="meditation-container__qi-value">
          Qi — {displayQi} {isMeditating && `+${displayRate}/s`}
        </span>
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
      {!canBreakthrough && getNextRealm(realm, realmLevel) && (
        <p className="meditation-container__hint">
          {displayQi} / {requiredQi} Qi to breakthrough to next realm
        </p>
      )}
    </div>
  );
};
