import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReportsPage } from "./ReportsPage";
import { theme } from "../styles/theme";

const mockFetchReportsOverviewForCurrentUser = vi.fn();

vi.mock("../lib/reportsOverview", async () => {
  const actual = await vi.importActual("../lib/reportsOverview");
  return {
    ...actual,
    fetchReportsOverviewForCurrentUser: (...args: unknown[]) =>
      mockFetchReportsOverviewForCurrentUser(...args)
  };
});

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchReportsOverviewForCurrentUser.mockResolvedValue({
    totalProjects: 6,
    activeProjects: 2,
    pausedProjects: 1,
    completedProjects: 2,
    archivedProjects: 1,
    totalTasks: 12,
    todoTasks: 3,
    inProgressTasks: 2,
    doneTasks: 6,
    cancelledTasks: 1,
    totalClients: 4,
    totalIncomeAmount: 100000,
    paidIncomeAmount: 72000,
    pendingIncomeAmount: 18000,
    overdueIncomeAmount: 8000,
    cancelledIncomeAmount: 2000
  });
});

function renderReportsPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <ReportsPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("ReportsPage Supabase read-only integration", () => {
  it("shows loading placeholders then renders real overview values", async () => {
    renderReportsPage();

    expect(screen.getAllByText("--").length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(mockFetchReportsOverviewForCurrentUser).toHaveBeenCalledTimes(1);
    });

    const totalIncomeCard = screen.getByText("累計收款金額").closest("article");
    const totalProjectsCard = screen.getByText("專案總數").closest("article");
    const totalTasksCard = screen.getByText("任務總數").closest("article");
    const totalClientsCard = screen.getByText("客戶總數").closest("article");
    const completionRateCard = screen.getByText("完成率").closest("article");
    const paidIncomeCard = screen.getByText("已收款").closest("article");
    const pendingIncomeCard = screen.getByText("待收款").closest("article");
    const overdueIncomeCard = screen.getByText("逾期收款").closest("article");

    expect(totalIncomeCard).not.toBeNull();
    expect(totalProjectsCard).not.toBeNull();
    expect(totalTasksCard).not.toBeNull();
    expect(totalClientsCard).not.toBeNull();
    expect(completionRateCard).not.toBeNull();
    expect(paidIncomeCard).not.toBeNull();
    expect(pendingIncomeCard).not.toBeNull();
    expect(overdueIncomeCard).not.toBeNull();

    expect(within(totalIncomeCard as HTMLElement).getByText("NT$100,000")).toBeInTheDocument();
    expect(within(totalProjectsCard as HTMLElement).getByText("6")).toBeInTheDocument();
    expect(within(totalTasksCard as HTMLElement).getByText("12")).toBeInTheDocument();
    expect(within(totalClientsCard as HTMLElement).getByText("4")).toBeInTheDocument();
    expect(within(completionRateCard as HTMLElement).getByText("50%")).toBeInTheDocument();
    expect(within(paidIncomeCard as HTMLElement).getByText("NT$72,000")).toBeInTheDocument();
    expect(within(pendingIncomeCard as HTMLElement).getByText("NT$18,000")).toBeInTheDocument();
    expect(within(overdueIncomeCard as HTMLElement).getByText("NT$8,000")).toBeInTheDocument();
  });

  it("shows safe error state when loading fails", async () => {
    mockFetchReportsOverviewForCurrentUser.mockRejectedValueOnce(
      new Error("failed to load reports overview")
    );

    renderReportsPage();

    await waitFor(() => {
      expect(screen.getByTestId("reports-error-state")).toHaveTextContent(
        "failed to load reports overview"
      );
    });
  });

  it("does not show raw auth session errors", async () => {
    mockFetchReportsOverviewForCurrentUser.mockRejectedValueOnce(
      new Error("Failed to read authenticated user: Auth session missing!")
    );

    renderReportsPage();

    await waitFor(() => {
      expect(screen.getByTestId("reports-error-state")).toHaveTextContent(
        "請先登入後再查看此資料。"
      );
    });
    expect(
      screen.queryByText("Failed to read authenticated user: Auth session missing!")
    ).toBeNull();
  });
});
