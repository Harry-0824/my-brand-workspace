import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectsPage } from "./ProjectsPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderProjectsPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <ProjectsPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("ProjectsPage search and filters", () => {
  it("renders search input and status filter", () => {
    renderProjectsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const reset = screen.getByTestId("projects-reset-control") as HTMLButtonElement;

    expect(search.id).toBe("projects-search-input");
    expect(filter.id).toBe("projects-status-filter");
    expect(
      Array.from(filter.options).some((option) => option.value === "__ALL__")
    ).toBe(true);
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("shows empty state when search and filter produce zero rows", () => {
    renderProjectsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(search, { target: { value: "bright" } });
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("1 / 4");

    const activeStatus = screen.getByTestId("projects-status-badge").textContent;
    const anotherStatus = Array.from(filter.options)
      .map((option) => option.value)
      .find((value) => value !== "__ALL__" && value !== activeStatus);

    expect(anotherStatus).toBeDefined();
    fireEvent.change(filter, { target: { value: anotherStatus } });

    expect(screen.queryAllByTestId("projects-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("projects-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("0 / 4");
  });

  it("reset clears search/filter and removes empty state", () => {
    renderProjectsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const reset = screen.getByTestId("projects-reset-control") as HTMLButtonElement;
    const allRowsCount = screen.getAllByTestId("projects-status-badge").length;

    fireEvent.change(search, { target: { value: "bright" } });
    const activeStatus = screen.getByTestId("projects-status-badge").textContent;
    const anotherStatus = Array.from(filter.options)
      .map((option) => option.value)
      .find((value) => value !== "__ALL__" && value !== activeStatus);
    expect(anotherStatus).toBeDefined();

    fireEvent.change(filter, { target: { value: anotherStatus } });
    expect(screen.getByTestId("projects-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("0 / 4");

    fireEvent.click(reset);
    expect(search.value).toBe("");
    expect(filter.value).toBe("__ALL__");
    expect(screen.queryByTestId("projects-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(
      allRowsCount
    );
    expect(screen.getByTestId("projects-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });
});
