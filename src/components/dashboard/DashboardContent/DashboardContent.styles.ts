import styled from "styled-components";

export const MainContent = styled.main`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

export const DashboardIntro = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
`;

export const WorkspaceTitle = styled.h1`
  max-width: 760px;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 3.2rem;
  line-height: 1.05;
`;

export const WorkspaceSubtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.45rem;
  font-weight: 700;
`;

export const WorkspaceStatus = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;

export const SummaryError = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: #ffb4ad;
  font-size: 0.92rem;
  line-height: 1.65;
`;

export const PrimaryGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const LeftColumn = styled.div`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const RightColumn = styled.div`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.lg};
`;
