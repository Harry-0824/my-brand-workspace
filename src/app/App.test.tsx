import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { ROUTE_HEADING_CASES, SIDEBAR_NAVIGATION_CASES } from "./routes";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderApp(initialEntries: string[] = ["/"]) {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );
}

function assertSingleActiveLink(navigation: HTMLElement, expectedLabel: string) {
  const currentPageLinks = within(navigation).getAllByRole("link", {
    current: "page"
  });

  expect(currentPageLinks).toHaveLength(1);
  expect(currentPageLinks[0]).toHaveTextContent(expectedLabel);
}

describe("App static routing", () => {
  it.each([
    ["/", "儀表板 | My Brand Workspace"],
    ["/projects", "專案管理 | My Brand Workspace"],
    ["/unknown-route", "找不到頁面 | My Brand Workspace"]
  ])("sets document.title for %s", (path, expectedTitle) => {
    renderApp([path]);

    expect(document.title).toBe(expectedTitle);
  });

  it.each(ROUTE_HEADING_CASES)("renders $path", ({ path, heading }) => {
    renderApp([path]);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("renders NotFoundPage on unknown route", () => {
    renderApp(["/unknown-route"]);

    expect(screen.getByRole("heading", { name: "找不到頁面" })).toBeInTheDocument();
    expect(screen.getByText("回到儀表板")).toBeInTheDocument();
  });

  it("navigates through all sidebar routes and keeps a single active link", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    for (const { label, heading } of SIDEBAR_NAVIGATION_CASES) {
      const targetLink = within(navigation).getByRole("link", { name: label });

      await user.click(targetLink);
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
      expect(targetLink).toHaveAttribute("aria-current", "page");
      assertSingleActiveLink(navigation, label);
    }
  });
});
