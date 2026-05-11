import { NavLink } from "react-router-dom";
import styled from "styled-components";

const navItems = [
  { label: "儀表板", to: "/" },
  { label: "專案", to: "/projects" },
  { label: "任務", to: "/tasks" },
  { label: "客戶", to: "/clients" },
  { label: "收款", to: "/invoices" },
  { label: "行事曆", to: "/calendar" },
  { label: "報表", to: "/reports" },
  { label: "設定", to: "/settings" }
] as const;

export function Sidebar() {
  return (
    <SidebarShell aria-label="主要導航">
      <BrandBlock>
        <BrandMark aria-hidden="true">M</BrandMark>
        <BrandText>
          <BrandName>My Brand</BrandName>
          <BrandMeta>Workspace</BrandMeta>
        </BrandText>
      </BrandBlock>

      <NavList>
        {navItems.map((item) => {
          const isRoot = item.to === "/";

          return (
            <NavListItem key={item.label}>
              <NavItem
                to={item.to}
                end={isRoot}
              >
                <NavIcon aria-hidden="true" />
                <span>{item.label}</span>
              </NavItem>
            </NavListItem>
          );
        })}
      </NavList>
    </SidebarShell>
  );
}

const SidebarShell = styled.nav`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.035), transparent 36rem),
    ${({ theme }) => theme.surface};
`;

const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
`;

const BrandMark = styled.div`
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

const BrandText = styled.div`
  min-width: 0;
`;

const BrandName = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

const BrandMeta = styled.p`
  margin-top: 0.15rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.78rem;
`;

const NavList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0;
  list-style: none;
`;

const NavListItem = styled.li`
  min-width: 0;
`;

const NavItem = styled(NavLink)`
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

const NavIcon = styled.span`
  width: 0.62rem;
  height: 0.62rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.72;
`;
