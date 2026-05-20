import {
  FocusList,
  FocusItem,
  FocusTop,
  Time,
  StatusBadge,
  Title,
  Project,
  Description,
  SuggestionBlock,
  SuggestionText,
  StateText,
  ErrorText,
} from "./FocusPlan.styles";
import { DashboardPanel } from "./shared/DashboardPanel";
import { DashboardSectionHeader } from "./shared/DashboardSectionHeader";
import { type ProjectRecord } from "../../lib/projects";
import { type TaskRecord } from "../../lib/tasks";

const STATUS_LABEL: Record<TaskRecord["status"], string> = {
  todo: "待辦",
  in_progress: "進行中",
  done: "已完成",
  cancelled: "已取消",
};

const STATUS_PRIORITY: Record<TaskRecord["status"], number> = {
  in_progress: 0,
  todo: 1,
  done: 2,
  cancelled: 3,
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
  urgent: "急",
};

type FocusPlanProps = {
  tasks: TaskRecord[];
  projects: ProjectRecord[];
  isLoading: boolean;
  error: string | null;
};

function getDueDateRank(dueDate: string | null) {
  if (!dueDate) {
    return Number.POSITIVE_INFINITY;
  }

  return new Date(dueDate).getTime();
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "無期限";
  }

  const date = new Date(dueDate);
  return `期限：${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function getProjectName(task: TaskRecord, projects: ProjectRecord[]) {
  if (!task.project_id) {
    return "獨立任務";
  }

  return projects.find((project) => project.id === task.project_id)?.name ?? "獨立任務";
}

function getPriorityText(priority: TaskRecord["priority"]) {
  return priority ? `優先級：${PRIORITY_LABEL[priority] ?? "中"}` : "尚未設定優先級";
}

function selectFocusTasks(tasks: TaskRecord[]) {
  return tasks
    .filter((task) => task.status === "in_progress" || task.status === "todo")
    .sort((a, b) => {
      const statusDifference = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      if (statusDifference !== 0) {
        return statusDifference;
      }

      return getDueDateRank(a.due_date) - getDueDateRank(b.due_date);
    })
    .slice(0, 3);
}

function getSuggestionText(focusTasks: TaskRecord[]) {
  const inProgressCount = focusTasks.filter(
    (task) => task.status === "in_progress",
  ).length;
  const todoCount = focusTasks.filter((task) => task.status === "todo").length;

  if (inProgressCount > 0) {
    return `今日建議：先完成 ${inProgressCount} 個進行中任務，再安排待辦。`;
  }

  if (todoCount > 0) {
    return `今日建議：先從期限最近的 ${todoCount} 個待辦任務開始。`;
  }

  return null;
}

export function FocusPlan({ tasks, projects, isLoading, error }: FocusPlanProps) {
  const focusTasks = selectFocusTasks(tasks);
  const suggestionText = getSuggestionText(focusTasks);

  return (
    <DashboardPanel aria-labelledby="focus-plan-title">
      <DashboardSectionHeader
        titleId="focus-plan-title"
        title="今日工作重點"
        description="根據目前任務狀態與期限，整理今天最需要推進的工作順序。"
        withDivider
      />

      {isLoading ? (
        <StateText>載入今日工作重點中…</StateText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : focusTasks.length === 0 ? (
        <StateText>目前沒有待處理的工作重點。</StateText>
      ) : (
        <FocusList>
          {focusTasks.map((task) => {
            const status = STATUS_LABEL[task.status];

            return (
              <FocusItem key={task.id} aria-label="今日工作重點項目">
                <FocusTop>
                  <Time>{formatDueDate(task.due_date)}</Time>
                  <StatusBadge $status={status}>{status}</StatusBadge>
                </FocusTop>
                <Title>{task.title}</Title>
                <Project>{getProjectName(task, projects)}</Project>
                <Description>{getPriorityText(task.priority)}</Description>
              </FocusItem>
            );
          })}
        </FocusList>
      )}

      {suggestionText ? (
        <SuggestionBlock>
          <SuggestionText>{suggestionText}</SuggestionText>
        </SuggestionBlock>
      ) : null}
    </DashboardPanel>
  );
}
