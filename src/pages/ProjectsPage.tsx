import { useEffect, useMemo, useState } from "react";
import {
  CreateForm,
  Field,
  FieldLabel,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  ToolbarRow,
  AddButton,
  GhostButton,
  DangerButton,
  InlineInfo,
  InlineError,
  InlineSuccess,
  Rows,
  Row,
  RowTop,
  ProjectName,
  StatusBadge,
  RowMeta,
  MetaText,
  RowBody,
  NextStep,
  RowActions,
  EditFormGrid,
  EditActions
} from "./ProjectsPage.styles";
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
  PROJECT_STATUS_VALUES,
  type ProjectRecord,
  type ProjectStatus,
  createProjectForCurrentUser,
  deleteProjectForCurrentUser,
  fetchProjectsForCurrentUser,
  updateProjectForCurrentUser
} from "../lib/projects";
import { getUserFacingErrorMessage } from "../lib/errorMessages";
import {
  STATUS_LABELS,
  getDateRangeError,
  initialFormState,
  toFormState,
  type ProjectFormState
} from "../features/projects";

export function ProjectsPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [projects, setProjects] = useState<Awaited<
    ReturnType<typeof fetchProjectsForCurrentUser>
  >>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProjectFormState>(initialFormState);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState<ProjectFormState>(
    initialFormState
  );
  const [isUpdatingProjectId, setIsUpdatingProjectId] = useState<string | null>(
    null
  );
  const [isDeletingProjectId, setIsDeletingProjectId] = useState<string | null>(
    null
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const rows = await fetchProjectsForCurrentUser();

        if (!active) {
          return;
        }

        setProjects(rows);
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "目前無法讀取專案資料，請稍後再試。";
        setFetchError(getUserFacingErrorMessage(error, message));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const statusOptions = useMemo(
    () => PROJECT_STATUS_VALUES.map((status) => STATUS_LABELS[status]),
    []
  );

  const filterToStatus = useMemo(
    () =>
      Object.fromEntries(
        PROJECT_STATUS_VALUES.map((status) => [STATUS_LABELS[status], status])
      ) as Record<string, ProjectStatus>,
    []
  );

  const rowsAfterFilter =
    statusFilter === ALL_FILTER_VALUE
      ? projects
      : projects.filter(
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
      item.name,
      item.client_name ?? "",
      item.status,
      STATUS_LABELS[item.status],
      item.description ?? ""
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });

  const hasActiveCriteria =
    keyword.trim().length > 0 || statusFilter !== ALL_FILTER_VALUE;

  const summaryMetrics = [
    { label: "總專案數", value: projects.length.toString() },
    {
      label: "進行中",
      value: projects.filter((item) => item.status === "active").length.toString()
    },
    {
      label: "已完成",
      value: projects
        .filter((item) => item.status === "completed")
        .length.toString()
    },
    {
      label: "已封存",
      value: projects.filter((item) => item.status === "archived").length.toString()
    }
  ] as const;

  function handleReset() {
    setKeyword("");
    setStatusFilter(ALL_FILTER_VALUE);
  }

  function updateCreateFormField<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditFormField<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) {
    setEditFormState((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(project: ProjectRecord) {
    setActionError(null);
    setActionSuccess(null);
    setEditError(null);
    setEditingProjectId(project.id);
    setEditFormState(toFormState(project));
  }

  function cancelEdit() {
    setEditingProjectId(null);
    setEditFormState(initialFormState);
    setEditError(null);
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setActionError(null);
    setActionSuccess(null);

    if (!formState.name.trim()) {
      setCreateError("請輸入專案名稱。");
      return;
    }

    const dateRangeError = getDateRangeError(formState.start_date, formState.due_date);
    if (dateRangeError) {
      setCreateError(dateRangeError);
      return;
    }

    setIsCreating(true);

    try {
      const created = await createProjectForCurrentUser(formState);
      setProjects((prev) => [created, ...prev]);
      setFormState(initialFormState);
      setCreateSuccess("專案已建立。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法建立專案，請稍後再試。";
      setCreateError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateProject(projectId: string) {
    setEditError(null);
    setActionSuccess(null);

    if (!editFormState.name.trim()) {
      setEditError("請輸入專案名稱後再儲存。");
      return;
    }

    const dateRangeError = getDateRangeError(
      editFormState.start_date,
      editFormState.due_date
    );
    if (dateRangeError) {
      setEditError(dateRangeError);
      return;
    }

    setIsUpdatingProjectId(projectId);

    try {
      const updated = await updateProjectForCurrentUser(projectId, editFormState);
      setProjects((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingProjectId(null);
      setEditFormState(initialFormState);
      setActionSuccess("專案已更新。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法更新專案，請稍後再試。";
      setEditError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsUpdatingProjectId(null);
    }
  }

  async function handleDeleteProject(projectId: string) {
    setActionError(null);
    setActionSuccess(null);

    const shouldDelete = window.confirm("確定要刪除此專案嗎？");
    if (!shouldDelete) {
      return;
    }

    setIsDeletingProjectId(projectId);

    try {
      await deleteProjectForCurrentUser(projectId);
      setProjects((prev) => prev.filter((item) => item.id !== projectId));
      if (editingProjectId === projectId) {
        cancelEdit();
      }
      setActionSuccess("專案已刪除。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "目前無法刪除專案，請稍後再試。";
      setActionError(getUserFacingErrorMessage(error, message));
    } finally {
      setIsDeletingProjectId(null);
    }
  }

  return (
    <PageMain aria-labelledby="projects-page-title">
      <PageHeader>
        <PageTitle id="projects-page-title">專案管理</PageTitle>
        <PageDescription>
          在此檢視、建立、更新與刪除你的專案資料，並維持既有頁面結構。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="projects-summary-title">
        <DashboardSectionHeader
          titleId="projects-summary-title"
          title="專案概覽"
          description="顯示目前專案總數與主要狀態分佈。"
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

      <DashboardPanel aria-labelledby="projects-list-title">
        <DashboardSectionHeader
          titleId="projects-list-title"
          title="專案列表"
          description="可依關鍵字與狀態篩選，並在列表中進行最小更新與刪除操作。"
          withDivider
        />

        <CreateForm onSubmit={handleCreateProject}>
          <Field>
            <FieldLabel htmlFor="projects-create-name">專案名稱</FieldLabel>
            <FieldInput
              id="projects-create-name"
              value={formState.name}
              onChange={(event) =>
                updateCreateFormField("name", event.target.value)
              }
              placeholder="例如：品牌官網重設計"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="projects-create-status">狀態</FieldLabel>
            <FieldSelect
              id="projects-create-status"
              value={formState.status}
              onChange={(event) =>
                updateCreateFormField("status", event.target.value as ProjectStatus)
              }
            >
              {PROJECT_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="projects-create-client">客戶名稱</FieldLabel>
            <FieldInput
              id="projects-create-client"
              value={formState.client_name}
              onChange={(event) =>
                updateCreateFormField("client_name", event.target.value)
              }
              placeholder="例如：Bright Studio"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="projects-create-start-date">開始日期</FieldLabel>
            <FieldInput
              id="projects-create-start-date"
              type="date"
              value={formState.start_date}
              onChange={(event) =>
                updateCreateFormField("start_date", event.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="projects-create-due-date">截止日期</FieldLabel>
            <FieldInput
              id="projects-create-due-date"
              type="date"
              value={formState.due_date}
              onChange={(event) =>
                updateCreateFormField("due_date", event.target.value)
              }
            />
          </Field>
          <Field className="full-width">
            <FieldLabel htmlFor="projects-create-description">專案描述</FieldLabel>
            <FieldTextarea
              id="projects-create-description"
              value={formState.description}
              onChange={(event) =>
                updateCreateFormField("description", event.target.value)
              }
              placeholder="描述本專案主要目標或交付重點。"
            />
          </Field>
          <AddButton type="submit" disabled={isCreating}>
            {isCreating ? "建立中..." : "新增專案"}
          </AddButton>
        </CreateForm>

        {createError ? (
          <InlineError data-testid="projects-create-error">{createError}</InlineError>
        ) : null}
        {createSuccess ? (
          <InlineSuccess data-testid="projects-create-success">
            {createSuccess}
          </InlineSuccess>
        ) : null}
        {actionError ? (
          <InlineError data-testid="projects-action-error">{actionError}</InlineError>
        ) : null}
        {actionSuccess ? (
          <InlineSuccess data-testid="projects-action-success">
            {actionSuccess}
          </InlineSuccess>
        ) : null}

        <ToolbarRow>
          <PageSearchInput
            id="projects-search-input"
            label="專案關鍵字搜尋"
            value={keyword}
            placeholder="輸入專案、客戶或描述..."
            onChange={setKeyword}
          />
          <PageFilterControl
            id="projects-status-filter"
            label="專案狀態"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </ToolbarRow>
        <PageListSummaryRow>
          <PageResultCount
            testId="projects-result-count"
            visible={visibleRows.length}
            total={projects.length}
            noun="專案"
          />
          <PageResetControl
            testId="projects-reset-control"
            disabled={!hasActiveCriteria}
            onClick={handleReset}
          />
        </PageListSummaryRow>

        {isLoading ? (
          <InlineInfo data-testid="projects-loading-state">讀取專案中...</InlineInfo>
        ) : null}
        {fetchError ? (
          <InlineError data-testid="projects-error-state">{fetchError}</InlineError>
        ) : null}

        {!isLoading && !fetchError && visibleRows.length > 0 ? (
          <Rows>
            {visibleRows.map((item) => {
              const isEditing = editingProjectId === item.id;
              const isUpdating = isUpdatingProjectId === item.id;
              const isDeleting = isDeletingProjectId === item.id;

              return (
                <Row key={item.id}>
                  <RowTop>
                    <ProjectName>{item.name}</ProjectName>
                    <StatusBadge data-testid="projects-status-badge">
                      {STATUS_LABELS[item.status]}
                    </StatusBadge>
                  </RowTop>
                  <RowMeta>
                    <MetaText>{item.client_name || "未填寫客戶"}</MetaText>
                    <MetaText>{item.status}</MetaText>
                  </RowMeta>
                  <RowBody>{item.description || "尚未填寫專案描述。"}</RowBody>
                  <NextStep>
                    開始：{item.start_date || "未設定"} ｜ 截止：
                    {item.due_date || "未設定"}
                  </NextStep>
                  <RowActions>
                    {!isEditing ? (
                      <>
                        <GhostButton
                          type="button"
                          data-testid="projects-edit-button"
                          onClick={() => startEdit(item)}
                          disabled={Boolean(isUpdatingProjectId || isDeletingProjectId)}
                        >
                          編輯
                        </GhostButton>
                        <DangerButton
                          type="button"
                          data-testid="projects-delete-button"
                          onClick={() => void handleDeleteProject(item.id)}
                          disabled={Boolean(isUpdatingProjectId || isDeletingProjectId)}
                        >
                          {isDeleting ? "刪除中..." : "刪除"}
                        </DangerButton>
                      </>
                    ) : null}
                  </RowActions>

                  {isEditing ? (
                    <EditFormGrid data-testid="projects-edit-form">
                      <Field>
                        <FieldLabel htmlFor={`projects-edit-name-${item.id}`}>
                          專案名稱
                        </FieldLabel>
                        <FieldInput
                          id={`projects-edit-name-${item.id}`}
                          value={editFormState.name}
                          onChange={(event) =>
                            updateEditFormField("name", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`projects-edit-status-${item.id}`}>
                          狀態
                        </FieldLabel>
                        <FieldSelect
                          id={`projects-edit-status-${item.id}`}
                          value={editFormState.status}
                          onChange={(event) =>
                            updateEditFormField(
                              "status",
                              event.target.value as ProjectStatus
                            )
                          }
                        >
                          {PROJECT_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </FieldSelect>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`projects-edit-client-${item.id}`}>
                          客戶名稱
                        </FieldLabel>
                        <FieldInput
                          id={`projects-edit-client-${item.id}`}
                          value={editFormState.client_name}
                          onChange={(event) =>
                            updateEditFormField("client_name", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`projects-edit-start-date-${item.id}`}>
                          開始日期
                        </FieldLabel>
                        <FieldInput
                          id={`projects-edit-start-date-${item.id}`}
                          type="date"
                          value={editFormState.start_date}
                          onChange={(event) =>
                            updateEditFormField("start_date", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor={`projects-edit-due-date-${item.id}`}>
                          截止日期
                        </FieldLabel>
                        <FieldInput
                          id={`projects-edit-due-date-${item.id}`}
                          type="date"
                          value={editFormState.due_date}
                          onChange={(event) =>
                            updateEditFormField("due_date", event.target.value)
                          }
                        />
                      </Field>
                      <Field className="full-width">
                        <FieldLabel htmlFor={`projects-edit-description-${item.id}`}>
                          專案描述
                        </FieldLabel>
                        <FieldTextarea
                          id={`projects-edit-description-${item.id}`}
                          value={editFormState.description}
                          onChange={(event) =>
                            updateEditFormField("description", event.target.value)
                          }
                        />
                      </Field>
                      <EditActions>
                        <GhostButton
                          type="button"
                          data-testid="projects-cancel-edit-button"
                          onClick={cancelEdit}
                          disabled={isUpdating}
                        >
                          取消
                        </GhostButton>
                        <AddButton
                          type="button"
                          data-testid="projects-save-edit-button"
                          onClick={() => void handleUpdateProject(item.id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "儲存中..." : "儲存更新"}
                        </AddButton>
                      </EditActions>
                      {editError ? (
                        <InlineError data-testid="projects-edit-error">
                          {editError}
                        </InlineError>
                      ) : null}
                    </EditFormGrid>
                  ) : null}
                </Row>
              );
            })}
          </Rows>
        ) : null}

        {!isLoading && !fetchError && visibleRows.length === 0 ? (
          <PageListEmptyState
            testId="projects-empty-state"
            title="目前沒有符合條件的專案"
            description="可先新增專案，或調整搜尋與狀態篩選條件。"
          />
        ) : null}
      </DashboardPanel>

      <PageNextStep
        titleId="projects-next-step-title"
        title="下一步建議"
        description="完成專案調整後，可前往任務或行事曆安排後續執行節點。"
        links={[
          { label: "前往任務頁面，安排下一步執行項目", to: "/tasks" },
          { label: "前往行事曆頁面，確認交付節點", to: "/calendar" }
        ]}
      />
    </PageMain>
  );
}

const MetricGrid = PageMetricGrid;
const MetricCard = PageMetricCard;
const MetricLabel = PageMetricLabel;
const MetricValue = PageMetricValue;
