import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderApp(initialEntries: string[] = ["/"]) {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("App static routing", () => {
  it("renders dashboard on /", () => {
    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    expect(screen.getByRole("heading", { name: "儀表板" })).toBeInTheDocument();
    const currentPageLinks = within(navigation).getAllByRole("link", {
      current: "page"
    });

    expect(currentPageLinks).toHaveLength(1);
    expect(currentPageLinks[0]).toHaveTextContent("儀表板");
  });

  it("renders ProjectsPage on /projects", () => {
    renderApp(["/projects"]);

    expect(screen.getByRole("heading", { name: "專案管理" })).toBeInTheDocument();
  });

  it("renders TasksPage on /tasks", () => {
    renderApp(["/tasks"]);

    expect(screen.getByRole("heading", { name: "任務管理" })).toBeInTheDocument();
  });

  it("renders ClientsPage on /clients", () => {
    renderApp(["/clients"]);

    expect(screen.getByRole("heading", { name: "客戶管理" })).toBeInTheDocument();
  });

  it("renders FilesPage on /files", () => {
    renderApp(["/files"]);

    expect(screen.getByRole("heading", { name: "檔案" })).toBeInTheDocument();
  });

  it("renders HelpPage on /help", () => {
    renderApp(["/help"]);

    expect(screen.getByRole("heading", { name: "說明" })).toBeInTheDocument();
  });

  it("renders InvoicesPage on /invoices", () => {
    renderApp(["/invoices"]);

    expect(screen.getByRole("heading", { name: "收款管理" })).toBeInTheDocument();
  });

  it("renders SettingsPage on /settings", () => {
    renderApp(["/settings"]);

    expect(screen.getByRole("heading", { name: "設定" })).toBeInTheDocument();
  });

  it("renders ReportsPage on /reports", () => {
    renderApp(["/reports"]);

    expect(screen.getByRole("heading", { name: "報表" })).toBeInTheDocument();
  });

  it("renders CalendarPage on /calendar", () => {
    renderApp(["/calendar"]);

    expect(screen.getByRole("heading", { name: "行事曆" })).toBeInTheDocument();
  });

  it("renders NotFoundPage on unknown route", () => {
    renderApp(["/unknown-route"]);

    expect(screen.getByRole("heading", { name: "找不到頁面" })).toBeInTheDocument();
    expect(screen.getByText("回到儀表板")).toBeInTheDocument();
  });

  it("navigates between main routes from sidebar and updates active item", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    const dashboardLink = within(navigation).getByRole("link", { name: "儀表板" });
    const projectsLink = within(navigation).getByRole("link", { name: "專案" });
    const tasksLink = within(navigation).getByRole("link", { name: "任務" });
    const filesLink = within(navigation).getByRole("link", { name: "檔案" });
    const helpLink = within(navigation).getByRole("link", { name: "說明" });
    const calendarLink = within(navigation).getByRole("link", { name: "行事曆" });
    const reportsLink = within(navigation).getByRole("link", { name: "報表" });
    const settingsLink = within(navigation).getByRole("link", { name: "設定" });

    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    await user.click(projectsLink);
    expect(screen.getByRole("heading", { name: "專案管理" })).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("aria-current", "page");

    await user.click(tasksLink);
    expect(screen.getByRole("heading", { name: "任務管理" })).toBeInTheDocument();
    expect(tasksLink).toHaveAttribute("aria-current", "page");

    await user.click(filesLink);
    expect(screen.getByRole("heading", { name: "檔案" })).toBeInTheDocument();
    expect(filesLink).toHaveAttribute("aria-current", "page");

    await user.click(helpLink);
    expect(screen.getByRole("heading", { name: "說明" })).toBeInTheDocument();
    expect(helpLink).toHaveAttribute("aria-current", "page");

    await user.click(calendarLink);
    expect(screen.getByRole("heading", { name: "行事曆" })).toBeInTheDocument();
    expect(calendarLink).toHaveAttribute("aria-current", "page");

    await user.click(reportsLink);
    expect(screen.getByRole("heading", { name: "報表" })).toBeInTheDocument();
    expect(reportsLink).toHaveAttribute("aria-current", "page");

    await user.click(settingsLink);
    expect(screen.getByRole("heading", { name: "設定" })).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("aria-current", "page");
  });
});
