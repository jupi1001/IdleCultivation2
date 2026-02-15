import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSect } from "../../state/reducers/characterSlice";
import { RootState } from "../../state/store";
import { sectsData } from "../../constants/data";
import SectI from "../../interfaces/SectI";
import "./SectWindow.css";

interface SectWindowProps {
  sect: SectI;
  onClose: () => void;
}

export const SectWindow: React.FC<SectWindowProps> = ({ sect, onClose }) => {
  const dispatch = useDispatch();
  const path = useSelector((state: RootState) => state.character.path);
  const currentSectId = useSelector((state: RootState) => state.character.currentSectId);
  const isMember = currentSectId === sect.id;
  const pathMatches = path != null && sect.path === path;
  const inAnotherSect = currentSectId != null && currentSectId !== sect.id;
  const currentSect = currentSectId != null ? sectsData.find((s) => s.id === currentSectId) : null;
  const canJoin = pathMatches && !inAnotherSect;

  const handleJoin = () => {
    if (canJoin) dispatch(setSect(sect.id));
  };

  const handleLeave = () => {
    dispatch(setSect(null));
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
          <button type="button" className="sectWindow__btn sectWindow__btn--close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
