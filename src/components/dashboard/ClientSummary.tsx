import {
  ClientGrid,
  ClientRow,
  ClientTop,
  ClientName,
  StatusBadge,
  ClientMeta,
  MetaItem,
  MetaLabel,
  MetaValue,
  NextStepText
} from "./ClientSummary.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";

const clientSummaryItems = [
  {
    client: "Bright Studio",
    status: "合作中",
    projectCount: "2",
    lastContact: "今天",
    nextStep: "確認首頁視覺方向"
  },
  {
    client: "FlowMart",
    status: "開發中",
    projectCount: "1",
    lastContact: "昨天",
    nextStep: "回報購物車測試結果"
  },
  {
    client: "Northwind Co.",
    status: "待確認",
    projectCount: "1",
    lastContact: "5 月 18 日",
    nextStep: "等待提案回覆"
  },
  {
    client: "Internal",
    status: "內部優化",
    projectCount: "1",
    lastContact: "本週",
    nextStep: "整理作品集內容"
  }
] as const;

type ClientStatus = (typeof clientSummaryItems)[number]["status"];

const statusTone = {
  合作中: {
    color: "#a7efc8",
    border: "rgb(92 207 141 / 0.32)",
    background: "rgb(92 207 141 / 0.12)"
  },
  開發中: {
    color: "#f8d98a",
    border: "rgb(246 200 95 / 0.32)",
    background: "rgb(246 200 95 / 0.12)"
  },
  待確認: {
    color: "#ffb4ad",
    border: "rgb(255 107 107 / 0.32)",
    background: "rgb(255 107 107 / 0.12)"
  },
  內部優化: {
    color: "#b9d6f8",
    border: "rgb(121 179 255 / 0.32)",
    background: "rgb(121 179 255 / 0.12)"
  }
} as const satisfies Record<ClientStatus, { color: string; border: string; background: string }>;

export function ClientSummary() {
  return (
    <DashboardPanel aria-labelledby="client-summary-title">
      <DashboardSectionHeader
        titleId="client-summary-title"
        title="客戶概覽"
        description="快速查看目前合作客戶、專案數與追蹤狀態。"
        withDivider
      />

      <ClientGrid>
        {clientSummaryItems.map((item) => (
          <ClientRow key={item.client} aria-label={item.client}>
            <ClientTop>
              <ClientName>{item.client}</ClientName>
              <StatusBadge $status={item.status}>{item.status}</StatusBadge>
            </ClientTop>

            <ClientMeta>
              <MetaItem>
                <MetaLabel>專案數</MetaLabel>
                <MetaValue>{item.projectCount}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>最近聯絡</MetaLabel>
                <MetaValue>{item.lastContact}</MetaValue>
              </MetaItem>
            </ClientMeta>

            <NextStepText>{item.nextStep}</NextStepText>
          </ClientRow>
        ))}
      </ClientGrid>
    </DashboardPanel>
  );
}
