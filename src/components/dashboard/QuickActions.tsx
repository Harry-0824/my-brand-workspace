import styled from "styled-components";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

const quickActions = [
  {
    title: "新增任務",
    description: "記錄新的待辦、交付項目或追蹤事項。",
    status: "常用"
  },
  {
    title: "新增專案",
    description: "建立新的客戶專案與初始工作清單。",
    status: "規劃"
  },
  {
    title: "記錄客戶回覆",
    description: "整理客戶訊息、回饋與下一步確認事項。",
    status: "追蹤"
  },
  {
    title: "建立發票草稿",
    description: "準備待收款項目的發票與付款備註。",
    status: "財務"
  },
  {
    title: "更新今日重點",
    description: "調整今日工作順序與專注項目。",
    status: "排程"
  }
] as const;

type ActionStatus = (typeof quickActions)[number]["status"];

const statusTone = {
  常用: {
    color: "#a7efc8",
    border: "rgb(92 207 141 / 0.32)",
    background: "rgb(92 207 141 / 0.12)"
  },
  規劃: {
    color: "#b9d6f8",
    border: "rgb(121 179 255 / 0.32)",
    background: "rgb(121 179 255 / 0.12)"
  },
  追蹤: {
    color: "#f8d98a",
    border: "rgb(246 200 95 / 0.32)",
    background: "rgb(246 200 95 / 0.12)"
  },
  財務: {
    color: "#d7c9ff",
    border: "rgb(172 138 255 / 0.32)",
    background: "rgb(172 138 255 / 0.12)"
  },
  排程: {
    color: "#b7c2d0",
    border: "rgb(154 167 183 / 0.28)",
    background: "rgb(154 167 183 / 0.1)"
  }
} as const;

export function QuickActions() {
  return (
    <DashboardPanel aria-labelledby="quick-actions-title">
      <DashboardSectionHeader
        titleId="quick-actions-title"
        title="快速操作"
        description="常用接案流程入口，方便快速建立或追蹤工作事項。"
        withDivider
      />

      <ActionsGrid>
        {quickActions.map((item) => (
          <ActionCard key={item.title} type="button">
            <ActionTop>
              <ActionTitle>{item.title}</ActionTitle>
              <StatusBadge $status={item.status}>{item.status}</StatusBadge>
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

const ActionCard = styled.button`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  cursor: default;
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

const StatusBadge = styled.span<{ $status: ActionStatus }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $status }) => statusTone[$status].border};
  border-radius: 999px;
  color: ${({ $status }) => statusTone[$status].color};
  background: ${({ $status }) => statusTone[$status].background};
  font-size: 0.72rem;
  font-weight: 800;
`;

const ActionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.7;
`;
