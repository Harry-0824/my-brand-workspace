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
  { label: "進行中專案數", value: "4", note: "與專案頁靜態清單一致" },
  { label: "目前任務數", value: "6", note: "與任務頁靜態清單一致" },
  { label: "合作中客戶數", value: "4", note: "與客戶頁靜態清單一致" },
  { label: "收款項目數", value: "4", note: "與收款頁靜態清單一致" },
  { label: "本週時程項目", value: "5", note: "依本週排程區塊統計" },
  { label: "近期檔案數", value: "17", note: "依檔案頁靜態資料顯示" }
] as const;

export const dashboardWeekFocus = [
  "完成專案交付前的最終檢查與回報。",
  "優先處理本週到期任務與待審核項目。",
  "同步追蹤收款狀態與客戶回覆節奏。",
  "整理本週檔案與交付素材，保持可追蹤性。"
] as const;
