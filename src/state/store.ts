import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import characterReducer from "./reducers/characterSlice";
import contentReducer from "./reducers/contentSlice";
import toastReducer from "./reducers/toastSlice";
import achievementReducer from "./reducers/achievementSlice";
import logReducer from "./reducers/logSlice";
import { toastLevelUpMiddleware } from "./middleware/toastLevelUpMiddleware";
import { toastNotificationPrefsMiddleware } from "./middleware/toastNotificationPrefsMiddleware";
import { achievementMiddleware } from "./middleware/achievementMiddleware";
import { logMiddleware } from "./middleware/logMiddleware";

const DEFAULT_NOTIFICATION_PREFS = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

const DEFAULT_SOUND_VOLUME = { music: 100, sfx: 100 };

/** Ensure old saves get defaults for new character fields. */
function migratePersistedState(state: unknown, _version: number): Promise<unknown> {
  if (!state || typeof state !== "object") return Promise.resolve(state);
  const s = state as Record<string, unknown>;
  const char = s.character;
  if (char && typeof char === "object" && !Array.isArray(char)) {
    const c = char as Record<string, unknown>;
    if (!c.notificationPrefs) c.notificationPrefs = { ...DEFAULT_NOTIFICATION_PREFS };
    if (!c.soundVolume) c.soundVolume = { ...DEFAULT_SOUND_VOLUME };
    if (c.autoEatUnlocked == null) c.autoEatUnlocked = false;
    if (c.autoEat == null) c.autoEat = false;
    if (c.autoEatHpPercent == null) c.autoEatHpPercent = 30;
  }
  return Promise.resolve(state);
}

const persistConfig = {
  key: "idle-cultivation",
  version: 1,
  storage,
  whitelist: ["character", "content", "achievements"],
  migrate: migratePersistedState as never,
};

const rootReducer = combineReducers({
  character: characterReducer,
  content: contentReducer,
  toast: toastReducer,
  achievements: achievementReducer,
  log: logReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(toastNotificationPrefsMiddleware, toastLevelUpMiddleware, achievementMiddleware, logMiddleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
