import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAuthSessionUser,
  signInWithEmailPassword,
  signOutCurrentUser,
  signUpWithEmailPassword,
  subscribeToAuthSessionUserChanges
} from "./auth";

const mockGetSession = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockUnsubscribe = vi.fn();

function makeFixtureCredential() {
  return ["fixture", "credential"].join("-");
}

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
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
    const testCredential = makeFixtureCredential();
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

  it("signs up with email and password and reports confirmation requirement", async () => {
    const testCredential = makeFixtureCredential();
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: "user-3", email: "new@example.com" },
        session: null
      },
      error: null
    });

    await expect(
      signUpWithEmailPassword({
        email: " new@example.com ",
        password: testCredential
      })
    ).resolves.toEqual({
      user: {
        id: "user-3",
        email: "new@example.com"
      },
      needsEmailConfirmation: true
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "new@example.com",
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
      user: { id: "user-4", email: "signed@example.com" }
    });
    callbackHolder.callback?.("SIGNED_OUT", null);

    expect(onChange).toHaveBeenNthCalledWith(1, {
      id: "user-4",
      email: "signed@example.com"
    });
    expect(onChange).toHaveBeenNthCalledWith(2, null);

    unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
