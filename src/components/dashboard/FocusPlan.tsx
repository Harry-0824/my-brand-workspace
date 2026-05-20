import {
  FocusList,
  FocusItem,
  FocusTop,
  Time,
  StatusBadge,
  Title,
  Project,
  Description,
  SuggestionBlock,
  SuggestionText
} from "./FocusPlan.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

const focusItems = [
  {
    time: "09:30 - 11:00",
    title: "完成首頁線框調整",
    project: "品牌官網重設計",
    description: "先完成首屏與 CTA 區塊，方便下午提供客戶確認。",
    status: "進行中"
  },
  {
    time: "11:15 - 12:00",
    title: "檢查購物車測試結果",
    project: "電商功能開發",
    description: "確認流程測試是否還有阻塞，整理給客戶的回報重點。",
    status: "待處理"
  },
  {
    time: "14:00 - 15:30",
    title: "整理提案修改內容",
    project: "客戶提案製作",
    description: "收斂提案版本，確認下一輪回覆需要補充的資料。",
    status: "排程中"
  }
] as const;

type FocusStatus = (typeof focusItems)[number]["status"];

const statusTone = {
  進行中: {
    color: "#a7efc8",
    border: "rgb(92 207 141 / 0.32)",
    background: "rgb(92 207 141 / 0.12)"
  },
  待處理: {
    color: "#f8d98a",
    border: "rgb(246 200 95 / 0.32)",
    background: "rgb(246 200 95 / 0.12)"
  },
  排程中: {
    color: "#b9d6f8",
    border: "rgb(121 179 255 / 0.32)",
    background: "rgb(121 179 255 / 0.12)"
  }
} as const satisfies Record<FocusStatus, { color: string; border: string; background: string }>;

export function FocusPlan() {
  return (
    <DashboardPanel aria-labelledby="focus-plan-title">
      <DashboardSectionHeader
        titleId="focus-plan-title"
        title="今日工作重點"
        description="根據目前專案狀態，整理今天最需要推進的工作順序。"
        withDivider
      />

      <FocusList>
        {focusItems.map((item) => (
          <FocusItem key={`${item.time}-${item.title}`} aria-label={item.title}>
            <FocusTop>
              <Time>{item.time}</Time>
              <StatusBadge $status={item.status}>{item.status}</StatusBadge>
            </FocusTop>
            <Title>{item.title}</Title>
            <Project>{item.project}</Project>
            <Description>{item.description}</Description>
          </FocusItem>
        ))}
      </FocusList>

      <SuggestionBlock>
        <SuggestionText>今日建議：先處理高影響交付，再集中回覆客戶訊息。</SuggestionText>
      </SuggestionBlock>
    </DashboardPanel>
  );
}
