import React from "react";
import "./SettingsContainer.css";
import type { Theme } from "./useSettingsScreen";

interface SettingsScreenProps {
  theme?: Theme;
  setTheme?: (t: Theme) => void;
  realm: string;
  realmLevel: number;
  reincarnationCount: number | null | undefined;
  deathPenaltyMode: "normal" | "casual" | null | undefined;
  autoLootUnlocked: boolean;
  autoLoot: boolean;
  autoEatUnlocked: boolean;
  autoEat: boolean;
  autoEatHpPercent: number | null | undefined;
  lastSaved: number;
  notificationPrefsResolved: {
    toastsEnabled: boolean;
    levelUp: boolean;
    rareDrop: boolean;
    achievement: boolean;
    expedition: boolean;
  };
  exportMsg: string | null;
  importText: string;
  importMsg: { text: string; ok: boolean } | null;
  resetConfirm: boolean;
  downloadRef: React.RefObject<HTMLAnchorElement>;
  setImportText: (text: string) => void;
  setImportMsg: (msg: { text: string; ok: boolean } | null) => void;
  setResetConfirm: (value: boolean) => void;
  handleCopyExport: () => void;
  handleDownloadExport: () => void;
  handleImport: () => void;
  handleFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHardReset: () => void;
  toggleDeathPenaltyMode: (mode: "normal" | "casual") => void;
  toggleAutoLoot: (value: boolean) => void;
  toggleAutoEat: (value: boolean) => void;
  changeAutoEatHpPercent: (value: number) => void;
  updateNotificationPrefs: (partial: Partial<typeof notificationPrefs>) => void;
  formatRealm: (realm: string, level: number) => string;
  formatSaveDate: (ts: number) => string;
}

const notificationPrefs = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

export const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const {
    theme = "dark",
    setTheme,
    realm,
    realmLevel,
    reincarnationCount,
    deathPenaltyMode,
    autoLootUnlocked,
    autoLoot,
    autoEatUnlocked,
    autoEat,
    autoEatHpPercent,
    lastSaved,
    notificationPrefsResolved,
    exportMsg,
    importText,
    importMsg,
    resetConfirm,
    downloadRef,
    setImportText,
    setImportMsg,
    setResetConfirm,
    handleCopyExport,
    handleDownloadExport,
    handleImport,
    handleFileImport,
    handleHardReset,
    toggleDeathPenaltyMode,
    toggleAutoLoot,
    toggleAutoEat,
    changeAutoEatHpPercent,
    updateNotificationPrefs,
    formatRealm,
    formatSaveDate,
  } = props;

  return (
    <div className="settings">
      <h2 className="settings__title">Settings</h2>
      <p className="settings__subtitle">
        Manage your save data. Export regularly to avoid losing progress!
      </p>

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

      <div className="settings__section">
        <h3 className="settings__section-title">Gameplay</h3>
        <div className="settings__death-penalty">
          <span className="settings__toggle-label">Death penalty</span>
          <select
            className="settings__select"
            value={deathPenaltyMode ?? "normal"}
            onChange={(e) => toggleDeathPenaltyMode(e.target.value as "normal" | "casual")}
            aria-label="Death penalty mode"
          >
            <option value="normal">Normal (weakened until you meditate)</option>
            <option value="casual">Casual (no weakened state)</option>
          </select>
        </div>
        <p className="settings__section-desc">
          Normal: on death you lose loot and HP, then stay Weakened (50% combat stats) until you
          meditate for 30 seconds. Casual: no weakened state.
        </p>
        {autoLootUnlocked && (
          <>
            <label className="settings__toggle-row">
              <span className="settings__toggle-label">Auto-Loot (combat)</span>
              <input
                type="checkbox"
                checked={!!autoLoot}
                onChange={(e) => toggleAutoLoot(e.target.checked)}
                className="settings__checkbox"
              />
            </label>
            <p className="settings__section-desc">
              When on, loot and spirit stones from defeated enemies go straight to your inventory.
              Kept after reincarnation.
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
                onChange={(e) => toggleAutoEat(e.target.checked)}
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
                  if (!Number.isNaN(v)) changeAutoEatHpPercent(v);
                }}
                className="settings__input-narrow"
                aria-label="Auto-eat HP percent"
              />
            </div>
            <p className="settings__section-desc">
              When on, automatically consumes vitality food in combat when your HP drops to or
              below this percentage. Unlock in Shop.
            </p>
          </>
        )}
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Notifications</h3>
        <label className="settings__toggle-row">
          <span className="settings__toggle-label">Show toast popups</span>
          <input
            type="checkbox"
            checked={!!notificationPrefsResolved.toastsEnabled}
            onChange={(e) => updateNotificationPrefs({ toastsEnabled: e.target.checked })}
            className="settings__checkbox"
          />
        </label>
        <p className="settings__section-desc">
          When off, notifications are still in Activity Log → Notifications.
        </p>
        <div className="settings__check-group">
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Level-up</span>
            <input
              type="checkbox"
              checked={!!notificationPrefsResolved.levelUp}
              onChange={(e) => updateNotificationPrefs({ levelUp: e.target.checked })}
              className="settings__checkbox"
            />
          </label>
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Rare drop</span>
            <input
              type="checkbox"
              checked={!!notificationPrefsResolved.rareDrop}
              onChange={(e) => updateNotificationPrefs({ rareDrop: e.target.checked })}
              className="settings__checkbox"
            />
          </label>
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Achievement</span>
            <input
              type="checkbox"
              checked={!!notificationPrefsResolved.achievement}
              onChange={(e) => updateNotificationPrefs({ achievement: e.target.checked })}
              className="settings__checkbox"
            />
          </label>
          <label className="settings__toggle-row settings__toggle-row--small">
            <span className="settings__toggle-label">Expedition</span>
            <input
              type="checkbox"
              checked={!!notificationPrefsResolved.expedition}
              onChange={(e) => updateNotificationPrefs({ expedition: e.target.checked })}
              className="settings__checkbox"
            />
          </label>
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Keyboard Shortcuts</h3>
        <p className="settings__section-desc">
          Single-letter keys open panels (when not typing in an input).
        </p>
        <ul className="settings__shortcuts-list">
          <li>
            <kbd>M</kbd> Map
          </li>
          <li>
            <kbd>S</kbd> Sect
          </li>
          <li>
            <kbd>I</kbd> Inventory
          </li>
          <li>
            <kbd>T</kbd> Training
          </li>
          <li>
            <kbd>F</kbd> Fishing
          </li>
          <li>
            <kbd>G</kbd> Gathering
          </li>
          <li>
            <kbd>N</kbd> Mining
          </li>
          <li>
            <kbd>P</kbd> Shop
          </li>
          <li>
            <kbd>C</kbd> Cultivation Tree
          </li>
          <li>
            <kbd>A</kbd> Achievements
          </li>
          <li>
            <kbd>L</kbd> Activity Log
          </li>
          <li>
            <kbd>E</kbd> Stats
          </li>
          <li>
            <kbd>Esc</kbd> Close modal / back to Map
          </li>
          <li>
            <kbd>1</kbd>–<kbd>9</kbd> Use vitality food in combat (first 9 healing items)
          </li>
        </ul>
      </div>

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
        <a ref={downloadRef} className="settings__download-link" aria-hidden>
          dl
        </a>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Import Save</h3>
        <p className="settings__section-desc">
          Paste a previously exported save string, or load a file. This will replace your current
          save and reload.
        </p>
        <textarea
          className="settings__textarea"
          value={importText}
          onChange={(e) => {
            setImportText(e.target.value);
            setImportMsg(null);
          }}
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
          <p
            className={`settings__msg ${
              importMsg.ok ? "settings__msg--success" : "settings__msg--error"
            }`}
          >
            {importMsg.text}
          </p>
        )}
      </div>

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
            <button className="settings__btn settings__btn--danger" onClick={handleHardReset}>
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

