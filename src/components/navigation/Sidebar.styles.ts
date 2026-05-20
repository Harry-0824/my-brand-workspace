import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const SidebarShell = styled.nav`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.035), transparent 36rem),
    ${({ theme }) => theme.surface};
`;

export const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.xl};
`;

export const BrandMark = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border: 1px solid rgb(98 214 199 / 0.38);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(98 214 199 / 0.12);
  color: ${({ theme }) => theme.accent};
  font-weight: 800;
`;

export const BrandText = styled.div`
  min-width: 0;
`;

export const BrandName = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

export const BrandMeta = styled.p`
  margin-top: 0.15rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.78rem;
`;

export const NavList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0;
  list-style: none;
`;

export const NavListItem = styled.li`
  min-width: 0;
`;

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.94rem;
  font-weight: 600;
  text-decoration: none;

  &.active {
    border-color: rgb(98 214 199 / 0.36);
    background: rgb(98 214 199 / 0.12);
    color: ${({ theme }) => theme.textPrimary};
    font-weight: 800;
  }
`;

export const NavIcon = styled.span`
  width: 0.62rem;
  height: 0.62rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.72;
`;

export const NavDivider = styled.hr`
  margin: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
`;
