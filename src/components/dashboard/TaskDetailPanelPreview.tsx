import {
  Panel,
  SectionTitle,
  SectionDescription,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  ErrorInfoValue,
} from "./TaskDetailPanelPreview.styles";
import { TaskRecord } from "../../lib/tasks";
import { ProjectRecord } from "../../lib/projects";

// 任務詳情顯示的是資料庫 enum 的繁中版本，避免直接把英文狀態露出到 UI。
const STATUS_DISPLAY: Record<TaskRecord["status"], string> = {
  todo: "待辦",
  in_progress: "進行中",
  done: "已完成",
  cancelled: "已取消",
};

const PRIORITY_DISPLAY: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
  urgent: "急",
};

function selectFeaturedTask(tasks: TaskRecord[]): TaskRecord | null {
  // 詳情預覽優先呈現正在處理的任務，其次待辦；沒有互動選取狀態時用這個固定規則。
  return (
    tasks.find((t) => t.status === "in_progress") ??
    tasks.find((t) => t.status === "todo") ??
    tasks[0] ??
    null
  );
}

function formatDueDate(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

type TaskDetailPanelPreviewProps = {
  tasks: TaskRecord[];
  projects: ProjectRecord[];
  isLoading: boolean;
  error: string | null;
};

export function TaskDetailPanelPreview({
  tasks,
  projects,
  isLoading,
  error,
}: TaskDetailPanelPreviewProps) {
  const featuredTask = selectFeaturedTask(tasks);

  return (
    <Panel aria-labelledby="task-detail-panel-title">
      <SectionTitle id="task-detail-panel-title">任務詳情</SectionTitle>
      <SectionDescription>預覽目前進行中或待辦任務的細節。</SectionDescription>

      {isLoading ? (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>狀態</InfoLabel>
            <InfoValue>載入中…</InfoValue>
          </InfoItem>
        </InfoGrid>
      ) : error ? (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>錯誤</InfoLabel>
            <ErrorInfoValue>{error}</ErrorInfoValue>
          </InfoItem>
        </InfoGrid>
      ) : !featuredTask ? (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>任務名稱</InfoLabel>
            <InfoValue>目前沒有任務資料</InfoValue>
          </InfoItem>
        </InfoGrid>
      ) : (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>任務名稱</InfoLabel>
            <InfoValue>{featuredTask.title}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>所屬專案</InfoLabel>
            <InfoValue>
              {projects.find((p) => p.id === featuredTask.project_id)?.name ??
                "獨立任務"}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>狀態</InfoLabel>
            <InfoValue>{STATUS_DISPLAY[featuredTask.status]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>優先級</InfoLabel>
            <InfoValue>
              {featuredTask.priority
                ? (PRIORITY_DISPLAY[featuredTask.priority] ?? "中")
                : "中"}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>到期日</InfoLabel>
            <InfoValue>{formatDueDate(featuredTask.due_date)}</InfoValue>
          </InfoItem>
        </InfoGrid>
      )}
    </Panel>
  );
}
