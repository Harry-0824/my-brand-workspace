import { useState } from "react";
import styled from "styled-components";
import {
  ALL_FILTER_VALUE,
  PageFilterControl
} from "../components/page/PageFilterControl";
import { PageSearchInput } from "../components/page/PageSearchInput";
import { PageListEmptyState } from "../components/page/PageListEmptyState";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import {
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue
} from "../components/page/PageContentPrimitives";
import { PageNextStep } from "../components/page/PageNextStep";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";

const summaryMetrics = [
  { label: "全部任務", value: "12" },
  { label: "進行中", value: "4" },
  { label: "待審核", value: "3" },
  { label: "今日到期", value: "2" }
] as const;

const taskRows = [
  {
    task: "完成首頁線框調整",
    project: "品牌官網重設計",
    status: "進行中",
    priority: "高",
    dueDate: "5 月 24 日"
  },
  {
    task: "檢查購物車測試結果",
    project: "電商功能開發",
    status: "待處理",
    priority: "高",
    dueDate: "5 月 22 日"
  },
  {
    task: "整理提案修改內容",
    project: "客戶提案製作",
    status: "排程中",
    priority: "中",
    dueDate: "5 月 23 日"
  },
  {
    task: "準備部署檢查",
    project: "個人作品網站",
    status: "待審核",
    priority: "中",
    dueDate: "5 月 25 日"
  },
  {
    task: "追蹤客戶回覆狀態",
    project: "品牌官網重設計",
    status: "追蹤中",
    priority: "低",
    dueDate: "5 月 26 日"
  },
  {
    task: "確認資訊架構",
    project: "品牌官網重設計",
    status: "已完成",
    priority: "低",
    dueDate: "5 月 18 日"
  }
] as const;

export function TasksPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const statusOptions = Array.from(new Set(taskRows.map((item) => item.status)));
  const rowsAfterFilter =
    statusFilter === ALL_FILTER_VALUE
      ? taskRows
      : taskRows.filter((item) => item.status === statusFilter);
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleRows = rowsAfterFilter.filter((item) => {
    if (!normalizedKeyword) {
      return true;
    }

    const searchableText = [
      item.task,
      item.project,
      item.status,
      item.priority,
      item.dueDate
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  return (
    <PageMain aria-labelledby="tasks-page-title">
      <PageHeader>
        <PageTitle id="tasks-page-title">任務管理</PageTitle>
        <PageDescription>集中管理待辦、進行中、審核中與已完成的接案任務。</PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="tasks-summary-title">
        <DashboardSectionHeader
          titleId="tasks-summary-title"
          title="任務總覽"
          description="快速掌握任務數量、處理狀態與近期到期節奏。"
          withDivider
        />
        <MetricGrid>
          {summaryMetrics.map((metric) => (
            <MetricCard key={metric.label}>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricValue>{metric.value}</MetricValue>
            </MetricCard>
          ))}
        </MetricGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="tasks-list-title">
        <DashboardSectionHeader
          titleId="tasks-list-title"
          title="任務列表"
          description="查看任務狀態、優先級與到期日，掌握每日執行節奏。"
          withDivider
        />

        <ToolbarRow>
          <PageSearchInput
            id="tasks-search-input"
            label="任務關鍵字搜尋"
            value={keyword}
            placeholder="搜尋任務、專案或狀態..."
            onChange={setKeyword}
          />
          <PageFilterControl
            id="tasks-status-filter"
            label="任務狀態篩選"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <AddButton type="button">新增任務</AddButton>
        </ToolbarRow>

        {visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => (
              <Row key={`${item.task}-${item.dueDate}`}>
                <RowTop>
                  <TaskName>{item.task}</TaskName>
                  <StatusBadge data-testid="tasks-status-badge">
                    {item.status}
                  </StatusBadge>
                </RowTop>
                <RowMeta>
                  <MetaText>{item.project}</MetaText>
                  <MetaText>{item.priority}</MetaText>
                  <MetaText>{item.dueDate}</MetaText>
                </RowMeta>
              </Row>
            ))}
          </Rows>
        ) : (
          <PageListEmptyState
            testId="tasks-empty-state"
            title="目前沒有符合條件的任務"
            description="請調整關鍵字或狀態篩選條件，再試一次。"
          />
        )}

        <DistributionText>任務狀態分布：待處理、進行中、待審核、已完成。</DistributionText>
      </DashboardPanel>
      <PageNextStep
        titleId="tasks-next-step-title"
        title="下一步建議"
        description="確認任務分布後，建議前往專案與行事曆同步進度。"
        links={[
          { label: "前往專案頁面，對齊任務與交付目標", to: "/projects" },
          { label: "前往行事曆頁面，安排本週時段", to: "/calendar" }
        ]}
      />
    </PageMain>
  );
}

const MetricGrid = PageMetricGrid;
const MetricCard = PageMetricCard;
const MetricLabel = PageMetricLabel;
const MetricValue = PageMetricValue;

const ToolbarRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AddButton = styled.button`
  border: 1px solid rgb(98 214 199 / 0.35);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(98 214 199 / 0.12);
  font-size: 0.9rem;
  font-weight: 700;
`;

const Rows = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TaskName = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.96rem;
  font-weight: 800;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(246 200 95 / 0.32);
  border-radius: 999px;
  color: #f8d98a;
  background: rgb(246 200 95 / 0.12);
  font-size: 0.72rem;
  font-weight: 800;
`;

const RowMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetaText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  font-weight: 700;
`;

const DistributionText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
