import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSect } from "../../state/reducers/characterSlice";
import { selectPath, selectCurrentSectId, selectSectRankIndex } from "../../state/selectors/characterSelectors";
import { SECTS_BY_ID } from "../../constants/data";
import SectI from "../../interfaces/SectI";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import { ContentArea } from "../../enum/ContentArea";
import { CombatArea } from "../../enum/CombatArea";
import "./SectWindow.css";

interface SectWindowProps {
  sect: SectI;
  onClose: () => void;
}

export const SectWindow: React.FC<SectWindowProps> = ({ sect, onClose }) => {
  const dispatch = useDispatch();
  const path = useSelector(selectPath);
  const currentSectId = useSelector(selectCurrentSectId);
  const sectRankIndex = useSelector(selectSectRankIndex);
  const isMember = currentSectId === sect.id;
  const pathMatches = path != null && sect.path === path;
  const inAnotherSect = currentSectId != null && currentSectId !== sect.id;
  const currentSect = currentSectId != null ? SECTS_BY_ID[currentSectId] : null;
  const canJoin = pathMatches && !inAnotherSect;

  const isOpposingSect = path != null && sect.path !== path;
  const isOnOwnPathSect = currentSect != null && currentSect.path === path;
  const isEligibleRaider = isOnOwnPathSect && isOpposingSect && sectRankIndex > 0;

  const getRaidAreaForSect = (s: SectI): CombatArea | null => {
    switch (s.id) {
      case 1:
        return CombatArea.JADE_MOUNTAIN_RAID;
      case 2:
        return CombatArea.VERDANT_VALLEY_RAID;
      case 3:
        return CombatArea.AZURE_SKY_RAID;
      case 4:
        return CombatArea.CRIMSON_DEMON_RAID;
      case 5:
        return CombatArea.SHADOW_SERPENT_RAID;
      case 6:
        return CombatArea.BONE_ABYSS_RAID;
      default:
        return null;
    }
  };

  const handleJoin = () => {
    if (canJoin) dispatch(setSect(sect.id));
  };

  const handleLeave = () => {
    dispatch(setSect(null));
  };

  const handleBattle = () => {
    if (!isEligibleRaider) return;
    const raidArea = getRaidAreaForSect(sect);
    if (!raidArea) return;
    dispatch(changeContent(routeFromArea(ContentArea.COMBAT, raidArea)));
    onClose();
  };

  const joinDisabledTitle = !pathMatches
    ? `You walk the ${path} path; you cannot join a ${sect.path} sect.`
    : inAnotherSect && currentSect
      ? `You are still a member of ${currentSect.name}. Leave your current sect first (e.g. via the Sect page in the header).`
      : undefined;

  return (
    <div className="sectWindow__backdrop" onClick={onClose} role="presentation">
      <div
        className="sectWindow__main"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sect-window-title"
      >
        <h2 id="sect-window-title" className="sectWindow__title">{sect.name}</h2>
        <p className="sectWindow__path">{sect.path} sect</p>
        <p className="sectWindow__description">{sect.description}</p>
        {isOpposingSect && (
          <p className="sectWindow__pathOnly sectWindow__pathOnly--info">
            You follow the <strong>{path}</strong> path; this is an opposing sect. At higher ranks, you can battle its disciples for their techniques and treasures.
          </p>
        )}
        {!pathMatches && !isMember && path != null && (
          <p className="sectWindow__pathOnly">Only cultivators on the {sect.path} path may join this sect.</p>
        )}
        {inAnotherSect && currentSect && (
          <p className="sectWindow__pathOnly sectWindow__pathOnly--info">
            You are still a member of <strong>{currentSect.name}</strong>. Leave your current sect before joining another (use the Sect page in the header).
          </p>
        )}
        <div className="sectWindow__actions">
          {isMember ? (
            <button type="button" className="sectWindow__btn sectWindow__btn--leave" onClick={handleLeave}>
              Leave sect
            </button>
          ) : (
            <button
              type="button"
              className="sectWindow__btn sectWindow__btn--join"
              onClick={handleJoin}
              disabled={!canJoin}
              title={joinDisabledTitle}
            >
              Join sect
            </button>
          )}
          {isOpposingSect && (
            <button
              type="button"
              className="sectWindow__btn sectWindow__btn--join"
              onClick={handleBattle}
              disabled={!isEligibleRaider}
              title={
                isEligibleRaider
                  ? "Battle this sect's disciples for loot matching your sect rank."
                  : "Requires you to be at least an Outer Disciple in a sect on your own path before you can battle this opposing sect."
              }
            >
              Battle this sect
            </button>
          )}
          <button type="button" className="sectWindow__btn sectWindow__btn--close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
