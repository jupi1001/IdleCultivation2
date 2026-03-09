import React from "react";
import type { RealmRequirement } from "../../constants/areaRealmRequirements";
import type { RealmId } from "../../constants/realmProgression";
import type { AvatarI } from "../../interfaces/AvatarI";
import type Item from "../../interfaces/ItemI";
import type { ConsumableEffect } from "../../interfaces/ItemI";
import type { MissionI } from "../../interfaces/MissionI";
import "./ImmortalsIslandContainer.css";

interface ImmortalsIslandScreenProps {
  realm: RealmId;
  realmLevel: number;
  money: number;
  itemsById: Record<number, number>;
  avatars: AvatarI[];
  avatarsOpen: boolean;
  setAvatarsOpen: (open: boolean) => void;
  createName: string;
  setCreateName: (name: string) => void;
  isMainOnExpedition: boolean;
  currentMission: MissionI | null;
  mainSecondsLeft: number;
  canAffordAvatar: boolean;
  avatarUnlocked: boolean;
  showCreateAvatar: boolean;
  oreQty: number;
  woodQty: number;
  handleCreateAvatar: () => void;
  handleStartMission: (mission: MissionI, entityType: "main" | "avatar", avatarId?: number) => void;
  EXPEDITION_MISSIONS: MissionI[];
  EXPEDITION_MISSIONS_BY_ID: Record<number, MissionI>;
  AVATAR_CREATE_ORE_AMOUNT: number;
  AVATAR_CREATE_SPIRIT_STONES: number;
  AVATAR_CREATE_WOOD_AMOUNT: number;
  AVATAR_TRAIN_QI_PILL_AMOUNT: number;
  AVATAR_TRAIN_SPIRIT_STONES: number;
  ITEMS_BY_ID: Record<number, Item>;
  getConsumableEffect: (item: Item) => ConsumableEffect | null;
  canEnterArea: (realm: RealmId, realmLevel: number, requiredRealm: RealmRequirement) => boolean;
  formatRealmRequirement: (requiredRealm: RealmRequirement) => string;
  getExpeditionItem: (id: number) => Item | undefined;
  groupMissionsByRealm: (missions: MissionI[]) => { realmLabel: string; missions: MissionI[] }[];
  formatDuration: (seconds: number) => string;
  handleTrainAvatarWithStones: (avatarId: number) => void;
  handleTrainAvatarWithQiPill: (avatarId: number, itemId: number) => void;
}

export const ImmortalsIslandScreen: React.FC<ImmortalsIslandScreenProps> = (props) => {
  const {
    realm,
    realmLevel,
    money,
    itemsById,
    avatars,
    avatarsOpen,
    setAvatarsOpen,
    createName,
    setCreateName,
    isMainOnExpedition,
    currentMission,
    mainSecondsLeft,
    canAffordAvatar,
    avatarUnlocked,
    showCreateAvatar,
    oreQty,
    woodQty,
    handleCreateAvatar,
    handleStartMission,
    EXPEDITION_MISSIONS,
    EXPEDITION_MISSIONS_BY_ID,
    AVATAR_CREATE_ORE_AMOUNT,
    AVATAR_CREATE_SPIRIT_STONES,
    AVATAR_CREATE_WOOD_AMOUNT,
    AVATAR_TRAIN_QI_PILL_AMOUNT,
    AVATAR_TRAIN_SPIRIT_STONES,
    ITEMS_BY_ID,
    getConsumableEffect,
    canEnterArea,
    formatRealmRequirement,
    getExpeditionItem,
    groupMissionsByRealm,
    formatDuration,
    handleTrainAvatarWithStones,
    handleTrainAvatarWithQiPill,
  } = props;

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
          {avatars
            .filter((a) => a.isBusy)
            .map((avatar) => {
              const mission =
                avatar.expeditionMissionId != null
                  ? EXPEDITION_MISSIONS_BY_ID[avatar.expeditionMissionId]
                  : null;
              const secLeft =
                avatar.expeditionEndTime != null
                  ? Math.max(0, Math.ceil((avatar.expeditionEndTime - Date.now()) / 1000))
                  : 0;
              return (
                <div
                  key={avatar.id}
                  className="immortalsIsland__active immortalsIsland__active--avatar"
                >
                  <p className="immortalsIsland__active-label">
                    Expedition in progress ({avatar.name})
                  </p>
                  <p className="immortalsIsland__active-mission">{mission?.name ?? "—"}</p>
                  <p className="immortalsIsland__active-timer">
                    {formatDuration(secLeft)} remaining
                  </p>
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
            onClick={() => setAvatarsOpen(!avatarsOpen)}
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
                          onClick={() => handleTrainAvatarWithStones(a.id)}
                          title={`Spend ${AVATAR_TRAIN_SPIRIT_STONES} Spirit Stones to increase ${a.name}'s power by 1`}
                        >
                          Train ({AVATAR_TRAIN_SPIRIT_STONES} Spirit Stones)
                        </button>
                        {(() => {
                          const qiPillId = Object.keys(ITEMS_BY_ID)
                            .map(Number)
                            .find((id) => {
                              const item = ITEMS_BY_ID[id];
                              const eff = item ? getConsumableEffect(item) : null;
                              return (
                                eff != null &&
                                eff.type === "grantQi" &&
                                (itemsById[id] ?? 0) >= AVATAR_TRAIN_QI_PILL_AMOUNT
                              );
                            });
                          const qiPill = qiPillId != null ? ITEMS_BY_ID[qiPillId] : null;
                          return (
                            <button
                              type="button"
                              className="immortalsIsland__avatar-train-btn"
                              disabled={!qiPill}
                              onClick={() =>
                                qiPill && handleTrainAvatarWithQiPill(a.id, qiPill.id)
                              }
                              title={
                                qiPill
                                  ? `Spend 1 ${qiPill.name} to increase ${a.name}'s power by 1`
                                  : "Requires at least one Qi Pill in inventory"
                              }
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
                  Create Avatar: {AVATAR_CREATE_SPIRIT_STONES} Spirit Stones,{" "}
                  {AVATAR_CREATE_ORE_AMOUNT} Voidstone, {AVATAR_CREATE_WOOD_AMOUNT} Void Willow
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
                        {canSendMain
                          ? "Send Main"
                          : isMainOnExpedition
                          ? "Main on expedition"
                          : `Requires ${realmLabel}`}
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
                            {canSendAvatar
                              ? `Send ${avatar.name}`
                              : avatar.isBusy
                              ? `${avatar.name} busy`
                              : `Requires ${realmLabel}`}
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

