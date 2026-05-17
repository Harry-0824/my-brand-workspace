import styled from "styled-components";
import type { DashboardSummary } from "../../lib/dashboardSummary";
import { dashboardWeekFocus, dashboardWorkspaceSnapshot } from "./dashboardData";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

type DashboardMvpOverviewProps = {
  summary: DashboardSummary;
  isSummaryLoading: boolean;
};

function formatIncome(amount: number) {
  return `NT$${amount.toLocaleString("zh-TW", { maximumFractionDigits: 0 })}`;
}

function getSnapshotValue(
  index: number,
  summary: DashboardSummary,
  isSummaryLoading: boolean
) {
  if (isSummaryLoading) {
    return "--";
  }

  if (index === 0) {
    return summary.totalProjects.toString();
  }
  if (index === 1) {
    return summary.totalTasks.toString();
  }
  if (index === 2) {
    return summary.totalClients.toString();
  }
  if (index === 3) {
    return formatIncome(summary.totalIncomeAmount);
  }
  if (index === 4) {
    return formatIncome(summary.paidIncomeAmount);
  }
  return formatIncome(summary.pendingOrOverdueIncomeAmount);
}

export function DashboardMvpOverview({
  summary,
  isSummaryLoading
}: DashboardMvpOverviewProps) {
  return (
    <DashboardPanel aria-labelledby="dashboard-mvp-overview-title">
      <DashboardSectionHeader
        titleId="dashboard-mvp-overview-title"
        title="工作區快照"
        description="以靜態 MVP 方式快速掌握目前工作區狀態。"
        withDivider
      />

      <SnapshotGrid>
        {dashboardWorkspaceSnapshot.map((item, index) => (
          <SnapshotCard key={item.label}>
            <SnapshotLabel>{item.label}</SnapshotLabel>
            <SnapshotValue>{getSnapshotValue(index, summary, isSummaryLoading)}</SnapshotValue>
            <SnapshotNote>{item.note}</SnapshotNote>
          </SnapshotCard>
        ))}
      </SnapshotGrid>

      <FocusSection aria-labelledby="dashboard-week-focus-title">
        <FocusTitle id="dashboard-week-focus-title">今天 / 本週焦點</FocusTitle>
        <FocusList>
          {dashboardWeekFocus.map((item) => (
            <FocusItem key={item}>{item}</FocusItem>
          ))}
        </FocusList>
      </FocusSection>
    </DashboardPanel>
  );
}

const SnapshotGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const SnapshotCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const SnapshotLabel = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  font-weight: 700;
`;

const SnapshotValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.35rem;
  font-weight: 800;
`;

const SnapshotNote = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  line-height: 1.6;
`;

const FocusSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(255 255 255 / 0.025);
`;

const FocusTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

const FocusList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-left: 1rem;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FocusItem = styled.li`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.65;
`;
