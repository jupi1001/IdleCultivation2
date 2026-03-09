/**
 * Lifetime character statistics (persisted in stats slice).
 */

export interface CharacterStats {
  enemiesKilledByArea: Record<string, number>;
  itemsGatheredFishing: number;
  itemsGatheredMining: number;
  itemsGatheredGathering: number;
  totalSpiritStonesEarned: number;
  totalQiGenerated: number;
  totalBreakthroughs: number;
  timePlayedMs: number;
  highestRealmStep: number;
  itemsCraftedAlchemy: number;
  itemsCraftedForging: number;
  itemsCraftedCooking: number;
  deaths: number;
}

export const INITIAL_CHARACTER_STATS: CharacterStats = {
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
