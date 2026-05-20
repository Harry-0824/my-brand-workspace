import styled from "styled-components";

export const WeekGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const WeekCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const WeekDay = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

export const WeekItem = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.88rem;
  font-weight: 700;
`;

export const WeekMeta = styled.p`
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.8rem;
`;

export const RowTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 800;
`;

export const RowMeta = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
`;
