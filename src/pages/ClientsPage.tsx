import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import { useState } from "react";
import { PageListEmptyState } from "../components/page/PageListEmptyState";
import { PageResultCount } from "../components/page/PageResultCount";
import { PageResetControl } from "../components/page/PageResetControl";
import { PageListSummaryRow } from "../components/page/PageListSummaryRow";
import { PageSearchInput } from "../components/page/PageSearchInput";
import {
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue
} from "../components/page/PageContentPrimitives";
import { PageNextStep } from "../components/page/PageNextStep";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import { clientRows, summaryMetrics } from "./data/clientsPageData";

export function ClientsPage() {
  const [keyword, setKeyword] = useState("");
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleRows = clientRows.filter((item) => {
    if (!normalizedKeyword) {
      return true;
    }

    const searchableText = [
      item.name,
      item.status,
      item.projects,
      item.lastContact,
      item.nextStep
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });
  const hasActiveCriteria = keyword.trim().length > 0;

  function handleReset() {
    setKeyword("");
  }

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
          <PageSearchInput
            id="clients-search-input"
            label="客戶關鍵字搜尋"
            value={keyword}
            placeholder="搜尋客戶、狀態或追蹤內容..."
            onChange={setKeyword}
          />
          <FilterPreview>全部狀態</FilterPreview>
          <AddButton type="button">新增客戶（示意）</AddButton>
        </ToolbarRow>
        <PageListSummaryRow>
          <PageResultCount
            testId="clients-result-count"
            visible={visibleRows.length}
            total={clientRows.length}
            noun="客戶"
          />
          <PageResetControl
            testId="clients-reset-control"
            disabled={!hasActiveCriteria}
            onClick={handleReset}
          />
        </PageListSummaryRow>

        {visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => (
              <Row key={item.name}>
                <RowTop>
                  <ClientName>{item.name}</ClientName>
                  <StatusBadge data-testid="clients-status-badge">
                    {item.status}
                  </StatusBadge>
                </RowTop>
                <RowMeta>
                  <MetaText>{item.projects}</MetaText>
                  <MetaText>{item.lastContact}</MetaText>
                  <MetaText>{item.nextStep}</MetaText>
                </RowMeta>
              </Row>
            ))}
          </Rows>
        ) : (
          <PageListEmptyState
            testId="clients-empty-state"
            title="目前沒有符合條件的客戶"
            description="請調整關鍵字後再試一次。"
          />
        )}

        <ReminderText>
          客戶追蹤提醒：優先處理本週需要回覆或確認的合作對象。
        </ReminderText>
      </DashboardPanel>

      <PageNextStep
        titleId="clients-next-step-title"
        title="下一步建議"
        description="看完客戶狀態後，建議直接前往相關工作頁面。"
        links={[
          { label: "前往專案頁面，確認合作項目進度", to: "/projects" },
          { label: "前往收款頁面，檢查待收款與發票", to: "/invoices" }
        ]}
        note="維持每週一次客戶追蹤節奏，可降低交付與溝通落差。"
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

const FilterPreview = styled.div`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) minmax(8rem, 1fr) minmax(12rem, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetaText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  font-weight: 700;

  &:nth-child(2) {
    text-align: center;
  }

  &:nth-child(3) {
    text-align: right;
  }
`;

const ReminderText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
