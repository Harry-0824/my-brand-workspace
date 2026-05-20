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
  ErrorValue,
} from "./ClientSummary.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";
import { ClientRecord } from "../../lib/clients";

type ClientStatusDisplay = "合作中" | "未往來" | "潛在客戶" | "已封存";

function mapClientStatus(status: ClientRecord["status"]): ClientStatusDisplay {
  switch (status) {
    case "active":
      return "合作中";
    case "inactive":
      return "未往來";
    case "lead":
      return "潛在客戶";
    case "archived":
      return "已封存";
  }
}

function formatCreatedAt(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

type ClientSummaryProps = {
  clients: ClientRecord[];
  isLoading: boolean;
  error: string | null;
};

export function ClientSummary({
  clients,
  isLoading,
  error,
}: ClientSummaryProps) {
  return (
    <DashboardPanel aria-labelledby="client-summary-title">
      <DashboardSectionHeader
        titleId="client-summary-title"
        title="客戶概覽"
        description="快速查看目前合作客戶與狀態。"
        withDivider
      />

      {isLoading ? (
        <MetaValue>載入中…</MetaValue>
      ) : error ? (
        <ErrorValue>{error}</ErrorValue>
      ) : clients.length === 0 ? (
        <MetaValue>目前沒有客戶資料。</MetaValue>
      ) : (
        <ClientGrid>
          {clients.map((client) => {
            const statusDisplay = mapClientStatus(client.status);
            return (
              <ClientRow key={client.id} aria-label={client.name}>
                <ClientTop>
                  <ClientName>{client.name}</ClientName>
                  <StatusBadge $status={statusDisplay}>
                    {statusDisplay}
                  </StatusBadge>
                </ClientTop>
                <ClientMeta>
                  {client.company ? (
                    <MetaItem>
                      <MetaLabel>公司</MetaLabel>
                      <MetaValue>{client.company}</MetaValue>
                    </MetaItem>
                  ) : null}
                  <MetaItem>
                    <MetaLabel>建立於</MetaLabel>
                    <MetaValue>{formatCreatedAt(client.created_at)}</MetaValue>
                  </MetaItem>
                </ClientMeta>
              </ClientRow>
            );
          })}
        </ClientGrid>
      )}
    </DashboardPanel>
  );
}
