import {
  CardsGrid,
  OverviewCard,
  CardTitle,
  CardValue,
  CardDescription
} from "./OverviewCards.styles";
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
