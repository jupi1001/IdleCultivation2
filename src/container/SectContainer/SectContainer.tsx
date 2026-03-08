import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import {
  setSect,
  startPromotion,
  completePromotion,
  acceptSectQuest,
  claimSectQuestReward,
  giftNpc,
  useRealmDialogue,
  setCultivationPartner,
} from "../../state/reducers/characterSlice";
import {
  selectCurrentSectId,
  selectSectRankIndex,
  selectRealm,
  selectRealmLevel,
  selectPromotionEndTime,
  selectPromotionToRankIndex,
  selectSectQuestProgress,
  selectSectQuestKillCount,
  selectObtainedSectTreasureIds,
  selectNpcFavor,
  selectRealmDialogueUsed,
  selectCultivationPartner,
  selectMoney,
} from "../../state/selectors/characterSelectors";
import { ContentArea } from "../../enum/ContentArea";
import { getStepIndex } from "../../constants/realmProgression";
import { SECTS_BY_ID, SECT_POSITIONS, sectStoreData } from "../../constants/data";
import {
  SECT_NPCS_BY_SECT,
  SECT_QUEST_KILLS_REQUIRED,
  REALM_DIALOGUE_REALMS,
  DUAL_CULTIVATION_MIN_FAVOR,
  GIFT_SPIRIT_STONE_COST,
} from "../../constants/sectRelationships";
import { SectStoreItem } from "../../components/SectStoreItem/SectStoreItem";
import "./SectContainer.css";

type SectTab = "store" | "bulletin" | "relationships";

const PROMOTION_DURATION_MS = 5000;

export const SectContainer = () => {
  const dispatch = useDispatch();
  const [now, setNow] = useState(Date.now());
  const currentSectId = useSelector(selectCurrentSectId);
  const sectRankIndex = useSelector(selectSectRankIndex);
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const promotionEndTime = useSelector(selectPromotionEndTime);
  const promotionToRankIndex = useSelector(selectPromotionToRankIndex);
  const sectQuestProgress = useSelector(selectSectQuestProgress);
  const sectQuestKillCount = useSelector(selectSectQuestKillCount);
  const obtainedSectTreasureIds = useSelector(selectObtainedSectTreasureIds);
  const npcFavor = useSelector(selectNpcFavor);
  const realmDialogueUsed = useSelector(selectRealmDialogueUsed);
  const cultivationPartner = useSelector(selectCultivationPartner);
  const money = useSelector(selectMoney);

  const [activeTab, setActiveTab] = useState<SectTab>("store");

  const currentSect = currentSectId != null ? SECTS_BY_ID[currentSectId] : null;
  /** All sects on the same path (your sect + allied sects); you can buy from any of them based on your rank. */
  const sectsOnPath =
    currentSectId != null && currentSect != null
      ? Object.values(SECTS_BY_ID)
          .filter((s) => s.path === currentSect.path)
          .map((sect) => ({
            sect,
            entries: sectStoreData[sect.id] ?? [],
          }))
          .sort((a, b) => (a.sect.id === currentSectId ? -1 : b.sect.id === currentSectId ? 1 : 0))
      : [];
  const positionName = SECT_POSITIONS[sectRankIndex]?.name ?? "Sect Aspirant";
  const characterStep = getStepIndex(realm, realmLevel);
  const nextRankIndex = sectRankIndex + 1;
  const nextRank = nextRankIndex < SECT_POSITIONS.length ? SECT_POSITIONS[nextRankIndex] : null;
  const realmMeetsNextRank = nextRank != null && characterStep >= nextRank.requiredStepIndex;
  const isPromoting = promotionEndTime != null && promotionToRankIndex != null;
  const canPromote =
    sectRankIndex < SECT_POSITIONS.length - 1 && realmMeetsNextRank && !isPromoting;

  const promotionProgress =
    isPromoting && promotionEndTime != null
      ? Math.min(1, Math.max(0, (now - (promotionEndTime - PROMOTION_DURATION_MS)) / PROMOTION_DURATION_MS))
      : 0;

  useEffect(() => {
    if (!isPromoting) return;
    const t = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(t);
  }, [isPromoting]);

  useEffect(() => {
    if (promotionEndTime != null && Date.now() >= promotionEndTime) {
      dispatch(completePromotion());
    }
  }, [now, promotionEndTime, dispatch]);

  const [expandedSectIds, setExpandedSectIds] = useState<number[]>([]);

  useEffect(() => {
    if (currentSectId != null) {
      setExpandedSectIds([currentSectId]);
    }
  }, [currentSectId]);

  const toggleSectStore = (sectId: number) => {
    setExpandedSectIds((prev) =>
      prev.includes(sectId) ? prev.filter((id) => id !== sectId) : [...prev, sectId]
    );
  };

  const openMap = () => dispatch(changeContent(routeFromArea(ContentArea.MAP)));
  const handleLeave = () => dispatch(setSect(null));
  const handlePromote = () =>
    dispatch(startPromotion({ targetRankIndex: nextRankIndex, durationMs: PROMOTION_DURATION_MS }));

  if (currentSect == null) {
    return (
      <div className="sectContainer">
        <h2 className="sectContainer__title">My Sect</h2>
        <p className="sectContainer__message">You are not in a sect.</p>
        <p className="sectContainer__hint">Open the Map to find and join a sect that matches your path.</p>
        <button type="button" className="sectContainer__btn sectContainer__btn--primary" onClick={openMap}>
          Open Map
        </button>
      </div>
    );
  }

  return (
    <div className="sectContainer">
      <h2 className="sectContainer__title">My Sect</h2>
      <div className="sectContainer__card">
        <h3 className="sectContainer__sectName">{currentSect.name}</h3>
        <p className="sectContainer__path">{currentSect.path} sect</p>
        <p className="sectContainer__position">
          Position: <strong>{positionName}</strong>
        </p>
        <p className="sectContainer__description">{currentSect.description}</p>
        {nextRank != null && (
          <>
            {realmMeetsNextRank ? (
              isPromoting ? (
                <div className="sectContainer__promote-wrap">
                  <button
                    type="button"
                    className="sectContainer__btn sectContainer__btn--promote sectContainer__btn--promote-progress"
                    disabled
                    aria-busy="true"
                    aria-valuenow={Math.round(promotionProgress * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span className="sectContainer__promote-fill" style={{ width: `${promotionProgress * 100}%` }} />
                    <span className="sectContainer__promote-label">
                      Promoting to {nextRank.name}… {Math.round(promotionProgress * 100)}%
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="sectContainer__btn sectContainer__btn--promote"
                  onClick={handlePromote}
                >
                  Promote to {nextRank.name}
                </button>
              )
            ) : (
              <p className="sectContainer__promote-locked">
                Promote to {nextRank.name}: requires <strong>{nextRank.requiredRealmLabel}</strong>.
              </p>
            )}
          </>
        )}
      </div>

      <div className="sectContainer__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "store"}
          className={`sectContainer__tab ${activeTab === "store" ? "sectContainer__tab--active" : ""}`}
          onClick={() => setActiveTab("store")}
        >
          Store
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "bulletin"}
          className={`sectContainer__tab ${activeTab === "bulletin" ? "sectContainer__tab--active" : ""}`}
          onClick={() => setActiveTab("bulletin")}
        >
          Bulletin Board
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "relationships"}
          className={`sectContainer__tab ${activeTab === "relationships" ? "sectContainer__tab--active" : ""}`}
          onClick={() => setActiveTab("relationships")}
        >
          Relationships
        </button>
      </div>

      {activeTab === "store" && (
        <>
      <h3 className="sectContainer__storeTitle">Sect store</h3>
      <p className="sectContainer__hint">
        Your rank in your sect applies to all sects on your path. You can buy recipes and techniques from other {currentSect.path} sects without leaving your sect.
      </p>
      {sectsOnPath.map(({ sect, entries }) => {
        const isExpanded = expandedSectIds.includes(sect.id);
        return (
          <div key={sect.id} className="sectContainer__storeGroup">
            <button
              type="button"
              className="sectContainer__storeGroupToggle"
              onClick={() => toggleSectStore(sect.id)}
              aria-expanded={isExpanded}
              aria-controls={`sect-store-${sect.id}`}
            >
              <span className="sectContainer__storeGroupChevron" aria-hidden>
                {isExpanded ? "▼" : "▶"}
              </span>
              <span className="sectContainer__storeGroupTitle">
                {sect.id === currentSectId ? `Your sect: ${sect.name}` : sect.name}
              </span>
              <span className="sectContainer__storeGroupCount">({entries.length} items)</span>
            </button>
            <div
              id={`sect-store-${sect.id}`}
              className={`sectContainer__storeWrap ${isExpanded ? "sectContainer__storeWrap--open" : ""}`}
              role="region"
              aria-hidden={!isExpanded}
            >
              <div className="sectContainer__store">
                {entries.map((entry) => (
                  <SectStoreItem
                    key={`${sect.id}-${entry.item.id}`}
                    entry={entry}
                    locked={entry.requiredRankIndex > sectRankIndex}
                    requiredPositionName={SECT_POSITIONS[entry.requiredRankIndex].name}
                    sectName={sect.id === currentSectId ? undefined : sect.name}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <p className="sectContainer__hint">
        To join another sect, open the Map and select a sect. You must leave your current sect first.
      </p>
      <button type="button" className="sectContainer__btn sectContainer__btn--secondary" onClick={openMap}>
        Open Map
      </button>
      <button type="button" className="sectContainer__btn sectContainer__btn--leave" onClick={handleLeave}>
        Leave sect
      </button>
        </>
      )}

      {activeTab === "bulletin" && currentSectId != null && (
        <div className="sectContainer__card">
          <h3 className="sectContainer__storeTitle">Bulletin Board</h3>
          {(() => {
            const step = sectQuestProgress[currentSectId] ?? 0;
            const kills = sectQuestKillCount[currentSectId] ?? 0;
            if (step === 0) {
              return (
                <>
                  <p className="sectContainer__hint">
                    The board lists a task: prove your worth to the sect by defeating enemies in combat.
                  </p>
                  <button
                    type="button"
                    className="sectContainer__btn sectContainer__btn--primary"
                    onClick={() => dispatch(acceptSectQuest(currentSectId))}
                  >
                    Accept quest
                  </button>
                </>
              );
            }
            if (step === 1) {
              return (
                <p className="sectContainer__hint">
                  Defeat {SECT_QUEST_KILLS_REQUIRED} enemies in combat. Progress: {kills} / {SECT_QUEST_KILLS_REQUIRED}
                </p>
              );
            }
            if (step === 2) {
              return (
                <>
                  <p className="sectContainer__hint">You have proven yourself. Claim the sect&apos;s treasure.</p>
                  <button
                    type="button"
                    className="sectContainer__btn sectContainer__btn--primary"
                    onClick={() => dispatch(claimSectQuestReward(currentSectId))}
                  >
                    Claim reward
                  </button>
                </>
              );
            }
            return (
              <p className="sectContainer__hint">Quest complete. You have received this sect&apos;s defining treasure.</p>
            );
          })()}
        </div>
      )}

      {activeTab === "relationships" && currentSectId != null && (
        <div className="sectContainer__relationships">
          <h3 className="sectContainer__storeTitle">Sect disciples</h3>
          <p className="sectContainer__hint">
            Gift spirit stones or talk (once per major realm) to increase favor. At {DUAL_CULTIVATION_MIN_FAVOR}+ favor you can choose them as dual cultivation partner in Meditation.
          </p>
          <div className="sectContainer__npcGrid">
            {(SECT_NPCS_BY_SECT[currentSectId] ?? []).map((npc) => {
              const key = `${npc.sectId}-${npc.id}`;
              const favor = npcFavor[key] ?? 0;
              const usedForRealm = realmDialogueUsed[key]?.[realm] === true;
              const canTalk = realm !== "Mortal" && !usedForRealm && REALM_DIALOGUE_REALMS.includes(realm);
              const isPartner = cultivationPartner?.sectId === npc.sectId && cultivationPartner?.npcId === npc.id;
              const canBePartner = favor >= DUAL_CULTIVATION_MIN_FAVOR;
              return (
                <div key={npc.id} className="sectContainer__npcCard">
                  <img src={npc.portraitImage} alt="" className="sectContainer__npcPortrait" />
                  <div className="sectContainer__npcInfo">
                    <strong>{npc.name}</strong> ({npc.gender})
                    <p className="sectContainer__npcFavor">Favor: {favor}/100</p>
                    <div className="sectContainer__npcActions">
                      <button
                        type="button"
                        className="sectContainer__btn sectContainer__btn--small"
                        onClick={() => dispatch(giftNpc({ sectId: npc.sectId, npcId: npc.id }))}
                        disabled={money < GIFT_SPIRIT_STONE_COST || favor >= 100}
                        title={`${GIFT_SPIRIT_STONE_COST} Spirit Stones → +1 Favor`}
                      >
                        Gift ({GIFT_SPIRIT_STONE_COST} SS)
                      </button>
                      {canTalk && (
                        <button
                          type="button"
                          className="sectContainer__btn sectContainer__btn--small"
                          onClick={() => dispatch(useRealmDialogue({ sectId: npc.sectId, npcId: npc.id, realmId: realm }))}
                        >
                          Talk ({realm})
                        </button>
                      )}
                      {canBePartner && (
                        <button
                          type="button"
                          className="sectContainer__btn sectContainer__btn--small sectContainer__btn--accent"
                          onClick={() =>
                            dispatch(
                              setCultivationPartner(
                                isPartner ? null : { sectId: npc.sectId, npcId: npc.id }
                              )
                            )
                          }
                        >
                          {isPartner ? "Unset partner" : "Set as partner"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="sectContainer__hint">
        To join another sect, open the Map and select a sect. You must leave your current sect first.
      </p>
      <button type="button" className="sectContainer__btn sectContainer__btn--secondary" onClick={openMap}>
        Open Map
      </button>
      <button type="button" className="sectContainer__btn sectContainer__btn--leave" onClick={handleLeave}>
        Leave sect
      </button>
    </div>
  );
};
