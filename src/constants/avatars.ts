import { getStepIndex } from "./realmProgression";
import type { RealmId } from "./realmProgression";

/** Spirit stones required to create one avatar. */
export const AVATAR_CREATE_SPIRIT_STONES = 5000;

/** Item id of ore required for avatar creation (Voidstone – available around Nascent Soul). */
export const AVATAR_CREATE_ORE_ID = 511;

/** Item id of wood required for avatar creation (Void Willow). */
export const AVATAR_CREATE_WOOD_ID = 606;

/** Amount of ore required per avatar creation. */
export const AVATAR_CREATE_ORE_AMOUNT = 20;

/** Amount of wood required per avatar creation. */
export const AVATAR_CREATE_WOOD_AMOUNT = 20;

/** Minimum step index to unlock "Create Avatar" (Nascent Soul 1 = step 31). */
export const AVATAR_UNLOCK_STEP_INDEX = 31;

/** Spirit stones required for one "Train Avatar" action (increases avatar power by 1). */
export const AVATAR_TRAIN_SPIRIT_STONES = 100;

/** Qi pill amount consumed per "Train Avatar" action (any item with effect "qi", 1 consumed). */
export const AVATAR_TRAIN_QI_PILL_AMOUNT = 1;

export function canCreateAvatar(realm: RealmId, realmLevel: number): boolean {
  return getStepIndex(realm, realmLevel) >= AVATAR_UNLOCK_STEP_INDEX;
}
