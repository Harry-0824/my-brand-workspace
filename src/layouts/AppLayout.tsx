import styled from "styled-components";
import { AppHeader } from "../components/navigation/AppHeader";
import { Sidebar } from "../components/navigation/Sidebar";

export function AppLayout() {
  return (
    <LayoutShell>
      <Sidebar />
      <ContentArea>
        <AppHeader />
        <MainContent aria-labelledby="workspace-title">
          <PlaceholderPanel>
            <WorkspaceTitle id="workspace-title">My Brand Workspace</WorkspaceTitle>
            <WorkspaceSubtitle>單人接案任務管理工作區</WorkspaceSubtitle>
            <WorkspaceStatus>Dashboard layout shell ready.</WorkspaceStatus>
          </PlaceholderPanel>
        </MainContent>
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

const MainContent = styled.main`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const PlaceholderPanel = styled.section`
  min-height: calc(100vh - 8.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4.5rem);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.025)),
    ${({ theme }) => theme.surface};
  box-shadow: 0 28px 70px rgb(0 0 0 / 0.28);
`;

const WorkspaceTitle = styled.h1`
  max-width: 760px;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 4rem;
  line-height: 1;
`;

const WorkspaceSubtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.45rem;
  font-weight: 700;
`;

const WorkspaceStatus = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;
