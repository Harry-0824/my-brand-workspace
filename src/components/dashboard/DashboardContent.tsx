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
  RightColumn,
} from "./DashboardContent.styles";
import {
  createZeroDashboardSummary,
  fetchDashboardSummaryForCurrentUser,
} from "../../lib/dashboardSummary";
import { getUserFacingErrorMessage } from "../../lib/errorMessages";
import {
  type ProjectRecord,
  fetchProjectsForCurrentUser,
} from "../../lib/projects";
import { type TaskRecord, fetchTasksForCurrentUser } from "../../lib/tasks";
import {
  type ClientRecord,
  fetchClientsForCurrentUser,
} from "../../lib/clients";
import {
  type IncomeRecord,
  fetchIncomeRecordsForCurrentUser,
} from "../../lib/incomeRecords";
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

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

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

  useEffect(() => {
    let active = true;

    async function loadData() {
      setIsDataLoading(true);
      setDataError(null);

      const [projectsResult, tasksResult, clientsResult, incomeResult] =
        await Promise.allSettled([
          fetchProjectsForCurrentUser(),
          fetchTasksForCurrentUser(),
          fetchClientsForCurrentUser(),
          fetchIncomeRecordsForCurrentUser(),
        ]);

      if (!active) {
        return;
      }

      if (projectsResult.status === "fulfilled") {
        setProjects(projectsResult.value);
      }
      if (tasksResult.status === "fulfilled") {
        setTasks(tasksResult.value);
      }
      if (clientsResult.status === "fulfilled") {
        setClients(clientsResult.value);
      }
      if (incomeResult.status === "fulfilled") {
        setIncomeRecords(incomeResult.value);
      }

      const hasAnyError = [
        projectsResult,
        tasksResult,
        clientsResult,
        incomeResult,
      ].some((r) => r.status === "rejected");
      if (hasAnyError) {
        setDataError("部分資料暫時無法載入，請稍後再試。");
      }

      setIsDataLoading(false);
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const isEmpty =
    !isDataLoading &&
    dataError === null &&
    projects.length === 0 &&
    tasks.length === 0 &&
    clients.length === 0 &&
    incomeRecords.length === 0;

  return (
    <MainContent aria-labelledby="workspace-title">
      <DashboardIntro>
        <WorkspaceTitle id="workspace-title">My Brand Workspace</WorkspaceTitle>
        <WorkspaceSubtitle>單人接案任務管理工作區</WorkspaceSubtitle>
        <WorkspaceStatus>今天先從專案狀態與待辦摘要開始。</WorkspaceStatus>
        {summaryError ? (
          <SummaryError data-testid="dashboard-summary-error">
            {summaryError}
          </SummaryError>
        ) : null}
      </DashboardIntro>

      <DashboardMvpOverview
        summary={summary}
        isSummaryLoading={isSummaryLoading}
      />
      <OverviewCards summary={summary} isSummaryLoading={isSummaryLoading} />
      <QuickActions />
      <FocusPlan />

      <PrimaryGrid>
        <LeftColumn>
          <ActiveProjects
            projects={projects}
            isLoading={isDataLoading}
            error={dataError}
          />
          <CompactKanbanPreview
            tasks={tasks}
            isLoading={isDataLoading}
            error={dataError}
          />
        </LeftColumn>

        <RightColumn>
          <UpcomingDeadlines
            projects={projects}
            tasks={tasks}
            isLoading={isDataLoading}
            error={dataError}
          />
          <RecentActivity
            tasks={tasks}
            projects={projects}
            isLoading={isDataLoading}
            error={dataError}
          />
          <TaskDetailPanelPreview
            tasks={tasks}
            projects={projects}
            isLoading={isDataLoading}
            error={dataError}
          />
          <RevenueInvoiceSummary
            incomeRecords={incomeRecords}
            clients={clients}
            isLoading={isDataLoading}
            error={dataError}
          />
          <ClientSummary
            clients={clients}
            isLoading={isDataLoading}
            error={dataError}
          />
          <DashboardStatePreviews
            isLoading={isDataLoading}
            hasError={dataError !== null}
            isEmpty={isEmpty}
          />
        </RightColumn>
      </PrimaryGrid>
    </MainContent>
  );
}
