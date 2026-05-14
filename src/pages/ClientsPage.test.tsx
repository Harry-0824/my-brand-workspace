import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClientsPage } from "./ClientsPage";
import { theme } from "../styles/theme";
import type { ClientRecord } from "../lib/clients";

const mockFetchClientsForCurrentUser = vi.fn();
const mockCreateClientForCurrentUser = vi.fn();

vi.mock("../lib/clients", () => ({
  CLIENT_STATUS_VALUES: ["active", "inactive", "lead", "archived"],
  fetchClientsForCurrentUser: (...args: unknown[]) =>
    mockFetchClientsForCurrentUser(...args),
  createClientForCurrentUser: (...args: unknown[]) =>
    mockCreateClientForCurrentUser(...args)
}));

const mockRows: ClientRecord[] = [
  {
    id: "c-1",
    user_id: "user-1",
    name: "Bright Studio",
    email: "hello@bright.studio",
    company: "Bright Studio",
    status: "active",
    notes: "品牌重設計合作中",
    created_at: "2026-05-01T12:00:00.000Z"
  },
  {
    id: "c-2",
    user_id: "user-1",
    name: "FlowMart",
    email: "ops@flowmart.io",
    company: "FlowMart",
    status: "lead",
    notes: "電商專案提案中",
    created_at: "2026-04-25T12:00:00.000Z"
  },
  {
    id: "c-3",
    user_id: "user-1",
    name: "Northwind Co.",
    email: "pm@northwind.co",
    company: "Northwind Co.",
    status: "inactive",
    notes: "等待下一季預算",
    created_at: "2026-04-12T12:00:00.000Z"
  },
  {
    id: "c-4",
    user_id: "user-1",
    name: "Internal",
    email: null,
    company: "Internal",
    status: "archived",
    notes: "已結案",
    created_at: "2026-03-01T12:00:00.000Z"
  }
];

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchClientsForCurrentUser.mockResolvedValue(mockRows);
  mockCreateClientForCurrentUser.mockImplementation(
    async (input: {
      name: string;
      email?: string;
      company?: string;
      status: "active" | "inactive" | "lead" | "archived";
      notes?: string;
    }) => ({
      id: "c-created",
      user_id: "user-1",
      name: input.name,
      email: input.email ?? null,
      company: input.company ?? null,
      status: input.status,
      notes: input.notes ?? null,
      created_at: "2026-05-14T09:00:00.000Z"
    })
  );
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

async function waitForRowsToLoad() {
  await waitFor(() => {
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(4);
  });
}

describe("ClientsPage Supabase integration behaviors", () => {
  it("loads clients and renders search input", async () => {
    renderClientsPage();

    expect(screen.getByTestId("clients-loading-state")).toBeInTheDocument();
    await waitForRowsToLoad();

    const search = screen.getByRole("textbox", {
      name: "客戶關鍵字搜尋"
    }) as HTMLInputElement;
    const reset = screen.getByTestId("clients-reset-control") as HTMLButtonElement;

    expect(search.id).toBe("clients-search-input");
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("resets search-only criteria on clients page", async () => {
    renderClientsPage();
    await waitForRowsToLoad();

    const search = screen.getByRole("textbox", {
      name: "客戶關鍵字搜尋"
    }) as HTMLInputElement;
    const reset = screen.getByTestId("clients-reset-control") as HTMLButtonElement;
    const allRowsCount = screen.getAllByTestId("clients-status-badge").length;

    fireEvent.change(search, { target: { value: "flowmart" } });
    expect(screen.getAllByText("FlowMart").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("1 / 4");
    expect(reset).toBeEnabled();

    fireEvent.change(search, { target: { value: "no-match-keyword" } });
    expect(screen.queryAllByTestId("clients-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("clients-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("0 / 4");

    fireEvent.click(reset);
    expect(search.value).toBe("");
    expect(screen.queryByTestId("clients-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(
      allRowsCount
    );
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("creates a client and prepends it to the list", async () => {
    renderClientsPage();
    await waitForRowsToLoad();

    fireEvent.change(screen.getByLabelText("客戶名稱"), {
      target: { value: "CaseCake" }
    });
    fireEvent.change(screen.getByLabelText("狀態"), {
      target: { value: "active" }
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "contact@casecake.com" }
    });

    fireEvent.click(screen.getByRole("button", { name: "新增客戶" }));

    await waitFor(() => {
      expect(mockCreateClientForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockCreateClientForCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "CaseCake",
        status: "active",
        email: "contact@casecake.com"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("clients-create-success")).toHaveTextContent(
        "客戶已建立。"
      );
    });
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("5 / 5");
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(5);
  });
});
