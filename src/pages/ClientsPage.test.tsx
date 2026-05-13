import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { ClientsPage } from "./ClientsPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderClientsPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <ClientsPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("ClientsPage", () => {
  it("renders the static clients page shell content", () => {
    renderClientsPage();

    for (const text of [
      "客戶管理",
      "集中管理合作客戶、聯絡狀態、專案數與下一步追蹤事項。",
      "全部客戶",
      "4",
      "合作中",
      "2",
      "待回覆",
      "1",
      "本週需追蹤",
      "3",
      "搜尋客戶或公司...",
      "全部狀態",
      "新增客戶",
      "Bright Studio",
      "2 個專案",
      "最近聯絡：今天",
      "下一步：確認首頁視覺方向",
      "FlowMart",
      "開發中",
      "最近聯絡：昨天",
      "下一步：回報購物車測試結果",
      "Northwind Co.",
      "待確認",
      "最近聯絡：5 月 18 日",
      "下一步：等待提案回覆",
      "Internal",
      "內部優化",
      "最近聯絡：本週",
      "下一步：整理作品集內容",
      "客戶追蹤提醒：優先處理本週需要回覆或確認的合作對象。"
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
  });
});
