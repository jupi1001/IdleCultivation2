/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders trigger children", () => {
    const { container } = render(<Tooltip content="Tip text">Hover me</Tooltip>);
    expect(container.textContent).toContain("Hover me");
  });

  it("shows tooltip after delay on mouse enter", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tip text" delayMs={0}>
        Trigger
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    const trigger = screen.getByText("Trigger");
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Tip text");
    });
  });

  it("hides tooltip on mouse leave", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tip text" delayMs={0}>
        Trigger
      </Tooltip>
    );
    const trigger = screen.getByText("Trigger");
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
    await user.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
