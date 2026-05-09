import { cleanup, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the core app layout shell", () => {
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

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
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByText("進行中專案")).toBeInTheDocument();
    expect(screen.getByText("目前正在處理的接案專案")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    expect(screen.getByText("本週待辦")).toBeInTheDocument();
    expect(screen.getByText("本週需要完成的任務")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("即將到期")).toBeInTheDocument();
    expect(screen.getByText("未來 7 天內到期")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    expect(screen.getByText("已完成任務")).toBeInTheDocument();
    expect(screen.getByText("本月已完成的任務")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
  });
});
