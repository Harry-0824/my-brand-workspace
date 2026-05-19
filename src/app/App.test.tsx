import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import {
  PRIMARY_SIDEBAR_ROUTES,
  ROUTE_HEADING_CASES,
  SIDEBAR_NAVIGATION_CASES,
} from "./routes";
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
    </MemoryRouter>,
  );
}

function assertSingleActiveLink(
  navigation: HTMLElement,
  expectedLabel: string,
) {
  const currentPageLinks = within(navigation).getAllByRole("link", {
    current: "page",
  });

  expect(currentPageLinks).toHaveLength(1);
  expect(currentPageLinks[0]).toHaveTextContent(expectedLabel);
}

describe("App static routing", () => {
  it("renders next-step CTA sections on core pages", () => {
    renderApp(["/projects"]);
    expect(
      screen.getByRole("heading", { name: "下一步建議" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "前往任務頁面，安排下一步執行項目" }),
    ).toBeInTheDocument();

    cleanup();
    renderApp(["/clients"]);
    expect(
      screen.getByRole("heading", { name: "下一步建議" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "前往收款頁面，檢查待收款與發票" }),
    ).toBeInTheDocument();
  });

  it("navigates from projects CTA link to /tasks", async () => {
    const user = userEvent.setup();

    renderApp(["/projects"]);

    await user.click(
      screen.getByRole("link", { name: "前往任務頁面，安排下一步執行項目" }),
    );
    expect(
      screen.getByRole("heading", { name: "任務管理" }),
    ).toBeInTheDocument();
  });

  it("renders dashboard MVP overview and quick action links on /", () => {
    renderApp(["/"]);

    expect(
      screen.getByRole("heading", { name: "工作區快照" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "快速捷徑" }),
    ).toBeInTheDocument();

    const quickActionPaths = [
      "/projects",
      "/tasks",
      "/clients",
      "/invoices",
      "/calendar",
      "/files",
    ];

    for (const path of quickActionPaths) {
      expect(
        screen.getByRole("link", { name: `quick-action-${path}` }),
      ).toBeInTheDocument();
    }
  });

  it("navigates to /projects from dashboard quick actions", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);

    await user.click(
      screen.getByRole("link", { name: "quick-action-/projects" }),
    );
    expect(
      screen.getByRole("heading", { name: "專案管理" }),
    ).toBeInTheDocument();
  });

  it("keeps key dashboard/page CTA links on expected routes", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);
    await user.click(
      screen.getByRole("link", { name: "quick-action-/invoices" }),
    );
    expect(
      screen.getByRole("heading", { name: "收款管理" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", { name: "前往報表頁面，快速檢查收款快照" }),
    );
    expect(screen.getByRole("heading", { name: "報表" })).toBeInTheDocument();
  });

  it.each(
    ROUTE_HEADING_CASES.map(({ path, heading }) => [
      path,
      `${heading} | My Brand Workspace`,
    ]),
  )("sets document.title for %s", (path, expectedTitle) => {
    renderApp([path]);

    expect(document.title).toBe(expectedTitle);
  });

  it("sets document.title fallback for unknown route", () => {
    renderApp(["/unknown-route"]);

    expect(document.title).toBe("找不到頁面 | My Brand Workspace");
  });

  it.each(ROUTE_HEADING_CASES)("renders $path", ({ path, heading }) => {
    renderApp([path]);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("renders NotFoundPage on unknown route", () => {
    renderApp(["/unknown-route"]);

    expect(
      screen.getByRole("heading", { name: "找不到頁面" }),
    ).toBeInTheDocument();
    expect(screen.getByText("回到儀表板")).toBeInTheDocument();
  });

  it("navigates through all sidebar routes and keeps a single active link", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    for (const { label, heading } of SIDEBAR_NAVIGATION_CASES) {
      const targetLink = within(navigation).getByRole("link", { name: label });

      await user.click(targetLink);
      expect(
        screen.getByRole("heading", { name: heading }),
      ).toBeInTheDocument();
      expect(targetLink).toHaveAttribute("aria-current", "page");
      assertSingleActiveLink(navigation, label);
    }
  });
});

describe("Simplified navigation structure", () => {
  it("sidebar primary navigation shows exactly 5 core workflow entries", () => {
    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    for (const route of PRIMARY_SIDEBAR_ROUTES) {
      expect(
        within(navigation).getByRole("link", { name: route.label as string }),
      ).toBeInTheDocument();
    }

    expect(within(navigation).queryByRole("link", { name: "檔案" })).toBeNull();
    expect(
      within(navigation).queryByRole("link", { name: "行事曆" }),
    ).toBeNull();
    expect(within(navigation).queryByRole("link", { name: "設定" })).toBeNull();
  });

  it("sidebar shows 報表 and 說明 as secondary entries", () => {
    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    expect(
      within(navigation).getByRole("link", { name: "報表" }),
    ).toBeInTheDocument();
    expect(
      within(navigation).getByRole("link", { name: "說明" }),
    ).toBeInTheDocument();
  });

  it("settings gear icon is in the navbar and navigates to /settings", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);

    expect(screen.queryByRole("button", { name: "新增" })).toBeNull();
    expect(screen.getByText("頁面內新增")).toHaveAttribute(
      "title",
      "新增請使用各頁面的新增表單",
    );
    expect(screen.getByRole("img", { name: "通知功能尚未啟用" })).toHaveAttribute(
      "title",
      "通知功能尚未啟用",
    );

    const settingsLink = screen.getByRole("link", { name: "設定" });

    expect(settingsLink).toBeInTheDocument();

    await user.click(settingsLink);
    expect(screen.getByRole("heading", { name: "設定" })).toBeInTheDocument();
  });

  it.each([
    ["/files", "檔案"],
    ["/calendar", "行事曆"],
    ["/reports", "報表"],
    ["/settings", "設定"],
    ["/help", "說明"],
  ])("direct route %s is still accessible", (path, heading) => {
    renderApp([path]);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("clarifies that help quick-start items are static", () => {
    renderApp(["/help"]);

    expect(
      screen.getByText("此區塊為靜態檢查清單，不會自動跳轉；請從側邊欄開啟對應頁面。"),
    ).toBeInTheDocument();
  });
});
