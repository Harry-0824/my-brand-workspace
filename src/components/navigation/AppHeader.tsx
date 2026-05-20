import type { AuthUser } from "../../lib/auth";
import { AuthPanel } from "../auth/AuthPanel";
import {
  CreateHint,
  GearIcon,
  HeaderActions,
  HeaderShell,
  PageTitle,
  SearchIcon,
  SearchInput,
  SearchLabel,
  SettingsLink,
  TitleGroup,
  NotificationIcon
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
        <CreateHint title="新增請使用各頁面的新增表單">頁面內新增</CreateHint>
        <NotificationIcon
          aria-label="通知功能尚未啟用"
          role="img"
          title="通知功能尚未啟用"
        />
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
