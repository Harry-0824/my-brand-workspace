import styled from "styled-components";

export const PageMain = styled.main`
  min-height: 100vh;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.background};
`;

export const PageHeader = styled.section`
  padding: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 2.4rem;
  line-height: 1.15;
`;

export const PageDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;
