import styled from "styled-components";
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
          <SearchPreview>搜尋任務或專案...</SearchPreview>
          <FilterPreview>全部狀態</FilterPreview>
          <FilterPreview>全部優先級</FilterPreview>
          <AddButton type="button">新增任務</AddButton>
        </ToolbarRow>

        <Rows>
          {taskRows.map((item) => (
            <Row key={`${item.task}-${item.dueDate}`}>
              <RowTop>
                <TaskName>{item.task}</TaskName>
                <StatusBadge>{item.status}</StatusBadge>
              </RowTop>
              <RowMeta>
                <MetaText>{item.project}</MetaText>
                <MetaText>{item.priority}</MetaText>
                <MetaText>{item.dueDate}</MetaText>
              </RowMeta>
            </Row>
          ))}
        </Rows>

        <DistributionText>任務狀態分布：待處理、進行中、待審核、已完成。</DistributionText>
      </DashboardPanel>
    </PageMain>
  );
}

const PageMain = styled.main`
  min-height: 100vh;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.background};
`;

const PageHeader = styled.section`
  padding: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 2.4rem;
  line-height: 1.15;
`;

const PageDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;

const MetricGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetricCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const MetricLabel = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

const MetricValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.15rem;
  font-weight: 800;
`;

const ToolbarRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px 170px 140px;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SearchPreview = styled.div`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;
`;

const FilterPreview = styled.div`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;
  text-align: center;
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
