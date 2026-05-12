import styled from "styled-components";
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
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import { clientRows, summaryMetrics } from "./data/clientsPageData";

export function ClientsPage() {
  return (
    <PageMain aria-labelledby="clients-page-title">
      <PageHeader>
        <PageTitle id="clients-page-title">客戶管理</PageTitle>
        <PageDescription>
          集中管理合作客戶、聯絡狀態、專案數與下一步追蹤事項。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="clients-summary-title">
        <DashboardSectionHeader
          titleId="clients-summary-title"
          title="客戶總覽"
          description="掌握目前客戶合作狀態與本週追蹤重點。"
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

      <DashboardPanel aria-labelledby="clients-list-title">
        <DashboardSectionHeader
          titleId="clients-list-title"
          title="客戶清單"
          description="以下為靜態示意資料，後續可延伸為實際客戶管理流程。"
          withDivider
        />

        <ToolbarRow>
          <SearchPreview>搜尋客戶或公司...</SearchPreview>
          <FilterPreview>全部狀態</FilterPreview>
          <AddButton type="button">新增客戶</AddButton>
        </ToolbarRow>

        <Rows>
          {clientRows.map((item) => (
            <Row key={item.name}>
              <RowTop>
                <ClientName>{item.name}</ClientName>
                <StatusBadge>{item.status}</StatusBadge>
              </RowTop>
              <RowMeta>
                <MetaText>{item.projects}</MetaText>
                <MetaText>{item.lastContact}</MetaText>
                <MetaText>{item.nextStep}</MetaText>
              </RowMeta>
            </Row>
          ))}
        </Rows>

        <ReminderText>
          客戶追蹤提醒：優先處理本週需要回覆或確認的合作對象。
        </ReminderText>
      </DashboardPanel>
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

const ClientName = styled.h3`
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

const ReminderText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
