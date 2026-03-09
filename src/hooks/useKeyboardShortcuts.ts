import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentArea } from "../enum/ContentArea";
import { clearOfflineSummary } from "../state/reducers/characterCoreSlice";
import { changeContent, selectRoute, routeFromArea } from "../state/reducers/contentSlice";
import { selectLastOfflineSummary } from "../state/selectors/characterSelectors";
import type { AppDispatch } from "../state/store";

const KEY_TO_PAGE: Record<string, ContentArea> = {
  m: ContentArea.MAP,
  s: ContentArea.SECT,
  i: ContentArea.INVENTORY,
  t: ContentArea.TRAINING,
  f: ContentArea.FISHING,
  g: ContentArea.GATHERING,
  n: ContentArea.MINING,
  p: ContentArea.SHOP,
  c: ContentArea.CULTIVATION_TREE,
  a: ContentArea.ACHIEVEMENTS,
  l: ContentArea.ACTIVITY_LOG,
  e: ContentArea.STATS,
};

const SECONDARY_ROUTE_TYPES = new Set(["settings", "activity_log", "stats", "achievements", "black_market"]);

export function useKeyboardShortcuts() {
  const dispatch = useDispatch<AppDispatch>();
  const route = useSelector(selectRoute);
  const offlineSummary = useSelector(selectLastOfflineSummary);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable;
      if (isInput) return;

      if (e.key === "Escape") {
        if (offlineSummary != null) {
          dispatch(clearOfflineSummary());
          return;
        }
        if (route && SECONDARY_ROUTE_TYPES.has(route.type)) {
          dispatch(changeContent(routeFromArea(ContentArea.MAP)));
        }
        return;
      }

      const key = e.key.toLowerCase();
      const page = KEY_TO_PAGE[key];
      if (page && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        dispatch(changeContent(routeFromArea(page)));
      }
    },
    [dispatch, route, offlineSummary]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
