import type { TaskRecord } from "../../../lib/tasks";
import type { ProjectRecord } from "../../../lib/projects";
import type { ClientRecord } from "../../../lib/clients";
import type { IncomeRecord } from "../../../lib/incomeRecords";
import { Link } from "react-router-dom";
import {
  NextActionPanel,
  NextActionContent,
  NextActionMeta,
  NextActionBadge,
  NextActionTitle,
  NextActionDescription,
  CtaButtonGroup,
  PrimaryCtaButton,
  SecondaryCtaButton,
  LoadingState,
  ErrorState,
} from "./DashboardNextAction.styles";

type DashboardNextActionProps = {
  tasks: TaskRecord[];
  projects: ProjectRecord[];
  clients: ClientRecord[];
  incomeRecords: IncomeRecord[];
  isLoading: boolean;
  error: string | null;
};

const TASK_STATUS_LABEL: Record<TaskRecord["status"], string> = {
  todo: "待辦",
  in_progress: "進行中",
  done: "已完成",
  cancelled: "已取消",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
  urgent: "特急",
};

const INCOME_STATUS_LABEL: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  overdue: "已逾期",
  cancelled: "已取消",
};

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "無期限";
  }
  const date = new Date(dueDate);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function formatAmount(amount: number) {
  return `NT$${amount.toLocaleString("zh-TW", { maximumFractionDigits: 0 })}`;
}

export function DashboardNextAction({
  tasks,
  projects,
  clients,
  incomeRecords,
  isLoading,
  error,
}: DashboardNextActionProps) {
  if (isLoading) {
    return (
      <NextActionPanel aria-labelledby="next-action-title">
        <LoadingState>下一步行動載入中…</LoadingState>
      </NextActionPanel>
    );
  }

  // 只要其他任何資料不為空，即有部分資料可以運作。但若全空且有 error 時，才顯示 error。
  const isReallyEmpty =
    tasks.length === 0 &&
    projects.length === 0 &&
    clients.length === 0 &&
    incomeRecords.length === 0;

  if (error && isReallyEmpty) {
    return (
      <NextActionPanel aria-labelledby="next-action-title">
        <ErrorState>{error}</ErrorState>
      </NextActionPanel>
    );
  }

  // 1. 全空狀態：什麼都沒有 (tasks, projects, clients, incomeRecords 皆空)
  if (isReallyEmpty) {
    return (
      <NextActionPanel
        aria-labelledby="next-action-title"
        data-testid="dashboard-next-action-empty"
      >
        <NextActionContent>
          <NextActionMeta>
            <NextActionBadge $type="info">新手引導</NextActionBadge>
          </NextActionMeta>
          <NextActionTitle id="next-action-title">
            下一步行動：建立您的第一個專案或任務
          </NextActionTitle>
          <NextActionDescription>
            目前工作區尚未建立任何專案、任務或客戶資料。身為自由接案者，建議您可以先新增合作客戶，或是建立第一個專案與下一步任務來開始！
          </NextActionDescription>
          <CtaButtonGroup>
            <PrimaryCtaButton as={Link} to="/projects">
              建立第一個專案
            </PrimaryCtaButton>
            <SecondaryCtaButton as={Link} to="/tasks">
              新增待辦任務
            </SecondaryCtaButton>
            <SecondaryCtaButton as={Link} to="/clients">
              建立客戶資料
            </SecondaryCtaButton>
          </CtaButtonGroup>
        </NextActionContent>
      </NextActionPanel>
    );
  }

  // 2. 有未完成的任務 (status as "in_progress" or "todo")
  const activeTasks = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "todo",
  );

  if (activeTasks.length > 0) {
    const priorityWeight: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const sortedTasks = [...activeTasks].sort((a, b) => {
      if (a.status === "in_progress" && b.status === "todo") return -1;
      if (a.status === "todo" && b.status === "in_progress") return 1;

      const aWeight = priorityWeight[a.priority || ""] || 0;
      const bWeight = priorityWeight[b.priority || ""] || 0;
      if (aWeight !== bWeight) {
        return bWeight - aWeight;
      }

      const aTime = a.due_date
        ? new Date(a.due_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b.due_date
        ? new Date(b.due_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

    const primaryTask = sortedTasks[0];
    const taskProject = projects.find((p) => p.id === primaryTask.project_id);
    const projectName = taskProject ? taskProject.name : "獨立任務";
    const due_text = primaryTask.due_date
      ? `期限：${formatDueDate(primaryTask.due_date)}`
      : "無期限";

    return (
      <NextActionPanel
        aria-labelledby="next-action-title"
        data-testid="dashboard-next-action-task"
      >
        <NextActionContent>
          <NextActionMeta>
            <NextActionBadge $type="task">
              {primaryTask.status === "in_progress" ? "進行中任務" : "待辦任務"}
            </NextActionBadge>
            {primaryTask.priority && (
              <NextActionBadge
                $type={
                  primaryTask.priority === "urgent" ||
                  primaryTask.priority === "high"
                    ? "danger"
                    : "warning"
                }
              >
                {PRIORITY_LABEL[primaryTask.priority]}優先
              </NextActionBadge>
            )}
          </NextActionMeta>
          <NextActionTitle id="next-action-title">
            下一步行動：推進任務「{primaryTask.title}」
          </NextActionTitle>
          <NextActionDescription>
            此任務目前的狀態為「{TASK_STATUS_LABEL[primaryTask.status]}
            」（隸屬於「{projectName}」），{due_text}
            。建議排入今天優先處理事項，點擊按鈕前往任務面板更新狀態！
          </NextActionDescription>
          <CtaButtonGroup>
            <PrimaryCtaButton as={Link} to="/tasks">
              前往任務工作區
            </PrimaryCtaButton>
            {primaryTask.project_id && (
              <SecondaryCtaButton as={Link} to="/projects">
                查看關聯專案
              </SecondaryCtaButton>
            )}
          </CtaButtonGroup>
        </NextActionContent>
      </NextActionPanel>
    );
  }

  // 3. 有活躍中的專案 (status as "active")，但無任何未完成任務
  const activeProjects = projects.filter((p) => p.status === "active");
  if (activeProjects.length > 0) {
    const sortedProjects = [...activeProjects].sort((a, b) => {
      const aTime = a.due_date
        ? new Date(a.due_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b.due_date
        ? new Date(b.due_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

    const primaryProject = sortedProjects[0];
    return (
      <NextActionPanel
        aria-labelledby="next-action-title"
        data-testid="dashboard-next-action-project"
      >
        <NextActionContent>
          <NextActionMeta>
            <NextActionBadge $type="project">活躍專案</NextActionBadge>
          </NextActionMeta>
          <NextActionTitle id="next-action-title">
            下一步行動：規劃進行中專案「{primaryProject.name}」的下一步任務
          </NextActionTitle>
          <NextActionDescription>
            專案「{primaryProject.name}
            」目前設定為進行中，但尚未設定任何未完成的任務。建議儘快規劃下一個具體步驟並至任務面板新增待辦事項，以確保持續推进！
          </NextActionDescription>
          <CtaButtonGroup>
            <PrimaryCtaButton as={Link} to="/tasks">
              新增項目任務
            </PrimaryCtaButton>
            <SecondaryCtaButton as={Link} to="/projects">
              查看專案詳情
            </SecondaryCtaButton>
          </CtaButtonGroup>
        </NextActionContent>
      </NextActionPanel>
    );
  }

  // 4. 有 pending/overdue 的收付款紀錄 (incomeRecords)
  const pendingIncome = incomeRecords.filter(
    (ir) => ir.status === "pending" || ir.status === "overdue",
  );
  if (pendingIncome.length > 0) {
    const sortedIncome = [...pendingIncome].sort((a, b) => {
      const aTime = a.due_date
        ? new Date(a.due_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b.due_date
        ? new Date(b.due_date).getTime()
        : Number.MAX_SAFE_INTEGER;
      if (aTime !== bTime) return aTime - bTime;
      return b.amount - a.amount;
    });

    const primaryIncome = sortedIncome[0];
    return (
      <NextActionPanel
        aria-labelledby="next-action-title"
        data-testid="dashboard-next-action-income"
      >
        <NextActionContent>
          <NextActionMeta>
            <NextActionBadge
              $type={primaryIncome.status === "overdue" ? "danger" : "money"}
            >
              {primaryIncome.status === "overdue" ? "請款逾期" : "收款追蹤"}
            </NextActionBadge>
          </NextActionMeta>
          <NextActionTitle id="next-action-title">
            下一步行動：追蹤請款「{primaryIncome.title}」
          </NextActionTitle>
          <NextActionDescription>
            此收款項目共計 {formatAmount(primaryIncome.amount)}，目前狀態為「
            {INCOME_STATUS_LABEL[primaryIncome.status]}」
            {primaryIncome.due_date
              ? `，截止日期為 ${formatDueDate(primaryIncome.due_date)}`
              : ""}
            。建議聯絡對應客戶跟進收款與開立發票狀態！
          </NextActionDescription>
          <CtaButtonGroup>
            <PrimaryCtaButton as={Link} to="/invoices">
              前往收款管理
            </PrimaryCtaButton>
          </CtaButtonGroup>
        </NextActionContent>
      </NextActionPanel>
    );
  }

  // 5. Fallback 情況 (什麼都有，但是任務/專案全部完成且無待跟進帳款)
  return (
    <NextActionPanel
      aria-labelledby="next-action-title"
      data-testid="dashboard-next-action-fallback"
    >
      <NextActionContent>
        <NextActionMeta>
          <NextActionBadge $type="success">進度超前</NextActionBadge>
        </NextActionMeta>
        <NextActionTitle id="next-action-title">
          下一步行動：規劃下一個新案源與任務
        </NextActionTitle>
        <NextActionDescription>
          太棒了！目前所有的任務與開發專案都已如期推進，且無任何待扣/待收款項。您可以前往客戶管理維繫客戶關係，或為下一個新案源建立新專案與任務。
        </NextActionDescription>
        <CtaButtonGroup>
          <PrimaryCtaButton as={Link} to="/projects">
            建立新專案
          </PrimaryCtaButton>
          <SecondaryCtaButton as={Link} to="/clients">
            前往客戶管理
          </SecondaryCtaButton>
        </CtaButtonGroup>
      </NextActionContent>
    </NextActionPanel>
  );
}
