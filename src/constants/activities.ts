/**
 * Activity system: which activities exist and how they behave.
 *
 * BACKGROUND ACTIVITIES (fishing, meditation, labour, mining, gathering,
 * martial training, alchemy): Progress runs in the background no matter which
 * view the user is on. The user can open Shop, Cultivation Tree, Inventory, etc.
 * while the activity keeps progressing. Only the activity's own UI is tied to
 * its content area; the tick/loop logic runs centrally (see useActivityTicks).
 *
 * LOCKING ACTIVITIES (expedition only): When the character is on an expedition,
 * navigation is restricted so they stay on Immortals Island until the expedition
 * ends or is resolved. Other activities do NOT lock navigation.
 */

export type ActivityType =
  | "none"
  | "meditate"
  | "fish"
  | "mine"
  | "gather"
  | "labour"
  | "combat"
  | "expedition";

/** Only these activities lock the user to one view. All others allow free navigation. */
export const LOCKING_ACTIVITIES: readonly ActivityType[] = ["expedition"];

export function isLockingActivity(activity: string): boolean {
  return (LOCKING_ACTIVITIES as readonly string[]).includes(activity);
}

/** Human-readable labels for currentActivity (UI only). */
export const ACTIVITY_LABELS: Record<string, string> = {
  none: "Idle",
  meditate: "Meditating",
  fish: "Fishing",
  gather: "Gathering",
  mine: "Mining",
  labour: "Labour",
  combat: "Combat",
  expedition: "Expedition",
};
