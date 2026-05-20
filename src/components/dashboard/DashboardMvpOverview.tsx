import {
  SnapshotGrid,
  SnapshotCard,
  SnapshotLabel,
  SnapshotValue,
  SnapshotNote,
  FocusSection,
  FocusTitle,
  FocusList,
  FocusItem
} from "./DashboardMvpOverview.styles";
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
    return summary.activeProjects.toString();
  }
  if (index === 2) {
    return summary.totalTasks.toString();
  }
  if (index === 3) {
    return summary.openTasks.toString();
  }
  if (index === 4) {
    return summary.totalClients.toString();
  }
  return formatIncome(summary.totalIncomeAmount);
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
        description="以 Supabase 真實資料快速掌握目前工作區狀態。"
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
