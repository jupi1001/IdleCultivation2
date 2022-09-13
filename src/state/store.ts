import { configureStore } from "@reduxjs/toolkit";
import characterReducer from "./reducers/characterSlice";
import contentReducer from "./reducers/contentSlice";

export const store = configureStore({
  reducer: {
    character: characterReducer,
    content: contentReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
