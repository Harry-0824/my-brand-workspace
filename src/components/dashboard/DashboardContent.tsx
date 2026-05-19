import { useEffect, useState } from "react";
import styled from "styled-components";
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

const MainContent = styled.main`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const DashboardIntro = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
`;

const WorkspaceTitle = styled.h1`
  max-width: 760px;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 3.2rem;
  line-height: 1.05;
`;

const WorkspaceSubtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.45rem;
  font-weight: 700;
`;

const WorkspaceStatus = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;

const SummaryError = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: #ffb4ad;
  font-size: 0.92rem;
  line-height: 1.65;
`;

const PrimaryGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LeftColumn = styled.div`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RightColumn = styled.div`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.lg};
`;
