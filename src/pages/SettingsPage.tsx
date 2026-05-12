import styled from "styled-components";
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

const List = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ListRow = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const Label = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  font-weight: 700;
`;

const Value = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 700;
`;

const CardGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

const CardDetail = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.6;
`;
