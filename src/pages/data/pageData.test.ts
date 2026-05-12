import { describe, expect, it } from "vitest";
import * as calendarData from "./calendarPageData";
import * as clientsData from "./clientsPageData";
import * as filesData from "./filesPageData";
import * as helpData from "./helpPageData";
import * as invoicesData from "./invoicesPageData";
import * as reportsData from "./reportsPageData";
import * as settingsData from "./settingsPageData";

describe("page data guards", () => {
  it("exports expected modules for all extracted page data files", () => {
    expect(calendarData).toHaveProperty("weekOverview");
    expect(calendarData).toHaveProperty("upcomingSchedule");
    expect(calendarData).toHaveProperty("milestoneTimeline");
    expect(calendarData).toHaveProperty("focusBlocks");

    expect(clientsData).toHaveProperty("summaryMetrics");
    expect(clientsData).toHaveProperty("clientRows");

    expect(filesData).toHaveProperty("summaryMetrics");
    expect(filesData).toHaveProperty("recentFiles");
    expect(filesData).toHaveProperty("categories");
    expect(filesData).toHaveProperty("deliveryPreview");

    expect(helpData).toHaveProperty("gettingStarted");
    expect(helpData).toHaveProperty("workflows");
    expect(helpData).toHaveProperty("faqPreview");

    expect(invoicesData).toHaveProperty("summaryMetrics");
    expect(invoicesData).toHaveProperty("invoiceRows");

    expect(reportsData).toHaveProperty("summaryMetrics");
    expect(reportsData).toHaveProperty("projectStatusOverview");
    expect(reportsData).toHaveProperty("taskPerformance");
    expect(reportsData).toHaveProperty("revenueSnapshot");

    expect(settingsData).toHaveProperty("workspaceProfile");
    expect(settingsData).toHaveProperty("notificationPreferences");
    expect(settingsData).toHaveProperty("accountPreferences");
    expect(settingsData).toHaveProperty("billingStatus");
  });

  it("keeps major exported arrays non-empty", () => {
    expect(calendarData.weekOverview.length).toBeGreaterThan(0);
    expect(calendarData.upcomingSchedule.length).toBeGreaterThan(0);
    expect(calendarData.milestoneTimeline.length).toBeGreaterThan(0);
    expect(calendarData.focusBlocks.length).toBeGreaterThan(0);

    expect(clientsData.summaryMetrics.length).toBeGreaterThan(0);
    expect(clientsData.clientRows.length).toBeGreaterThan(0);

    expect(filesData.summaryMetrics.length).toBeGreaterThan(0);
    expect(filesData.recentFiles.length).toBeGreaterThan(0);
    expect(filesData.categories.length).toBeGreaterThan(0);
    expect(filesData.deliveryPreview.length).toBeGreaterThan(0);

    expect(helpData.gettingStarted.length).toBeGreaterThan(0);
    expect(helpData.workflows.length).toBeGreaterThan(0);
    expect(helpData.faqPreview.length).toBeGreaterThan(0);

    expect(invoicesData.summaryMetrics.length).toBeGreaterThan(0);
    expect(invoicesData.invoiceRows.length).toBeGreaterThan(0);

    expect(reportsData.summaryMetrics.length).toBeGreaterThan(0);
    expect(reportsData.projectStatusOverview.length).toBeGreaterThan(0);
    expect(reportsData.taskPerformance.length).toBeGreaterThan(0);
    expect(reportsData.revenueSnapshot.length).toBeGreaterThan(0);

    expect(settingsData.workspaceProfile.length).toBeGreaterThan(0);
    expect(settingsData.notificationPreferences.length).toBeGreaterThan(0);
    expect(settingsData.accountPreferences.length).toBeGreaterThan(0);
    expect(settingsData.billingStatus.length).toBeGreaterThan(0);
  });
});
