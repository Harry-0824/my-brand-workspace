import { describe, expect, it } from "vitest";
import { clientRows } from "../../pages/data/clientsPageData";
import { invoiceRows } from "../../pages/data/invoicesPageData";
import { dashboardQuickActions, dashboardWorkspaceSnapshot } from "./dashboardData";

describe("dashboard data guards", () => {
  it("keeps quick action routes stable", () => {
    expect(dashboardQuickActions.map((item) => item.to)).toEqual([
      "/projects",
      "/tasks",
      "/clients",
      "/invoices",
      "/calendar",
      "/files"
    ]);
  });

  it("keeps snapshot values aligned with selected static page data", () => {
    expect(dashboardWorkspaceSnapshot[0].value).toBe("4");
    expect(dashboardWorkspaceSnapshot[1].value).toBe("6");
    expect(dashboardWorkspaceSnapshot[2].value).toBe(String(clientRows.length));
    expect(dashboardWorkspaceSnapshot[3].value).toBe(String(invoiceRows.length));
  });
});
