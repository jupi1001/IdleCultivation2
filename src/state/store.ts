import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { achievementMiddleware } from "./middleware/achievementMiddleware";
import { logMiddleware } from "./middleware/logMiddleware";
import { toastLevelUpMiddleware } from "./middleware/toastLevelUpMiddleware";
import { toastNotificationPrefsMiddleware } from "./middleware/toastNotificationPrefsMiddleware";
import { runMigrations } from "./migrations";
import achievementReducer from "./reducers/achievementSlice";
import avatarsReducer from "./reducers/avatarsSlice";
import characterReducer from "./reducers/characterCoreSlice";
import combatReducer from "./reducers/combatSlice";
import contentReducer from "./reducers/contentSlice";
import logReducer from "./reducers/logSlice";
import equipmentReducer from "./reducers/equipmentSlice";
import inventoryReducer from "./reducers/inventorySlice";
import reincarnationReducer from "./reducers/reincarnationSlice";
import sectReducer from "./reducers/sectSlice";
import settingsReducer from "./reducers/settingsSlice";
import skillsReducer from "./reducers/skillsSlice";
import statsReducer from "./reducers/statsSlice";
import toastReducer from "./reducers/toastSlice";

/** redux-persist migrate callback: runs per-slice migrations then global migrations. */
function migratePersistedState(state: unknown, _version: number): Promise<unknown> {
  return Promise.resolve(runMigrations(state));
}

const persistConfig = {
  key: "idle-cultivation",
  version: 7,
  storage,
  whitelist: ["character", "combat", "stats", "sect", "inventory", "equipment", "settings", "reincarnation", "skills", "avatars", "content", "achievements"],
  migrate: migratePersistedState as never,
};

const rootReducer = combineReducers({
  character: characterReducer,
  avatars: avatarsReducer,
  combat: combatReducer,
  settings: settingsReducer,
  stats: statsReducer,
  reincarnation: reincarnationReducer,
  sect: sectReducer,
  inventory: inventoryReducer,
  equipment: equipmentReducer,
  skills: skillsReducer,
  content: contentReducer,
  toast: toastReducer,
  achievements: achievementReducer,
  log: logReducer,
});

/** Exported for test store creation (e.g. renderWithProviders with preloadedState). */
export { rootReducer };

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

export const useAppDispatch = () => useDispatch<AppDispatch>();
