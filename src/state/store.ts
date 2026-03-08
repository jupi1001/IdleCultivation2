import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { achievementMiddleware } from "./middleware/achievementMiddleware";
import { logMiddleware } from "./middleware/logMiddleware";
import { toastLevelUpMiddleware } from "./middleware/toastLevelUpMiddleware";
import { toastNotificationPrefsMiddleware } from "./middleware/toastNotificationPrefsMiddleware";
import { runMigrations } from "./migrations";
import achievementReducer from "./reducers/achievementSlice";
import characterReducer from "./reducers/characterSlice";
import combatReducer from "./reducers/combatSlice";
import contentReducer from "./reducers/contentSlice";
import logReducer from "./reducers/logSlice";
import reincarnationReducer from "./reducers/reincarnationSlice";
import settingsReducer from "./reducers/settingsSlice";
import toastReducer from "./reducers/toastSlice";

/** redux-persist migrate callback: runs per-slice migrations then global migrations. */
function migratePersistedState(state: unknown, _version: number): Promise<unknown> {
  return Promise.resolve(runMigrations(state));
}

const persistConfig = {
  key: "idle-cultivation",
  version: 3,
  storage,
  whitelist: ["character", "combat", "settings", "reincarnation", "content", "achievements"],
  migrate: migratePersistedState as never,
};

const rootReducer = combineReducers({
  character: characterReducer,
  combat: combatReducer,
  settings: settingsReducer,
  reincarnation: reincarnationReducer,
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
