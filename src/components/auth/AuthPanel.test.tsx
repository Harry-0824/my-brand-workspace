import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { theme } from "../../styles/theme";
import { AuthPanel } from "./AuthPanel";

const mockSignInWithEmailPassword = vi.fn();
const mockSignOutCurrentUser = vi.fn();

vi.mock("../../lib/auth", async () => {
  const actual = await vi.importActual("../../lib/auth");
  return {
    ...actual,
    signInWithEmailPassword: (...args: unknown[]) => mockSignInWithEmailPassword(...args),
    signOutCurrentUser: (...args: unknown[]) => mockSignOutCurrentUser(...args)
  };
});

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockSignInWithEmailPassword.mockResolvedValue({
    id: "user-1",
    email: "demo@example.com"
  });
  mockSignOutCurrentUser.mockResolvedValue(true);
});

function renderAuthPanel(props?: {
  user?: { id: string; email: string | null } | null;
  isChecking?: boolean;
  authError?: string | null;
}) {
  render(
    <ThemeProvider theme={theme}>
      <AuthPanel
        user={props?.user ?? null}
        isChecking={props?.isChecking ?? false}
        authError={props?.authError ?? null}
      />
    </ThemeProvider>
  );
}

describe("AuthPanel", () => {
  it("shows checking state", () => {
    renderAuthPanel({ isChecking: true });
    expect(screen.getByTestId("auth-session-loading")).toBeInTheDocument();
  });

  it("signs in with email and password", async () => {
    renderAuthPanel();

    fireEvent.change(screen.getByTestId("auth-email-input"), {
      target: { value: "demo@example.com" }
    });
    fireEvent.change(screen.getByTestId("auth-password-input"), {
      target: { value: "pw123456" }
    });
    fireEvent.click(screen.getByTestId("auth-signin-button"));

    await waitFor(() => {
      expect(mockSignInWithEmailPassword).toHaveBeenCalledTimes(1);
    });
    expect(mockSignInWithEmailPassword).toHaveBeenCalledWith({
      email: "demo@example.com",
      password: "pw123456"
    });
  });

  it("shows signed-in state and can sign out", async () => {
    renderAuthPanel({
      user: { id: "user-1", email: "demo@example.com" }
    });

    expect(screen.getByTestId("auth-user-badge")).toHaveTextContent("demo@example.com");
    fireEvent.click(screen.getByTestId("auth-signout-button"));

    await waitFor(() => {
      expect(mockSignOutCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  it("shows session or local error in unauthenticated state", async () => {
    mockSignInWithEmailPassword.mockRejectedValueOnce(
      new Error("invalid login credentials")
    );

    renderAuthPanel({ authError: "failed to read auth session" });
    expect(screen.getByTestId("auth-session-error")).toHaveTextContent(
      "failed to read auth session"
    );

    fireEvent.change(screen.getByTestId("auth-email-input"), {
      target: { value: "demo@example.com" }
    });
    fireEvent.change(screen.getByTestId("auth-password-input"), {
      target: { value: "pw123456" }
    });
    fireEvent.click(screen.getByTestId("auth-signin-button"));

    await waitFor(() => {
      expect(screen.getByTestId("auth-local-error")).toHaveTextContent(
        "invalid login credentials"
      );
    });
  });
});
