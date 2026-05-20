import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import type { AuthUser } from "../lib/auth";
import {
  getAuthSessionUser,
  subscribeToAuthSessionUserChanges
} from "../lib/auth";
import { getUserFacingErrorMessage } from "../lib/errorMessages";
import { AuthPanel } from "../components/auth/AuthPanel";
import { AppHeader } from "../components/navigation/AppHeader";
import { BackToTopButton } from "../components/navigation/BackToTopButton";
import { Sidebar } from "../components/navigation/Sidebar";
import {
  ContentArea,
  LayoutShell,
  LoginGateCopy,
  LoginGateEyebrow,
  LoginGatePanel,
  LoginGateShell,
  LoginGateTitle
} from "./AppLayout.styles";

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
            此私人工作台不開放公開註冊。請先由管理者在 Supabase Auth
            建立帳號，再使用該帳號登入後，進入 Dashboard、專案、客戶、任務、收款與報表。
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
        <BackToTopButton />
      </ContentArea>
    </LayoutShell>
  );
}
