import styled from "styled-components";
import { Link } from "react-router-dom";

export const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.05);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.55rem 0.8rem;
  text-decoration: none;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(2, minmax(10rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const Label = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.8rem;
  font-weight: 700;
`;

export const Value = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.96rem;
  font-weight: 800;
`;

export const Description = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.8;
`;

export const DistributionList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: grid;
  grid-template-columns: repeat(2, minmax(8rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CompactList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CompactItem = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const ItemTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.94rem;
  font-weight: 800;
`;

export const ItemMeta = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const InlineState = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 700;
`;

export const ErrorState = styled(InlineState)`
  color: #ff8e8e;
`;
