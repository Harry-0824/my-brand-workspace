export const dashboardQuickActions = [
  {
    title: "前往專案",
    description: "查看專案進度與近期交付安排。",
    to: "/projects",
    tag: "核心"
  },
  {
    title: "前往任務",
    description: "掌握待辦與本週優先處理項目。",
    to: "/tasks",
    tag: "執行"
  },
  {
    title: "前往客戶",
    description: "快速檢查客戶狀態與追蹤節點。",
    to: "/clients",
    tag: "追蹤"
  },
  {
    title: "前往收款",
    description: "查看待收款與發票進度示意。",
    to: "/invoices",
    tag: "財務"
  },
  {
    title: "前往行事曆",
    description: "確認近期會議、里程碑與排程。",
    to: "/calendar",
    tag: "排程"
  },
  {
    title: "前往檔案",
    description: "檢視素材、交付檔案與版本整理。",
    to: "/files",
    tag: "交付"
  }
] as const;

export const dashboardWorkspaceSnapshot = [
  { label: "進行中專案", value: "4", note: "本週有 2 個交付節點" },
  { label: "待處理任務", value: "12", note: "其中 4 項為高優先" },
  { label: "合作中客戶", value: "4", note: "1 位待回覆確認" },
  { label: "待收款項目", value: "3", note: "本週優先追蹤 2 項" },
  { label: "近期行程", value: "5", note: "含會議與里程碑檢查" },
  { label: "可交付檔案", value: "17", note: "已整理主要版本" }
] as const;

export const dashboardWeekFocus = [
  "完成專案首頁視覺確認與備註整理",
  "更新本週任務優先順序與到期提醒",
  "回覆待確認客戶並同步下一步時程",
  "檢查待收款項目與發票狀態一致性"
] as const;
