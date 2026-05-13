import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { TasksPage } from "./TasksPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderTasksPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <TasksPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("TasksPage filters", () => {
  it("renders a task status filter with an all option", () => {
    renderTasksPage();

    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    expect(filter.id).toBe("tasks-status-filter");
    expect(Array.from(filter.options).some((option) => option.value === "__ALL__")).toBe(true);
  });
});
