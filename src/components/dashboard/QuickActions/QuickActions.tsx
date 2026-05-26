import {
  ActionsGrid,
  ActionCard,
  ActionTop,
  ActionTitle,
  Tag,
  ActionDescription
} from "./QuickActions.styles";
import { dashboardQuickActions } from "../dashboardData";
import { DashboardPanel } from "../shared/DashboardPanel";
import { DashboardSectionHeader } from "../shared/DashboardSectionHeader";

export function QuickActions() {
  return (
    <DashboardPanel aria-labelledby="quick-actions-title">
      <DashboardSectionHeader
        titleId="quick-actions-title"
        title="快速捷徑"
        description="直接前往核心工作頁面，快速完成日常追蹤與更新。"
        withDivider
      />

      <ActionsGrid>
        {dashboardQuickActions.map((item) => (
          <ActionCard
            key={item.to}
            to={item.to}
            aria-label={`quick-action-${item.to}`}
          >
            <ActionTop>
              <ActionTitle>{item.title}</ActionTitle>
              <Tag>{item.tag}</Tag>
            </ActionTop>
            <ActionDescription>{item.description}</ActionDescription>
          </ActionCard>
        ))}
      </ActionsGrid>
    </DashboardPanel>
  );
}
