/**
 * Vitality regeneration: 1 HP every 10 seconds, on any screen (combat, meditation, etc.).
 * Mount once in Main. Uses ref for latest state so the interval sees current values without re-subscribing.
 */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { regenerateVitality } from "../state/reducers/combatSlice";
import { getEffectiveCombatStats, selectCurrentHealth } from "../state/selectors/characterSelectors";

const REGEN_INTERVAL_MS = 10_000;
const REGEN_AMOUNT = 1;

export function useVitalityRegen() {
  const dispatch = useDispatch();
  const currentHealth = useSelector(selectCurrentHealth);
  const effectiveStats = useSelector(getEffectiveCombatStats);
  const maxHealth = effectiveStats.health;

  const ref = useRef({ currentHealth, maxHealth });
  ref.current = { currentHealth, maxHealth };

  useEffect(() => {
    const id = setInterval(() => {
      const { currentHealth: cur, maxHealth: max } = ref.current;
      if (cur < max) {
        dispatch(regenerateVitality({ amount: REGEN_AMOUNT, maxHealth: max }));
      }
    }, REGEN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [dispatch]);
}
