import {
  PRIMARY_SIDEBAR_ROUTES,
  SECONDARY_SIDEBAR_ROUTES,
} from "../../app/routes";
import {
  BrandBlock,
  BrandMark,
  BrandMeta,
  BrandName,
  BrandText,
  NavDivider,
  NavIcon,
  NavItem,
  NavList,
  NavListItem,
  SidebarShell
} from "./Sidebar.styles";

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
        {PRIMARY_SIDEBAR_ROUTES.map((item) => {
          const isRoot = item.path === "/";

          return (
            <NavListItem key={item.key}>
              <NavItem to={item.path} end={isRoot}>
                <NavIcon aria-hidden="true" />
                <span>{item.label}</span>
              </NavItem>
            </NavListItem>
          );
        })}
      </NavList>

      <NavDivider />

      <NavList>
        {SECONDARY_SIDEBAR_ROUTES.map((item) => (
          <NavListItem key={item.key}>
            <NavItem to={item.path}>
              <NavIcon aria-hidden="true" />
              <span>{item.label}</span>
            </NavItem>
          </NavListItem>
        ))}
      </NavList>
    </SidebarShell>
  );
}
