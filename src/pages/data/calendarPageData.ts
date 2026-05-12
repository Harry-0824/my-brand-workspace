export const weekOverview = [
  { day: "週一", item: "專案站會", time: "10:00", type: "會議" },
  { day: "週二", item: "首頁設計調整", time: "14:00", type: "深度工作" },
  { day: "週三", item: "客戶回饋檢視", time: "11:00", type: "回饋" },
  { day: "週四", item: "功能交付檢查", time: "16:00", type: "交付" },
  { day: "週五", item: "週報回顧", time: "15:30", type: "回顧" }
] as const;

export const upcomingSchedule = [
  { title: "Bright Studio 進度會議", date: "5 月 21 日", tag: "客戶會議" },
  { title: "FlowMart 測試結果回報", date: "5 月 22 日", tag: "專案追蹤" },
  { title: "Northwind 提案審閱", date: "5 月 23 日", tag: "提案審查" }
] as const;

export const milestoneTimeline = [
  { milestone: "首頁改版初稿", due: "5 月 24 日", status: "準備交付" },
  { milestone: "購物流程驗收", due: "5 月 26 日", status: "進行中" },
  { milestone: "提案最終版本", due: "5 月 28 日", status: "待確認" }
] as const;

export const focusBlocks = [
  { block: "深度工作", time: "09:30 - 11:30", detail: "關鍵功能與版面製作" },
  { block: "客戶溝通", time: "13:30 - 14:30", detail: "回覆提問與同步進度" },
  { block: "行政整理", time: "17:00 - 17:30", detail: "收款追蹤與排程更新" }
] as const;
