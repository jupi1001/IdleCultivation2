import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnemyLootPopover from "../../components/EnemyLootPopover/EnemyLootPopover";
import { getCharacterImage, UI_ASSETS } from "../../constants/ui";
import { ContentArea } from "../../enum/ContentArea";
import { useCombatEngine } from "../../hooks/useCombatEngine";
import { getConsumableEffect } from "../../interfaces/ItemI";
import "./CombatContainer.css";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import { selectRealm, selectRealmLevel } from "../../state/selectors/characterSelectors";
import { canEnterCombatArea } from "../../utils/contentRules";

interface CombatAreaProps {
  area: string | undefined;
}

const CombatContainer: React.FC<CombatAreaProps> = ({ area }) => {
  const dispatch = useDispatch();
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const engine = useCombatEngine(area);
  const hasEngine = engine !== null;

  // Redirect if no valid area, no enemies, or realm too low for this area
  useEffect(() => {
    if (!area) {
      dispatch(changeContent(routeFromArea(ContentArea.MAP)));
      return;
    }
    if (!canEnterCombatArea(realm, realmLevel, area)) {
      dispatch(changeContent(routeFromArea(ContentArea.MAP)));
      return;
    }
    if (!hasEngine) {
      dispatch(changeContent(routeFromArea(ContentArea.MAP)));
    }
  }, [area, realm, realmLevel, dispatch, hasEngine]);

  // Keyboard shortcut: 1–9 to use vitality food
  useEffect(() => {
    if (!engine) return;
    const { vitalityFood, useVitalityFood } = engine;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.getAttribute("contenteditable") === "true") return;
      if (e.key >= "1" && e.key <= "9") {
        const idx = e.key.charCodeAt(0) - "1".charCodeAt(0);
        const item = vitalityFood[idx];
        if (item) {
          e.preventDefault();
          useVitalityFood(item);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [engine]);

  if (engine === null) return null;

  const {
    characterState,
    currentEnemy,
    enemyMaxHealth,
    characterProgress,
    enemyProgress,
    itemBag,
    lootSpiritStones,
    lastDamageToEnemy,
    lastDamageToCharacter,
    vitalityFood,
    enemyLootEntries,
    fightingInterval,
    effectiveStats,
    ownedTechniqueIds,
    autoLoot,
    gender,
    handleEscapeButton,
    handleLootButton,
    useVitalityFood,
    getSpiritStonesFromEnemy,
  } = engine;

  if (!currentEnemy) return null;

  return (
    <div className="combatContainer__main">
      <h3>{area}</h3>
      <div className="combatContainer__bars">
        <div className="combatContainer__bar-group">
          <span className="combatContainer__bar-label">Your attack ({fightingInterval / 1000}s)</span>
          <div
            className="combatContainer__bar-track"
            role="progressbar"
            aria-valuenow={characterProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="combatContainer__bar-fill combatContainer__bar-fill--character"
              style={{ width: `${characterProgress}%` }}
            />
          </div>
        </div>
        <div className="combatContainer__bar-group">
          <span className="combatContainer__bar-label">Enemy attack (3s)</span>
          <div
            className="combatContainer__bar-track"
            role="progressbar"
            aria-valuenow={enemyProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="combatContainer__bar-fill combatContainer__bar-fill--enemy"
              style={{ width: `${enemyProgress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="combatContainer__main-combat">
        <div className="combatContainer__main-character">
          <div className="combatContainer__portrait-wrap">
            <img className="combatContainer__main-img" src={getCharacterImage(gender ?? "Male", "default")} alt="You" />
            {lastDamageToCharacter != null && (
              <span className="combatContainer__damage combatContainer__damage--to-character">-{lastDamageToCharacter}</span>
            )}
          </div>
          <div className="combatContainer__hp-bar-wrap">
            <span className="combatContainer__hp-label">Vitality {characterState.health}/{effectiveStats.health}</span>
            <div className="combatContainer__hp-track" role="progressbar" aria-valuenow={characterState.health} aria-valuemin={0} aria-valuemax={effectiveStats.health}>
              <div className="combatContainer__hp-fill combatContainer__hp-fill--character" style={{ width: `${effectiveStats.health > 0 ? (characterState.health / effectiveStats.health) * 100 : 0}%` }} />
            </div>
          </div>
          <table className="combatContainer__stats">
            <thead>
              <tr>
                <th>Attack</th>
                <th>Defense</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{characterState.attack}</td>
                <td>{characterState.defense}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="combatContainer__main-enemy">
          <h4>{currentEnemy.name}</h4>
          <div className="combatContainer__portrait-wrap">
            <img className="combatContainer__main-img" src={currentEnemy.picture} alt={currentEnemy.name} />
            {lastDamageToEnemy != null && (
              <span className="combatContainer__damage combatContainer__damage--to-enemy">-{lastDamageToEnemy}</span>
            )}
          </div>
          <div className="combatContainer__hp-bar-wrap">
            <span className="combatContainer__hp-label">Vitality {currentEnemy.health}/{enemyMaxHealth}</span>
            <div className="combatContainer__hp-track" role="progressbar" aria-valuenow={currentEnemy.health} aria-valuemin={0} aria-valuemax={enemyMaxHealth}>
              <div className="combatContainer__hp-fill combatContainer__hp-fill--enemy" style={{ width: `${enemyMaxHealth > 0 ? (currentEnemy.health / enemyMaxHealth) * 100 : 0}%` }} />
            </div>
          </div>
          <table className="combatContainer__stats">
            <thead>
              <tr>
                <th>Attack</th>
                <th>Defense</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentEnemy.attack}</td>
                <td>{currentEnemy.defense}</td>
              </tr>
            </tbody>
          </table>
          <EnemyLootPopover
            spiritStoneAmount={getSpiritStonesFromEnemy(currentEnemy)}
            lootEntries={enemyLootEntries}
            ownedTechniqueIds={ownedTechniqueIds}
          />
        </div>
      </div>
      <section className="combatContainer__loot">
        <h4 className="combatContainer__loot-title">
          Loot bag
          {autoLoot && <span className="combatContainer__auto-loot-badge">Auto-Loot: On</span>}
        </h4>
        {itemBag.length === 0 && lootSpiritStones === 0 ? (
          <p className="combatContainer__loot-empty">No loot yet</p>
        ) : (
          <div className="combatContainer__loot-grid">
            {lootSpiritStones > 0 && (
              <div className="combatContainer__loot-item combatContainer__loot-item--spirit-stones" title="Spirit stones from defeated enemies">
                <div className="combatContainer__loot-icon-wrap">
                  <img src={`${UI_ASSETS}/spirit-stone.webp`} alt="" className="combatContainer__loot-icon" />
                </div>
                <span className="combatContainer__loot-name">Spirit Stones</span>
                <span className="combatContainer__loot-amount">×{lootSpiritStones}</span>
              </div>
            )}
            {itemBag.map((item, index) => (
              <div key={`loot-${index}-${item.id}`} className="combatContainer__loot-item" title={item.description}>
                <div className="combatContainer__loot-icon-wrap">
                  {item.picture ? (
                    <img src={item.picture} alt="" className="combatContainer__loot-icon" />
                  ) : (
                    <div className="combatContainer__loot-icon-placeholder">?</div>
                  )}
                </div>
                <span className="combatContainer__loot-name">{item.name}</span>
                <span className="combatContainer__loot-amount">×{item.quantity ?? 1}</span>
              </div>
            ))}
          </div>
        )}
        <div className="combatContainer__loot-actions">
          <button type="button" className="combatContainer__btn combatContainer__btn--loot" onClick={() => handleLootButton()} disabled={itemBag.length === 0 && lootSpiritStones === 0}>
            Loot
          </button>
          <button type="button" className="combatContainer__btn combatContainer__btn--escape" onClick={() => handleEscapeButton(false)}>
            Escape
          </button>
        </div>
      </section>
      <div className="combatContainer__main-footer">
        {vitalityFood.length > 0 && (
          <div className="combatContainer__consumables">
            <span className="combatContainer__consumables-label">Food (heal):</span>
            {vitalityFood.map((item) => {
              const effect = getConsumableEffect(item);
              const healAmount = effect?.type === "healVitality" ? effect.amount : 0;
              return (
              <button
                key={item.id}
                type="button"
                className="combatContainer__use-food"
                onClick={() => useVitalityFood(item)}
                title={`${item.name}: restores ${healAmount} vitality`}
              >
                {item.name} (+{healAmount})
              </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatContainer;
