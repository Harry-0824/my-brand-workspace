import { Link } from "react-router-dom";
import styled from "styled-components";

export const LinkList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const LinkItem = styled.li`
  min-width: 0;
`;

export const StepLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(98 214 199 / 0.28);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(98 214 199 / 0.08);
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const Note = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.65;
`;
