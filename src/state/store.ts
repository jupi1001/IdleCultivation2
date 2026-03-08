import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import characterReducer from "./reducers/characterSlice";
import settingsReducer from "./reducers/settingsSlice";
import reincarnationReducer from "./reducers/reincarnationSlice";
import contentReducer from "./reducers/contentSlice";
import toastReducer from "./reducers/toastSlice";
import achievementReducer from "./reducers/achievementSlice";
import logReducer from "./reducers/logSlice";
import { toastLevelUpMiddleware } from "./middleware/toastLevelUpMiddleware";
import { toastNotificationPrefsMiddleware } from "./middleware/toastNotificationPrefsMiddleware";
import { achievementMiddleware } from "./middleware/achievementMiddleware";
import { logMiddleware } from "./middleware/logMiddleware";
import { runMigrations } from "./migrations";

/** redux-persist migrate callback: runs per-slice migrations then global migrations. */
function migratePersistedState(state: unknown, _version: number): Promise<unknown> {
  return Promise.resolve(runMigrations(state));
}

const persistConfig = {
  key: "idle-cultivation",
  version: 3,
  storage,
  whitelist: ["character", "settings", "reincarnation", "content", "achievements"],
  migrate: migratePersistedState as never,
};

const rootReducer = combineReducers({
  character: characterReducer,
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
