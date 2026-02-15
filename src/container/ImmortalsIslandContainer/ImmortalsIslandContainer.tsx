import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {
  addMoney,
  addItem,
  startExpedition,
  clearExpedition,
} from "../../state/reducers/characterSlice";
import { canEnterArea, formatRealmRequirement } from "../../constants/areaRealmRequirements";
import {
  EXPEDITION_MISSIONS,
  getExpeditionItem,
} from "../../constants/expeditions";
import type { MissionI } from "../../interfaces/MissionI";
import "./ImmortalsIslandContainer.css";

/** Group missions by required realm, preserving mission order (realm order follows first occurrence). */
function groupMissionsByRealm(missions: MissionI[]): { realmLabel: string; missions: MissionI[] }[] {
  const groups: { realmLabel: string; missions: MissionI[] }[] = [];
  const seen = new Set<string>();
  for (const m of missions) {
    const label = formatRealmRequirement(m.requiredRealm);
    if (!seen.has(label)) {
      seen.add(label);
      groups.push({ realmLabel: label, missions: [] });
    }
    groups.find((g) => g.realmLabel === label)!.missions.push(m);
  }
  return groups;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

interface RewardToastState {
  spiritStones: number;
  rareItem: { name: string } | null;
}

export const ImmortalsIslandContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const {
    realm,
    realmLevel,
    expeditionEndTime,
    expeditionMissionId,
    currentActivity,
  } = character;
  const [rewardToast, setRewardToast] = useState<RewardToastState | null>(null);
  const [tick, setTick] = useState(0);
  const completionCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const characterRef = useRef(character);
  characterRef.current = character;

  const isOnExpedition = currentActivity === "expedition" && expeditionEndTime != null;
  const currentMission = expeditionMissionId != null
    ? EXPEDITION_MISSIONS.find((m) => m.id === expeditionMissionId)
    : null;
  const secondsLeft =
    isOnExpedition && expeditionEndTime != null
      ? Math.max(0, Math.ceil((expeditionEndTime - Date.now()) / 1000))
      : 0;

  useEffect(() => {
    if (!isOnExpedition || expeditionEndTime == null) return;
    const intervalId = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(intervalId);
  }, [isOnExpedition, expeditionEndTime]);

  useEffect(() => {
    if (expeditionEndTime == null) return;
    completionCheckRef.current = setInterval(() => {
      if (Date.now() >= expeditionEndTime) {
        if (completionCheckRef.current) {
          clearInterval(completionCheckRef.current);
          completionCheckRef.current = null;
        }
        const current = characterRef.current;
        const mission = EXPEDITION_MISSIONS.find(
          (m) => m.id === current.expeditionMissionId
        );
        if (!mission) {
          dispatch(clearExpedition());
          return;
        }
        const spiritStones =
          mission.spiritStonesMin +
          Math.floor(
            Math.random() * (mission.spiritStonesMax - mission.spiritStonesMin + 1)
          );
        dispatch(addMoney(spiritStones));

        let rareItem: { name: string } | null = null;
        for (const drop of mission.rareDrops) {
          const alreadyHas = current.items.some((i) => i.id === drop.itemId);
          if (alreadyHas) continue;
          if (Math.random() < drop.chance) {
            const item = getExpeditionItem(drop.itemId);
            if (item) {
              dispatch(addItem({ ...item, quantity: 1 }));
              rareItem = { name: item.name };
              break;
            }
          }
        }

        dispatch(clearExpedition());
        setRewardToast({ spiritStones, rareItem });
      }
    }, 500);
    return () => {
      if (completionCheckRef.current) clearInterval(completionCheckRef.current);
    };
  }, [expeditionEndTime, expeditionMissionId, dispatch]);

  const handleStartMission = (mission: MissionI) => {
    const endTime = Date.now() + mission.durationSeconds * 1000;
    dispatch(startExpedition({ endTime, missionId: mission.id }));
  };

  return (
    <div className="immortalsIsland">
      <h2 className="immortalsIsland__title">Immortals Island</h2>
      <p className="immortalsIsland__subtitle">
        Send your character on expeditions. You cannot do other activities until they return.
      </p>

      {isOnExpedition && currentMission && (
        <div className="immortalsIsland__active">
          <p className="immortalsIsland__active-label">Expedition in progress</p>
          <p className="immortalsIsland__active-mission">{currentMission.name}</p>
          <p className="immortalsIsland__active-timer">
            {formatDuration(secondsLeft)} remaining
          </p>
        </div>
      )}

      <div className="immortalsIsland__list">
        {groupMissionsByRealm(EXPEDITION_MISSIONS).map((group) => (
          <div key={group.realmLabel} className="immortalsIsland__group">
            <h3 className="immortalsIsland__group-heading">{group.realmLabel}</h3>
            <ul className="immortalsIsland__missions">
              {group.missions.map((mission) => {
                const canStart =
                  !isOnExpedition &&
                  canEnterArea(realm, realmLevel, mission.requiredRealm);
                const realmLabel = formatRealmRequirement(mission.requiredRealm);

                return (
                  <li key={mission.id} className="immortalsIsland__mission">
                    <div className="immortalsIsland__mission-header">
                      <h4>{mission.name}</h4>
                    </div>
                    <p className="immortalsIsland__mission-desc">{mission.description}</p>
                    <p className="immortalsIsland__mission-duration">
                      Duration: {formatDuration(mission.durationSeconds)}
                    </p>
                    <div className="immortalsIsland__mission-loot">
                      <span>
                        Loot: {mission.spiritStonesMin}–{mission.spiritStonesMax} Spirit Stones
                      </span>
                      {mission.rareDrops.length > 0 && (
                        <span className="immortalsIsland__mission-rares">
                          {mission.rareDrops.map((d) => {
                            const item = getExpeditionItem(d.itemId);
                            const pct = Math.round(d.chance * 100);
                            return item ? (
                              <span key={d.itemId}>
                                Rare: {item.name} ({pct}% chance, one-time)
                              </span>
                            ) : null;
                          })}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="immortalsIsland__mission-start"
                      disabled={!canStart}
                      onClick={() => handleStartMission(mission)}
                    >
                      {canStart ? "Start expedition" : isOnExpedition ? "Expedition in progress" : `Requires ${realmLabel}`}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {rewardToast && (
        <div className="immortalsIsland__toast" role="dialog" aria-label="Expedition rewards">
          <div className="immortalsIsland__toast-content">
            <h3>Expedition complete!</h3>
            <p>Spirit Stones: +{rewardToast.spiritStones}</p>
            {rewardToast.rareItem && (
              <p className="immortalsIsland__toast-rare">Rare: {rewardToast.rareItem.name}</p>
            )}
            <button
              type="button"
              className="immortalsIsland__toast-dismiss"
              onClick={() => setRewardToast(null)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
