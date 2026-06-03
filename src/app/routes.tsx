import type { ReactElement } from "react";
import { DashboardContent } from "../components/dashboard/DashboardContent";
import { CalendarPage } from "../pages/CalendarPage";
import { ClientsPage } from "../pages/ClientsPage";
import { FilesPage } from "../pages/FilesPage";
import { HelpPage } from "../pages/HelpPage";
import { InvoicesPage } from "../pages/InvoicesPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TasksPage } from "../pages/TasksPage";

type AppRoutePath =
  | "/"
  | "/projects"
  | "/projects/:projectId"
  | "/tasks"
  | "/clients"
  | "/files"
  | "/help"
  | "/invoices"
  | "/calendar"
  | "/reports"
  | "/settings"
  | "*";

export type SidebarSection = "primary" | "secondary";

export type AppRouteMeta = {
  heading: string;
  label: string | null;
  path: AppRoutePath;
  showInSidebar: boolean;
  sidebarSection?: SidebarSection;
  key: string;
  element: ReactElement;
};

export const APP_ROUTES: AppRouteMeta[] = [
  {
    key: "dashboard",
    path: "/",
    label: "儀表板",
    heading: "儀表板",
    showInSidebar: true,
    sidebarSection: "primary",
    element: <DashboardContent />,
  },
  {
    key: "projects",
    path: "/projects",
    label: "專案",
    heading: "專案管理",
    showInSidebar: true,
    sidebarSection: "primary",
    element: <ProjectsPage />,
  },
  {
    key: "project-detail",
    path: "/projects/:projectId",
    label: null,
    heading: "專案詳情",
    showInSidebar: false,
    element: <ProjectDetailPage />,
  },
  {
    key: "tasks",
    path: "/tasks",
    label: "任務",
    heading: "任務管理",
    showInSidebar: true,
    sidebarSection: "primary",
    element: <TasksPage />,
  },
  {
    key: "clients",
    path: "/clients",
    label: "客戶",
    heading: "客戶管理",
    showInSidebar: true,
    sidebarSection: "primary",
    element: <ClientsPage />,
  },
  {
    key: "files",
    path: "/files",
    label: "檔案",
    heading: "檔案",
    showInSidebar: false,
    element: <FilesPage />,
  },
  {
    key: "help",
    path: "/help",
    label: "說明",
    heading: "說明",
    showInSidebar: true,
    sidebarSection: "secondary",
    element: <HelpPage />,
  },
  {
    key: "invoices",
    path: "/invoices",
    label: "收款紀錄",
    heading: "收款管理",
    showInSidebar: true,
    sidebarSection: "primary",
    element: <InvoicesPage />,
  },
  {
    key: "calendar",
    path: "/calendar",
    label: "行事曆",
    heading: "行事曆",
    showInSidebar: false,
    element: <CalendarPage />,
  },
  {
    key: "reports",
    path: "/reports",
    label: "報表",
    heading: "報表",
    showInSidebar: true,
    sidebarSection: "secondary",
    element: <ReportsPage />,
  },
  {
    key: "settings",
    path: "/settings",
    label: "設定",
    heading: "設定",
    showInSidebar: false,
    element: <SettingsPage />,
  },
  {
    key: "not-found",
    path: "*",
    label: null,
    heading: "找不到頁面",
    showInSidebar: false,
    element: <NotFoundPage />,
  },
];

export const SIDEBAR_ROUTES = APP_ROUTES.filter((route) => route.showInSidebar);
export const PRIMARY_SIDEBAR_ROUTES = APP_ROUTES.filter(
  (r) => r.sidebarSection === "primary",
);
export const SECONDARY_SIDEBAR_ROUTES = APP_ROUTES.filter(
  (r) => r.sidebarSection === "secondary",
);
export const ROUTE_HEADING_CASES = APP_ROUTES.filter(
  (route) => route.path !== "*" && !route.path.includes(":"),
).map((route) => ({
  path: route.path,
  heading: route.heading,
}));
export const SIDEBAR_NAVIGATION_CASES = SIDEBAR_ROUTES.map((route) => ({
  label: route.label as string,
  heading: route.heading,
}));
