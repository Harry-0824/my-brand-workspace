import {
  MetricGrid,
  MetricCard,
  MetricLabel,
  ErrorMetricLabel,
  MetricValue,
  Rows,
  Row,
  RowTop,
  Client,
  StatusBadge,
  Item,
  RowBottom,
  Amount,
  DateText,
} from "./RevenueInvoiceSummary.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";
import { IncomeRecord } from "../../lib/incomeRecords";
import { ClientRecord } from "../../lib/clients";

const STATUS_DISPLAY: Record<IncomeRecord["status"], string> = {
  paid: "已收款",
  pending: "待收款",
  overdue: "逾期",
  cancelled: "已取消",
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

type RevenueInvoiceSummaryProps = {
  incomeRecords: IncomeRecord[];
  clients: ClientRecord[];
  isLoading: boolean;
  error: string | null;
};

export function RevenueInvoiceSummary({
  incomeRecords,
  clients,
  isLoading,
  error,
}: RevenueInvoiceSummaryProps) {
  const paidTotal = incomeRecords
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingTotal = incomeRecords
    .filter((r) => r.status === "pending" || r.status === "overdue")
    .reduce((sum, r) => sum + r.amount, 0);
  const activeCount = incomeRecords.filter(
    (r) => r.status === "paid" || r.status === "pending"
  ).length;
  const overdueCount = incomeRecords.filter((r) => r.status === "overdue").length;

  const recentRecords = [...incomeRecords]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const metrics = [
    { label: "已收款", value: `NT$ ${paidTotal.toLocaleString()}` },
    { label: "待收款", value: `NT$ ${pendingTotal.toLocaleString()}` },
    { label: "收款筆數", value: String(activeCount) },
    { label: "逾期筆數", value: String(overdueCount) },
  ];

  return (
    <DashboardPanel aria-labelledby="revenue-invoice-summary-title">
      <DashboardSectionHeader
        titleId="revenue-invoice-summary-title"
        title="收款概覽"
        description="掌握目前收入、待收款與逾期狀態。"
        withDivider
      />

      {isLoading ? (
        <MetricLabel>載入中…</MetricLabel>
      ) : error ? (
        <ErrorMetricLabel>{error}</ErrorMetricLabel>
      ) : (
        <>
          <MetricGrid>
            {metrics.map((metric) => (
              <MetricCard key={metric.label}>
                <MetricLabel>{metric.label}</MetricLabel>
                <MetricValue>{metric.value}</MetricValue>
              </MetricCard>
            ))}
          </MetricGrid>

          {recentRecords.length === 0 ? (
            <MetricLabel>目前沒有收款紀錄。</MetricLabel>
          ) : (
            <Rows>
              {recentRecords.map((record) => {
                const clientName =
                  clients.find((c) => c.id === record.client_id)?.name ?? "—";
                const statusDisplay = STATUS_DISPLAY[record.status];
                return (
                  <Row key={record.id} aria-label={record.title}>
                    <RowTop>
                      <Client>{clientName}</Client>
                      <StatusBadge $status={statusDisplay}>
                        {statusDisplay}
                      </StatusBadge>
                    </RowTop>
                    <Item>{record.title}</Item>
                    <RowBottom>
                      <Amount>NT$ {record.amount.toLocaleString()}</Amount>
                      <DateText>{formatDate(record.due_date)}</DateText>
                    </RowBottom>
                  </Row>
                );
              })}
            </Rows>
          )}
        </>
      )}
    </DashboardPanel>
  );
}
