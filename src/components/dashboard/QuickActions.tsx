import { Link } from "react-router-dom";
import styled from "styled-components";
import { dashboardQuickActions } from "./dashboardData";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

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

const ActionsGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionCard = styled(Link)`
  display: block;
  width: 100%;
  text-align: left;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const ActionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(98 214 199 / 0.32);
  border-radius: 999px;
  color: ${({ theme }) => theme.accent};
  background: rgb(98 214 199 / 0.12);
  font-size: 0.72rem;
  font-weight: 800;
`;

const ActionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.7;
`;
