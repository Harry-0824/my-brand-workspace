import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { FocusPlan } from "./FocusPlan";
import { theme } from "../../../styles/theme";
import type { ProjectRecord } from "../../../lib/projects";
import type { TaskRecord } from "../../../lib/tasks";

const projects: ProjectRecord[] = [
  {
    id: "project-1",
    user_id: "user-1",
    name: "品牌官網重設計",
    status: "active",
    description: null,
    client_name: "Bright Studio",
    start_date: null,
    due_date: null,
    created_at: "2026-05-01T09:00:00.000Z",
  },
];

const tasks: TaskRecord[] = [
  {
    id: "task-done",
    user_id: "user-1",
    project_id: "project-1",
    title: "已完成任務不應優先",
    status: "done",
    priority: "low",
    due_date: "2026-05-21",
    created_at: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "task-todo-early",
    user_id: "user-1",
    project_id: null,
    title: "整理提案修改內容",
    status: "todo",
    priority: "medium",
    due_date: "2026-05-22",
    created_at: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "task-progress-late",
    user_id: "user-1",
    project_id: "project-1",
    title: "完成首頁線框調整",
    status: "in_progress",
    priority: "high",
    due_date: "2026-05-24",
    created_at: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "task-progress-early",
    user_id: "user-1",
    project_id: null,
    title: "檢查購物車測試結果",
    status: "in_progress",
    priority: "urgent",
    due_date: "2026-05-23",
    created_at: "2026-05-01T09:00:00.000Z",
  },
];

function renderFocusPlan(
  props: {
    tasks?: TaskRecord[];
    projects?: ProjectRecord[];
    isLoading?: boolean;
    error?: string | null;
  } = {},
) {
  render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(FocusPlan, {
        tasks: props.tasks ?? tasks,
        projects: props.projects ?? projects,
        isLoading: props.isLoading ?? false,
        error: props.error ?? null,
      }),
    ),
  );
}

describe("FocusPlan real-data behavior", () => {
  afterEach(() => {
    cleanup();
  });

  it("prioritizes in-progress tasks, then todo tasks, and shows project context", () => {
    renderFocusPlan();

    const focusItems = screen.getAllByLabelText("今日工作重點項目");

    expect(focusItems).toHaveLength(3);
    expect(focusItems[0]).toHaveTextContent("檢查購物車測試結果");
    expect(focusItems[0]).toHaveTextContent("獨立任務");
    expect(focusItems[0]).toHaveTextContent("進行中");
    expect(focusItems[0]).toHaveTextContent("期限：5 月 23 日");
    expect(focusItems[1]).toHaveTextContent("完成首頁線框調整");
    expect(focusItems[1]).toHaveTextContent("品牌官網重設計");
    expect(focusItems[2]).toHaveTextContent("整理提案修改內容");
    expect(screen.queryByText("已完成任務不應優先")).not.toBeInTheDocument();
    expect(screen.queryByText(/09:30 - 11:00/)).not.toBeInTheDocument();
  });

  it("renders loading, error, and empty states without static work items", () => {
    renderFocusPlan({ isLoading: true, tasks: [] });
    expect(screen.getByText("載入今日工作重點中…")).toBeInTheDocument();
    expect(screen.queryByText("完成首頁線框調整")).not.toBeInTheDocument();

    cleanup();
    renderFocusPlan({ error: "部分資料暫時無法載入，請稍後再試。", tasks: [] });
    expect(
      screen.getByText("部分資料暫時無法載入，請稍後再試。"),
    ).toBeInTheDocument();

    cleanup();
    renderFocusPlan({ tasks: [] });
    expect(screen.getByText("目前沒有待處理的工作重點。")).toBeInTheDocument();
  });
});
