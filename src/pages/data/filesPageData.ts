export const summaryMetrics = [
  { label: "檔案總數（示意）", value: "48" },
  { label: "近 7 日新增", value: "9" },
  { label: "客戶素材", value: "22" },
  { label: "交付檔案", value: "17" }
] as const;

export const recentFiles = [
  { name: "homepage-wireframe-v3.fig", owner: "Bright Studio", type: "設計稿", status: "已整理" },
  { name: "checkout-test-report.pdf", owner: "FlowMart", type: "測試報告", status: "待確認" },
  { name: "proposal-final-draft.docx", owner: "Northwind Co.", type: "提案文件", status: "審閱中" },
  { name: "brand-assets-2026.zip", owner: "Internal", type: "素材包", status: "可交付" }
] as const;

export const categories = [
  { title: "設計素材", count: "14" },
  { title: "合約文件", count: "8" },
  { title: "交付檔案", count: "17" },
  { title: "參考資料", count: "9" }
] as const;

export const deliveryPreview = [
  "首頁設計稿與標註說明",
  "功能測試結果摘要",
  "交付清單與版本紀錄"
] as const;
