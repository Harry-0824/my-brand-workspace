import { describe, expect, it } from "vitest";
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

  it("keeps snapshot card structure stable for dashboard summary mapping", () => {
    expect(dashboardWorkspaceSnapshot).toHaveLength(6);
    for (const item of dashboardWorkspaceSnapshot) {
      expect(item.label).not.toBe("");
      expect(item.note).not.toBe("");
    }
  });
});
