/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useCastProgress } from "./useCastProgress";

function TestHarness({
  castStartTime,
  castDuration,
}: {
  castStartTime: number | null;
  castDuration: number;
}) {
  const progress = useCastProgress(castStartTime, castDuration);
  return <span data-testid="progress">{progress}</span>;
}

describe("useCastProgress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 when castStartTime is null", () => {
    render(<TestHarness castStartTime={null} castDuration={1000} />);
    expect(screen.getByTestId("progress")).toHaveTextContent("0");
  });

  it("returns 0 when castDuration is 0", () => {
    render(<TestHarness castStartTime={Date.now()} castDuration={0} />);
    expect(screen.getByTestId("progress")).toHaveTextContent("0");
  });

  it("returns progress based on elapsed time", async () => {
    const start = 1000;
    vi.useFakeTimers({ now: start });
    render(<TestHarness castStartTime={start} castDuration={1000} />);
    expect(screen.getByTestId("progress")).toHaveTextContent("0");
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    // Progress = (500/1000)*100 = 50
    expect(screen.getByTestId("progress")).toHaveTextContent("50");
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId("progress")).toHaveTextContent("100");
  });

  it("caps progress at 100", async () => {
    const start = 1000;
    vi.useFakeTimers({ now: start });
    render(<TestHarness castStartTime={start} castDuration={100} />);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByTestId("progress")).toHaveTextContent("100");
  });
});
