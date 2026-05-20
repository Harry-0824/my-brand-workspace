import {
  Panel,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  DeadlineCount,
  DeadlineList,
  DeadlineRow,
  DateBlock,
  DateLabel,
  DateText,
  DeadlineDetails,
  DeadlineTitle,
  ProjectName,
  TypeBadge,
  PriorityBadge
} from "./UpcomingDeadlines.styles";

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
