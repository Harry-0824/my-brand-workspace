import styled from "styled-components";
import { DashboardPanel } from "./shared/DashboardPanel";

export const NextActionPanel = styled(DashboardPanel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NextActionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const NextActionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const NextActionBadge = styled.span<{ $type: string }>`
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  border: 1px solid;

  ${({ $type, theme }) => {
    switch ($type) {
      case "danger":
        return `
          color: ${theme.danger};
          background: rgb(255 107 107 / 0.12);
          border-color: rgb(255 107 107 / 0.32);
        `;
      case "warning":
        return `
          color: ${theme.warning};
          background: rgb(246 200 95 / 0.12);
          border-color: rgb(246 200 95 / 0.32);
        `;
      case "success":
        return `
          color: ${theme.success};
          background: rgb(92 207 141 / 0.12);
          border-color: rgb(92 207 141 / 0.32);
        `;
      case "task":
        return `
          color: ${theme.accent};
          background: rgb(98 214 199 / 0.12);
          border-color: rgb(98 214 199 / 0.32);
        `;
      case "project":
        return `
          color: #79b3ff;
          background: rgb(121 179 255 / 0.12);
          border-color: rgb(121 179 255 / 0.32);
        `;
      case "money":
        return `
          color: #ff9f43;
          background: rgb(255 159 67 / 0.12);
          border-color: rgb(255 159 67 / 0.32);
        `;
      default: // info
        return `
          color: ${theme.textSecondary};
          background: rgb(255 255 255 / 0.05);
          border-color: rgb(255 255 255 / 0.15);
        `;
    }
  }}
`;

export const NextActionTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.4;
`;

export const NextActionDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.7;
  margin: ${({ theme }) => theme.spacing.xs} 0
    ${({ theme }) => theme.spacing.md} 0;
`;

export const CtaButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const PrimaryCtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 800;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.accent};
  color: #080d14;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

export const SecondaryCtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 800;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease-in-out;

  &:hover {
    background: rgb(255 255 255 / 0.05);
  }
`;

export const LoadingState = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const ErrorState = styled.p`
  color: #ffb4ad;
  font-size: 0.92rem;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;
