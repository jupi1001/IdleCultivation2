import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatRealm } from "../../constants/realmProgression";
import { setAutoLoot, setAutoEat, setAutoEatHpPercent, setDeathPenaltyMode, setNotificationPrefs } from "../../state/reducers/settingsSlice";
import {
  selectLastActiveTimestamp,
  selectNotificationPrefs,
  selectRealm,
  selectRealmLevel,
  selectReincarnationCount,
  selectDeathPenaltyMode,
  selectAutoLootUnlocked,
  selectAutoLoot,
  selectAutoEatUnlocked,
  selectAutoEat,
  selectAutoEatHpPercent,
} from "../../state/selectors/characterSelectors";
import { exportSave, importSave, hardReset, formatSaveDate } from "../../utils/saveManager";
import "./SettingsContainer.css";

type Theme = "dark" | "light";

interface SettingsContainerProps {
  theme?: Theme;
  setTheme?: (t: Theme) => void;
}

const DEFAULT_NOTIFICATION_PREFS = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

export const SettingsContainer = ({ theme = "dark", setTheme }: SettingsContainerProps) => {
  const dispatch = useDispatch();
  const lastActiveTimestamp = useSelector(selectLastActiveTimestamp);
  const notificationPrefs = useSelector(selectNotificationPrefs);
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const reincarnationCount = useSelector(selectReincarnationCount);
  const deathPenaltyMode = useSelector(selectDeathPenaltyMode);
  const autoLootUnlocked = useSelector(selectAutoLootUnlocked);
  const autoLoot = useSelector(selectAutoLoot);
  const autoEatUnlocked = useSelector(selectAutoEatUnlocked);
  const autoEat = useSelector(selectAutoEat);
  const autoEatHpPercent = useSelector(selectAutoEatHpPercent);

  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const handleCopyExport = async () => {
    try {
      const data = exportSave();
      await navigator.clipboard.writeText(data);
      setExportMsg("Copied to clipboard!");
    } catch {
      setExportMsg("Failed to copy — try the download option.");
    }
    setTimeout(() => setExportMsg(null), 4000);
  };

  const handleDownloadExport = () => {
    try {
      const data = exportSave();
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = downloadRef.current;
      if (!a) return;
      a.href = url;
      a.download = `idle-cultivation-save-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMsg("File downloaded!");
      setTimeout(() => setExportMsg(null), 4000);
    } catch {
      setExportMsg("Failed to create download.");
      setTimeout(() => setExportMsg(null), 4000);
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setImportMsg({ text: "Paste a save string first.", ok: false });
      return;
    }
    const err = importSave(importText);
    if (err) {
      setImportMsg({ text: err, ok: false });
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      if (typeof content === "string") {
        setImportText(content.trim());
        setImportMsg(null);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleHardReset = () => {
    hardReset();
  };

  const lastSaved = lastActiveTimestamp;
  const notificationPrefsResolved = notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS;

  return (
    <div className="settings">
      <h2 className="settings__title">Settings</h2>
      <p className="settings__subtitle">
        Manage your save data. Export regularly to avoid losing progress!
      </p>

      {/* Appearance / Theme */}
      {setTheme != null && (
        <div className="settings__section">
          <h3 className="settings__section-title">Appearance</h3>
          <div className="settings__death-penalty">
            <span className="settings__toggle-label">Theme</span>
            <select
              className="settings__select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              aria-label="Theme"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <p className="settings__section-desc">Choose dark or light theme.</p>
        </div>
      )}

      {/* Save info */}
      <div className="settings__section">
        <h3 className="settings__section-title">Save Info</h3>
        <p className="settings__info">
          Realm: {formatRealm(realm, realmLevel)}
          {(reincarnationCount ?? 0) > 0 && ` · Reincarnations: ${reincarnationCount}`}
        </p>
        {lastSaved > 0 && (
          <p className="settings__info">Last saved: {formatSaveDate(lastSaved)}</p>
        )}
      </div>

      {/* Gameplay */}
      <div className="settings__section">
        <h3 className="settings__section-title">Gameplay</h3>
        <div className="settings__death-penalty">
          <span className="settings__toggle-label">Death penalty</span>
          <select
            className="settings__select"
            value={deathPenaltyMode ?? "normal"}
            onChange={(e) => dispatch(setDeathPenaltyMode(e.target.value as "normal" | "casual"))}
            aria-label="Death penalty mode"
          >
            <option value="normal">Normal (weakened until you meditate)</option>
            <option value="casual">Casual (no weakened state)</option>
          </select>
        </div>
        <p className="settings__section-desc">
          Normal: on death you lose loot and HP, then stay Weakened (50% combat stats) until you meditate for 30 seconds. Casual: no weakened state.
        </p>
        {autoLootUnlocked && (
          <>
            <label className="settings__toggle-row">
              <span className="settings__toggle-label">Auto-Loot (combat)</span>
              <input
                type="checkbox"
                checked={!!autoLoot}
                onChange={(e) => dispatch(setAutoLoot(e.target.checked))}
                className="settings__checkbox"
              />
            </label>
            <p className="settings__section-desc">
              When on, loot and spirit stones from defeated enemies go straight to your inventory. Kept after reincarnation.
            </p>
          </>
        )}
        {autoEatUnlocked && (
          <>
            <label className="settings__toggle-row">
              <span className="settings__toggle-label">Auto-Eat (combat)</span>
              <input
                type="checkbox"
                checked={!!autoEat}
                onChange={(e) => dispatch(setAutoEat(e.target.checked))}
                className="settings__checkbox"
              />
            </label>
            <div className="settings__death-penalty">
              <span className="settings__toggle-label">Eat food when HP below (%)</span>
              <input
                type="number"
                min={1}
                max={99}
                value={autoEatHpPercent ?? 30}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v)) dispatch(setAutoEatHpPercent(v));
                }}
                className="settings__input-narrow"
                aria-label="Auto-eat HP percent"
              />
            </div>
            <p className="settings__section-desc">
              When on, automatically consumes vitality food in combat when your HP drops to or below this percentage. Unlock in Shop.
            </p>
          </>
        )}
      </div>

      {/* Notifications */}
      <div className="settings__section">
        <h3 className="settings__section-title">Notifications</h3>
        <label className="settings__toggle-row">
          <span className="settings__toggle-label">Show toast popups</span>
          <input
            type="checkbox"
            checked={!!notificationPrefsResolved.toastsEnabled}
            onChange={(e) => dispatch(setNotificationPrefs({ toastsEnabled: e.target.checked }))}
            className="settings__checkbox"
          />
        </label>
        <p className="settings__section-desc">When off, notifications are still in Activity Log → Notifications.</p>
        <div className="settings__check-group">
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Level-up</span>
            <input type="checkbox" checked={!!notificationPrefsResolved.levelUp} onChange={(e) => dispatch(setNotificationPrefs({ levelUp: e.target.checked }))} className="settings__checkbox" />
          </label>
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Rare drop</span>
            <input type="checkbox" checked={!!notificationPrefsResolved.rareDrop} onChange={(e) => dispatch(setNotificationPrefs({ rareDrop: e.target.checked }))} className="settings__checkbox" />
          </label>
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Achievement</span>
            <input type="checkbox" checked={!!notificationPrefsResolved.achievement} onChange={(e) => dispatch(setNotificationPrefs({ achievement: e.target.checked }))} className="settings__checkbox" />
          </label>
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Expedition</span>
            <input type="checkbox" checked={!!notificationPrefsResolved.expedition} onChange={(e) => dispatch(setNotificationPrefs({ expedition: e.target.checked }))} className="settings__checkbox" />
          </label>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="settings__section">
        <h3 className="settings__section-title">Keyboard Shortcuts</h3>
        <p className="settings__section-desc">Single-letter keys open panels (when not typing in an input).</p>
        <ul className="settings__shortcuts-list">
          <li><kbd>M</kbd> Map</li>
          <li><kbd>S</kbd> Sect</li>
          <li><kbd>I</kbd> Inventory</li>
          <li><kbd>T</kbd> Training</li>
          <li><kbd>F</kbd> Fishing</li>
          <li><kbd>G</kbd> Gathering</li>
          <li><kbd>N</kbd> Mining</li>
          <li><kbd>P</kbd> Shop</li>
          <li><kbd>C</kbd> Cultivation Tree</li>
          <li><kbd>A</kbd> Achievements</li>
          <li><kbd>L</kbd> Activity Log</li>
          <li><kbd>E</kbd> Stats</li>
          <li><kbd>Esc</kbd> Close modal / back to Map</li>
          <li><kbd>1</kbd>–<kbd>9</kbd> Use vitality food in combat (first 9 healing items)</li>
        </ul>
      </div>

      {/* Export */}
      <div className="settings__section">
        <h3 className="settings__section-title">Export Save</h3>
        <p className="settings__section-desc">
          Copy your save to the clipboard or download as a file. Keep it safe!
        </p>
        <div className="settings__btn-row">
          <button className="settings__btn" onClick={handleCopyExport}>
            Copy to Clipboard
          </button>
          <button className="settings__btn" onClick={handleDownloadExport}>
            Download File
          </button>
        </div>
        {exportMsg && <p className="settings__msg settings__msg--success">{exportMsg}</p>}
        <a ref={downloadRef} className="settings__download-link" aria-hidden>dl</a>
      </div>

      {/* Import */}
      <div className="settings__section">
        <h3 className="settings__section-title">Import Save</h3>
        <p className="settings__section-desc">
          Paste a previously exported save string, or load a file. This will replace your current save and reload.
        </p>
        <textarea
          className="settings__textarea"
          value={importText}
          onChange={(e) => { setImportText(e.target.value); setImportMsg(null); }}
          placeholder="Paste save string here..."
          spellCheck={false}
        />
        <div className="settings__btn-row">
          <button
            className="settings__btn settings__btn--success"
            onClick={handleImport}
            disabled={!importText.trim()}
          >
            Import Save
          </button>
          <label className="settings__btn" style={{ cursor: "pointer" }}>
            Load File
            <input
              type="file"
              accept=".txt,.json"
              style={{ display: "none" }}
              onChange={handleFileImport}
            />
          </label>
        </div>
        {importMsg && (
          <p className={`settings__msg ${importMsg.ok ? "settings__msg--success" : "settings__msg--error"}`}>
            {importMsg.text}
          </p>
        )}
      </div>

      {/* Hard Reset */}
      <div className="settings__section">
        <h3 className="settings__section-title">Hard Reset</h3>
        <p className="settings__section-desc">
          Permanently delete all save data and start a brand new game. This cannot be undone.
          Export your save first if you want to keep it.
        </p>
        {!resetConfirm ? (
          <button
            className="settings__btn settings__btn--danger"
            onClick={() => setResetConfirm(true)}
          >
            Delete Save & Reset
          </button>
        ) : (
          <div className="settings__confirm-row">
            <button
              className="settings__btn settings__btn--danger"
              onClick={handleHardReset}
            >
              Yes, delete everything
            </button>
            <button
              className="settings__btn settings__btn--cancel"
              onClick={() => setResetConfirm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
