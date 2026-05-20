import styled from "styled-components";

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

export const CategoryGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const CategoryCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const CategoryTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 800;
`;

export const CategoryCount = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
`;
