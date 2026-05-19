import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import type { AuthUser } from "../lib/auth";
import {
  getAuthSessionUser,
  subscribeToAuthSessionUserChanges
} from "../lib/auth";
import { getUserFacingErrorMessage } from "../lib/errorMessages";
import { AuthPanel } from "../components/auth/AuthPanel";
import { AppHeader } from "../components/navigation/AppHeader";
import { Sidebar } from "../components/navigation/Sidebar";

export function AppLayout() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => {};

    async function initializeAuth() {
      setIsAuthChecking(true);
      setAuthError(null);

      try {
        const currentUser = await getAuthSessionUser();
        if (!active) {
          return;
        }
        setAuthUser(currentUser);

        unsubscribe = await subscribeToAuthSessionUserChanges((nextUser) => {
          if (!active) {
            return;
          }
          setAuthUser(nextUser);
          setAuthError(null);
        });
      } catch (error) {
        if (!active) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "目前無法讀取登入狀態，請稍後再試。";
        setAuthError(getUserFacingErrorMessage(error, message));
        setAuthUser(null);
      } finally {
        if (active) {
          setIsAuthChecking(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (isAuthChecking || !authUser) {
    return (
      <LoginGateShell data-testid="private-login-gate">
        <LoginGatePanel>
          <LoginGateEyebrow>Private Workspace</LoginGateEyebrow>
          <LoginGateTitle>私人工作台登入</LoginGateTitle>
          <LoginGateCopy>
            請使用已建立的帳號登入後，再進入 Dashboard、專案、客戶、任務、收款與報表。
          </LoginGateCopy>
          <AuthPanel
            user={authUser}
            isChecking={isAuthChecking}
            authError={authError}
            variant="gate"
          />
        </LoginGatePanel>
      </LoginGateShell>
    );
  }

  return (
    <LayoutShell data-testid="private-workspace-shell">
      <Sidebar />
      <ContentArea>
        <AppHeader
          authUser={authUser}
          isAuthChecking={isAuthChecking}
          authError={authError}
        />
        <Outlet key={authUser?.id ?? "guest"} />
      </ContentArea>
    </LayoutShell>
  );
}

const LoginGateShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background:
    radial-gradient(circle at 78% 18%, rgb(98 214 199 / 0.12), transparent 28rem),
    ${({ theme }) => theme.background};
`;

const LoginGatePanel = styled.section`
  width: min(100%, 28rem);
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgb(16 23 33 / 0.88);
  box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.28);
`;

const LoginGateEyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const LoginGateTitle = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.8rem;
  line-height: 1.15;
`;

const LoginGateCopy = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

const LayoutShell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
  background:
    radial-gradient(circle at 82% 12%, rgb(98 214 199 / 0.1), transparent 28rem),
    ${({ theme }) => theme.background};
`;

const ContentArea = styled.div`
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  border-left: 1px solid ${({ theme }) => theme.border};
`;
