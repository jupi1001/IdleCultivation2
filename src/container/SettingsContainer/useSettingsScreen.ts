import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatRealm } from "../../constants/realmProgression";
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
import {
  setAutoLoot,
  setAutoEat,
  setAutoEatHpPercent,
  setDeathPenaltyMode,
  setNotificationPrefs,
} from "../../state/reducers/settingsSlice";
import { exportSave, importSave, hardReset, formatSaveDate } from "../../utils/saveManager";

export type Theme = "dark" | "light";

const DEFAULT_NOTIFICATION_PREFS = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

export function useSettingsScreen() {
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

  const toggleDeathPenaltyMode = (mode: "normal" | "casual") =>
    dispatch(setDeathPenaltyMode(mode));

  const toggleAutoLoot = (value: boolean) => dispatch(setAutoLoot(value));

  const toggleAutoEat = (value: boolean) => dispatch(setAutoEat(value));

  const changeAutoEatHpPercent = (value: number) => dispatch(setAutoEatHpPercent(value));

  const updateNotificationPrefs = (partial: Partial<typeof DEFAULT_NOTIFICATION_PREFS>) =>
    dispatch(setNotificationPrefs(partial));

  const lastSaved = lastActiveTimestamp;
  const notificationPrefsResolved = notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS;

  return {
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
  };
}

