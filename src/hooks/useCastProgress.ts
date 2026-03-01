import { useEffect, useState } from "react";

const TICK_MS = 80;

/**
 * Returns 0–100 progress for a running cast timer.
 * Re-renders at ~80ms while active so the progress bar animates smoothly.
 */
export function useCastProgress(castStartTime: number | null, castDuration: number): number {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (castStartTime == null) return;
    const id = setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [castStartTime]);

  if (castStartTime == null || castDuration <= 0) return 0;
  return Math.min(100, ((Date.now() - castStartTime) / castDuration) * 100);
}
