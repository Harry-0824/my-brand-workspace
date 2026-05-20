import { useEffect, useMemo, useState } from "react";
import {
  RowHeader,
  StatusTitle,
  StatusCount,
  RowNote,
  InlineError,
  TripletGrid
} from "./ReportsPage.styles";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import {
  PageList,
  PageListCard,
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue,
  PageNote
} from "../components/page/PageContentPrimitives";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import {
  createZeroReportsOverview,
  fetchReportsOverviewForCurrentUser
} from "../lib/reportsOverview";
import { getUserFacingErrorMessage } from "../lib/errorMessages";

function formatCurrency(amount: number) {
  return `NT$${amount.toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function ReportsPage() {
  const [overview, setOverview] = useState(createZeroReportsOverview());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      setIsLoading(true);
      setError(null);

      try {
        const nextOverview = await fetchReportsOverviewForCurrentUser();
        if (!active) {
          return;
        }
        setOverview(nextOverview);
      } catch (loadError) {
        if (!active) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "目前無法載入報表資料，請稍後再試。";
        setError(getUserFacingErrorMessage(loadError, message));
        setOverview(createZeroReportsOverview());
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      active = false;
    };
  }, []);

  const taskCompletionRate = useMemo(() => {
    if (overview.totalTasks === 0) {
      return 0;
    }
    return (overview.doneTasks / overview.totalTasks) * 100;
  }, [overview.doneTasks, overview.totalTasks]);

  const summaryMetrics = [
    { label: "累計收款金額", value: formatCurrency(overview.totalIncomeAmount) },
    { label: "專案總數", value: String(overview.totalProjects) },
    { label: "任務總數", value: String(overview.totalTasks) },
    { label: "客戶總數", value: String(overview.totalClients) }
  ];

  const projectStatusOverview = [
    { status: "進行中", count: overview.activeProjects, note: "目前持續執行中的專案。" },
    { status: "暫停", count: overview.pausedProjects, note: "等待回饋或排程調整中的專案。" },
    { status: "已完成", count: overview.completedProjects, note: "已交付完成的專案。" },
    { status: "已封存", count: overview.archivedProjects, note: "已結案並封存的專案。" }
  ];

  const taskPerformance = [
    { label: "待處理任務", value: String(overview.todoTasks + overview.inProgressTasks) },
    { label: "已完成任務", value: String(overview.doneTasks) },
    { label: "已取消任務", value: String(overview.cancelledTasks) },
    { label: "完成率", value: formatPercent(taskCompletionRate) }
  ];

  const revenueSnapshot = [
    { label: "已收款", value: formatCurrency(overview.paidIncomeAmount) },
    { label: "待收款", value: formatCurrency(overview.pendingIncomeAmount) },
    { label: "逾期收款", value: formatCurrency(overview.overdueIncomeAmount) },
    { label: "已取消收款", value: formatCurrency(overview.cancelledIncomeAmount) }
  ];

  const renderValue = (value: string) => (isLoading ? "--" : value);

  return (
    <PageMain aria-labelledby="reports-page-title">
      <PageHeader>
        <PageTitle id="reports-page-title">報表</PageTitle>
        <PageDescription>
          檢視專案、任務與收款狀態的即時總覽。
        </PageDescription>
        {error ? <InlineError data-testid="reports-error-state">{error}</InlineError> : null}
      </PageHeader>

      <DashboardPanel aria-labelledby="reports-summary-title">
        <DashboardSectionHeader
          titleId="reports-summary-title"
          title="摘要指標"
          description="以下為目前帳號的即時報表摘要。"
          withDivider
        />
        <MetricGrid>
          {summaryMetrics.map((metric) => (
            <MetricCard key={metric.label}>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricValue>{renderValue(metric.value)}</MetricValue>
            </MetricCard>
          ))}
        </MetricGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-project-status-title">
        <DashboardSectionHeader
          titleId="reports-project-status-title"
          title="專案狀態總覽"
          description="快速查看目前專案分布與進度狀態。"
          withDivider
        />
        <List>
          {projectStatusOverview.map((item) => (
            <ListRow key={item.status}>
              <RowHeader>
                <StatusTitle>{item.status}</StatusTitle>
                <StatusCount>{isLoading ? "--" : item.count}</StatusCount>
              </RowHeader>
              <RowNote>{item.note}</RowNote>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-task-performance-title">
        <DashboardSectionHeader
          titleId="reports-task-performance-title"
          title="任務表現"
          description="顯示任務處理與完成狀態摘要。"
          withDivider
        />
        <TripletGrid>
          {taskPerformance.map((item) => (
            <TripletCard key={item.label}>
              <MetricLabel>{item.label}</MetricLabel>
              <MetricValue>{renderValue(item.value)}</MetricValue>
            </TripletCard>
          ))}
        </TripletGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-revenue-title">
        <DashboardSectionHeader
          titleId="reports-revenue-title"
          title="收款快照"
          description="顯示目前收款狀態的即時統計。"
          withDivider
        />
        <TripletGrid>
          {revenueSnapshot.map((item) => (
            <TripletCard key={item.label}>
              <MetricLabel>{item.label}</MetricLabel>
              <MetricValue>{renderValue(item.value)}</MetricValue>
            </TripletCard>
          ))}
        </TripletGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-insight-title">
        <DashboardSectionHeader
          titleId="reports-insight-title"
          title="本週洞察"
          description="依目前報表數據提供優先關注方向。"
          withDivider
        />
        <InsightText>
          優先追蹤待收款與逾期收款，並集中推進待處理任務，避免影響下週交付節奏。
        </InsightText>
      </DashboardPanel>
    </PageMain>
  );
}

const MetricGrid = PageMetricGrid;
const MetricCard = PageMetricCard;
const MetricLabel = PageMetricLabel;
const MetricValue = PageMetricValue;
const List = PageList;
const ListRow = PageListCard;

const TripletCard = PageMetricCard;

const InsightText = PageNote;
