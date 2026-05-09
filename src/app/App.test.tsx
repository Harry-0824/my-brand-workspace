import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { theme } from "../styles/theme";

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
});
