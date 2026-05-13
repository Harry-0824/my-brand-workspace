import { useState } from "react";
import styled from "styled-components";
import {
  ALL_FILTER_VALUE,
  PageFilterControl
} from "../components/page/PageFilterControl";
import { PageSearchInput } from "../components/page/PageSearchInput";
import { PageListEmptyState } from "../components/page/PageListEmptyState";
import { PageResultCount } from "../components/page/PageResultCount";
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
  { label: "全部專案", value: "4" },
  { label: "進行中", value: "2" },
  { label: "待確認", value: "1" },
  { label: "本月交付", value: "3" }
] as const;

const projectRows = [
  {
    project: "品牌官網重設計",
    client: "Bright Studio",
    status: "進行中",
    progress: "75%",
    ownership: "設計調整、首頁線框、客戶確認",
    nextStep: "確認首頁視覺方向"
  },
  {
    project: "電商功能開發",
    client: "FlowMart",
    status: "開發中",
    progress: "60%",
    ownership: "購物車流程、測試案例、部署檢查",
    nextStep: "回報購物車測試結果"
  },
  {
    project: "客戶提案製作",
    client: "Northwind Co.",
    status: "待確認",
    progress: "35%",
    ownership: "提案整理、內容修訂、報價確認",
    nextStep: "等待提案回覆"
  },
  {
    project: "個人作品網站",
    client: "Internal",
    status: "優化中",
    progress: "90%",
    ownership: "作品集內容、部署檢查、視覺優化",
    nextStep: "整理作品集內容"
  }
] as const;

export function ProjectsPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const statusOptions = Array.from(new Set(projectRows.map((item) => item.status)));
  const rowsAfterFilter =
    statusFilter === ALL_FILTER_VALUE
      ? projectRows
      : projectRows.filter((item) => item.status === statusFilter);
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleRows = rowsAfterFilter.filter((item) => {
    if (!normalizedKeyword) {
      return true;
    }

    const searchableText = [
      item.project,
      item.client,
      item.status,
      item.progress,
      item.ownership,
      item.nextStep
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  return (
    <PageMain aria-labelledby="projects-page-title">
      <PageHeader>
        <PageTitle id="projects-page-title">專案管理</PageTitle>
        <PageDescription>集中查看接案專案、合作客戶、進度與交付狀態。</PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="projects-summary-title">
        <DashboardSectionHeader
          titleId="projects-summary-title"
          title="專案總覽"
          description="快速掌握目前專案數量、進行狀態與近期交付節奏。"
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

      <DashboardPanel aria-labelledby="projects-list-title">
        <DashboardSectionHeader
          titleId="projects-list-title"
          title="專案列表"
          description="查看每個專案的客戶、進度、負責項目與下一步。"
          withDivider
        />

        <ToolbarRow>
          <PageSearchInput
            id="projects-search-input"
            label="專案關鍵字搜尋"
            value={keyword}
            placeholder="搜尋專案名稱或客戶..."
            onChange={setKeyword}
          />
          <PageFilterControl
            id="projects-status-filter"
            label="專案狀態篩選"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <AddButton type="button">新增專案</AddButton>
        </ToolbarRow>
        <PageResultCount
          testId="projects-result-count"
          visible={visibleRows.length}
          total={projectRows.length}
          noun="專案"
        />

        {visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => (
              <Row key={item.project}>
                <RowTop>
                  <ProjectName>{item.project}</ProjectName>
                  <StatusBadge data-testid="projects-status-badge">
                    {item.status}
                  </StatusBadge>
                </RowTop>
                <RowMeta>
                  <MetaText>{item.client}</MetaText>
                  <MetaText>{item.progress}</MetaText>
                </RowMeta>
                <RowBody>{item.ownership}</RowBody>
                <NextStep>{item.nextStep}</NextStep>
              </Row>
            ))}
          </Rows>
        ) : (
          <PageListEmptyState
            testId="projects-empty-state"
            title="目前沒有符合條件的專案"
            description="請調整關鍵字或狀態篩選條件，再試一次。"
          />
        )}
      </DashboardPanel>

      <PageNextStep
        titleId="projects-next-step-title"
        title="下一步建議"
        description="確認專案狀態後，建議直接切換到執行與排程頁面。"
        links={[
          { label: "前往任務頁面，安排下一步執行項目", to: "/tasks" },
          { label: "前往行事曆頁面，檢查近期里程碑", to: "/calendar" }
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
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
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

const ProjectName = styled.h3`
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

const RowBody = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.7;
`;

const NextStep = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.86rem;
  font-weight: 700;
`;
