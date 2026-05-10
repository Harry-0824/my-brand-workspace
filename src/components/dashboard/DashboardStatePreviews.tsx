import styled from "styled-components";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

const stateCards = [
  {
    status: "載入中",
    title: "正在同步工作資料",
    description: "請稍候，系統正在整理最新的專案、任務與客戶資訊。",
    type: "loading"
  },
  {
    status: "空資料",
    title: "目前沒有待處理項目",
    description: "當你新增專案、任務或客戶後，相關資訊會顯示在這裡。",
    type: "empty"
  },
  {
    status: "發生錯誤",
    title: "資料暫時無法載入",
    description: "請稍後再試，或確認網路連線與服務狀態。",
    type: "error"
  }
] as const;

type StateType = (typeof stateCards)[number]["type"];

const cardTone = {
  loading: {
    border: "rgb(255 255 255 / 0.08)",
    badgeColor: "#b9d6f8",
    badgeBorder: "rgb(121 179 255 / 0.32)",
    badgeBg: "rgb(121 179 255 / 0.12)"
  },
  empty: {
    border: "rgb(255 255 255 / 0.08)",
    badgeColor: "#b7c2d0",
    badgeBorder: "rgb(154 167 183 / 0.28)",
    badgeBg: "rgb(154 167 183 / 0.1)"
  },
  error: {
    border: "rgb(255 107 107 / 0.2)",
    badgeColor: "#ffb4ad",
    badgeBorder: "rgb(255 107 107 / 0.3)",
    badgeBg: "rgb(255 107 107 / 0.12)"
  }
} as const;

export function DashboardStatePreviews() {
  return (
    <DashboardPanel aria-labelledby="dashboard-state-previews-title">
      <DashboardSectionHeader
        titleId="dashboard-state-previews-title"
        title="狀態預覽"
        description="定義未來資料載入、空資料與錯誤情境的介面樣式。"
        withDivider
      />

      <StateGrid>
        {stateCards.map((card) => (
          <StateCard key={card.status} $type={card.type}>
            <StateHeader>
              <StateBadge $type={card.type}>{card.status}</StateBadge>
            </StateHeader>
            <StateTitle>{card.title}</StateTitle>
            <StateDescription>{card.description}</StateDescription>
            <PlaceholderBlock $type={card.type} aria-hidden="true" />
          </StateCard>
        ))}
      </StateGrid>
    </DashboardPanel>
  );
}

const StateGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StateCard = styled.article<{ $type: StateType }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ $type }) => cardTone[$type].border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const StateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const StateBadge = styled.span<{ $type: StateType }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $type }) => cardTone[$type].badgeBorder};
  border-radius: 999px;
  color: ${({ $type }) => cardTone[$type].badgeColor};
  background: ${({ $type }) => cardTone[$type].badgeBg};
  font-size: 0.72rem;
  font-weight: 800;
`;

const StateTitle = styled.h3`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

const StateDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.7;
`;

const PlaceholderBlock = styled.div<{ $type: StateType }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  height: 2.2rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $type }) =>
    $type === "loading" ? "linear-gradient(90deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02))" : "rgb(255 255 255 / 0.03)"};
  border: 1px solid rgb(255 255 255 / 0.07);
`;
