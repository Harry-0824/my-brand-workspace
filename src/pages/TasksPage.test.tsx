import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TasksPage } from "./TasksPage";
import { theme } from "../styles/theme";
import type { TaskRecord, TaskStatus, TaskPriority } from "../lib/tasks";

const mockFetchTasksForCurrentUser = vi.fn();
const mockCreateTaskForCurrentUser = vi.fn();
const mockUpdateTaskForCurrentUser = vi.fn();
const mockDeleteTaskForCurrentUser = vi.fn();

vi.mock("../lib/tasks", () => ({
  TASK_STATUS_VALUES: ["todo", "in_progress", "done", "cancelled"],
  TASK_PRIORITY_VALUES: ["low", "medium", "high", "urgent"],
  fetchTasksForCurrentUser: (...args: unknown[]) =>
    mockFetchTasksForCurrentUser(...args),
  createTaskForCurrentUser: (...args: unknown[]) =>
    mockCreateTaskForCurrentUser(...args),
  updateTaskForCurrentUser: (...args: unknown[]) =>
    mockUpdateTaskForCurrentUser(...args),
  deleteTaskForCurrentUser: (...args: unknown[]) =>
    mockDeleteTaskForCurrentUser(...args)
}));

const baseRows: TaskRecord[] = [
  {
    id: "t-1",
    user_id: "user-1",
    project_id: "project-1",
    title: "Prepare proposal deck",
    status: "todo",
    priority: "high",
    due_date: "2026-05-20",
    created_at: "2026-05-14T09:00:00.000Z"
  },
  {
    id: "t-2",
    user_id: "user-1",
    project_id: null,
    title: "Client follow-up call",
    status: "in_progress",
    priority: "medium",
    due_date: null,
    created_at: "2026-05-13T09:00:00.000Z"
  },
  {
    id: "t-3",
    user_id: "user-1",
    project_id: null,
    title: "Archive old docs",
    status: "done",
    priority: null,
    due_date: "2026-05-10",
    created_at: "2026-05-12T09:00:00.000Z"
  }
];

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchTasksForCurrentUser.mockResolvedValue(baseRows);
  mockCreateTaskForCurrentUser.mockImplementation(
    async (input: {
      title: string;
      status: TaskStatus;
      priority?: TaskPriority | "";
      project_id?: string;
      due_date?: string;
    }) => ({
      id: "t-created",
      user_id: "user-1",
      project_id: input.project_id?.trim() ? input.project_id : null,
      title: input.title,
      status: input.status,
      priority: input.priority ? (input.priority as TaskPriority) : null,
      due_date: input.due_date?.trim() ? input.due_date : null,
      created_at: "2026-05-14T10:00:00.000Z"
    })
  );
  mockUpdateTaskForCurrentUser.mockImplementation(
    async (
      taskId: string,
      input: {
        title: string;
        status: TaskStatus;
        priority?: TaskPriority | "";
        project_id?: string;
        due_date?: string;
      }
    ) => ({
      id: taskId,
      user_id: "user-1",
      project_id: input.project_id?.trim() ? input.project_id : null,
      title: input.title,
      status: input.status,
      priority: input.priority ? (input.priority as TaskPriority) : null,
      due_date: input.due_date?.trim() ? input.due_date : null,
      created_at: "2026-05-14T09:00:00.000Z"
    })
  );
  mockDeleteTaskForCurrentUser.mockResolvedValue(true);
});

function renderTasksPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <TasksPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

function setFieldValue(id: string, value: string) {
  const target = document.getElementById(id) as
    | HTMLInputElement
    | HTMLSelectElement
    | null;
  expect(target).not.toBeNull();
  fireEvent.change(target as Element, { target: { value } });
}

async function waitForRowsToLoad() {
  await waitFor(() => {
    expect(screen.getAllByTestId("tasks-status-badge")).toHaveLength(3);
  });
}

describe("TasksPage Supabase integration behaviors", () => {
  it("loads tasks and renders search/filter controls", async () => {
    renderTasksPage();

    expect(screen.getByTestId("tasks-loading-state")).toBeInTheDocument();
    await waitForRowsToLoad();

    const search = document.getElementById("tasks-search-input") as
      | HTMLInputElement
      | null;
    const filter = document.getElementById("tasks-status-filter") as
      | HTMLSelectElement
      | null;
    const reset = screen.getByTestId("tasks-reset-control") as HTMLButtonElement;

    expect(search).not.toBeNull();
    expect(filter).not.toBeNull();
    expect(
      Array.from((filter as HTMLSelectElement).options).some(
        (option) => option.value === "__ALL__"
      )
    ).toBe(true);
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("3 / 3");
    expect(reset).toBeDisabled();
  });

  it("resets search/filter criteria on tasks page", async () => {
    renderTasksPage();
    await waitForRowsToLoad();

    const search = document.getElementById("tasks-search-input") as
      | HTMLInputElement
      | null;
    const filter = document.getElementById("tasks-status-filter") as
      | HTMLSelectElement
      | null;
    const reset = screen.getByTestId("tasks-reset-control") as HTMLButtonElement;

    expect(search).not.toBeNull();
    expect(filter).not.toBeNull();

    fireEvent.change(filter as Element, { target: { value: "待處理" } });
    expect(screen.getAllByTestId("tasks-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("1 / 3");
    expect(reset).toBeEnabled();

    fireEvent.change(search as Element, { target: { value: "no-match-keyword" } });
    expect(screen.queryAllByTestId("tasks-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("tasks-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("0 / 3");

    fireEvent.click(reset);
    expect((search as HTMLInputElement).value).toBe("");
    expect((filter as HTMLSelectElement).value).toBe("__ALL__");
    expect(screen.queryByTestId("tasks-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("tasks-status-badge")).toHaveLength(3);
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("3 / 3");
    expect(reset).toBeDisabled();
  });

  it("creates a task and prepends it to list", async () => {
    renderTasksPage();
    await waitForRowsToLoad();

    setFieldValue("tasks-create-title", "Send invoice draft");
    setFieldValue("tasks-create-status", "in_progress");
    setFieldValue("tasks-create-priority", "urgent");
    setFieldValue("tasks-create-due-date", "2026-05-30");
    setFieldValue("tasks-create-project-id", "");

    const createForm = document.querySelector("form") as HTMLFormElement | null;
    expect(createForm).not.toBeNull();
    fireEvent.submit(createForm as HTMLFormElement);

    await waitFor(() => {
      expect(mockCreateTaskForCurrentUser).toHaveBeenCalledTimes(1);
    });

    expect(mockCreateTaskForCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Send invoice draft",
        status: "in_progress",
        priority: "urgent",
        due_date: "2026-05-30"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("tasks-create-success")).toBeInTheDocument();
    });
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("4 / 4");
    expect(screen.getAllByTestId("tasks-status-badge")).toHaveLength(4);
  });

  it("updates the selected task only", async () => {
    renderTasksPage();
    await waitForRowsToLoad();

    const editButtons = screen.getAllByTestId("tasks-edit-button");
    fireEvent.click(editButtons[0]);

    setFieldValue("tasks-edit-title-t-1", "Prepare proposal deck v2");
    setFieldValue("tasks-edit-status-t-1", "done");
    setFieldValue("tasks-edit-priority-t-1", "urgent");
    setFieldValue("tasks-edit-due-date-t-1", "2026-05-25");
    setFieldValue("tasks-edit-project-id-t-1", "project-9");

    fireEvent.click(screen.getByTestId("tasks-save-edit-button"));

    await waitFor(() => {
      expect(mockUpdateTaskForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockUpdateTaskForCurrentUser).toHaveBeenCalledWith(
      "t-1",
      expect.objectContaining({
        title: "Prepare proposal deck v2",
        status: "done",
        priority: "urgent",
        due_date: "2026-05-25",
        project_id: "project-9"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("tasks-action-success")).toHaveTextContent(
        "任務已更新。"
      );
    });
    expect(screen.getByText("Prepare proposal deck v2")).toBeInTheDocument();
    expect(screen.getByText("Client follow-up call")).toBeInTheDocument();
  });

  it("deletes the selected task only", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderTasksPage();
    await waitForRowsToLoad();

    const deleteButtons = screen.getAllByTestId("tasks-delete-button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteTaskForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockDeleteTaskForCurrentUser).toHaveBeenCalledWith("t-1");

    await waitFor(() => {
      expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("2 / 2");
    });
    expect(screen.queryByText("Prepare proposal deck")).not.toBeInTheDocument();
    expect(screen.getByText("Client follow-up call")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
