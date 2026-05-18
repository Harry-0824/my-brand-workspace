import { useMemo, useState } from "react";
import styled from "styled-components";
import type { AuthUser } from "../../lib/auth";
import {
  signInWithEmailPassword,
  signOutCurrentUser,
  signUpWithEmailPassword
} from "../../lib/auth";

type AuthMode = "signin" | "signup";

type AuthPanelProps = {
  user: AuthUser | null;
  isChecking: boolean;
  authError: string | null;
};

const REQUIRED_FIELDS_MESSAGE = "請輸入 Email 與密碼。";
const SIGNUP_CONFIRMATION_MESSAGE = "註冊成功，請先完成 Email 驗證後再登入。";
const SIGNUP_SUCCESS_MESSAGE = "註冊成功，已可使用帳號登入。";

export function AuthPanel({ user, isChecking, authError }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);

  const submitLabel = useMemo(() => {
    if (mode === "signup") {
      return isSubmitting ? "註冊中..." : "註冊";
    }

    return isSubmitting ? "登入中..." : "登入";
  }, [isSubmitting, mode]);

  function switchMode(nextMode: AuthMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setLocalError(null);
    setSignupMessage(null);
    setPassword("");
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    setSignupMessage(null);

    if (!email.trim() || !password.trim()) {
      setLocalError(REQUIRED_FIELDS_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const result = await signUpWithEmailPassword({ email, password });
        setSignupMessage(
          result.needsEmailConfirmation ? SIGNUP_CONFIRMATION_MESSAGE : SIGNUP_SUCCESS_MESSAGE
        );
      } else {
        await signInWithEmailPassword({ email, password });
      }

      setPassword("");
    } catch (error) {
      if (mode === "signup") {
        const message =
          error instanceof Error ? error.message : "註冊失敗，請稍後再試。";
        setLocalError(message);
      } else {
        const message =
          error instanceof Error ? error.message : "登入失敗，請稍後再試。";
        setLocalError(message);
      }
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
    <AuthForm onSubmit={(event) => void handleAuthSubmit(event)}>
      <ModeSwitchGroup>
        <ModeButton
          type="button"
          onClick={() => switchMode("signin")}
          data-testid="auth-mode-signin"
          $active={mode === "signin"}
        >
          登入
        </ModeButton>
        <ModeButton
          type="button"
          onClick={() => switchMode("signup")}
          data-testid="auth-mode-signup"
          $active={mode === "signup"}
        >
          註冊
        </ModeButton>
      </ModeSwitchGroup>

      <AuthInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        data-testid="auth-email-input"
      />
      <AuthInput
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        data-testid="auth-password-input"
      />
      <ActionButton type="submit" disabled={isSubmitting} data-testid="auth-submit-button">
        {submitLabel}
      </ActionButton>

      {authError ? <StateError data-testid="auth-session-error">{authError}</StateError> : null}
      {localError ? <StateError data-testid="auth-local-error">{localError}</StateError> : null}
      {signupMessage ? (
        <StateSuccess data-testid="auth-signup-message">{signupMessage}</StateSuccess>
      ) : null}
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

const AuthForm = styled.form`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ModeSwitchGroup = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  min-height: 2.75rem;
  min-width: 3.9rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $active }) =>
    $active ? "rgb(98 214 199 / 0.16)" : theme.surfaceElevated};
  color: ${({ theme, $active }) => ($active ? theme.accent : theme.textSecondary)};
  font-size: 0.82rem;
  font-weight: 800;
`;

const AuthInput = styled.input`
  width: 10rem;
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.84rem;
`;

const ActionButton = styled.button`
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

const StateSuccess = styled.p`
  color: #9ad7cb;
  font-size: 0.8rem;
  font-weight: 700;
`;
