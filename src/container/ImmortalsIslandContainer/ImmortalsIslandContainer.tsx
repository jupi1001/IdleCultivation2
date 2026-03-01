import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {
  addMoney,
  addItem,
  startExpedition,
  clearExpedition,
  createAvatar,
  trainAvatar,
} from "../../state/reducers/characterSlice";
import { addToast } from "../../state/reducers/toastSlice";
import { canEnterArea, formatRealmRequirement } from "../../constants/areaRealmRequirements";
import {
  AVATAR_CREATE_ORE_AMOUNT,
  AVATAR_CREATE_ORE_ID,
  AVATAR_CREATE_SPIRIT_STONES,
  AVATAR_CREATE_WOOD_AMOUNT,
  AVATAR_CREATE_WOOD_ID,
  AVATAR_TRAIN_QI_PILL_AMOUNT,
  AVATAR_TRAIN_SPIRIT_STONES,
  canCreateAvatar,
} from "../../constants/avatars";
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

export const ImmortalsIslandContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);
  const {
    realm,
    realmLevel,
    expeditionEndTime,
    expeditionMissionId,
    currentActivity,
    money,
    items,
  } = character;
  const avatars = character.avatars ?? [];
  const [tick, setTick] = useState(0);
  const [avatarsOpen, setAvatarsOpen] = useState(true);
  const [createName, setCreateName] = useState("");
  const completionCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const characterRef = useRef(character);
  characterRef.current = character;

  const isMainOnExpedition = currentActivity === "expedition" && expeditionEndTime != null;
  const currentMission = expeditionMissionId != null
    ? EXPEDITION_MISSIONS.find((m) => m.id === expeditionMissionId)
    : null;
  const mainSecondsLeft =
    isMainOnExpedition && expeditionEndTime != null
      ? Math.max(0, Math.ceil((expeditionEndTime - Date.now()) / 1000))
      : 0;

  const anyAvatarBusy = avatars.some((a) => a.isBusy);

  const oreQty = items.find((i) => i.id === AVATAR_CREATE_ORE_ID)?.quantity ?? 0;
  const woodQty = items.find((i) => i.id === AVATAR_CREATE_WOOD_ID)?.quantity ?? 0;
  const canAffordAvatar =
    money >= AVATAR_CREATE_SPIRIT_STONES &&
    oreQty >= AVATAR_CREATE_ORE_AMOUNT &&
    woodQty >= AVATAR_CREATE_WOOD_AMOUNT;
  const avatarUnlocked = canCreateAvatar(realm, realmLevel);
  const showCreateAvatar = avatarUnlocked && canAffordAvatar;

  useEffect(() => {
    if (!isMainOnExpedition && !avatars.some((a) => a.isBusy)) return;
    const intervalId = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(intervalId);
  }, [isMainOnExpedition, avatars]);

  useEffect(() => {
    const checkCompletions = () => {
      const current = characterRef.current;
      const now = Date.now();

      if (current.expeditionEndTime != null && now >= current.expeditionEndTime) {
        const mission = EXPEDITION_MISSIONS.find((m) => m.id === current.expeditionMissionId);
        if (mission) {
          const spiritStones =
            mission.spiritStonesMin +
            Math.floor(Math.random() * (mission.spiritStonesMax - mission.spiritStonesMin + 1));
          dispatch(addMoney(spiritStones));
          let rareItemName: string | null = null;
          for (const drop of mission.rareDrops) {
            const alreadyHas = current.items.some((i) => i.id === drop.itemId);
            if (alreadyHas) continue;
            if (Math.random() < drop.chance) {
              const item = getExpeditionItem(drop.itemId);
              if (item) {
                dispatch(addItem({ ...item, quantity: 1 }));
                rareItemName = item.name;
                break;
              }
            }
          }
          dispatch(clearExpedition({ entityType: "main" }));
          dispatch(addToast({ type: "expedition", expeditionName: mission.name, spiritStones, rareItemName }));
        } else {
          dispatch(clearExpedition({ entityType: "main" }));
        }
      }

      for (const avatar of current.avatars ?? []) {
        if (avatar.expeditionEndTime == null || now < avatar.expeditionEndTime) continue;
        const mission = EXPEDITION_MISSIONS.find((m) => m.id === avatar.expeditionMissionId);
        if (mission) {
          const spiritStones =
            mission.spiritStonesMin +
            Math.floor(Math.random() * (mission.spiritStonesMax - mission.spiritStonesMin + 1));
          dispatch(addMoney(spiritStones));
          let rareItemName: string | null = null;
          const stateForRare = characterRef.current;
          for (const drop of mission.rareDrops) {
            const alreadyHas = stateForRare.items.some((i) => i.id === drop.itemId);
            if (alreadyHas) continue;
            if (Math.random() < drop.chance) {
              const item = getExpeditionItem(drop.itemId);
              if (item) {
                dispatch(addItem({ ...item, quantity: 1 }));
                rareItemName = item.name;
                break;
              }
            }
          }
          dispatch(clearExpedition({ entityType: "avatar", avatarId: avatar.id }));
          dispatch(
            addToast({
              type: "expedition",
              expeditionName: `${avatar.name}: ${mission.name}`,
              spiritStones,
              rareItemName,
            })
          );
        } else {
          dispatch(clearExpedition({ entityType: "avatar", avatarId: avatar.id }));
        }
      }
    };

    completionCheckRef.current = setInterval(checkCompletions, 500);
    return () => {
      if (completionCheckRef.current) clearInterval(completionCheckRef.current);
    };
  }, [expeditionEndTime, expeditionMissionId, avatars, dispatch]);

  const handleStartMission = (mission: MissionI, entityType: "main" | "avatar", avatarId?: number) => {
    const endTime = Date.now() + mission.durationSeconds * 1000;
    if (entityType === "main") {
      dispatch(startExpedition({ endTime, missionId: mission.id, entityType: "main" }));
    } else if (avatarId != null) {
      dispatch(startExpedition({ endTime, missionId: mission.id, entityType: "avatar", avatarId }));
    }
  };

  const handleCreateAvatar = () => {
    const name = createName.trim() || `Avatar ${avatars.length + 1}`;
    dispatch(createAvatar({ name }));
    setCreateName("");
  };

  return (
    <div className="immortalsIsland">
      <h2 className="immortalsIsland__title">Immortals Island</h2>
      <p className="immortalsIsland__subtitle">
        {avatars.length > 0
          ? "Send Main or an Avatar on expeditions. When Main is sent, you cannot do other activities until they return. Avatars can be sent so Main keeps cultivating."
          : "Send your character on expeditions. You cannot do other activities until they return."}
      </p>

      {isMainOnExpedition && currentMission && (
        <div className="immortalsIsland__active">
          <p className="immortalsIsland__active-label">Expedition in progress (Main)</p>
          <p className="immortalsIsland__active-mission">{currentMission.name}</p>
          <p className="immortalsIsland__active-timer">
            {formatDuration(mainSecondsLeft)} remaining
          </p>
        </div>
      )}

      {avatars.some((a) => a.isBusy) && (
        <>
          {avatars.filter((a) => a.isBusy).map((avatar) => {
            const mission = avatar.expeditionMissionId != null
              ? EXPEDITION_MISSIONS.find((m) => m.id === avatar.expeditionMissionId)
              : null;
            const secLeft = avatar.expeditionEndTime != null
              ? Math.max(0, Math.ceil((avatar.expeditionEndTime - Date.now()) / 1000))
              : 0;
            return (
              <div key={avatar.id} className="immortalsIsland__active immortalsIsland__active--avatar">
                <p className="immortalsIsland__active-label">Expedition in progress ({avatar.name})</p>
                <p className="immortalsIsland__active-mission">{mission?.name ?? "—"}</p>
                <p className="immortalsIsland__active-timer">{formatDuration(secLeft)} remaining</p>
              </div>
            );
          })}
        </>
      )}

      {avatarUnlocked && (
        <div className="immortalsIsland__avatars">
          <button
            type="button"
            className="immortalsIsland__avatars-toggle"
            onClick={() => setAvatarsOpen((o) => !o)}
            aria-expanded={avatarsOpen}
          >
            {avatarsOpen ? "▼" : "▶"} Avatars {avatars.length > 0 && `(${avatars.length})`}
          </button>
          {avatarsOpen && (
            <div className="immortalsIsland__avatars-content">
              <ul className="immortalsIsland__avatars-list">
                {avatars.map((a) => (
                  <li key={a.id} className="immortalsIsland__avatar-item">
                    <span className="immortalsIsland__avatar-name">{a.name}</span>
                    <span className="immortalsIsland__avatar-power">Power: {a.power}</span>
                    <span className="immortalsIsland__avatar-status">
                      {a.isBusy ? "On expedition" : "Idle"}
                    </span>
                    {!a.isBusy && (
                      <div className="immortalsIsland__avatar-train">
                        <button
                          type="button"
                          className="immortalsIsland__avatar-train-btn"
                          disabled={money < AVATAR_TRAIN_SPIRIT_STONES}
                          onClick={() => dispatch(trainAvatar({ avatarId: a.id, costType: "spiritStones" }))}
                          title={`Spend ${AVATAR_TRAIN_SPIRIT_STONES} Spirit Stones to increase ${a.name}'s power by 1`}
                        >
                          Train ({AVATAR_TRAIN_SPIRIT_STONES} Spirit Stones)
                        </button>
                        {(() => {
                          const qiPill = items.find((i) => i.effect === "qi" && (i.quantity ?? 0) >= AVATAR_TRAIN_QI_PILL_AMOUNT);
                          return (
                            <button
                              type="button"
                              className="immortalsIsland__avatar-train-btn"
                              disabled={!qiPill}
                              onClick={() => qiPill && dispatch(trainAvatar({ avatarId: a.id, costType: "qiPill", itemId: qiPill.id }))}
                              title={qiPill ? `Spend 1 ${qiPill.name} to increase ${a.name}'s power by 1` : "Requires at least one Qi Pill in inventory"}
                            >
                              Train (1 Qi Pill)
                            </button>
                          );
                        })()}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="immortalsIsland__create-avatar">
                <p className="immortalsIsland__create-avatar-cost">
                  Create Avatar: {AVATAR_CREATE_SPIRIT_STONES} Spirit Stones, {AVATAR_CREATE_ORE_AMOUNT} Voidstone, {AVATAR_CREATE_WOOD_AMOUNT} Void Willow
                </p>
                {!canAffordAvatar && avatarUnlocked && (
                  <p className="immortalsIsland__create-avatar-missing">
                    Need: {Math.max(0, AVATAR_CREATE_SPIRIT_STONES - money)} more spirit stones,{" "}
                    {Math.max(0, AVATAR_CREATE_ORE_AMOUNT - oreQty)} Voidstone,{" "}
                    {Math.max(0, AVATAR_CREATE_WOOD_AMOUNT - woodQty)} Void Willow
                  </p>
                )}
                <div className="immortalsIsland__create-avatar-row">
                  <input
                    type="text"
                    className="immortalsIsland__create-avatar-input"
                    placeholder={`Avatar ${avatars.length + 1}`}
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    maxLength={24}
                  />
                  <button
                    type="button"
                    className="immortalsIsland__create-avatar-btn"
                    disabled={!showCreateAvatar}
                    onClick={handleCreateAvatar}
                  >
                    Create Avatar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="immortalsIsland__list">
        {groupMissionsByRealm(EXPEDITION_MISSIONS).map((group) => (
          <div key={group.realmLabel} className="immortalsIsland__group">
            <h3 className="immortalsIsland__group-heading">{group.realmLabel}</h3>
            <ul className="immortalsIsland__missions">
              {group.missions.map((mission) => {
                const canEnter = canEnterArea(realm, realmLevel, mission.requiredRealm);
                const canSendMain = canEnter && !isMainOnExpedition;
                const realmLabel = formatRealmRequirement(mission.requiredRealm);
                const canSendAny = canEnter && (canSendMain || avatars.some((a) => !a.isBusy));

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
                    <div className="immortalsIsland__mission-send">
                      <button
                        type="button"
                        className="immortalsIsland__mission-start"
                        disabled={!canSendMain}
                        onClick={() => handleStartMission(mission, "main")}
                      >
                        {canSendMain ? "Send Main" : isMainOnExpedition ? "Main on expedition" : `Requires ${realmLabel}`}
                      </button>
                      {avatars.map((avatar) => {
                        const canSendAvatar = canEnter && !avatar.isBusy;
                        return (
                          <button
                            key={avatar.id}
                            type="button"
                            className="immortalsIsland__mission-start immortalsIsland__mission-start--avatar"
                            disabled={!canSendAvatar}
                            onClick={() => handleStartMission(mission, "avatar", avatar.id)}
                          >
                            {canSendAvatar ? `Send ${avatar.name}` : avatar.isBusy ? `${avatar.name} busy` : `Requires ${realmLabel}`}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
