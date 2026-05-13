import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

describe("TasksPage interactions", () => {
  it("renders local controls with all option and disabled reset by default", () => {
    renderTasksPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const reset = screen.getByTestId("tasks-reset-control") as HTMLButtonElement;

    expect(search.id).toBe("tasks-search-input");
    expect(filter.id).toBe("tasks-status-filter");
    expect(
      Array.from(filter.options).some((option) => option.value === "__ALL__")
    ).toBe(true);
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("6 / 6");
    expect(reset).toBeDisabled();
  });

  it("updates count for search/filter, then reset clears criteria and removes empty state", () => {
    renderTasksPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const reset = screen.getByTestId("tasks-reset-control") as HTMLButtonElement;
    const allRowsCount = screen.getAllByTestId("tasks-status-badge").length;

    const firstStatusOption = Array.from(filter.options)
      .map((option) => option.value)
      .find((value) => value !== "__ALL__");

    expect(firstStatusOption).toBeDefined();
    fireEvent.change(filter, { target: { value: firstStatusOption } });

    const filteredRowsCount = screen.getAllByTestId("tasks-status-badge").length;
    expect(filteredRowsCount).toBeGreaterThan(0);
    expect(filteredRowsCount).toBeLessThan(allRowsCount);
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent(
      `${filteredRowsCount} / 6`
    );
    expect(reset).toBeEnabled();
    expect(search.value).toBe("");

    fireEvent.change(search, { target: { value: "no-match-keyword" } });

    expect(screen.queryAllByTestId("tasks-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("tasks-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("0 / 6");

    fireEvent.click(reset);
    expect(search.value).toBe("");
    expect(filter.value).toBe("__ALL__");
    expect(screen.queryByTestId("tasks-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("tasks-status-badge")).toHaveLength(
      allRowsCount
    );
    expect(screen.getByTestId("tasks-result-count")).toHaveTextContent("6 / 6");
    expect(reset).toBeDisabled();
  });
});
