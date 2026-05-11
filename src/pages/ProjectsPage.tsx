import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
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
          <SearchPreview>搜尋專案或客戶...</SearchPreview>
          <FilterPreview>全部狀態</FilterPreview>
          <AddButton type="button">新增專案</AddButton>
        </ToolbarRow>

        <Rows>
          {projectRows.map((item) => (
            <Row key={item.project}>
              <RowTop>
                <ProjectName>{item.project}</ProjectName>
                <StatusBadge>{item.status}</StatusBadge>
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
      </DashboardPanel>
    </PageMain>
  );
}

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
  grid-template-columns: minmax(0, 1fr) 180px 160px;
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
