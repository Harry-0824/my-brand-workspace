import { type TaskPriority, type TaskStatus } from "../../lib/tasks";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "待處理",
  in_progress: "進行中",
  done: "已完成",
  cancelled: "已取消",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
  urgent: "緊急",
};

export function formatDueDate(dateValue: string | null) {
  if (!dateValue) {
    return "未設定截止日";
  }

  return dateValue;
}
