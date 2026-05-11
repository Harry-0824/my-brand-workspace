import { Route, Routes } from "react-router-dom";
import { DashboardContent } from "../components/dashboard/DashboardContent";
import { AppLayout } from "../layouts/AppLayout";
import { ClientsPage } from "../pages/ClientsPage";
import { InvoicesPage } from "../pages/InvoicesPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { TasksPage } from "../pages/TasksPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardContent />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Route>
    </Routes>
  );
}
