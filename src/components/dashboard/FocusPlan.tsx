import styled from "styled-components";
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

const FocusList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FocusItem = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const FocusTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Time = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

const StatusBadge = styled.span<{ $status: FocusStatus }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $status }) => statusTone[$status].border};
  border-radius: 999px;
  color: ${({ $status }) => statusTone[$status].color};
  background: ${({ $status }) => statusTone[$status].background};
  font-size: 0.72rem;
  font-weight: 800;
`;

const Title = styled.h3`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

const Project = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  font-weight: 700;
`;

const Description = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.7;
`;

const SuggestionBlock = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(255 255 255 / 0.025);
`;

const SuggestionText = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
