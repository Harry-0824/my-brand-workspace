import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InvoicesPage } from "./InvoicesPage";
import { theme } from "../styles/theme";
import type { IncomeRecordStatus } from "../lib/incomeRecords";

const mockFetchIncomeRecordsForCurrentUser = vi.fn();
const mockCreateIncomeRecordForCurrentUser = vi.fn();
const mockUpdateIncomeRecordForCurrentUser = vi.fn();
const mockDeleteIncomeRecordForCurrentUser = vi.fn();
const mockFetchProjectsForCurrentUser = vi.fn();
const mockFetchClientsForCurrentUser = vi.fn();

vi.mock("../lib/incomeRecords", () => ({
  INCOME_RECORD_STATUS_VALUES: ["pending", "paid", "overdue", "cancelled"],
  fetchIncomeRecordsForCurrentUser: (...args: unknown[]) =>
    mockFetchIncomeRecordsForCurrentUser(...args),
  createIncomeRecordForCurrentUser: (...args: unknown[]) =>
    mockCreateIncomeRecordForCurrentUser(...args),
  updateIncomeRecordForCurrentUser: (...args: unknown[]) =>
    mockUpdateIncomeRecordForCurrentUser(...args),
  deleteIncomeRecordForCurrentUser: (...args: unknown[]) =>
    mockDeleteIncomeRecordForCurrentUser(...args)
}));

vi.mock("../lib/projects", () => ({
  fetchProjectsForCurrentUser: (...args: unknown[]) =>
    mockFetchProjectsForCurrentUser(...args)
}));

vi.mock("../lib/clients", () => ({
  fetchClientsForCurrentUser: (...args: unknown[]) =>
    mockFetchClientsForCurrentUser(...args)
}));

const baseRows = [
  {
    id: "ir-1",
    user_id: "user-1",
    project_id: "project-1",
    client_id: "client-1",
    title: "網站設計尾款",
    amount: 12000,
    status: "pending" as IncomeRecordStatus,
    due_date: "2026-06-10",
    received_date: null,
    notes: "等客戶確認付款日",
    created_at: "2026-05-17T08:00:00.000Z"
  },
  {
    id: "ir-2",
    user_id: "user-1",
    project_id: null,
    client_id: null,
    title: "品牌顧問月費",
    amount: 8000,
    status: "paid" as IncomeRecordStatus,
    due_date: "2026-05-31",
    received_date: "2026-05-30",
    notes: null,
    created_at: "2026-05-16T08:00:00.000Z"
  },
  {
    id: "ir-3",
    user_id: "user-1",
    project_id: "project-2",
    client_id: "client-2",
    title: "廣告素材製作",
    amount: 6000,
    status: "overdue" as IncomeRecordStatus,
    due_date: "2026-05-12",
    received_date: null,
    notes: "已發出第二次提醒",
    created_at: "2026-05-15T08:00:00.000Z"
  }
];

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchIncomeRecordsForCurrentUser.mockResolvedValue(baseRows);
  mockFetchProjectsForCurrentUser.mockResolvedValue([
    { id: "project-1", name: "品牌官網重設計" },
    { id: "project-2", name: "社群行銷專案" },
    { id: "project-8", name: "短影音企劃" },
    { id: "project-9", name: "活動頁改版" }
  ]);
  mockFetchClientsForCurrentUser.mockResolvedValue([
    { id: "client-1", name: "Bright Studio" },
    { id: "client-2", name: "FlowMart" },
    { id: "client-8", name: "CaseCake" },
    { id: "client-9", name: "Northwind Co." }
  ]);
  mockCreateIncomeRecordForCurrentUser.mockImplementation(
    async (input: {
      title: string;
      amount: string;
      status: IncomeRecordStatus;
      project_id?: string;
      client_id?: string;
      due_date?: string;
      received_date?: string;
      notes?: string;
    }) => ({
      id: "ir-created",
      user_id: "user-1",
      project_id: input.project_id?.trim() ? input.project_id : null,
      client_id: input.client_id?.trim() ? input.client_id : null,
      title: input.title,
      amount: Number.parseFloat(input.amount),
      status: input.status,
      due_date: input.due_date?.trim() ? input.due_date : null,
      received_date: input.received_date?.trim() ? input.received_date : null,
      notes: input.notes?.trim() ? input.notes : null,
      created_at: "2026-05-18T08:00:00.000Z"
    })
  );
  mockUpdateIncomeRecordForCurrentUser.mockImplementation(
    async (
      incomeRecordId: string,
      input: {
        title: string;
        amount: string;
        status: IncomeRecordStatus;
        project_id?: string;
        client_id?: string;
        due_date?: string;
        received_date?: string;
        notes?: string;
      }
    ) => ({
      id: incomeRecordId,
      user_id: "user-1",
      project_id: input.project_id?.trim() ? input.project_id : null,
      client_id: input.client_id?.trim() ? input.client_id : null,
      title: input.title,
      amount: Number.parseFloat(input.amount),
      status: input.status,
      due_date: input.due_date?.trim() ? input.due_date : null,
      received_date: input.received_date?.trim() ? input.received_date : null,
      notes: input.notes?.trim() ? input.notes : null,
      created_at: "2026-05-17T08:00:00.000Z"
    })
  );
  mockDeleteIncomeRecordForCurrentUser.mockResolvedValue(true);
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

function setFieldValue(id: string, value: string) {
  const target = document.getElementById(id) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;

  expect(target).not.toBeNull();
  fireEvent.change(target as Element, { target: { value } });
}

async function waitForRowsToLoad() {
  await waitFor(() => {
    expect(screen.getAllByTestId("invoices-status-badge")).toHaveLength(3);
  });
}

describe("InvoicesPage income records read/create", () => {
  it("loads income records and renders search/filter controls", async () => {
    renderInvoicesPage();

    expect(screen.getByTestId("invoices-loading-state")).toBeInTheDocument();
    await waitForRowsToLoad();

    const search = document.getElementById("invoices-search-input") as
      | HTMLInputElement
      | null;
    const filter = document.getElementById("invoices-status-filter") as
      | HTMLSelectElement
      | null;
    const reset = screen.getByTestId(
      "invoices-reset-control"
    ) as HTMLButtonElement;

    expect(search).not.toBeNull();
    expect(filter).not.toBeNull();
    expect(
      Array.from((filter as HTMLSelectElement).options).some(
        (option) => option.value === "__ALL__"
      )
    ).toBe(true);
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("3 / 3");
    expect(reset).toBeDisabled();
  });

  it("creates a new income record and prepends it to the list", async () => {
    renderInvoicesPage();
    await waitForRowsToLoad();

    setFieldValue("invoices-create-title", "社群代操尾款");
    setFieldValue("invoices-create-amount", "9500");
    setFieldValue("invoices-create-status", "pending");
    setFieldValue("invoices-create-project-id", "project-8");
    setFieldValue("invoices-create-client-id", "client-8");
    setFieldValue("invoices-create-due-date", "2026-06-20");
    setFieldValue("invoices-create-notes", "預計月底收款");

    const createForm = document.querySelector("form") as HTMLFormElement | null;
    expect(createForm).not.toBeNull();
    fireEvent.submit(createForm as HTMLFormElement);

    await waitFor(() => {
      expect(mockCreateIncomeRecordForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockCreateIncomeRecordForCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "社群代操尾款",
        amount: "9500",
        status: "pending",
        project_id: "project-8",
        client_id: "client-8"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("invoices-create-success")).toHaveTextContent(
        "收款紀錄已建立。"
      );
    });
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("4 / 4");
    expect(screen.getAllByTestId("invoices-status-badge")).toHaveLength(4);
  });

  it("updates count for search/filter and reset restores full rows", async () => {
    renderInvoicesPage();
    await waitForRowsToLoad();

    const search = document.getElementById("invoices-search-input") as
      | HTMLInputElement
      | null;
    const filter = document.getElementById("invoices-status-filter") as
      | HTMLSelectElement
      | null;
    const reset = screen.getByTestId(
      "invoices-reset-control"
    ) as HTMLButtonElement;

    expect(search).not.toBeNull();
    expect(filter).not.toBeNull();

    fireEvent.change(search as Element, { target: { value: "尾款" } });
    expect(screen.getAllByTestId("invoices-status-badge")).toHaveLength(1);
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("1 / 3");
    expect(reset).toBeEnabled();

    fireEvent.change(filter as Element, { target: { value: "已收款" } });
    expect(screen.queryAllByTestId("invoices-status-badge")).toHaveLength(0);
    expect(screen.getByTestId("invoices-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("0 / 3");

    fireEvent.click(reset);
    expect((search as HTMLInputElement).value).toBe("");
    expect((filter as HTMLSelectElement).value).toBe("__ALL__");
    expect(screen.queryByTestId("invoices-empty-state")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("invoices-status-badge")).toHaveLength(3);
    expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("3 / 3");
    expect(reset).toBeDisabled();
  });

  it("updates the selected income record only", async () => {
    renderInvoicesPage();
    await waitForRowsToLoad();

    const editButtons = screen.getAllByTestId("invoices-edit-button");
    fireEvent.click(editButtons[0]);

    setFieldValue("invoices-edit-title-ir-1", "網站設計尾款（已調整）");
    setFieldValue("invoices-edit-amount-ir-1", "13000");
    setFieldValue("invoices-edit-status-ir-1", "paid");
    setFieldValue("invoices-edit-project-id-ir-1", "project-9");
    setFieldValue("invoices-edit-client-id-ir-1", "client-9");
    setFieldValue("invoices-edit-notes-ir-1", "已收款，待對帳");

    fireEvent.click(screen.getByTestId("invoices-save-edit-button"));

    await waitFor(() => {
      expect(mockUpdateIncomeRecordForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockUpdateIncomeRecordForCurrentUser).toHaveBeenCalledWith(
      "ir-1",
      expect.objectContaining({
        title: "網站設計尾款（已調整）",
        amount: "13000",
        status: "paid",
        project_id: "project-9",
        client_id: "client-9"
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("invoices-action-success")).toHaveTextContent(
        "收款紀錄已更新。"
      );
    });
    expect(screen.getByText("網站設計尾款（已調整）")).toBeInTheDocument();
    expect(screen.getByText("品牌顧問月費")).toBeInTheDocument();
  });

  it("renders project/client selectors with names in create and edit forms", async () => {
    renderInvoicesPage();
    await waitForRowsToLoad();

    const createProjectSelect = document.getElementById(
      "invoices-create-project-id"
    ) as HTMLSelectElement | null;
    const createClientSelect = document.getElementById(
      "invoices-create-client-id"
    ) as HTMLSelectElement | null;

    expect(createProjectSelect).not.toBeNull();
    expect(createClientSelect).not.toBeNull();
    expect(screen.getByRole("option", { name: "未綁定專案" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "未綁定客戶" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "品牌官網重設計" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bright Studio" })).toBeInTheDocument();

    const editButtons = screen.getAllByTestId("invoices-edit-button");
    fireEvent.click(editButtons[0]);

    const editProjectSelect = document.getElementById(
      "invoices-edit-project-id-ir-1"
    ) as HTMLSelectElement | null;
    const editClientSelect = document.getElementById(
      "invoices-edit-client-id-ir-1"
    ) as HTMLSelectElement | null;

    expect(editProjectSelect).not.toBeNull();
    expect(editClientSelect).not.toBeNull();
    expect((editProjectSelect as HTMLSelectElement).value).toBe("project-1");
    expect((editClientSelect as HTMLSelectElement).value).toBe("client-1");
  });

  it("deletes the selected income record only", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderInvoicesPage();
    await waitForRowsToLoad();

    const deleteButtons = screen.getAllByTestId("invoices-delete-button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteIncomeRecordForCurrentUser).toHaveBeenCalledTimes(1);
    });
    expect(mockDeleteIncomeRecordForCurrentUser).toHaveBeenCalledWith("ir-1");

    await waitFor(() => {
      expect(screen.getByTestId("invoices-result-count")).toHaveTextContent("2 / 2");
    });
    expect(screen.queryByText("網站設計尾款")).not.toBeInTheDocument();
    expect(screen.getByText("品牌顧問月費")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
