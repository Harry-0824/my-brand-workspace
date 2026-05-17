export type DashboardSummary = {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  openTasks: number;
  totalClients: number;
  totalIncomeAmount: number;
  paidIncomeAmount: number;
  pendingOrOverdueIncomeAmount: number;
};

const ZERO_DASHBOARD_SUMMARY: DashboardSummary = {
  totalProjects: 0,
  activeProjects: 0,
  totalTasks: 0,
  openTasks: 0,
  totalClients: 0,
  totalIncomeAmount: 0,
  paidIncomeAmount: 0,
  pendingOrOverdueIncomeAmount: 0
};

type IncomeSummaryRow = {
  amount: number;
  status: "pending" | "paid" | "overdue" | "cancelled";
};

async function getCurrentUserId() {
  const { supabase } = await import("./supabase");
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to read authenticated user: ${error.message}`);
  }

  if (!data.user) {
    return null;
  }

  return data.user.id;
}

function toNumber(value: number | null | undefined) {
  return value ?? 0;
}

function roundCurrency(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function createZeroDashboardSummary() {
  return { ...ZERO_DASHBOARD_SUMMARY };
}

export async function fetchDashboardSummaryForCurrentUser() {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return createZeroDashboardSummary();
  }

  const [
    totalProjectsResult,
    activeProjectsResult,
    totalTasksResult,
    openTasksResult,
    totalClientsResult,
    incomeRowsResult
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "active"),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["todo", "in_progress"]),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("income_records").select("amount, status").eq("user_id", userId)
  ]);

  if (totalProjectsResult.error) {
    throw new Error(`Failed to load dashboard projects summary: ${totalProjectsResult.error.message}`);
  }
  if (activeProjectsResult.error) {
    throw new Error(`Failed to load dashboard active projects summary: ${activeProjectsResult.error.message}`);
  }
  if (totalTasksResult.error) {
    throw new Error(`Failed to load dashboard tasks summary: ${totalTasksResult.error.message}`);
  }
  if (openTasksResult.error) {
    throw new Error(`Failed to load dashboard open tasks summary: ${openTasksResult.error.message}`);
  }
  if (totalClientsResult.error) {
    throw new Error(`Failed to load dashboard clients summary: ${totalClientsResult.error.message}`);
  }
  if (incomeRowsResult.error) {
    throw new Error(`Failed to load dashboard income summary: ${incomeRowsResult.error.message}`);
  }

  const incomeRows = (incomeRowsResult.data ?? []) as IncomeSummaryRow[];

  const incomeTotals = incomeRows.reduce(
    (acc, row) => {
      const amount = Number.isFinite(row.amount) ? row.amount : 0;
      acc.total += amount;

      if (row.status === "paid") {
        acc.paid += amount;
      }

      if (row.status === "pending" || row.status === "overdue") {
        acc.pendingOrOverdue += amount;
      }

      return acc;
    },
    { total: 0, paid: 0, pendingOrOverdue: 0 }
  );

  return {
    totalProjects: toNumber(totalProjectsResult.count),
    activeProjects: toNumber(activeProjectsResult.count),
    totalTasks: toNumber(totalTasksResult.count),
    openTasks: toNumber(openTasksResult.count),
    totalClients: toNumber(totalClientsResult.count),
    totalIncomeAmount: roundCurrency(incomeTotals.total),
    paidIncomeAmount: roundCurrency(incomeTotals.paid),
    pendingOrOverdueIncomeAmount: roundCurrency(incomeTotals.pendingOrOverdue)
  };
}
