export const summaryMetrics = [
  { label: "全部客戶", value: "4" },
  { label: "合作中", value: "2" },
  { label: "待回覆", value: "1" },
  { label: "本週需追蹤", value: "3" }
] as const;

export const clientRows = [
  {
    name: "Bright Studio",
    status: "合作中",
    projects: "2 個專案",
    lastContact: "最近聯絡：今天",
    nextStep: "下一步：確認首頁視覺方向"
  },
  {
    name: "FlowMart",
    status: "開發中",
    projects: "1 個專案",
    lastContact: "最近聯絡：昨天",
    nextStep: "下一步：回報購物車測試結果"
  },
  {
    name: "Northwind Co.",
    status: "待確認",
    projects: "1 個專案",
    lastContact: "最近聯絡：5 月 18 日",
    nextStep: "下一步：等待提案回覆"
  },
  {
    name: "Internal",
    status: "內部優化",
    projects: "1 個專案",
    lastContact: "最近聯絡：本週",
    nextStep: "下一步：整理作品集內容"
  }
] as const;
