import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  ALL_FILTER_VALUE,
  PageFilterControl
} from "../components/page/PageFilterControl";
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
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  type CreateTaskInput,
  type TaskRecord,
  type TaskPriority,
  type TaskStatus,
  type UpdateTaskInput,
  createTaskForCurrentUser,
  deleteTaskForCurrentUser,
  fetchTasksForCurrentUser,
  updateTaskForCurrentUser
} from "../lib/tasks";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "待處理",
  in_progress: "進行中",
  done: "已完成",
  cancelled: "已取消"
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
  urgent: "緊急"
};

type TaskFormState = UpdateTaskInput;

const initialFormState: TaskFormState = {
  title: "",
  status: "todo",
  priority: "",
  project_id: "",
  due_date: ""
};

function toFormState(task: TaskRecord): TaskFormState {
  return {
    title: task.title,
    status: task.status,
    priority: task.priority ?? "",
    project_id: task.project_id ?? "",
    due_date: task.due_date ?? ""
  };
}

function formatDueDate(dateValue: string | null) {
  if (!dateValue) {
    return "未設定截止日";
  }

  return dateValue;
}

export function TasksPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof fetchTasksForCurrentUser>>>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [formState, setFormState] = useState<TaskFormState>(initialFormState);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState<TaskFormState>(
    initialFormState
  );
  const [isUpdatingTaskId, setIsUpdatingTaskId] = useState<string | null>(null);
  const [isDeletingTaskId, setIsDeletingTaskId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const rows = await fetchTasksForCurrentUser();
        if (!active) {
          return;
        }
        setTasks(rows);
      } catch (error) {
        if (!active) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "目前無法讀取任務資料，請稍後再試。";
        setFetchError(message);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const statusOptions = useMemo(
    () => TASK_STATUS_VALUES.map((status) => STATUS_LABELS[status]),
    []
  );

  const filterToStatus = useMemo(
    () =>
      Object.fromEntries(
        TASK_STATUS_VALUES.map((status) => [STATUS_LABELS[status], status])
      ) as Record<string, TaskStatus>,
    []
  );

  const rowsAfterFilter =
    statusFilter === ALL_FILTER_VALUE
      ? tasks
      : tasks.filter(
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
      item.priority ?? "",
      item.priority ? PRIORITY_LABELS[item.priority] : "",
      item.project_id ?? "",
      item.due_date ?? ""
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  const hasActiveCriteria =
    keyword.trim().length > 0 || statusFilter !== ALL_FILTER_VALUE;

  const summaryMetrics = [
    { label: "總任務數", value: tasks.length.toString() },
    {
      label: "待處理",
      value: tasks.filter((item) => item.status === "todo").length.toString()
    },
    {
      label: "進行中",
      value: tasks
        .filter((item) => item.status === "in_progress")
        .length.toString()
    },
    {
      label: "已完成",
      value: tasks.filter((item) => item.status === "done").length.toString()
    }
  ] as const;

  function handleReset() {
    setKeyword("");
    setStatusFilter(ALL_FILTER_VALUE);
  }

  function updateFormField<K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K]
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditFormField<K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K]
  ) {
    setEditFormState((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(task: TaskRecord) {
    setActionError(null);
    setActionSuccess(null);
    setEditingTaskId(task.id);
    setEditFormState(toFormState(task));
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditFormState(initialFormState);
  }

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setActionError(null);
    setActionSuccess(null);

    if (!formState.title.trim()) {
      setCreateError("請輸入任務標題。");
      return;
    }

    setIsCreating(true);

    try {
      const created = await createTaskForCurrentUser(formState);
      setTasks((prev) => [created, ...prev]);
      setFormState(initialFormState);
      setCreateSuccess("任務已建立。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法建立任務，請稍後再試。";
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateTask(taskId: string) {
    setActionError(null);
    setActionSuccess(null);

    if (!editFormState.title.trim()) {
      setActionError("請輸入任務標題後再儲存。");
      return;
    }

    setIsUpdatingTaskId(taskId);

    try {
      const updated = await updateTaskForCurrentUser(taskId, editFormState);
      setTasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingTaskId(null);
      setEditFormState(initialFormState);
      setActionSuccess("任務已更新。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法更新任務，請稍後再試。";
      setActionError(message);
    } finally {
      setIsUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId: string) {
    setActionError(null);
    setActionSuccess(null);

    const shouldDelete = window.confirm("確定要刪除此任務嗎？");
    if (!shouldDelete) {
      return;
    }

    setIsDeletingTaskId(taskId);

    try {
      await deleteTaskForCurrentUser(taskId);
      setTasks((prev) => prev.filter((item) => item.id !== taskId));
      if (editingTaskId === taskId) {
        cancelEdit();
      }
      setActionSuccess("任務已刪除。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法刪除任務，請稍後再試。";
      setActionError(message);
    } finally {
      setIsDeletingTaskId(null);
    }
  }

  return (
    <PageMain aria-labelledby="tasks-page-title">
      <PageHeader>
        <PageTitle id="tasks-page-title">任務管理</PageTitle>
        <PageDescription>
          集中追蹤待辦、進行與完成任務，確保交付節奏穩定。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="tasks-summary-title">
        <DashboardSectionHeader
          titleId="tasks-summary-title"
          title="任務總覽"
          description="快速掌握任務狀態分佈與當前執行重點。"
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

      <DashboardPanel aria-labelledby="tasks-list-title">
        <DashboardSectionHeader
          titleId="tasks-list-title"
          title="任務清單"
          description="可搜尋任務，並用最小流程新增任務。"
          withDivider
        />

        <CreateForm onSubmit={handleCreateTask}>
          <Field>
            <FieldLabel htmlFor="tasks-create-title">任務標題</FieldLabel>
            <FieldInput
              id="tasks-create-title"
              value={formState.title}
              onChange={(event) => updateFormField("title", event.target.value)}
              placeholder="例如：整理提案簡報"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="tasks-create-status">狀態</FieldLabel>
            <FieldSelect
              id="tasks-create-status"
              value={formState.status}
              onChange={(event) =>
                updateFormField("status", event.target.value as TaskStatus)
              }
            >
              {TASK_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="tasks-create-priority">優先度</FieldLabel>
            <FieldSelect
              id="tasks-create-priority"
              value={formState.priority}
              onChange={(event) =>
                updateFormField(
                  "priority",
                  event.target.value as CreateTaskInput["priority"]
                )
              }
            >
              <option value="">未設定</option>
              {TASK_PRIORITY_VALUES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="tasks-create-due-date">截止日</FieldLabel>
            <FieldInput
              id="tasks-create-due-date"
              type="date"
              value={formState.due_date}
              onChange={(event) => updateFormField("due_date", event.target.value)}
            />
          </Field>
          <Field className="full-width">
            <FieldLabel htmlFor="tasks-create-project-id">
              專案 ID（可留白）
            </FieldLabel>
            <FieldInput
              id="tasks-create-project-id"
              value={formState.project_id}
              onChange={(event) =>
                updateFormField("project_id", event.target.value)
              }
              placeholder="若目前沒有專案選單可先留白"
            />
          </Field>
          <AddButton type="submit" disabled={isCreating}>
            {isCreating ? "建立中..." : "新增任務"}
          </AddButton>
        </CreateForm>

        {createError ? (
          <InlineError data-testid="tasks-create-error">{createError}</InlineError>
        ) : null}
        {createSuccess ? (
          <InlineSuccess data-testid="tasks-create-success">
            {createSuccess}
          </InlineSuccess>
        ) : null}
        {actionError ? (
          <InlineError data-testid="tasks-action-error">{actionError}</InlineError>
        ) : null}
        {actionSuccess ? (
          <InlineSuccess data-testid="tasks-action-success">
            {actionSuccess}
          </InlineSuccess>
        ) : null}

        <ToolbarRow>
          <PageSearchInput
            id="tasks-search-input"
            label="任務關鍵字搜尋"
            value={keyword}
            placeholder="搜尋任務標題、狀態或優先度..."
            onChange={setKeyword}
          />
          <PageFilterControl
            id="tasks-status-filter"
            label="任務狀態篩選"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </ToolbarRow>
        <PageListSummaryRow>
          <PageResultCount
            testId="tasks-result-count"
            visible={visibleRows.length}
            total={tasks.length}
            noun="任務"
          />
          <PageResetControl
            testId="tasks-reset-control"
            disabled={!hasActiveCriteria}
            onClick={handleReset}
          />
        </PageListSummaryRow>

        {isLoading ? (
          <InlineInfo data-testid="tasks-loading-state">讀取任務中...</InlineInfo>
        ) : null}
        {fetchError ? (
          <InlineError data-testid="tasks-error-state">{fetchError}</InlineError>
        ) : null}

        {!isLoading && !fetchError && visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => {
              const isEditing = editingTaskId === item.id;
              const isUpdating = isUpdatingTaskId === item.id;
              const isDeleting = isDeletingTaskId === item.id;

              return (
                <Row key={item.id}>
                  <RowTop>
                    <TaskName>{item.title}</TaskName>
                    <StatusBadge data-testid="tasks-status-badge">
                      {STATUS_LABELS[item.status]}
                    </StatusBadge>
                  </RowTop>
                  <RowMeta>
                    <MetaText>{item.project_id || "未綁定專案"}</MetaText>
                    <MetaText>
                      {item.priority ? PRIORITY_LABELS[item.priority] : "未設定優先度"}
                    </MetaText>
                    <MetaText>{formatDueDate(item.due_date)}</MetaText>
                  </RowMeta>

                  <RowActions>
                    {!isEditing ? (
                      <>
                        <GhostButton
                          type="button"
                          data-testid="tasks-edit-button"
                          onClick={() => startEdit(item)}
                          disabled={Boolean(isUpdatingTaskId || isDeletingTaskId)}
                        >
                          編輯
                        </GhostButton>
                        <DangerButton
                          type="button"
                          data-testid="tasks-delete-button"
                          onClick={() => void handleDeleteTask(item.id)}
                          disabled={Boolean(isUpdatingTaskId || isDeletingTaskId)}
                        >
                          {isDeleting ? "刪除中..." : "刪除"}
                        </DangerButton>
                      </>
                    ) : null}
                  </RowActions>

                  {isEditing ? (
                    <EditFormGrid data-testid="tasks-edit-form">
                      <Field>
                        <FieldLabel htmlFor={`tasks-edit-title-${item.id}`}>
                          任務標題
                        </FieldLabel>
                        <FieldInput
                          id={`tasks-edit-title-${item.id}`}
                          value={editFormState.title}
                          onChange={(event) =>
                            updateEditFormField("title", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`tasks-edit-status-${item.id}`}>
                          狀態
                        </FieldLabel>
                        <FieldSelect
                          id={`tasks-edit-status-${item.id}`}
                          value={editFormState.status}
                          onChange={(event) =>
                            updateEditFormField(
                              "status",
                              event.target.value as TaskStatus
                            )
                          }
                        >
                          {TASK_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </FieldSelect>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`tasks-edit-priority-${item.id}`}>
                          優先度
                        </FieldLabel>
                        <FieldSelect
                          id={`tasks-edit-priority-${item.id}`}
                          value={editFormState.priority}
                          onChange={(event) =>
                            updateEditFormField(
                              "priority",
                              event.target.value as CreateTaskInput["priority"]
                            )
                          }
                        >
                          <option value="">未設定</option>
                          {TASK_PRIORITY_VALUES.map((priority) => (
                            <option key={priority} value={priority}>
                              {PRIORITY_LABELS[priority]}
                            </option>
                          ))}
                        </FieldSelect>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`tasks-edit-due-date-${item.id}`}>
                          截止日
                        </FieldLabel>
                        <FieldInput
                          id={`tasks-edit-due-date-${item.id}`}
                          type="date"
                          value={editFormState.due_date}
                          onChange={(event) =>
                            updateEditFormField("due_date", event.target.value)
                          }
                        />
                      </Field>
                      <Field className="full-width">
                        <FieldLabel htmlFor={`tasks-edit-project-id-${item.id}`}>
                          專案 ID（可留白）
                        </FieldLabel>
                        <FieldInput
                          id={`tasks-edit-project-id-${item.id}`}
                          value={editFormState.project_id}
                          onChange={(event) =>
                            updateEditFormField("project_id", event.target.value)
                          }
                        />
                      </Field>
                      <EditActions>
                        <GhostButton
                          type="button"
                          data-testid="tasks-cancel-edit-button"
                          onClick={cancelEdit}
                          disabled={isUpdating}
                        >
                          取消
                        </GhostButton>
                        <AddButton
                          type="button"
                          data-testid="tasks-save-edit-button"
                          onClick={() => void handleUpdateTask(item.id)}
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
            testId="tasks-empty-state"
            title="目前沒有符合條件的任務"
            description="可先新增任務，或調整關鍵字/狀態後再試一次。"
          />
        ) : null}

        <DistributionText>
          任務狀態建議：優先處理截止日較近且高優先度的項目。
        </DistributionText>
      </DashboardPanel>
      <PageNextStep
        titleId="tasks-next-step-title"
        title="下一步建議"
        description="整理完任務後，可前往專案與行事曆頁面安排後續行動。"
        links={[
          { label: "前往專案頁面，確認任務對應專案", to: "/projects" },
          { label: "前往行事曆頁面，安排執行時段", to: "/calendar" }
        ]}
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

const ToolbarRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
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

const TaskName = styled.h3`
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

const DistributionText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
