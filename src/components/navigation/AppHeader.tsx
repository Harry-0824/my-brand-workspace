import type { AuthUser } from "../../lib/auth";
import { AuthPanel } from "../auth/AuthPanel";
import {
  GearIcon,
  HeaderActions,
  HeaderShell,
  PageTitle,
  SearchIcon,
  SearchInput,
  SearchLabel,
  SettingsLink,
  TitleGroup
} from "./AppHeader.styles";

type AppHeaderProps = {
  authUser: AuthUser | null;
  isAuthChecking: boolean;
  authError: string | null;
};

export function AppHeader({ authUser, isAuthChecking, authError }: AppHeaderProps) {
  return (
    <HeaderShell>
      <TitleGroup>
        <PageTitle>儀表板</PageTitle>
      </TitleGroup>

      <HeaderActions>
        <SearchLabel>
          <SearchIcon aria-hidden="true" />
          <SearchInput type="search" placeholder="搜尋專案、任務或客戶..." />
        </SearchLabel>
        <SettingsLink to="/settings" aria-label="設定">
          <GearIcon aria-hidden="true" />
        </SettingsLink>
        <AuthPanel
          user={authUser}
          isChecking={isAuthChecking}
          authError={authError}
        />
      </HeaderActions>
    </HeaderShell>
  );
}
