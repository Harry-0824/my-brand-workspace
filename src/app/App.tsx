import { Route, Routes } from "react-router-dom";
import { DashboardContent } from "../components/dashboard/DashboardContent";
import { AppLayout } from "../layouts/AppLayout";
import { CalendarPage } from "../pages/CalendarPage";
import { ClientsPage } from "../pages/ClientsPage";
import { FilesPage } from "../pages/FilesPage";
import { HelpPage } from "../pages/HelpPage";
import { InvoicesPage } from "../pages/InvoicesPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TasksPage } from "../pages/TasksPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardContent />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
