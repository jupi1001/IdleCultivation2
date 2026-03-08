/**
 * Character slice migrations.
 * Owned by: state/reducers/characterSlice (logical owner when slice is split in Task 1).
 */

import type { SliceMigrator } from "./types";

const DEFAULT_NOTIFICATION_PREFS = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

const DEFAULT_SOUND_VOLUME = { music: 100, sfx: 100 };

/** v1: Ensure character has defaults for notificationPrefs, soundVolume, and sect/relationship fields. */
const ensureCharacterDefaults: SliceMigrator = (sliceState) => {
  if (!sliceState || typeof sliceState !== "object") return sliceState;
  const c = sliceState as Record<string, unknown>;
  if (!c.notificationPrefs) c.notificationPrefs = { ...DEFAULT_NOTIFICATION_PREFS };
  if (!c.soundVolume) c.soundVolume = { ...DEFAULT_SOUND_VOLUME };
  if (c.autoEatUnlocked == null) c.autoEatUnlocked = false;
  if (c.autoEat == null) c.autoEat = false;
  if (c.autoEatHpPercent == null) c.autoEatHpPercent = 30;
  if (c.sectQuestProgress == null) c.sectQuestProgress = {};
  if (c.sectQuestKillCount == null) c.sectQuestKillCount = {};
  if (c.obtainedSectTreasureIds == null) c.obtainedSectTreasureIds = [];
  if (c.npcFavor == null) c.npcFavor = {};
  if (c.realmDialogueUsed == null) c.realmDialogueUsed = {};
  if (c.cultivationPartner == null) c.cultivationPartner = null;
  return sliceState;
};

/** v2: Normalize inventory from Item[] to itemsById (Record<itemId, quantity>). */
const characterItemsToItemsById: SliceMigrator = (sliceState) => {
  if (!sliceState || typeof sliceState !== "object") return sliceState;
  const c = sliceState as Record<string, unknown>;
  if (Array.isArray(c.items) && !c.itemsById) {
    const itemsById: Record<number, number> = {};
    for (const entry of c.items as { id: number; quantity?: number }[]) {
      const id = entry?.id;
      if (id != null) {
        const qty = entry.quantity ?? 1;
        itemsById[id] = (itemsById[id] ?? 0) + qty;
      }
    }
    c.itemsById = itemsById;
    delete c.items;
  }
  if (c.itemsById == null) c.itemsById = {};
  return sliceState;
};

export const characterMigrations: readonly SliceMigrator[] = [
  ensureCharacterDefaults,
  characterItemsToItemsById,
];

export { DEFAULT_NOTIFICATION_PREFS, DEFAULT_SOUND_VOLUME };
