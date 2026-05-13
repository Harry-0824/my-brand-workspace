import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { InvoicesPage } from "./InvoicesPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderInvoicesPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <InvoicesPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("InvoicesPage filters", () => {
  it("renders search input and invoice status filter with an all option", () => {
    renderInvoicesPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const reset = screen.getByTestId("invoices-reset-control") as HTMLButtonElement;

    expect(search.id).toBe("invoices-search-input");
    expect(filter.id).toBe("invoices-status-filter");
    expect(
      Array.from(filter.options).some((option) => option.value === "__ALL__")
    ).toBe(true);
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("updates count for search/filter and reset restores full rows", () => {
    renderInvoicesPage();

    const search = screen.getByRole("textbox") as HTMLInputElement;
    const filter = screen.getByRole("combobox") as HTMLSelectElement;
    const reset = screen.getByTestId(
      "invoices-reset-control"
    ) as HTMLButtonElement;
    const allRowsCount = screen.getAllByTestId("invoices-status-badge").length;

    fireEvent.change(search, { target: { value: "bright" } });
    expect(screen.getAllByTestId("invoices-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("1 / 4");
    expect(reset).toBeEnabled();

    const activeStatus = screen.getByTestId("invoices-status-badge").textContent;
    const anotherStatus = Array.from(filter.options)
      .map((option) => option.value)
      .find((value) => value !== "__ALL__" && value !== activeStatus);

    expect(anotherStatus).toBeDefined();
    fireEvent.change(filter, { target: { value: anotherStatus } });

    expect(screen.queryAllByTestId("invoices-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("invoices-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("0 / 4");

    fireEvent.click(reset);
    expect(search.value).toBe("");
    expect(filter.value).toBe("__ALL__");
    expect(screen.queryByTestId("invoices-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("invoices-status-badge")).toHaveLength(
      allRowsCount
    );
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });
});
