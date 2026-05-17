export type ReportsOverview = {
  totalProjects: number;
  activeProjects: number;
  pausedProjects: number;
  completedProjects: number;
  archivedProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  cancelledTasks: number;
  totalClients: number;
  totalIncomeAmount: number;
  paidIncomeAmount: number;
  pendingIncomeAmount: number;
  overdueIncomeAmount: number;
  cancelledIncomeAmount: number;
};

const ZERO_REPORTS_OVERVIEW: ReportsOverview = {
  totalProjects: 0,
  activeProjects: 0,
  pausedProjects: 0,
  completedProjects: 0,
  archivedProjects: 0,
  totalTasks: 0,
  todoTasks: 0,
  inProgressTasks: 0,
  doneTasks: 0,
  cancelledTasks: 0,
  totalClients: 0,
  totalIncomeAmount: 0,
  paidIncomeAmount: 0,
  pendingIncomeAmount: 0,
  overdueIncomeAmount: 0,
  cancelledIncomeAmount: 0
};

type ProjectStatus = "active" | "paused" | "completed" | "archived";
type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
type IncomeStatus = "pending" | "paid" | "overdue" | "cancelled";

type ProjectStatusRow = { status: ProjectStatus };
type TaskStatusRow = { status: TaskStatus };
type IncomeStatusRow = { amount: number; status: IncomeStatus };

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

function roundCurrency(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function createZeroReportsOverview() {
  return { ...ZERO_REPORTS_OVERVIEW };
}

export async function fetchReportsOverviewForCurrentUser() {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return createZeroReportsOverview();
  }

  const [projectsResult, tasksResult, clientsResult, incomeRowsResult] = await Promise.all([
    supabase.from("projects").select("status").eq("user_id", userId),
    supabase.from("tasks").select("status").eq("user_id", userId),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("income_records").select("amount, status").eq("user_id", userId)
  ]);

  if (projectsResult.error) {
    throw new Error(`Failed to load reports project overview: ${projectsResult.error.message}`);
  }
  if (tasksResult.error) {
    throw new Error(`Failed to load reports task overview: ${tasksResult.error.message}`);
  }
  if (clientsResult.error) {
    throw new Error(`Failed to load reports client overview: ${clientsResult.error.message}`);
  }
  if (incomeRowsResult.error) {
    throw new Error(`Failed to load reports revenue overview: ${incomeRowsResult.error.message}`);
  }

  const projects = (projectsResult.data ?? []) as ProjectStatusRow[];
  const tasks = (tasksResult.data ?? []) as TaskStatusRow[];
  const incomeRows = (incomeRowsResult.data ?? []) as IncomeStatusRow[];

  const projectCounts = projects.reduce(
    (acc, row) => {
      acc[row.status] += 1;
      return acc;
    },
    { active: 0, paused: 0, completed: 0, archived: 0 }
  );

  const taskCounts = tasks.reduce(
    (acc, row) => {
      acc[row.status] += 1;
      return acc;
    },
    { todo: 0, in_progress: 0, done: 0, cancelled: 0 }
  );

  const incomeTotals = incomeRows.reduce(
    (acc, row) => {
      const amount = Number.isFinite(row.amount) ? row.amount : 0;
      acc.total += amount;
      acc[row.status] += amount;
      return acc;
    },
    { total: 0, pending: 0, paid: 0, overdue: 0, cancelled: 0 }
  );

  return {
    totalProjects: projects.length,
    activeProjects: projectCounts.active,
    pausedProjects: projectCounts.paused,
    completedProjects: projectCounts.completed,
    archivedProjects: projectCounts.archived,
    totalTasks: tasks.length,
    todoTasks: taskCounts.todo,
    inProgressTasks: taskCounts.in_progress,
    doneTasks: taskCounts.done,
    cancelledTasks: taskCounts.cancelled,
    totalClients: clientsResult.count ?? 0,
    totalIncomeAmount: roundCurrency(incomeTotals.total),
    paidIncomeAmount: roundCurrency(incomeTotals.paid),
    pendingIncomeAmount: roundCurrency(incomeTotals.pending),
    overdueIncomeAmount: roundCurrency(incomeTotals.overdue),
    cancelledIncomeAmount: roundCurrency(incomeTotals.cancelled)
  };
}
