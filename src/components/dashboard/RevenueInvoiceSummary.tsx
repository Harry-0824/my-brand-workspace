import styled from "styled-components";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

const summaryMetrics = [
  { label: "本月已收款", value: "$3,200" },
  { label: "待收款", value: "$4,800" },
  { label: "已開立發票", value: "5" },
  { label: "待開立發票", value: "2" }
] as const;

const revenueInvoiceItems = [
  {
    client: "Bright Studio",
    item: "品牌官網重設計首期款",
    amount: "$2,400",
    status: "待收款",
    date: "5 月 24 日"
  },
  {
    client: "FlowMart",
    item: "電商功能開發尾款",
    amount: "$2,400",
    status: "待開立發票",
    date: "5 月 28 日"
  },
  {
    client: "Northwind Co.",
    item: "提案製作費",
    amount: "$800",
    status: "已開立發票",
    date: "5 月 18 日"
  },
  {
    client: "Internal",
    item: "作品集優化",
    amount: "$0",
    status: "內部項目",
    date: "本週"
  }
] as const;

type RevenueStatus = (typeof revenueInvoiceItems)[number]["status"];

const statusTone = {
  待收款: {
    color: "#f8d98a",
    border: "rgb(246 200 95 / 0.32)",
    background: "rgb(246 200 95 / 0.12)"
  },
  待開立發票: {
    color: "#ffb4ad",
    border: "rgb(255 107 107 / 0.32)",
    background: "rgb(255 107 107 / 0.12)"
  },
  已開立發票: {
    color: "#a7efc8",
    border: "rgb(92 207 141 / 0.32)",
    background: "rgb(92 207 141 / 0.12)"
  },
  內部項目: {
    color: "#b9d6f8",
    border: "rgb(121 179 255 / 0.32)",
    background: "rgb(121 179 255 / 0.12)"
  }
} as const satisfies Record<RevenueStatus, { color: string; border: string; background: string }>;

export function RevenueInvoiceSummary() {
  return (
    <DashboardPanel aria-labelledby="revenue-invoice-summary-title">
      <DashboardSectionHeader
        titleId="revenue-invoice-summary-title"
        title="收款概覽"
        description="掌握本月收入、待收款與發票處理狀態。"
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

      <Rows>
        {revenueInvoiceItems.map((item) => (
          <Row key={`${item.client}-${item.item}`} aria-label={item.item}>
            <RowTop>
              <Client>{item.client}</Client>
              <StatusBadge $status={item.status}>{item.status}</StatusBadge>
            </RowTop>
            <Item>{item.item}</Item>
            <RowBottom>
              <Amount>{item.amount}</Amount>
              <DateText>{item.date}</DateText>
            </RowBottom>
          </Row>
        ))}
      </Rows>
    </DashboardPanel>
  );
}

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const MetricCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const MetricLabel = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.8rem;
  font-weight: 700;
`;

const MetricValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 800;
`;

const Rows = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
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

const Client = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

const StatusBadge = styled.span<{ $status: RevenueStatus }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $status }) => statusTone[$status].border};
  border-radius: 999px;
  color: ${({ $status }) => statusTone[$status].color};
  background: ${({ $status }) => statusTone[$status].background};
  font-size: 0.72rem;
  font-weight: 800;
`;

const Item = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

const RowBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Amount = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

const DateText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;
