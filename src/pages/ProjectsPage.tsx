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
  PROJECT_STATUS_VALUES,
  type CreateProjectInput,
  type ProjectStatus,
  createProjectForCurrentUser,
  fetchProjectsForCurrentUser
} from "../lib/projects";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "進行中",
  paused: "暫停中",
  completed: "已完成",
  archived: "已封存"
};

type ProjectFormState = CreateProjectInput;

const initialFormState: ProjectFormState = {
  name: "",
  status: "active",
  description: "",
  client_name: "",
  start_date: "",
  due_date: ""
};

export function ProjectsPage() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [projects, setProjects] = useState<Awaited<
    ReturnType<typeof fetchProjectsForCurrentUser>
  >>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProjectFormState>(initialFormState);

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
        setFetchError(message);
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
      label: "封存中",
      value: projects.filter((item) => item.status === "archived").length.toString()
    }
  ] as const;

  function handleReset() {
    setKeyword("");
    setStatusFilter(ALL_FILTER_VALUE);
  }

  function updateFormField<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!formState.name.trim()) {
      setCreateError("請輸入專案名稱。");
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
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <PageMain aria-labelledby="projects-page-title">
      <PageHeader>
        <PageTitle id="projects-page-title">專案管理</PageTitle>
        <PageDescription>
          在此檢視與建立你的專案資料，並保留既有頁面排版流程。
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
          description="可依關鍵字與狀態篩選，並使用最小流程建立新專案。"
          withDivider
        />

        <CreateForm onSubmit={handleCreateProject}>
          <Field>
            <FieldLabel htmlFor="projects-create-name">專案名稱</FieldLabel>
            <FieldInput
              id="projects-create-name"
              value={formState.name}
              onChange={(event) => updateFormField("name", event.target.value)}
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
                updateFormField("status", event.target.value as ProjectStatus)
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
                updateFormField("client_name", event.target.value)
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
                updateFormField("start_date", event.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="projects-create-due-date">截止日期</FieldLabel>
            <FieldInput
              id="projects-create-due-date"
              type="date"
              value={formState.due_date}
              onChange={(event) => updateFormField("due_date", event.target.value)}
            />
          </Field>
          <Field className="full-width">
            <FieldLabel htmlFor="projects-create-description">專案描述</FieldLabel>
            <FieldTextarea
              id="projects-create-description"
              value={formState.description}
              onChange={(event) =>
                updateFormField("description", event.target.value)
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
            {visibleRows.map((item) => (
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
              </Row>
            ))}
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
        description="建立專案後，可前往任務或行事曆安排後續執行節點。"
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

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
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

const ProjectName = styled.h3`
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

const RowBody = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.7;
`;

const NextStep = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.86rem;
  font-weight: 700;
`;
