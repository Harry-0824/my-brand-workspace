import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { DashboardNextAction } from "./DashboardNextAction";
import { theme } from "../../../styles/theme";
import type { ProjectRecord } from "../../../lib/projects";
import type { TaskRecord } from "../../../lib/tasks";
import type { ClientRecord } from "../../../lib/clients";
import type { IncomeRecord } from "../../../lib/incomeRecords";

function renderNextAction(
  props: {
    tasks?: TaskRecord[];
    projects?: ProjectRecord[];
    clients?: ClientRecord[];
    incomeRecords?: IncomeRecord[];
    isLoading?: boolean;
    error?: string | null;
  } = {},
) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <DashboardNextAction
          tasks={props.tasks ?? []}
          projects={props.projects ?? []}
          clients={props.clients ?? []}
          incomeRecords={props.incomeRecords ?? []}
          isLoading={props.isLoading ?? false}
          error={props.error ?? null}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("DashboardNextAction Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders loading state when isLoading is true", () => {
    renderNextAction({ isLoading: true });
    expect(screen.getByText("下一步行動載入中…")).toBeInTheDocument();
  });

  it("renders error state when error is passed and everyone is empty", () => {
    renderNextAction({
      error: "無法載入資料",
      tasks: [],
      projects: [],
      clients: [],
      incomeRecords: [],
    });
    expect(screen.getByText("無法載入資料")).toBeInTheDocument();
  });

  it("renders empty state when all data sources are empty", () => {
    renderNextAction({
      tasks: [],
      projects: [],
      clients: [],
      incomeRecords: [],
    });
    expect(
      screen.getByTestId("dashboard-next-action-empty"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("下一步行動：建立您的第一個專案或任務"),
    ).toBeInTheDocument();
    expect(screen.getByText("建立第一個專案")).toBeInTheDocument();
  });

  it("renders task next action prioritizing in_progress, priority, then due_date", () => {
    const tasks: TaskRecord[] = [
      {
        id: "task-todo-high",
        user_id: "user-1",
        project_id: null,
        title: "待辦高優先",
        status: "todo",
        priority: "high",
        due_date: "2026-05-30",
        created_at: "2026-05-01T00:00:00Z",
      },
      {
        id: "task-progress-medium",
        user_id: "user-1",
        project_id: null,
        title: "進行中中優先",
        status: "in_progress",
        priority: "medium",
        due_date: "2026-05-31",
        created_at: "2026-05-01T00:00:00Z",
      },
    ];

    renderNextAction({ tasks });
    // 雖然 待辦 優先級為 high，但 進行中（in_progress）更應該排在最前面
    expect(
      screen.getByTestId("dashboard-next-action-task"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("下一步行動：推進任務「進行中中優先」"),
    ).toBeInTheDocument();
  });

  it("renders project next action when no active tasks, but active projects exist", () => {
    const projects: ProjectRecord[] = [
      {
        id: "project-active",
        user_id: "user-1",
        name: "活性專案A",
        status: "active",
        description: null,
        client_name: null,
        start_date: null,
        due_date: "2026-06-01",
        created_at: "2026-05-01T00:00:00Z",
      },
    ];

    renderNextAction({ projects, tasks: [] });
    expect(
      screen.getByTestId("dashboard-next-action-project"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("下一步行動：規劃進行中專案「活性專案A」的下一步任務"),
    ).toBeInTheDocument();
  });

  it("renders income next action when no tasks or projects are urging, but pending payment exists", () => {
    const incomeRecords: IncomeRecord[] = [
      {
        id: "income-pending",
        user_id: "user-1",
        project_id: null,
        client_id: null,
        title: "大案子尾款",
        amount: 50000,
        status: "pending",
        due_date: "2026-06-15",
        received_date: null,
        notes: null,
        created_at: "2026-05-01T00:00:00Z",
      },
    ];

    renderNextAction({ incomeRecords, tasks: [], projects: [] });
    expect(
      screen.getByTestId("dashboard-next-action-income"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("下一步行動：追蹤請款「大案子尾款」"),
    ).toBeInTheDocument();
    expect(screen.getByText(/NT\$50,000/)).toBeInTheDocument();
  });

  it("renders fallback state when tasks/projects are finished and no debts left", () => {
    const tasks: TaskRecord[] = [
      {
        id: "task-done",
        user_id: "user-1",
        project_id: null,
        title: "已完成的任務",
        status: "done",
        priority: "high",
        due_date: "2026-05-20",
        created_at: "2026-05-01T00:00:00Z",
      },
    ];

    renderNextAction({ tasks, projects: [], clients: [], incomeRecords: [] });
    expect(
      screen.getByTestId("dashboard-next-action-fallback"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("下一步行動：規劃下一個新案源與任務"),
    ).toBeInTheDocument();
  });
});
