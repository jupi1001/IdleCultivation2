import { describe, it, expect } from "vitest";
import { runMigrations } from "./index";
import { parsePersistedRootState } from "../../schemas/saveState";

/**
 * Migration tests (Ticket 9).
 *
 * These use hand-crafted fixtures that simulate older save shapes and assert:
 * - Fields moved from character → dedicated slices.
 * - Defaults are filled in for missing settings/reincarnation/content route.
 * - Inventory is normalized from items[] to itemsById.
 * - The final root state passes the persistedRootSchema (Zod).
 */

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("runMigrations", () => {
  it("migrates legacy character-only save into dedicated slices and normalizes inventory", () => {
    const legacyCharacterOnly = {
      character: {
        name: "Old Mortal",
        attack: 10,
        defense: 1,
        health: 10,
        money: 123,
        miner: 0,
        realm: "Mortal",
        realmLevel: 0,
        qi: 0,
        currentActivity: "none",
        path: null,
        gender: null,
        talentLevels: {},
        bonusAttack: 0,
        bonusDefense: 0,
        bonusHealth: 0,
        lastActiveTimestamp: 0,
        lastOfflineSummary: null,
        // Legacy embedded settings
        notificationPrefs: { toastsEnabled: false, levelUp: true, rareDrop: true, achievement: true, expedition: true },
        soundVolume: { music: 50, sfx: 75 },
        deathPenaltyMode: "casual",
        autoLootUnlocked: true,
        autoLoot: true,
        autoEatUnlocked: true,
        autoEat: true,
        autoEatHpPercent: 40,
        // Legacy embedded reincarnation
        reincarnationCount: 2,
        karmaPoints: 10,
        totalKarmaEarned: 20,
        karmaBonusLevels: { someBonus: 1 },
        // Legacy embedded stats
        stats: {
          enemiesKilledByArea: { "Village Outskirts": 5 },
          itemsGatheredFishing: 1,
          itemsGatheredMining: 2,
          itemsGatheredGathering: 3,
          totalSpiritStonesEarned: 100,
          totalQiGenerated: 200,
          totalBreakthroughs: 1,
          timePlayedMs: 1000,
          highestRealmStep: 3,
          itemsCraftedAlchemy: 0,
          itemsCraftedForging: 0,
          itemsCraftedCooking: 0,
          deaths: 0,
        },
        // Legacy embedded sect fields
        currentSectId: 1,
        sectRankIndex: 2,
        promotionEndTime: 123456,
        promotionToRankIndex: 3,
        sectQuestProgress: { 1: 10 },
        sectQuestKillCount: { 1: 5 },
        obtainedSectTreasureIds: [101],
        npcFavor: { npc1: 5 },
        realmDialogueUsed: { "Mortal": { intro: true } },
        cultivationPartner: { sectId: 1, npcId: 2 },
        // Legacy inventory: items[]
        items: [
          { id: 301, quantity: 2 },
          { id: 301, quantity: 1 },
          { id: 302 },
        ],
        // Legacy equipment/skills/avatars fields
        equipment: { sword: 301 },
        fishingXP: 10,
        miningXP: 20,
        gatheringXP: 30,
        alchemyXP: 0,
        forgingXP: 0,
        cookingXP: 0,
        currentFishingArea: null,
        fishingCastStartTime: null,
        fishingCastDuration: 0,
        fishingCastId: 0,
        currentMiningArea: null,
        miningCastStartTime: null,
        miningCastDuration: 0,
        miningCastId: 0,
        currentGatheringArea: null,
        gatheringCastStartTime: null,
        gatheringCastDuration: 0,
        gatheringCastId: 0,
        avatars: [],
        nextAvatarId: 1,
        expeditionEndTime: null,
        expeditionMissionId: null,
      },
      // No dedicated slices yet
    } as unknown;

    const migrated = runMigrations(clone(legacyCharacterOnly));

    // Zod: top-level shape is valid after migrations.
    const parsed = parsePersistedRootState(migrated);

    // Settings moved from character → settings slice.
    expect(parsed.settings.notificationPrefs.toastsEnabled).toBe(false);
    expect(parsed.settings.soundVolume.music).toBe(50);
    expect(parsed.settings.deathPenaltyMode).toBe("casual");
    expect(parsed.settings.autoLootUnlocked).toBe(true);
    expect(parsed.settings.autoEatHpPercent).toBe(40);

    // Reincarnation moved from character → reincarnation slice.
    expect(parsed.reincarnation.reincarnationCount).toBe(2);
    expect(parsed.reincarnation.karmaPoints).toBe(10);
    expect(parsed.reincarnation.totalKarmaEarned).toBe(20);
    expect(parsed.reincarnation.karmaBonusLevels.someBonus).toBe(1);

    // Stats slice created from character.stats.
    expect(parsed.stats.enemiesKilledByArea["Village Outskirts"]).toBe(5);
    expect(parsed.stats.itemsGatheredMining).toBe(2);
    expect(parsed.stats.totalSpiritStonesEarned).toBe(100);

    // Sect slice created from character sect fields.
    expect(parsed.sect.currentSectId).toBe(1);
    expect(parsed.sect.sectRankIndex).toBe(2);
    expect(parsed.sect.obtainedSectTreasureIds).toEqual([101]);
    expect(parsed.sect.npcFavor.npc1).toBe(5);

    // Inventory slice created and items[] normalized to itemsById.
    expect(parsed.inventory.itemsById[301]).toBe(3); // 2 + 1
    expect(parsed.inventory.itemsById[302]).toBe(1);

    // Equipment slice created from character.equipment.
    expect(parsed.equipment.equipment.sword).toBe(301);

    // Skills slice created from character XP/cast fields.
    expect(parsed.skills.fishingXP).toBe(10);
    expect(parsed.skills.miningXP).toBe(20);
    expect(parsed.skills.currentFishingArea).toBeNull();

    // Avatars slice created from character avatars fields.
    expect(parsed.avatars.avatars).toEqual([]);
    expect(parsed.avatars.nextAvatarId).toBe(1);

    // Character no longer holds legacy inventory/equipment/stats fields.
    const migratedChar = (parsed as any).character as Record<string, unknown>;
    expect(migratedChar.items).toBeUndefined();
    expect(migratedChar.itemsById).toBeUndefined();
    expect(migratedChar.equipment).toBeUndefined();
    expect(migratedChar.stats).toBeUndefined();
  });

  it("fills defaults for existing settings/reincarnation slices with missing fields", () => {
    const legacyRoot = {
      settings: {
        notificationPrefs: { toastsEnabled: false }, // partial
      },
      reincarnation: {
        reincarnationCount: 1,
      },
      // Minimal required slices for persistedRootSchema; migrations shouldn't touch these.
      character: {},
      avatars: {},
      combat: {},
      stats: {},
      sect: {},
      inventory: { itemsById: {} },
      equipment: { equipment: {} },
      skills: {},
      content: { route: { type: "map" } },
      toast: {},
      achievements: {},
      log: {},
    } as unknown;

    const migrated = runMigrations(clone(legacyRoot));
    const parsed = parsePersistedRootState(migrated);

    // Settings defaults are not applied to nested notificationPrefs keys; we only ensure the object exists.
    // Existing values must be preserved.
    expect(parsed.settings.notificationPrefs.toastsEnabled).toBe(false);
    expect(parsed.settings.soundVolume.music).toBe(100);
    expect(parsed.settings.deathPenaltyMode).toBe("normal");

    // Reincarnation defaults applied.
    expect(parsed.reincarnation.reincarnationCount).toBe(1);
    expect(parsed.reincarnation.karmaPoints).toBe(0);
    expect(parsed.reincarnation.karmaBonusLevels).toEqual({});
  });

  it("migrates legacy content.page string to typed route", () => {
    const legacyRoot = {
      content: {
        page: "map",
      },
    } as unknown;

    const migrated = runMigrations(clone(legacyRoot));
    const parsed = parsePersistedRootState(migrated);

    expect(parsed.content.route).toEqual({ type: "map" });
  });
});

