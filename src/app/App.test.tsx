import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { theme } from "../styles/theme";

describe("App", () => {
  it("renders the temporary workspace landing copy", () => {
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByText("My Brand Workspace")).toBeInTheDocument();
    expect(screen.getByText("單人接案任務管理工作區")).toBeInTheDocument();
  });
});
