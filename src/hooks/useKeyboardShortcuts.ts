import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeContent } from "../state/reducers/contentSlice";
import { clearOfflineSummary } from "../state/reducers/characterSlice";
import { ContentArea } from "../enum/ContentArea";
import type { RootState } from "../state/store";
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

export function useKeyboardShortcuts() {
  const dispatch = useDispatch<AppDispatch>();
  const content = useSelector((state: RootState) => state.content.page);
  const offlineSummary = useSelector((state: RootState) => state.character.lastOfflineSummary);

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
        const secondaryPages: string[] = [
          ContentArea.SETTINGS,
          ContentArea.ACTIVITY_LOG,
          ContentArea.STATS,
          ContentArea.ACHIEVEMENTS,
          ContentArea.BLACK_MARKET,
        ];
        if (secondaryPages.includes(content)) {
          dispatch(changeContent(ContentArea.MAP));
        }
        return;
      }

      const key = e.key.toLowerCase();
      const page = KEY_TO_PAGE[key];
      if (page && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        dispatch(changeContent(page));
      }
    },
    [dispatch, content, offlineSummary]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
