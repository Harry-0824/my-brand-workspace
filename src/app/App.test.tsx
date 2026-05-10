import { cleanup, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderApp() {
  render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

describe("App", () => {
  it("renders the core app layout shell", () => {
    renderApp();

    const navigation = screen.getByRole("navigation", { name: "主要導覽" });

    expect(screen.getByText("My Brand Workspace")).toBeInTheDocument();
    expect(screen.getByText("單人接案任務管理工作區")).toBeInTheDocument();
    expect(screen.getByText("今天先從專案狀態與待辦摘要開始。")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "儀表板" })).toBeInTheDocument();
    expect(
      within(navigation).getByText("儀表板").closest("[aria-current]")
    ).toHaveAttribute("aria-current", "page");
    for (const item of ["專案", "任務", "看板", "行事曆", "客戶", "檔案", "設定"]) {
      expect(within(navigation).getByText(item)).toBeInTheDocument();
    }
    expect(
      screen.getByPlaceholderText("搜尋專案、任務或客戶...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新增" })).toBeInTheDocument();
    expect(screen.getByText("Harry")).toBeInTheDocument();
  });

  it("renders the static dashboard overview cards", () => {
    renderApp();

    const overviewCards = screen.getByRole("region", { name: "儀表板摘要" });

    expect(within(overviewCards).getByText("進行中專案")).toBeInTheDocument();
    expect(within(overviewCards).getByText("目前正在處理的接案專案")).toBeInTheDocument();
    expect(within(overviewCards).getByText("6")).toBeInTheDocument();

    expect(within(overviewCards).getByText("本週待辦")).toBeInTheDocument();
    expect(within(overviewCards).getByText("本週需要完成的任務")).toBeInTheDocument();
    expect(within(overviewCards).getByText("12")).toBeInTheDocument();

    expect(within(overviewCards).getByText("即將到期")).toBeInTheDocument();
    expect(within(overviewCards).getByText("未來 7 天內到期")).toBeInTheDocument();
    expect(within(overviewCards).getByText("4")).toBeInTheDocument();

    expect(within(overviewCards).getByText("已完成任務")).toBeInTheDocument();
    expect(within(overviewCards).getByText("本月已完成的任務")).toBeInTheDocument();
    expect(within(overviewCards).getByText("28")).toBeInTheDocument();
  });

  it("renders the static active projects section", () => {
    renderApp();

    const activeProjects = screen.getByRole("region", { name: "進行中專案" });

    expect(
      within(activeProjects).getByText("目前正在推進的接案專案與完成進度。")
    ).toBeInTheDocument();

    for (const project of [
      ["品牌官網重設計", "Bright Studio", "進行中", "75%", "5 月 24 日"],
      ["電商功能開發", "FlowMart", "開發中", "60%", "5 月 28 日"],
      ["客戶提案製作", "Northwind Co.", "待確認", "35%", "5 月 30 日"],
      ["個人作品網站", "Internal", "優化中", "90%", "6 月 02 日"]
    ]) {
      for (const text of project) {
        expect(within(activeProjects).getByText(text)).toBeInTheDocument();
      }
    }
  });

  it("renders the static upcoming deadlines section", () => {
    renderApp();

    const upcomingDeadlines = screen.getByRole("region", { name: "即將到期" });

    expect(
      within(upcomingDeadlines).getByText("未來 7 天內需要完成或確認的重點事項。")
    ).toBeInTheDocument();

    for (const [item, project, date, type, priority] of [
      ["首頁視覺確認", "品牌官網重設計", "5 月 20 日", "設計審核", "高"],
      ["購物車流程測試", "電商功能開發", "5 月 22 日", "功能測試", "高"],
      ["提案內容調整", "客戶提案製作", "5 月 23 日", "文件更新", "中"],
      ["部署前檢查", "個人作品網站", "5 月 25 日", "部署準備", "中"],
      ["客戶回覆追蹤", "品牌官網重設計", "5 月 26 日", "客戶溝通", "低"]
    ]) {
      const deadlineRow = within(upcomingDeadlines).getByRole("article", {
        name: item
      });

      for (const text of [item, project, date, type, priority]) {
        expect(within(deadlineRow).getByText(text)).toBeInTheDocument();
      }
    }
  });

  it("renders the static recent activity timeline section", () => {
    renderApp();

    const recentActivity = screen.getByRole("region", { name: "最近活動" });

    expect(
      within(recentActivity).getByText("近期專案、任務與客戶溝通的更新紀錄。")
    ).toBeInTheDocument();

    for (const text of [
      "完成首頁線框調整",
      "新增購物車流程測試案例",
      "更新客戶提案內容",
      "完成正式環境部署檢查",
      "追蹤客戶回覆狀態",
      "今天 10:30",
      "今天 09:15",
      "昨天 16:40",
      "昨天 14:20",
      "5 月 18 日",
      "設計",
      "測試",
      "文件",
      "部署",
      "溝通"
    ]) {
      expect(within(recentActivity).getByText(text)).toBeInTheDocument();
    }
  });

  it("renders the static compact kanban preview section", () => {
    renderApp();

    const kanbanPreview = screen.getByRole("region", { name: "任務看板" });

    expect(
      within(kanbanPreview).getByText("快速查看目前任務在各流程階段的分布。")
    ).toBeInTheDocument();

    for (const text of [
      "待辦",
      "進行中",
      "待審核",
      "已完成",
      "整理客戶需求",
      "建立測試清單",
      "完成首頁線框",
      "更新提案內容",
      "準備部署檢查",
      "確認資訊架構",
      "電商功能開發",
      "客戶提案製作",
      "個人作品網站",
      "低",
      "5 月 18 日",
      "5 月 20 日",
      "5 月 22 日",
      "5 月 23 日",
      "5 月 24 日",
      "5 月 25 日"
    ]) {
      expect(within(kanbanPreview).getByText(text)).toBeInTheDocument();
    }

    expect(within(kanbanPreview).getAllByText("品牌官網重設計").length).toBeGreaterThan(0);
    expect(within(kanbanPreview).getAllByText("高").length).toBeGreaterThan(0);
    expect(within(kanbanPreview).getAllByText("中").length).toBeGreaterThan(0);
  });

  it("renders the static task detail side panel preview section", () => {
    renderApp();

    const taskDetailPanel = screen.getByRole("region", { name: "任務詳情" });

    for (const text of [
      "預覽選取任務的狀態、內容與執行細節。",
      "完成首頁線框",
      "品牌官網重設計",
      "進行中",
      "高",
      "5 月 24 日",
      "Bright Studio",
      "根據客戶回饋調整首頁首屏、服務區塊與行動呼籲區，確認桌面版資訊層級與視覺節奏。",
      "完成首屏 wireframe",
      "調整服務區塊資訊層級",
      "整理 CTA 文案",
      "確認客戶回饋重點",
      "wireframe-v2.fig",
      "client-feedback.md",
      "下一步需將首頁主要訊息收斂成 3 個重點，避免首屏資訊過重。"
    ]) {
      expect(within(taskDetailPanel).getByText(text)).toBeInTheDocument();
    }
  });

  it("renders the static client summary section", () => {
    renderApp();

    const clientSummary = screen.getByRole("region", { name: "客戶概覽" });

    for (const text of [
      "快速查看目前合作客戶、專案數與追蹤狀態。",
      "Bright Studio",
      "FlowMart",
      "Northwind Co.",
      "Internal",
      "合作中",
      "開發中",
      "待確認",
      "內部優化",
      "確認首頁視覺方向",
      "回報購物車測試結果",
      "等待提案回覆",
      "整理作品集內容"
    ]) {
      expect(within(clientSummary).getByText(text)).toBeInTheDocument();
    }
  });

  it("renders the static revenue and invoice summary section", () => {
    renderApp();

    const revenueSummary = screen.getByRole("region", { name: "收款概覽" });

    for (const text of [
      "掌握本月收入、待收款與發票處理狀態。",
      "本月已收款",
      "$3,200",
      "$4,800",
      "品牌官網重設計首期款",
      "電商功能開發尾款",
      "提案製作費",
      "作品集優化",
      "Bright Studio",
      "FlowMart",
      "Northwind Co.",
      "Internal",
      "內部項目"
    ]) {
      expect(within(revenueSummary).getByText(text)).toBeInTheDocument();
    }

    expect(within(revenueSummary).getAllByText("待收款").length).toBeGreaterThan(0);
    expect(within(revenueSummary).getAllByText("已開立發票").length).toBeGreaterThan(0);
    expect(within(revenueSummary).getAllByText("待開立發票").length).toBeGreaterThan(0);
  });

  it("renders the static focus plan section", () => {
    renderApp();

    const focusPlan = screen.getByRole("region", { name: "今日工作重點" });

    for (const text of [
      "根據目前專案狀態，整理今天最需要推進的工作順序。",
      "09:30 - 11:00",
      "11:15 - 12:00",
      "14:00 - 15:30",
      "完成首頁線框調整",
      "檢查購物車測試結果",
      "整理提案修改內容",
      "品牌官網重設計",
      "電商功能開發",
      "客戶提案製作",
      "進行中",
      "待處理",
      "排程中",
      "今日建議：先處理高影響交付，再集中回覆客戶訊息。"
    ]) {
      expect(within(focusPlan).getByText(text)).toBeInTheDocument();
    }
  });
});
