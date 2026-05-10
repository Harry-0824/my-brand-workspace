import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectsPage } from "./ProjectsPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderProjectsPage() {
  render(
    <ThemeProvider theme={theme}>
      <ProjectsPage />
    </ThemeProvider>
  );
}

describe("ProjectsPage", () => {
  it("renders the static projects page shell content", () => {
    renderProjectsPage();

    for (const text of [
      "專案管理",
      "集中查看接案專案、合作客戶、進度與交付狀態。",
      "全部專案",
      "4",
      "進行中",
      "2",
      "待確認",
      "1",
      "本月交付",
      "3",
      "搜尋專案或客戶...",
      "全部狀態",
      "新增專案",
      "品牌官網重設計",
      "Bright Studio",
      "電商功能開發",
      "FlowMart",
      "客戶提案製作",
      "Northwind Co.",
      "個人作品網站",
      "Internal"
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
  });
});
