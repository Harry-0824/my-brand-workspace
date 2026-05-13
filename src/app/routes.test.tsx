import { describe, expect, it } from "vitest";
import {
  APP_ROUTES,
  PRIMARY_SIDEBAR_ROUTES,
  SECONDARY_SIDEBAR_ROUTES,
  SIDEBAR_ROUTES,
} from "./routes";

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
      "*",
    ]);
  });

  it("keeps the exact sidebar labels", () => {
    expect(SIDEBAR_ROUTES.map((route) => route.label)).toEqual([
      "儀表板",
      "專案",
      "任務",
      "客戶",
      "說明",
      "收款紀錄",
      "報表",
    ]);
  });

  it("keeps the exact sidebar paths", () => {
    expect(SIDEBAR_ROUTES.map((route) => route.path)).toEqual([
      "/",
      "/projects",
      "/tasks",
      "/clients",
      "/help",
      "/invoices",
      "/reports",
    ]);
  });

  it("primary sidebar shows only the 5 core workflow entries", () => {
    expect(PRIMARY_SIDEBAR_ROUTES.map((r) => r.label)).toEqual([
      "儀表板",
      "專案",
      "任務",
      "客戶",
      "收款紀錄",
    ]);
  });

  it("secondary sidebar shows only 報表 and 說明", () => {
    expect(SECONDARY_SIDEBAR_ROUTES.map((r) => r.label)).toEqual([
      "說明",
      "報表",
    ]);
  });

  it("檔案 is not in primary or secondary sidebar", () => {
    const allSidebarLabels = [
      ...PRIMARY_SIDEBAR_ROUTES,
      ...SECONDARY_SIDEBAR_ROUTES,
    ].map((r) => r.label);

    expect(allSidebarLabels).not.toContain("檔案");
  });

  it("行事曆 is not in primary or secondary sidebar", () => {
    const allSidebarLabels = [
      ...PRIMARY_SIDEBAR_ROUTES,
      ...SECONDARY_SIDEBAR_ROUTES,
    ].map((r) => r.label);

    expect(allSidebarLabels).not.toContain("行事曆");
  });

  it("設定 is not in primary or secondary sidebar", () => {
    const allSidebarLabels = [
      ...PRIMARY_SIDEBAR_ROUTES,
      ...SECONDARY_SIDEBAR_ROUTES,
    ].map((r) => r.label);

    expect(allSidebarLabels).not.toContain("設定");
  });

  it("收款紀錄 uses /invoices route", () => {
    const invoiceRoute = APP_ROUTES.find((r) => r.key === "invoices");

    expect(invoiceRoute?.label).toBe("收款紀錄");
    expect(invoiceRoute?.path).toBe("/invoices");
  });

  it("keeps not-found metadata unchanged", () => {
    const notFoundRoute = APP_ROUTES.find((route) => route.key === "not-found");

    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute).toMatchObject({
      key: "not-found",
      path: "*",
      label: null,
      showInSidebar: false,
      heading: "找不到頁面",
    });
  });
});
