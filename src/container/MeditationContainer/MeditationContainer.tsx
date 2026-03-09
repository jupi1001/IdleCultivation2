import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { ACTIVITY_LABELS } from "../../constants/activities";
import { BASE_QI_PER_SECOND } from "../../constants/meditation";
import { formatRealm, getBreakthroughQiRequired, getNextRealm, getBreakthroughStatGainText } from "../../constants/realmProgression";
import { SECT_NPCS_BY_SECT, DUAL_CULTIVATION_MIN_FAVOR } from "../../constants/sectRelationships";
import { getCharacterImage } from "../../constants/ui";
import { breakthrough, setCurrentActivity } from "../../state/reducers/characterCoreSlice";
import { setCultivationPartner } from "../../state/reducers/sectSlice";
import { WEAKENED_MEDITATION_SECONDS } from "../../state/reducers/combatSlice";
import { getKarmaQiMultiplier, getTalentQiGainBonus, getCultivationPartnerInfo } from "../../state/selectors/characterSelectors";
import {
  selectRealm,
  selectRealmLevel,
  selectQi,
  selectCurrentActivity,
  selectEquipment,
  selectIsWeakened,
  selectDeathPenaltyMode,
  selectWeakenedMeditationSecondsDone,
  selectCurrentSectId,
  selectNpcFavor,
  selectGender,
} from "../../state/selectors/characterSelectors";
import "./MeditationContainer.css";

export const MeditationContainer = () => {
  const dispatch = useDispatch();
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const qi = useSelector(selectQi);
  const currentActivity = useSelector(selectCurrentActivity);
  const equipment = useSelector(selectEquipment);
  const isWeakenedRaw = useSelector(selectIsWeakened);
  const deathPenaltyMode = useSelector(selectDeathPenaltyMode);
  const weakenedMeditationSecondsDone = useSelector(selectWeakenedMeditationSecondsDone);
  const currentSectId = useSelector(selectCurrentSectId);
  const npcFavor = useSelector(selectNpcFavor);
  const gender = useSelector(selectGender);
  const karmaQiMult = useSelector(getKarmaQiMultiplier);
  const talentQiGain = useSelector(getTalentQiGainBonus);
  const partnerInfo = useSelector(getCultivationPartnerInfo);
  const isWeakened = isWeakenedRaw && deathPenaltyMode === "normal";
  const weakenedRemaining = Math.max(0, WEAKENED_MEDITATION_SECONDS - (weakenedMeditationSecondsDone ?? 0));
  const qiTechnique = equipment.qiTechnique;
  const partnerBonusMult = 1 + (partnerInfo.bonusPercent ?? 0) / 100;
  const baseQiPerSecond = (BASE_QI_PER_SECOND + (qiTechnique && "qiGainBonus" in qiTechnique ? qiTechnique.qiGainBonus ?? 0 : 0) + (equipment.amulet && "qiGainBonus" in equipment.amulet ? equipment.amulet.qiGainBonus ?? 0 : 0) + talentQiGain) * partnerBonusMult;
  const qiPerSecond = Math.round(baseQiPerSecond * karmaQiMult * 100) / 100;
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
    if (!canBreakthrough || !nextRealm) return;
    setCelebrating(true);
    dispatch(breakthrough({ nextRealmId: nextRealm.realmId, nextRealmLevel: nextRealm.realmLevel }));
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
      <p className="meditation-container__realm">
        <Tooltip content={getBreakthroughStatGainText(realm, realmLevel)} placement="bottom">
          <span>{formatRealm(realm, realmLevel)}</span>
        </Tooltip>
      </p>
      {isWeakened && (
        <p className="meditation-container__weakened" role="status">
          Weakened: Meditate {weakenedRemaining}s to recover (50% combat stats until then).
        </p>
      )}
      <div className="meditation-container__character">
        {partnerInfo.npc ? (
          <img
            src={partnerInfo.npc.lotusImage}
            alt={`Cultivation partner: ${partnerInfo.npc.name}`}
            className="meditation-container__character-img"
            title={`Dual cultivation with ${partnerInfo.npc.name} (+${partnerInfo.bonusPercent}% Qi/s)`}
          />
        ) : (
          <img
            src={getCharacterImage(gender ?? "Male", "lotus")}
            alt="Meditating"
            className="meditation-container__character-img"
          />
        )}
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
          {partnerInfo.bonusPercent > 0 && (
            <span className="meditation-container__partner-bonus" title={`Dual cultivation: +${partnerInfo.bonusPercent}%`}>
              {" "}(+{partnerInfo.bonusPercent}% partner)
            </span>
          )}
        </p>
      </div>
      {currentSectId != null && (SECT_NPCS_BY_SECT[currentSectId] ?? []).filter(
        (npc) => (npcFavor[`${currentSectId}-${npc.id}`] ?? 0) >= DUAL_CULTIVATION_MIN_FAVOR
      ).length > 0 && (
        <div className="meditation-container__partner-wrap">
          <label htmlFor="meditation-partner-select" className="meditation-container__partner-label">
            Cultivation partner
          </label>
          <select
            id="meditation-partner-select"
            className="meditation-container__partner-select"
            value={partnerInfo.npc ? `${partnerInfo.npc.sectId}-${partnerInfo.npc.id}` : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                dispatch(setCultivationPartner(null));
                return;
              }
              const [sectId, npcId] = v.split("-").map(Number);
              if (sectId && npcId) dispatch(setCultivationPartner({ sectId, npcId }));
            }}
          >
            <option value="">None</option>
            {(SECT_NPCS_BY_SECT[currentSectId] ?? [])
              .filter((npc) => (npcFavor[`${currentSectId}-${npc.id}`] ?? 0) >= DUAL_CULTIVATION_MIN_FAVOR)
              .map((npc) => (
                <option key={npc.id} value={`${npc.sectId}-${npc.id}`}>
                  {npc.name} ({(npcFavor[`${npc.sectId}-${npc.id}`] ?? 0)} favor)
                </option>
              ))}
          </select>
        </div>
      )}
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
