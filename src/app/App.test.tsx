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

    expect(screen.getByRole("navigation", { name: "主要導航" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "儀表板" })).toBeInTheDocument();
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

  it("renders InvoicesPage on /invoices", () => {
    renderApp(["/invoices"]);

    expect(screen.getByRole("heading", { name: "收款管理" })).toBeInTheDocument();
  });

  it("navigates between main routes from sidebar and updates active item", async () => {
    const user = userEvent.setup();

    renderApp(["/"]);

    const navigation = screen.getByRole("navigation", { name: "主要導航" });

    const dashboardLink = within(navigation).getByRole("link", { name: "儀表板" });
    const projectsLink = within(navigation).getByRole("link", { name: "專案" });
    const tasksLink = within(navigation).getByRole("link", { name: "任務" });

    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    await user.click(projectsLink);
    expect(screen.getByRole("heading", { name: "專案管理" })).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("aria-current", "page");

    await user.click(tasksLink);
    expect(screen.getByRole("heading", { name: "任務管理" })).toBeInTheDocument();
    expect(tasksLink).toHaveAttribute("aria-current", "page");
  });
});
