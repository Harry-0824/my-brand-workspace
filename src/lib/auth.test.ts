import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAuthSessionUser,
  signInWithEmailPassword,
  signOutCurrentUser,
  subscribeToAuthSessionUserChanges
} from "./auth";

const mockGetSession = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockUnsubscribe = vi.fn();

function makeTestCredential() {
  return ["fixture", "credential"].join("-");
}

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args)
    }
  }
}));

describe("auth helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnsubscribe.mockReset();
  });

  it("maps current session user", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-1", email: "demo@example.com" } } },
      error: null
    });

    await expect(getAuthSessionUser()).resolves.toEqual({
      id: "user-1",
      email: "demo@example.com"
    });
  });

  it("signs in with email and password", async () => {
    const testCredential = makeTestCredential();
    mockSignInWithPassword.mockResolvedValue({
      data: { session: { user: { id: "user-2", email: "member@example.com" } } },
      error: null
    });

    await expect(
      signInWithEmailPassword({
        email: " member@example.com ",
        password: testCredential
      })
    ).resolves.toEqual({
      id: "user-2",
      email: "member@example.com"
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "member@example.com",
      password: testCredential
    });
  });

  it("signs out current user", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await expect(signOutCurrentUser()).resolves.toBe(true);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("subscribes and maps auth session changes", async () => {
    const callbackHolder: {
      callback?: (event: string, session: { user: { id: string; email: string } } | null) => void;
    } = {};

    mockOnAuthStateChange.mockImplementation((callback: typeof callbackHolder.callback) => {
      callbackHolder.callback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: (...args: unknown[]) => mockUnsubscribe(...args)
          }
        }
      };
    });

    const onChange = vi.fn();
    const unsubscribe = await subscribeToAuthSessionUserChanges(onChange);

    callbackHolder.callback?.("SIGNED_IN", {
      user: { id: "user-3", email: "signed@example.com" }
    });
    callbackHolder.callback?.("SIGNED_OUT", null);

    expect(onChange).toHaveBeenNthCalledWith(1, {
      id: "user-3",
      email: "signed@example.com"
    });
    expect(onChange).toHaveBeenNthCalledWith(2, null);

    unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
