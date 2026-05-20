import styled from "styled-components";

export const LoginGateShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background:
    radial-gradient(circle at 78% 18%, rgb(98 214 199 / 0.12), transparent 28rem),
    ${({ theme }) => theme.background};
`;

export const LoginGatePanel = styled.section`
  width: min(100%, 28rem);
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgb(16 23 33 / 0.88);
  box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.28);
`;

export const LoginGateEyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const LoginGateTitle = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.8rem;
  line-height: 1.15;
`;

export const LoginGateCopy = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

export const LayoutShell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
  background:
    radial-gradient(circle at 82% 12%, rgb(98 214 199 / 0.1), transparent 28rem),
    ${({ theme }) => theme.background};
`;

export const ContentArea = styled.div`
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  border-left: 1px solid ${({ theme }) => theme.border};
`;
