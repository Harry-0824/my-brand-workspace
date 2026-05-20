import styled from "styled-components";

type AuthPanelStyleVariant = "header" | "gate";

export const SignedInShell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const UserBadge = styled.span`
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.86rem;
  font-weight: 800;
`;

export const AuthForm = styled.form<{ $variant: AuthPanelStyleVariant }>`
  width: ${({ $variant }) => ($variant === "gate" ? "100%" : "auto")};
  display: ${({ $variant }) => ($variant === "gate" ? "flex" : "inline-flex")};
  flex-direction: ${({ $variant }) => ($variant === "gate" ? "column" : "row")};
  align-items: ${({ $variant }) => ($variant === "gate" ? "stretch" : "center")};
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const AuthInput = styled.input<{ $variant: AuthPanelStyleVariant }>`
  width: ${({ $variant }) => ($variant === "gate" ? "100%" : "10rem")};
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.84rem;
`;

export const ActionButton = styled.button<{ $variant?: AuthPanelStyleVariant }>`
  width: ${({ $variant }) => ($variant === "gate" ? "100%" : "auto")};
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.accent};
  color: #071111;
  font-size: 0.86rem;
  font-weight: 800;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const StateText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const StateError = styled.p`
  color: #ffb4ad;
  font-size: 0.8rem;
  font-weight: 700;
`;
