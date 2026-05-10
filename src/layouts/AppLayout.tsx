import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/navigation/AppHeader";
import { Sidebar } from "../components/navigation/Sidebar";

export function AppLayout() {
  return (
    <LayoutShell>
      <Sidebar />
      <ContentArea>
        <AppHeader />
        <Outlet />
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
