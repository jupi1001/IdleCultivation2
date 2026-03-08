import React from "react";
import { useSelector } from "react-redux";
import { getRealmLabelFromStep } from "../../constants/realmProgression";
import type { CharacterStats } from "../../state/reducers/characterSlice";
import { selectStats } from "../../state/selectors/characterSelectors";
import "./StatsContainer.css";

const defaultStats: CharacterStats = {
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

function formatTime(ms: number): string {
  if (ms < 1000) return "< 1s";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ${sec % 60}s`;
  const hr = Math.floor(min / 60);
  return `${hr}h ${min % 60}m`;
}

export const StatsContainer = () => {
  const statsResolved = useSelector(selectStats);
  const stats: CharacterStats = statsResolved ?? defaultStats;

  const totalEnemiesKilled = Object.values(stats.enemiesKilledByArea ?? {}).reduce((a, b) => a + b, 0);
  const totalItemsGathered =
    (stats.itemsGatheredFishing ?? 0) + (stats.itemsGatheredMining ?? 0) + (stats.itemsGatheredGathering ?? 0);
  const totalCrafted =
    (stats.itemsCraftedAlchemy ?? 0) + (stats.itemsCraftedForging ?? 0) + (stats.itemsCraftedCooking ?? 0);
  const areaEntries = Object.entries(stats.enemiesKilledByArea ?? {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="stats">
      <h2 className="stats__title">Statistics</h2>
      <p className="stats__subtitle">Lifetime numbers. Persisted with your save.</p>

      <section className="stats__section">
        <h3 className="stats__section-title">Combat</h3>
        <ul className="stats__list">
          <li className="stats__row">
            <span className="stats__label">Total enemies killed</span>
            <span className="stats__value">{totalEnemiesKilled.toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Deaths</span>
            <span className="stats__value">{(stats.deaths ?? 0).toLocaleString()}</span>
          </li>
        </ul>
        {areaEntries.length > 0 && (
          <>
            <h4 className="stats__subheading">By area</h4>
            <ul className="stats__list stats__list--areas">
              {areaEntries.map(([area, count]) => (
                <li key={area} className="stats__row">
                  <span className="stats__label">{area}</span>
                  <span className="stats__value">{count.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="stats__section">
        <h3 className="stats__section-title">Gathering</h3>
        <ul className="stats__list">
          <li className="stats__row">
            <span className="stats__label">Items gathered (total)</span>
            <span className="stats__value">{totalItemsGathered.toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Fishing</span>
            <span className="stats__value">{(stats.itemsGatheredFishing ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Mining</span>
            <span className="stats__value">{(stats.itemsGatheredMining ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Gathering</span>
            <span className="stats__value">{(stats.itemsGatheredGathering ?? 0).toLocaleString()}</span>
          </li>
        </ul>
      </section>

      <section className="stats__section">
        <h3 className="stats__section-title">Economy & cultivation</h3>
        <ul className="stats__list">
          <li className="stats__row">
            <span className="stats__label">Total spirit stones earned</span>
            <span className="stats__value">{(stats.totalSpiritStonesEarned ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Total Qi generated</span>
            <span className="stats__value">{(stats.totalQiGenerated ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Total breakthroughs</span>
            <span className="stats__value">{(stats.totalBreakthroughs ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Highest realm reached</span>
            <span className="stats__value">{getRealmLabelFromStep(stats.highestRealmStep ?? 0)}</span>
          </li>
        </ul>
      </section>

      <section className="stats__section">
        <h3 className="stats__section-title">Crafting</h3>
        <ul className="stats__list">
          <li className="stats__row">
            <span className="stats__label">Items crafted (total)</span>
            <span className="stats__value">{totalCrafted.toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Alchemy</span>
            <span className="stats__value">{(stats.itemsCraftedAlchemy ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Forging</span>
            <span className="stats__value">{(stats.itemsCraftedForging ?? 0).toLocaleString()}</span>
          </li>
          <li className="stats__row">
            <span className="stats__label">Cooking</span>
            <span className="stats__value">{(stats.itemsCraftedCooking ?? 0).toLocaleString()}</span>
          </li>
        </ul>
      </section>

      <section className="stats__section">
        <h3 className="stats__section-title">Time</h3>
        <ul className="stats__list">
          <li className="stats__row">
            <span className="stats__label">Time played</span>
            <span className="stats__value">{formatTime(stats.timePlayedMs ?? 0)}</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
