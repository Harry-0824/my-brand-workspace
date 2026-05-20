import {
  SectionHeader,
  SectionTitle,
  SectionDescription,
  ColumnsGrid,
  Column,
  ColumnHeader,
  ColumnTitle,
  ColumnCount,
  TaskList,
  TaskCard,
  TaskName,
  ProjectName,
  TaskMeta,
  PriorityBadge,
  DueDate
} from "./CompactKanbanPreview.styles";
import { DashboardPanel } from "./shared/DashboardPanel";

const kanbanColumns = [
  {
    title: "待辦",
    tasks: [
      {
        task: "整理客戶需求",
        project: "品牌官網重設計",
        priority: "高",
        dueDate: "5 月 20 日"
      },
      {
        task: "建立測試清單",
        project: "電商功能開發",
        priority: "中",
        dueDate: "5 月 22 日"
      }
    ]
  },
  {
    title: "進行中",
    tasks: [
      {
        task: "完成首頁線框",
        project: "品牌官網重設計",
        priority: "高",
        dueDate: "5 月 24 日"
      },
      {
        task: "更新提案內容",
        project: "客戶提案製作",
        priority: "中",
        dueDate: "5 月 23 日"
      }
    ]
  },
  {
    title: "待審核",
    tasks: [
      {
        task: "準備部署檢查",
        project: "個人作品網站",
        priority: "中",
        dueDate: "5 月 25 日"
      }
    ]
  },
  {
    title: "已完成",
    tasks: [
      {
        task: "確認資訊架構",
        project: "品牌官網重設計",
        priority: "低",
        dueDate: "5 月 18 日"
      }
    ]
  }
] as const;

type Priority = (typeof kanbanColumns)[number]["tasks"][number]["priority"];

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

export function CompactKanbanPreview() {
  return (
    <DashboardPanel aria-labelledby="compact-kanban-title">
      <SectionHeader>
        <div>
          <SectionTitle id="compact-kanban-title">任務看板</SectionTitle>
          <SectionDescription>快速查看目前任務在各流程階段的分布。</SectionDescription>
        </div>
      </SectionHeader>

      <ColumnsGrid>
        {kanbanColumns.map((column) => (
          <Column key={column.title}>
            <ColumnHeader>
              <ColumnTitle>{column.title}</ColumnTitle>
              <ColumnCount>{column.tasks.length}</ColumnCount>
            </ColumnHeader>

            <TaskList>
              {column.tasks.map((task) => (
                <TaskCard key={`${column.title}-${task.task}`}>
                  <TaskName>{task.task}</TaskName>
                  <ProjectName>{task.project}</ProjectName>
                  <TaskMeta>
                    <PriorityBadge $priority={task.priority}>{task.priority}</PriorityBadge>
                    <DueDate>{task.dueDate}</DueDate>
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </Column>
        ))}
      </ColumnsGrid>
    </DashboardPanel>
  );
}
