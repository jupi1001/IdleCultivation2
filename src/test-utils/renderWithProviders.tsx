/**
 * Renders a React tree with Redux Provider for component/hook tests.
 * Optionally pass preloadedState (e.g. from createMockState) or a custom store.
 */
import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import type { RootState } from "../state/store";
import { rootReducer } from "../state/store";
import { createMockState } from "./index";

export interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /** Preloaded state (merged over createMockState() if store not provided). */
  preloadedState?: Partial<RootState>;
  /** Custom store; if provided, preloadedState is ignored. */
  store?: ReturnType<typeof configureStore>;
}

/**
 * Create a store suitable for tests. Uses rootReducer (no persist).
 * Pass preloadedState to seed state (e.g. from createMockState()).
 */
export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as never,
  });
}

/**
 * Renders ui wrapped in Redux Provider. Use for component tests that need the store.
 * If neither store nor preloadedState is given, uses createMockState() as initial state.
 * Returns the result of RTL render() plus the store.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const store =
    options.store ?? createTestStore(options.preloadedState ?? createMockState());
  const { wrapper, ...renderOptions } = options;
  const Wrapper = wrapper ?? (({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store }, children));
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
