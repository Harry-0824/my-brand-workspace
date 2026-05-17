import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createZeroReportsOverview,
  fetchReportsOverviewForCurrentUser
} from "./reportsOverview";

type QueryResult = {
  data: unknown;
  error: { message: string } | null;
  count?: number | null;
};

const mockGetUser = vi.fn();
const queryCalls: Array<{ table: string; columns: string; options?: unknown }> = [];

const queryResults = {
  projects: { data: [], error: null } as QueryResult,
  tasks: { data: [], error: null } as QueryResult,
  clients: { data: null, error: null, count: 0 } as QueryResult,
  income: { data: [], error: null } as QueryResult
};

function resolveQueryResult(table: string, columns: string) {
  if (table === "projects" && columns === "status") {
    return queryResults.projects;
  }
  if (table === "tasks" && columns === "status") {
    return queryResults.tasks;
  }
  if (table === "clients" && columns === "id") {
    return queryResults.clients;
  }
  return queryResults.income;
}

const mockSupabase = {
  auth: {
    getUser: (...args: unknown[]) => mockGetUser(...args)
  },
  from: (table: string) => ({
    select: (columns: string, options?: unknown) => {
      queryCalls.push({ table, columns, options });

      const builder = {
        eq: () => builder,
        then: (
          onFulfilled: (value: QueryResult) => unknown,
          onRejected?: (reason: unknown) => unknown
        ) => Promise.resolve(resolveQueryResult(table, columns)).then(onFulfilled, onRejected)
      };

      return builder;
    }
  })
};

vi.mock("./supabase", () => ({
  supabase: mockSupabase
}));

describe("reportsOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryCalls.length = 0;

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null
    });

    queryResults.projects = {
      data: [
        { status: "active" },
        { status: "active" },
        { status: "paused" },
        { status: "completed" }
      ],
      error: null
    };
    queryResults.tasks = {
      data: [
        { status: "todo" },
        { status: "in_progress" },
        { status: "done" },
        { status: "cancelled" },
        { status: "done" }
      ],
      error: null
    };
    queryResults.clients = { data: null, count: 3, error: null };
    queryResults.income = {
      data: [
        { amount: 5000, status: "paid" },
        { amount: 1200.5, status: "pending" },
        { amount: 700, status: "overdue" },
        { amount: 300, status: "cancelled" }
      ],
      error: null
    };
  });

  it("returns zero overview for unauthenticated state", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await fetchReportsOverviewForCurrentUser();

    expect(result).toEqual(createZeroReportsOverview());
    expect(queryCalls).toHaveLength(0);
  });

  it("aggregates reports overview from existing tables", async () => {
    const result = await fetchReportsOverviewForCurrentUser();

    expect(result).toEqual({
      totalProjects: 4,
      activeProjects: 2,
      pausedProjects: 1,
      completedProjects: 1,
      archivedProjects: 0,
      totalTasks: 5,
      todoTasks: 1,
      inProgressTasks: 1,
      doneTasks: 2,
      cancelledTasks: 1,
      totalClients: 3,
      totalIncomeAmount: 7200.5,
      paidIncomeAmount: 5000,
      pendingIncomeAmount: 1200.5,
      overdueIncomeAmount: 700,
      cancelledIncomeAmount: 300
    });

    expect(queryCalls).toEqual(
      expect.arrayContaining([
        { table: "projects", columns: "status", options: undefined },
        { table: "tasks", columns: "status", options: undefined },
        { table: "clients", columns: "id", options: { count: "exact", head: true } },
        { table: "income_records", columns: "amount, status", options: undefined }
      ])
    );
  });

  it("throws scoped errors when loading fails", async () => {
    queryResults.tasks = { data: null, error: { message: "task policy error" } };

    await expect(fetchReportsOverviewForCurrentUser()).rejects.toThrow(
      "Failed to load reports task overview: task policy error"
    );
  });
});
