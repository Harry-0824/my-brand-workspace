export const dashboardQuickActions = [
  {
    title: "前往專案",
    description: "查看專案進度與下一步安排。",
    to: "/projects",
    tag: "專案"
  },
  {
    title: "前往任務",
    description: "快速處理本週待辦與進行中任務。",
    to: "/tasks",
    tag: "任務"
  },
  {
    title: "前往客戶",
    description: "追蹤合作狀態與近期聯絡重點。",
    to: "/clients",
    tag: "客戶"
  },
  {
    title: "前往收款",
    description: "檢查待收款與發票狀態。",
    to: "/invoices",
    tag: "收款"
  },
  {
    title: "前往行事曆",
    description: "安排本週時段與交付節點。",
    to: "/calendar",
    tag: "排程"
  },
  {
    title: "前往檔案",
    description: "整理近期文件與交付素材。",
    to: "/files",
    tag: "檔案"
  }
] as const;

export const dashboardWorkspaceSnapshot = [
  { label: "專案總數", value: "0", note: "來自 projects 真實資料" },
  { label: "進行中專案數", value: "0", note: "依 projects active 狀態統計" },
  { label: "任務總數", value: "0", note: "來自 tasks 真實資料" },
  { label: "待處理任務數", value: "0", note: "依 todo / in_progress 狀態統計" },
  { label: "客戶總數", value: "0", note: "來自 clients 真實資料" },
  { label: "累計收款金額", value: "NT$0", note: "來自 income_records 金額加總" }
] as const;

export const dashboardWeekFocus = [
  "完成專案交付前的最終檢查與回報。",
  "優先處理本週到期任務與待審核項目。",
  "同步追蹤收款狀態與客戶回覆節奏。",
  "整理本週檔案與交付素材，保持可追蹤性。"
] as const;
