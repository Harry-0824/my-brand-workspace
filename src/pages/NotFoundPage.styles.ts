import { Link } from "react-router-dom";
import styled from "styled-components";

export const NoticeCard = styled.section`
  max-width: 38rem;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const NoticeTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 2rem;
  font-weight: 800;
`;

export const NoticeText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.75;
`;

export const BackHomeLink = styled(Link)`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: 0.5rem 0.9rem;
  border: 1px solid rgb(98 214 199 / 0.35);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(98 214 199 / 0.12);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 700;
`;
