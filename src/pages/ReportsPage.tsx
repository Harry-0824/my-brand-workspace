import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import {
  PageList,
  PageListCard,
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue,
  PageNote
} from "../components/page/PageContentPrimitives";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";

const summaryMetrics = [
  { label: "本月營收（示意）", value: "$128,000" },
  { label: "進行中專案", value: "5" },
  { label: "本週完成任務", value: "18" },
  { label: "待收款項目", value: "3" }
] as const;

const projectStatusOverview = [
  { status: "進行中", count: "3", note: "主要為網站改版與內容調整" },
  { status: "等待回饋", count: "1", note: "客戶回覆中，待確認下一步" },
  { status: "已交付", count: "1", note: "已完成初版並提交驗收" }
] as const;

const taskPerformance = [
  { label: "任務完成率（示意）", value: "78%" },
  { label: "本週完成數", value: "18" },
  { label: "逾期項目（示意）", value: "2" }
] as const;

const revenueSnapshot = [
  { label: "已收款", value: "$92,000" },
  { label: "待收款", value: "$26,000" },
  { label: "逾期收款", value: "$10,000" }
] as const;

export function ReportsPage() {
  return (
    <PageMain aria-labelledby="reports-page-title">
      <PageHeader>
        <PageTitle id="reports-page-title">報表</PageTitle>
        <PageDescription>
          檢視專案、任務與收款狀態的靜態分析頁面殼層。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="reports-summary-title">
        <DashboardSectionHeader
          titleId="reports-summary-title"
          title="摘要指標"
          description="以下為報表摘要的靜態示意數據。"
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

      <DashboardPanel aria-labelledby="reports-project-status-title">
        <DashboardSectionHeader
          titleId="reports-project-status-title"
          title="專案狀態總覽"
          description="快速查看目前專案分布與進度狀態。"
          withDivider
        />
        <List>
          {projectStatusOverview.map((item) => (
            <ListRow key={item.status}>
              <RowHeader>
                <StatusTitle>{item.status}</StatusTitle>
                <StatusCount>{item.count}</StatusCount>
              </RowHeader>
              <RowNote>{item.note}</RowNote>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-task-performance-title">
        <DashboardSectionHeader
          titleId="reports-task-performance-title"
          title="任務表現"
          description="顯示任務完成狀態的靜態示意摘要。"
          withDivider
        />
        <TripletGrid>
          {taskPerformance.map((item) => (
            <TripletCard key={item.label}>
              <MetricLabel>{item.label}</MetricLabel>
              <MetricValue>{item.value}</MetricValue>
            </TripletCard>
          ))}
        </TripletGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-revenue-title">
        <DashboardSectionHeader
          titleId="reports-revenue-title"
          title="收款快照"
          description="收款狀態僅為靜態佔位，未接入實際計算。"
          withDivider
        />
        <TripletGrid>
          {revenueSnapshot.map((item) => (
            <TripletCard key={item.label}>
              <MetricLabel>{item.label}</MetricLabel>
              <MetricValue>{item.value}</MetricValue>
            </TripletCard>
          ))}
        </TripletGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="reports-insight-title">
        <DashboardSectionHeader
          titleId="reports-insight-title"
          title="本週洞察"
          description="每週回顧建議（靜態文案示意）。"
          withDivider
        />
        <InsightText>
          建議優先處理待收款與逾期項目，同時集中追蹤等待回饋的專案，避免影響下週交付節奏。
        </InsightText>
      </DashboardPanel>
    </PageMain>
  );
}

const MetricGrid = PageMetricGrid;
const MetricCard = PageMetricCard;
const MetricLabel = PageMetricLabel;
const MetricValue = PageMetricValue;
const List = PageList;
const ListRow = PageListCard;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatusTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

const StatusCount = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

const RowNote = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.65;
`;

const TripletGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const TripletCard = PageMetricCard;

const InsightText = PageNote;
