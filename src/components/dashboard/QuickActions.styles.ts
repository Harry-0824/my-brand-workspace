import { Link } from "react-router-dom";
import styled from "styled-components";

export const ActionsGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ActionCard = styled(Link)`
  display: block;
  width: 100%;
  text-align: left;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const ActionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ActionTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

export const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(98 214 199 / 0.32);
  border-radius: 999px;
  color: ${({ theme }) => theme.accent};
  background: rgb(98 214 199 / 0.12);
  font-size: 0.72rem;
  font-weight: 800;
`;

export const ActionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.7;
`;
