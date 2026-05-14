export const PROJECT_STATUS_VALUES = [
  "active",
  "paused",
  "completed",
  "archived"
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];

export type ProjectRecord = {
  id: string;
  user_id: string;
  name: string;
  status: ProjectStatus;
  description: string | null;
  client_name: string | null;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
};

export type CreateProjectInput = {
  name: string;
  status: ProjectStatus;
  description?: string;
  client_name?: string;
  start_date?: string;
  due_date?: string;
};

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeOptionalDate(value?: string) {
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

export async function fetchProjectsForCurrentUser() {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, user_id, name, status, description, client_name, start_date, due_date, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return (data ?? []) as ProjectRecord[];
}

export async function createProjectForCurrentUser(input: CreateProjectInput) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated and cannot create projects.");
  }

  const payload = {
    user_id: userId,
    name: input.name.trim(),
    status: input.status,
    description: normalizeOptionalText(input.description),
    client_name: normalizeOptionalText(input.client_name),
    start_date: normalizeOptionalDate(input.start_date),
    due_date: normalizeOptionalDate(input.due_date)
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select(
      "id, user_id, name, status, description, client_name, start_date, due_date, created_at"
    )
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return data as ProjectRecord;
}
