import styled from "styled-components";
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

const ClientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ClientRow = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const ClientTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ClientName = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

const StatusBadge = styled.span<{ $status: ClientStatus }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $status }) => statusTone[$status].border};
  border-radius: 999px;
  color: ${({ $status }) => statusTone[$status].color};
  background: ${({ $status }) => statusTone[$status].background};
  font-size: 0.72rem;
  font-weight: 800;
`;

const ClientMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const MetaItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MetaLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.78rem;
  font-weight: 700;
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.88rem;
  font-weight: 700;
`;

const NextStepText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.7;
`;
