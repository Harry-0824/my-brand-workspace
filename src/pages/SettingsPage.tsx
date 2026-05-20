import {
  List,
  ListRow,
  Label,
  Value,
  CardGrid,
  Card,
  CardTitle,
  CardDetail
} from "./SettingsPage.styles";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import {
  accountPreferences,
  billingStatus,
  notificationPreferences,
  workspaceProfile
} from "./data/settingsPageData";

export function SettingsPage() {
  return (
    <PageMain aria-labelledby="settings-page-title">
      <PageHeader>
        <PageTitle id="settings-page-title">設定</PageTitle>
        <PageDescription>
          管理工作區基本資訊、通知偏好與帳務狀態的靜態頁面殼層。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="settings-workspace-title">
        <DashboardSectionHeader
          titleId="settings-workspace-title"
          title="工作區設定"
          description="管理目前工作區的基本資訊與角色定位。"
          withDivider
        />
        <List>
          {workspaceProfile.map((item) => (
            <ListRow key={item.label}>
              <Label>{item.label}</Label>
              <Value>{item.value}</Value>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="settings-notification-title">
        <DashboardSectionHeader
          titleId="settings-notification-title"
          title="通知偏好"
          description="以下為通知類型靜態示意，尚未接入實際通知流程。"
          withDivider
        />
        <CardGrid>
          {notificationPreferences.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardDetail>{item.detail}</CardDetail>
            </Card>
          ))}
        </CardGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="settings-account-title">
        <DashboardSectionHeader
          titleId="settings-account-title"
          title="帳號偏好"
          description="語言、時區與外觀設定僅為版面示意。"
          withDivider
        />
        <List>
          {accountPreferences.map((item) => (
            <ListRow key={item.label}>
              <Label>{item.label}</Label>
              <Value>{item.value}</Value>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="settings-billing-title">
        <DashboardSectionHeader
          titleId="settings-billing-title"
          title="方案與帳務"
          description="顯示目前方案與帳務狀態的靜態佔位資訊。"
          withDivider
        />
        <List>
          {billingStatus.map((item) => (
            <ListRow key={item.label}>
              <Label>{item.label}</Label>
              <Value>{item.value}</Value>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>
    </PageMain>
  );
}
