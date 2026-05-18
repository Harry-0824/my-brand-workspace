import type { Session } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string | null;
};

export type SignInWithEmailPasswordInput = {
  email: string;
  password: string;
};

function mapSessionUser(session: Session | null): AuthUser | null {
  const user = session?.user;
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email ?? null
  };
}

export async function getAuthSessionUser() {
  const { supabase } = await import("./supabase");
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Failed to read auth session: ${error.message}`);
  }

  return mapSessionUser(data.session);
}

export async function signInWithEmailPassword(input: SignInWithEmailPasswordInput) {
  const { supabase } = await import("./supabase");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password
  });

  if (error) {
    throw new Error(`Failed to sign in: ${error.message}`);
  }

  return mapSessionUser(data.session);
}

export async function signOutCurrentUser() {
  const { supabase } = await import("./supabase");
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }

  return true;
}

export async function subscribeToAuthSessionUserChanges(
  onSessionUserChange: (user: AuthUser | null) => void
) {
  const { supabase } = await import("./supabase");
  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onSessionUserChange(mapSessionUser(session));
  });

  return () => {
    subscription.unsubscribe();
  };
}
