/**
 * Shared test utilities: mock Redux state and render helpers.
 * Use createMockState for selector/reducer tests; use renderWithProviders for component/hook tests.
 */
import { getCombatStatsFromRealm } from "../constants/realmProgression";
import type { RootState } from "../state/store";
import { ALL_EQUIPMENT_SLOTS } from "../types/EquipmentSlot";

/**
 * Build minimal RootState for selector/reducer/component tests.
 * Character, combat, and skills are fully shaped; other slices are minimal.
 */
export function createMockState(
  character: Partial<RootState["character"]> = {},
  combat: Partial<RootState["combat"]> = {}
): RootState {
  const realmStats = getCombatStatsFromRealm("Mortal", 0);
  const defaultEquipment = ALL_EQUIPMENT_SLOTS.reduce(
    (acc, slot) => ({ ...acc, [slot]: null }),
    {} as RootState["equipment"]["equipment"]
  );
  const baseCharacter: RootState["character"] = {
    name: "Mortal",
    attack: realmStats.attack,
    defense: realmStats.defense,
    health: realmStats.health,
    money: 0,
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
  };
  const defaultAvatars: RootState["avatars"] = {
    avatars: [],
    nextAvatarId: 1,
    expeditionEndTime: null,
    expeditionMissionId: null,
  };
  const defaultSkills: RootState["skills"] = {
    fishingXP: 0,
    miningXP: 0,
    gatheringXP: 0,
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
  };
  const defaultSect = {
    currentSectId: null,
    sectRankIndex: 0,
    promotionEndTime: null,
    promotionToRankIndex: null,
    sectQuestProgress: {} as Record<number, number>,
    sectQuestKillCount: {} as Record<number, number>,
    obtainedSectTreasureIds: [] as number[],
    npcFavor: {} as Record<string, number>,
    realmDialogueUsed: {} as Record<string, Record<string, boolean>>,
    cultivationPartner: null as { sectId: number; npcId: number } | null,
  };
  const defaultCombat: RootState["combat"] = {
    currentHealth: realmStats.health,
    isWeakened: false,
    weakenedMeditationSecondsDone: 0,
  };
  const defaultSettings = {
    notificationPrefs: {
      toastsEnabled: true,
      levelUp: true,
      rareDrop: true,
      achievement: true,
      expedition: true,
    },
    soundVolume: { music: 100, sfx: 100 },
    deathPenaltyMode: "normal" as const,
    autoLootUnlocked: false,
    autoLoot: false,
    autoEatUnlocked: false,
    autoEat: false,
    autoEatHpPercent: 30,
  };
  const defaultReincarnation = {
    reincarnationCount: 0,
    karmaPoints: 0,
    totalKarmaEarned: 0,
    karmaBonusLevels: {} as Partial<Record<string, number>>,
  };
  const defaultStats = {
    enemiesKilledByArea: {},
    itemsGatheredFishing: 0,
    itemsGatheredMining: 0,
    itemsGatheredGathering: 0,
    totalSpiritStonesEarned: 0,
    totalQiGenerated: 0,
    totalBreakthroughs: 0,
    timePlayedMs: 0,
    highestRealmStep: 0,
    itemsCraftedAlchemy: 0,
    itemsCraftedForging: 0,
    itemsCraftedCooking: 0,
    deaths: 0,
  };
  return {
    character: { ...baseCharacter, ...character },
    avatars: defaultAvatars,
    combat: { ...defaultCombat, ...combat },
    settings: defaultSettings,
    stats: defaultStats,
    sect: defaultSect,
    inventory: { itemsById: {} },
    equipment: { equipment: defaultEquipment },
    skills: defaultSkills,
    reincarnation: defaultReincarnation,
    content: { route: { type: "map" as const } },
    toast: { toasts: [], toastHistory: [] },
    achievements: { unlocked: {} },
    log: { entries: [], filter: "all" as const, panelCollapsed: true },
  } as unknown as RootState;
}
