import { useState } from "react";
import styled from "styled-components";
import type { AuthUser } from "../../lib/auth";
import {
  signInWithEmailPassword,
  signOutCurrentUser
} from "../../lib/auth";

type AuthPanelVariant = "header" | "gate";

type AuthPanelProps = {
  user: AuthUser | null;
  isChecking: boolean;
  authError: string | null;
  variant?: AuthPanelVariant;
};

const REQUIRED_FIELDS_MESSAGE = "請填寫 Email 與密碼。";

export function AuthPanel({
  user,
  isChecking,
  authError,
  variant = "header"
}: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError(REQUIRED_FIELDS_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailPassword({ email, password });
      setPassword("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "登入失敗，請稍後再試。";
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await signOutCurrentUser();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "登出失敗，請稍後再試。";
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return <StateText data-testid="auth-session-loading">正在確認登入狀態...</StateText>;
  }

  if (user) {
    return (
      <SignedInShell>
        <UserBadge data-testid="auth-user-badge">
          {user.email ?? "已登入使用者"}
        </UserBadge>
        <ActionButton
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isSubmitting}
          data-testid="auth-signout-button"
        >
          {isSubmitting ? "登出中..." : "登出"}
        </ActionButton>
      </SignedInShell>
    );
  }

  return (
    <AuthForm
      onSubmit={(event) => void handleAuthSubmit(event)}
      $variant={variant}
    >
      <AuthInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        data-testid="auth-email-input"
        $variant={variant}
      />
      <AuthInput
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        data-testid="auth-password-input"
        $variant={variant}
      />
      <ActionButton
        type="submit"
        disabled={isSubmitting}
        data-testid="auth-submit-button"
        $variant={variant}
      >
        {isSubmitting ? "登入中..." : "登入"}
      </ActionButton>

      {authError ? <StateError data-testid="auth-session-error">{authError}</StateError> : null}
      {localError ? <StateError data-testid="auth-local-error">{localError}</StateError> : null}
    </AuthForm>
  );
}

const SignedInShell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserBadge = styled.span`
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.86rem;
  font-weight: 800;
`;

const AuthForm = styled.form<{ $variant: AuthPanelVariant }>`
  width: ${({ $variant }) => ($variant === "gate" ? "100%" : "auto")};
  display: ${({ $variant }) => ($variant === "gate" ? "flex" : "inline-flex")};
  flex-direction: ${({ $variant }) => ($variant === "gate" ? "column" : "row")};
  align-items: ${({ $variant }) => ($variant === "gate" ? "stretch" : "center")};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthInput = styled.input<{ $variant: AuthPanelVariant }>`
  width: ${({ $variant }) => ($variant === "gate" ? "100%" : "10rem")};
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.84rem;
`;

const ActionButton = styled.button<{ $variant?: AuthPanelVariant }>`
  width: ${({ $variant }) => ($variant === "gate" ? "100%" : "auto")};
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.accent};
  color: #071111;
  font-size: 0.86rem;
  font-weight: 800;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StateText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

const StateError = styled.p`
  color: #ffb4ad;
  font-size: 0.8rem;
  font-weight: 700;
`;
