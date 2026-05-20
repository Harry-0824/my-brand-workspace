import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackToTopButton } from "./BackToTopButton";
import { theme } from "../../styles/theme";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    configurable: true,
    writable: true
  });
}

function renderBackToTopButton() {
  render(
    <ThemeProvider theme={theme}>
      <BackToTopButton />
    </ThemeProvider>
  );
}

beforeEach(() => {
  setScrollY(0);
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("BackToTopButton", () => {
  it("is hidden near top and appears after scrolling beyond threshold", () => {
    renderBackToTopButton();

    expect(screen.queryByTestId("back-to-top-button")).toBeNull();

    setScrollY(400);
    fireEvent.scroll(window);

    expect(screen.getByTestId("back-to-top-button")).toBeInTheDocument();
  });

  it("scrolls smoothly to top when clicked", () => {
    renderBackToTopButton();

    setScrollY(500);
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole("button", { name: "回到頁面頂部" }));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth"
    });
  });
});