export const CLIENT_STATUS_VALUES = [
  "active",
  "inactive",
  "lead",
  "archived"
] as const;

export type ClientStatus = (typeof CLIENT_STATUS_VALUES)[number];

export type ClientRecord = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: ClientStatus;
  notes: string | null;
  created_at: string;
};

export type CreateClientInput = {
  name: string;
  email?: string;
  company?: string;
  status: ClientStatus;
  notes?: string;
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

export async function fetchClientsForCurrentUser() {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("clients")
    .select("id, user_id, name, email, company, status, notes, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch clients: ${error.message}`);
  }

  return (data ?? []) as ClientRecord[];
}

export async function createClientForCurrentUser(input: CreateClientInput) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated and cannot create clients.");
  }

  const payload = {
    user_id: userId,
    name: input.name.trim(),
    email: normalizeOptionalText(input.email),
    company: normalizeOptionalText(input.company),
    status: input.status,
    notes: normalizeOptionalText(input.notes)
  };

  const { data, error } = await supabase
    .from("clients")
    .insert(payload)
    .select("id, user_id, name, email, company, status, notes, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to create client: ${error.message}`);
  }

  return data as ClientRecord;
}
