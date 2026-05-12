import { describe, expect, it } from "vitest";
import { APP_ROUTES, SIDEBAR_ROUTES } from "./routes";

describe("route metadata guards", () => {
  it("keeps the exact app route paths", () => {
    expect(APP_ROUTES.map((route) => route.path)).toEqual([
      "/",
      "/projects",
      "/tasks",
      "/clients",
      "/files",
      "/help",
      "/invoices",
      "/calendar",
      "/reports",
      "/settings",
      "*"
    ]);
  });

  it("keeps the exact sidebar labels", () => {
    expect(SIDEBAR_ROUTES.map((route) => route.label)).toEqual([
      "儀表板",
      "專案",
      "任務",
      "客戶",
      "檔案",
      "說明",
      "收款",
      "行事曆",
      "報表",
      "設定"
    ]);
  });

  it("keeps the exact sidebar paths", () => {
    expect(SIDEBAR_ROUTES.map((route) => route.path)).toEqual([
      "/",
      "/projects",
      "/tasks",
      "/clients",
      "/files",
      "/help",
      "/invoices",
      "/calendar",
      "/reports",
      "/settings"
    ]);
  });

  it("keeps not-found metadata unchanged", () => {
    const notFoundRoute = APP_ROUTES.find((route) => route.key === "not-found");

    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute).toMatchObject({
      key: "not-found",
      path: "*",
      label: null,
      showInSidebar: false,
      heading: "找不到頁面"
    });
  });
});
