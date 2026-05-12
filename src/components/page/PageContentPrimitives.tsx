import styled from "styled-components";

export const PageMetricGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const PageMetricCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const PageMetricLabel = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const PageMetricValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.15rem;
  font-weight: 800;
`;

export const PageList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PageListCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const PageNote = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(98 214 199 / 0.25);
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(98 214 199 / 0.08);
  font-size: 0.9rem;
  line-height: 1.7;
`;
