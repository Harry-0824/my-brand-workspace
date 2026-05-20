import { Link } from "react-router-dom";
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

export const StaticNote = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  line-height: 1.65;
`;

export const QuickStartLink = styled(Link)`
  display: block;
  text-decoration: none;

  &:hover ${RowTitle},
  &:focus-visible ${RowTitle} {
    text-decoration: underline;
  }
`;

export const CardGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Card = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 800;
`;

export const CardDetail = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  line-height: 1.65;
`;
