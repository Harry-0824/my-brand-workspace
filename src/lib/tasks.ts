export const TASK_STATUS_VALUES = [
  "todo",
  "in_progress",
  "done",
  "cancelled"
] as const;

export const TASK_PRIORITY_VALUES = ["low", "medium", "high", "urgent"] as const;

export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];
export type TaskPriority = (typeof TASK_PRIORITY_VALUES)[number];

export type TaskRecord = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  status: TaskStatus;
  priority: TaskPriority | null;
  due_date: string | null;
  created_at: string;
};

export type CreateTaskInput = {
  title: string;
  status: TaskStatus;
  priority?: TaskPriority | "";
  project_id?: string;
  due_date?: string;
};

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

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

export async function fetchTasksForCurrentUser() {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("id, user_id, project_id, title, status, priority, due_date, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  return (data ?? []) as TaskRecord[];
}

export async function createTaskForCurrentUser(input: CreateTaskInput) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated and cannot create tasks.");
  }

  const normalizedPriority = input.priority?.trim();
  const payload = {
    user_id: userId,
    title: input.title.trim(),
    status: input.status,
    priority: normalizedPriority ? normalizedPriority : null,
    project_id: normalizeOptionalText(input.project_id),
    due_date: normalizeOptionalText(input.due_date)
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select("id, user_id, project_id, title, status, priority, due_date, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return data as TaskRecord;
}
