import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { ClientsPage } from "./ClientsPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderClientsPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <ClientsPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("ClientsPage search", () => {
  it("renders a local keyword search input", () => {
    renderClientsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    expect(search.id).toBe("clients-search-input");
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("4 / 4");
  });

  it("filters visible client rows by keyword and restores when cleared", () => {
    renderClientsPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const allRowsCount = screen.getAllByTestId("clients-status-badge").length;

    fireEvent.change(search, { target: { value: "flowmart" } });
    expect(screen.getByText("FlowMart")).toBeInTheDocument();
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("1 / 4");

    fireEvent.change(search, { target: { value: "no-match-keyword" } });
    expect(screen.queryAllByTestId("clients-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("clients-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("0 / 4");

    fireEvent.change(search, { target: { value: "" } });
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(
      allRowsCount
    );
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("4 / 4");
  });
});
