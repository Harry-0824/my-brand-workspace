import { describe, expect, it } from "vitest";
import * as clientsData from "./clientsPageData";
import * as invoicesData from "./invoicesPageData";
import * as settingsData from "./settingsPageData";

describe("page data guards", () => {
  it("exports expected modules for clients/invoices/settings", () => {
    expect(clientsData).toHaveProperty("summaryMetrics");
    expect(clientsData).toHaveProperty("clientRows");

    expect(invoicesData).toHaveProperty("summaryMetrics");
    expect(invoicesData).toHaveProperty("invoiceRows");

    expect(settingsData).toHaveProperty("workspaceProfile");
    expect(settingsData).toHaveProperty("notificationPreferences");
    expect(settingsData).toHaveProperty("accountPreferences");
    expect(settingsData).toHaveProperty("billingStatus");
  });

  it("keeps major exported arrays non-empty", () => {
    expect(clientsData.summaryMetrics.length).toBeGreaterThan(0);
    expect(clientsData.clientRows.length).toBeGreaterThan(0);

    expect(invoicesData.summaryMetrics.length).toBeGreaterThan(0);
    expect(invoicesData.invoiceRows.length).toBeGreaterThan(0);

    expect(settingsData.workspaceProfile.length).toBeGreaterThan(0);
    expect(settingsData.notificationPreferences.length).toBeGreaterThan(0);
    expect(settingsData.accountPreferences.length).toBeGreaterThan(0);
    expect(settingsData.billingStatus.length).toBeGreaterThan(0);
  });
});
