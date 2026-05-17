import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createZeroDashboardSummary,
  fetchDashboardSummaryForCurrentUser
} from "./dashboardSummary";

type QueryResult = {
  data: unknown;
  error: { message: string } | null;
  count?: number | null;
};

const mockGetUser = vi.fn();
const queryCalls: Array<{ table: string; columns: string; options?: unknown }> = [];

const queryResults = {
  totalProjects: { data: null, error: null, count: 0 } as QueryResult,
  activeProjects: { data: null, error: null, count: 0 } as QueryResult,
  totalTasks: { data: null, error: null, count: 0 } as QueryResult,
  openTasks: { data: null, error: null, count: 0 } as QueryResult,
  totalClients: { data: null, error: null, count: 0 } as QueryResult,
  incomeRows: { data: [], error: null } as QueryResult
};

function makeThenable(result: QueryResult) {
  return {
    then(onFulfilled: (value: QueryResult) => unknown, onRejected?: (reason: unknown) => unknown) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    }
  };
}

function resolveQueryResult(
  table: string,
  columns: string,
  filters: Record<string, unknown>,
  inFilters: Record<string, unknown[]>
) {
  if (table === "projects" && columns === "id") {
    return filters.status === "active" ? queryResults.activeProjects : queryResults.totalProjects;
  }
  if (table === "tasks" && columns === "id") {
    return inFilters.status ? queryResults.openTasks : queryResults.totalTasks;
  }
  if (table === "clients" && columns === "id") {
    return queryResults.totalClients;
  }
  return queryResults.incomeRows;
}

const mockSupabase = {
  auth: {
    getUser: (...args: unknown[]) => mockGetUser(...args)
  },
  from: (table: string) => ({
    select: (columns: string, options?: unknown) => {
      queryCalls.push({ table, columns, options });
      const filters: Record<string, unknown> = {};
      const inFilters: Record<string, unknown[]> = {};

      const builder = {
        eq: (key: string, value: unknown) => {
          filters[key] = value;
          return builder;
        },
        in: (key: string, values: unknown[]) => {
          inFilters[key] = values;
          return builder;
        },
        then: (
          onFulfilled: (value: QueryResult) => unknown,
          onRejected?: (reason: unknown) => unknown
        ) => {
          const result = resolveQueryResult(table, columns, filters, inFilters);
          return makeThenable(result).then(onFulfilled, onRejected);
        }
      };

      return builder;
    }
  })
};

vi.mock("./supabase", () => ({
  supabase: mockSupabase
}));

describe("dashboardSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryCalls.length = 0;
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null
    });

    queryResults.totalProjects = { data: null, error: null, count: 4 };
    queryResults.activeProjects = { data: null, error: null, count: 2 };
    queryResults.totalTasks = { data: null, error: null, count: 9 };
    queryResults.openTasks = { data: null, error: null, count: 5 };
    queryResults.totalClients = { data: null, error: null, count: 3 };
    queryResults.incomeRows = {
      data: [
        { amount: 35000, status: "paid" },
        { amount: 12000.5, status: "pending" },
        { amount: 2000, status: "overdue" },
        { amount: 800, status: "cancelled" }
      ],
      error: null
    };
  });

  it("returns zero summary for unauthenticated state", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await fetchDashboardSummaryForCurrentUser();

    expect(result).toEqual(createZeroDashboardSummary());
    expect(queryCalls).toHaveLength(0);
  });

  it("aggregates project/task/client/income summary from Supabase", async () => {
    const result = await fetchDashboardSummaryForCurrentUser();

    expect(result).toEqual({
      totalProjects: 4,
      activeProjects: 2,
      totalTasks: 9,
      openTasks: 5,
      totalClients: 3,
      totalIncomeAmount: 49800.5,
      paidIncomeAmount: 35000,
      pendingOrOverdueIncomeAmount: 14000.5
    });

    expect(queryCalls).toEqual(
      expect.arrayContaining([
        { table: "projects", columns: "id", options: { count: "exact", head: true } },
        { table: "tasks", columns: "id", options: { count: "exact", head: true } },
        { table: "clients", columns: "id", options: { count: "exact", head: true } },
        { table: "income_records", columns: "amount, status", options: undefined }
      ])
    );
  });

  it("throws a scoped error when one summary query fails", async () => {
    queryResults.openTasks = {
      data: null,
      error: { message: "permission denied" },
      count: null
    };

    await expect(fetchDashboardSummaryForCurrentUser()).rejects.toThrow(
      "Failed to load dashboard open tasks summary: permission denied"
    );
  });
});
