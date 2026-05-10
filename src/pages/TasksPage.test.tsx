import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { TasksPage } from "./TasksPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderTasksPage() {
  render(
    <ThemeProvider theme={theme}>
      <TasksPage />
    </ThemeProvider>
  );
}

describe("TasksPage", () => {
  it("renders the static tasks page shell content", () => {
    renderTasksPage();

    for (const text of [
      "任務管理",
      "集中管理待辦、進行中、審核中與已完成的接案任務。",
      "全部任務",
      "12",
      "進行中",
      "4",
      "待審核",
      "3",
      "今日到期",
      "2",
      "搜尋任務或專案...",
      "全部狀態",
      "全部優先級",
      "新增任務",
      "完成首頁線框調整",
      "品牌官網重設計",
      "進行中",
      "高",
      "5 月 24 日",
      "檢查購物車測試結果",
      "電商功能開發",
      "待處理",
      "5 月 22 日",
      "整理提案修改內容",
      "客戶提案製作",
      "排程中",
      "5 月 23 日",
      "準備部署檢查",
      "個人作品網站",
      "待審核",
      "5 月 25 日",
      "追蹤客戶回覆狀態",
      "追蹤中",
      "5 月 26 日",
      "確認資訊架構",
      "已完成",
      "5 月 18 日",
      "任務狀態分布：待處理、進行中、待審核、已完成。"
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
  });
});
