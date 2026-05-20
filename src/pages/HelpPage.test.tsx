import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, describe, expect, it } from "vitest";
import { HelpPage } from "./HelpPage";
import { theme } from "../styles/theme";

afterEach(() => {
  cleanup();
});

function renderHelpPage() {
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <HelpPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("HelpPage quick-start navigation", () => {
  it("renders all quick-start links", () => {
    renderHelpPage();

    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /專案 \/ Projects/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /任務 \/ Tasks/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /客戶 \/ Clients/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /收款紀錄 \/ Income Records/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /報表 \/ Reports/ })).toBeInTheDocument();
  });
});
