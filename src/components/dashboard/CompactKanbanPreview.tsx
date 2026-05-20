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
  DueDate,
  StateText,
  ErrorText,
} from "./CompactKanbanPreview.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { type TaskRecord } from "../../lib/tasks";

type KanbanPriority = "高" | "中" | "低";

const KANBAN_COLUMNS: { status: TaskRecord["status"]; label: string }[] = [
  { status: "todo", label: "待辦" },
  { status: "in_progress", label: "進行中" },
  { status: "done", label: "已完成" },
  { status: "cancelled", label: "已取消" },
];

function mapPriority(priority: TaskRecord["priority"]): KanbanPriority {
  if (priority === "high" || priority === "urgent") return "高";
  if (priority === "medium") return "中";
  return "低";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

type CompactKanbanPreviewProps = {
  tasks: TaskRecord[];
  isLoading: boolean;
  error: string | null;
};

export function CompactKanbanPreview({
  tasks,
  isLoading,
  error,
}: CompactKanbanPreviewProps) {
  const columns = KANBAN_COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.status === col.status),
  }));

  return (
    <DashboardPanel aria-labelledby="compact-kanban-title">
      <SectionHeader>
        <div>
          <SectionTitle id="compact-kanban-title">任務看板</SectionTitle>
          <SectionDescription>
            快速查看目前任務在各流程階段的分布。
          </SectionDescription>
        </div>
      </SectionHeader>

      {isLoading ? (
        <StateText>載入中…</StateText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : tasks.length === 0 ? (
        <StateText>目前沒有任務資料。</StateText>
      ) : (
        <ColumnsGrid>
          {columns.map((column) => (
            <Column key={column.status}>
              <ColumnHeader>
                <ColumnTitle>{column.label}</ColumnTitle>
                <ColumnCount>{column.tasks.length}</ColumnCount>
              </ColumnHeader>

              <TaskList>
                {column.tasks.map((task) => (
                  <TaskCard key={task.id}>
                    <TaskName>{task.title}</TaskName>
                    <ProjectName>
                      {task.project_id ? "專案任務" : "獨立任務"}
                    </ProjectName>
                    <TaskMeta>
                      {task.priority ? (
                        <PriorityBadge $priority={mapPriority(task.priority)}>
                          {mapPriority(task.priority)}
                        </PriorityBadge>
                      ) : null}
                      <DueDate>
                        {task.due_date ? formatDate(task.due_date) : "—"}
                      </DueDate>
                    </TaskMeta>
                  </TaskCard>
                ))}
              </TaskList>
            </Column>
          ))}
        </ColumnsGrid>
      )}
    </DashboardPanel>
  );
}
