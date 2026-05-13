import { cleanup, render, screen } from "@testing-library/react";
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

    expect(search.id).toBe("invoices-search-input");
    expect(filter.id).toBe("invoices-status-filter");
    expect(Array.from(filter.options).some((option) => option.value === "__ALL__")).toBe(true);
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("4 / 4");
  });
});
