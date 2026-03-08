import React, { useState, useRef, useCallback } from "react";
import "./Tooltip.css";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  /** Tooltip content (plain text or React node). */
  content: React.ReactNode;
  /** Optional placement relative to trigger. */
  placement?: TooltipPlacement;
  /** Optional delay before showing (ms). */
  delayMs?: number;
  /** Optional max width for the tooltip panel. */
  maxWidth?: number | string;
  /** Trigger element(s). */
  children: React.ReactNode;
  /** Optional class for the wrapper. */
  className?: string;
}

const DEFAULT_DELAY_MS = 400;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  delayMs = DEFAULT_DELAY_MS,
  maxWidth,
  children,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  }, [delayMs]);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  const style: React.CSSProperties = maxWidth != null ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth } : {};

  return (
    <span
      className={`tooltip-wrap ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <span
          className={`tooltip-bubble tooltip-bubble--${placement}`}
          style={style}
          role="tooltip"
        >
          <span className="tooltip-bubble__content">{content}</span>
        </span>
      )}
    </span>
  );
};
