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

    expect(search.id).toBe("projects-search-input");
    expect(filter.id).toBe("projects-status-filter");
    expect(
      Array.from(filter.options).some((option) => option.value === "__ALL__")
    ).toBe(true);
  });

  it("combines keyword search with status filter", () => {
    renderProjectsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(search, { target: { value: "bright" } });
    expect(screen.getByText("Bright Studio")).toBeInTheDocument();
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(1);

    const activeStatus = screen.getByTestId("projects-status-badge").textContent;
    fireEvent.change(filter, { target: { value: activeStatus } });
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(1);

    const anotherStatus = Array.from(filter.options)
      .map((option) => option.value)
      .find((value) => value !== "__ALL__" && value !== activeStatus);

    expect(anotherStatus).toBeDefined();
    fireEvent.change(filter, { target: { value: anotherStatus } });
    expect(screen.queryAllByTestId("projects-status-badge")).toHaveLength(0);
  });

  it("restores full visible list when clearing keyword under 全部 status", () => {
    renderProjectsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const allRowsCount = screen.getAllByTestId("projects-status-badge").length;

    fireEvent.change(search, { target: { value: "flowmart" } });
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(1);

    fireEvent.change(search, { target: { value: "" } });
    fireEvent.change(filter, { target: { value: "__ALL__" } });
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(
      allRowsCount
    );
  });
});
