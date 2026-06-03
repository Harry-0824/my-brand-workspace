export const INCOME_RECORD_STATUS_VALUES = [
  "pending",
  "paid",
  "overdue",
  "cancelled"
] as const;

export type IncomeRecordStatus = (typeof INCOME_RECORD_STATUS_VALUES)[number];

export type IncomeRecord = {
  id: string;
  user_id: string;
  project_id: string | null;
  client_id: string | null;
  title: string;
  amount: number;
  status: IncomeRecordStatus;
  due_date: string | null;
  received_date: string | null;
  notes: string | null;
  created_at: string;
};

type IncomeRecordRow = Omit<IncomeRecord, "amount"> & {
  amount: number | string;
};

export type CreateIncomeRecordInput = {
  title: string;
  amount: string;
  status: IncomeRecordStatus;
  project_id?: string;
  client_id?: string;
  due_date?: string;
  received_date?: string;
  notes?: string;
};

export type UpdateIncomeRecordInput = {
  title: string;
  amount: string;
  status: IncomeRecordStatus;
  project_id?: string;
  client_id?: string;
  due_date?: string;
  received_date?: string;
  notes?: string;
};

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeAmount(value: string) {
  const normalized = value.trim();
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error("Amount must be a valid number.");
  }

  if (parsed < 0) {
    throw new Error("Amount cannot be negative.");
  }

  return parsed;
}

function mapIncomeRecordRow(row: IncomeRecordRow): IncomeRecord {
  const amount =
    typeof row.amount === "number"
      ? row.amount
      : Number.parseFloat(row.amount as string);

  return {
    ...row,
    amount: Number.isFinite(amount) ? amount : 0
  };
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

export async function fetchIncomeRecordsForCurrentUser() {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("income_records")
    .select(
      "id, user_id, project_id, client_id, title, amount, status, due_date, received_date, notes, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch income records: ${error.message}`);
  }

  return ((data ?? []) as IncomeRecordRow[]).map(mapIncomeRecordRow);
}

export async function fetchIncomeRecordsForProjectForCurrentUser(
  projectId: string
) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("income_records")
    .select(
      "id, user_id, project_id, client_id, title, amount, status, due_date, received_date, notes, created_at"
    )
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch project income records: ${error.message}`);
  }

  return ((data ?? []) as IncomeRecordRow[]).map(mapIncomeRecordRow);
}

export async function createIncomeRecordForCurrentUser(
  input: CreateIncomeRecordInput
) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated and cannot create income records.");
  }

  const payload = {
    user_id: userId,
    title: input.title.trim(),
    amount: normalizeAmount(input.amount),
    status: input.status,
    project_id: normalizeOptionalText(input.project_id),
    client_id: normalizeOptionalText(input.client_id),
    due_date: normalizeOptionalText(input.due_date),
    received_date: normalizeOptionalText(input.received_date),
    notes: normalizeOptionalText(input.notes)
  };

  const { data, error } = await supabase
    .from("income_records")
    .insert(payload)
    .select(
      "id, user_id, project_id, client_id, title, amount, status, due_date, received_date, notes, created_at"
    )
    .single();

  if (error) {
    throw new Error(`Failed to create income record: ${error.message}`);
  }

  return mapIncomeRecordRow(data as IncomeRecordRow);
}

export async function updateIncomeRecordForCurrentUser(
  incomeRecordId: string,
  input: UpdateIncomeRecordInput
) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated and cannot update income records.");
  }

  const payload = {
    title: input.title.trim(),
    amount: normalizeAmount(input.amount),
    status: input.status,
    project_id: normalizeOptionalText(input.project_id),
    client_id: normalizeOptionalText(input.client_id),
    due_date: normalizeOptionalText(input.due_date),
    received_date: normalizeOptionalText(input.received_date),
    notes: normalizeOptionalText(input.notes)
  };

  const { data, error } = await supabase
    .from("income_records")
    .update(payload)
    .eq("id", incomeRecordId)
    .eq("user_id", userId)
    .select(
      "id, user_id, project_id, client_id, title, amount, status, due_date, received_date, notes, created_at"
    )
    .single();

  if (error) {
    throw new Error(`Failed to update income record: ${error.message}`);
  }

  return mapIncomeRecordRow(data as IncomeRecordRow);
}

export async function deleteIncomeRecordForCurrentUser(incomeRecordId: string) {
  const { supabase } = await import("./supabase");
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated and cannot delete income records.");
  }

  const { data, error } = await supabase
    .from("income_records")
    .delete()
    .eq("id", incomeRecordId)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    throw new Error(`Failed to delete income record: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Income record was not deleted. It may not exist or may not belong to the current user."
    );
  }

  return true;
}
