import styled from "styled-components";
import { ActiveProjects } from "./ActiveProjects";
import { ClientSummary } from "./ClientSummary";
import { CompactKanbanPreview } from "./CompactKanbanPreview";
import { DashboardStatePreviews } from "./DashboardStatePreviews";
import { FocusPlan } from "./FocusPlan";
import { OverviewCards } from "./OverviewCards";
import { RecentActivity } from "./RecentActivity";
import { RevenueInvoiceSummary } from "./RevenueInvoiceSummary";
import { TaskDetailPanelPreview } from "./TaskDetailPanelPreview";
import { UpcomingDeadlines } from "./UpcomingDeadlines";

export function DashboardContent() {
  return (
    <MainContent aria-labelledby="workspace-title">
      <DashboardIntro>
        <WorkspaceTitle id="workspace-title">My Brand Workspace</WorkspaceTitle>
        <WorkspaceSubtitle>單人接案任務管理工作區</WorkspaceSubtitle>
        <WorkspaceStatus>今天先從專案狀態與待辦摘要開始。</WorkspaceStatus>
      </DashboardIntro>

      <OverviewCards />
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
