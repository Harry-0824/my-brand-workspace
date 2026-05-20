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
  PriorityBadge,
  StateText,
  ErrorText,
} from "./UpcomingDeadlines.styles";
import { type ProjectRecord } from "../../lib/projects";
import { type TaskRecord } from "../../lib/tasks";

type DeadlineItem = {
  id: string;
  title: string;
  projectOrContext: string;
  dueDate: string;
  dueDateFormatted: string;
  type: string;
  priority: "高" | "中" | "低";
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function mapTaskPriority(priority: TaskRecord["priority"]): "高" | "中" | "低" {
  if (priority === "high" || priority === "urgent") return "高";
  if (priority === "medium") return "中";
  return "低";
}

function buildDeadlineItems(
  projects: ProjectRecord[],
  tasks: TaskRecord[],
): DeadlineItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const projectItems: DeadlineItem[] = projects
    .filter(
      (p) =>
        p.due_date !== null &&
        p.status !== "completed" &&
        p.status !== "archived" &&
        new Date(p.due_date) >= today,
    )
    .map((p) => ({
      id: `project-${p.id}`,
      title: p.name,
      projectOrContext: p.client_name ?? "內部專案",
      dueDate: p.due_date as string,
      dueDateFormatted: formatDate(p.due_date as string),
      type: "專案",
      priority: "中" as const,
    }));

  const taskItems: DeadlineItem[] = tasks
    .filter(
      (t) =>
        t.due_date !== null &&
        t.status !== "done" &&
        t.status !== "cancelled" &&
        new Date(t.due_date) >= today,
    )
    .map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      projectOrContext: "任務",
      dueDate: t.due_date as string,
      dueDateFormatted: formatDate(t.due_date as string),
      type: "任務",
      priority: mapTaskPriority(t.priority),
    }));

  return [...projectItems, ...taskItems]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 10);
}

type UpcomingDeadlinesProps = {
  projects: ProjectRecord[];
  tasks: TaskRecord[];
  isLoading: boolean;
  error: string | null;
};

export function UpcomingDeadlines({
  projects,
  tasks,
  isLoading,
  error,
}: UpcomingDeadlinesProps) {
  const items = buildDeadlineItems(projects, tasks);

  return (
    <Panel aria-labelledby="upcoming-deadlines-title">
      <SectionHeader>
        <div>
          <SectionTitle id="upcoming-deadlines-title">即將到期</SectionTitle>
          <SectionDescription>
            未來需要完成或確認的重點事項。
          </SectionDescription>
        </div>
        {!isLoading && !error ? (
          <DeadlineCount>{items.length} 個事項</DeadlineCount>
        ) : null}
      </SectionHeader>

      {isLoading ? (
        <StateText>載入中…</StateText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : items.length === 0 ? (
        <StateText>目前沒有即將到期的事項。</StateText>
      ) : (
        <DeadlineList>
          {items.map((item, index) => {
            const titleId = `deadline-${index}-title`;
            return (
              <DeadlineRow aria-labelledby={titleId} key={item.id}>
                <DateBlock>
                  <DateLabel>日期</DateLabel>
                  <DateText>{item.dueDateFormatted}</DateText>
                </DateBlock>

                <DeadlineDetails>
                  <DeadlineTitle id={titleId}>{item.title}</DeadlineTitle>
                  <ProjectName>{item.projectOrContext}</ProjectName>
                </DeadlineDetails>

                <TypeBadge>{item.type}</TypeBadge>
                <PriorityBadge $priority={item.priority}>
                  {item.priority}
                </PriorityBadge>
              </DeadlineRow>
            );
          })}
        </DeadlineList>
      )}
    </Panel>
  );
}
