import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Map.css";
import { ContentArea } from "../../enum/ContentArea";
import { changeContent } from "../../state/reducers/contentSlice";
import { sectsData } from "../../constants/data";
import { SectWindow } from "../../components/SectWindow/SectWindow";
import type SectI from "../../interfaces/SectI";

const SECTS_MAP_IMAGE = "/assets/map/sects-map.png";

/** Shadow Bazaar: black market on the map – different shop than header Shop. Position on map (percentage). */
const SHADOW_BAZAAR = { positionX: 20, positionY: 12, name: "Shadow Bazaar", description: "Rare and forbidden wares. No questions asked." };

export const Map = () => {
  const dispatch = useDispatch();
  const [sectWindow, setSectWindow] = useState<SectI | null>(null);

  /* All sects are visible on the map; path only limits which ones you can join (see SectWindow). */
  const sects = sectsData;

  return (
    <div className="map__wrap">
      <div
        className="map__canvas"
        style={{ backgroundImage: `url(${SECTS_MAP_IMAGE})` }}
        role="img"
        aria-label="World map"
      />
      <div className="map__overlay">
        {/* Shadow Bazaar – opens Black Market (different from header Shop) */}
        <button
          type="button"
          className="map__pin map__pin--pavilion"
          style={{ left: `${SHADOW_BAZAAR.positionX}%`, top: `${SHADOW_BAZAAR.positionY}%` }}
          onClick={() => dispatch(changeContent(ContentArea.BLACK_MARKET))}
          title={SHADOW_BAZAAR.description}
        >
          <span className="map__pin-label" aria-hidden>⌗</span>
          <span className="map__pin-tooltip">{SHADOW_BAZAAR.name} — {SHADOW_BAZAAR.description}</span>
        </button>

        {/* Sects – only those matching character path */}
        {sects.map((sect) => (
          <button
            key={sect.id}
            type="button"
            className="map__pin map__pin--sect"
            style={{ left: `${sect.positionX}%`, top: `${sect.positionY}%` }}
            onClick={() => setSectWindow(sect)}
            title={sect.description}
          >
            <span className="map__pin-label" aria-hidden>S</span>
            <span className="map__pin-tooltip">
              <strong>{sect.name}</strong>
              <span className="map__pin-tooltip-desc">{sect.description}</span>
            </span>
          </button>
        ))}
      </div>

      {sectWindow && (
        <SectWindow sect={sectWindow} onClose={() => setSectWindow(null)} />
      )}
    </div>
  );
};
