/**
 * Save import/export utilities.
 *
 * Export: serialize persisted Redux state to a Base64-encoded JSON string.
 * Import: decode, validate shape, and replace persisted state.
 * Hard Reset: purge persisted state and reload.
 */
import { store, persistor, type RootState } from "../state/store";

const PERSIST_KEY = "persist:idle-cultivation";

/** Version tag so we can detect incompatible exports in the future. */
const SAVE_FORMAT_VERSION = 1;

interface SaveEnvelope {
  v: number;
  ts: number;
  state: {
    character: RootState["character"];
    content: RootState["content"];
  };
}

/**
 * Export current game state as a Base64-encoded string.
 * Returns the string (caller decides clipboard vs download).
 */
export function exportSave(): string {
  const rootState = store.getState();
  const envelope: SaveEnvelope = {
    v: SAVE_FORMAT_VERSION,
    ts: Date.now(),
    state: {
      character: rootState.character,
      content: rootState.content,
    },
  };
  const json = JSON.stringify(envelope);
  return btoa(unescape(encodeURIComponent(json)));
}

/**
 * Validate and import a save string. Returns an error message on failure, or null on success.
 * On success the page reloads to apply the new state cleanly.
 */
export function importSave(encoded: string): string | null {
  let json: string;
  try {
    json = decodeURIComponent(escape(atob(encoded.trim())));
  } catch {
    return "Invalid save data — could not decode.";
  }

  let envelope: SaveEnvelope;
  try {
    envelope = JSON.parse(json);
  } catch {
    return "Invalid save data — malformed JSON.";
  }

  if (typeof envelope !== "object" || envelope === null) {
    return "Invalid save data — not an object.";
  }
  if (typeof envelope.v !== "number") {
    return "Invalid save data — missing version.";
  }
  if (envelope.v > SAVE_FORMAT_VERSION) {
    return `Save was created with a newer version (v${envelope.v}). Please update the game first.`;
  }
  if (!envelope.state || typeof envelope.state !== "object") {
    return "Invalid save data — missing state.";
  }
  if (!envelope.state.character || typeof envelope.state.character !== "object") {
    return "Invalid save data — missing character.";
  }

  try {
    const persistPayload: Record<string, string> = {
      character: JSON.stringify(envelope.state.character),
      content: JSON.stringify(envelope.state.content ?? { page: "Map" }),
      _persist: JSON.stringify({ version: 1, rehydrated: true }),
    };
    localStorage.setItem(PERSIST_KEY, JSON.stringify(persistPayload));
  } catch {
    return "Failed to write save to storage.";
  }

  window.location.reload();
  return null;
}

/**
 * Purge all persisted state and reload. Effectively a "new game".
 */
export async function hardReset(): Promise<void> {
  await persistor.purge();
  localStorage.removeItem(PERSIST_KEY);
  localStorage.removeItem("idle-cultivation-lastActive");
  window.location.reload();
}

/**
 * Format a timestamp as a human-readable date/time string for display.
 */
export function formatSaveDate(ts: number): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "Unknown";
  }
}
