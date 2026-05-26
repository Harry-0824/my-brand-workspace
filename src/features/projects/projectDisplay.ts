import { type ProjectStatus } from "../../lib/projects";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "進行中",
  paused: "暫停中",
  completed: "已完成",
  archived: "已封存",
};

export function getDateRangeError(startDate?: string, dueDate?: string) {
  const normalizedStartDate = startDate?.trim();
  const normalizedDueDate = dueDate?.trim();

  if (!normalizedStartDate || !normalizedDueDate) {
    return null;
  }

  if (normalizedStartDate > normalizedDueDate) {
    return "開始日期不可晚於截止日期";
  }

  return null;
}