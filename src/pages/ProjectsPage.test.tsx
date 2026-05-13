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

describe("ProjectsPage filters", () => {
  it("renders a project status filter with an all option", () => {
    renderProjectsPage();

    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    expect(filter.id).toBe("projects-status-filter");
    expect(Array.from(filter.options).some((option) => option.value === "__ALL__")).toBe(true);
  });

  it("filters visible rows and can reset back to all", () => {
    renderProjectsPage();

    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const allRowsCount = screen.getAllByTestId("projects-status-badge").length;
    const optionValues = Array.from(filter.options)
      .map((option) => option.value)
      .filter((value) => value !== "__ALL__");

    expect(optionValues.length).toBeGreaterThan(0);

    const targetStatus = optionValues[0];
    fireEvent.change(filter, { target: { value: targetStatus } });

    const filteredBadges = screen.getAllByTestId("projects-status-badge");
    expect(filteredBadges.length).toBeGreaterThan(0);
    expect(
      filteredBadges.every((badge) => badge.textContent === targetStatus)
    ).toBe(true);

    fireEvent.change(filter, { target: { value: "__ALL__" } });
    expect(screen.getAllByTestId("projects-status-badge")).toHaveLength(
      allRowsCount
    );
  });
});
