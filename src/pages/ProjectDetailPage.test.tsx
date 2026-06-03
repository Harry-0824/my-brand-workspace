import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectDetailPage } from "./ProjectDetailPage";
import { theme } from "../styles/theme";
import type { ProjectRecord } from "../lib/projects";
import type { TaskRecord } from "../lib/tasks";
import type { IncomeRecord } from "../lib/incomeRecords";

const mockFetchProjectForCurrentUser = vi.fn();
const mockFetchTasksForProjectForCurrentUser = vi.fn();
const mockFetchIncomeRecordsForProjectForCurrentUser = vi.fn();

vi.mock("../lib/projects", () => ({
  fetchProjectForCurrentUser: (...args: unknown[]) =>
    mockFetchProjectForCurrentUser(...args),
}));

vi.mock("../lib/tasks", () => ({
  TASK_STATUS_VALUES: ["todo", "in_progress", "done", "cancelled"],
  fetchTasksForProjectForCurrentUser: (...args: unknown[]) =>
    mockFetchTasksForProjectForCurrentUser(...args),
}));

vi.mock("../lib/incomeRecords", () => ({
  fetchIncomeRecordsForProjectForCurrentUser: (...args: unknown[]) =>
    mockFetchIncomeRecordsForProjectForCurrentUser(...args),
}));

const project: ProjectRecord = {
  id: "p-1",
  user_id: "user-1",
  name: "品牌官網更新",
  status: "active",
  description: "重新整理首頁訊息與服務入口。",
  client_name: "Bright Studio",
  start_date: "2026-05-01",
  due_date: "2026-06-20",
  created_at: "2026-05-01T12:00:00.000Z",
};

const tasks: TaskRecord[] = [
  {
    id: "t-1",
    user_id: "user-1",
    project_id: "p-1",
    title: "確認首頁文案",
    status: "todo",
    priority: "high",
    due_date: "2099-06-10",
    created_at: "2026-05-15T12:00:00.000Z",
  },
  {
    id: "t-2",
    user_id: "user-1",
    project_id: "p-1",
    title: "交付設計稿",
    status: "in_progress",
    priority: "medium",
    due_date: "2000-01-01",
    created_at: "2026-05-10T12:00:00.000Z",
  },
  {
    id: "t-3",
    user_id: "user-1",
    project_id: "p-1",
    title: "舊版頁面封存",
    status: "done",
    priority: "low",
    due_date: "2000-01-02",
    created_at: "2026-05-05T12:00:00.000Z",
  },
];

const incomeRecords: IncomeRecord[] = [
  {
    id: "i-1",
    user_id: "user-1",
    project_id: "p-1",
    client_id: null,
    title: "首期款",
    amount: 10000,
    status: "paid",
    due_date: "2026-05-10",
    received_date: "2026-05-09",
    notes: null,
    created_at: "2026-05-02T12:00:00.000Z",
  },
  {
    id: "i-2",
    user_id: "user-1",
    project_id: "p-1",
    client_id: null,
    title: "尾款",
    amount: 5000,
    status: "pending",
    due_date: "2026-06-20",
    received_date: null,
    notes: null,
    created_at: "2026-05-20T12:00:00.000Z",
  },
];

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchProjectForCurrentUser.mockResolvedValue(project);
  mockFetchTasksForProjectForCurrentUser.mockResolvedValue(tasks);
  mockFetchIncomeRecordsForProjectForCurrentUser.mockResolvedValue(incomeRecords);
});

function renderProjectDetailPage(projectId = "p-1") {
  render(
    <MemoryRouter initialEntries={[`/projects/${projectId}`]}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("ProjectDetailPage", () => {
  it("renders project, related task summary, and related revenue summary", async () => {
    renderProjectDetailPage();

    expect(screen.getByTestId("project-detail-loading")).toBeInTheDocument();

    await screen.findByRole("heading", { name: "品牌官網更新" });

    expect(mockFetchProjectForCurrentUser).toHaveBeenCalledWith("p-1");
    expect(mockFetchTasksForProjectForCurrentUser).toHaveBeenCalledWith("p-1");
    expect(mockFetchIncomeRecordsForProjectForCurrentUser).toHaveBeenCalledWith(
      "p-1",
    );
    expect(screen.getByText("Bright Studio")).toBeInTheDocument();
    expect(screen.getByTestId("project-detail-task-total")).toHaveTextContent("3");
    expect(screen.getByTestId("project-detail-overdue-tasks")).toHaveTextContent(
      "1",
    );
    expect(screen.getByText("待辦：1")).toBeInTheDocument();
    expect(screen.getByText("確認首頁文案")).toBeInTheDocument();
    expect(screen.getByTestId("project-detail-revenue-total")).toHaveTextContent(
      "NT$15,000",
    );
    expect(screen.getByText("首期款")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回專案列表" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("renders empty related data states", async () => {
    mockFetchTasksForProjectForCurrentUser.mockResolvedValueOnce([]);
    mockFetchIncomeRecordsForProjectForCurrentUser.mockResolvedValueOnce([]);

    renderProjectDetailPage();

    await screen.findByRole("heading", { name: "品牌官網更新" });

    expect(screen.getByTestId("project-detail-empty-tasks")).toHaveTextContent(
      "這個專案目前沒有相關任務",
    );
    expect(screen.getByTestId("project-detail-empty-income")).toHaveTextContent(
      "這個專案目前沒有相關收入紀錄",
    );
  });

  it("renders not found state when project id does not match", async () => {
    mockFetchProjectForCurrentUser.mockResolvedValueOnce(null);

    renderProjectDetailPage("missing-project");

    await screen.findByTestId("project-detail-not-found");

    expect(screen.getByTestId("project-detail-not-found")).toHaveTextContent(
      "找不到這個專案",
    );
  });

  it("renders error state when project detail loading fails", async () => {
    mockFetchProjectForCurrentUser.mockRejectedValueOnce(new Error("boom"));

    renderProjectDetailPage();

    await waitFor(() => {
      expect(screen.getByTestId("project-detail-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("project-detail-error")).toHaveTextContent("boom");
  });
});
