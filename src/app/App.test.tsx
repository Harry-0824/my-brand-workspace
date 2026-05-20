import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import {
  PRIMARY_SIDEBAR_ROUTES,
  ROUTE_HEADING_CASES,
  SIDEBAR_NAVIGATION_CASES,
} from "./routes";
import { theme } from "../styles/theme";

const authMocks = vi.hoisted(() => ({
  getAuthSessionUser: vi.fn(),
  subscribeToAuthSessionUserChanges: vi.fn(),
}));

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual("../lib/auth");
  return {
    ...actual,
    getAuthSessionUser: (...args: unknown[]) => authMocks.getAuthSessionUser(...args),
    subscribeToAuthSessionUserChanges: (...args: unknown[]) =>
      authMocks.subscribeToAuthSessionUserChanges(...args),
  };
});

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  authMocks.getAuthSessionUser.mockReset();
  authMocks.subscribeToAuthSessionUserChanges.mockReset();
  authMocks.getAuthSessionUser.mockResolvedValue({
    id: "user-1",
    email: "demo@example.com",
  });
  authMocks.subscribeToAuthSessionUserChanges.mockResolvedValue(() => {});
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

async function renderAuthenticatedApp(initialEntries: string[] = ["/"]) {
  renderApp(initialEntries);
  await screen.findByTestId("private-workspace-shell");
}

async function renderUnauthenticatedApp(initialEntries: string[] = ["/"]) {
  authMocks.getAuthSessionUser.mockResolvedValueOnce(null);
  renderApp(initialEntries);
  await screen.findByTestId("private-login-gate");
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

describe("Private workspace auth gate", () => {
  it("guides unauthenticated users to login instead of rendering workspace pages", async () => {
    await renderUnauthenticatedApp(["/reports"]);

    expect(
      screen.getByRole("heading", { name: "私人工作台登入" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-email-input")).toBeInTheDocument();
    expect(screen.getByTestId("auth-password-input")).toBeInTheDocument();
    expect(screen.getByTestId("auth-submit-button")).toHaveTextContent("登入");
    expect(screen.queryByTestId("auth-mode-signup")).toBeNull();
    expect(screen.queryByRole("navigation", { name: "主要導航" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "報表" })).toBeNull();
  });

  it("keeps authenticated refresh access to private workspace routes", async () => {
    await renderAuthenticatedApp(["/projects"]);

    expect(screen.getByTestId("private-workspace-shell")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "專案管理" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-user-badge")).toHaveTextContent(
      "demo@example.com",
    );
  });

  it("enters the workspace when a login session event arrives", async () => {
    const sessionChangeRef: {
      current?: (user: { id: string; email: string }) => void;
    } = {};
    authMocks.getAuthSessionUser.mockResolvedValueOnce(null);
    authMocks.subscribeToAuthSessionUserChanges.mockImplementationOnce((callback) => {
      sessionChangeRef.current = callback;
      return Promise.resolve(() => {});
    });

    renderApp(["/tasks"]);
    await screen.findByTestId("private-login-gate");

    sessionChangeRef.current?.({ id: "user-2", email: "member@example.com" });

    await waitFor(() => {
      expect(screen.getByTestId("private-workspace-shell")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: "任務管理" }),
    ).toBeInTheDocument();
  });
});

describe("App static routing", () => {
  it("renders next-step CTA sections on core pages", async () => {
    await renderAuthenticatedApp(["/projects"]);
    expect(
      screen.getByRole("heading", { name: "下一步建議" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "前往任務頁面，安排下一步執行項目" }),
    ).toBeInTheDocument();

    cleanup();
    await renderAuthenticatedApp(["/clients"]);
    expect(
      screen.getByRole("heading", { name: "下一步建議" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "前往收款頁面，檢查待收款與發票" }),
    ).toBeInTheDocument();
  });

  it("navigates from projects CTA link to /tasks", async () => {
    const user = userEvent.setup();

    await renderAuthenticatedApp(["/projects"]);

    await user.click(
      screen.getByRole("link", { name: "前往任務頁面，安排下一步執行項目" }),
    );
    expect(
      screen.getByRole("heading", { name: "任務管理" }),
    ).toBeInTheDocument();
  });

  it("renders dashboard MVP overview and quick action links on /", async () => {
    await renderAuthenticatedApp(["/"]);

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

    await renderAuthenticatedApp(["/"]);

    await user.click(
      screen.getByRole("link", { name: "quick-action-/projects" }),
    );
    expect(
      screen.getByRole("heading", { name: "專案管理" }),
    ).toBeInTheDocument();
  });

  it("keeps key dashboard/page CTA links on expected routes", async () => {
    const user = userEvent.setup();

    await renderAuthenticatedApp(["/"]);
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
  )("sets document.title for %s", async (path, expectedTitle) => {
    await renderAuthenticatedApp([path]);

    expect(document.title).toBe(expectedTitle);
  });

  it("sets document.title fallback for unknown route", async () => {
    await renderAuthenticatedApp(["/unknown-route"]);

    expect(document.title).toBe("找不到頁面 | My Brand Workspace");
  });

  it.each(ROUTE_HEADING_CASES)("renders $path", async ({ path, heading }) => {
    await renderAuthenticatedApp([path]);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("renders NotFoundPage on unknown route", async () => {
    await renderAuthenticatedApp(["/unknown-route"]);

    expect(
      screen.getByRole("heading", { name: "找不到頁面" }),
    ).toBeInTheDocument();
    expect(screen.getByText("回到儀表板")).toBeInTheDocument();
  });

  it("navigates through all sidebar routes and keeps a single active link", async () => {
    const user = userEvent.setup();

    await renderAuthenticatedApp(["/"]);

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
  it("sidebar primary navigation shows exactly 5 core workflow entries", async () => {
    await renderAuthenticatedApp(["/"]);

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

  it("sidebar shows 報表 and 說明 as secondary entries", async () => {
    await renderAuthenticatedApp(["/"]);

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

    await renderAuthenticatedApp(["/"]);

    expect(screen.queryByRole("button", { name: "新增" })).toBeNull();
    expect(screen.queryByText("頁面內新增")).toBeNull();
    expect(screen.queryByRole("img", { name: "通知功能尚未啟用" })).toBeNull();

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
  ])("direct route %s is still accessible after login", async (path, heading) => {
    await renderAuthenticatedApp([path]);

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("shows clickable help quick-start items with expected routes", async () => {
    await renderAuthenticatedApp(["/help"]);

    expect(
      screen.getByRole("link", { name: "專案 / Projects 前往專案頁面建立或整理專案" }),
    ).toHaveAttribute("href", "/projects");
    expect(
      screen.getByRole("link", { name: "任務 / Tasks 前往任務頁面安排本週工作" }),
    ).toHaveAttribute("href", "/tasks");
    expect(
      screen.getByRole("link", { name: "客戶 / Clients 前往客戶頁面管理名單與備註" }),
    ).toHaveAttribute("href", "/clients");
    expect(
      screen.getByRole("link", {
        name: "收款紀錄 / Income Records 前往收款頁面追蹤款項狀態",
      }),
    ).toHaveAttribute("href", "/invoices");
    expect(
      screen.getByRole("link", { name: "報表 / Reports 前往報表頁面檢視整體摘要" }),
    ).toHaveAttribute("href", "/reports");
  });
});
