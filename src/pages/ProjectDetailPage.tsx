import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import {
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue,
} from "../components/page/PageContentPrimitives";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle,
} from "../components/page/PageShell";
import { getUserFacingErrorMessage } from "../lib/errorMessages";
import {
  fetchProjectForCurrentUser,
  type ProjectRecord,
} from "../lib/projects";
import {
  TASK_STATUS_VALUES,
  fetchTasksForProjectForCurrentUser,
  type TaskRecord,
  type TaskStatus,
} from "../lib/tasks";
import {
  fetchIncomeRecordsForProjectForCurrentUser,
  type IncomeRecord,
} from "../lib/incomeRecords";
import { STATUS_LABELS as PROJECT_STATUS_LABELS } from "../features/projects";
import {
  BackLink,
  CompactItem,
  CompactList,
  Description,
  DetailGrid,
  DistributionList,
  ErrorState,
  InfoGrid,
  InfoItem,
  InlineState,
  ItemMeta,
  ItemTitle,
  Label,
  Value,
} from "./ProjectDetailPage.styles";

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "待辦",
  in_progress: "進行中",
  done: "已完成",
  cancelled: "已取消",
};

const INCOME_STATUS_LABELS: Record<IncomeRecord["status"], string> = {
  pending: "待收款",
  paid: "已收款",
  overdue: "逾期",
  cancelled: "已取消",
};

type ProjectDetailState = {
  project: ProjectRecord | null;
  tasks: TaskRecord[];
  incomeRecords: IncomeRecord[];
};

function formatDate(value: string | null) {
  return value ?? "未設定";
}

function formatCurrency(value: number) {
  const formatted = new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 0,
  }).format(value);

  return `NT$${formatted}`;
}

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getTaskStatusCounts(tasks: TaskRecord[]) {
  return TASK_STATUS_VALUES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status).length;
      return acc;
    },
    {
      todo: 0,
      in_progress: 0,
      done: 0,
      cancelled: 0,
    } as Record<TaskStatus, number>,
  );
}

function getOverdueTaskCount(tasks: TaskRecord[]) {
  const today = getTodayDateKey();

  return tasks.filter(
    (task) =>
      task.due_date !== null &&
      task.due_date < today &&
      task.status !== "done" &&
      task.status !== "cancelled",
  ).length;
}

function getDueTasks(tasks: TaskRecord[]) {
  return tasks
    .filter((task) => task.due_date !== null)
    .sort((a, b) => (a.due_date as string).localeCompare(b.due_date as string))
    .slice(0, 5);
}

function getRecentIncomeRecords(incomeRecords: IncomeRecord[]) {
  return [...incomeRecords]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);
}

function getTotalRevenue(incomeRecords: IncomeRecord[]) {
  return incomeRecords.reduce((total, record) => total + record.amount, 0);
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [detail, setDetail] = useState<ProjectDetailState>({
    project: null,
    tasks: [],
    incomeRecords: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProjectDetail() {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const project = await fetchProjectForCurrentUser(projectId);

        if (!active) {
          return;
        }

        if (!project) {
          setDetail({ project: null, tasks: [], incomeRecords: [] });
          return;
        }

        const [tasks, incomeRecords] = await Promise.all([
          fetchTasksForProjectForCurrentUser(projectId),
          fetchIncomeRecordsForProjectForCurrentUser(projectId),
        ]);

        if (!active) {
          return;
        }

        setDetail({ project, tasks, incomeRecords });
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "無法讀取專案詳情，請稍後再試。";
        setError(getUserFacingErrorMessage(error, message));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProjectDetail();

    return () => {
      active = false;
    };
  }, [projectId]);

  const taskStatusCounts = useMemo(
    () => getTaskStatusCounts(detail.tasks),
    [detail.tasks],
  );
  const overdueTaskCount = useMemo(
    () => getOverdueTaskCount(detail.tasks),
    [detail.tasks],
  );
  const dueTasks = useMemo(() => getDueTasks(detail.tasks), [detail.tasks]);
  const recentIncomeRecords = useMemo(
    () => getRecentIncomeRecords(detail.incomeRecords),
    [detail.incomeRecords],
  );
  const totalRevenue = useMemo(
    () => getTotalRevenue(detail.incomeRecords),
    [detail.incomeRecords],
  );

  if (isLoading) {
    return (
      <PageMain aria-labelledby="project-detail-loading-title">
        <BackLink to="/projects">返回專案列表</BackLink>
        <InlineState
          id="project-detail-loading-title"
          data-testid="project-detail-loading"
        >
          正在讀取專案詳情...
        </InlineState>
      </PageMain>
    );
  }

  if (error) {
    return (
      <PageMain aria-labelledby="project-detail-error-title">
        <BackLink to="/projects">返回專案列表</BackLink>
        <ErrorState id="project-detail-error-title" data-testid="project-detail-error">
          {error}
        </ErrorState>
      </PageMain>
    );
  }

  if (!detail.project) {
    return (
      <PageMain aria-labelledby="project-detail-not-found-title">
        <BackLink to="/projects">返回專案列表</BackLink>
        <ErrorState
          id="project-detail-not-found-title"
          data-testid="project-detail-not-found"
        >
          找不到這個專案，或它不屬於目前登入的工作區。
        </ErrorState>
      </PageMain>
    );
  }

  const { project } = detail;

  return (
    <PageMain aria-labelledby="project-detail-title">
      <BackLink to="/projects">返回專案列表</BackLink>

      <PageHeader>
        <PageTitle id="project-detail-title">{project.name}</PageTitle>
        <PageDescription>
          檢視單一專案的基本資訊、相關任務狀態與收入摘要。
        </PageDescription>
      </PageHeader>

      <DetailGrid>
        <DashboardPanel aria-labelledby="project-basic-info-title">
          <DashboardSectionHeader
            titleId="project-basic-info-title"
            title="專案基本資訊"
            description="沿用現有專案資料欄位，不額外假設資料表欄位。"
            withDivider
          />
          <InfoGrid>
            <InfoItem>
              <Label>客戶</Label>
              <Value>{project.client_name ?? "未設定"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>狀態</Label>
              <Value>{PROJECT_STATUS_LABELS[project.status]}</Value>
            </InfoItem>
            <InfoItem>
              <Label>開始日期</Label>
              <Value>{formatDate(project.start_date)}</Value>
            </InfoItem>
            <InfoItem>
              <Label>截止日期</Label>
              <Value>{formatDate(project.due_date)}</Value>
            </InfoItem>
            <InfoItem>
              <Label>建立時間</Label>
              <Value>{formatDate(project.created_at.slice(0, 10))}</Value>
            </InfoItem>
          </InfoGrid>
          <Description>{project.description ?? "目前沒有專案描述。"}</Description>
        </DashboardPanel>

        <DashboardPanel aria-labelledby="project-revenue-summary-title">
          <DashboardSectionHeader
            titleId="project-revenue-summary-title"
            title="相關收入摘要"
            description="依 income_records.project_id 篩選此專案收入紀錄。"
            withDivider
          />
          <PageMetricGrid>
            <PageMetricCard>
              <PageMetricLabel>總相關收入</PageMetricLabel>
              <PageMetricValue data-testid="project-detail-revenue-total">
                {formatCurrency(totalRevenue)}
              </PageMetricValue>
            </PageMetricCard>
          </PageMetricGrid>
          {detail.incomeRecords.length === 0 ? (
            <InlineState data-testid="project-detail-empty-income">
              這個專案目前沒有相關收入紀錄。
            </InlineState>
          ) : (
            <CompactList>
              {recentIncomeRecords.map((record) => (
                <CompactItem key={record.id}>
                  <ItemTitle>{record.title}</ItemTitle>
                  <ItemMeta>
                    {formatCurrency(record.amount)} ｜ {INCOME_STATUS_LABELS[record.status]} ｜
                    到期 {formatDate(record.due_date)}
                  </ItemMeta>
                </CompactItem>
              ))}
            </CompactList>
          )}
        </DashboardPanel>
      </DetailGrid>

      <DashboardPanel aria-labelledby="project-task-summary-title">
        <DashboardSectionHeader
          titleId="project-task-summary-title"
          title="相關任務摘要"
          description="依 tasks.project_id 篩選此專案任務，呈現狀態分佈與期限風險。"
          withDivider
        />
        <PageMetricGrid>
          <PageMetricCard>
            <PageMetricLabel>相關任務總數</PageMetricLabel>
            <PageMetricValue data-testid="project-detail-task-total">
              {detail.tasks.length}
            </PageMetricValue>
          </PageMetricCard>
          <PageMetricCard>
            <PageMetricLabel>逾期未完成</PageMetricLabel>
            <PageMetricValue data-testid="project-detail-overdue-tasks">
              {overdueTaskCount}
            </PageMetricValue>
          </PageMetricCard>
        </PageMetricGrid>
        {detail.tasks.length === 0 ? (
          <InlineState data-testid="project-detail-empty-tasks">
            這個專案目前沒有相關任務。
          </InlineState>
        ) : (
          <>
            <DistributionList>
              {TASK_STATUS_VALUES.map((status) => (
                <InfoItem key={status}>
                  <Label>{TASK_STATUS_LABELS[status]}</Label>
                  <Value>
                    {TASK_STATUS_LABELS[status]}：{taskStatusCounts[status]}
                  </Value>
                </InfoItem>
              ))}
            </DistributionList>
            <CompactList>
              {dueTasks.map((task) => (
                <CompactItem key={task.id}>
                  <ItemTitle>{task.title}</ItemTitle>
                  <ItemMeta>
                    {TASK_STATUS_LABELS[task.status]} ｜ 到期 {formatDate(task.due_date)}
                  </ItemMeta>
                </CompactItem>
              ))}
            </CompactList>
          </>
        )}
      </DashboardPanel>
    </PageMain>
  );
}
