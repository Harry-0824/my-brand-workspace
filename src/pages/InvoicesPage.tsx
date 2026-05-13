import styled from "styled-components";
import { useState } from "react";
import { ALL_FILTER_VALUE, PageFilterControl } from "../components/page/PageFilterControl";
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
import { invoiceRows, summaryMetrics } from "./data/invoicesPageData";

export function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const statusOptions = Array.from(new Set(invoiceRows.map((item) => item.status)));
  const visibleRows =
    statusFilter === ALL_FILTER_VALUE
      ? invoiceRows
      : invoiceRows.filter((item) => item.status === statusFilter);

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
          <PageFilterControl
            id="invoices-status-filter"
            label="收款狀態篩選"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <AddButton type="button">新增發票草稿</AddButton>
        </ToolbarRow>

        <Rows>
          {visibleRows.map((item) => (
            <Row key={`${item.client}-${item.item}`}>
              <RowTop>
                <ClientName>{item.client}</ClientName>
                <StatusBadge data-testid="invoices-status-badge">
                  {item.status}
                </StatusBadge>
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

      <PageNextStep
        titleId="invoices-next-step-title"
        title="下一步建議"
        description="收款狀態確認後，可直接切到關聯頁面延續工作流程。"
        links={[
          { label: "前往客戶頁面，確認待回覆對象", to: "/clients" },
          { label: "前往報表頁面，快速檢查收款快照", to: "/reports" }
        ]}
        note="建議先處理待收款，再同步更新本週追蹤清單。"
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

const SearchPreview = styled.div`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;
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


