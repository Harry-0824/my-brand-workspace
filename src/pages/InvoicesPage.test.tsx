import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { InvoicesPage } from "./InvoicesPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderInvoicesPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <InvoicesPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("InvoicesPage", () => {
  it("renders the static invoices page shell content", () => {
    renderInvoicesPage();

    for (const text of [
      "收款管理",
      "集中查看待收款、已開立發票與近期付款追蹤事項。",
      "本月已收款",
      "$3,200",
      "待收款",
      "$4,800",
      "已開立發票",
      "5",
      "待開立發票",
      "2",
      "搜尋客戶或項目...",
      "全部狀態",
      "新增發票草稿",
      "Bright Studio",
      "品牌官網重設計首期款",
      "$2,400",
      "5 月 24 日",
      "FlowMart",
      "電商功能開發尾款",
      "5 月 28 日",
      "Northwind Co.",
      "提案製作費",
      "$800",
      "5 月 18 日",
      "Internal",
      "作品集優化",
      "$0",
      "內部項目",
      "本週",
      "收款提醒：優先追蹤本週到期與待開立發票的項目。"
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
  });
});
