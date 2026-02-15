import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { changeContent } from "../../state/reducers/contentSlice";
import { setSect, startPromotion, completePromotion } from "../../state/reducers/characterSlice";
import { ContentArea } from "../../enum/ContentArea";
import { getStepIndex } from "../../constants/realmProgression";
import { sectsData, SECT_POSITIONS, sectStoreData } from "../../constants/data";
import { SectStoreItem } from "../../components/SectStoreItem/SectStoreItem";
import "./SectContainer.css";

const PROMOTION_DURATION_MS = 5000;

export const SectContainer = () => {
  const dispatch = useDispatch();
  const [now, setNow] = useState(Date.now());
  const currentSectId = useSelector((state: RootState) => state.character.currentSectId);
  const sectRankIndex = useSelector((state: RootState) => state.character.sectRankIndex);
  const realm = useSelector((state: RootState) => state.character.realm);
  const realmLevel = useSelector((state: RootState) => state.character.realmLevel);
  const promotionEndTime = useSelector((state: RootState) => state.character.promotionEndTime);
  const promotionToRankIndex = useSelector((state: RootState) => state.character.promotionToRankIndex);

  const currentSect = currentSectId != null ? sectsData.find((s) => s.id === currentSectId) : null;
  /** All sects on the same path (your sect + allied sects); you can buy from any of them based on your rank. */
  const sectsOnPath =
    currentSectId != null && currentSect != null
      ? sectsData
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

  const openMap = () => dispatch(changeContent(ContentArea.MAP));
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
    </div>
  );
};
