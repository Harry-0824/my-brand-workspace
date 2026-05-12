import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
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

const routeHeadingCases = [
  { path: "/", heading: "儀表板" },
  { path: "/projects", heading: "專案管理" },
  { path: "/tasks", heading: "任務管理" },
  { path: "/clients", heading: "客戶管理" },
  { path: "/files", heading: "檔案" },
  { path: "/help", heading: "說明" },
  { path: "/invoices", heading: "收款管理" },
  { path: "/calendar", heading: "行事曆" },
  { path: "/reports", heading: "報表" },
  { path: "/settings", heading: "設定" }
] as const;

const sidebarNavigationCases = [
  { label: "儀表板", heading: "儀表板" },
  { label: "專案", heading: "專案管理" },
  { label: "任務", heading: "任務管理" },
  { label: "客戶", heading: "客戶管理" },
  { label: "檔案", heading: "檔案" },
  { label: "說明", heading: "說明" },
  { label: "收款", heading: "收款管理" },
  { label: "行事曆", heading: "行事曆" },
  { label: "報表", heading: "報表" },
  { label: "設定", heading: "設定" }
] as const;

describe("App static routing", () => {
  it.each(routeHeadingCases)("renders $path", ({ path, heading }) => {
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

    for (const { label, heading } of sidebarNavigationCases) {
      const targetLink = within(navigation).getByRole("link", { name: label });

      await user.click(targetLink);
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
      expect(targetLink).toHaveAttribute("aria-current", "page");
      assertSingleActiveLink(navigation, label);
    }
  });
});
