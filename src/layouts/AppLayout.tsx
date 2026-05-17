import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import type { AuthUser } from "../lib/auth";
import {
  getAuthSessionUser,
  subscribeToAuthSessionUserChanges
} from "../lib/auth";
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
        setAuthError(message);
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

  return (
    <LayoutShell>
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
