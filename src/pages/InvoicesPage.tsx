import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ALL_FILTER_VALUE, PageFilterControl } from "../components/page/PageFilterControl";
import { PageSearchInput } from "../components/page/PageSearchInput";
import { PageListEmptyState } from "../components/page/PageListEmptyState";
import { PageResultCount } from "../components/page/PageResultCount";
import { PageResetControl } from "../components/page/PageResetControl";
import { PageListSummaryRow } from "../components/page/PageListSummaryRow";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import {
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue
} from "../components/page/PageContentPrimitives";
import { PageNextStep } from "../components/page/PageNextStep";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import {
  INCOME_RECORD_STATUS_VALUES,
  type CreateIncomeRecordInput,
  type IncomeRecord,
  type IncomeRecordStatus,
  createIncomeRecordForCurrentUser,
  deleteIncomeRecordForCurrentUser,
  fetchIncomeRecordsForCurrentUser,
  updateIncomeRecordForCurrentUser,
  type UpdateIncomeRecordInput
} from "../lib/incomeRecords";
import { getUserFacingErrorMessage } from "../lib/errorMessages";

const STATUS_LABELS: Record<IncomeRecordStatus, string> = {
  pending: "待收款",
  paid: "已收款",
  overdue: "逾期",
  cancelled: "已取消"
};

type IncomeRecordFormState = UpdateIncomeRecordInput;

const initialFormState: IncomeRecordFormState = {
  title: "",
  amount: "",
  status: "pending",
  project_id: "",
  client_id: "",
  due_date: "",
  received_date: "",
  notes: ""
};

function toFormState(incomeRecord: IncomeRecord): IncomeRecordFormState {
  return {
    title: incomeRecord.title,
    amount: incomeRecord.amount.toString(),
    status: incomeRecord.status,
    project_id: incomeRecord.project_id ?? "",
    client_id: incomeRecord.client_id ?? "",
    due_date: incomeRecord.due_date ?? "",
    received_date: incomeRecord.received_date ?? "",
    notes: incomeRecord.notes ?? ""
  };
}

function formatCurrency(amount: number) {
  return `NT$${amount.toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "未設定";
  }

  return dateValue;
}

export function InvoicesPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof fetchIncomeRecordsForCurrentUser>>>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [formState, setFormState] = useState<IncomeRecordFormState>(initialFormState);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState<IncomeRecordFormState>(
    initialFormState
  );
  const [isUpdatingRecordId, setIsUpdatingRecordId] = useState<string | null>(null);
  const [isDeletingRecordId, setIsDeletingRecordId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadIncomeRecords() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const records = await fetchIncomeRecordsForCurrentUser();
        if (!active) {
          return;
        }
        setRows(records);
      } catch (error) {
        if (!active) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "目前無法讀取收款紀錄，請稍後再試。";
        setFetchError(getUserFacingErrorMessage(error, message));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadIncomeRecords();

    return () => {
      active = false;
    };
  }, []);

  const statusOptions = useMemo(
    () => INCOME_RECORD_STATUS_VALUES.map((status) => STATUS_LABELS[status]),
    []
  );

  const filterToStatus = useMemo(
    () =>
      Object.fromEntries(
        INCOME_RECORD_STATUS_VALUES.map((status) => [STATUS_LABELS[status], status])
      ) as Record<string, IncomeRecordStatus>,
    []
  );

  const rowsAfterFilter =
    statusFilter === ALL_FILTER_VALUE
      ? rows
      : rows.filter(
          (item) =>
            STATUS_LABELS[item.status] === statusFilter ||
            item.status === filterToStatus[statusFilter]
        );

  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleRows = rowsAfterFilter.filter((item) => {
    if (!normalizedKeyword) {
      return true;
    }

    const searchableText = [
      item.title,
      item.status,
      STATUS_LABELS[item.status],
      item.amount.toString(),
      item.project_id ?? "",
      item.client_id ?? "",
      item.due_date ?? "",
      item.received_date ?? "",
      item.notes ?? ""
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  const hasActiveCriteria =
    keyword.trim().length > 0 || statusFilter !== ALL_FILTER_VALUE;

  const totalAmount = rows.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = rows
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = rows
    .filter((item) => item.status === "pending" || item.status === "overdue")
    .reduce((sum, item) => sum + item.amount, 0);
  const overdueCount = rows.filter((item) => item.status === "overdue").length;

  const summaryMetrics = [
    { label: "收款項目總數", value: rows.length.toString() },
    { label: "累計收款金額", value: formatCurrency(totalAmount) },
    { label: "待追蹤金額", value: formatCurrency(pendingAmount) },
    { label: "已收款金額", value: formatCurrency(paidAmount) },
    { label: "逾期項目", value: overdueCount.toString() }
  ] as const;

  function handleReset() {
    setKeyword("");
    setStatusFilter(ALL_FILTER_VALUE);
  }

  function updateFormField<K extends keyof IncomeRecordFormState>(
    key: K,
    value: IncomeRecordFormState[K]
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditFormField<K extends keyof IncomeRecordFormState>(
    key: K,
    value: IncomeRecordFormState[K]
  ) {
    setEditFormState((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(incomeRecord: IncomeRecord) {
    setActionError(null);
    setActionSuccess(null);
    setEditingRecordId(incomeRecord.id);
    setEditFormState(toFormState(incomeRecord));
  }

  function cancelEdit() {
    setEditingRecordId(null);
    setEditFormState(initialFormState);
  }

  async function handleCreateIncomeRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setActionError(null);
    setActionSuccess(null);

    if (!formState.title.trim()) {
      setCreateError("請輸入收款標題。");
      return;
    }

    const parsedAmount = Number.parseFloat(formState.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setCreateError("請輸入有效且不為負數的金額。");
      return;
    }

    setIsCreating(true);

    try {
      const created = await createIncomeRecordForCurrentUser(formState);
      setRows((prev) => [created, ...prev]);
      setFormState(initialFormState);
      setCreateSuccess("收款紀錄已建立。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法建立收款紀錄，請稍後再試。";
      setCreateError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateIncomeRecord(incomeRecordId: string) {
    setActionError(null);
    setActionSuccess(null);

    if (!editFormState.title.trim()) {
      setActionError("請輸入收款標題後再儲存。");
      return;
    }

    const parsedAmount = Number.parseFloat(editFormState.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setActionError("請輸入有效且不為負數的金額。");
      return;
    }

    setIsUpdatingRecordId(incomeRecordId);

    try {
      const updated = await updateIncomeRecordForCurrentUser(
        incomeRecordId,
        editFormState
      );
      setRows((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingRecordId(null);
      setEditFormState(initialFormState);
      setActionSuccess("收款紀錄已更新。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法更新收款紀錄，請稍後再試。";
      setActionError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsUpdatingRecordId(null);
    }
  }

  async function handleDeleteIncomeRecord(incomeRecordId: string) {
    setActionError(null);
    setActionSuccess(null);

    const shouldDelete = window.confirm("確定要刪除此收款紀錄嗎？");
    if (!shouldDelete) {
      return;
    }

    setIsDeletingRecordId(incomeRecordId);

    try {
      await deleteIncomeRecordForCurrentUser(incomeRecordId);
      setRows((prev) => prev.filter((item) => item.id !== incomeRecordId));
      if (editingRecordId === incomeRecordId) {
        cancelEdit();
      }
      setActionSuccess("收款紀錄已刪除。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法刪除收款紀錄，請稍後再試。";
      setActionError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsDeletingRecordId(null);
    }
  }

  return (
    <PageMain aria-labelledby="invoices-page-title">
      <PageHeader>
        <PageTitle id="invoices-page-title">收款管理</PageTitle>
        <PageDescription>
          集中查看待收款、已開立發票與近期付款追蹤事項。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="invoices-summary-title">
        <DashboardSectionHeader
          titleId="invoices-summary-title"
          title="收款總覽"
          description="快速查看本月收款與待追蹤發票項目。"
          withDivider
        />
        <MetricGrid>
          {summaryMetrics.map((metric) => (
            <MetricCard key={metric.label}>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricValue>{metric.value}</MetricValue>
            </MetricCard>
          ))}
        </MetricGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="invoices-list-title">
        <DashboardSectionHeader
          titleId="invoices-list-title"
          title="發票與收款項目"
          description="可檢視並建立收款紀錄，追蹤付款狀態。"
          withDivider
        />

        <CreateForm onSubmit={handleCreateIncomeRecord}>
          <Field>
            <FieldLabel htmlFor="invoices-create-title">收款標題</FieldLabel>
            <FieldInput
              id="invoices-create-title"
              value={formState.title}
              onChange={(event) => updateFormField("title", event.target.value)}
              placeholder="例如：網站尾款"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invoices-create-amount">金額</FieldLabel>
            <FieldInput
              id="invoices-create-amount"
              type="number"
              min="0"
              step="0.01"
              value={formState.amount}
              onChange={(event) => updateFormField("amount", event.target.value)}
              placeholder="例如：12000"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invoices-create-status">狀態</FieldLabel>
            <FieldSelect
              id="invoices-create-status"
              value={formState.status}
              onChange={(event) =>
                updateFormField("status", event.target.value as IncomeRecordStatus)
              }
            >
              {INCOME_RECORD_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="invoices-create-due-date">到期日</FieldLabel>
            <FieldInput
              id="invoices-create-due-date"
              type="date"
              value={formState.due_date}
              onChange={(event) => updateFormField("due_date", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invoices-create-received-date">收款日</FieldLabel>
            <FieldInput
              id="invoices-create-received-date"
              type="date"
              value={formState.received_date}
              onChange={(event) =>
                updateFormField("received_date", event.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invoices-create-project-id">專案 ID（可留白）</FieldLabel>
            <FieldInput
              id="invoices-create-project-id"
              value={formState.project_id}
              onChange={(event) =>
                updateFormField("project_id", event.target.value)
              }
              placeholder="若目前無專案選單可先留白"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invoices-create-client-id">客戶 ID（可留白）</FieldLabel>
            <FieldInput
              id="invoices-create-client-id"
              value={formState.client_id}
              onChange={(event) =>
                updateFormField("client_id", event.target.value)
              }
              placeholder="若目前無客戶選單可先留白"
            />
          </Field>
          <Field className="full-width">
            <FieldLabel htmlFor="invoices-create-notes">備註</FieldLabel>
            <FieldTextarea
              id="invoices-create-notes"
              value={formState.notes}
              onChange={(event) => updateFormField("notes", event.target.value)}
              placeholder="可記錄付款方式、追蹤備註等"
            />
          </Field>
          <AddButton type="submit" disabled={isCreating}>
            {isCreating ? "建立中..." : "新增收款紀錄"}
          </AddButton>
        </CreateForm>

        {createError ? (
          <InlineError data-testid="invoices-create-error">{createError}</InlineError>
        ) : null}
        {createSuccess ? (
          <InlineSuccess data-testid="invoices-create-success">
            {createSuccess}
          </InlineSuccess>
        ) : null}
        {actionError ? (
          <InlineError data-testid="invoices-action-error">{actionError}</InlineError>
        ) : null}
        {actionSuccess ? (
          <InlineSuccess data-testid="invoices-action-success">
            {actionSuccess}
          </InlineSuccess>
        ) : null}

        <ToolbarRow>
          <PageSearchInput
            id="invoices-search-input"
            label="收款關鍵字搜尋"
            value={keyword}
            placeholder="搜尋標題、狀態、金額或備註..."
            onChange={setKeyword}
          />
          <PageFilterControl
            id="invoices-status-filter"
            label="收款狀態篩選"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </ToolbarRow>
        <PageListSummaryRow>
          <PageResultCount
            testId="invoices-result-count"
            visible={visibleRows.length}
            total={rows.length}
            noun="收款項目"
          />
          <PageResetControl
            testId="invoices-reset-control"
            disabled={!hasActiveCriteria}
            onClick={handleReset}
          />
        </PageListSummaryRow>

        {isLoading ? (
          <InlineInfo data-testid="invoices-loading-state">讀取收款紀錄中...</InlineInfo>
        ) : null}
        {fetchError ? (
          <InlineError data-testid="invoices-error-state">{fetchError}</InlineError>
        ) : null}

        {!isLoading && !fetchError && visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => {
              const isEditing = editingRecordId === item.id;
              const isUpdating = isUpdatingRecordId === item.id;
              const isDeleting = isDeletingRecordId === item.id;

              return (
                <Row key={item.id}>
                  <RowTop>
                    <ClientName>{item.title}</ClientName>
                    <StatusBadge data-testid="invoices-status-badge">
                      {STATUS_LABELS[item.status]}
                    </StatusBadge>
                  </RowTop>
                  <RowMeta>
                    <MetaText>{formatCurrency(item.amount)}</MetaText>
                    <MetaText>到期：{formatDate(item.due_date)}</MetaText>
                    <MetaText>收款：{formatDate(item.received_date)}</MetaText>
                  </RowMeta>
                  <RowMeta>
                    <MetaText>專案：{item.project_id || "未綁定"}</MetaText>
                    <MetaText>客戶：{item.client_id || "未綁定"}</MetaText>
                  </RowMeta>
                  <NotesText>{item.notes || "未填寫備註"}</NotesText>

                  <RowActions>
                    {!isEditing ? (
                      <>
                        <GhostButton
                          type="button"
                          data-testid="invoices-edit-button"
                          onClick={() => startEdit(item)}
                          disabled={Boolean(isUpdatingRecordId || isDeletingRecordId)}
                        >
                          編輯
                        </GhostButton>
                        <DangerButton
                          type="button"
                          data-testid="invoices-delete-button"
                          onClick={() => void handleDeleteIncomeRecord(item.id)}
                          disabled={Boolean(isUpdatingRecordId || isDeletingRecordId)}
                        >
                          {isDeleting ? "刪除中..." : "刪除"}
                        </DangerButton>
                      </>
                    ) : null}
                  </RowActions>

                  {isEditing ? (
                    <EditFormGrid data-testid="invoices-edit-form">
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-title-${item.id}`}>
                          收款標題
                        </FieldLabel>
                        <FieldInput
                          id={`invoices-edit-title-${item.id}`}
                          value={editFormState.title}
                          onChange={(event) =>
                            updateEditFormField("title", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-amount-${item.id}`}>
                          金額
                        </FieldLabel>
                        <FieldInput
                          id={`invoices-edit-amount-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={editFormState.amount}
                          onChange={(event) =>
                            updateEditFormField("amount", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-status-${item.id}`}>
                          狀態
                        </FieldLabel>
                        <FieldSelect
                          id={`invoices-edit-status-${item.id}`}
                          value={editFormState.status}
                          onChange={(event) =>
                            updateEditFormField(
                              "status",
                              event.target.value as IncomeRecordStatus
                            )
                          }
                        >
                          {INCOME_RECORD_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </FieldSelect>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-due-date-${item.id}`}>
                          到期日
                        </FieldLabel>
                        <FieldInput
                          id={`invoices-edit-due-date-${item.id}`}
                          type="date"
                          value={editFormState.due_date}
                          onChange={(event) =>
                            updateEditFormField("due_date", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-received-date-${item.id}`}>
                          收款日
                        </FieldLabel>
                        <FieldInput
                          id={`invoices-edit-received-date-${item.id}`}
                          type="date"
                          value={editFormState.received_date}
                          onChange={(event) =>
                            updateEditFormField("received_date", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-project-id-${item.id}`}>
                          專案 ID（可留白）
                        </FieldLabel>
                        <FieldInput
                          id={`invoices-edit-project-id-${item.id}`}
                          value={editFormState.project_id}
                          onChange={(event) =>
                            updateEditFormField("project_id", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`invoices-edit-client-id-${item.id}`}>
                          客戶 ID（可留白）
                        </FieldLabel>
                        <FieldInput
                          id={`invoices-edit-client-id-${item.id}`}
                          value={editFormState.client_id}
                          onChange={(event) =>
                            updateEditFormField("client_id", event.target.value)
                          }
                        />
                      </Field>
                      <Field className="full-width">
                        <FieldLabel htmlFor={`invoices-edit-notes-${item.id}`}>
                          備註
                        </FieldLabel>
                        <FieldTextarea
                          id={`invoices-edit-notes-${item.id}`}
                          value={editFormState.notes}
                          onChange={(event) =>
                            updateEditFormField("notes", event.target.value)
                          }
                        />
                      </Field>
                      <EditActions>
                        <GhostButton
                          type="button"
                          data-testid="invoices-cancel-edit-button"
                          onClick={cancelEdit}
                          disabled={isUpdating}
                        >
                          取消
                        </GhostButton>
                        <AddButton
                          type="button"
                          data-testid="invoices-save-edit-button"
                          onClick={() => void handleUpdateIncomeRecord(item.id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "儲存中..." : "儲存變更"}
                        </AddButton>
                      </EditActions>
                    </EditFormGrid>
                  ) : null}
                </Row>
              );
            })}
          </Rows>
        ) : null}

        {!isLoading && !fetchError && visibleRows.length === 0 ? (
          <PageListEmptyState
            testId="invoices-empty-state"
            title="目前沒有符合條件的收款項目"
            description="可先新增收款紀錄，或調整關鍵字與篩選條件。"
          />
        ) : null}

        <ReminderText>收款提醒：優先追蹤本週到期與待開立發票的項目。</ReminderText>
      </DashboardPanel>

      <PageNextStep
        titleId="invoices-next-step-title"
        title="下一步建議"
        description="收款狀態確認後，可直接切到關聯頁面延續工作流程。"
        links={[
          { label: "前往客戶頁面，確認待回覆對象", to: "/clients" },
          { label: "前往報表頁面，快速檢查收款快照", to: "/reports" }
        ]}
        note="建議先處理待收款，再同步更新本週追蹤清單。"
      />
    </PageMain>
  );
}

const MetricGrid = PageMetricGrid;
const MetricCard = PageMetricCard;
const MetricLabel = PageMetricLabel;
const MetricValue = PageMetricValue;

const CreateForm = styled.form`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(2, minmax(12rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  .full-width {
    grid-column: 1 / -1;
  }
`;

const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

const FieldInput = styled.input`
  width: 100%;
  height: 2.5rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgb(255 255 255 / 0.04);
  color: ${({ theme }) => theme.textPrimary};
  padding: 0 0.75rem;
  font-size: 0.9rem;
`;

const FieldSelect = styled.select`
  width: 100%;
  height: 2.5rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgb(255 255 255 / 0.04);
  color: ${({ theme }) => theme.textPrimary};
  padding: 0 0.75rem;
  font-size: 0.9rem;
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgb(255 255 255 / 0.04);
  color: ${({ theme }) => theme.textPrimary};
  padding: 0.75rem;
  font-size: 0.9rem;
  resize: vertical;
`;

const ToolbarRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AddButton = styled.button`
  border: 1px solid rgb(98 214 199 / 0.35);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(98 214 199 / 0.12);
  font-size: 0.9rem;
  font-weight: 700;
  min-height: 2.5rem;
  align-self: end;
  cursor: pointer;
  padding: 0 0.8rem;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.06);
  font-size: 0.82rem;
  font-weight: 700;
  min-height: 2rem;
  padding: 0 0.75rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(GhostButton)`
  border-color: rgb(255 142 142 / 0.4);
  background: rgb(255 142 142 / 0.1);
  color: #ffb2b2;
`;

const InlineInfo = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 700;
`;

const InlineError = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: #ff8e8e;
  font-size: 0.85rem;
  font-weight: 700;
`;

const InlineSuccess = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: #79dfc9;
  font-size: 0.85rem;
  font-weight: 700;
`;

const Rows = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ClientName = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.96rem;
  font-weight: 800;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(246 200 95 / 0.32);
  border-radius: 999px;
  color: #f8d98a;
  background: rgb(246 200 95 / 0.12);
  font-size: 0.72rem;
  font-weight: 800;
`;

const RowMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetaText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  font-weight: 700;
`;

const NotesText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.6;
`;

const RowActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EditFormGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: grid;
  grid-template-columns: repeat(2, minmax(12rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  .full-width {
    grid-column: 1 / -1;
  }
`;

const EditActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReminderText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
