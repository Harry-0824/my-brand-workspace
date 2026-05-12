export const workspaceProfile = [
  { label: "工作區名稱", value: "My Brand Workspace" },
  { label: "擁有者", value: "Harry" },
  { label: "角色定位", value: "自由接案設計與前端開發" }
] as const;

export const notificationPreferences = [
  { title: "Email 提醒", detail: "新任務與重要更新通知" },
  { title: "任務到期提醒", detail: "到期前 24 小時提醒（示意）" },
  { title: "收款提醒", detail: "待收款項目週期提醒（示意）" }
] as const;

export const accountPreferences = [
  { label: "語言", value: "繁體中文（示意）" },
  { label: "時區", value: "Asia/Taipei（示意）" },
  { label: "外觀", value: "深色低負擔主題（示意）" }
] as const;

export const billingStatus = [
  { label: "方案", value: "Solo Workspace" },
  { label: "帳務狀態", value: "啟用中（示意）" }
] as const;
