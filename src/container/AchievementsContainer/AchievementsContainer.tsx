import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  ALL_ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  TOTAL_ACHIEVEMENT_COUNT,
  type AchievementCategory,
  type AchievementDef,
} from "../../constants/achievements";
import { selectUnlockedAchievements } from "../../state/selectors/appSelectors";
import "./AchievementsContainer.css";

const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  cultivation: "🧘",
  skills: "⚒",
  economy: "💰",
  collection: "📦",
  sect: "🏯",
  prestige: "♻",
  combat: "⚔",
};

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return "";
  }
}

export const AchievementsContainer: React.FC = () => {
  const unlocked = useSelector(selectUnlockedAchievements);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | "all">("all");

  const unlockedCount = useMemo(() => Object.keys(unlocked).length, [unlocked]);

  const filtered = useMemo(() => {
    let list: AchievementDef[];
    if (activeCategory === "all") {
      list = ALL_ACHIEVEMENTS;
    } else {
      list = ALL_ACHIEVEMENTS.filter((a) => a.category === activeCategory);
    }
    return list.slice().sort((a, b) => {
      const aUnlocked = unlocked[a.id] ? 1 : 0;
      const bUnlocked = unlocked[b.id] ? 1 : 0;
      if (aUnlocked !== bUnlocked) return bUnlocked - aUnlocked;
      return 0;
    });
  }, [activeCategory, unlocked]);

  const categoryCount = useMemo(() => {
    const map: Record<string, { total: number; done: number }> = {};
    for (const cat of ACHIEVEMENT_CATEGORIES) {
      map[cat.id] = { total: 0, done: 0 };
    }
    for (const a of ALL_ACHIEVEMENTS) {
      if (map[a.category]) {
        map[a.category].total++;
        if (unlocked[a.id]) map[a.category].done++;
      }
    }
    return map;
  }, [unlocked]);

  const pct = TOTAL_ACHIEVEMENT_COUNT > 0 ? (unlockedCount / TOTAL_ACHIEVEMENT_COUNT) * 100 : 0;

  return (
    <div className="achievements">
      <div className="achievements__header">
        <h2 className="achievements__title">Achievements</h2>
        <span className="achievements__summary">
          {unlockedCount} / {TOTAL_ACHIEVEMENT_COUNT} unlocked
        </span>
      </div>

      <div className="achievements__progress">
        <div className="achievements__progress-bar-wrap">
          <div className="achievements__progress-bar" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="achievements__tabs">
        <button
          className={`achievements__tab ${activeCategory === "all" ? "achievements__tab--active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All ({unlockedCount}/{TOTAL_ACHIEVEMENT_COUNT})
        </button>
        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const c = categoryCount[cat.id];
          return (
            <button
              key={cat.id}
              className={`achievements__tab ${activeCategory === cat.id ? "achievements__tab--active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label} ({c?.done ?? 0}/{c?.total ?? 0})
            </button>
          );
        })}
      </div>

      <div className="achievements__grid">
        {filtered.map((ach) => {
          const isUnlocked = !!unlocked[ach.id];
          return (
            <div
              key={ach.id}
              className={`achievements__card ${isUnlocked ? "achievements__card--unlocked" : "achievements__card--locked"}`}
            >
              <div className="achievements__card-icon">
                {isUnlocked ? "🏆" : CATEGORY_ICONS[ach.category] ?? "❓"}
              </div>
              <div className="achievements__card-body">
                <span className="achievements__card-name">
                  {ach.hidden && !isUnlocked ? "???" : ach.name}
                </span>
                <p className="achievements__card-desc">
                  {ach.hidden && !isUnlocked ? "Hidden achievement" : ach.description}
                </p>
                {ach.reward > 0 && (
                  <span className="achievements__card-reward">
                    +{ach.reward} Spirit Stones
                  </span>
                )}
                {isUnlocked && unlocked[ach.id] > 0 && (
                  <span className="achievements__card-date">
                    {formatDate(unlocked[ach.id])}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
