import styled from "styled-components";
import { ActiveProjects } from "../components/dashboard/ActiveProjects";
import { ClientSummary } from "../components/dashboard/ClientSummary";
import { CompactKanbanPreview } from "../components/dashboard/CompactKanbanPreview";
import { OverviewCards } from "../components/dashboard/OverviewCards";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { RevenueInvoiceSummary } from "../components/dashboard/RevenueInvoiceSummary";
import { TaskDetailPanelPreview } from "../components/dashboard/TaskDetailPanelPreview";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { AppHeader } from "../components/navigation/AppHeader";
import { Sidebar } from "../components/navigation/Sidebar";

export function AppLayout() {
  return (
    <LayoutShell>
      <Sidebar />
      <ContentArea>
        <AppHeader />
        <MainContent aria-labelledby="workspace-title">
          <DashboardIntro>
            <WorkspaceTitle id="workspace-title">My Brand Workspace</WorkspaceTitle>
            <WorkspaceSubtitle>單人接案任務管理工作區</WorkspaceSubtitle>
            <WorkspaceStatus>今天先從專案狀態與待辦摘要開始。</WorkspaceStatus>
          </DashboardIntro>
          <OverviewCards />
          <ActiveProjects />
          <UpcomingDeadlines />
          <RecentActivity />
          <CompactKanbanPreview />
          <TaskDetailPanelPreview />
          <ClientSummary />
          <RevenueInvoiceSummary />
        </MainContent>
      </ContentArea>
    </LayoutShell>
  );
}

const LayoutShell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
  background:
    radial-gradient(circle at 82% 12%, rgb(98 214 199 / 0.1), transparent 28rem),
    ${({ theme }) => theme.background};
`;

const ContentArea = styled.div`
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  border-left: 1px solid ${({ theme }) => theme.border};
`;

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
