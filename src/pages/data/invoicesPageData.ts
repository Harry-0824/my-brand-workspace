export const summaryMetrics = [
  { label: "本月已收款", value: "$3,200" },
  { label: "待收款", value: "$4,800" },
  { label: "已開立發票", value: "5" },
  { label: "待開立發票", value: "2" }
] as const;

export const invoiceRows = [
  {
    client: "Bright Studio",
    item: "品牌官網重設計首期款",
    amount: "$2,400",
    status: "待收款",
    due: "5 月 24 日"
  },
  {
    client: "FlowMart",
    item: "電商功能開發尾款",
    amount: "$2,400",
    status: "待開立發票",
    due: "5 月 28 日"
  },
  {
    client: "Northwind Co.",
    item: "提案製作費",
    amount: "$800",
    status: "已開立發票",
    due: "5 月 18 日"
  },
  {
    client: "Internal",
    item: "作品集優化",
    amount: "$0",
    status: "內部項目",
    due: "本週"
  }
] as const;
