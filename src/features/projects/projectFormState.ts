import { type CreateProjectInput, type ProjectRecord } from "../../lib/projects";

export type ProjectFormState = CreateProjectInput;

export const initialFormState: ProjectFormState = {
  name: "",
  status: "active",
  description: "",
  client_name: "",
  start_date: "",
  due_date: "",
};

export function toFormState(project: ProjectRecord): ProjectFormState {
  return {
    name: project.name,
    status: project.status,
    description: project.description ?? "",
    client_name: project.client_name ?? "",
    start_date: project.start_date ?? "",
    due_date: project.due_date ?? "",
  };
}