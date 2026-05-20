import {
  StateGrid,
  StateCard,
  StateHeader,
  StateBadge,
  StateTitle,
  StateDescription,
  PlaceholderBlock,
} from "./DashboardStatePreviews.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

type DashboardStatePreviewsProps = {
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
};

type StateCardConfig = {
  status: string;
  title: string;
  description: string;
  type: "loading" | "empty" | "error" | "ready";
};

export function DashboardStatePreviews({
  isLoading,
  hasError,
  isEmpty,
}: DashboardStatePreviewsProps) {
  let card: StateCardConfig;

  if (isLoading) {
    card = {
      status: "載入中",
      title: "正在同步工作資料",
      description: "請稍候，系統正在整理最新的專案、任務與客戶資訊。",
      type: "loading",
    };
  } else if (hasError) {
    card = {
      status: "發生錯誤",
      title: "資料暫時無法載入",
      description: "請稍後再試，或確認網路連線與服務狀態。",
      type: "error",
    };
  } else if (isEmpty) {
    card = {
      status: "空資料",
      title: "工作區尚無資料",
      description: "當你新增專案、任務或客戶後，相關資訊會顯示在各儀表板區塊。",
      type: "empty",
    };
  } else {
    card = {
      status: "資料已就緒",
      title: "工作資料已成功載入",
      description: "所有儀表板區塊已反映最新的專案、任務、客戶與收款資訊。",
      type: "ready",
    };
  }

  return (
    <DashboardPanel aria-labelledby="dashboard-state-previews-title">
      <DashboardSectionHeader
        titleId="dashboard-state-previews-title"
        title="狀態"
        description="儀表板資料載入狀態。"
        withDivider
      />

      <StateGrid>
        <StateCard $type={card.type}>
          <StateHeader>
            <StateBadge $type={card.type}>{card.status}</StateBadge>
          </StateHeader>
          <StateTitle>{card.title}</StateTitle>
          <StateDescription>{card.description}</StateDescription>
          <PlaceholderBlock $type={card.type} aria-hidden="true" />
        </StateCard>
      </StateGrid>
    </DashboardPanel>
  );
}
