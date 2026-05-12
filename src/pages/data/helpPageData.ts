export const gettingStarted = [
  "建立第一個專案並設定交付目標",
  "新增任務並安排本週工作重點",
  "建立客戶資料與溝通備註",
  "更新收款與發票追蹤狀態"
] as const;

export const workflows = [
  {
    title: "專案規劃",
    detail: "先定義交付內容，再拆解成可追蹤任務清單。"
  },
  {
    title: "客戶追蹤",
    detail: "固定記錄回饋時間點，避免關鍵訊息遺漏。"
  },
  {
    title: "收款管理",
    detail: "每週檢查待收款項目與發票進度示意。"
  },
  {
    title: "檔案交付",
    detail: "交付前確認版本、命名與文件完整度。"
  }
] as const;

export const faqPreview = [
  {
    question: "如何開始新的接案流程？",
    answer: "可先建立專案，再新增任務與客戶資料。"
  },
  {
    question: "如何追蹤本週交付項目？",
    answer: "使用任務與行事曆頁面查看近期安排。"
  },
  {
    question: "如何整理交付檔案？",
    answer: "在檔案頁集中管理素材與交付清單。"
  }
] as const;
