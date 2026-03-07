import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import characterReducer from "./reducers/characterSlice";
import contentReducer from "./reducers/contentSlice";
import toastReducer from "./reducers/toastSlice";
import achievementReducer from "./reducers/achievementSlice";
import { toastLevelUpMiddleware } from "./middleware/toastLevelUpMiddleware";
import { achievementMiddleware } from "./middleware/achievementMiddleware";

const persistConfig = {
  key: "idle-cultivation",
  version: 1,
  storage,
  whitelist: ["character", "content", "achievements"],
};

const rootReducer = combineReducers({
  character: characterReducer,
  content: contentReducer,
  toast: toastReducer,
  achievements: achievementReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(toastLevelUpMiddleware, achievementMiddleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
