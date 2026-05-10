import styled from "styled-components";

const upcomingDeadlines = [
  {
    item: "首頁視覺確認",
    project: "品牌官網重設計",
    date: "5 月 20 日",
    type: "設計審核",
    priority: "高"
  },
  {
    item: "購物車流程測試",
    project: "電商功能開發",
    date: "5 月 22 日",
    type: "功能測試",
    priority: "高"
  },
  {
    item: "提案內容調整",
    project: "客戶提案製作",
    date: "5 月 23 日",
    type: "文件更新",
    priority: "中"
  },
  {
    item: "部署前檢查",
    project: "個人作品網站",
    date: "5 月 25 日",
    type: "部署準備",
    priority: "中"
  },
  {
    item: "客戶回覆追蹤",
    project: "品牌官網重設計",
    date: "5 月 26 日",
    type: "客戶溝通",
    priority: "低"
  }
] as const;

type Priority = (typeof upcomingDeadlines)[number]["priority"];

const priorityTone = {
  高: {
    color: "#ffb4ad",
    background: "rgb(255 107 107 / 0.1)",
    border: "rgb(255 107 107 / 0.28)"
  },
  中: {
    color: "#f8d98a",
    background: "rgb(246 200 95 / 0.1)",
    border: "rgb(246 200 95 / 0.28)"
  },
  低: {
    color: "#b7c2d0",
    background: "rgb(154 167 183 / 0.1)",
    border: "rgb(154 167 183 / 0.24)"
  }
} as const satisfies Record<Priority, { color: string; background: string; border: string }>;

export function UpcomingDeadlines() {
  return (
    <Panel aria-labelledby="upcoming-deadlines-title">
      <SectionHeader>
        <div>
          <SectionTitle id="upcoming-deadlines-title">即將到期</SectionTitle>
          <SectionDescription>
            未來 7 天內需要完成或確認的重點事項。
          </SectionDescription>
        </div>
        <DeadlineCount>{upcomingDeadlines.length} 個事項</DeadlineCount>
      </SectionHeader>

      <DeadlineList>
        {upcomingDeadlines.map((deadline, index) => {
          const titleId = `deadline-${index}-title`;

          return (
            <DeadlineRow aria-labelledby={titleId} key={deadline.item}>
              <DateBlock>
                <DateLabel>日期</DateLabel>
                <DateText>{deadline.date}</DateText>
              </DateBlock>

              <DeadlineDetails>
                <DeadlineTitle id={titleId}>{deadline.item}</DeadlineTitle>
                <ProjectName>{deadline.project}</ProjectName>
              </DeadlineDetails>

              <TypeBadge>{deadline.type}</TypeBadge>
              <PriorityBadge $priority={deadline.priority}>
                {deadline.priority}
              </PriorityBadge>
            </DeadlineRow>
          );
        })}
      </DeadlineList>
    </Panel>
  );
}

const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.018)),
    ${({ theme }) => theme.surface};
  box-shadow: 0 22px 55px rgb(0 0 0 / 0.18);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.35rem;
  font-weight: 800;
`;

const SectionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

const DeadlineCount = styled.span`
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.035);
  font-size: 0.82rem;
  font-weight: 700;
`;

const DeadlineList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const DeadlineRow = styled.article`
  display: grid;
  grid-template-columns: minmax(7rem, 0.65fr) minmax(14rem, 1.4fr) auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const DateBlock = styled.div`
  min-width: 0;
`;

const DateLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.72rem;
  font-weight: 700;
`;

const DateText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

const DeadlineDetails = styled.div`
  min-width: 0;
`;

const DeadlineTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

const ProjectName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

const TypeBadge = styled.span`
  justify-self: start;
  padding: 0.45rem 0.72rem;
  border: 1px solid rgb(98 214 199 / 0.26);
  border-radius: 999px;
  color: ${({ theme }) => theme.accent};
  background: rgb(98 214 199 / 0.08);
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
`;

const PriorityBadge = styled.span<{ $priority: Priority }>`
  justify-self: end;
  min-width: 2.25rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid ${({ $priority }) => priorityTone[$priority].border};
  border-radius: 999px;
  color: ${({ $priority }) => priorityTone[$priority].color};
  background: ${({ $priority }) => priorityTone[$priority].background};
  font-size: 0.8rem;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
`;
