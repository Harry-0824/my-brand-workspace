import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsPage } from "./ProjectsPage";
import { theme } from "../styles/theme";
import type { ProjectRecord, ProjectStatus } from "../lib/projects";

const mockFetchProjectsForCurrentUser = vi.fn();
const mockCreateProjectForCurrentUser = vi.fn();
const mockUpdateProjectForCurrentUser = vi.fn();
const mockDeleteProjectForCurrentUser = vi.fn();

vi.mock("../lib/projects", () => ({
  PROJECT_STATUS_VALUES: ["active", "paused", "completed", "archived"],
  fetchProjectsForCurrentUser: (...args: unknown[]) =>
    mockFetchProjectsForCurrentUser(...args),
  createProjectForCurrentUser: (...args: unknown[]) =>
    mockCreateProjectForCurrentUser(...args),
  updateProjectForCurrentUser: (...args: unknown[]) =>
    mockUpdateProjectForCurrentUser(...args),
  deleteProjectForCurrentUser: (...args: unknown[]) =>
    mockDeleteProjectForCurrentUser(...args)
}));

const baseRows: ProjectRecord[] = [
  {
    id: "p-1",
    user_id: "user-1",
    name: "品牌官網重設計",
    status: "active",
    description: "首頁與服務頁設計調整",
    client_name: "Bright Studio",
    start_date: "2026-05-01",
    due_date: "2026-05-20",
    created_at: "2026-05-01T12:00:00.000Z"
  },
  {
    id: "p-2",
    user_id: "user-1",
    name: "電商功能開發",
    status: "paused",
    description: "串接購物車與結帳流程",
    client_name: "FlowMart",
    start_date: "2026-04-25",
    due_date: "2026-06-01",
    created_at: "2026-04-25T12:00:00.000Z"
  },
  {
    id: "p-3",
    user_id: "user-1",
    name: "客戶提案製作",
    status: "completed",
    description: "完成提案簡報內容",
    client_name: "Northwind Co.",
    start_date: "2026-04-12",
    due_date: "2026-04-30",
    created_at: "2026-04-12T12:00:00.000Z"
  },
  {
    id: "p-4",
    user_id: "user-1",
    name: "個人作品網站",
    status: "archived",
    description: "完成作品集頁面整理",
    client_name: "Internal",
    start_date: "2026-03-01",
    due_date: "2026-03-28",
    created_at: "2026-03-01T12:00:00.000Z"
  }
];

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchProjectsForCurrentUser.mockResolvedValue(baseRows);
  mockCreateProjectForCurrentUser.mockImplementation(
    async (input: {
      name: string;
      status: ProjectStatus;
      description?: string;
      client_name?: string;
      start_date?: string;
      due_date?: string;
    }) => ({
      id: "p-created",
      user_id: "user-1",
      name: input.name,
      status: input.status,
      description: input.description ?? null,
      client_name: input.client_name ?? null,
      start_date: input.start_date ?? null,
      due_date: input.due_date ?? null,
      created_at: "2026-05-14T09:00:00.000Z"
    })
  );
  mockUpdateProjectForCurrentUser.mockImplementation(
    async (projectId: string, input: {
      name: string;
      status: ProjectStatus;
      description?: string;
      client_name?: string;
      start_date?: string;
      due_date?: string;
    }) => ({
      id: projectId,
      user_id: "user-1",
      name: input.name,
      status: input.status,
      description: input.description ?? null,
      client_name: input.client_name ?? null,
      start_date: input.start_date ?? null,
      due_date: input.due_date ?? null,
      created_at: "2026-05-01T12:00:00.000Z"
    })
  );
  mockDeleteProjectForCurrentUser.mockResolvedValue(true);
});

function renderProjectsPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <ProjectsPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

async function waitForRowsToLoad() {
  await waitFor(() => {
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(4);
  });
}

describe("ProjectsPage Supabase integration behaviors", () => {
  it("loads projects and renders search/filter controls", async () => {
    renderProjectsPage();

    expect(screen.getByTestId("projects-loading-state")).toBeInTheDocument();
    await waitForRowsToLoad();

    const search = screen.getByRole("textbox", {
      name: "專案關鍵字搜尋"
    }) as HTMLInputElement;
    const filter = screen.getByRole("combobox", {
      name: "專案狀態"
    }) as HTMLSelectElement;
    const reset = screen.getByTestId("projects-reset-control") as HTMLButtonElement;

    expect(search.id).toBe("projects-search-input");
    expect(filter.id).toBe("projects-status-filter");
    expect(
      Array.from(filter.options).some((option) => option.value === "__ALL__")
    ).toBe(true);
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("creates a project and prepends it to the list", async () => {
    renderProjectsPage();
    await waitForRowsToLoad();

    fireEvent.change(screen.getByLabelText("專案名稱"), {
      target: { value: "新提案網站" }
    });
    fireEvent.change(screen.getByLabelText("狀態"), {
      target: { value: "paused" }
    });
    fireEvent.change(screen.getByLabelText("客戶名稱"), {
      target: { value: "CaseCake" }
    });

    fireEvent.click(screen.getByRole("button", { name: "新增專案" }));

    await waitFor(() => {
      expect(mockCreateProjectForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockCreateProjectForCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "新提案網站",
        status: "paused",
        client_name: "CaseCake"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("projects-create-success")).toHaveTextContent(
        "專案已建立。"
      );
    });
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("5 / 5");
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(5);
  });

  it("updates the selected project only", async () => {
    renderProjectsPage();
    await waitForRowsToLoad();

    const editButtons = screen.getAllByTestId("projects-edit-button");
    fireEvent.click(editButtons[0]);

    const editNameInput = screen.getByLabelText("專案名稱", {
      selector: "input[id^='projects-edit-name-']"
    }) as HTMLInputElement;
    const editStatusSelect = screen.getByLabelText("狀態", {
      selector: "select[id^='projects-edit-status-']"
    }) as HTMLSelectElement;

    fireEvent.change(editNameInput, { target: { value: "品牌官網改版 V2" } });
    fireEvent.change(editStatusSelect, { target: { value: "completed" } });
    fireEvent.click(screen.getByTestId("projects-save-edit-button"));

    await waitFor(() => {
      expect(mockUpdateProjectForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockUpdateProjectForCurrentUser).toHaveBeenCalledWith(
      "p-1",
      expect.objectContaining({
        name: "品牌官網改版 V2",
        status: "completed"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("projects-action-success")).toHaveTextContent(
        "專案已更新。"
      );
    });
    expect(screen.getByText("品牌官網改版 V2")).toBeInTheDocument();
    expect(screen.getByText("電商功能開發")).toBeInTheDocument();
  });

  it("deletes the selected project only", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderProjectsPage();
    await waitForRowsToLoad();

    const deleteButtons = screen.getAllByTestId("projects-delete-button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteProjectForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockDeleteProjectForCurrentUser).toHaveBeenCalledWith("p-1");
    await waitFor(() => {
      expect(screen.getByTestId("projects-result-count")).toHaveTextContent("3 / 3");
    });
    expect(screen.queryByText("品牌官網重設計")).not.toBeInTheDocument();
    expect(screen.getByText("電商功能開發")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
