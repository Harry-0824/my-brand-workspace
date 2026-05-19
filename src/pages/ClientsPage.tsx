import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import { PageListEmptyState } from "../components/page/PageListEmptyState";
import { PageResultCount } from "../components/page/PageResultCount";
import { PageResetControl } from "../components/page/PageResetControl";
import { PageListSummaryRow } from "../components/page/PageListSummaryRow";
import { PageSearchInput } from "../components/page/PageSearchInput";
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
  CLIENT_STATUS_VALUES,
  type ClientRecord,
  type ClientStatus,
  type CreateClientInput,
  createClientForCurrentUser,
  deleteClientForCurrentUser,
  fetchClientsForCurrentUser,
  updateClientForCurrentUser
} from "../lib/clients";
import { getUserFacingErrorMessage } from "../lib/errorMessages";

const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "合作中",
  inactive: "暫停中",
  lead: "潛在客戶",
  archived: "已封存"
};

type ClientFormState = CreateClientInput;

const initialFormState: ClientFormState = {
  name: "",
  email: "",
  company: "",
  status: "lead",
  notes: ""
};

function toFormState(client: ClientRecord): ClientFormState {
  return {
    name: client.name,
    email: client.email ?? "",
    company: client.company ?? "",
    status: client.status,
    notes: client.notes ?? ""
  };
}

export function ClientsPage() {
  const [keyword, setKeyword] = useState("");
  const [clients, setClients] = useState<Awaited<
    ReturnType<typeof fetchClientsForCurrentUser>
  >>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [formState, setFormState] = useState<ClientFormState>(initialFormState);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState<ClientFormState>(
    initialFormState
  );
  const [isUpdatingClientId, setIsUpdatingClientId] = useState<string | null>(
    null
  );
  const [isDeletingClientId, setIsDeletingClientId] = useState<string | null>(
    null
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadClients() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const rows = await fetchClientsForCurrentUser();
        if (!active) {
          return;
        }
        setClients(rows);
      } catch (error) {
        if (!active) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "目前無法讀取客戶資料，請稍後再試。";
        setFetchError(getUserFacingErrorMessage(error, message));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadClients();

    return () => {
      active = false;
    };
  }, []);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleRows = clients.filter((item) => {
    if (!normalizedKeyword) {
      return true;
    }

    const searchableText = [
      item.name,
      item.email ?? "",
      item.company ?? "",
      item.status,
      STATUS_LABELS[item.status],
      item.notes ?? ""
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });
  const hasActiveCriteria = keyword.trim().length > 0;

  const summaryMetrics = [
    { label: "總客戶數", value: clients.length.toString() },
    {
      label: "合作中",
      value: clients.filter((item) => item.status === "active").length.toString()
    },
    {
      label: "潛在客戶",
      value: clients.filter((item) => item.status === "lead").length.toString()
    },
    {
      label: "已封存",
      value: clients.filter((item) => item.status === "archived").length.toString()
    }
  ] as const;

  function handleReset() {
    setKeyword("");
  }

  function updateFormField<K extends keyof ClientFormState>(
    key: K,
    value: ClientFormState[K]
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditFormField<K extends keyof ClientFormState>(
    key: K,
    value: ClientFormState[K]
  ) {
    setEditFormState((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(client: ClientRecord) {
    setActionError(null);
    setActionSuccess(null);
    setEditingClientId(client.id);
    setEditFormState(toFormState(client));
  }

  function cancelEdit() {
    setEditingClientId(null);
    setEditFormState(initialFormState);
  }

  async function handleCreateClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setActionError(null);
    setActionSuccess(null);

    if (!formState.name.trim()) {
      setCreateError("請輸入客戶名稱。");
      return;
    }

    setIsCreating(true);

    try {
      const created = await createClientForCurrentUser(formState);
      setClients((prev) => [created, ...prev]);
      setFormState(initialFormState);
      setCreateSuccess("客戶已建立。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法建立客戶，請稍後再試。";
      setCreateError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateClient(clientId: string) {
    setActionError(null);
    setActionSuccess(null);

    if (!editFormState.name.trim()) {
      setActionError("請輸入客戶名稱後再儲存。");
      return;
    }

    setIsUpdatingClientId(clientId);

    try {
      const updated = await updateClientForCurrentUser(clientId, editFormState);
      setClients((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingClientId(null);
      setEditFormState(initialFormState);
      setActionSuccess("客戶已更新。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "目前無法更新客戶，請稍後再試。";
      setActionError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsUpdatingClientId(null);
    }
  }

  async function handleDeleteClient(clientId: string) {
    setActionError(null);
    setActionSuccess(null);

    const shouldDelete = window.confirm("確定要刪除此客戶嗎？");
    if (!shouldDelete) {
      return;
    }

    setIsDeletingClientId(clientId);

    try {
      await deleteClientForCurrentUser(clientId);
      setClients((prev) => prev.filter((item) => item.id !== clientId));
      if (editingClientId === clientId) {
        cancelEdit();
      }
      setActionSuccess("客戶已刪除。");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "目前無法刪除客戶，請稍後再試。";
      setActionError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsDeletingClientId(null);
    }
  }

  return (
    <PageMain aria-labelledby="clients-page-title">
      <PageHeader>
        <PageTitle id="clients-page-title">客戶管理</PageTitle>
        <PageDescription>
          集中管理合作客戶、聯絡資訊與下一步追蹤事項。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="clients-summary-title">
        <DashboardSectionHeader
          titleId="clients-summary-title"
          title="客戶總覽"
          description="掌握目前客戶合作狀態與追蹤重點。"
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

      <DashboardPanel aria-labelledby="clients-list-title">
        <DashboardSectionHeader
          titleId="clients-list-title"
          title="客戶清單"
          description="可搜尋既有客戶，並使用最小流程新增客戶。"
          withDivider
        />

        <CreateForm onSubmit={handleCreateClient}>
          <Field>
            <FieldLabel htmlFor="clients-create-name">客戶名稱</FieldLabel>
            <FieldInput
              id="clients-create-name"
              value={formState.name}
              onChange={(event) => updateFormField("name", event.target.value)}
              placeholder="例如：Bright Studio"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="clients-create-status">狀態</FieldLabel>
            <FieldSelect
              id="clients-create-status"
              value={formState.status}
              onChange={(event) =>
                updateFormField("status", event.target.value as ClientStatus)
              }
            >
              {CLIENT_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="clients-create-email">Email</FieldLabel>
            <FieldInput
              id="clients-create-email"
              type="email"
              value={formState.email}
              onChange={(event) => updateFormField("email", event.target.value)}
              placeholder="example@company.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="clients-create-company">公司名稱</FieldLabel>
            <FieldInput
              id="clients-create-company"
              value={formState.company}
              onChange={(event) => updateFormField("company", event.target.value)}
              placeholder="例如：Northwind Co."
            />
          </Field>
          <Field className="full-width">
            <FieldLabel htmlFor="clients-create-notes">備註</FieldLabel>
            <FieldTextarea
              id="clients-create-notes"
              value={formState.notes}
              onChange={(event) => updateFormField("notes", event.target.value)}
              placeholder="可記錄聯絡偏好、提案需求或後續追蹤重點。"
            />
          </Field>
          <AddButton type="submit" disabled={isCreating}>
            {isCreating ? "建立中..." : "新增客戶"}
          </AddButton>
        </CreateForm>

        {createError ? (
          <InlineError data-testid="clients-create-error">{createError}</InlineError>
        ) : null}
        {createSuccess ? (
          <InlineSuccess data-testid="clients-create-success">
            {createSuccess}
          </InlineSuccess>
        ) : null}
        {actionError ? (
          <InlineError data-testid="clients-action-error">{actionError}</InlineError>
        ) : null}
        {actionSuccess ? (
          <InlineSuccess data-testid="clients-action-success">
            {actionSuccess}
          </InlineSuccess>
        ) : null}

        <ToolbarRow>
          <PageSearchInput
            id="clients-search-input"
            label="客戶關鍵字搜尋"
            value={keyword}
            placeholder="搜尋客戶名稱、公司或聯絡資訊..."
            onChange={setKeyword}
          />
        </ToolbarRow>
        <PageListSummaryRow>
          <PageResultCount
            testId="clients-result-count"
            visible={visibleRows.length}
            total={clients.length}
            noun="客戶"
          />
          <PageResetControl
            testId="clients-reset-control"
            disabled={!hasActiveCriteria}
            onClick={handleReset}
          />
        </PageListSummaryRow>

        {isLoading ? (
          <InlineInfo data-testid="clients-loading-state">讀取客戶中...</InlineInfo>
        ) : null}
        {fetchError ? (
          <InlineError data-testid="clients-error-state">{fetchError}</InlineError>
        ) : null}

        {!isLoading && !fetchError && visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => {
              const isEditing = editingClientId === item.id;
              const isUpdating = isUpdatingClientId === item.id;
              const isDeleting = isDeletingClientId === item.id;

              return (
                <Row key={item.id}>
                  <RowTop>
                    <ClientName>{item.name}</ClientName>
                    <StatusBadge data-testid="clients-status-badge">
                      {STATUS_LABELS[item.status]}
                    </StatusBadge>
                  </RowTop>
                  <RowMeta>
                    <MetaText>{item.company || "未填寫公司"}</MetaText>
                    <MetaText>{item.email || "未填寫 Email"}</MetaText>
                    <MetaText>{item.status}</MetaText>
                  </RowMeta>
                  <NotesText>{item.notes || "尚未填寫客戶備註。"}</NotesText>

                  <RowActions>
                    {!isEditing ? (
                      <>
                        <GhostButton
                          type="button"
                          data-testid="clients-edit-button"
                          onClick={() => startEdit(item)}
                          disabled={Boolean(isUpdatingClientId || isDeletingClientId)}
                        >
                          編輯
                        </GhostButton>
                        <DangerButton
                          type="button"
                          data-testid="clients-delete-button"
                          onClick={() => void handleDeleteClient(item.id)}
                          disabled={Boolean(isUpdatingClientId || isDeletingClientId)}
                        >
                          {isDeleting ? "刪除中..." : "刪除"}
                        </DangerButton>
                      </>
                    ) : null}
                  </RowActions>

                  {isEditing ? (
                    <EditFormGrid data-testid="clients-edit-form">
                      <Field>
                        <FieldLabel htmlFor={`clients-edit-name-${item.id}`}>
                          客戶名稱
                        </FieldLabel>
                        <FieldInput
                          id={`clients-edit-name-${item.id}`}
                          value={editFormState.name}
                          onChange={(event) =>
                            updateEditFormField("name", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`clients-edit-status-${item.id}`}>
                          狀態
                        </FieldLabel>
                        <FieldSelect
                          id={`clients-edit-status-${item.id}`}
                          value={editFormState.status}
                          onChange={(event) =>
                            updateEditFormField(
                              "status",
                              event.target.value as ClientStatus
                            )
                          }
                        >
                          {CLIENT_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </FieldSelect>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`clients-edit-email-${item.id}`}>
                          Email
                        </FieldLabel>
                        <FieldInput
                          id={`clients-edit-email-${item.id}`}
                          type="email"
                          value={editFormState.email}
                          onChange={(event) =>
                            updateEditFormField("email", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`clients-edit-company-${item.id}`}>
                          公司名稱
                        </FieldLabel>
                        <FieldInput
                          id={`clients-edit-company-${item.id}`}
                          value={editFormState.company}
                          onChange={(event) =>
                            updateEditFormField("company", event.target.value)
                          }
                        />
                      </Field>
                      <Field className="full-width">
                        <FieldLabel htmlFor={`clients-edit-notes-${item.id}`}>
                          備註
                        </FieldLabel>
                        <FieldTextarea
                          id={`clients-edit-notes-${item.id}`}
                          value={editFormState.notes}
                          onChange={(event) =>
                            updateEditFormField("notes", event.target.value)
                          }
                        />
                      </Field>
                      <EditActions>
                        <GhostButton
                          type="button"
                          data-testid="clients-cancel-edit-button"
                          onClick={cancelEdit}
                          disabled={isUpdating}
                        >
                          取消
                        </GhostButton>
                        <AddButton
                          type="button"
                          data-testid="clients-save-edit-button"
                          onClick={() => void handleUpdateClient(item.id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "更新中..." : "儲存更新"}
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
            testId="clients-empty-state"
            title="目前沒有符合條件的客戶"
            description="可先新增客戶，或調整關鍵字後再試一次。"
          />
        ) : null}

        <ReminderText>
          客戶追蹤提醒：優先處理本週需要回覆或確認的合作對象。
        </ReminderText>
      </DashboardPanel>

      <PageNextStep
        titleId="clients-next-step-title"
        title="下一步建議"
        description="看完客戶狀態後，建議直接前往相關工作頁面。"
        links={[
          { label: "前往專案頁面，確認合作項目進度", to: "/projects" },
          { label: "前往收款頁面，檢查待收款與發票", to: "/invoices" }
        ]}
        note="維持每週一次客戶追蹤節奏，可降低交付與溝通落差。"
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
  min-height: 5.5rem;
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
  grid-template-columns: minmax(14rem, 1fr);
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
  display: grid;
  grid-template-columns: repeat(3, minmax(8rem, 1fr));
  align-items: center;
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
