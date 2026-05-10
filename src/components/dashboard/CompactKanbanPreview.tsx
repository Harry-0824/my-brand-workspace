import styled from "styled-components";
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

const ColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Column = styled.section`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ColumnTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

const ColumnCount = styled.span`
  min-width: 1.75rem;
  padding: 0.25rem 0.45rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 999px;
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.035);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
`;

const TaskList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TaskCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgb(255 255 255 / 0.02);
`;

const TaskName = styled.h4`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

const ProjectName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const PriorityBadge = styled.span<{ $priority: Priority }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $priority }) => priorityTone[$priority].border};
  border-radius: 999px;
  color: ${({ $priority }) => priorityTone[$priority].color};
  background: ${({ $priority }) => priorityTone[$priority].background};
  font-size: 0.72rem;
  font-weight: 800;
`;

const DueDate = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  font-weight: 700;
`;
