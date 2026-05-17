import styled from "styled-components";
import type { DashboardSummary } from "../../lib/dashboardSummary";

const overviewCards = [
  {
    title: "進行中專案數",
    value: "4",
    description: "對齊專案頁靜態清單。"
  },
  {
    title: "本週截止項目",
    value: "5",
    description: "對齊儀表板截止清單。"
  },
  {
    title: "合作中客戶數",
    value: "4",
    description: "對齊客戶頁靜態清單。"
  },
  {
    title: "目前任務數",
    value: "6",
    description: "對齊任務頁靜態清單。"
  }
] as const;

type OverviewCardsProps = {
  summary: DashboardSummary;
  isSummaryLoading: boolean;
};

function getSummaryCardValue(
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
    return summary.openTasks.toString();
  }

  if (index === 2) {
    return summary.totalClients.toString();
  }

  return summary.totalTasks.toString();
}

export function OverviewCards({ summary, isSummaryLoading }: OverviewCardsProps) {
  return (
    <CardsGrid aria-label="儀表板概覽卡片">
      {overviewCards.map((card, index) => (
        <OverviewCard key={card.title}>
          <CardTitle>{card.title}</CardTitle>
          <CardValue>{getSummaryCardValue(index, summary, isSummaryLoading)}</CardValue>
          <CardDescription>{card.description}</CardDescription>
        </OverviewCard>
      ))}
    </CardsGrid>
  );
}

const CardsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const OverviewCard = styled.article`
  position: relative;
  min-height: 11.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.065), rgb(255 255 255 / 0.018)),
    ${({ theme }) => theme.surfaceElevated};
  box-shadow: 0 22px 55px rgb(0 0 0 / 0.2);

  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: ${({ theme }) => theme.accent};
    opacity: 0.7;
  }
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  font-weight: 700;
`;

const CardValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
`;

const CardDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.6;
`;
