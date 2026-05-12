export const summaryMetrics = [
  { label: "本月營收（示意）", value: "$128,000" },
  { label: "進行中專案", value: "5" },
  { label: "本週完成任務", value: "18" },
  { label: "待收款項目", value: "3" }
] as const;

export const projectStatusOverview = [
  { status: "進行中", count: "3", note: "主要為網站改版與內容調整" },
  { status: "等待回饋", count: "1", note: "客戶回覆中，待確認下一步" },
  { status: "已交付", count: "1", note: "已完成初版並提交驗收" }
] as const;

export const taskPerformance = [
  { label: "任務完成率（示意）", value: "78%" },
  { label: "本週完成數", value: "18" },
  { label: "逾期項目（示意）", value: "2" }
] as const;

export const revenueSnapshot = [
  { label: "已收款", value: "$92,000" },
  { label: "待收款", value: "$26,000" },
  { label: "逾期收款", value: "$10,000" }
] as const;
