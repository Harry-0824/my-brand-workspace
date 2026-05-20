import styled from "styled-components";

export const HeaderRoot = styled.div<{ $withDivider: boolean }>`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ $withDivider, theme }) => ($withDivider ? theme.spacing.lg : "0")};
  border-bottom: ${({ $withDivider, theme }) =>
    $withDivider ? `1px solid ${theme.border}` : "none"};
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.35rem;
  font-weight: 800;
`;

export const SectionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;
