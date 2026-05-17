import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InvoicesPage } from "./InvoicesPage";
import { theme } from "../styles/theme";
import type { IncomeRecordStatus } from "../lib/incomeRecords";

const mockFetchIncomeRecordsForCurrentUser = vi.fn();
const mockCreateIncomeRecordForCurrentUser = vi.fn();

vi.mock("../lib/incomeRecords", () => ({
  INCOME_RECORD_STATUS_VALUES: ["pending", "paid", "overdue", "cancelled"],
  fetchIncomeRecordsForCurrentUser: (...args: unknown[]) =>
    mockFetchIncomeRecordsForCurrentUser(...args),
  createIncomeRecordForCurrentUser: (...args: unknown[]) =>
    mockCreateIncomeRecordForCurrentUser(...args)
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
});
