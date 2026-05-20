import { useEffect, useState } from "react";
import {
  MainContent,
  DashboardIntro,
  WorkspaceTitle,
  WorkspaceSubtitle,
  WorkspaceStatus,
  SummaryError,
  PrimaryGrid,
  LeftColumn,
  RightColumn
} from "./DashboardContent.styles";
import {
  createZeroDashboardSummary,
  fetchDashboardSummaryForCurrentUser
} from "../../lib/dashboardSummary";
import { getUserFacingErrorMessage } from "../../lib/errorMessages";
import { ActiveProjects } from "./ActiveProjects";
import { ClientSummary } from "./ClientSummary";
import { CompactKanbanPreview } from "./CompactKanbanPreview";
import { DashboardMvpOverview } from "./DashboardMvpOverview";
import { DashboardStatePreviews } from "./DashboardStatePreviews";
import { FocusPlan } from "./FocusPlan";
import { OverviewCards } from "./OverviewCards";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { RevenueInvoiceSummary } from "./RevenueInvoiceSummary";
import { TaskDetailPanelPreview } from "./TaskDetailPanelPreview";
import { UpcomingDeadlines } from "./UpcomingDeadlines";

export function DashboardContent() {
  const [summary, setSummary] = useState(createZeroDashboardSummary());
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      setIsSummaryLoading(true);
      setSummaryError(null);

      try {
        const nextSummary = await fetchDashboardSummaryForCurrentUser();
        if (!active) {
          return;
        }
        setSummary(nextSummary);
      } catch (error) {
        if (!active) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "目前無法載入儀表板摘要資料，請稍後再試。";
        setSummaryError(getUserFacingErrorMessage(error, message));
        setSummary(createZeroDashboardSummary());
      } finally {
        if (active) {
          setIsSummaryLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      active = false;
    };
  }, []);

  return (
    <MainContent aria-labelledby="workspace-title">
      <DashboardIntro>
        <WorkspaceTitle id="workspace-title">My Brand Workspace</WorkspaceTitle>
        <WorkspaceSubtitle>單人接案任務管理工作區</WorkspaceSubtitle>
        <WorkspaceStatus>今天先從專案狀態與待辦摘要開始。</WorkspaceStatus>
        {summaryError ? (
          <SummaryError data-testid="dashboard-summary-error">{summaryError}</SummaryError>
        ) : null}
      </DashboardIntro>

      <DashboardMvpOverview summary={summary} isSummaryLoading={isSummaryLoading} />
      <OverviewCards summary={summary} isSummaryLoading={isSummaryLoading} />
      <QuickActions />
      <FocusPlan />

      <PrimaryGrid>
        <LeftColumn>
          <ActiveProjects />
          <CompactKanbanPreview />
          <ClientSummary />
        </LeftColumn>

        <RightColumn>
          <UpcomingDeadlines />
          <RecentActivity />
          <TaskDetailPanelPreview />
          <RevenueInvoiceSummary />
          <DashboardStatePreviews />
        </RightColumn>
      </PrimaryGrid>
    </MainContent>
  );
}
