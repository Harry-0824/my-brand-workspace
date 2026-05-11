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
  { label: "本月已收款", value: "$3,200" },
  { label: "待收款", value: "$4,800" },
  { label: "已開立發票", value: "5" },
  { label: "待開立發票", value: "2" }
] as const;

const invoiceRows = [
  {
    client: "Bright Studio",
    item: "品牌官網重設計首期款",
    amount: "$2,400",
    status: "待收款",
    due: "5 月 24 日"
  },
  {
    client: "FlowMart",
    item: "電商功能開發尾款",
    amount: "$2,400",
    status: "待開立發票",
    due: "5 月 28 日"
  },
  {
    client: "Northwind Co.",
    item: "提案製作費",
    amount: "$800",
    status: "已開立發票",
    due: "5 月 18 日"
  },
  {
    client: "Internal",
    item: "作品集優化",
    amount: "$0",
    status: "內部項目",
    due: "本週"
  }
] as const;

export function InvoicesPage() {
  return (
    <PageMain aria-labelledby="invoices-page-title">
      <PageHeader>
        <PageTitle id="invoices-page-title">收款管理</PageTitle>
        <PageDescription>
          集中查看待收款、已開立發票與近期付款追蹤事項。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="invoices-summary-title">
        <DashboardSectionHeader
          titleId="invoices-summary-title"
          title="收款總覽"
          description="快速查看本月收款與待追蹤發票項目。"
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

      <DashboardPanel aria-labelledby="invoices-list-title">
        <DashboardSectionHeader
          titleId="invoices-list-title"
          title="發票與收款項目"
          description="以下為靜態示意資料，後續可延伸為實際收款追蹤流程。"
          withDivider
        />

        <ToolbarRow>
          <SearchPreview>搜尋客戶或項目...</SearchPreview>
          <FilterPreview>全部狀態</FilterPreview>
          <AddButton type="button">新增發票草稿</AddButton>
        </ToolbarRow>

        <Rows>
          {invoiceRows.map((item) => (
            <Row key={`${item.client}-${item.item}`}>
              <RowTop>
                <ClientName>{item.client}</ClientName>
                <StatusBadge>{item.status}</StatusBadge>
              </RowTop>
              <RowMeta>
                <MetaText>{item.item}</MetaText>
                <MetaText>{item.amount}</MetaText>
                <MetaText>{item.due}</MetaText>
              </RowMeta>
            </Row>
          ))}
        </Rows>

        <ReminderText>收款提醒：優先追蹤本週到期與待開立發票的項目。</ReminderText>
      </DashboardPanel>
    </PageMain>
  );
}

const MetricGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
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


