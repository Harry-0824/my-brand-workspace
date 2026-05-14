import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClientsPage } from "./ClientsPage";
import { theme } from "../styles/theme";
import type { ClientRecord, ClientStatus } from "../lib/clients";

const mockFetchClientsForCurrentUser = vi.fn();
const mockCreateClientForCurrentUser = vi.fn();
const mockUpdateClientForCurrentUser = vi.fn();
const mockDeleteClientForCurrentUser = vi.fn();

vi.mock("../lib/clients", () => ({
  CLIENT_STATUS_VALUES: ["active", "inactive", "lead", "archived"],
  fetchClientsForCurrentUser: (...args: unknown[]) =>
    mockFetchClientsForCurrentUser(...args),
  createClientForCurrentUser: (...args: unknown[]) =>
    mockCreateClientForCurrentUser(...args),
  updateClientForCurrentUser: (...args: unknown[]) =>
    mockUpdateClientForCurrentUser(...args),
  deleteClientForCurrentUser: (...args: unknown[]) =>
    mockDeleteClientForCurrentUser(...args)
}));

const baseRows: ClientRecord[] = [
  {
    id: "c-1",
    user_id: "user-1",
    name: "Bright Studio",
    email: "hello@bright.studio",
    company: "Bright Studio",
    status: "active",
    notes: "Kickoff done",
    created_at: "2026-05-01T12:00:00.000Z"
  },
  {
    id: "c-2",
    user_id: "user-1",
    name: "FlowMart",
    email: "ops@flowmart.io",
    company: "FlowMart",
    status: "lead",
    notes: "Waiting for quote",
    created_at: "2026-04-25T12:00:00.000Z"
  },
  {
    id: "c-3",
    user_id: "user-1",
    name: "Northwind Co.",
    email: "pm@northwind.co",
    company: "Northwind Co.",
    status: "inactive",
    notes: "No current demand",
    created_at: "2026-04-12T12:00:00.000Z"
  },
  {
    id: "c-4",
    user_id: "user-1",
    name: "Internal",
    email: null,
    company: "Internal",
    status: "archived",
    notes: "Archived",
    created_at: "2026-03-01T12:00:00.000Z"
  }
];

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchClientsForCurrentUser.mockResolvedValue(baseRows);
  mockCreateClientForCurrentUser.mockImplementation(
    async (input: {
      name: string;
      email?: string;
      company?: string;
      status: ClientStatus;
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
  mockUpdateClientForCurrentUser.mockImplementation(
    async (
      clientId: string,
      input: {
        name: string;
        email?: string;
        company?: string;
        status: ClientStatus;
        notes?: string;
      }
    ) => ({
      id: clientId,
      user_id: "user-1",
      name: input.name,
      email: input.email ?? null,
      company: input.company ?? null,
      status: input.status,
      notes: input.notes ?? null,
      created_at: "2026-05-01T12:00:00.000Z"
    })
  );
  mockDeleteClientForCurrentUser.mockResolvedValue(true);
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

function setFieldValue(id: string, value: string) {
  const target = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;

  expect(target).not.toBeNull();
  fireEvent.change(target as Element, { target: { value } });
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

    const search = document.getElementById("clients-search-input") as
      | HTMLInputElement
      | null;
    const reset = screen.getByTestId("clients-reset-control") as HTMLButtonElement;

    expect(search).not.toBeNull();
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("resets search-only criteria on clients page", async () => {
    renderClientsPage();
    await waitForRowsToLoad();

    const search = document.getElementById("clients-search-input") as
      | HTMLInputElement
      | null;
    const reset = screen.getByTestId("clients-reset-control") as HTMLButtonElement;

    expect(search).not.toBeNull();

    fireEvent.change(search as Element, { target: { value: "flowmart" } });
    expect(screen.getAllByText("FlowMart").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("1 / 4");
    expect(reset).toBeEnabled();

    fireEvent.change(search as Element, { target: { value: "no-match-keyword" } });
    expect(screen.queryAllByTestId("clients-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("clients-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("0 / 4");

    fireEvent.click(reset);
    expect((search as HTMLInputElement).value).toBe("");
    expect(screen.queryByTestId("clients-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(4);
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("4 / 4");
    expect(reset).toBeDisabled();
  });

  it("creates a client and prepends it to the list", async () => {
    renderClientsPage();
    await waitForRowsToLoad();

    setFieldValue("clients-create-name", "CaseCake");
    setFieldValue("clients-create-status", "active");
    setFieldValue("clients-create-email", "contact@casecake.com");

    const createForm = document.querySelector("form") as HTMLFormElement | null;
    expect(createForm).not.toBeNull();
    fireEvent.submit(createForm as HTMLFormElement);

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
      expect(screen.getByTestId("clients-create-success")).toBeInTheDocument();
    });
    expect(screen.getByTestId("clients-result-count")).toHaveTextContent("5 / 5");
    expect(screen.getAllByTestId("clients-status-badge")).toHaveLength(5);
  });

  it("updates the selected client only", async () => {
    renderClientsPage();
    await waitForRowsToLoad();

    const editButtons = screen.getAllByTestId("clients-edit-button");
    fireEvent.click(editButtons[0]);

    const editNameInput = document.querySelector(
      "input[id^='clients-edit-name-']"
    ) as HTMLInputElement | null;
    const editStatusSelect = document.querySelector(
      "select[id^='clients-edit-status-']"
    ) as HTMLSelectElement | null;

    expect(editNameInput).not.toBeNull();
    expect(editStatusSelect).not.toBeNull();

    fireEvent.change(editNameInput as Element, {
      target: { value: "Bright Studio V2" }
    });
    fireEvent.change(editStatusSelect as Element, { target: { value: "inactive" } });
    fireEvent.click(screen.getByTestId("clients-save-edit-button"));

    await waitFor(() => {
      expect(mockUpdateClientForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockUpdateClientForCurrentUser).toHaveBeenCalledWith(
      "c-1",
      expect.objectContaining({
        name: "Bright Studio V2",
        status: "inactive"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("clients-action-success")).toBeInTheDocument();
    });
    expect(screen.getByText("Bright Studio V2")).toBeInTheDocument();
    expect(screen.getAllByText("FlowMart").length).toBeGreaterThan(0);
  });

  it("deletes the selected client only", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderClientsPage();
    await waitForRowsToLoad();

    const deleteButtons = screen.getAllByTestId("clients-delete-button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteClientForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockDeleteClientForCurrentUser).toHaveBeenCalledWith("c-1");

    await waitFor(() => {
      expect(screen.getByTestId("clients-result-count")).toHaveTextContent("3 / 3");
    });
    expect(screen.queryByText("Bright Studio")).not.toBeInTheDocument();
    expect(screen.getAllByText("FlowMart").length).toBeGreaterThan(0);

    confirmSpy.mockRestore();
  });
});
