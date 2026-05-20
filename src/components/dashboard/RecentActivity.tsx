import {
  Panel,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  TimelineList,
  TimelineRow,
  TimelineMarker,
  ActivityDetails,
  ActivityAction,
  ActivityProject,
  ActivityTime,
  TypeBadge,
} from "./RecentActivity.styles";
import { TaskRecord } from "../../lib/tasks";
import { ProjectRecord } from "../../lib/projects";

type ActivityItem = {
  id: string;
  action: string;
  project: string;
  time: string;
  type: "任務" | "專案";
  created_at: string;
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (todayStart.getTime() - dateStart.getTime()) / 86400000
  );
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 30) return `${diffDays} 天前`;
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function buildActivities(
  tasks: TaskRecord[],
  projects: ProjectRecord[]
): ActivityItem[] {
  const taskItems: ActivityItem[] = tasks.map((t) => ({
    id: `task-${t.id}`,
    action: `新增了任務：${t.title}`,
    project: projects.find((p) => p.id === t.project_id)?.name ?? "獨立任務",
    time: formatRelativeTime(t.created_at),
    type: "任務",
    created_at: t.created_at,
  }));
  const projectItems: ActivityItem[] = projects.map((p) => ({
    id: `project-${p.id}`,
    action: `新增了專案：${p.name}`,
    project: p.name,
    time: formatRelativeTime(p.created_at),
    type: "專案",
    created_at: p.created_at,
  }));
  return [...taskItems, ...projectItems]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 10);
}

type RecentActivityProps = {
  tasks: TaskRecord[];
  projects: ProjectRecord[];
  isLoading: boolean;
  error: string | null;
};

export function RecentActivity({
  tasks,
  projects,
  isLoading,
  error,
}: RecentActivityProps) {
  const activities = buildActivities(tasks, projects);

  return (
    <Panel aria-labelledby="recent-activity-title">
      <SectionHeader>
        <div>
          <SectionTitle id="recent-activity-title">最近活動</SectionTitle>
          <SectionDescription>近期專案與任務的建立紀錄。</SectionDescription>
        </div>
      </SectionHeader>

      {isLoading ? (
        <ActivityProject>載入中…</ActivityProject>
      ) : error ? (
        <ActivityProject style={{ color: "#ffb4ad" }}>{error}</ActivityProject>
      ) : activities.length === 0 ? (
        <ActivityProject>目前沒有活動紀錄。</ActivityProject>
      ) : (
        <TimelineList>
          {activities.map((activity) => (
            <TimelineRow aria-label={activity.action} key={activity.id}>
              <TimelineMarker aria-hidden="true" />
              <ActivityDetails>
                <ActivityAction>{activity.action}</ActivityAction>
                <ActivityProject>{activity.project}</ActivityProject>
              </ActivityDetails>
              <ActivityTime>{activity.time}</ActivityTime>
              <TypeBadge>{activity.type}</TypeBadge>
            </TimelineRow>
          ))}
        </TimelineList>
      )}
    </Panel>
  );
}
