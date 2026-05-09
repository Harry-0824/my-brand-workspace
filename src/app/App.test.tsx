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
});
