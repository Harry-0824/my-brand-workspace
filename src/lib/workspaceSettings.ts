import { supabase } from "./supabase";

export const DEFAULT_WORKSPACE_NAME = "My Workspace";
export const DEFAULT_WORKSPACE_CURRENCY = "TWD";

export type WorkspaceSettingsRow = {
  id: string;
  user_id: string;
  workspace_name: string;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
};

export type WorkspaceSettingsBootstrapResult =
  | { status: "unauthenticated"; data: null }
  | { status: "existing" | "created"; data: WorkspaceSettingsRow };

export async function bootstrapWorkspaceSettings(): Promise<WorkspaceSettingsBootstrapResult> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw authError;
  }

  const user = authData.user;
  if (!user) {
    return { status: "unauthenticated", data: null };
  }

  const { data: existingSettings, error: existingSettingsError } = await supabase
    .from("workspace_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingSettingsError) {
    throw existingSettingsError;
  }

  if (existingSettings) {
    return { status: "existing", data: existingSettings as WorkspaceSettingsRow };
  }

  const { data: createdSettings, error: createSettingsError } = await supabase
    .from("workspace_settings")
    .insert({
      user_id: user.id,
      workspace_name: DEFAULT_WORKSPACE_NAME,
      preferred_currency: DEFAULT_WORKSPACE_CURRENCY
    })
    .select("*")
    .single();

  if (createSettingsError) {
    throw createSettingsError;
  }

  return { status: "created", data: createdSettings as WorkspaceSettingsRow };
}
