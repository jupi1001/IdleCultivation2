import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { formatRealm } from "../../constants/realmProgression";
import { setAutoLoot } from "../../state/reducers/characterSlice";
import { exportSave, importSave, hardReset, formatSaveDate } from "../../utils/saveManager";
import "./SettingsContainer.css";

export const SettingsContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);

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

  const lastSaved = character.lastActiveTimestamp;

  return (
    <div className="settings">
      <h2 className="settings__title">Settings</h2>
      <p className="settings__subtitle">
        Manage your save data. Export regularly to avoid losing progress!
      </p>

      {/* Save info */}
      <div className="settings__section">
        <h3 className="settings__section-title">Save Info</h3>
        <p className="settings__info">
          Realm: {formatRealm(character.realm, character.realmLevel)}
          {(character.reincarnationCount ?? 0) > 0 && ` · Reincarnations: ${character.reincarnationCount}`}
        </p>
        {lastSaved > 0 && (
          <p className="settings__info">Last saved: {formatSaveDate(lastSaved)}</p>
        )}
      </div>

      {/* Gameplay */}
      {character.autoLootUnlocked && (
        <div className="settings__section">
          <h3 className="settings__section-title">Gameplay</h3>
          <label className="settings__toggle-row">
            <span className="settings__toggle-label">Auto-Loot (combat)</span>
            <input
              type="checkbox"
              checked={!!character.autoLoot}
              onChange={(e) => dispatch(setAutoLoot(e.target.checked))}
              className="settings__checkbox"
            />
          </label>
          <p className="settings__section-desc">
            When on, loot and spirit stones from defeated enemies go straight to your inventory. Kept after reincarnation.
          </p>
        </div>
      )}

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
